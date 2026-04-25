/* ═══════════════════════════════════════════════════════════════════
   MARCO RATH PORTFOLIO — script.js
   GSAP · Particles · Custom Cursor · Typewriter · Counters · Tilt
═══════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────────────────────────
     1. CUSTOM CURSOR
  ───────────────────────────────────────────────────────────── */
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
  });

  // Ring follows with smooth lag
  (function animRing() {
    rx += (mx - rx) * .14;
    ry += (my - ry) * .14;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });


  /* ─────────────────────────────────────────────────────────────
     2. SCROLL PROGRESS BAR
  ───────────────────────────────────────────────────────────── */
  const progressBar = document.getElementById('progress-bar');
  window.addEventListener('scroll', () => {
    const winScroll  = document.documentElement.scrollTop;
    const height     = document.documentElement.scrollHeight - window.innerHeight;
    const pct        = height > 0 ? winScroll / height : 0;
    progressBar.style.transform = `scaleX(${pct})`;
  }, { passive: true });


  /* ─────────────────────────────────────────────────────────────
     3. NAVBAR — scroll glass effect
  ───────────────────────────────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  const scrollNav = () => {
    if (window.scrollY > 60) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  window.addEventListener('scroll', scrollNav, { passive: true });
  scrollNav();


  /* ─────────────────────────────────────────────────────────────
     4. MOBILE MENU TOGGLE
  ───────────────────────────────────────────────────────────── */
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });


  /* ─────────────────────────────────────────────────────────────
     5. SMOOTH SCROLL
  ───────────────────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });


  /* ─────────────────────────────────────────────────────────────
     6. CANVAS PARTICLE FIELD
  ───────────────────────────────────────────────────────────── */
  const canvas = document.getElementById('particles-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - .5) * .35;
      this.vy = (Math.random() - .5) * .35;
      this.r  = Math.random() * 1.5 + .4;
      this.alpha = Math.random() * .4 + .1;
      const palette = ['#00d4ff','#00ff9d','#a855f7','#ffffff'];
      this.color = palette[Math.floor(Math.random() * palette.length)];
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle   = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur  = 6;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Create particles
  for (let i = 0; i < 120; i++) particles.push(new Particle());

  // Draw connecting lines between close particles
  function drawLines() {
    const maxDist = 100;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < maxDist) {
          ctx.save();
          ctx.globalAlpha = (1 - dist / maxDist) * .07;
          ctx.strokeStyle = '#00d4ff';
          ctx.lineWidth   = .6;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  function animParticles() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animParticles);
  }
  animParticles();


  /* ─────────────────────────────────────────────────────────────
     7. TYPEWRITER EFFECT
  ───────────────────────────────────────────────────────────── */
  const phrases = [
    'Desarrollador Full Stack',
    'Angular Enthusiast',
    'Node.js Developer',
    'UI/UX Designer',
    'Spring Boot Specialist',
    'Android Developer',
    'Mysql Expert',
    'MongoDB Lover',
    'Tech Blogger',
    'Open Source Contributor'
  ];
  const twEl  = document.getElementById('typewriter');
  let pIdx = 0, cIdx = 0, deleting = false;

  function typeNext() {
    const phrase = phrases[pIdx];
    if (!deleting) {
      twEl.textContent = phrase.slice(0, ++cIdx);
      if (cIdx === phrase.length) {
        deleting = true;
        setTimeout(typeNext, 1800);
        return;
      }
      setTimeout(typeNext, 60);
    } else {
      twEl.textContent = phrase.slice(0, --cIdx);
      if (cIdx === 0) {
        deleting = false;
        pIdx = (pIdx + 1) % phrases.length;
        setTimeout(typeNext, 400);
        return;
      }
      setTimeout(typeNext, 38);
    }
  }
  typeNext();


  /* ─────────────────────────────────────────────────────────────
     8. COUNTER ANIMATION
  ───────────────────────────────────────────────────────────── */
  function animateCounter(el, target, duration) {
    let start = null;
    const step = ts => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  }

  const countersObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.dataset.target, 10);
        animateCounter(el, target, 1800);
        countersObserver.unobserve(el);
      }
    });
  }, { threshold: .4 });

  document.querySelectorAll('.stat-num').forEach(el => countersObserver.observe(el));


  /* ─────────────────────────────────────────────────────────────
     9. SKILL BAR ANIMATION (IntersectionObserver)
  ───────────────────────────────────────────────────────────── */
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add slight delay per card
        const cards = document.querySelectorAll('.skill-card');
        cards.forEach((card, i) => {
          setTimeout(() => {
            const bar = card.querySelector('.skill-bar');
            if (bar) bar.classList.add('animated');
          }, i * 120);
        });
        skillObserver.disconnect();
      }
    });
  }, { threshold: .2 });

  const skillsSection = document.getElementById('skills');
  if (skillsSection) skillObserver.observe(skillsSection);


  /* ─────────────────────────────────────────────────────────────
     10. GSAP ANIMATIONS
  ───────────────────────────────────────────────────────────── */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Hero entrance
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTl
      .from('.hero-eyebrow',      { duration: .8, y: 30, opacity: 0 })
      .from('.hero-name',         { duration: 1,  y: 60, opacity: 0 }, '-=.4')
      .from('.hero-role',         { duration: .8, y: 30, opacity: 0 }, '-=.5')
      .from('.hero-bio',          { duration: .8, y: 30, opacity: 0 }, '-=.5')
      .from('.hero-cta',          { duration: .8, y: 30, opacity: 0 }, '-=.5')
      .from('.hero-socials',      { duration: .8, y: 20, opacity: 0 }, '-=.5')
      .from('.avatar-frame',      { duration: 1.2, x: -60, opacity: 0, ease: 'power4.out' }, '<-=.8')
      .from('.avatar-glow-ring',  { duration: 1,  scale: .6, opacity: 0 }, '<')
      .from('.badge',             { duration: .6, scale: .5, opacity: 0, stagger: .15 }, '-=.4')
      .from('.scroll-hint',       { duration: .8, y: 20, opacity: 0 }, '-=.3');

    // About section
    gsap.from('.about-text p', {
      scrollTrigger: { trigger: '#about', start: 'top 75%' },
      y: 40, opacity: 0, stagger: .2, duration: .9, ease: 'power3.out'
    });
    gsap.from('.stat-card', {
      scrollTrigger: { trigger: '.about-stats', start: 'top 80%' },
      y: 50, opacity: 0, stagger: .12, duration: .8, ease: 'back.out(1.3)'
    });

    // Skills
    gsap.from('.skill-card', {
      scrollTrigger: { trigger: '#skills', start: 'top 78%' },
      y: 60, opacity: 0, stagger: .1, duration: .8, ease: 'power3.out'
    });

    // Projects
    gsap.from('.project-card', {
      scrollTrigger: { trigger: '#projects', start: 'top 78%' },
      y: 70, opacity: 0, stagger: .15, duration: .9, ease: 'power3.out'
    });

    // Contact
    gsap.from('.contact-card', {
      scrollTrigger: { trigger: '#contact', start: 'top 78%' },
      y: 50, opacity: 0, stagger: .12, duration: .8, ease: 'back.out(1.2)'
    });

    // Section titles
    gsap.utils.toArray('.section-title').forEach(el => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 85%' },
        y: 40, opacity: 0, duration: .9, ease: 'power3.out'
      });
    });

    // Section labels
    gsap.utils.toArray('.section-label').forEach(el => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 90%' },
        x: -20, opacity: 0, duration: .7, ease: 'power2.out'
      });
    });
  }


  /* ─────────────────────────────────────────────────────────────
     11. PROJECT CARD 3D TILT EFFECT
  ───────────────────────────────────────────────────────────── */
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - .5;
      const y = (e.clientY - rect.top)  / rect.height - .5;
      card.style.transform = `
        perspective(800px)
        rotateY(${x * 10}deg)
        rotateX(${-y * 10}deg)
        translateY(-10px)
        scale(1.02)
      `;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });


  /* ─────────────────────────────────────────────────────────────
     12. CONTACT CARD MAGNETIC HOVER
  ───────────────────────────────────────────────────────────── */
  document.querySelectorAll('.contact-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width  / 2) * .1;
      const y = (e.clientY - rect.top  - rect.height / 2) * .1;
      card.style.transform = `translate(${x}px, ${y - 6}px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform .5s cubic-bezier(.23,1,.32,1)';
      setTimeout(() => card.style.transition = '', 500);
    });
  });


  /* ─────────────────────────────────────────────────────────────
     13. ACTIVE NAV LINK on SCROLL
  ───────────────────────────────────────────────────────────── */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.style.color = '#00d4ff';
          }
        });
      }
    });
  }, { threshold: .5 });

  sections.forEach(s => navObserver.observe(s));


  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .1 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

});

   const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.skill-category-card').forEach(card => {
      observer.observe(card);
    });


     // Wrapped in block scope to avoid conflicts with script.js variables
    {
      // Timeline reveal animation
      const timelineObs = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, i * 200);
            timelineObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      document.querySelectorAll('.timeline-item').forEach(item => {
        timelineObs.observe(item);
      });

      // Skills category cards reveal
      const skillCatObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            skillCatObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08 });

      document.querySelectorAll('.skill-category-card').forEach(card => {
        skillCatObs.observe(card);
      });
    }