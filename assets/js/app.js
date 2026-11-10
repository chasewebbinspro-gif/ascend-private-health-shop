/*
  Browse Plans page.

  How it's organized (mobile-first):
  1. Pick a path: "Self-Employed & Business Owners" or "Individuals & Families".
     Business plans = Amerus Summit, Ameristead, AmeriBenefit. Everything else is
     Individual & Family. Standalone dental/vision shows in both.
  2. Two tabs: Health Plans | Dental, Vision & Add-ons.
  3. Health plans are grouped by what people need (Full Coverage, HSA,
     Lower-Cost, Basic Preventive) instead of by company. Company is a filter.
  4. Compact cards, one plan details pop-up (bottom sheet on phones), one
     "Check my doctor" sheet, and a "Help me choose" quiz.

  URL params: ?path=business|individual|all &tab=health|addons &group=major|hsa|value|basic
  Old links (?category=major-medical / supplemental) still work.
*/

const PROGRAMS = [
  { key: 'ameribenefit', label: 'AmeriBenefit Plan', audience: 'business' },
  { key: 'amerus-summit', label: 'Amerus Summit Health Plans', audience: 'business' },
  { key: 'ameristead', label: 'Ameristead Health', audience: 'business' },
  { key: 'bright-life', label: 'Bright Life Health & Wellness', audience: 'individual' },
  { key: 'lifex', label: 'LifeX Research Corp', audience: 'individual' },
  { key: 'enroll-prime', label: 'Enroll Prime', audience: 'individual' },
  { key: 'psm-livelihood-epo', label: 'PSM Livelihood', audience: 'individual' },
  { key: 'psm-livelihood-ppo', label: 'PSM Livelihood', audience: 'individual' },
  { key: 'ameritas', label: 'Ameritas', audience: 'both' },
  { key: 'solstice', label: 'Solstice Dental & Vision', audience: 'both' },
  { key: 'cigna-dental', label: 'Cigna Dental', audience: 'both' }
];

const PATHS = {
  business: {
    title: 'Self-Employed & Business Owner Plans',
    lead: 'Plans for the self-employed, 1099 contractors, and business owners (and their families).'
  },
  individual: {
    title: 'Individual & Family Plans',
    lead: 'Private health plans for individuals and families — no business required.'
  },
  all: {
    title: 'All Plans',
    lead: 'Every plan we offer, for individuals, families, and business owners.'
  }
};

const GROUPS = [
  { key: 'major', label: 'Full Coverage', long: 'Full Coverage PPO & EPO', desc: 'Traditional major medical — a deductible, an out-of-pocket max, and coverage for the big stuff.' },
  { key: 'hsa', label: 'HSA Plans', long: 'HSA Plans', desc: 'HSA-qualified plans — set aside pre-tax money for medical bills. Popular with the self-employed.' },
  { key: 'value', label: 'Lower-Cost', long: 'Lower-Cost Plans', desc: 'Lower monthly cost, with visit limits or set benefit amounts. Good for healthy folks on a budget.' },
  { key: 'basic', label: 'Basic Preventive', long: 'Basic Preventive (MEC)', desc: 'Preventive care and a few doctor visits. Not built for big hospital bills.' }
];

const ADDON_GROUPS = [
  { key: 'dental', label: 'Dental' },
  { key: 'vision', label: 'Vision' },
  { key: 'dental-vision', label: 'Dental + Vision Bundles' },
  { key: 'protection', label: 'Accident, Critical Illness & Life' },
  { key: 'indemnity', label: 'Hospital & Doctor Cash Benefits' }
];

const NETWORKS = ['Cigna', 'Aetna', 'PHCS', 'First Health'];

const ASSOCIATION_LEVELS = [
  { name: 'Basic', price: 19.99, perks: ['Medical bill negotiation help', '24/7 virtual dentist', 'Identity theft protection (up to $25K)', 'Legal guidance (Attorney Live)', 'Pet insurance discount'] },
  { name: 'Plus', price: 29.99, perks: ['Everything in Basic', '24/7 telemedicine', 'Gym membership savings', 'Hearing tests & hearing aid discounts', 'Identity theft protection (up to $1M)', 'Estate planning (first year free)', 'Pet telehealth'] },
  { name: 'Preferred', price: 49.99, perks: ['Everything in Plus', 'Telemedicine with psychologist coverage', '$0 hearing evaluations', 'Family identity protection', 'Tax hotline with CPAs & tax attorneys'] }
];

const HEALTH_TIERS = {
  'Tier 1': 'Very healthy',
  'Tier 2': 'Somewhat healthy',
  'Tier 3': 'Higher health needs'
};

