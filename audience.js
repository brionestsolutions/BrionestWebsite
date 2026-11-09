/* BrioNest / audience-aware pricing and package enquiry flow */
(() => {
  const tabs = [...document.querySelectorAll('[data-price-tab]')];
  const panels = [...document.querySelectorAll('[data-price-panel]')];
  const form = document.getElementById('consultation-form');
  const typeField = form.querySelector('[name="customerType"]');
  const interestField = form.querySelector('[name="interest"]');
  const heading = form.querySelector('.form-heading');

  const chosen = document.createElement('p');
  chosen.id = 'selected-package-hint';
  chosen.className = 'selected-package-hint';
  chosen.setAttribute('role', 'status');
  chosen.hidden = true;
  heading.append(chosen);

  function selectAudience(audience, focusTab = false) {
    if (!['homeowner', 'builder'].includes(audience)) return;
    tabs.forEach(tab => {
      const active = tab.dataset.priceTab === audience;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      if (focusTab && active) tab.focus();
    });
    panels.forEach(panel => {
      panel.hidden = panel.dataset.pricePanel !== audience;
    });
  }

  function clearPackage() {
    delete form.dataset.selectedPackage;
    chosen.textContent = '';
    chosen.hidden = true;
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => selectAudience(tab.dataset.priceTab));
    tab.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const audience = event.key === 'ArrowLeft' || event.key === 'Home' ? 'homeowner' : 'builder';
      selectAudience(audience, true);
    });
  });

  document.querySelectorAll('[data-plan-jump]').forEach(link =>
    link.addEventListener('click', () => {
      selectAudience(link.dataset.planJump);
    })
  );

  // Preserve the original backend schema by storing the selected tier inside "message".
  document.querySelectorAll('[data-plan-cta]').forEach(link => {
    link.addEventListener('click', () => {
      const name = link.dataset.planName;
      const audience = link.dataset.planAudience;
      if (!name || !['homeowner', 'builder'].includes(audience)) return;
      selectAudience(audience);
      typeField.value = audience;
      interestField.value = audience === 'builder' ? 'Builder project automation' : 'Home automation consultation';
      form.dataset.selectedPackage = name;
      chosen.textContent = 'Selected package: ' + name + '. Tell us about your space below.';
      chosen.hidden = false;
    });
  });

  document.querySelectorAll('[data-custom-package]').forEach(link =>
    link.addEventListener('click', () => {
      clearPackage();
      const active = tabs.find(tab => tab.getAttribute('aria-selected') === 'true');
      const audience = active ? active.dataset.priceTab : 'homeowner';
      typeField.value = audience;
      interestField.value = audience === 'builder' ? 'Builder project automation' : 'Home automation consultation';
    })
  );
  document.querySelectorAll('[data-audience], [data-interest]').forEach(link =>
    link.addEventListener('click', clearPackage)
  );

  form.addEventListener('reset', () => {
    clearPackage();
  });

  if (location.hash === '#pricing-builder') {
    selectAudience('builder');
    history.replaceState(null, '', '#pricing');
  } else if (location.hash === '#pricing-homeowner') {
    selectAudience('homeowner');
    history.replaceState(null, '', '#pricing');
  }
})();
