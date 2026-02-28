/* ============================================================
   CHRISTOPHER OBAGA — PORTFOLIO JAVASCRIPT
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ════════════════════════════════════════
     1. CUSTOM CURSOR
  ════════════════════════════════════════ */
  const cursor     = document.querySelector('.cursor');
  const cursorRing = document.querySelector('.cursor-ring');
  let mx = -100, my = -100, rx = -100, ry = -100;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  (function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    cursorRing.style.left = rx + 'px';
    cursorRing.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  document.querySelectorAll('a, button, .lab-header, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width       = '14px';
      cursor.style.height      = '14px';
      cursor.style.background  = 'rgba(232,146,58,0.4)';
      cursorRing.style.width   = '48px';
      cursorRing.style.height  = '48px';
      cursorRing.style.borderColor = 'rgba(232,146,58,0.6)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width       = '8px';
      cursor.style.height      = '8px';
      cursor.style.background  = 'rgba(232,146,58,0.6)';
      cursorRing.style.width   = '32px';
      cursorRing.style.height  = '32px';
      cursorRing.style.borderColor = 'rgba(13,31,45,0.3)';
    });
  });


  /* ════════════════════════════════════════
     2. NAV — shrink on scroll + active link
  ════════════════════════════════════════ */
  const nav      = document.querySelector('nav');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  const navObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => navObs.observe(s));


  /* ════════════════════════════════════════
     3. HERO PHOTO — CANVAS PARTICLE SYSTEM
     Rising embers / dust particles over photo
  ════════════════════════════════════════ */
  const canvas = document.getElementById('photo-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H;

    function resizeCanvas() {
      const rect = canvas.parentElement.getBoundingClientRect();
      W = canvas.width  = rect.width  || canvas.offsetWidth;
      H = canvas.height = rect.height || canvas.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    class Ember {
      constructor(immediate) {
        this.reset(immediate);
      }
      reset(immediate) {
        this.x      = Math.random() * W;
        this.y      = immediate ? Math.random() * H : H + 8;
        this.size   = Math.random() * 2.0 + 0.3;
        this.vy     = -(Math.random() * 0.55 + 0.18);
        this.vx     = (Math.random() - 0.5) * 0.28;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = 0.018 + Math.random() * 0.012;
        this.alpha  = 0;
        this.life   = 0;
        this.maxLife = 160 + Math.random() * 140;
        this.isAmber = Math.random() > 0.38;
      }
      update() {
        this.wobble += this.wobbleSpeed;
        this.x += this.vx + Math.sin(this.wobble) * 0.22;
        this.y += this.vy;
        this.life++;
        const p = this.life / this.maxLife;
        this.alpha = p < 0.12
          ? p / 0.12
          : p > 0.78
            ? (1 - p) / 0.22
            : 1;
        if (this.life > this.maxLife || this.y < -10) this.reset(false);
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        if (this.isAmber) {
          ctx.fillStyle = `rgba(232,146,58,${this.alpha * 0.72})`;
        } else {
          ctx.fillStyle = `rgba(245,240,232,${this.alpha * 0.3})`;
        }
        ctx.fill();
      }
    }

    const embers = [];
    for (let i = 0; i < 55; i++) embers.push(new Ember(true));

    (function drawEmbers() {
      ctx.clearRect(0, 0, W, H);
      embers.forEach(e => { e.update(); e.draw(); });
      requestAnimationFrame(drawEmbers);
    })();
  }


  /* ════════════════════════════════════════
     4. HERO PHOTO — MOUSE PARALLAX TILT
     Smooth 3D tilt on mouse move over right panel
  ════════════════════════════════════════ */
  const heroRight = document.querySelector('.hero-right');
  const photoWrap = document.getElementById('photoWrap');
  const heroImg   = document.getElementById('heroImg');

  if (heroRight && photoWrap && heroImg) {
    let targetRX = 0, targetRY = 0;
    let currentRX = 0, currentRY = 0;
    let targetShiftX = 0, targetShiftY = 0;
    let currentShiftX = 0, currentShiftY = 0;
    let isOver = false;
    let floatT  = 0;

    heroRight.addEventListener('mousemove', e => {
      isOver = true;
      const r  = heroRight.getBoundingClientRect();
      const nx = (e.clientX - r.left  - r.width  / 2) / (r.width  / 2);
      const ny = (e.clientY - r.top   - r.height / 2) / (r.height / 2);
      // tilt: slight rotation on the image
      targetRX  =  ny * -5;
      targetRY  =  nx *  5;
      // parallax: image shifts slightly opposite to mouse
      targetShiftX = nx * -18;
      targetShiftY = ny * -12;
    });

    heroRight.addEventListener('mouseleave', () => {
      isOver = false;
      targetRX = 0; targetRY = 0;
      targetShiftX = 0; targetShiftY = 0;
    });

    (function animPhoto() {
      floatT += 0.008;
      const lerpSpeed = 0.07;

      currentRX     += (targetRX     - currentRX)     * lerpSpeed;
      currentRY     += (targetRY     - currentRY)     * lerpSpeed;
      currentShiftX += (targetShiftX - currentShiftX) * lerpSpeed;
      currentShiftY += (targetShiftY - currentShiftY) * lerpSpeed;

      if (isOver) {
        // 3D tilt on the wrap
        heroImg.style.transform =
          `translate(${currentShiftX}px, ${currentShiftY}px) scale(1.08)`;
      } else {
        // gentle float when idle
        const floatY = Math.sin(floatT) * 6;
        const scale  = 1 + Math.sin(floatT * 0.6) * 0.01;
        heroImg.style.transform = `translateY(${floatY}px) scale(${scale})`;
      }
      requestAnimationFrame(animPhoto);
    })();
  }


  /* ════════════════════════════════════════
     5. GLITCH SHIMMER — random, occasional
  ════════════════════════════════════════ */
  const photoBox = document.querySelector('.photo-box');

  if (photoBox) {
    // inject glitch keyframes into page
    const style = document.createElement('style');
    style.textContent = `
      @keyframes glitchSlice {
        0%   { clip-path: inset(0 0 98% 0); transform: translate(0); opacity:1; }
        8%   { clip-path: inset(15% 0 55% 0); transform: translate(-5px, 0); filter: hue-rotate(25deg) brightness(1.3); }
        16%  { clip-path: inset(55% 0 18% 0); transform: translate(5px, 0);  filter: hue-rotate(-15deg) brightness(0.9) saturate(1.5); }
        24%  { clip-path: inset(30% 0 40% 0); transform: translate(-3px,0);  filter: hue-rotate(10deg); }
        32%  { clip-path: inset(0 0 0 0);     transform: translate(2px, 0);  filter: none; }
        40%  { clip-path: inset(70% 0 5% 0);  transform: translate(-4px,0);  filter: brightness(1.2); }
        48%  { clip-path: inset(0 0 0 0);     transform: translate(0); opacity:1; }
        100% { clip-path: inset(0 0 0 0);     transform: translate(0); opacity:1; filter: none; }
      }
      .photo-glitch-layer {
        position: absolute; inset: 0; z-index: 7;
        pointer-events: none; opacity: 0;
        background-image: inherit;
      }
      .photo-glitch-layer.active {
        animation: glitchSlice 0.38s steps(1) forwards;
        opacity: 1;
      }
      /* amber shimmer sweep */
      @keyframes shimmerSweep {
        0%   { transform: translateX(-120%) skewX(-18deg); opacity: 0; }
        15%  { opacity: 0.18; }
        85%  { opacity: 0.12; }
        100% { transform: translateX(220%) skewX(-18deg); opacity: 0; }
      }
      .photo-shimmer {
        position: absolute; inset: 0; z-index: 7; pointer-events: none;
        overflow: hidden;
      }
      .photo-shimmer::after {
        content: '';
        position: absolute; top: 0; left: 0; bottom: 0; width: 45%;
        background: linear-gradient(90deg,
          transparent 0%,
          rgba(232,146,58,0.18) 40%,
          rgba(245,240,232,0.08) 55%,
          transparent 100%
        );
        animation: shimmerSweep 0s linear;
      }
      .photo-shimmer.active::after {
        animation: shimmerSweep 1.1s linear forwards;
      }
    `;
    document.head.appendChild(style);

    // Create shimmer div inside photo-box
    const shimmerEl = document.createElement('div');
    shimmerEl.className = 'photo-shimmer';
    photoBox.appendChild(shimmerEl);

    function triggerGlitch() {
      const delay = 5000 + Math.random() * 9000;
      setTimeout(() => {
        // alternate between shimmer and glitch
        if (Math.random() > 0.4) {
          shimmerEl.classList.remove('active');
          void shimmerEl.offsetWidth; // reflow
          shimmerEl.classList.add('active');
          setTimeout(() => shimmerEl.classList.remove('active'), 1200);
        }
        triggerGlitch();
      }, delay);
    }
    triggerGlitch();
  }


  /* ════════════════════════════════════════
     6. SCROLL REVEAL
  ════════════════════════════════════════ */
  const revealEls = document.querySelectorAll(
    '.exp-item, .project-card, .lab-card, .contact-btn, .skill-block, .network-spotlight, .section-label'
  );

  revealEls.forEach(el => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(32px)';
    el.style.transition = 'opacity 0.65s ease, transform 0.65s ease';
  });

  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      // stagger siblings
      const siblings = [...entry.target.parentElement.children].filter(
        c => revealEls === document.querySelectorAll(
          '.exp-item, .project-card, .lab-card, .contact-btn, .skill-block, .network-spotlight, .section-label'
        )
      );
      const delay = (Array.from(revealEls).indexOf(entry.target) % 6) * 90;
      setTimeout(() => {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
      }, delay);
      revealObs.unobserve(entry.target);
    });
  }, { threshold: 0.08 });

  revealEls.forEach(el => revealObs.observe(el));


  /* ════════════════════════════════════════
     7. LAB ACCORDION
  ════════════════════════════════════════ */
  document.querySelectorAll('.lab-header').forEach(header => {
    header.addEventListener('click', () => {
      const card   = header.parentElement;
      const isOpen = card.classList.contains('open');
      document.querySelectorAll('.lab-card').forEach(c => c.classList.remove('open'));
      if (!isOpen) card.classList.add('open');
    });
  });


  /* ════════════════════════════════════════
     8. FOOTER YEAR
  ════════════════════════════════════════ */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* ════════════════════════════════════════
     9. HERO TAGLINE TYPEWRITER
  ════════════════════════════════════════ */
  const tagline = document.querySelector('.hero-tagline');
  if (tagline) {
    const fullText = tagline.textContent.trim();
    tagline.textContent = '';
    tagline.style.opacity = '1';
    let i = 0;
    const type = () => {
      if (i < fullText.length) {
        tagline.textContent += fullText[i++];
        setTimeout(type, 14);
      }
    };
    setTimeout(type, 900);
  }

});