// Provider/doctor lookup instructions, by network.
const PROVIDER_SEARCH = {
  'Cigna': [{
    label: 'Cigna Provider Search',
    url: 'https://hcpdirectory.cigna.com/web/public/consumer/directory',
    steps: ['Visit hcpdirectory.cigna.com/web/public/consumer/directory', 'Click "Employer or School"']
  }],
  'Aetna': [{
    label: 'Aetna Provider Search',
    url: 'https://www.aetna.com/dsepublic/#/contentPage?page=providerSearchLanding&site_id=asa&language=en',
    steps: ['Enter your address, city, or zip code', 'Select the provider type to search', 'Continue as Guest']
  }],
  'PHCS': [{
    label: 'PHCS Provider Search',
    url: 'https://providersearch.multiplan.com/',
    steps: ['Visit providersearch.multiplan.com', 'Highlight PHCS (logo on the front card) and click Select and Search', 'Enter your search parameters, your zip code, and select Search']
  }, {
    label: 'MagnaCare Provider Search',
    note: 'LifeX plans only — New York and New Jersey',
    url: 'https://www.magnacare.com/',
    steps: ['Visit magnacare.com', 'Click "Find a Provider" in the top right-hand corner of the site', 'Select "Search MagnaCare Providers"']
  }],
  'First Health': [{
    label: 'First Health Provider Search',
    url: 'https://www.myfirsthealth.com',
    steps: ['Visit myfirsthealth.com', 'Click "Start" and search']
  }]
};

const state = {
  plans: [],
  path: null,      // 'business' | 'individual' | 'all' | null (not picked yet)
  tab: 'health',   // 'health' | 'addons'
  group: 'all',
  network: 'all',
  company: 'all',
  maxPrice: 0,     // 0 = any
  sort: 'recommended',
  quizActive: false,
  quizNote: ''
};

/* ---------- helpers ---------- */

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function formatMoney(n) {
  if (n === null || n === undefined) return 'Call for pricing';
  const num = Number(n);
  const hasCents = Math.round(num * 100) % 100 !== 0;
  return '$' + num.toLocaleString(undefined, hasCents ? { minimumFractionDigits: 2, maximumFractionDigits: 2 } : {});
}

function program(key) {
  return PROGRAMS.find(p => p.key === key) || { key, label: key, audience: 'individual' };
}

function audienceOf(plan) {
  return program(plan.program).audience;
}

function inPath(plan, path) {
  if (!path || path === 'all') return true;
  const a = audienceOf(plan);
  return a === 'both' || a === path;
}

function companyOf(plan) {
  return program(plan.program).label;
}

function networkOf(plan) {
  const n = (plan.network || '').toLowerCase();
  if (n.includes('cigna')) return 'Cigna';
  if (n.includes('aetna')) return 'Aetna';
  if (n.includes('phcs')) return 'PHCS';
  if (n.includes('first health')) return 'First Health';
  return null;
}

function needGroupOf(plan) {
  if (plan.category !== 'major-medical') return null;
  const t = `${plan.subType} ${plan.planName}`;
  if (/\bMEC\b/.test(t)) return 'basic';
  if (/HSA/.test(t)) return 'hsa';
  if (/\bVL\b|Visit|Limited Benefit|Fixed Indemnity|High-Deductible PPO|Deductible-Value|PHCS Network|First Health Network/i.test(t)) return 'value';
  return 'major';
}

function addonGroupOf(plan) {
  const t = plan.subType || '';
  if (/Dental/i.test(t) && /Vision/i.test(t)) return 'dental-vision';
  if (/Dental/i.test(t)) return 'dental';
  if (/Vision/i.test(t)) return 'vision';
  if (/Fixed Indemnity/i.test(t)) return 'indemnity';
  return 'protection';
}

// Plain-English plan type shown on cards
function typeLabel(plan) {
  const map = {
    'LifeX MM': 'Major Medical PPO',
    'LifeX MM+': 'Major Medical PPO',
    'LifeX VL': 'Visit-Limited',
    'LifeX Copay PPO': 'Copay PPO',
    'Visit Limit': 'Visit-Limited',
    'PHCS Network': 'Visit-Limited',
    'First Health Network': 'Visit-Limited',
    'MEC': 'Basic Preventive (MEC)',
    'Fixed Indemnity PPO': 'Set-Copay Plan (visit limits)',
    'High-Deductible PPO': 'Value PPO',
    'Deductible-Value PPO': 'Value PPO (10 visits/yr)',
    'Cigna PPO': 'PPO',
    'HSA PPO': 'HSA PPO',
    'Major Medical': 'Major Medical PPO',
    'Dental (DHMO)': 'Dental HMO',
    'Dental & Vision (PPO)': 'Dental & Vision',
    'Fixed Indemnity': 'Hospital Cash Benefit'
  };
  let label = map[plan.subType] || plan.subType;
  if (needGroupOf(plan) === 'hsa' && !/HSA/.test(label)) label = `HSA ${label}`;
  return label;
}

