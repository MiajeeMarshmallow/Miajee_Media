/* =============================================
   MIAJEE MEDIA — script.js
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- NAVBAR SCROLL ---- */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  /* ---- BURGER MENU ---- */
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  burger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    // Animate burger bars
    const spans = burger.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      const spans = burger.querySelectorAll('span');
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      document.body.style.overflow = '';
    });
  });


  /* ---- SCROLL REVEAL ---- */
  const revealEls = document.querySelectorAll(
    '.service-card, .portfolio-card, .testimonial-card, .about__text, .about__badges, .stat, .badge, .hire__item, .hire__form-embed'
  );

  revealEls.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, 60 * (Array.from(revealEls).indexOf(entry.target) % 6));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => observer.observe(el));


  /* ---- SECTION EYEBROW STAGGER ---- */
  document.querySelectorAll('.section__eyebrow, .section__title, .hire__title, .hire__sub').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });


  /* ---- TESTIMONIAL DOTS (desktop shows all; mobile tabs) ---- */
  const track = document.getElementById('testimonialTrack');
  const dotsContainer = document.getElementById('testimonialDots');
  const cards = track ? track.querySelectorAll('.testimonial-card') : [];
  let current = 0;

  const buildDots = () => {
    if (window.innerWidth > 1024 || !dotsContainer) return;
    dotsContainer.innerHTML = '';
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'dot' + (i === current ? ' active' : '');
      dot.setAttribute('aria-label', `Testimonial ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });
  };

  const goTo = (index) => {
    current = index;
    if (window.innerWidth <= 1024 && track) {
      cards.forEach((c, i) => {
        c.style.display = i === index ? 'block' : 'none';
      });
      document.querySelectorAll('.dot').forEach((d, i) => {
        d.classList.toggle('active', i === index);
      });
    }
  };

  const applyMobileTestimonials = () => {
    if (window.innerWidth <= 1024) {
      buildDots();
      goTo(0);
      // Auto-advance
      if (!window._testimonialTimer) {
        window._testimonialTimer = setInterval(() => {
          goTo((current + 1) % cards.length);
        }, 4500);
      }
    } else {
      cards.forEach(c => c.style.display = '');
      dotsContainer.innerHTML = '';
      if (window._testimonialTimer) { clearInterval(window._testimonialTimer); window._testimonialTimer = null; }
    }
  };

  applyMobileTestimonials();
  window.addEventListener('resize', applyMobileTestimonials);


  /* ---- EMBED FORM BUTTON ---- */
  const embedFormBtn = document.getElementById('embedFormBtn');
  const googleFormFrame = document.getElementById('googleFormFrame');
  const formLoadingBox = document.getElementById('formLoadingBox');

  if (embedFormBtn && googleFormFrame) {
    embedFormBtn.addEventListener('click', () => {
      // Use the short link — browser will follow redirect inside iframe
      googleFormFrame.src = 'https://forms.gle/xFvUQ7k8vLFF64gn7';
      googleFormFrame.style.display = 'block';
      if (formLoadingBox) formLoadingBox.style.display = 'none';
    });
  }

  /* ---- HIRE ME BUTTON — smooth scroll + form flash ---- */
  const hireMeBtn = document.getElementById('hireMeBtn');
  const formEmbed = document.getElementById('formEmbed');

  if (hireMeBtn && formEmbed) {
    hireMeBtn.addEventListener('click', (e) => {
      // The link already anchors to #hire, but also flash the embed
      setTimeout(() => {
        formEmbed.style.transition = 'box-shadow 0.4s';
        formEmbed.style.boxShadow = '0 0 0 2px #F5C400, 0 0 40px rgba(245,196,0,0.35)';
        setTimeout(() => { formEmbed.style.boxShadow = ''; }, 1800);
      }, 500);
    });
  }


  /* ---- ACTIVE NAV LINK on scroll ---- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__links a');

  const activateNav = () => {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.style.color = link.getAttribute('href') === `#${current}` ? 'var(--gold)' : '';
    });
  };

  window.addEventListener('scroll', activateNav, { passive: true });


  /* ---- COUNTER ANIMATION on about section ---- */
  const stats = document.querySelectorAll('.stat__num');

  const animateCounter = (el) => {
    const target = el.textContent;
    const num = parseInt(target.replace(/\D/g, ''));
    const suffix = target.replace(/[\d]/g, '');
    if (!num) return;
    let start = 0;
    const duration = 1400;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * num) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(s => counterObserver.observe(s));


  /* ---- PORTFOLIO CARD cursor glow ---- */
  document.querySelectorAll('.portfolio-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
      const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
      card.style.setProperty('--mx', `${x}%`);
      card.style.setProperty('--my', `${y}%`);
    });
  });


  /* ---- SMOOTH SCROLL for all anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  /* ---- PREFERS REDUCED MOTION: disable animations ---- */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.hero__ring, .hero__ring-inner, .hero__lightning, .hero__scroll-hint').forEach(el => {
      el.style.animation = 'none';
    });
  }

});
