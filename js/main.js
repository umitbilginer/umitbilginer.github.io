/* ============================================
   UMIT BILGINER — Website JavaScript
   DNA Canvas, Scroll Reveals, Stats Counter,
   Publication Filters, Mobile Nav
   ============================================ */

// ========== DNA HELIX CANVAS ==========
(function () {
  const canvas = document.getElementById('dna-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height, particles, time = 0;
  let isHeroVisible = true;
  let animationId = null;
  const PARTICLE_COUNT = 80;
  const ACCENT = '#10B981';
  const ACCENT_DIM = 'rgba(16, 185, 129, 0.15)';

  // Pause canvas when hero is off-screen (battery saving)
  const heroSection = document.getElementById('hero');
  const heroObserver = new IntersectionObserver((entries) => {
    isHeroVisible = entries[0].isIntersecting;
    if (isHeroVisible && !animationId) draw();
  }, { threshold: 0 });
  if (heroSection) heroObserver.observe(heroSection);

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        y: (i / PARTICLE_COUNT) * height * 1.4 - height * 0.2,
        phase: (i / PARTICLE_COUNT) * Math.PI * 6,
        radius: 2 + Math.random() * 2,
        speed: 0.3 + Math.random() * 0.3,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    time += 0.008;

    const centerX = width * 0.75;
    const amplitude = Math.min(width * 0.12, 120);

    // Draw connecting lines between strand pairs
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const y = p.y;
      const offset = Math.sin(p.phase + time * p.speed) * amplitude;
      const x1 = centerX + offset;
      const x2 = centerX - offset;

      // Depth factor for 3D feel
      const depth = (Math.sin(p.phase + time * p.speed) + 1) / 2;

      // Rungs (connecting lines)
      if (i % 3 === 0) {
        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.strokeStyle = `rgba(16, 185, 129, ${0.06 + depth * 0.06})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Strand 1 (front when depth > 0.5)
      const alpha1 = depth * 0.6 + 0.1;
      ctx.beginPath();
      ctx.arc(x1, y, p.radius * (0.5 + depth * 0.5), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(16, 185, 129, ${alpha1})`;
      ctx.fill();

      // Strand 2 (back when depth > 0.5)
      const alpha2 = (1 - depth) * 0.6 + 0.1;
      ctx.beginPath();
      ctx.arc(x2, y, p.radius * (1 - depth * 0.5), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(52, 211, 153, ${alpha2})`;
      ctx.fill();
    }

    // Draw faint vertical strand curves
    ctx.beginPath();
    ctx.strokeStyle = ACCENT_DIM;
    ctx.lineWidth = 1;
    for (let i = 0; i < particles.length - 1; i++) {
      const p = particles[i];
      const x = centerX + Math.sin(p.phase + time * p.speed) * amplitude;
      if (i === 0) ctx.moveTo(x, p.y);
      else ctx.lineTo(x, p.y);
    }
    ctx.stroke();

    ctx.beginPath();
    for (let i = 0; i < particles.length - 1; i++) {
      const p = particles[i];
      const x = centerX - Math.sin(p.phase + time * p.speed) * amplitude;
      if (i === 0) ctx.moveTo(x, p.y);
      else ctx.lineTo(x, p.y);
    }
    ctx.stroke();

    if (isHeroVisible) {
      animationId = requestAnimationFrame(draw);
    } else {
      animationId = null;
    }
  }

  window.addEventListener('resize', () => {
    resize();
    initParticles();
  });

  resize();
  initParticles();
  draw();
})();


// ========== NAVBAR SCROLL EFFECT ==========
(function () {
  const nav = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const scroll = window.scrollY;
    if (scroll > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = scroll;
  });
})();


// ========== MOBILE NAV TOGGLE ==========
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    links.classList.toggle('open');
  });

  // Close on link click
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      toggle.classList.remove('open');
      links.classList.remove('open');
    });
  });
})();


// ========== SCROLL REVEAL ==========
(function () {
  const reveals = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => observer.observe(el));
})();


// ========== STATS COUNTER ==========
(function () {
  const counters = document.querySelectorAll('.stat-number');
  let counted = false;

  function animateCounters() {
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      const duration = 2000;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);
        counter.textContent = current;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          const suffix = counter.getAttribute('data-suffix') || '';
          counter.textContent = target + suffix;
        }
      }

      requestAnimationFrame(update);
    });
  }

  const statsSection = document.getElementById('stats');
  if (!statsSection) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !counted) {
        counted = true;
        animateCounters();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(statsSection);
})();


// ========== PUBLICATION FILTERS ==========
(function () {
  const filters = document.querySelectorAll('.pub-filter');
  const cards = document.querySelectorAll('.pub-card');

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filters.forEach(f => f.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const year = card.getAttribute('data-year');
        const type = card.getAttribute('data-type');

        let show = false;
        if (filter === 'all') show = true;
        else if (filter === 'first') show = type === 'first';
        else show = year === filter;

        if (show) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          requestAnimationFrame(() => {
            card.style.transition = 'all 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
})();


// ========== ACTIVE NAV LINK HIGHLIGHT ==========
(function () {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.style.color = '#10B981';
          } else {
            link.style.color = '';
          }
        });
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '-80px 0px -50% 0px'
  });

  sections.forEach(s => observer.observe(s));
})();


// ========== SMOOTH SCROLL FOR ANCHOR LINKS ==========
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


// ========== PUBLICATION SHOW/HIDE (default 6) ==========
(function () {
  const cards = document.querySelectorAll('.pub-card');
  const toggle = document.getElementById('pub-toggle');
  if (!toggle || cards.length <= 6) return;

  let expanded = false;
  const INITIAL_COUNT = 6;

  function applyVisibility() {
    cards.forEach((card, i) => {
      if (!expanded && i >= INITIAL_COUNT && !card.classList.contains('hidden')) {
        card.style.display = 'none';
      } else if (!card.classList.contains('hidden')) {
        card.style.display = '';
      }
    });
    toggle.textContent = expanded
      ? 'Show fewer'
      : 'Show all ' + cards.length + ' publications';
  }

  applyVisibility();

  toggle.addEventListener('click', () => {
    expanded = !expanded;
    applyVisibility();
  });

  // Reset when filter is used
  document.querySelectorAll('.pub-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      expanded = true;
      toggle.style.display = 'none';
    });
  });

  // Show toggle again when "All" filter is clicked
  const allBtn = document.querySelector('[data-filter="all"]');
  if (allBtn) {
    allBtn.addEventListener('click', () => {
      expanded = false;
      toggle.style.display = '';
      applyVisibility();
    });
  }
})();