function startingPrice(plan) {
  if (plan.monthlyPriceIndividual !== null && plan.monthlyPriceIndividual !== undefined) return plan.monthlyPriceIndividual;
  return null;
}

function priceUnit(plan) {
  if (startingPrice(plan) === null) return '';
  return (plan.priceUnitLabel || '/mo individual').trim();
}

function stateLimitNote(plan) {
  const hit = (plan.keyBenefits || []).find(b => /^Only offered in/i.test(b));
  return hit || null;
}

function badgesFor(plan) {
  const b = [];
  if (plan.program === 'ameribenefit') {
    b.push({ text: "Can't be declined", tone: 'good' });
    b.push({ text: 'Membership required', tone: 'warn' });
  }
  if (plan.program === 'ameristead' || plan.program === 'ameribenefit') b.push({ text: 'Requires an EIN', tone: 'warn' });
  if (plan.standalone === false) b.push({ text: `Add-on to ${companyOf(plan)} medical`, tone: 'warn' });
  const sl = stateLimitNote(plan);
  if (sl) b.push({ text: sl.replace(/^Only offered in/i, 'Only in'), tone: 'warn' });
  return b;
}

// Short "why this plan" lines for cards. Skips lines that only repeat what the
// card already shows (network, deductible, out-of-pocket max, rate notes).
function highlightLines(plan, n) {
  const all = (plan.keyBenefits || []).filter(b => !/^Rate is|^Requires |^Only offered in|^Add-on to/i.test(b));
  const fresh = all.filter(b => !/network|^\$[\d,]+ individual \/ \$[\d,]+ family (in-network )?(deductible|out-of-pocket)|out-of-pocket max/i.test(b));
  return (plan.category === 'major-medical' && fresh.length ? fresh : all).slice(0, n);
}

function docLinks(plan) {
  const out = [];
  const seen = new Set();
  const add = (label, url) => { if (url && !seen.has(url)) { seen.add(url); out.push({ label, url }); } };
  if (plan.program === 'ameribenefit') {
    add('Summary of Benefits (SBC)', plan.sbcUrl || plan.brochureUrl);
  } else {
    add('Brochure', plan.brochureUrl);
    add('Summary of Benefits (SBC)', plan.sbcUrl);
  }
  (plan.extraDocs || []).forEach(d => add(d.label, d.url));
  return out;
}

/* ---------- filtering ---------- */

function pathPlans() {
  return state.plans.filter(p => inPath(p, state.path));
}

function filteredPlans() {
  return pathPlans().filter(p => {
    if (state.tab === 'health' && p.category !== 'major-medical') return false;
    if (state.tab === 'addons' && p.category === 'major-medical') return false;
    if (state.tab === 'health' && state.group !== 'all' && needGroupOf(p) !== state.group) return false;
    if (state.tab === 'health' && state.network !== 'all' && networkOf(p) !== state.network) return false;
    if (state.company !== 'all' && companyOf(p) !== state.company) return false;
    if (state.maxPrice && (startingPrice(p) === null || startingPrice(p) > state.maxPrice)) return false;
    return true;
  });
}

function sortPlans(list) {
  const price = p => (startingPrice(p) === null ? 1e9 : startingPrice(p));
  const ded = p => (p.deductible === null || p.deductible === undefined ? 1e9 : p.deductible);
  const groupIdx = p => {
    const g = needGroupOf(p);
    const i = GROUPS.findIndex(x => x.key === g);
    return i < 0 ? 99 : i;
  };
  const copy = list.slice();
  if (state.sort === 'price') copy.sort((a, b) => price(a) - price(b));
  else if (state.sort === 'deductible') copy.sort((a, b) => ded(a) - ded(b) || price(a) - price(b));
  else copy.sort((a, b) => groupIdx(a) - groupIdx(b) || price(a) - price(b));
  return copy;
}

function activeFilterCount() {
  let n = state.sort !== 'recommended' ? 1 : 0;
  if (state.network !== 'all' && state.tab === 'health') n++;
  if (state.company !== 'all') n++;
  if (state.maxPrice) n++;
  return n;
}

/* ---------- rendering ---------- */

