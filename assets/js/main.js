// Highlight active nav link based on current page
document.addEventListener('DOMContentLoaded', function () {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a');
  const nav = document.querySelector('nav');
  const navToggle = document.querySelector('.nav-toggle');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobileViewport = window.matchMedia('(max-width: 900px)').matches;
  const canHoverFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.style.color = 'var(--white)';
      link.style.background = 'rgba(255,255,255,0.06)';
    }
  });

  if (nav) {
    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    scrollProgress.setAttribute('aria-hidden', 'true');
    document.body.appendChild(scrollProgress);

    function updateNavState() {
      const scrollY = window.scrollY;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(scrollY / scrollable, 1) : 0;
      nav.classList.toggle('nav-scrolled', scrollY > 12);
      scrollProgress.style.setProperty('--scroll-progress', progress);
    }

    updateNavState();
    window.addEventListener('scroll', updateNavState, { passive: true });
  }

  if (!reduceMotion) {
    const fadeSelectors = [
      '.page-offset > section',
      '.page-offset > .page-hero',
      '.section-tag',
      'h2.display',
      '.lead',
      '.pain-card',
      '.mini-offer-card',
      '.proof-stat',
      '.process-step',
      '.service-block',
      '.feature-item',
      '.scope-box',
      '.pricing-card',
      '.support-card',
      '.case-card-full',
      '.about-photo-placeholder',
      '.about-content p',
      '.credential',
      '.value-card',
      '.ms-logo-card',
      '.contact-method',
      '.booking-embed',
      '.legal-content > *'
    ];
    const fadeItems = Array.from(document.querySelectorAll(fadeSelectors.join(',')))
      .filter(function (item, index, items) {
        return !item.closest('footer') && items.indexOf(item) === index;
      });

    fadeItems.forEach(function (item, index) {
      item.classList.add('scroll-fade');
      item.style.setProperty('--fade-delay', `${Math.min(index % 6, 5) * 45}ms`);
    });

    if (isMobileViewport) {
      fadeItems.forEach(function (item) {
        item.classList.add('is-visible');
      });
    } else if ('IntersectionObserver' in window) {
      const fadeObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

      fadeItems.forEach(function (item) {
        fadeObserver.observe(item);
      });
    } else {
      fadeItems.forEach(function (item) {
        item.classList.add('is-visible');
      });
    }

    const hero = document.querySelector('.hero');
    if (hero) {
      hero.addEventListener('pointermove', function (event) {
        const rect = hero.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5).toFixed(3);
        const y = ((event.clientY - rect.top) / rect.height - 0.5).toFixed(3);
        hero.style.setProperty('--pointer-x', x);
        hero.style.setProperty('--pointer-y', y);
      });

      hero.addEventListener('pointerleave', function () {
        hero.style.setProperty('--pointer-x', 0);
        hero.style.setProperty('--pointer-y', 0);
      });
    }

    const scrollMorphHero = document.querySelector('.scroll-morph-hero');
    if (scrollMorphHero) {
      const morphIcons = Array.from(scrollMorphHero.querySelectorAll('.morph-icon'));

      function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
      }

      function smoothstep(edge0, edge1, value) {
        const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
        return t * t * (3 - 2 * t);
      }

      function unitToPixels(value) {
        const raw = String(value || '0').trim();
        const numeric = parseFloat(raw);
        if (Number.isNaN(numeric)) return 0;
        if (raw.endsWith('vw')) return window.innerWidth * numeric / 100;
        if (raw.endsWith('vh')) return window.innerHeight * numeric / 100;
        if (raw.endsWith('rem')) return numeric * parseFloat(getComputedStyle(document.documentElement).fontSize);
        return numeric;
      }

      const iconTargets = morphIcons.map(function (icon) {
        const style = getComputedStyle(icon);
        return {
          icon,
          angle: parseFloat(style.getPropertyValue('--angle')) || 0,
          radius: style.getPropertyValue('--radius'),
          arcX: style.getPropertyValue('--arc-x'),
          arcY: style.getPropertyValue('--arc-y')
        };
      });

      let morphFrame = null;

      function updateScrollMorph() {
        morphFrame = null;
        const isMorphMobile = window.matchMedia('(max-width: 900px)').matches;
        const isMorphSmall = window.matchMedia('(max-width: 640px)').matches;
        const prefersStaticMorph = reduceMotion;
        const rect = scrollMorphHero.getBoundingClientRect();
        const travel = Math.max(rect.height - window.innerHeight, 1);
        const progress = prefersStaticMorph ? 1 : clamp(-rect.top / travel, 0, 1);
        const reveal = prefersStaticMorph ? 1 : smoothstep(0.02, 0.16, progress);
        const spread = prefersStaticMorph ? 1 : smoothstep(isMorphMobile ? 0.1 : 0.18, isMorphMobile ? 0.44 : 0.5, progress);
        const close = prefersStaticMorph ? 0 : smoothstep(isMorphMobile ? 0.58 : 0.64, isMorphMobile ? 0.92 : 0.94, progress);
        const easedProgress = smoothstep(0, 1, progress);

        scrollMorphHero.style.setProperty('--morph-grid-y', `${(-34 * easedProgress).toFixed(1)}px`);
        scrollMorphHero.style.setProperty('--morph-copy-y', `${(-window.innerHeight * 0.08 * spread).toFixed(1)}px`);
        scrollMorphHero.style.setProperty('--morph-copy-opacity', clamp(1 - close * 0.92, 0, 1).toFixed(3));
        scrollMorphHero.style.setProperty('--morph-core-scale', (0.94 + close * 0.1).toFixed(3));
        scrollMorphHero.style.setProperty('--morph-ring-opacity', (0.1 + close * 0.28).toFixed(3));
        scrollMorphHero.style.setProperty('--morph-cue-opacity', clamp(1 - close, 0, 1).toFixed(3));

        iconTargets.forEach(function (target, index) {
          if (isMorphMobile) {
            const visibleCount = isMorphSmall ? 10 : 12;
            if (index >= visibleCount) {
              target.icon.style.display = 'none';
              return;
            }

            target.icon.style.display = 'grid';
            const circleAngle = ((index / visibleCount) * 360 - 90) * Math.PI / 180;
            const circleRadiusX = Math.min(window.innerWidth * 0.34, 150);
            const circleRadiusY = isMorphSmall ? 98 : 118;
            const circleX = Math.cos(circleAngle) * circleRadiusX;
            const circleY = Math.sin(circleAngle) * circleRadiusY + (isMorphSmall ? 64 : 72);

            const arcAngle = (-102 + (index / Math.max(visibleCount - 1, 1)) * 204) * Math.PI / 180;
            const arcRadiusX = Math.min(window.innerWidth * 0.43, 180);
            const arcRadiusY = isMorphSmall ? 132 : 154;
            const arcX = Math.cos(arcAngle) * arcRadiusX;
            const arcY = Math.sin(arcAngle) * arcRadiusY + (isMorphSmall ? 90 : 104);

            const openX = circleX + (arcX - circleX) * spread;
            const openY = circleY + (arcY - circleY) * spread;
            const finalX = openX * (1 - close);
            const finalY = openY * (1 - close);
            const mobileScale = Math.max(0.12, ((isMorphSmall ? 0.78 : 0.86) * reveal) - close * 0.42);
            const mobileOpacity = clamp((reveal * 1.05) - close * 0.72, 0, 1);

            target.icon.style.setProperty('--morph-x', `${finalX.toFixed(1)}px`);
            target.icon.style.setProperty('--morph-y', `${finalY.toFixed(1)}px`);
            target.icon.style.setProperty('--morph-scale', mobileScale.toFixed(3));
            target.icon.style.setProperty('--morph-opacity', mobileOpacity.toFixed(3));
            target.icon.style.setProperty('--morph-rotate', `${((-10 + index * 2) * (1 - close)).toFixed(2)}deg`);
            return;
          }

          target.icon.style.display = 'grid';
          const angleRad = target.angle * Math.PI / 180;
          const radius = unitToPixels(target.radius);
          const circleX = Math.cos(angleRad) * radius;
          const circleY = Math.sin(angleRad) * radius;
          const arcX = unitToPixels(target.arcX);
          const arcY = unitToPixels(target.arcY);
          const openX = circleX + (arcX - circleX) * spread;
          const openY = circleY + (arcY - circleY) * spread;
          const finalX = openX * (1 - close);
          const finalY = openY * (1 - close);
          const rotate = (target.angle * 0.08) + (spread * (index % 2 ? -6 : 6)) - (close * (target.angle * 0.08));
          const scale = Math.max(0.08, (0.18 + reveal * 0.92) - close * 0.52);
          const opacity = clamp((reveal * 1.05) - (close * 0.72), 0, 1);

          target.icon.style.setProperty('--morph-x', `${finalX.toFixed(1)}px`);
          target.icon.style.setProperty('--morph-y', `${finalY.toFixed(1)}px`);
          target.icon.style.setProperty('--morph-scale', scale.toFixed(3));
          target.icon.style.setProperty('--morph-opacity', opacity.toFixed(3));
          target.icon.style.setProperty('--morph-rotate', `${rotate.toFixed(2)}deg`);
        });
      }

      function requestScrollMorphUpdate() {
        if (morphFrame) return;
        morphFrame = window.requestAnimationFrame(updateScrollMorph);
      }

      updateScrollMorph();
      window.addEventListener('scroll', requestScrollMorphUpdate, { passive: true });
      window.addEventListener('resize', requestScrollMorphUpdate);
    }

    if (canHoverFine && !isMobileViewport) {
      const mouseAura = document.createElement('div');
      mouseAura.className = 'mouse-aura';
      mouseAura.setAttribute('aria-hidden', 'true');
      document.body.appendChild(mouseAura);
      const auraTargets = document.querySelectorAll('.hero, .page-hero');

      let auraX = window.innerWidth / 2;
      let auraY = window.innerHeight / 2;
      let targetX = auraX;
      let targetY = auraY;

      function animateAura() {
        auraX += (targetX - auraX) * 0.16;
        auraY += (targetY - auraY) * 0.16;
        mouseAura.style.setProperty('--aura-x', `${auraX}px`);
        mouseAura.style.setProperty('--aura-y', `${auraY}px`);
        window.requestAnimationFrame(animateAura);
      }

      auraTargets.forEach(function (target) {
        target.addEventListener('pointermove', function (event) {
          targetX = event.clientX;
          targetY = event.clientY;
          mouseAura.classList.add('is-active');
        }, { passive: true });

        target.addEventListener('pointerleave', function () {
          mouseAura.classList.remove('is-active');
          mouseAura.classList.remove('is-over-target');
        });
      });

      document.querySelectorAll('.hero a, .hero button, .page-hero a, .page-hero button').forEach(function (item) {
        item.addEventListener('pointerenter', function () {
          mouseAura.classList.add('is-over-target');
        });

        item.addEventListener('pointerleave', function () {
          mouseAura.classList.remove('is-over-target');
        });
      });

      animateAura();
    }

    function createBurst(event, target) {
      const rect = target.getBoundingClientRect();
      const burst = document.createElement('span');
      burst.className = 'motion-burst';
      burst.setAttribute('aria-hidden', 'true');
      burst.style.left = `${event.clientX - rect.left}px`;
      burst.style.top = `${event.clientY - rect.top}px`;

      for (let i = 0; i < 10; i += 1) {
        const spark = document.createElement('span');
        const angle = (i / 10) * Math.PI * 2;
        const distance = 26 + ((i % 4) * 8);
        spark.style.setProperty('--spark-x', `${Math.cos(angle) * distance}px`);
        spark.style.setProperty('--spark-y', `${Math.sin(angle) * distance}px`);
        spark.style.setProperty('--spark-delay', `${i * 16}ms`);
        burst.appendChild(spark);
      }

      target.appendChild(burst);
      window.setTimeout(function () {
        burst.remove();
      }, 760);
    }

    document.querySelectorAll('.case-card-full, .case-card-header h3, .hero h1, .page-hero h1, h2.display, .service-block h3, .pricing-card h3').forEach(function (item) {
      item.addEventListener('click', function (event) {
        createBurst(event, item);
      });
    });
  } else {
    document.body.classList.add('reduce-motion');
  }

  if (!nav || !navToggle) return;

  function closeMenu() {
    nav.classList.remove('nav-open');
    document.body.classList.remove('nav-lock');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open navigation menu');
  }

  navToggle.addEventListener('click', function () {
    const isOpen = nav.classList.toggle('nav-open');
    document.body.classList.toggle('nav-lock', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    navToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeMenu();
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 980) closeMenu();
  });

  const lazyFrames = document.querySelectorAll('iframe[data-src]');

  function loadFrame(frame) {
    if (!frame || frame.src) return;
    frame.src = frame.dataset.src;
    frame.removeAttribute('data-src');
  }

  if (lazyFrames.length && 'IntersectionObserver' in window) {
    const frameObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        loadFrame(entry.target);
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '200px 0px' });

    lazyFrames.forEach(function (frame) {
      frameObserver.observe(frame);
    });
  } else {
    lazyFrames.forEach(loadFrame);
  }
});
