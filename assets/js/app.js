const state = {
  plans: [],
  category: 'all',
  subtype: 'all',
  stateFilter: '',
  maxPrice: 0,
  sort: 'price-asc'
};

function formatMoney(n) {
  if (n === null || n === undefined) return 'Contact for pricing';
  const num = Number(n);
  const hasCents = Math.round(num * 100) % 100 !== 0;
  return '$' + num.toLocaleString(undefined, hasCents ? { minimumFractionDigits: 2, maximumFractionDigits: 2 } : {});
}

function planMatchesState(plan, query) {
  if (!query) return true;
  if (plan.states.includes('ALL')) return true;
  const q = query.trim().toLowerCase();
  return plan.states.some(s => s.toLowerCase().includes(q));
}

function getFilteredPlans() {
  let list = state.plans.filter(p => {
    if (state.category !== 'all' && p.category !== state.category) return false;
    if (state.subtype !== 'all' && p.subType !== state.subtype) return false;
    if (state.maxPrice > 0 && (p.monthlyPriceIndividual === null || p.monthlyPriceIndividual > state.maxPrice)) return false;
    if (!planMatchesState(p, state.stateFilter)) return false;
    return true;
  });

  list.sort((a, b) => {
    const priceA = a.monthlyPriceIndividual === null ? Infinity : a.monthlyPriceIndividual;
    const priceB = b.monthlyPriceIndividual === null ? Infinity : b.monthlyPriceIndividual;
    if (state.sort === 'price-asc') return priceA - priceB;
    if (state.sort === 'price-desc') {
      if (a.monthlyPriceIndividual === null) return 1;
      if (b.monthlyPriceIndividual === null) return -1;
      return priceB - priceA;
    }
    if (state.sort === 'name-asc') return a.planName.localeCompare(b.planName);
    return 0;
  });

  return list;
}

function renderSubtypeOptions() {
  const select = document.getElementById('subtype-select');
  const relevant = state.plans.filter(p => state.category === 'all' || p.category === state.category);
  const subtypes = [...new Set(relevant.map(p => p.subType))].sort();
  const current = select.value;
  select.innerHTML = '<option value="all">All Coverage Types</option>' +
    subtypes.map(s => `<option value="${s}">${s}</option>`).join('');
  if (subtypes.includes(current)) select.value = current;
  else state.subtype = 'all';
}

function planCardHtml(plan) {
  const badge = plan.category === 'major-medical' ? 'Major Medical' : 'Supplemental';
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
  return `
    <div class="plan-card" data-id="${plan.id}">
      <span class="badge">${badge} · ${plan.subType}</span>
      <p class="carrier">${plan.carrier}</p>
      <h4>${plan.planName}</h4>
      <div class="price">${formatMoney(plan.monthlyPriceIndividual)}${plan.monthlyPriceIndividual !== null ? `<span>${plan.priceUnitLabel || '/mo individual'}</span>` : ''}</div>
      ${familyPriceHtml}
      <ul>${benefits}</ul>
      <div class="card-actions">
        <a href="${plan.brochureUrl}" target="_blank" rel="noopener">Brochure</a>
        ${sbcLinkHtml}
        <button class="cta" data-id="${plan.id}">View Details</button>
      </div>
    </div>
  `;
}

function renderPlans() {
  const grid = document.getElementById('plan-grid');
  const noResults = document.getElementById('no-results');
  const countEl = document.getElementById('results-count');
  const filtered = getFilteredPlans();

  countEl.textContent = `${filtered.length} plan${filtered.length === 1 ? '' : 's'} found`;

  if (filtered.length === 0) {
    grid.innerHTML = '';
    noResults.style.display = 'block';
    return;
  }
  noResults.style.display = 'none';
  grid.innerHTML = filtered.map(planCardHtml).join('');

  grid.querySelectorAll('[data-id]').forEach(el => {
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

  document.getElementById('modal-body').innerHTML = `
    <span class="badge">${plan.category === 'major-medical' ? 'Major Medical' : 'Supplemental'} · ${plan.subType}</span>
    <h3>${plan.planName}</h3>
    <p class="carrier">${plan.carrier}</p>
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
  if (category === 'major-medical' || category === 'supplemental') {
    state.category = category;
    document.querySelectorAll('#category-chips .filter-chip').forEach(chip => {
      chip.classList.toggle('active', chip.dataset.category === category);
    });
    document.getElementById('page-title').textContent =
      category === 'major-medical' ? 'Major Medical Plans' : 'Supplemental & Ancillary Plans';
  }
}

function initFilters() {
  document.querySelectorAll('#category-chips .filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('#category-chips .filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state.category = chip.dataset.category;
      renderSubtypeOptions();
      renderPlans();
    });
  });

  document.getElementById('subtype-select').addEventListener('change', (e) => {
    state.subtype = e.target.value;
    renderPlans();
  });

  document.getElementById('state-input').addEventListener('input', (e) => {
    state.stateFilter = e.target.value;
    renderPlans();
  });

  document.getElementById('price-select').addEventListener('change', (e) => {
    state.maxPrice = Number(e.target.value);
    renderPlans();
  });

  document.getElementById('sort-select').addEventListener('change', (e) => {
    state.sort = e.target.value;
    renderPlans();
  });

  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('plan-modal').addEventListener('click', (e) => {
    if (e.target.id === 'plan-modal') closeModal();
  });
}

state.plans = PLANS_DATA.plans;
applyUrlParams();
initFilters();
renderSubtypeOptions();
renderPlans();