function planCardHtml(plan) {
  const price = startingPrice(plan);
  const priceHtml = price === null
    ? `<div class="pc-price pc-price-call">${esc(plan.priceNote || 'Call for pricing')}</div>`
    : `<div class="pc-price">${formatMoney(price)}<span>${esc(priceUnit(plan))}</span></div>`;
  const facts = [];
  if (plan.category === 'major-medical') {
    if (plan.deductible !== null && plan.deductible !== undefined) facts.push(`<span><b>${formatMoney(plan.deductible)}</b> deductible</span>`);
    if (plan.outOfPocketMax) facts.push(`<span><b>${formatMoney(plan.outOfPocketMax)}</b> max OOP</span>`);
    if (networkOf(plan)) facts.push(`<span>${esc(networkOf(plan))} network</span>`);
  }
  const badges = badgesFor(plan).map(b => `<span class="pc-badge pc-badge-${b.tone}">${esc(b.text)}</span>`).join('');
  const lines = highlightLines(plan, 2).map(l => `<li>${esc(l)}</li>`).join('');
  return `
    <article class="pc" data-id="${esc(plan.id)}" tabindex="0" role="button" aria-label="${esc(plan.planName)} details">
      <div class="pc-top">
        <div class="pc-title">
          <span class="pc-type">${esc(typeLabel(plan))}</span>
          <h4>${esc(plan.planName)}</h4>
          <p class="pc-carrier">${esc(companyOf(plan))}</p>
        </div>
        ${priceHtml}
      </div>
      ${facts.length ? `<div class="pc-facts">${facts.join('')}</div>` : ''}
      ${badges ? `<div class="pc-badges">${badges}</div>` : ''}
      ${lines ? `<ul class="pc-lines">${lines}</ul>` : ''}
      <div class="pc-foot"><span class="pc-more">See details &amp; pricing ›</span></div>
    </article>
  `;
}

function groupSectionHtml(key, label, desc, plans, open) {
  const prices = plans.map(startingPrice).filter(p => p !== null);
  const from = prices.length ? `from ${formatMoney(Math.min(...prices))}/mo` : '';
  return `
    <details class="plan-group" ${open ? 'open' : ''} data-group="${esc(key)}">
      <summary>
        <span class="pg-title">${esc(label)}</span>
        <span class="pg-meta">${plans.length} plan${plans.length === 1 ? '' : 's'}${from ? ' · ' + from : ''}</span>
        <span class="pg-chevron" aria-hidden="true">›</span>
      </summary>
      ${desc ? `<p class="pg-desc">${esc(desc)}</p>` : ''}
      <div class="plan-list">${plans.map(planCardHtml).join('')}</div>
    </details>
  `;
}

function renderPathPicker() {
  document.querySelectorAll('.path-btn').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.path === state.path);
  });
  const browse = document.getElementById('browse');
  const picker = document.getElementById('path-picker');
  browse.hidden = !state.path;
  picker.classList.toggle('compact', !!state.path);

  const p = PATHS[state.path] || null;
  const titleEl = document.getElementById('page-title');
  const leadEl = document.getElementById('page-lead');
  titleEl.textContent = p ? p.title : 'Find Your Plan';
  leadEl.textContent = p ? p.lead : 'Start here — which describes you?';

  document.getElementById('business-intro').hidden = state.path !== 'business';
  const cross = document.getElementById('cross-link');
  if (state.path === 'business') {
    cross.innerHTML = `Self-employed folks can also buy <a href="#" data-set-path="individual">Individual &amp; Family plans ›</a>`;
    cross.hidden = false;
  } else if (state.path === 'individual') {
    cross.innerHTML = `Self-employed or own a business? You may qualify for <a href="#" data-set-path="business">more plans ›</a>`;
    cross.hidden = false;
  } else {
    cross.hidden = true;
  }
}

function renderToolbar() {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === state.tab));

  const chipWrap = document.getElementById('group-chips');
  if (state.tab === 'health') {
    const avail = GROUPS.filter(g => pathPlans().some(p => needGroupOf(p) === g.key));
    chipWrap.innerHTML = [{ key: 'all', label: 'All Health Plans' }, ...avail]
      .map(g => `<button class="chip ${state.group === g.key ? 'active' : ''}" data-group="${g.key}">${esc(g.label)}</button>`).join('');
    chipWrap.hidden = false;
  } else {
    chipWrap.innerHTML = '';
    chipWrap.hidden = true;
  }

  const n = activeFilterCount();
  document.getElementById('filter-count').textContent = n ? `(${n})` : '';
}

function renderFilterSheetOptions() {
  const companies = [...new Set(pathPlans()
    .filter(p => (state.tab === 'health') === (p.category === 'major-medical'))
    .map(companyOf))].sort();
  const companySel = document.getElementById('f-company');
  companySel.innerHTML = `<option value="all">All companies</option>` + companies.map(c => `<option ${state.company === c ? 'selected' : ''}>${esc(c)}</option>`).join('');
  if (!companies.includes(state.company)) state.company = 'all';
  companySel.value = state.company;
  document.getElementById('f-network-wrap').hidden = state.tab !== 'health';
  document.getElementById('f-network').value = state.network;
  document.getElementById('f-price').value = String(state.maxPrice || 0);
  document.getElementById('sort-select').value = state.sort;
}

