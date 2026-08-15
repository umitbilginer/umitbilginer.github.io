/* umitbilginer.github.io — redesign 2026. No dependencies. */
(function () {
  'use strict';
  document.documentElement.classList.add('js');
  var SVGNS = 'http://www.w3.org/2000/svg';

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('nav-menu');
  function setNav(open) {
    if (!toggle || !menu) return;
    toggle.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('open', open);
    document.body.classList.toggle('nav-open', open);
  }
  if (toggle && menu) {
    toggle.addEventListener('click', function () { setNav(menu.classList.contains('open') ? false : true); });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a') || e.target.closest('.nav-close')) setNav(false);
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setNav(false); });
  }

  /* ---------- Reveal-once (motion users only; CSS gates visuals) ---------- */
  if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.2 });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
    // Insurance: if the observer never fires (odd embedding contexts),
    // nothing may stay hidden. The old site shipped that bug; never again.
    setTimeout(function () {
      document.querySelectorAll('.reveal:not(.in)').forEach(function (el) { el.classList.add('in'); });
    }, 3000);
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Video facades (click-to-load) ---------- */
  document.querySelectorAll('.video-slot').forEach(function (slot) {
    var id = slot.dataset.videoId, title = slot.dataset.title || 'Video';
    var aspect = slot.dataset.aspect === '9x16' ? 'facade-9x16' : 'facade-16x9';
    var btn = document.createElement('button');
    btn.className = 'facade ' + aspect;
    btn.setAttribute('aria-label', 'Play video: ' + title);
    var img = document.createElement('img');
    img.src = 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg';
    img.alt = ''; img.loading = 'lazy'; img.width = 480; img.height = 360;
    btn.appendChild(img);
    slot.insertBefore(btn, slot.firstChild);
    btn.addEventListener('click', function () {
      var wrap = document.createElement('div');
      wrap.className = 'facade ' + aspect;
      wrap.style.cursor = 'default';
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1';
      f.title = title;
      f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      f.allowFullscreen = true;
      wrap.appendChild(f);
      slot.replaceChild(wrap, btn);
    });
  });

  /* ---------- Data-driven pieces ---------- */
  function getJSON(url) { return fetch(url).then(function (r) { if (!r.ok) throw new Error(url + ' ' + r.status); return r.json(); }); }
  var base = document.body.dataset.base || '';

  Promise.all([getJSON(base + 'data/genome.json'), getJSON(base + 'data/signals.json')])
    .then(function (res) { renderGenomeGraphics(res[0], res[1]); })
    .catch(function (e) { console.error('signal map:', e); });

  getJSON(base + 'data/profile.json').then(function (p) {
    var m = p.metrics;
    var el;
    if ((el = document.getElementById('m-pubs'))) el.textContent = m.publications;
    if ((el = document.getElementById('m-cites'))) el.textContent = m.citations;
    if ((el = document.getElementById('m-h'))) el.textContent = m.h_index;
  }).catch(function () {});

  if (document.getElementById('pub-ledger')) {
    getJSON(base + 'data/publications.json').then(renderPublications)
      .catch(function (e) { console.error('publications:', e); });
  }

  if (document.getElementById('cv-content')) {
    Promise.all([getJSON(base + 'data/cv.json'), getJSON(base + 'data/publications.json')])
      .then(function (res) { renderCV(res[0], res[1]); })
      .catch(function (e) { console.error('cv:', e); });
  }

  function renderCV(cv, pubs) {
    function esc(s) { var d = document.createElement('span'); d.textContent = s; return d.innerHTML; }
    var h = '';
    h += '<section class="cv-section"><h2>Education</h2>';
    cv.education.forEach(function (e) {
      h += '<div class="cv-entry"><span class="when">' + esc(e.period) + '</span><div class="what"><strong>' + esc(e.degree) + '</strong><div class="org">' + esc(e.org) + '</div>' + (e.note ? '<div class="note">' + esc(e.note) + '</div>' : '') + '</div></div>';
    });
    h += '</section><section class="cv-section"><h2>Positions &amp; internships</h2>';
    cv.positions.forEach(function (p) {
      h += '<div class="cv-entry"><span class="when">' + esc(p.period) + '</span><div class="what"><strong>' + esc(p.title) + '</strong>' + (p.industry ? ' <span class="tl-tag">Industry</span>' : '') + '<div class="org">' + esc(p.org) + '</div>' + (p.note ? '<div class="note">' + esc(p.note) + '</div>' : '') + '</div></div>';
    });
    h += '</section><section class="cv-section"><h2>Publications (' + pubs.length + ')</h2><ol class="cv-pubs">';
    pubs.forEach(function (p) {
      var authors = p.authors.map(function (a, i) { return i === p.self_index ? '<span class="self">' + esc(a) + '</span>' : esc(a); }).join(', ');
      var cite = authors + ' (' + p.year + '). ' + esc(p.title) + '. <em>' + esc(p.venue) + '</em>' + (p.detail ? ', ' + esc(p.detail) : '') + '.';
      if (p.url) cite += ' <a href="' + esc(p.url) + '">link</a>';
      h += '<li>' + cite + '</li>';
    });
    h += '</ol></section><section class="cv-section"><h2>Talks</h2>';
    cv.talks.forEach(function (t) {
      h += '<div class="cv-entry"><span class="when">' + t.year + '</span><div class="what"><strong>' + esc(t.title) + '</strong><div class="note">' + esc(t.venue) + (t.url ? ' — <a href="' + esc(t.url) + '">' + esc(t.url_label || 'link') + '</a>' : '') + '</div></div></div>';
    });
    h += '</section><section class="cv-section"><h2>Awards &amp; funding</h2>';
    cv.awards.forEach(function (a) {
      h += '<div class="cv-entry"><span class="when">' + a.year + '</span><div class="what"><strong>' + esc(a.title) + '</strong>' + (a.note ? '<div class="note">' + esc(a.note) + '</div>' : '') + '</div></div>';
    });
    h += '</section><section class="cv-section"><h2>Skills</h2>';
    Object.keys(cv.skills).forEach(function (k) {
      h += '<div class="cv-skill-line"><strong>' + esc(k) + '</strong> — ' + esc(cv.skills[k]) + '</div>';
    });
    h += '<div class="cv-skill-line"><strong>Languages</strong> — ' + cv.languages.map(esc).join(' · ') + '</div></section>';
    document.getElementById('cv-content').innerHTML = h;
  }

  /* ---------- Signal map, dividers, footer skyline ---------- */
  function svgEl(tag, attrs, parent) {
    var el = document.createElementNS(SVGNS, tag);
    for (var k in attrs) el.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(el);
    return el;
  }

  function renderGenomeGraphics(genome, signals) {
    var lens = genome.autosomes, total = 0, starts = {}, c;
    for (c = 1; c <= 29; c++) total += lens[c];
    var acc = 0;
    for (c = 1; c <= 29; c++) { starts[c] = acc; acc += lens[c]; }
    function fx(chr, pos) { return (starts[chr] + pos) / total; }

    var snps = signals.snps.map(function (s) {
      return { x: fx(s.chr, s.pos), gene: s.gene, logp: s.logp };
    });

    /* Hero map — drawn at the container's real pixel width, redrawn on resize */
    var host = document.getElementById('signal-map');
    function drawHeroMap() {
      var W = Math.max(host.clientWidth || document.documentElement.clientWidth, 320);
      var small = W < 768;
      var H = small ? 190 : 300, L = small ? 10 : 24, R = L, plotW = W - L - R;
      var baseY = H - (small ? 42 : 62), topY = small ? 30 : 88, maxP = 10.5;
      var y = function (p) { return baseY - (p / maxP) * (baseY - topY); };
      var svg = svgEl('svg', { viewBox: '0 0 ' + W + ' ' + H, width: W, height: H, role: 'presentation', 'aria-hidden': 'true' });

      for (c = 1; c <= 29; c++) {
        var midX = L + ((starts[c] + lens[c] / 2) / total) * plotW;
        var bX = L + (starts[c] / total) * plotW;
        if (c > 1) svgEl('line', { x1: bX, y1: baseY - 4, x2: bX, y2: baseY + 4, 'class': 'chr-tick' }, svg);
        var lab = svgEl('text', { x: midX, y: baseY + 20, 'text-anchor': 'middle', 'class': 'chr-label' + (c % 2 === 0 ? ' alt' : '') }, svg);
        lab.textContent = c;
      }
      svgEl('line', { x1: L, y1: baseY, x2: W - R, y2: baseY, 'class': 'baseline' }, svg);
      svgEl('line', { x1: L, y1: y(signals.context.genomewide_threshold), x2: W - R, y2: y(signals.context.genomewide_threshold), 'class': 'threshold' }, svg);

      // gene labels: greedy tier assignment so labels never collide
      var sorted = snps.slice().sort(function (a, b) { return a.x - b.x; });
      var tierEnds = [];
      sorted.forEach(function (s, i) {
        var px = L + s.x * plotW;
        var w = s.gene.length * 7.4 + 14;
        var t = 0;
        while (t < tierEnds.length && px - w / 2 < tierEnds[t] + 6) t++;
        tierEnds[t] = px + w / 2;
        s.px = px; s.tier = t; s.order = i;
      });
      sorted.forEach(function (s) {
        var capY = y(s.logp);
        var labelY = (small ? 14 : 30) + s.tier * 17;
        var g = svgEl('g', {}, svg);
        var stem = svgEl('line', { x1: s.px, y1: baseY, x2: s.px, y2: capY, 'class': 'stem' }, g);
        stem.style.setProperty('--i', s.order);
        var cap = svgEl('circle', { cx: s.px, cy: capY, r: small ? 3 : 4, 'class': 'cap' }, g);
        cap.style.setProperty('--i', s.order);
        if (labelY + 10 < capY - 8) {
          var lead = svgEl('line', { x1: s.px, y1: labelY + 6, x2: s.px, y2: capY - 7, 'class': 'leader' }, g);
          lead.style.setProperty('--i', s.order);
        }
        var t2 = svgEl('text', { x: s.px, y: labelY, 'text-anchor': 'middle', 'class': 'gene-label' }, g);
        t2.style.setProperty('--i', s.order);
        t2.textContent = s.gene;
      });
      svgEl('line', { x1: 0, y1: H - 1.5, x2: W, y2: H - 1.5, 'class': 'horizon' }, svg);
      host.textContent = '';
      host.appendChild(svg);
    }
    if (host) {
      drawHeroMap();
      setTimeout(function () { host.classList.add('settled'); }, 1600);
      var lastW = host.clientWidth, rT;
      window.addEventListener('resize', function () {
        clearTimeout(rT);
        rT = setTimeout(function () {
          if (host.clientWidth !== lastW) { lastW = host.clientWidth; drawHeroMap(); }
        }, 150);
      });
    }

    /* SNP-tick dividers */
    document.querySelectorAll('[data-divider]').forEach(function (d) {
      var svg2 = svgEl('svg', { viewBox: '0 0 1440 24', preserveAspectRatio: 'none', 'aria-hidden': 'true' });
      svgEl('line', { x1: 0, y1: 22, x2: 1440, y2: 22, 'class': 'base' }, svg2);
      snps.forEach(function (s) {
        svgEl('line', { x1: 24 + s.x * 1392, y1: 22 - (s.logp / 10.5) * 17, x2: 24 + s.x * 1392, y2: 22 }, svg2);
      });
      d.appendChild(svg2);
    });

    /* Footer skyline (mirrored, 60px, on the band's top edge) */
    document.querySelectorAll('[data-skyline]').forEach(function (d) {
      var svg3 = svgEl('svg', { viewBox: '0 0 1440 60', preserveAspectRatio: 'none', 'aria-hidden': 'true' });
      snps.forEach(function (s) {
        var px = 24 + s.x * 1392, h = (s.logp / 10.5) * 42;
        svgEl('line', { x1: px, y1: 58, x2: px, y2: 58 - h, 'class': 'stem' }, svg3);
        svgEl('circle', { cx: px, cy: 58 - h, r: 3, 'class': 'cap' }, svg3);
      });
      svgEl('line', { x1: 0, y1: 58.5, x2: 1440, y2: 58.5, 'class': 'base' }, svg3);
      d.appendChild(svg3);
    });
  }

  /* ---------- Publications ledger ---------- */
  var GLYPHS = {
    cattle: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 5c-1.5 0-2-1.5-2-2.5C2.5 3 3.5 3 4.5 4h11C16.5 3 17.5 3 19 2.5c0 1-.5 2.5-2 2.5l-1 3v5l-1.5 4h-2l.5-4h-6l.5 4h-2L4 13V8L3 5z"/></svg>',
    sheep: '<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="7" cy="8" r="4.5"/><circle cx="12" cy="7" r="3.5"/><circle cx="14.5" cy="10" r="3"/><path d="M6 12.5V17M13 12.5V17"/></svg>',
    goat: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6 3C5 1.5 3.5 1.5 2.5 2c1 .5 1.5 1.5 2 3L6 8v6M6 8h7l3 3v6M13 8c1-2 1.5-4 3.5-5-2-.5-3.5.5-4.5 2"/></svg>',
    poultry: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 10c0-3 2-5 5-5s5 2 5 5-2 5-5 5H5l1.5-2.5L5 10zM10 5c0-1.5 1-2.5 2-3l.5 2M8 15v3M12 15v3"/></svg>',
    quail: '<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="11" r="5"/><circle cx="13" cy="6" r="2.5"/><path d="M14 3.5l1-1.5M8 16v2.5M12 16v2.5"/></svg>'
  };
  var FILTERS = [
    { key: 'all', label: 'All 22', test: function () { return true; } },
    { key: 'first', label: 'First author', test: function (p) { return p.first_author; } },
    { key: 'cattle', label: 'Cattle', test: function (p) { return p.species.indexOf('cattle') > -1; } },
    { key: 'sheep', label: 'Sheep', test: function (p) { return p.species.indexOf('sheep') > -1; } },
    { key: 'goat', label: 'Goat', test: function (p) { return p.species.indexOf('goat') > -1; } },
    { key: 'poultry', label: 'Poultry', test: function (p) { return p.species.indexOf('poultry') > -1; } },
    { key: 'gwas', label: 'GWAS & signatures', test: function (p) { return p.topics.indexOf('gwas') > -1; } },
    { key: 'popgen', label: 'Diversity & popgen', test: function (p) { return p.topics.indexOf('popgen') > -1; } },
    { key: 'ml', label: 'Machine learning', test: function (p) { return p.topics.indexOf('ml') > -1; } },
    { key: 'review', label: 'Reviews', test: function (p) { return p.topics.indexOf('review') > -1; } }
  ];
  var COLLAPSED = 7;

  function renderPublications(pubs) {
    var ledger = document.getElementById('pub-ledger');
    var filterHost = document.getElementById('pub-filters');
    var toggleBtn = document.getElementById('pub-toggle');
    var state = { filter: 'all', expanded: false };

    FILTERS.forEach(function (f) {
      if (!pubs.some(f.test)) return; // never ship an empty pill
      var b = document.createElement('button');
      b.className = 'pub-filter';
      b.textContent = f.key === 'all' ? 'All ' + pubs.length : f.label;
      b.setAttribute('aria-pressed', String(f.key === state.filter));
      b.dataset.key = f.key;
      b.addEventListener('click', function () {
        state.filter = f.key; // a filtered view always shows its full result set;
        draw();               // "All" stays collapsed until the user hits Show all
      });
      filterHost.appendChild(b);
    });

    toggleBtn.addEventListener('click', function () { state.expanded = true; draw(); });

    function esc(s) { var d = document.createElement('span'); d.textContent = s; return d.innerHTML; }

    function draw() {
      filterHost.querySelectorAll('.pub-filter').forEach(function (b) {
        b.setAttribute('aria-pressed', String(b.dataset.key === state.filter));
      });
      var f = FILTERS.filter(function (x) { return x.key === state.filter; })[0] || FILTERS[0];
      var list = pubs.filter(f.test);
      var truncated = state.filter === 'all' && !state.expanded && list.length > COLLAPSED;
      var shown = truncated ? list.slice(0, COLLAPSED) : list;

      var html = '', lastYear = null;
      if (!shown.length) {
        html = '<p class="pub-empty">// no papers match this filter — yet.</p>';
      }
      shown.forEach(function (p) {
        var yearCell = p.year !== lastYear ? '<span class="pub-year">' + p.year + '</span>' : '';
        lastYear = p.year;
        var authors = p.authors.map(function (a, i) {
          return i === p.self_index ? '<span class="self">' + esc(a) + '</span>' : esc(a);
        }).join(', ');
        var venue = '<em>' + esc(p.venue) + '</em>' + (p.detail ? ' · ' + esc(p.detail) : '') +
          (p.citations > 0 ? ' <span class="pub-cites">· ' + p.citations + (p.citations === 1 ? ' citation' : ' citations') + '</span>' : '');
        var title = p.url
          ? '<a class="pub-title-link" href="' + esc(p.url) + '" target="_blank" rel="noopener">' + esc(p.title) + '</a>'
          : '<span class="pub-title-link">' + esc(p.title) + '</span>';
        var glyphs = p.species.slice(0, 2).map(function (sp) {
          return '<span class="pub-glyph" title="' + sp + '">' + (GLYPHS[sp] || '') + '</span>';
        }).join('');
        var arrow = p.url ? '<a class="pub-arrow" href="' + esc(p.url) + '" target="_blank" rel="noopener" aria-label="Open: ' + esc(p.title) + '">↗</a>' : '';
        html += '<article class="pub-row">' +
          '<div class="pub-rail">' + yearCell + (p.first_author ? '<span class="pub-first">1st</span>' : '') + '</div>' +
          '<div><h3 style="font-size:inherit;font-family:inherit;font-weight:inherit;display:inline">' + title + '</h3>' +
          '<p class="pub-authors">' + authors + '</p>' +
          '<p class="pub-venue">' + venue + '</p></div>' +
          '<div class="pub-side">' + glyphs + arrow + '</div></article>';
      });
      ledger.innerHTML = html;
      toggleBtn.hidden = !truncated;
      toggleBtn.textContent = 'Show all ' + list.length;
      var count = document.getElementById('pubs-count');
      if (count) count.textContent = (state.filter === 'all' ? list.length + ' papers' : list.length + ' of ' + pubs.length + ' papers');
    }
    draw();
  }
})();
