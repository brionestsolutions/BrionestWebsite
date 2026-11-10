/* BrioNest / audience-aware enquiry, compatible with the original Google Sheets schema. */
(() => {
  const form = document.getElementById('consultation-form');
  const audienceField = form.querySelector('[name="customerType"]');
  const interestField = form.querySelector('[name="interest"]');
  const heading = form.querySelector('.form-heading');
  const headingText = document.getElementById('enquiry-heading');
  const subheading = document.getElementById('enquiry-subheading');
  const groups = [...form.querySelectorAll('[data-form-for]')];

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

  function refreshAudience() {
    const audience = audienceField.value;
    groups.forEach(group => {
      const active = group.dataset.formFor === audience;
      group.hidden = !active;
      group.querySelectorAll('input,select,textarea').forEach(field => field.disabled = !active);
    });
    if (audience === 'builder') {
      headingText.textContent = 'Planning your next development?';
      subheading.textContent = 'Share the project stage and approximate units so we can suggest the right smart-ready scope.';
    } else if (audience === 'homeowner') {
      headingText.textContent = 'Planning a new home?';
      subheading.textContent = 'Tell us about your move-in plans and we’ll help you consider automation alongside your interiors.';
    } else {
      headingText.textContent = 'Tell us what you have in mind.';
      subheading.textContent = 'Share a few details and we will guide you to the right conversation.';
    }
  }

  audienceField.addEventListener('change', () => {
    clearPackage();
    refreshAudience();
    if (audienceField.value === 'builder') interestField.value = 'Builder project automation';
    if (audienceField.value === 'homeowner') interestField.value = 'Home automation consultation';
  });

  document.querySelectorAll('[data-plan-cta]').forEach(link => {
    link.addEventListener('click', () => {
      const tier = String(link.dataset.planName || '').trim();
      const audience = link.dataset.planAudience;
      if (!tier || !['homeowner','builder'].includes(audience)) return;
      audienceField.value = audience;
      interestField.value = audience === 'builder' ? 'Builder project automation' : 'Home automation consultation';
      form.dataset.selectedPackage = tier;
      chosen.textContent = 'Selected package: ' + tier + '. Tell us a little about your property below.';
      chosen.hidden = false;
      refreshAudience();
    });
  });

  // site.js sets audience/interest before these listeners, so the visible fields stay in sync.
  document.querySelectorAll('[data-audience], [data-interest]').forEach(link =>
    link.addEventListener('click', () => {
      clearPackage();
      refreshAudience();
    })
  );

  form.addEventListener('reset', () => {
    clearPackage();
    queueMicrotask(refreshAudience);
  });

  // Support previous direct links, without restoring hidden pricing tabs.
  if (location.hash === '#pricing-builder') location.replace('#builder-pricing');
  if (location.hash === '#pricing-homeowner') location.replace('#pricing');
  const audienceParam = new URLSearchParams(location.search).get('audience');
  if (audienceParam === 'builder' || audienceParam === 'homeowner') {
    audienceField.value = audienceParam;
    interestField.value = audienceParam === 'builder'
      ? 'Builder project automation' : 'Home automation consultation';
  }
  refreshAudience();
})();