function renderPlans() {
  const container = document.getElementById('plans-container');
  const countEl = document.getElementById('results-count');
  const noResults = document.getElementById('no-results');
  if (!state.path) { container.innerHTML = ''; return; }

  const list = sortPlans(filteredPlans());
  countEl.textContent = `${list.length} plan${list.length === 1 ? '' : 's'}`;
  noResults.hidden = list.length > 0;

  const quizBanner = document.getElementById('quiz-banner');
  quizBanner.hidden = !state.quizActive;
  if (state.quizActive) document.getElementById('quiz-banner-text').textContent = state.quizNote || 'Showing plans that match your answers.';

  const grouped = state.sort === 'recommended' && !activeFilterCount() && (state.tab === 'addons' || state.group === 'all') && !state.quizActive;

  let html = '';
  if (grouped && state.tab === 'health') {
    let first = true;
    GROUPS.forEach(g => {
      const plans = list.filter(p => needGroupOf(p) === g.key);
      if (!plans.length) return;
      html += groupSectionHtml(g.key, g.long, g.desc, plans, first);
      first = false;
    });
  } else if (grouped && state.tab === 'addons') {
    let first = true;
    ADDON_GROUPS.forEach(g => {
      const plans = list.filter(p => addonGroupOf(p) === g.key);
      if (!plans.length) return;
      html += groupSectionHtml(g.key, g.label, '', plans, first);
      first = false;
    });
    html = `<p class="addon-note">Some add-ons can only be bought with that company's medical plan — look for the gold tag. Standalone plans work with any coverage.</p>` + html;
  } else {
    const g = GROUPS.find(x => x.key === state.group);
    if (g && state.tab === 'health') html += `<p class="pg-desc pg-desc-flat">${esc(g.desc)}</p>`;
    html += `<div class="plan-list">${list.map(planCardHtml).join('')}</div>`;
  }
  container.innerHTML = html;
}

function render() {
  renderPathPicker();
  if (!state.path) { renderPlans(); return; }
  renderToolbar();
  renderFilterSheetOptions();
  renderPlans();
  const activeChip = document.querySelector('#group-chips .chip.active');
  if (activeChip) {
    const wrap = activeChip.parentElement;
    wrap.scrollLeft = activeChip.offsetLeft - wrap.offsetLeft - 16;
  }
}

/* ---------- plan details sheet ---------- */

// Shorter household labels so a 4-column rate table fits on a phone
function shortHousehold(label) {
  return String(label)
    .replace(/^(Employee|Member|Individual|Policyholder)( Only)?$/i, 'You')
    .replace(/^(Employee|Member|Individual|Policyholder)\s*(\+|&)\s*/i, '+ ')
    .replace(/Child\(ren\)|Children|Child/i, 'Kids')
    .replace(/^\+ Family$/i, 'Family');
}

function rateTableHtml(table) {
  return `
    <div class="rate-table-wrap">
      <table class="rate-table">
        <thead><tr><th>${esc(table.rowHeader || 'Age')}</th>${table.columns.map(c => `<th title="${esc(c)}">${esc(shortHousehold(c))}</th>`).join('')}</tr></thead>
        <tbody>${table.rows.map(r => `<tr><td>${esc(r.label)}</td>${r.prices.map(p => `<td>${formatMoney(p)}</td>`).join('')}</tr>`).join('')}</tbody>
      </table>
    </div>
  `;
}

