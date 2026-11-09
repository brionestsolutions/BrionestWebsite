/* BrioNest / progressive enhancement, no UI framework required */
(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  function closeMenu() {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
    mobileMenu.hidden = true;
  }
  menuButton.addEventListener('click', () => {
    const opening = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(opening));
    menuButton.setAttribute('aria-label', opening ? 'Close navigation' : 'Open navigation');
    mobileMenu.hidden = !opening;
  });
  mobileMenu.querySelectorAll('a').forEach(link =>
    link.addEventListener('click', closeMenu)
  );
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });
  document.addEventListener('click', event => {
    if (!mobileMenu.hidden && !mobileMenu.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1050) closeMenu();
  });
  document.getElementById('year').textContent = new Date().getFullYear();

  const sceneData = {
    evening: {
      number: '01 / 03',
      eyebrow: '01 — THE EVENING SCENE',
      name: 'Come home to calm.',
      description: 'Lights soften. The space settles. Everything is just how you like it.',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1800&q=85',
      alt: 'Warm, ambient living room in the evening'
    },
    morning: {
      number: '02 / 03',
      eyebrow: '02 — THE MORNING SCENE',
      name: 'A brighter beginning.',
      description: 'Welcome the day with natural light, comfort and a little more ease.',
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1800&q=85',
      alt: 'Bright architectural living room illuminated by daylight'
    },
    away: {
      number: '03 / 03',
      eyebrow: '03 — THE AWAY SCENE',
      name: 'Leave with peace of mind.',
      description: 'A simpler goodbye, with your home ready for what comes next.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1800&q=85',
      alt: 'Architectural residence surrounded by a peaceful landscape'
    }
  };
  const sceneImage = document.getElementById('scene-image');
  const sceneTabs = [...document.querySelectorAll('.scene-tab')];
  let sceneSwitchId = 0;
  sceneTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const key = tab.dataset.scene;
      const scene = sceneData[key];
      if (!scene || tab.classList.contains('active')) return;
      const thisSwitch = ++sceneSwitchId;
      sceneTabs.forEach(item => {
        const active = item === tab;
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      document.getElementById('scene-number').textContent = scene.number;
      document.getElementById('scene-eyebrow').textContent = scene.eyebrow;
      document.getElementById('scene-name').textContent = scene.name;
      document.getElementById('scene-description').textContent = scene.description;
      sceneImage.classList.add('is-changing');
      const picture = new Image();
      picture.onload = () => {
        if (thisSwitch !== sceneSwitchId) return;
        sceneImage.src = scene.image;
        sceneImage.alt = scene.alt;
        requestAnimationFrame(() => sceneImage.classList.remove('is-changing'));
      };
      picture.onerror = () => {
        if (thisSwitch === sceneSwitchId) sceneImage.classList.remove('is-changing');
      };
      picture.src = scene.image;
    });
  });
  const revealNodes = document.querySelectorAll('[data-reveal]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reducedMotion) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .07, rootMargin: '0px 0px -25px 0px' });
    revealNodes.forEach(node => observer.observe(node));
  } else {
    revealNodes.forEach(node => node.classList.add('is-visible'));
  }

  const dateInput = document.querySelector('[name="preferredDate"]');
  const today = new Date();
  const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  dateInput.min = localToday;
  document.querySelectorAll('[data-audience]').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelector('[name="customerType"]').value = link.dataset.audience;
    });
  });

  const form = document.getElementById('consultation-form');
  const feedback = document.getElementById('form-feedback');
  const submit = document.getElementById('submit-button');
  form.addEventListener('submit', async event => {
    event.preventDefault();
    feedback.textContent = '';
    feedback.className = 'form-feedback';
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const base = String(window.BRIONEST_API_BASE_URL || '').trim().replace(/\/+$/, '');
    if (!/^https:\/\/[^/]+/i.test(base)) {
      feedback.classList.add('error');
      feedback.textContent = 'Online consultation requests are not connected yet. Please try again later.';
      return;
    }
    const data = Object.fromEntries(new FormData(form).entries());
    const previousText = submit.innerHTML;
    submit.disabled = true;
    submit.textContent = 'Sending your enquiry…';
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      let response;
      try {
        response = await fetch(base + '/api/consultation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
          signal: controller.signal
        });
      } finally {
        clearTimeout(timeout);
      }
      if (!response.ok) throw new Error('Server returned ' + response.status);
      const result = await response.json();
      // The legacy API may return HTTP 200 even if Google Sheets failed.
      if (result.success !== true || result.sheets_saved !== true) throw new Error('Lead not stored');
      feedback.classList.add('success');
      feedback.textContent = 'Thank you. Your enquiry has been received. Our team will be in touch.';
      form.reset();
    } catch (error) {
      console.error('Consultation request failed:', error);
      feedback.classList.add('error');
      feedback.textContent = 'We could not confirm your enquiry. Please try again shortly.';
    } finally {
      submit.disabled = false;
      submit.innerHTML = previousText;
    }
  });
})();
