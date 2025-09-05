// scripts.js (replace everything with this)
document.addEventListener('DOMContentLoaded', () => {
  /* ----------------------------
   🌙 Theme Toggle
  ---------------------------- */
  const themeSwitch = document.querySelector('#theme-switch');
  if (themeSwitch) {
    const savedTheme =
      localStorage.getItem('theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    document.body.classList.toggle('dark-theme', savedTheme === 'dark');
    themeSwitch.checked = savedTheme === 'dark';

    themeSwitch.addEventListener('change', () => {
      const newTheme = themeSwitch.checked ? 'dark' : 'light';
      document.body.classList.toggle('dark-theme', newTheme === 'dark');
      localStorage.setItem('theme', newTheme);
    });
  }

  /* ----------------------------
   🧭 Smooth Scroll (with header offset)
  ---------------------------- */
  const header = document.querySelector('header');
  const offset = (header?.offsetHeight || 70) + 16; // header + small gap
  const navLinks = document.querySelectorAll('.nav-links a');

  function smoothScrollToTarget(target) {
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  if (navLinks.length > 0) {
    navLinks.forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (!href || !href.startsWith('#')) return; // external links ignored

        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          smoothScrollToTarget(target);
          // highlight active link
          navLinks.forEach(l => l.classList.remove('active'));
          anchor.classList.add('active');
          // close mobile menu after click
          document.querySelector('.hamburger')?.classList.remove('active');
          document.querySelector('.nav-links')?.classList.remove('active');
        }
      });
    });
  }

  /* ----------------------------
   🍔 Mobile Hamburger Menu
  ---------------------------- */
  const hamburger = document.querySelector('.hamburger');
  const navLinksContainer = document.querySelector('.nav-links');
  if (hamburger && navLinksContainer) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinksContainer.classList.toggle('active');
    });

    // close menu when any nav link is tapped
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinksContainer.classList.remove('active');
      });
    });
  }

  /* ----------------------------
   📬 Contact Form (validation + Formspree-friendly)
  ---------------------------- */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('name')?.value.trim();
      const email = document.getElementById('email')?.value.trim();
      const subject = document.getElementById('subject')?.value.trim();
      const message = document.getElementById('message')?.value.trim();
      const formMessage = document.getElementById('form-message');

      if (!formMessage) return;

      formMessage.style.color = '#e63946';
      if (!name || name.length < 2) {
        formMessage.innerText = '⚠️ Please enter a valid name (2+ characters).';
        return;
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        formMessage.innerText = '⚠️ Please enter a valid email address.';
        return;
      }
      if (!message || message.length < 10) {
        formMessage.innerText = '⚠️ Message must be at least 10 characters.';
        return;
      }

      try {
        // If your form has action="https://formspree.io/f/XXXX" set, we’ll respect it.
        const actionUrl = contactForm.getAttribute('action');
        if (actionUrl) {
          const fd = new FormData();
          fd.append('name', name);
          fd.append('email', email);
          if (subject) fd.append('subject', subject);
          fd.append('message', message);

          const res = await fetch(actionUrl, {
            method: 'POST',
            body: fd,
            headers: { 'Accept': 'application/json' }
          });

          if (res.ok) {
            formMessage.style.color = '#2a9d8f';
            formMessage.innerText = '✅ Thanks! Your message has been sent.';
            contactForm.reset();
          } else {
            formMessage.innerText = '⚠️ Could not send message. Please try again later.';
          }
        } else {
          // No action set: just validate and show success
          formMessage.style.color = '#2a9d8f';
          formMessage.innerText = '✅ Thanks! Your message is ready to be sent.';
          contactForm.reset();
        }
      } catch (err) {
        formMessage.innerText = '⚠️ Network error. Please try again.';
      }
    });
  }

  /* ----------------------------
   🎬 Scroll Animations (with mobile & safety fallbacks)
  ---------------------------- */
  const elementsToAnimate = document.querySelectorAll(
    '.animate-section, .project-card, .education-card, .cert-card, .contact-message.card, .contact-info.card'
  );

  const reveal = (el) => el.classList.add('visible');

  const smallScreen = window.matchMedia('(max-width: 768px)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // On phones or reduced motion, show everything immediately
  if (smallScreen || prefersReducedMotion || elementsToAnimate.length === 0) {
    elementsToAnimate.forEach(reveal);
    return;
  }

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          const t = entry.target;
          // Stagger only for card-like elements
          if (
            t.classList.contains('project-card') ||
            t.classList.contains('education-card') ||
            t.classList.contains('cert-card') ||
            t.classList.contains('contact-message') ||
            t.classList.contains('contact-info')
          ) {
            setTimeout(() => reveal(t), index * 120);
          } else {
            reveal(t);
          }
          observer.unobserve(t);
        }
      });
    }, { root: null, threshold: 0.1, rootMargin: '0px 0px -10% 0px' });

    elementsToAnimate.forEach(el => io.observe(el));

    // Safety reveal: if anything stayed hidden after 1.2s (iOS/Safari quirks)
    setTimeout(() => {
      document
        .querySelectorAll('.animate-section:not(.visible) .project-card, .animate-section:not(.visible) > *')
        .forEach(reveal);
      document
        .querySelectorAll('.project-card:not(.visible), .education-card:not(.visible), .cert-card:not(.visible), .contact-message.card:not(.visible), .contact-info.card:not(.visible)')
        .forEach(reveal);
    }, 1200);
  } else {
    // Old browsers: show all
    elementsToAnimate.forEach(reveal);
  }
});
