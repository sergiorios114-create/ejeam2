/* ========================================
   EJAM HOME - GSAP Animations
   Flagship page — cinematic reveals
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  // ---- PRELOADER (once every 5 min) ----
  const preloader = document.getElementById('preloader');
  const PRELOADER_KEY = 'ejam_preloader_last';
  const PRELOADER_INTERVAL = 5 * 60 * 1000; // 5 minutes

  if (preloader) {
    const lastShown = parseInt(sessionStorage.getItem(PRELOADER_KEY) || '0');
    const now = Date.now();

    if (now - lastShown > PRELOADER_INTERVAL) {
      // Show preloader, then dismiss after animation completes
      sessionStorage.setItem(PRELOADER_KEY, now.toString());
      setTimeout(() => {
        preloader.classList.add('done');
      }, 1800);
      setTimeout(() => {
        preloader.remove();
      }, 2400);
    } else {
      // Skip preloader — hide immediately
      preloader.remove();
    }
  }

  // ---- HERO ANIMATIONS ----
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // Set initial hidden states
  gsap.set(['.hero-badge', '.hero-title', '.hero-subtitle', '.hero-buttons', '.hero-trust'], {
    opacity: 0, y: 30
  });
  gsap.set('.hero-orb', { opacity: 0, scale: 0.5 });
  gsap.set('.hero-photo', { opacity: 0, y: 40 });
  gsap.set('.hero-photo-bg', { opacity: 0, scale: 0.6 });
  gsap.set(['.hero-svc-icons', '.hero-svc-list', '.hero-stats'], {
    opacity: 0, x: 30
  });

  // Animate — staggered cinematic entrance
  heroTl
    .to('.hero-orb-1', { opacity: 1, scale: 1, duration: 2 }, 0)
    .to('.hero-orb-2', { opacity: 1, scale: 1, duration: 2 }, 0.3)
    .to('.hero-orb-3', { opacity: 1, scale: 1, duration: 2 }, 0.5)
    .to('.hero-badge', { opacity: 1, y: 0, duration: 0.8 }, 0.3)
    .to('.hero-title', { opacity: 1, y: 0, duration: 1 }, 0.5)
    .to('.hero-subtitle', { opacity: 1, y: 0, duration: 0.8 }, 0.7)
    .to('.hero-buttons', { opacity: 1, y: 0, duration: 0.7 }, 0.9)
    .to('.hero-trust', { opacity: 1, y: 0, duration: 0.6 }, 1.1)
    .to('.hero-photo-bg', { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' }, 0.3)
    .to('.hero-photo', { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, 0.5)
    .to('.hero-svc-icons', { opacity: 1, x: 0, duration: 0.7 }, 0.7)
    .to('.hero-svc-list', { opacity: 1, x: 0, duration: 0.7 }, 0.9)
    .to('.hero-stats', { opacity: 1, x: 0, duration: 0.7 }, 1.1);

  // Floating orbs — slow ambient drift
  gsap.to('.hero-orb-1', {
    x: 30, y: -20, duration: 8, ease: 'sine.inOut', repeat: -1, yoyo: true
  });
  gsap.to('.hero-orb-2', {
    x: -20, y: 15, duration: 10, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 1
  });
  gsap.to('.hero-orb-3', {
    x: 15, y: -10, duration: 7, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 2
  });

  // Floating animation for CTA stat card
  if (document.querySelector('.cta-float-stat')) {
    gsap.set('.cta-float-stat', { opacity: 1 });
    gsap.to('.cta-float-stat', {
      y: -8, x: 3, rotation: 1,
      duration: 3.2, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 0.5
    });
  }

  // ---- HERO STATS COUNTER ----
  document.querySelectorAll('.hero-stat-number').forEach(num => {
    const target = parseInt(num.dataset.target);
    const prefix = num.dataset.prefix || '';
    const suffix = num.dataset.suffix || '';
    num.textContent = prefix + '0' + suffix;

    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: 2.5,
      delay: 1.2,
      ease: 'power2.out',
      onUpdate: () => {
        num.textContent = prefix + Math.round(obj.val).toLocaleString('es-CL') + suffix;
      }
    });
  });

  // ---- SCROLL REVEAL UTILITY ----
  function reveal(selector, vars = {}) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el, i) => {
      gsap.set(el, { opacity: 0, y: vars.y || 35 });
      gsap.to(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play none none none'
        },
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        duration: vars.duration || 0.8,
        delay: (vars.stagger || 0) * (i % (vars.staggerGroup || 4)),
        ease: 'power2.out'
      });
    });
  }

  function revealX(selector, fromX) {
    const el = document.querySelector(selector);
    if (!el) return;
    gsap.set(el, { opacity: 0, x: fromX });
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
      opacity: 1, x: 0, duration: 1, ease: 'power2.out'
    });
  }

  // ---- SECTION REVEALS ----
  reveal('.section-tag');
  reveal('.services-header h2, .process-header h2', { y: 25 });
  reveal('.service-card', { stagger: 0.12, staggerGroup: 3 });
  reveal('.step-card', { stagger: 0.12 });

  // ---- ABOUT SECTION ----
  reveal('.about-header');
  revealX('.about-visual', -40);
  revealX('.about-info', 40);
  reveal('.about-stat-box', { stagger: 0.1, staggerGroup: 3, y: 20 });

  // Floating seal animation
  if (document.querySelector('.about-float-seal')) {
    gsap.to('.about-float-seal', {
      y: -6, rotation: 2,
      duration: 3, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 0.3
    });
  }

  // ---- TESTIMONIALS ----
  reveal('.testimonials-header');
  reveal('.testimonial-card', { stagger: 0.15, staggerGroup: 3, y: 30 });

  // ---- CTA ----
  revealX('.cta-text', -30);
  revealX('.cta-image', 30);
  reveal('.cta-float-stat', { y: 20, duration: 0.6 });

  // ---- CONTACT ----
  revealX('.contact-info', -30);
  revealX('.contact-form-wrap', 30);

  // ---- PARALLAX ----
  document.querySelectorAll('.hero-bg-img, .about-bg-img, .cta-bg-img, .contact-bg-img').forEach(img => {
    gsap.to(img, {
      scrollTrigger: {
        trigger: img.closest('section'),
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5
      },
      y: 60,
      ease: 'none'
    });
  });

  // ---- FAQ ACCORDION (if present) ----
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const answer = item.querySelector('.faq-answer');
      const isOpen = item.classList.contains('active');

      document.querySelectorAll('.faq-item').forEach(other => {
        other.classList.remove('active');
        other.querySelector('.faq-answer').style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
});