function associationBoxHtml() {
  return `
    <div class="assoc-box">
      <h4>AmeriBenefit membership required</h4>
      <p>AmeriBenefit plans require a business EIN to apply. To get an AmeriBenefit medical plan you also join the AmeriBenefit association. Pick one level — the monthly fee is added to your plan rate.</p>
      <div class="assoc-levels">
        ${ASSOCIATION_LEVELS.map(l => `
          <details class="assoc-level">
            <summary><span class="assoc-name">${l.name}</span><span class="assoc-price">${formatMoney(l.price)}<span>/mo</span></span></summary>
            <ul>${l.perks.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
          </details>`).join('')}
      </div>
      <a class="assoc-pdf" href="docs/brochures/ameribenefit-association-plans.pdf" target="_blank" rel="noopener">📄 Full membership comparison (PDF)</a>
    </div>
  `;
}

function healthTierHtml(plan) {
  const tiers = Object.keys(plan.healthTierRates);
  const all = Object.keys(HEALTH_TIERS);
  return `
    <div class="tier-explain">
      <strong>How pricing works:</strong> AmeriBenefit plans are medically underwritten, but <b>you can't be declined</b>. Your rate is based on your health tier.
    </div>
    <div class="tier-tabs" role="tablist">
      ${all.map((t, i) => {
        const has = tiers.includes(t);
        return `<button class="tier-tab ${i === 0 ? 'active' : ''}" data-tier="${t}" ${has ? '' : 'disabled'}>
          <b>${t}</b><span>${has ? HEALTH_TIERS[t] : 'Not offered'}</span></button>`;
      }).join('')}
    </div>
    ${tiers.map((t, i) => `<div class="tier-panel" data-tier="${t}" ${i === 0 ? '' : 'hidden'}>${rateTableHtml(plan.healthTierRates[t])}</div>`).join('')}
    <p class="fine">Rates don't include the association membership fee.</p>
  `;
}

function providerBoxHtml(entry) {
  return `
    <div class="provider-search-box">
      <h4>${esc(entry.label)}</h4>
      ${entry.note ? `<p class="provider-note">${esc(entry.note)}</p>` : ''}
      <ol>${entry.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol>
      <a href="${entry.url}" target="_blank" rel="noopener">Open search ›</a>
    </div>
  `;
}

function addonsForPlanHtml(plan) {
  if (plan.category !== 'major-medical') return '';
  const addons = state.plans.filter(p => p.category !== 'major-medical' && p.program === plan.program);
  if (!addons.length) return '';
  return `
    <div class="modal-block">
      <h4>Add dental, vision &amp; more</h4>
      <p class="fine">Offered alongside ${esc(companyOf(plan))} medical plans.</p>
      <div class="addon-rows">
        ${addons.map(a => `
          <button class="addon-row" data-open="${esc(a.id)}">
            <span><b>${esc(a.planName)}</b><small>${esc(typeLabel(a))}</small></span>
            <span class="addon-price">${startingPrice(a) === null ? 'Call' : formatMoney(startingPrice(a)) + '/mo'}</span>
          </button>`).join('')}
      </div>
    </div>
  `;
}

function openPlanModal(id) {
  const plan = state.plans.find(p => p.id === id);
  if (!plan) return;

  let pricingHtml = '';
  if (plan.healthTierRates) {
    pricingHtml = healthTierHtml(plan);
  } else if (plan.rateTable) {
    pricingHtml = rateTableHtml(plan.rateTable);
  } else if (plan.rateTiers && plan.rateTiers.length) {
    pricingHtml = `<div class="price-grid">${plan.rateTiers.map(t => `<div><strong>${formatMoney(t.price)}</strong><span>${esc(t.label)}</span></div>`).join('')}</div>`;
  } else {
    pricingHtml = `<div class="price-grid">
      <div><strong>${formatMoney(plan.monthlyPriceIndividual)}</strong><span>${plan.monthlyPriceIndividual !== null ? esc(priceUnit(plan)) : esc(plan.priceNote || '')}</span></div>
      ${plan.monthlyPriceFamily !== null && plan.monthlyPriceFamily !== undefined ? `<div><strong>${formatMoney(plan.monthlyPriceFamily)}</strong><span>/mo family</span></div>` : ''}
    </div>`;
  }

  const keyFacts = [];
  if (plan.deductible !== null && plan.deductible !== undefined) keyFacts.push(`<div><strong>${formatMoney(plan.deductible)}</strong><span>deductible</span></div>`);
  if (plan.outOfPocketMax) keyFacts.push(`<div><strong>${formatMoney(plan.outOfPocketMax)}</strong><span>out-of-pocket max</span></div>`);
  if (networkOf(plan)) keyFacts.push(`<div><strong>${esc(networkOf(plan))}</strong><span>network</span></div>`);

  const badges = badgesFor(plan).map(b => `<span class="pc-badge pc-badge-${b.tone}">${esc(b.text)}</span>`).join('');
  const benefits = (plan.keyBenefits || []).filter(b => !/^Rate is/i.test(b)).map(b => `<li>${esc(b)}</li>`).join('');
  const docs = docLinks(plan).map(d => `<a href="${d.url}" target="_blank" rel="noopener">📄 ${esc(d.label)}</a>`).join('');
  const providers = networkOf(plan) ? (PROVIDER_SEARCH[networkOf(plan)] || []).filter(e => !(e.label.startsWith('MagnaCare') && plan.program !== 'lifex')) : [];

  document.getElementById('modal-body').innerHTML = `
    <span class="pc-type">${esc(typeLabel(plan))}</span>
    <h3>${esc(plan.planName)}</h3>
    <p class="carrier">${esc(plan.carrier)}</p>
    ${badges ? `<div class="pc-badges">${badges}</div>` : ''}
    ${keyFacts.length ? `<div class="price-grid key-facts">${keyFacts.join('')}</div>` : ''}
    <div class="modal-block">
      <h4>Monthly pricing</h4>
      ${pricingHtml}
    </div>
    ${plan.program === 'ameribenefit' ? associationBoxHtml() : ''}
    <div class="modal-block">
      <h4>What's covered</h4>
      <ul>${benefits}</ul>
      ${plan.description ? `<p class="fine">${esc(plan.description)}</p>` : ''}
    </div>
    ${docs ? `<div class="doc-links">${docs}</div>` : ''}
    ${addonsForPlanHtml(plan)}
    ${providers.length ? `
      <details class="modal-block provider-details">
        <summary>Is my doctor in-network? ›</summary>
        ${providers.map(providerBoxHtml).join('')}
      </details>` : ''}
    <a href="index.html?plan=${encodeURIComponent(plan.planName)}#contact" class="btn btn-primary btn-block modal-cta">Talk to an Agent About This Plan</a>
  `;
  openSheet('plan-modal');
  document.getElementById('plan-modal').querySelector('.modal').scrollTop = 0;
}

/* ---------- sheets (modal, doctor search, filters, quiz) ---------- */

function openSheet(id) {
  document.getElementById(id).classList.add('open');
  document.body.classList.add('sheet-open');
}
function closeSheet(id) {
  document.getElementById(id).classList.remove('open');
  if (!document.querySelector('.modal-overlay.open')) document.body.classList.remove('sheet-open');
}

function renderDoctorSheet() {
  document.getElementById('doctor-body').innerHTML = `
    <h3>Check if your doctor is in-network</h3>
    <p class="fine">Each plan shows its network on the card. Pick the matching search below.</p>
    ${NETWORKS.map(n => `
      <details class="modal-block provider-details">
        <summary>${esc(n)} ›</summary>
        ${(PROVIDER_SEARCH[n] || []).map(providerBoxHtml).join('')}
      </details>`).join('')}
  `;
}

/* ---------- quiz ---------- */

const quiz = { step: 0, answers: {} };

function quizSteps() {
  return [
    {
      key: 'path',
      q: 'Are you self-employed or do you own a business?',
      opts: [
        { v: 'business', t: 'Yes — self-employed, 1099, or business owner' },
        { v: 'individual', t: 'No' }
      ]
    },
    {
      key: 'priority',
      q: 'What matters most to you?',
      opts: [
        { v: 'cheap', t: 'Lowest monthly cost' },
        { v: 'lowded', t: 'Low deductible — fewer surprise bills' },
        { v: 'hsa', t: 'HSA tax savings' },
        { v: 'full', t: 'Solid coverage for big medical bills' },
        { v: 'basic', t: 'Just checkups & preventive care' }
      ]
    },
    {
      key: 'budget',
      q: 'Monthly budget for one person?',
      opts: [
        { v: 300, t: 'Under $300' },
        { v: 500, t: 'Under $500' },
        { v: 700, t: 'Under $700' },
        { v: 0, t: 'No set budget' }
      ]
    }
  ];
}

function renderQuiz() {
  const steps = quizSteps();
  const s = steps[quiz.step];
  document.getElementById('quiz-body').innerHTML = `
    <div class="quiz-progress">Question ${quiz.step + 1} of ${steps.length}</div>
    <h3>${esc(s.q)}</h3>
    <div class="quiz-opts">
      ${s.opts.map(o => `<button class="quiz-opt" data-v="${esc(o.v)}">${esc(o.t)}</button>`).join('')}
    </div>
    ${quiz.step > 0 ? `<button class="link-btn" id="quiz-back">‹ Back</button>` : ''}
  `;
}

function finishQuiz() {
  const a = quiz.answers;
  resetFilters();
  state.path = a.path;
  state.tab = 'health';
  const notes = [];
  const pmap = { cheap: ['all', 'price'], lowded: ['major', 'deductible'], hsa: ['hsa', 'price'], full: ['major', 'price'], basic: ['basic', 'price'] };
  let [group, sort] = pmap[a.priority] || ['all', 'price'];
  const hasGroup = g => g === 'all' || pathPlans().some(p => needGroupOf(p) === g);
  if (!hasGroup(group)) {
    notes.push(group === 'basic' ? 'Showing our lowest-cost plans.' : 'Showing the closest match.');
    group = group === 'basic' ? 'value' : 'all';
    if (!hasGroup(group)) group = 'all';
  }
  state.group = group;
  state.sort = sort;
  state.maxPrice = Number(a.budget) || 0;
  if (state.maxPrice && !filteredPlans().length) {
    notes.push(`(Nothing under ${formatMoney(state.maxPrice)}, so showing all prices.)`);
    state.maxPrice = 0;
  }
  state.quizActive = true;
  state.quizNote = ['Your matches, lowest price first.', ...notes].join(' ');
  closeSheet('quiz-modal');
  syncUrl();
  render();
  document.getElementById('browse').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ---------- state + URL ---------- */

function resetFilters() {
  state.group = 'all';
  state.network = 'all';
  state.company = 'all';
  state.maxPrice = 0;
  state.sort = 'recommended';
  state.quizActive = false;
  state.quizNote = '';
}

function syncUrl() {
  const params = new URLSearchParams(window.location.search);
  ['category'].forEach(k => params.delete(k));
  const set = (k, v, def) => { if (v && v !== def) params.set(k, v); else params.delete(k); };
  set('path', state.path, null);
  set('tab', state.tab, 'health');
  set('group', state.group, 'all');
  const qs = params.toString();
  history.replaceState(null, '', window.location.pathname + (qs ? '?' + qs : '') + window.location.hash);
}

function readUrl() {
  const params = new URLSearchParams(window.location.search);
  const path = params.get('path');
  if (['business', 'individual', 'all'].includes(path)) state.path = path;
  const tab = params.get('tab');
  const category = params.get('category');
  if (tab === 'addons' || category === 'supplemental') state.tab = 'addons';
  if (category && !state.path) state.path = 'all';
  const group = params.get('group');
  if (GROUPS.some(g => g.key === group)) state.group = group;
}

/* ---------- events ---------- */

function bindEvents() {
  document.addEventListener('click', e => {
    const pathBtn = e.target.closest('[data-set-path], .path-btn');
    if (pathBtn) {
      e.preventDefault();
      const newPath = pathBtn.dataset.setPath || pathBtn.dataset.path;
      if (newPath !== state.path) resetFilters();
      state.path = newPath;
      syncUrl();
      render();
      document.getElementById('browse').scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    const tabBtn = e.target.closest('.tab-btn');
    if (tabBtn) {
      state.tab = tabBtn.dataset.tab;
      state.group = 'all';
      state.company = 'all';
      state.quizActive = false;
      syncUrl();
      render();
      return;
    }

    const chip = e.target.closest('#group-chips .chip');
    if (chip) {
      state.group = chip.dataset.group;
      state.quizActive = false;
      syncUrl();
      render();
      return;
    }

    const card = e.target.closest('.pc');
    if (card) { openPlanModal(card.dataset.id); return; }

    const addon = e.target.closest('[data-open]');
    if (addon) { openPlanModal(addon.dataset.open); return; }

    const tierTab = e.target.closest('.tier-tab');
    if (tierTab && !tierTab.disabled) {
      const box = tierTab.closest('.modal');
      box.querySelectorAll('.tier-tab').forEach(t => t.classList.toggle('active', t === tierTab));
      box.querySelectorAll('.tier-panel').forEach(p => { p.hidden = p.dataset.tier !== tierTab.dataset.tier; });
      return;
    }

    if (e.target.closest('[data-open-doctor]')) { e.preventDefault(); renderDoctorSheet(); openSheet('doctor-modal'); return; }
    if (e.target.closest('#open-filters')) { renderFilterSheetOptions(); openSheet('filter-modal'); return; }
    if (e.target.closest('[data-open-quiz]')) { e.preventDefault(); quiz.step = 0; quiz.answers = {}; renderQuiz(); openSheet('quiz-modal'); return; }

    const opt = e.target.closest('.quiz-opt');
    if (opt) {
      const s = quizSteps()[quiz.step];
      quiz.answers[s.key] = opt.dataset.v;
      if (quiz.step < quizSteps().length - 1) { quiz.step++; renderQuiz(); } else { finishQuiz(); }
      return;
    }
    if (e.target.closest('#quiz-back')) { quiz.step = Math.max(0, quiz.step - 1); renderQuiz(); return; }

    if (e.target.closest('#quiz-clear') || e.target.closest('#f-clear') || e.target.closest('#no-results-clear')) {
      resetFilters();
      closeSheet('filter-modal');
      syncUrl();
      render();
      return;
    }
    if (e.target.closest('#f-apply')) { closeSheet('filter-modal'); return; }

    const closeBtn = e.target.closest('[data-close]');
    if (closeBtn) { closeSheet(closeBtn.dataset.close); return; }
    if (e.target.classList.contains('modal-overlay')) { closeSheet(e.target.id); return; }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') document.querySelectorAll('.modal-overlay.open').forEach(m => closeSheet(m.id));
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('pc')) {
      e.preventDefault();
      openPlanModal(e.target.dataset.id);
    }
  });

  document.getElementById('sort-select').addEventListener('change', e => { state.sort = e.target.value; state.quizActive = false; render(); });
  document.getElementById('f-network').addEventListener('change', e => { state.network = e.target.value; state.quizActive = false; render(); });
  document.getElementById('f-company').addEventListener('change', e => { state.company = e.target.value; state.quizActive = false; render(); });
  document.getElementById('f-price').addEventListener('change', e => { state.maxPrice = Number(e.target.value) || 0; state.quizActive = false; render(); });
}

/* ---------- init ---------- */

state.plans = PLANS_DATA.plans;
readUrl();
bindEvents();
render();
