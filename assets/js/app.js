const PROGRAMS = [
  { key: 'amerus-summit', label: 'Amerus Summit Health Plans' },
  { key: 'lifex', label: 'LifeX Research Corp' },
  { key: 'enroll-prime', label: 'Enroll Prime' },
  { key: 'ameritas', label: 'Ameritas' },
  { key: 'solstice', label: 'Solstice Dental & Vision' },
  { key: 'cigna-dental', label: 'Cigna Dental' }
];

const state = {
  plans: [],
  category: 'all' // 'all' | 'major-medical' | 'supplemental'
};

function formatMoney(n) {
  if (n === null || n === undefined) return 'Contact for pricing';
  const num = Number(n);
  const hasCents = Math.round(num * 100) % 100 !== 0;
  return '$' + num.toLocaleString(undefined, hasCents ? { minimumFractionDigits: 2, maximumFractionDigits: 2 } : {});
}

function programLabel(key) {
  const found = PROGRAMS.find(p => p.key === key);
  return found ? found.label : key;
}

function brochureThumbUrl(plan) {
  if (!plan.brochureUrl) return null;
  return plan.brochureUrl
    .replace('docs/brochures/', 'assets/img/brochure-thumbs/')
    .replace(/\.pdf$/i, '-1.png');
}

function planCardHtml(plan) {
  const badge = plan.category === 'major-medical' ? 'Health Plans' : 'Supplemental';
  const benefits = plan.keyBenefits.slice(0, 3).map(b => `<li>${b}</li>`).join('');
  let familyPriceHtml = '';
  if (plan.monthlyPriceFamily !== null) {
    familyPriceHtml = `<div style="font-size:0.82rem;color:var(--text-muted);">${formatMoney(plan.monthlyPriceFamily)}/mo family</div>`;
  } else if (plan.monthlyPriceIndividual === null && plan.priceNote) {
    familyPriceHtml = `<div style="font-size:0.82rem;color:var(--text-muted);">${plan.priceNote}</div>`;
  }
  const sbcLinkHtml = plan.sbcUrl
    ? `<a href="${plan.sbcUrl}" target="_blank" rel="noopener">SBC</a>`
    : '';
  const bundleNoteHtml = plan.standalone === false
    ? `<div class="bundle-note">Requires ${programLabel(plan.program)} major medical</div>`
    : '';
  const thumbUrl = brochureThumbUrl(plan);
  const imageHtml = thumbUrl
    ? `<div class="plan-card-image"><img src="${thumbUrl}" alt="${plan.planName} brochure cover" onerror="this.closest('.plan-card-image').style.display='none';"></div>`
    : '';
  return `
    <div class="plan-card" data-id="${plan.id}">
      ${imageHtml}
      <div class="plan-card-body">
        <span class="badge">${badge} · ${plan.subType}</span>
        <p class="carrier">${plan.carrier}</p>
        <h4>${plan.planName}</h4>
        <div class="price">${formatMoney(plan.monthlyPriceIndividual)}${plan.monthlyPriceIndividual !== null ? `<span>${plan.priceUnitLabel || '/mo individual'}</span>` : ''}</div>
        ${familyPriceHtml}
        ${bundleNoteHtml}
        <ul>${benefits}</ul>
        <div class="card-actions">
          <a href="${plan.brochureUrl}" target="_blank" rel="noopener">Brochure</a>
          ${sbcLinkHtml}
          <button class="cta" data-id="${plan.id}">View Details</button>
        </div>
      </div>
    </div>
  `;
}

function renderPrograms() {
  const container = document.getElementById('plans-container');
  const noResults = document.getElementById('no-results');
  if (!container) return;

  const allProgramKeys = [...new Set(state.plans.map(p => p.program))];
  const orderedKeys = [
    ...PROGRAMS.map(p => p.key).filter(k => allProgramKeys.includes(k)),
    ...allProgramKeys.filter(k => !PROGRAMS.some(p => p.key === k))
  ];

  let html = '';
  let anySection = false;

  orderedKeys.forEach(key => {
    const programPlans = state.plans.filter(p => p.program === key);
    const mmPlans = programPlans.filter(p => p.category === 'major-medical');
    const suppPlans = programPlans.filter(p => p.category === 'supplemental');

    const showMM = state.category !== 'supplemental' && mmPlans.length > 0;
    const showSupp = state.category !== 'major-medical' && suppPlans.length > 0;

    if (!showMM && !showSupp) return;

    anySection = true;
    html += `<div class="program-section">`;
    html += `<div class="program-header"><h2>${programLabel(key)}</h2></div>`;

    if (showMM) {
      html += `<div class="plan-grid">${mmPlans.map(planCardHtml).join('')}</div>`;
    }

    if (showSupp) {
      const heading = showMM
        ? `Supplemental Coverage from ${programLabel(key)}`
        : `${programLabel(key)} Supplemental Plans`;
      const hasBundleOnly = suppPlans.some(p => p.standalone === false);
      let note = '';
      if (hasBundleOnly) {
        note = `<p>These plans require an active ${programLabel(key)} major medical plan — they are not sold on their own.</p>`;
      } else if (key === 'ameritas') {
        note = `<p>Standalone coverage — can be added regardless of which major medical plan you choose.</p>`;
      }
      html += `<div class="program-subheader"><h3>${heading}</h3>${note}</div>`;
      html += `<div class="plan-grid">${suppPlans.map(planCardHtml).join('')}</div>`;
    }

    html += `</div>`;
  });

  if (!anySection) {
    container.innerHTML = '';
    noResults.style.display = 'block';
    return;
  }
  noResults.style.display = 'none';
  container.innerHTML = html;

  container.querySelectorAll('[data-id]').forEach(el => {
    el.addEventListener('click', (e) => {
      const id = el.getAttribute('data-id');
      openPlanModal(id);
    });
  });
}

