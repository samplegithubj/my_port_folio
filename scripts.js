document.addEventListener('DOMContentLoaded', () => {
  /* ----------------------------
   🌙 Theme Toggle Functionality
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
      console.log(`Theme toggled to: ${newTheme}`);
    });
  } else {
    console.error('Theme switch input (#theme-switch) not found in the DOM');
  }

  /* ----------------------------
   🧭 Smooth Scrolling for Navigation
  ---------------------------- */
  const navLinks = document.querySelectorAll('.nav-links a');
  if (navLinks.length > 0) {
    navLinks.forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

          // highlight active link
          navLinks.forEach(link => link.classList.remove('active'));
          this.classList.add('active');
        } else {
          console.warn(`Navigation target ${targetId} not found`);
        }
      });
    });
  } else {
    console.warn('No navigation links (.nav-links a) found');
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
      console.log('Hamburger menu toggled');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinksContainer.classList.remove('active');
      });
    });
  } else {
    console.warn('Hamburger menu (.hamburger) or nav links (.nav-links) not found');
  }

  /* ----------------------------
   📬 Contact Form (Validation + Send to Formspree)
  ---------------------------- */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const name = document.getElementById('name')?.value.trim();
      const email = document.getElementById('email')?.value.trim();
      const subject = document.getElementById('subject')?.value.trim();
      const message = document.getElementById('message')?.value.trim();
      const formMessage = document.getElementById('form-message');

      if (!formMessage) {
        console.error('Form message element (#form-message) not found');
        return;
      }

      formMessage.style.color = '#e63946'; // red by default

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

      // prepare data for Formspree
      const data = {
        name,
        email,
        subject,
        message
      };

      try {
        const response = await fetch('https://formspree.io/f/mpwjlydl', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        if (response.ok) {
          formMessage.style.color = '#2a9d8f'; // green
          formMessage.innerText = '✅ Thanks! Your message has been sent successfully.';
          contactForm.reset();
          console.log('Form submitted successfully to Formspree');
        } else {
          formMessage.innerText = '❌ Oops! Something went wrong. Please try again later.';
          console.error('Form submission failed:', response.statusText);
        }
      } catch (error) {
        formMessage.innerText = '❌ Network error. Please check your connection.';
        console.error('Error submitting form:', error);
      }
    });
  } else {
    console.warn('Contact form (#contact-form) not found');
  }

  /* ----------------------------
   🎬 Scroll Animations
  ---------------------------- */
  const observerOptions = { root: null, threshold: 0.1 };

  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        if (
          entry.target.classList.contains('project-card') ||
          entry.target.classList.contains('education-card') ||
          entry.target.classList.contains('cert-card') ||
          entry.target.classList.contains('contact-message') ||
          entry.target.classList.contains('contact-info')
        ) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, index * 200); // stagger
        } else {
          entry.target.classList.add('visible');
        }
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const elementsToAnimate = document.querySelectorAll(
    '.animate-section, .project-card, .education-card, .cert-card, .contact-message.card, .contact-info.card'
  );

  if (elementsToAnimate.length > 0) {
    elementsToAnimate.forEach(element => scrollObserver.observe(element));
  } else {
    console.warn('No elements found for scroll animations');
  }
});
