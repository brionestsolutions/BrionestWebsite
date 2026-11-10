/* BrioNest | all pricing is visible. Carry the selected tier into the existing consultation API. */
(() => {
  const form = document.getElementById('consultation-form');
  const audienceField = form.querySelector('[name="customerType"]');
  const interestField = form.querySelector('[name="interest"]');
  const heading = form.querySelector('.form-heading');
  const chosen = document.createElement('p');
  chosen.id = 'selected-package-hint';
  chosen.className = 'selected-package-hint';
  chosen.setAttribute('role', 'status');
  chosen.hidden = true;
  heading.append(chosen);

  function clearPackage() {
    delete form.dataset.selectedPackage;
    chosen.textContent = '';
    chosen.hidden = true;
  }

  document.querySelectorAll('[data-plan-cta]').forEach(link => {
    link.addEventListener('click', () => {
      const tier = String(link.dataset.planName || '').trim();
      const audience = link.dataset.planAudience;
      if (!tier || !['homeowner', 'builder'].includes(audience)) return;
      audienceField.value = audience;
      interestField.value = audience === 'builder'
        ? 'Builder project automation' : 'Home automation consultation';
      form.dataset.selectedPackage = tier;
      chosen.textContent = 'Selected package: ' + tier + '. Tell us a little about your property below.';
      chosen.hidden = false;
    });
  });

  // General audience enquiries are not attributed to a specific package.
  document.querySelectorAll('[data-audience], [data-interest]').forEach(link =>
    link.addEventListener('click', clearPackage)
  );

  form.addEventListener('reset', clearPackage);

  // Support bookmarks created with the earlier pricing tab interface.
  if (location.hash === '#pricing-builder') {
    location.replace('#builder-pricing');
  } else if (location.hash === '#pricing-homeowner') {
    location.replace('#pricing');
  }
})();