function openPlanModal(id) {
  const plan = state.plans.find(p => p.id === id);
  if (!plan) return;
  const benefits = plan.keyBenefits.map(b => `<li>${b}</li>`).join('');

  let priceRowHtml;
  let rateTableHtml = '';
  if (plan.rateTable) {
    const startingPrice = Math.min(...plan.rateTable.rows.map(r => Math.min(...r.prices)));
    priceRowHtml = `<div><strong>${formatMoney(startingPrice)}</strong><span>${plan.priceUnitLabel || 'starting /mo'}</span></div>`;
    rateTableHtml = `
      <div class="rate-table-wrap">
        <table class="rate-table">
          <thead><tr><th>${plan.rateTable.rowHeader || 'Age'}</th>${plan.rateTable.columns.map(c => `<th>${c}</th>`).join('')}</tr></thead>
          <tbody>
            ${plan.rateTable.rows.map(r => `<tr><td>${r.label}</td>${r.prices.map(p => `<td>${formatMoney(p)}</td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
      </div>
    `;
  } else if (plan.rateTiers && plan.rateTiers.length) {
    priceRowHtml = plan.rateTiers.map(t =>
      `<div><strong>${formatMoney(t.price)}</strong><span>${t.label}</span></div>`
    ).join('');
  } else {
    priceRowHtml = `
      <div><strong>${formatMoney(plan.monthlyPriceIndividual)}</strong>${plan.monthlyPriceIndividual !== null ? `<span>${plan.priceUnitLabel || '/mo individual'}</span>` : (plan.priceNote ? `<span>${plan.priceNote}</span>` : '')}</div>
      ${plan.monthlyPriceFamily !== null ? `<div><strong>${formatMoney(plan.monthlyPriceFamily)}</strong><span>/mo family</span></div>` : ''}
    `;
  }
  if (plan.deductible !== null && plan.deductible !== undefined) {
    priceRowHtml += `<div><strong>${formatMoney(plan.deductible)}</strong><span>deductible</span></div>`;
  }

  const sbcDocHtml = plan.sbcUrl
    ? `<a href="${plan.sbcUrl}" target="_blank" rel="noopener">📄 Summary of Benefits (SBC)</a>`
    : '';

  const bundleNoticeHtml = plan.standalone === false
    ? `<p class="bundle-note" style="display:block;">Requires an active ${programLabel(plan.program)} major medical plan — not sold on its own.</p>`
    : '';

  document.getElementById('modal-body').innerHTML = `
    <span class="badge">${plan.category === 'major-medical' ? 'Health Plans' : 'Supplemental'} · ${plan.subType}</span>
    <h3>${plan.planName}</h3>
    <p class="carrier">${plan.carrier}</p>
    ${bundleNoticeHtml}
    <div class="price-row">
      ${priceRowHtml}
    </div>
    ${rateTableHtml}
    <p>${plan.description || ''}</p>
    <ul>${benefits}</ul>
    <div class="doc-links">
      <a href="${plan.brochureUrl}" target="_blank" rel="noopener">📄 Download Brochure</a>
      ${sbcDocHtml}
    </div>
    <a href="index.html?plan=${encodeURIComponent(plan.planName)}#contact" class="btn btn-primary" style="background:var(--gold);color:var(--navy);display:block;text-align:center;">Talk to an Agent About This Plan</a>
  `;
  document.getElementById('plan-modal').classList.add('open');
}

function closeModal() {
  document.getElementById('plan-modal').classList.remove('open');
}

function applyUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const category = params.get('category');
  const titleEl = document.getElementById('page-title');
  const leadEl = document.getElementById('page-lead');
  if (category === 'major-medical') {
    state.category = 'major-medical';
    if (titleEl) titleEl.textContent = 'Health Plans';
    if (leadEl) leadEl.textContent = 'Health plans, grouped by company. Pick the plan that fits, then check that company’s supplemental options on the Supplemental Plans page.';
  } else if (category === 'supplemental') {
    state.category = 'supplemental';
    if (titleEl) titleEl.textContent = 'Supplemental & Ancillary Plans';
    if (leadEl) leadEl.textContent = 'Supplemental plans, grouped by company. Some are add-ons to a specific company’s major medical plan; others stand on their own.';
  }
}

function initModal() {
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('plan-modal').addEventListener('click', (e) => {
    if (e.target.id === 'plan-modal') closeModal();
  });
}

state.plans = PLANS_DATA.plans;
applyUrlParams();
initModal();
renderPrograms();
