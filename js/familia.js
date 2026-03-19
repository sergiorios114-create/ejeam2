/* ========================================
   ASISTENCIA FAMILIA - GSAP Animations
   Professional, elegant reveal animations
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  // ---- HERO ANIMATIONS ----
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // Set initial hidden states
  gsap.set(['.hero-badge', '.hero-text h1', '.hero-subtitle', '.hero-buttons', '.hero-stats'], {
    opacity: 0, y: 30
  });
  gsap.set('.hero-image img', { opacity: 0, y: 50, scale: 0.97 });
  gsap.set('.hero-image-bg', { opacity: 0, scale: 0.8 });
  gsap.set('.hero-float-card', { opacity: 0, scale: 0.85 });

  // Animate to visible
  heroTl
    .to('.hero-badge', { opacity: 1, y: 0, duration: 0.8 }, 0.3)
    .to('.hero-text h1', { opacity: 1, y: 0, duration: 1 }, 0.5)
    .to('.hero-subtitle', { opacity: 1, y: 0, duration: 0.8 }, 0.8)
    .to('.hero-buttons', { opacity: 1, y: 0, duration: 0.7 }, 1)
    .to('.hero-stats', { opacity: 1, y: 0, duration: 0.7 }, 1.2)
    .to('.hero-image-bg', { opacity: 1, scale: 1, duration: 1 }, 0.4)
    .to('.hero-image img', { opacity: 1, y: 0, scale: 1, duration: 1.2 }, 0.6)
    .to('.hero-float-1', { opacity: 1, scale: 1, duration: 0.7 }, 1.3)
    .to('.hero-float-2', { opacity: 1, scale: 1, duration: 0.7 }, 1.5);

  // Floating animation for hero cards - organic multi-axis drift
  gsap.to('.hero-float-1', {
    y: -10, x: 4, rotation: 1.5,
    duration: 3, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 2
  });
  gsap.to('.hero-float-2', {
    y: 10, x: -5, rotation: -1,
    duration: 3.5, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 2.3
  });

  // Floating animation for CTA stat card
  if (document.querySelector('.cta-float-stat')) {
    gsap.set('.cta-float-stat', { opacity: 1 });
    gsap.to('.cta-float-stat', {
      y: -8, x: 3, rotation: 1,
      duration: 3.2, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 0.5
    });
  }

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

  // ---- STATS COUNTER ----
  document.querySelectorAll('.stat-number').forEach(num => {
    const target = parseInt(num.dataset.target);
    const prefix = num.dataset.prefix || '';
    const suffix = num.dataset.suffix || '';
    num.textContent = prefix + '0' + suffix;

    ScrollTrigger.create({
      trigger: num,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          onUpdate: () => {
            num.textContent = prefix + Math.round(obj.val).toLocaleString('es-CL') + suffix;
          }
        });
      }
    });
  });

  // ---- SECTION REVEALS ----
  reveal('.section-tag');
  reveal('.stats-header h2, .services-header h2, .process-header h2, .locations-header h2, .faq-header h2', { y: 25 });
  reveal('.stat-card', { stagger: 0.1 });
  reveal('.service-card', { stagger: 0.08, staggerGroup: 3 });
  reveal('.step-card', { stagger: 0.12 });
  reveal('.location-card', { stagger: 0.12 });
  reveal('.faq-item', { stagger: 0.06 });

  // ---- ABOUT SECTION ----
  revealX('.about-text', -40);
  revealX('.about-image', 40);

  // ---- CTA ----
  revealX('.cta-text', -30);
  revealX('.cta-image', 30);
  reveal('.cta-float-stat', { y: 20, duration: 0.6 });

  // ---- CONTACT ----
  revealX('.contact-info', -30);
  revealX('.contact-form-wrap', 30);

  // ---- PARALLAX ----
  document.querySelectorAll('.about-bg-img, .cta-bg-img, .contact-bg-img').forEach(img => {
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

  // ---- FAQ ACCORDION ----
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
