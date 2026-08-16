/* Ümit Bilginer, colour-field redesign
   1. mobile nav (focus trap, Escape, focus restore)
   2. publications ledger (fetch, filter pills, collapse/expand)
   3. click-to-load YouTube facade                              */

(function () {
  "use strict";

  /* ---------- 1. mobile nav ---------- */

  var toggle = document.getElementById("nav-toggle");
  var menu = document.getElementById("nav-menu");
  var closeBtn = document.getElementById("nav-close");

  function menuIsOpen() {
    return menu && menu.classList.contains("is-open");
  }

  function openMenu() {
    menu.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    document.addEventListener("keydown", onMenuKeydown);
    var first = menu.querySelector("button, a");
    if (first) first.focus();
  }

  function closeMenu() {
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    document.removeEventListener("keydown", onMenuKeydown);
    toggle.focus();
  }

  function onMenuKeydown(e) {
    if (!menuIsOpen()) return;
    if (e.key === "Escape") {
      e.preventDefault();
      closeMenu();
      return;
    }
    if (e.key === "Tab") {
      var focusables = menu.querySelectorAll("button, a");
      if (!focusables.length) return;
      var firstEl = focusables[0];
      var lastEl = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    }
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      if (menuIsOpen()) { closeMenu(); } else { openMenu(); }
    });
    if (closeBtn) closeBtn.addEventListener("click", closeMenu);
    menu.addEventListener("click", function (e) {
      if (e.target.tagName === "A" && menuIsOpen()) closeMenu();
    });
  }

  /* ---------- 2. publications ledger ---------- */

  var SCHOLAR = "https://scholar.google.com/citations?user=y5osRVUAAAAJ";
  var COLLAPSED_COUNT = 8;

  var listEl = document.getElementById("pub-list");
  var filtersEl = document.getElementById("pub-filters");
  var toggleBtn = document.getElementById("pub-toggle");
  var countEl = document.getElementById("pub-count");

  /* six filters only; the full topic/species taxonomy remains in
     publications.json and can be resurfaced without data changes */
  var FILTERS = [
    { key: "all", label: "All" },
    { key: "first", label: "First author" },
    { key: "tp:methane", label: "Methane" },
    { key: "sp:cattle", label: "Cattle" },
    { key: "sp:smallrum", label: "Sheep and goats" },
    { key: "sp:poultry", label: "Poultry" }
  ];

  var pubs = [];
  var activeFilter = "all";
  var expanded = false;

  function matches(pub, filter) {
    if (filter === "all") return true;
    if (filter === "first") return !!pub.first_author;
    if (filter === "sp:smallrum") return (pub.species || []).indexOf("sheep") !== -1 || (pub.species || []).indexOf("goat") !== -1;
    if (filter.indexOf("sp:") === 0) return (pub.species || []).indexOf(filter.slice(3)) !== -1;
    if (filter.indexOf("tp:") === 0) return (pub.topics || []).indexOf(filter.slice(3)) !== -1;
    return true;
  }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function authorsHtml(pub) {
    return pub.authors.map(function (a, i) {
      var name = esc(a);
      return i === pub.self_index ? '<span class="self">' + name + "</span>" : name;
    }).join(", ");
  }

  function renderPubs() {
    if (!listEl) return;
    var filtered = pubs.filter(function (p) { return matches(p, activeFilter); });
    var visible = expanded ? filtered : filtered.slice(0, COLLAPSED_COUNT);

    var html = '<ol class="pubs__group">';
    var lastYear = null;
    visible.forEach(function (p) {
      var yearCell = p.year !== lastYear ? String(p.year) : "";
      lastYear = p.year;
      var title = p.url
        ? '<a href="' + esc(p.url) + '">' + esc(p.title) + "</a>"
        : esc(p.title);
      var detail = p.detail ? " " + esc(p.detail) : "";
      var cites = p.citations > 0
        ? " | " + p.citations + (p.citations === 1 ? " citation" : " citations")
        : "";
      var fa = p.first_author ? ' <span class="fa">First author</span>' : "";
      html += '<li class="pub">' +
        '<span class="pub__year">' + yearCell + "</span>" +
        "<div>" +
        '<p class="pub__title">' + title + "</p>" +
        '<p class="pub__meta"><span class="authors">' + authorsHtml(p) + "</span><br>" +
        '<span class="venue">' + esc(p.venue) + "</span>" + detail + cites + fa + "</p>" +
        "</div></li>";
    });
    html += "</ol>";

    if (!filtered.length) {
      html = '<p class="pubs__status">Nothing matches this filter. The full list is on <a href="' + SCHOLAR + '">Google Scholar</a>.</p>';
    }

    listEl.innerHTML = html;

    if (toggleBtn) {
      if (filtered.length > COLLAPSED_COUNT) {
        toggleBtn.hidden = false;
        toggleBtn.textContent = expanded ? "Show fewer" : "Show all " + filtered.length;
      } else {
        toggleBtn.hidden = true;
      }
    }
    if (countEl) {
      countEl.textContent = "Showing " + visible.length + " of " + pubs.length + " papers";
    }
  }

  function renderFilters() {
    if (!filtersEl) return;
    FILTERS.forEach(function (f) {
      var btn = document.createElement("button");
      btn.className = "pill";
      btn.type = "button";
      btn.textContent = f.label;
      btn.setAttribute("aria-pressed", f.key === activeFilter ? "true" : "false");
      btn.dataset.filter = f.key;
      btn.addEventListener("click", function () {
        activeFilter = f.key;
        var pills = filtersEl.querySelectorAll(".pill");
        for (var i = 0; i < pills.length; i++) {
          pills[i].setAttribute("aria-pressed", pills[i].dataset.filter === activeFilter ? "true" : "false");
        }
        renderPubs();
      });
      filtersEl.appendChild(btn);
    });
  }

  function pubsFailed() {
    if (!listEl) return;
    listEl.innerHTML = '<p class="pubs__status">The publication list could not be loaded here. ' +
      'The full, always-current list is on <a href="' + SCHOLAR + '">Google Scholar</a>: ' +
      "22 peer-reviewed papers, 156 citations, h-index 7.</p>";
    if (toggleBtn) toggleBtn.hidden = true;
    if (filtersEl) filtersEl.hidden = true;
  }

  if (listEl) {
    fetch("data/publications.json")
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(function (data) {
        if (!Array.isArray(data) || !data.length) throw new Error("empty");
        pubs = data.slice().sort(function (a, b) { return b.year - a.year; });
        renderFilters();
        renderPubs();
        if (toggleBtn) {
          toggleBtn.addEventListener("click", function () {
            expanded = !expanded;
            renderPubs();
            if (expanded === false) {
              document.getElementById("publications").scrollIntoView();
            }
          });
        }
      })
      .catch(pubsFailed);
  }

  /* ---------- 3. click-to-load video facade ---------- */

  var facades = document.querySelectorAll(".video-facade[data-video-id]");
  Array.prototype.forEach.call(facades, function (facade) {
    var id = facade.dataset.videoId;
    var title = facade.dataset.videoTitle || "Video";

    var btn = document.createElement("button");
    btn.type = "button";
    btn.setAttribute("aria-label", "Play video: " + title);

    var thumb = document.createElement("img");
    thumb.src = "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg";
    thumb.alt = "";
    /* eager: it is the page's only third-party request, and a facade
       whose thumbnail never painted reads as an empty box */
    thumb.loading = "eager";
    thumb.decoding = "async";
    thumb.width = 480;
    thumb.height = 360;
    /* if the thumbnail fails, fall back to the plain field-lo panel
       with the bordered play chip; never a broken-image glyph */
    thumb.addEventListener("error", function () {
      if (thumb.parentNode) thumb.parentNode.removeChild(thumb);
    });

    var play = document.createElement("span");
    play.className = "play";
    play.textContent = "▸ Play recording";

    btn.appendChild(thumb);
    btn.appendChild(play);
    facade.appendChild(btn);

    btn.addEventListener("click", function () {
      var iframe = document.createElement("iframe");
      iframe.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1";
      iframe.title = title;
      iframe.allow = "autoplay; encrypted-media; picture-in-picture";
      iframe.setAttribute("allowfullscreen", "");
      /* the button (and its play affordance) is removed entirely,
         so nothing overlays the live iframe */
      facade.replaceChild(iframe, btn);
      iframe.focus();
    });
  });

})();
