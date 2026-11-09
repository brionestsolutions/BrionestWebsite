/* BrioNest | progressive enhancement. Lightweight by design. */
(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.getElementById('mobile-nav');
  const setMenu = open => {
    menu.hidden = !open;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  menuButton.addEventListener('click', () => setMenu(menu.hidden));
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') setMenu(false); });
  document.addEventListener('pointerdown', event => {
    if (!menu.hidden && !menu.contains(event.target) && !menuButton.contains(event.target)) setMenu(false);
  });
  window.addEventListener('resize', () => { if (innerWidth > 1090) setMenu(false); });

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
  const dateInput = document.querySelector('[name="preferredDate"]');
  const now = new Date();
  dateInput.min = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

  // Animation is non-essential; all content remains visible without JS.
  const revealNodes = document.querySelectorAll('[data-reveal]');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reducedMotion) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -20px 0px' });
    revealNodes.forEach(node => observer.observe(node));
  } else {
    revealNodes.forEach(node => node.classList.add('is-visible'));
  }

  // Illustrative automation demonstration. No claims of live device integration.
  const scenes = {
    home: {
      title: 'Welcome home', description: 'Lights are on and comfort is ready.',
      icon: '☀', light: 'Warm · 70%', security: 'Home mode',
      comfort: 'Comfort', routine: 'Welcome', color: '#dfebe0'
    },
    away: {
      title: 'Peace of mind', description: 'Lights are off and the home is secured.',
      icon: '⌂', light: 'Lights off', security: 'Away mode',
      comfort: 'Eco', routine: 'Away', color: '#dae5df'
    },
    evening: {
      title: 'Movie night', description: 'Lights dim and the room is ready to relax.',
      icon: '◐', light: 'Dim · 20%', security: 'Home mode',
      comfort: 'Relax', routine: 'Cinema', color: '#f1e4d5'
    }
  };
  const sceneButtons = [...document.querySelectorAll('[data-scene]')];
  const sceneHero = document.querySelector('.scene-hero');
  sceneButtons.forEach(button => button.addEventListener('click', () => {
    const scene = scenes[button.dataset.scene];
    if (!scene) return;
    sceneButtons.forEach(b => {
      const active = b === button;
      b.classList.toggle('active', active);
      b.setAttribute('aria-pressed', String(active));
    });
    const elements = {
      'scene-symbol': scene.icon, 'scene-title': scene.title,
      'scene-description': scene.description, 'scene-light': scene.light,
      'scene-security': scene.security, 'scene-comfort': scene.comfort,
      'scene-routine': scene.routine
    };
    for (const [id, value] of Object.entries(elements)) {
      document.getElementById(id).textContent = value;
    }
    sceneHero.style.backgroundColor = scene.color;
  }));

  const customerType = document.querySelector('[name="customerType"]');
  const interestField = document.querySelector('[name="interest"]');
  document.querySelectorAll('[data-audience]').forEach(link => {
    link.addEventListener('click', () => {
      customerType.value = link.dataset.audience;
      if (link.dataset.audience === 'builder') interestField.value = 'Builder project automation';
      else interestField.value = 'Home automation consultation';
    });
  });

  const form = document.getElementById('consultation-form');
  const submit = document.getElementById('submit-button');
  const feedback = document.getElementById('form-feedback');
  form.addEventListener('submit', async event => {
    event.preventDefault();
    feedback.textContent = '';
    feedback.className = 'form-feedback';
    if (!form.checkValidity()) { form.reportValidity(); return; }

    const origin = String(window.BRIONEST_API_BASE_URL || '').trim().replace(/\/+$/, '');
    if (!/^https:\/\/[^/]+/i.test(origin)) {
      feedback.classList.add('error');
      feedback.textContent = 'Online enquiries are temporarily unavailable. Please try again later.';
      return;
    }

    // Maintain exactly the original FastAPI / Google Sheets field contract.
    const data = Object.fromEntries(new FormData(form).entries());
    const interest = String(data.interest || 'General consultation').slice(0, 100);
    delete data.interest;
    data.message = 'Enquiry type: ' + interest +
      (data.message ? '\n\n' + data.message : '');

    const defaultHTML = submit.innerHTML;
    submit.disabled = true;
    submit.textContent = 'Sending enquiry…';
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      let response;
      try {
        response = await fetch(origin + '/api/consultation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
          signal: controller.signal
        });
      } finally {
        clearTimeout(timeout);
      }
      if (!response.ok) throw new Error('Request failed: ' + response.status);
      const result = await response.json();
      // Legacy backend returns HTTP 200 even when Sheets append failed.
      if (result.success !== true || result.sheets_saved !== true) {
        throw new Error('Google Sheets did not confirm the record');
      }
      feedback.classList.add('success');
      feedback.textContent = 'Thank you. Your enquiry has been saved. We will get in touch.';
      form.reset();
    } catch (error) {
      console.error('Consultation request error:', error);
      feedback.classList.add('error');
      feedback.textContent = 'We could not confirm your request. Please try again shortly.';
    } finally {
      submit.disabled = false;
      submit.innerHTML = defaultHTML;
    }
  });
})();