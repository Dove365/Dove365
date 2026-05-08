// Highlight active nav link based on current page
document.addEventListener('DOMContentLoaded', function () {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a');
  const nav = document.querySelector('nav');
  const navToggle = document.querySelector('.nav-toggle');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobileViewport = window.matchMedia('(max-width: 900px)').matches;
  const isCompactViewport = window.matchMedia('(max-width: 1100px), (pointer: coarse)').matches;
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

    if (isCompactViewport) {
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
      const morphCore = scrollMorphHero.querySelector('.morph-core');
      const morphStage = scrollMorphHero.querySelector('.scroll-morph-stage');

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

      function iconScatter(index, isMobile) {
        const horizontal = Math.sin((index + 1) * 2.41) * (isMobile ? 22 : 58);
        const vertical = Math.cos((index + 1) * 1.73) * (isMobile ? 38 : 82);
        return { x: horizontal, y: vertical };
      }

      function floatingPoint(index, isMobile, alternate) {
        const desktopPoints = [
          [-42, -24], [-29, 31], [-12, -42], [9, 25], [28, -18], [36, 24],
          [-46, 7], [-22, 57], [2, 45], [22, 61], [40, -50], [-36, -54],
          [-3, 18], [16, -62], [35, 8], [-12, 68], [48, 55], [-49, 48],
          [51, -4], [12, 73]
        ];
        const desktopAlt = [
          [-35, 48], [-45, -36], [-19, -58], [4, 62], [24, 35], [42, 8],
          [-31, 2], [-6, 28], [15, -37], [34, 55], [44, -62], [-43, 66],
          [4, -34], [25, -8], [39, 23], [-20, 72], [50, 43], [-52, 12],
          [43, 66], [-5, -48]
        ];
        const mobilePoints = [
          [-42, -43], [-18, -50], [9, -46], [38, -38], [-35, -18],
          [-6, -25], [24, -16], [43, 2], [-42, 12], [-18, 4],
          [8, 10], [34, 22], [-36, 36], [-10, 43], [18, 39],
          [42, 48], [-27, 58], [2, 61], [29, 63], [0, -2]
        ];
        const mobileAlt = [
          [-38, 4], [-28, -30], [-4, -40], [24, -30], [42, -12],
          [-44, 28], [-18, 20], [9, 31], [36, 42], [-32, -48],
          [-7, -14], [18, -5], [43, 15], [-41, 50], [-13, 55],
          [14, 50], [39, 60], [-25, 7], [4, 3], [28, 10]
        ];
        const points = isMobile ? (alternate ? mobileAlt : mobilePoints) : (alternate ? desktopAlt : desktopPoints);
        const point = points[index % points.length];
        const width = window.innerWidth * (isMobile ? 0.78 : 0.82);
        const height = window.innerHeight * (isMobile ? 0.64 : 0.68);
        return {
          x: (point[0] / 100) * width,
          y: (point[1] / 100) * height
        };
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
        const copyFade = prefersStaticMorph ? 0 : smoothstep(isMorphMobile ? 0.18 : 0.22, isMorphMobile ? 0.4 : 0.46, progress);
        const coreReveal = prefersStaticMorph ? 1 : smoothstep(isMorphMobile ? 0.34 : 0.4, isMorphMobile ? 0.54 : 0.58, progress);
        const coreGrow = prefersStaticMorph ? 1 : smoothstep(isMorphMobile ? 0.78 : 0.82, isMorphMobile ? 0.96 : 0.98, progress);
        const easedProgress = smoothstep(0, 1, progress);
        const iconMergeFade = 1 - smoothstep(0.62, 1, close);
        let coreCloseY = 0;
        if (morphCore && morphStage) {
          const stageRect = morphStage.getBoundingClientRect();
          const coreRect = morphCore.getBoundingClientRect();
          coreCloseY = (coreRect.top + coreRect.height / 2) - (stageRect.top + stageRect.height / 2);
        }

        scrollMorphHero.style.setProperty('--morph-grid-y', `${(-34 * easedProgress).toFixed(1)}px`);
        scrollMorphHero.style.setProperty('--morph-copy-y', `${(isMorphMobile ? 0 : -window.innerHeight * 0.08 * spread).toFixed(1)}px`);
        scrollMorphHero.style.setProperty('--morph-copy-opacity', clamp(1 - copyFade, 0, 1).toFixed(3));
        scrollMorphHero.style.setProperty('--morph-copy-glass', smoothstep(0.08, 0.28, progress).toFixed(3));
        scrollMorphHero.style.setProperty('--morph-core-scale', (0.94 + close * 0.08 + coreGrow * (isMorphMobile ? 1.38 : 1.82)).toFixed(3));
        scrollMorphHero.style.setProperty('--morph-core-opacity', coreReveal.toFixed(3));
        scrollMorphHero.style.setProperty('--morph-ring-opacity', (coreReveal * (0.22 + close * 0.28)).toFixed(3));
        scrollMorphHero.style.setProperty('--morph-cue-opacity', clamp(1 - close, 0, 1).toFixed(3));
        if (morphCore) {
          morphCore.classList.toggle('is-active', coreReveal > 0.65);
        }

        if (isMorphMobile && progress > 0.86) {
          const spreadsheetsHero = document.getElementById('spreadsheets-hero');
          if (spreadsheetsHero) spreadsheetsHero.classList.add('is-visible');
        }

        iconTargets.forEach(function (target, index) {
          if (isMorphMobile) {
            target.icon.style.display = 'grid';
            const scatter = iconScatter(index, true);
            const firstPoint = floatingPoint(index, true, false);
            const secondPoint = floatingPoint(index, true, true);
            const circleX = firstPoint.x + (scatter.x * 0.35);
            const circleY = firstPoint.y + (scatter.y * 0.45);
            const arcX = secondPoint.x + (scatter.x * 0.55);
            const arcY = secondPoint.y + (scatter.y * 0.6);

            const openX = circleX + (arcX - circleX) * spread;
            const openY = circleY + (arcY - circleY) * spread;
            const finalX = openX * (1 - close);
            const finalY = openY * (1 - close) + (coreCloseY * close);
            const mobileScale = Math.max(0.12, ((isMorphSmall ? 0.78 : 0.86) * reveal) - close * 0.42);
            const mobileOpacity = clamp(reveal * 1.05 * iconMergeFade, 0, 1);

            target.icon.style.setProperty('--morph-x', `${finalX.toFixed(1)}px`);
            target.icon.style.setProperty('--morph-y', `${finalY.toFixed(1)}px`);
            target.icon.style.setProperty('--morph-scale', mobileScale.toFixed(3));
            target.icon.style.setProperty('--morph-opacity', mobileOpacity.toFixed(3));
            target.icon.style.setProperty('--morph-rotate', `${((-10 + index * 2) * (1 - close)).toFixed(2)}deg`);
            return;
          }

          target.icon.style.display = 'grid';
          const scatter = iconScatter(index, false);
          const firstPoint = floatingPoint(index, false, false);
          const secondPoint = floatingPoint(index, false, true);
          const circleX = firstPoint.x + (scatter.x * 0.35);
          const circleY = firstPoint.y + (scatter.y * 0.35);
          const arcX = secondPoint.x + (scatter.x * 0.55);
          const arcY = secondPoint.y + (scatter.y * 0.55);
          const openX = circleX + (arcX - circleX) * spread;
          const openY = circleY + (arcY - circleY) * spread;
          const finalX = openX * (1 - close);
          const finalY = openY * (1 - close) + (coreCloseY * close);
          const rotate = (target.angle * 0.08) + (spread * (index % 2 ? -6 : 6)) - (close * (target.angle * 0.08));
          const scale = Math.max(0.08, (0.18 + reveal * 0.92) - close * 0.52);
          const opacity = clamp(reveal * 1.05 * iconMergeFade, 0, 1);

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
