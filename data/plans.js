/*
  REAL PLAN DATA from Ascend Benefits Consulting Group (Amerus Summit Health
  Plans / AmeriShield product lineup), loaded 2026-08-18. All 12 plans have
  real monthly pricing.

  Known gaps — see chat for full notes:
  - No separate SBC document was provided for: PHCS, Maintenance Plan High/Low,
    Dental, Vision, Accident, Critical Illness, Term Life (both). Only the
    brochure link shows for these until/if an SBC is provided.
  - TEMPORARY: states are set to ["ALL"] for every plan per owner decision on
    2026-08-18, even though several source brochures showed a Texas situs
    state (Dental, Vision, Accident) or a 44-state list missing KY/MA/ND/OK/VA
    (both Term Life docs). Revisit and set real per-state availability before
    this site goes live — selling a plan in a state where it isn't filed is a
    compliance problem.
  - Age-banded plans (Maintenance High/Low, Critical Illness, both Term Life)
    show a "starting at" price on cards using the youngest/cheapest band; the
    full pricing table only appears in the plan detail modal.
*/
const PLANS_DATA = {
  plans: [
    {
      id: "cigna-epo",
      category: "major-medical",
      subType: "EPO",
      carrier: "Amerus Summit Health Plans",
      planName: "Ultimate EPO",
      tier: "N/A",
      network: "Cigna",
      monthlyPriceIndividual: 699.95,
      monthlyPriceFamily: 2149.95,
      rateTiers: [
        { label: "Member Only", price: 699.95 },
        { label: "Member + Spouse", price: 1549.95 },
        { label: "Member + Children", price: 1449.95 },
        { label: "Family", price: 2149.95 }
      ],
      deductible: 0,
      outOfPocketMax: 3500,
      states: ["ALL"],
      keyBenefits: [
        "Cigna EPO network — no specialist referral needed",
        "$0 in-network deductible",
        "$3,500 individual / $7,000 family out-of-pocket max (in-network)",
        "$40 primary care / $60 specialist copay",
        "Preventive care covered at no charge"
      ],
      brochureUrl: "docs/brochures/cigna-epo-brochure.pdf",
      sbcUrl: "docs/sbc/cigna-epo-sbc.pdf",
      description: "Cigna EPO network access with no deductible and predictable copays for everyday care. Out-of-network care is not covered except emergencies."
    },
    {
      id: "cigna-ppo",
      category: "major-medical",
      subType: "PPO",
      carrier: "Amerus Summit Health Plans",
      planName: "Ultimate PPO",
      tier: "N/A",
      network: "Cigna",
      monthlyPriceIndividual: 949.00,
      monthlyPriceFamily: 2299.00,
      rateTiers: [
        { label: "Member Only", price: 949.00 },
        { label: "Member + Spouse", price: 1799.00 },
        { label: "Member + Children", price: 1699.00 },
        { label: "Family", price: 2299.00 }
      ],
      deductible: 0,
      outOfPocketMax: 0,
      states: ["ALL"],
      keyBenefits: [
        "Cigna PPO network — no specialist referral needed",
        "$0 in-network deductible and $0 in-network out-of-pocket max",
        "Most in-network care covered at no charge",
        "Out-of-network coverage available (higher cost-share)",
        "Nationwide Cigna provider network"
      ],
      brochureUrl: "docs/brochures/cigna-ppo-brochure.pdf",
      sbcUrl: "docs/sbc/cigna-ppo-sbc.pdf",
      description: "The richest plan in the lineup — in-network care is covered at no charge, with no deductible and no out-of-pocket maximum to reach."
    },
    {
      id: "phcs",
      category: "major-medical",
      subType: "PHCS Network",
      carrier: "Amerus Summit Health Plans",
      planName: "PHCS",
      tier: "N/A",
      network: "PHCS",
      monthlyPriceIndividual: 482.95,
      monthlyPriceFamily: 960.42,
      rateTiers: [
        { label: "Individual", price: 482.95 },
        { label: "Individual + Spouse", price: 737.08 },
        { label: "Individual + Child(ren)", price: 756.01 },
        { label: "Family", price: 960.42 }
      ],
      deductible: 0,
      outOfPocketMax: 4000,
      states: ["ALL"],
      keyBenefits: [
        "PHCS provider network",
        "$0 deductible; 40% member / 60% carrier coinsurance",
        "$4,000 individual / $8,000 family out-of-pocket max",
        "$50 primary care / $75 specialist copay",
        "Prescription discount card (not an insured drug benefit)"
      ],
      brochureUrl: "docs/brochures/phcs-brochure.pdf",
      sbcUrl: null,
      description: "The lowest-cost major medical option in the lineup, using the PHCS network with fixed copays for everyday visits and coinsurance for facility care."
    },
    {
      id: "maintenance-plan-high",
      category: "major-medical",
      subType: "Fixed Indemnity",
      carrier: "Amerus Summit Health Plans",
      planName: "Maintenance Plan High",
      tier: "N/A",
      network: null,
      monthlyPriceIndividual: 226.44,
      monthlyPriceFamily: null,
      priceUnitLabel: "starting /mo",
      rateTable: {
        columns: ["Member Only", "Member + Spouse", "Member + Child", "Family"],
        rows: [
          { label: "18-29", prices: [226.44, 486.19, 492.01, 763.77] },
          { label: "30-39", prices: [326.38, 617.43, 567.38, 911.06] },
          { label: "40-49", prices: [373.14, 768.10, 641.14, 1059.12] },
          { label: "50-70", prices: [504.12, 1021.74, 769.47, 1299.46] }
        ]
      },
      deductible: null,
      outOfPocketMax: null,
      states: ["ALL"],
      keyBenefits: [
        "Rate is age-banded and varies by household tier — see the full pricing table",
        "Pays scheduled cash benefits directly for covered services (not deductible/coinsurance based)",
        "$2,000 inpatient hospital confinement benefit; $4,000 ICU confinement benefit",
        "$225 office visit benefit; $100 prescription benefit ($1,000/yr max)",
        "$500 emergency room benefit; $500 urgent care benefit",
        "$1,000,000 calendar-year hospital confinement max; $5,000,000 lifetime max"
      ],
      brochureUrl: "docs/brochures/maintenance-plan-high-brochure.pdf",
      sbcUrl: null,
      description: "A fixed-benefit (indemnity) plan that pays scheduled cash amounts per covered service. Rate shown is the starting price (age 18-29, Member Only) — see the full age/tier pricing table. Rates include a $24.95/mo association fee and a one-time $99 first-month fee."
    },
    {
      id: "maintenance-plan-low",
      category: "major-medical",
      subType: "Fixed Indemnity",
      carrier: "Amerus Summit Health Plans",
      planName: "Maintenance Plan Low",
      tier: "N/A",
      network: null,
      monthlyPriceIndividual: 141.64,
      monthlyPriceFamily: null,
      priceUnitLabel: "starting /mo",
      rateTable: {
        columns: ["Member Only", "Member + Spouse", "Member + Child", "Family"],
        rows: [
          { label: "18-29", prices: [141.64, 299.38, 301.52, 452.87] },
          { label: "30-39", prices: [178.93, 359.11, 334.12, 526.43] },
          { label: "40-49", prices: [216.48, 453.33, 389.17, 628.11] },
          { label: "50-70", prices: [326.44, 608.14, 463.29, 771.68] }
        ]
      },
      deductible: null,
      outOfPocketMax: null,
      states: ["ALL"],
      keyBenefits: [
        "Rate is age-banded and varies by household tier — see the full pricing table",
        "Pays scheduled cash benefits directly for covered services (not deductible/coinsurance based)",
        "$1,000 inpatient hospital confinement benefit; $2,250 ICU confinement benefit",
        "$125 office visit benefit; $50 prescription benefit ($500/yr max)",
        "$300 emergency room benefit; $300 urgent care benefit",
        "$1,000,000 calendar-year hospital confinement max; $5,000,000 lifetime max"
      ],
      brochureUrl: "docs/brochures/maintenance-plan-low-brochure.pdf",
      sbcUrl: null,
      description: "A lower-cost fixed-benefit (indemnity) plan paying scheduled cash amounts per covered service. Rate shown is the starting price (age 18-29, Member Only) — see the full age/tier pricing table. Rates include a $24.95/mo association fee and a one-time $99 first-month fee."
    },
    {
      id: "dental",
      category: "supplemental",
      subType: "Dental",
      carrier: "Humana (Amerus Summit Dental)",
      planName: "Dental Traditional Plus",
      tier: "N/A",
      monthlyPriceIndividual: 79.95,
      monthlyPriceFamily: 279.95,
      rateTiers: [
        { label: "Member", price: 79.95 },
        { label: "Member + Spouse", price: 159.95 },
        { label: "Member + Child", price: 199.95 },
        { label: "Family", price: 279.95 }
      ],
      deductible: 50,
      outOfPocketMax: null,
      states: ["ALL"],
      keyBenefits: [
        "100% preventive care, no deductible (cleanings, exams, X-rays)",
        "80% basic services after deductible (fillings, extractions)",
        "50% major services after deductible (crowns, bridges, root canals)",
        "$50 individual / $150 family deductible; unlimited annual maximum",
        "Child orthodontia: 50% coverage up to $1,500 lifetime max"
      ],
      brochureUrl: "docs/brochures/dental-brochure.pdf",
      sbcUrl: null,
      description: "Humana Dental Traditional Plus, offered through Amerus Summit Dental (plan TX Trad+ O1.5K INFS+ 100/80/50). Situs state shown as Texas — confirm availability in other states before publishing."
    },
    {
      id: "vision",
      category: "supplemental",
      subType: "Vision",
      carrier: "Humana (Amerus Summit Vision)",
      planName: "Vision 200",
      tier: "N/A",
      monthlyPriceIndividual: 79.95,
      monthlyPriceFamily: 279.95,
      rateTiers: [
        { label: "Member", price: 79.95 },
        { label: "Member + Spouse", price: 159.95 },
        { label: "Member + Child", price: 199.95 },
        { label: "Family", price: 279.95 }
      ],
      deductible: 0,
      outOfPocketMax: null,
      states: ["ALL"],
      keyBenefits: [
        "$0 eye exam with dilation as necessary",
        "$0 standard single/bifocal/trifocal/lenticular lenses",
        "$200 frame allowance (20% off balance) every 24 months",
        "$200 allowance for contact lenses (conventional or disposable)",
        "Exam and lenses/contacts covered once every 12 months"
      ],
      brochureUrl: "docs/brochures/vision-brochure.pdf",
      sbcUrl: null,
      description: "Humana Vision 200, offered through Amerus Summit Vision (plan TXHLJ4UEN). Situs state shown as Texas — confirm availability in other states before publishing."
    },
    {
      id: "accident",
      category: "supplemental",
      subType: "Accident",
      carrier: "AmeriShield",
      planName: "Accident Indemnity Plus - Preferred",
      tier: "N/A",
      monthlyPriceIndividual: 32.33,
      monthlyPriceFamily: 89.88,
      rateTiers: [
        { label: "Member", price: 32.33 },
        { label: "Member + Spouse", price: 56.83 },
        { label: "Member + Child", price: 70.48 },
        { label: "Family", price: 89.88 }
      ],
      deductible: null,
      outOfPocketMax: null,
      states: ["ALL"],
      keyBenefits: [
        "24-hour accident coverage with no annual maximum — benefits reset each accident",
        "$75,000 accidental death benefit; $75,000 double dismemberment benefit",
        "$1,500 first hospitalization benefit; $300/day hospital confinement",
        "Guaranteed issue for employee, spouse, and children",
        "Scheduled cash benefits for fractures, dislocations, burns, and more"
      ],
      brochureUrl: "docs/brochures/accident-brochure.pdf",
      sbcUrl: null,
      description: "AmeriShield Accident Indemnity Plus pays scheduled cash benefits after a covered injury, in addition to any other coverage you have. Situs state: Texas."
    },
    {
      id: "critical-illness",
      category: "supplemental",
      subType: "Critical Illness",
      carrier: "AmeriShield",
      planName: "Critical Illness & Cancer Protection",
      tier: "N/A",
      monthlyPriceIndividual: 16.58,
      monthlyPriceFamily: null,
      priceUnitLabel: "starting /mo",
      rateTiers: [
        { label: "Age 18-29", price: 16.58 },
        { label: "Age 30-39", price: 29.87 },
        { label: "Age 40-49", price: 68.12 },
        { label: "Age 50-59", price: 131.14 },
        { label: "Age 60-64", price: 211.14 }
      ],
      deductible: null,
      outOfPocketMax: null,
      states: ["ALL"],
      keyBenefits: [
        "Rate is age-banded — priced by the enrollee's age at signup, not a flat rate",
        "Lump-sum cash benefit on diagnosis of a covered condition (cancer, heart attack, stroke, and more)",
        "$20,000 employee guaranteed-issue benefit; up to $50,000 simplified issue",
        "Coverage options for spouse (up to $25,000) and children ($5,000)",
        "Recurrence benefit after 12 treatment-free months on the same condition",
        "Wellness screening benefit and portability included"
      ],
      brochureUrl: "docs/brochures/critical-illness-brochure.pdf",
      sbcUrl: null,
      description: "AmeriShield Critical Illness & Cancer Protection pays a lump sum after diagnosis of a covered condition. Rate shown is the starting price for ages 18-29 — see the age-band pricing table for your rate. State availability not confirmed in the source brochure — verify before publishing."
    },
    {
      id: "term-life-enrollee",
      category: "supplemental",
      subType: "Term Life",
      carrier: "AmeriShield",
      planName: "20-Year Group Term Life (Employee)",
      tier: "N/A",
      monthlyPriceIndividual: 8.51,
      monthlyPriceFamily: null,
      priceUnitLabel: "starting /mo",
      rateTiers: [
        { label: "Age 18-25", price: 8.51 },
        { label: "Age 26-35", price: 10.68 },
        { label: "Age 36-45", price: 17.54 },
        { label: "Age 46-55", price: 35.10 },
        { label: "Age 56-60", price: 58.35 }
      ],
      deductible: null,
      outOfPocketMax: null,
      states: ["ALL"],
      keyBenefits: [
        "Rate is age-banded — priced by the enrollee's age at signup, not a flat rate",
        "20-year level term life insurance, renewable to age 80",
        "$25,000 guaranteed-issue benefit; simplified issue up to $100,000",
        "Terminal illness benefit included (not available in New York)",
        "Portable after 6 months of coverage (not available in CA, OH, VT)",
        "Convertible without evidence of insurability (under age 65, 5+ years on policy)"
      ],
      brochureUrl: "docs/brochures/term-life-enrollee-brochure.pdf",
      sbcUrl: null,
      description: "AmeriShield 20-Year Group Term Life for the enrollee/employee. Rate shown is the starting price for ages 18-25 — see the age-band pricing table for your rate."
    },
    {
      id: "term-life-spouse",
      category: "supplemental",
      subType: "Term Life",
      carrier: "AmeriShield",
      planName: "20-Year Group Term Life (Spouse)",
      tier: "N/A",
      monthlyPriceIndividual: 7.28,
      monthlyPriceFamily: null,
      priceUnitLabel: "starting /mo",
      rateTiers: [
        { label: "Age 18-25", price: 7.28 },
        { label: "Age 26-35", price: 9.13 },
        { label: "Age 36-45", price: 15.47 },
        { label: "Age 46-55", price: 32.60 },
        { label: "Age 56-60", price: 51.35 }
      ],
      deductible: null,
      outOfPocketMax: null,
      states: ["ALL"],
      keyBenefits: [
        "Rate is age-banded — priced by the spouse's age at signup, not a flat rate",
        "20-year level term life insurance for spouse, issue ages 18-60",
        "$10,000 guaranteed-issue benefit; simplified issue up to $50,000",
        "Coverage follows the employee's term; spouse covered to age 60",
        "Terminal illness benefit included (not available in New York)",
        "Convertible before age 65, subject to conversion limits"
      ],
      brochureUrl: "docs/brochures/term-life-spouse-brochure.pdf",
      sbcUrl: null,
      description: "Spouse rider under the AmeriShield 20-Year Group Term Life plan. Requires the employee's coverage to be in force. Rate shown is the starting price for ages 18-25 — see the age-band pricing table for your rate."
    },

    /* ---- LifeX Research Corp plans, loaded 2026-08-18 ---- */

    {
      id: "lifex-mm-1000",
      category: "major-medical",
      subType: "LifeX MM",
      carrier: "LifeX Research Corp",
      planName: "MM $1,000",
      tier: "N/A",
      network: "PHCS PPO",
      monthlyPriceIndividual: 811.00,
      monthlyPriceFamily: null,
      priceUnitLabel: "starting /mo",
      rateTable: {
        columns: ["Employee", "Employee + Spouse", "Employee + Child(ren)", "Family"],
        rows: [
          { label: "18-29", prices: [811.00, 1436.00, 1322.00, 2069.00] },
          { label: "30-44", prices: [837.00, 1487.00, 1368.00, 2145.00] },
          { label: "45-54", prices: [875.00, 1556.00, 1431.00, 2245.00] },
          { label: "55-64", prices: [969.00, 1744.00, 1601.00, 2526.00] }
        ]
      },
      deductible: 1000,
      outOfPocketMax: 10600,
      states: ["ALL"],
      keyBenefits: [
        "Rate is age-banded and varies by household tier — see the full pricing table",
        "PHCS PPO network — no specialist referral needed",
        "Unlimited annual maximum benefit",
        "$25 PCP / $40 specialist / $60 urgent care copay",
        "$0 copay unlimited telemedicine via OurLiveDoc (primary, urgent care, behavioral health)",
        "Preventive care covered at $0 copay / $0 deductible"
      ],
      brochureUrl: "docs/brochures/lifex-mm-brochure.pdf",
      sbcUrl: null,
      description: "LifeX Research Corp's entry-level Major Medical plan on the PHCS PPO network — $1,000 in-network deductible, 20% coinsurance after deductible, unlimited annual benefit. Rate shown is the starting price (age 18-29, Employee only) — see the full age/tier pricing table."
    },
    {
      id: "lifex-mm-2500",
      category: "major-medical",
      subType: "LifeX MM",
      carrier: "LifeX Research Corp",
      planName: "MM $2,500",
      tier: "N/A",
      network: "PHCS PPO",
      monthlyPriceIndividual: 703.00,
      monthlyPriceFamily: null,
      priceUnitLabel: "starting /mo",
      rateTable: {
        columns: ["Employee", "Employee + Spouse", "Employee + Child(ren)", "Family"],
        rows: [
          { label: "18-29", prices: [703.00, 1227.00, 1132.00, 1759.00] },
          { label: "30-44", prices: [725.00, 1270.00, 1194.00, 1823.00] },
          { label: "45-54", prices: [758.00, 1328.00, 1249.00, 1907.00] },
          { label: "55-64", prices: [836.00, 1485.00, 1366.00, 2141.00] }
        ]
      },
      deductible: 2500,
      outOfPocketMax: 10600,
      states: ["ALL"],
      keyBenefits: [
        "Rate is age-banded and varies by household tier — see the full pricing table",
        "PHCS PPO network — no specialist referral needed",
        "Unlimited annual maximum benefit",
        "$25 PCP / $40 specialist / $60 urgent care copay",
        "$0 copay unlimited telemedicine via OurLiveDoc (primary, urgent care, behavioral health)",
        "Preventive care covered at $0 copay / $0 deductible"
      ],
      brochureUrl: "docs/brochures/lifex-mm-brochure.pdf",
      sbcUrl: null,
      description: "LifeX Research Corp's mid-tier Major Medical plan on the PHCS PPO network — $2,500 in-network deductible, 20% coinsurance after deductible, unlimited annual benefit. Rate shown is the starting price (age 18-29, Employee only) — see the full age/tier pricing table."
    },
    {
      id: "lifex-mm-3500",
      category: "major-medical",
      subType: "LifeX MM",
      carrier: "LifeX Research Corp",
      planName: "MM $3,500",
      tier: "N/A",
      network: "PHCS PPO",
      monthlyPriceIndividual: 635.00,
      monthlyPriceFamily: null,
      priceUnitLabel: "starting /mo",
      rateTable: {
        columns: ["Employee", "Employee + Spouse", "Employee + Child(ren)", "Family"],
        rows: [
          { label: "18-29", prices: [635.00, 1094.00, 1011.00, 1562.00] },
          { label: "30-44", prices: [679.00, 1213.00, 1111.00, 1660.00] },
          { label: "45-54", prices: [708.00, 1235.00, 1141.00, 1723.00] },
          { label: "55-64", prices: [754.00, 1315.00, 1215.00, 1860.00] }
        ]
      },
      deductible: 3500,
      outOfPocketMax: 10600,
      states: ["ALL"],
      keyBenefits: [
        "Rate is age-banded and varies by household tier — see the full pricing table",
        "PHCS PPO network — no specialist referral needed",
        "Unlimited annual maximum benefit",
        "$25 PCP / $40 specialist / $60 urgent care copay",
        "$0 copay unlimited telemedicine via OurLiveDoc (primary, urgent care, behavioral health)",
        "Preventive care covered at $0 copay / $0 deductible"
      ],
      brochureUrl: "docs/brochures/lifex-mm-brochure.pdf",
      sbcUrl: null,
      description: "LifeX Research Corp's lowest-premium Major Medical plan on the PHCS PPO network — $3,500 in-network deductible, 20% coinsurance after deductible, unlimited annual benefit. Rate shown is the starting price (age 18-29, Employee only) — see the full age/tier pricing table."
    },
    {
      id: "lifex-mmplus-4900",
      category: "major-medical",
      subType: "LifeX MM+",
      carrier: "LifeX Research Corp",
      planName: "MM+ $4,900",
      tier: "N/A",
      network: "PHCS PPO",
      monthlyPriceIndividual: 612.00,
      monthlyPriceFamily: null,
      priceUnitLabel: "starting /mo",
      rateTable: {
        columns: ["Employee", "Employee + Spouse", "Employee + Child(ren)", "Family"],
        rows: [
          { label: "18-29", prices: [612.00, 1079.00, 988.00, 1551.00] },
          { label: "30-44", prices: [630.00, 1116.00, 1021.00, 1606.00] },
          { label: "45-54", prices: [658.00, 1166.00, 1067.00, 1680.00] },
          { label: "55-64", prices: [700.00, 1255.00, 1146.00, 1815.00] }
        ]
      },
      deductible: 4900,
      outOfPocketMax: 10600,
      states: ["ALL"],
      keyBenefits: [
        "Rate is age-banded and varies by household tier — see the full pricing table",
        "High-deductible PHCS PPO plan, HSA-compatible formulary",
        "Unlimited annual maximum benefit",
        "$25 PCP / $40 specialist / $60 urgent care copay",
        "$0 copay unlimited telemedicine via OurLiveDoc (primary, urgent care, behavioral health)",
        "Preventive care covered at $0 copay / $0 deductible"
      ],
      brochureUrl: "docs/brochures/lifex-mm-plus-brochure.pdf",
      sbcUrl: null,
      description: "LifeX Research Corp's high-deductible Major Medical Plus plan — $4,900 in-network deductible, HSA-compatible, 20% coinsurance after deductible, unlimited annual benefit. Rate shown is the starting price (age 18-29, Employee only) — see the full age/tier pricing table."
    },
    {
      id: "lifex-mmplus-7250",
      category: "major-medical",
      subType: "LifeX MM+",
      carrier: "LifeX Research Corp",
      planName: "MM+ $7,250",
      tier: "N/A",
      network: "PHCS PPO",
      monthlyPriceIndividual: 521.00,
      monthlyPriceFamily: null,
      priceUnitLabel: "starting /mo",
      rateTable: {
        columns: ["Employee", "Employee + Spouse", "Employee + Child(ren)", "Family"],
        rows: [
          { label: "18-29", prices: [521.00, 896.00, 823.00, 1277.00] },
          { label: "30-44", prices: [535.00, 925.00, 849.00, 1321.00] },
          { label: "45-54", prices: [559.00, 967.00, 888.00, 1381.00] },
          { label: "55-64", prices: [591.00, 1037.00, 950.00, 1488.00] }
        ]
      },
      deductible: 7250,
      outOfPocketMax: 10600,
      states: ["ALL"],
      keyBenefits: [
        "Rate is age-banded and varies by household tier — see the full pricing table",
        "Lowest-premium high-deductible PHCS PPO plan, HSA-compatible formulary",
        "Unlimited annual maximum benefit",
        "$25 PCP / $40 specialist / $60 urgent care copay",
        "$0 copay unlimited telemedicine via OurLiveDoc (primary, urgent care, behavioral health)",
        "Preventive care covered at $0 copay / $0 deductible"
      ],
      brochureUrl: "docs/brochures/lifex-mm-plus-brochure.pdf",
      sbcUrl: null,
      description: "LifeX Research Corp's lowest-premium high-deductible Major Medical Plus plan — $7,250 in-network deductible, HSA-compatible, 20% coinsurance after deductible, unlimited annual benefit. Rate shown is the starting price (age 18-29, Employee only) — see the full age/tier pricing table."
    },
    {
      id: "lifex-vl-500",
      category: "major-medical",
      subType: "LifeX VL",
      carrier: "LifeX Research Corp",
      planName: "VL $500",
      tier: "N/A",
      network: "PHCS PPO",
      monthlyPriceIndividual: 329.00,
      monthlyPriceFamily: null,
      priceUnitLabel: "starting /mo",
      rateTable: {
        columns: ["Employee", "Employee + Spouse", "Employee + Child(ren)", "Family"],
        rows: [
          { label: "18-29", prices: [329.00, 658.00, 648.00, 905.00] },
          { label: "30-44", prices: [390.00, 699.00, 689.00, 967.00] },
          { label: "45-54", prices: [421.00, 741.00, 730.00, 1019.00] },
          { label: "55-64", prices: [473.00, 761.00, 741.00, 1060.00] }
        ]
      },
      deductible: 500,
      outOfPocketMax: 10600,
      states: ["ALL"],
      keyBenefits: [
        "Rate is age-banded and varies by household tier — see the full pricing table",
        "Lower-premium plan with visit limits: 10 combined PCP/specialist/urgent care visits per year, 12 chiropractic visits",
        "$50 copay office visits after deductible",
        "$0 copay unlimited telemedicine via OurLiveDoc",
        "Preventive care covered at $0 copay / $0 deductible",
        "Once plan visit limits are used up, cost sharing beyond them is not capped — read the plan document's visit limits closely"
      ],
      brochureUrl: "docs/brochures/lifex-vl-brochure.pdf",
      sbcUrl: null,
      description: "LifeX Research Corp's Value Limited plan — a lower-premium PHCS PPO plan with per-service visit limits rather than unlimited coverage. Rate shown is the starting price (age 18-29, Employee only) — see the full age/tier pricing table."
    },
    {
      id: "lifex-vl-750",
      category: "major-medical",
      subType: "LifeX VL",
      carrier: "LifeX Research Corp",
      planName: "VL $750",
      tier: "N/A",
      network: "PHCS PPO",
      monthlyPriceIndividual: 308.00,
      monthlyPriceFamily: null,
      priceUnitLabel: "starting /mo",
      rateTable: {
        columns: ["Employee", "Employee + Spouse", "Employee + Child(ren)", "Family"],
        rows: [
          { label: "18-29", prices: [308.00, 638.00, 627.00, 885.00] },
          { label: "30-44", prices: [370.00, 668.00, 658.00, 936.00] },
          { label: "45-54", prices: [401.00, 710.00, 699.00, 998.00] },
          { label: "55-64", prices: [452.00, 741.00, 720.00, 1019.00] }
        ]
      },
      deductible: 750,
      outOfPocketMax: 10600,
      states: ["ALL"],
      keyBenefits: [
        "Rate is age-banded and varies by household tier — see the full pricing table",
        "Lower-premium plan with visit limits: 10 combined PCP/specialist/urgent care visits per year, 12 chiropractic visits",
        "$50 copay office visits after deductible",
        "$0 copay unlimited telemedicine via OurLiveDoc",
        "Preventive care covered at $0 copay / $0 deductible",
        "Once plan visit limits are used up, cost sharing beyond them is not capped — read the plan document's visit limits closely"
      ],
      brochureUrl: "docs/brochures/lifex-vl-brochure.pdf",
      sbcUrl: null,
      description: "LifeX Research Corp's Value Limited plan — a lower-premium PHCS PPO plan with per-service visit limits rather than unlimited coverage. Rate shown is the starting price (age 18-29, Employee only) — see the full age/tier pricing table."
    },
    {
      id: "lifex-vl-1000",
      category: "major-medical",
      subType: "LifeX VL",
      carrier: "LifeX Research Corp",
      planName: "VL $1,000",
      tier: "N/A",
      network: "PHCS PPO",
      monthlyPriceIndividual: 287.00,
      monthlyPriceFamily: null,
      priceUnitLabel: "starting /mo",
      rateTable: {
        columns: ["Employee", "Employee + Spouse", "Employee + Child(ren)", "Family"],
        rows: [
          { label: "18-29", prices: [287.00, 617.00, 607.00, 864.00] },
          { label: "30-44", prices: [349.00, 648.00, 638.00, 905.00] },
          { label: "45-54", prices: [380.00, 689.00, 679.00, 977.00] },
          { label: "55-64", prices: [432.00, 720.00, 710.00, 998.00] }
        ]
      },
      deductible: 1000,
      outOfPocketMax: 10600,
      states: ["ALL"],
      keyBenefits: [
        "Rate is age-banded and varies by household tier — see the full pricing table",
        "Lower-premium plan with visit limits: 10 combined PCP/specialist/urgent care visits per year, 12 chiropractic visits",
        "$50 copay office visits after deductible",
        "$0 copay unlimited telemedicine via OurLiveDoc",
        "Preventive care covered at $0 copay / $0 deductible",
        "Once plan visit limits are used up, cost sharing beyond them is not capped — read the plan document's visit limits closely"
      ],
      brochureUrl: "docs/brochures/lifex-vl-brochure.pdf",
      sbcUrl: null,
      description: "LifeX Research Corp's Value Limited plan — a lower-premium PHCS PPO plan with per-service visit limits rather than unlimited coverage. Rate shown is the starting price (age 18-29, Employee only) — see the full age/tier pricing table."
    },
    {
      id: "lifex-vl-1500",
      category: "major-medical",
      subType: "LifeX VL",
      carrier: "LifeX Research Corp",
      planName: "VL $1,500",
      tier: "N/A",
      network: "PHCS PPO",
      monthlyPriceIndividual: 267.00,
      monthlyPriceFamily: null,
      priceUnitLabel: "starting /mo",
      rateTable: {
        columns: ["Employee", "Employee + Spouse", "Employee + Child(ren)", "Family"],
        rows: [
          { label: "18-29", prices: [267.00, 596.00, 586.00, 844.00] },
          { label: "30-44", prices: [318.00, 627.00, 611.00, 885.00] },
          { label: "45-54", prices: [359.00, 679.00, 658.00, 957.00] },
          { label: "55-64", prices: [411.00, 710.00, 668.00, 977.00] }
        ]
      },
      deductible: 1500,
      outOfPocketMax: 10600,
      states: ["ALL"],
      keyBenefits: [
        "Rate is age-banded and varies by household tier — see the full pricing table",
        "Lowest-premium visit-limited plan: 10 combined PCP/specialist/urgent care visits per year, 12 chiropractic visits",
        "$50 copay office visits after deductible",
        "$0 copay unlimited telemedicine via OurLiveDoc",
        "Preventive care covered at $0 copay / $0 deductible",
        "Once plan visit limits are used up, cost sharing beyond them is not capped — read the plan document's visit limits closely"
      ],
      brochureUrl: "docs/brochures/lifex-vl-brochure.pdf",
      sbcUrl: null,
      description: "LifeX Research Corp's Value Limited plan — a lower-premium PHCS PPO plan with per-service visit limits rather than unlimited coverage. Rate shown is the starting price (age 18-29, Employee only) — see the full age/tier pricing table."
    },
    {
      id: "lifex-copay-ppo-500",
      category: "major-medical",
      subType: "LifeX Copay PPO",
      carrier: "LifeX Research Corp",
      planName: "Copay PPO $500",
      tier: "N/A",
      network: "PHCS PPO",
      monthlyPriceIndividual: 429.00,
      monthlyPriceFamily: null,
      priceUnitLabel: "starting /mo",
      rateTable: {
        columns: ["Employee", "Employee + Spouse", "Employee + Child(ren)", "Family"],
        rows: [
          { label: "18-29", prices: [429.00, 789.00, 779.00, 1059.00] },
          { label: "30-44", prices: [489.00, 829.00, 819.00, 1119.00] },
          { label: "45-54", prices: [519.00, 869.00, 859.00, 1169.00] },
          { label: "55-64", prices: [569.00, 889.00, 869.00, 1209.00] }
        ]
      },
      deductible: 500,
      outOfPocketMax: 9200,
      states: ["ALL"],
      keyBenefits: [
        "Rate is age-banded and varies by household tier — see the full pricing table",
        "PHCS PPO network — no referral needed for specialists",
        "$50 copay PCP/specialist/urgent care after deductible",
        "Out-of-network coverage available (copay + 10% coinsurance after deductible)",
        "$0 copay unlimited telemedicine via OurLiveDoc",
        "Preventive care covered at $0 copay / $0 deductible"
      ],
      brochureUrl: "docs/brochures/lifex-copay-ppo-brochure.pdf",
      sbcUrl: null,
      description: "LifeX Research Corp's Copay PPO plan — flat copays for everyday care with out-of-network coverage included. Rate shown is the starting price (age 18-29, Employee only) — see the full age/tier pricing table."
    },
    {
      id: "lifex-copay-ppo-750",
      category: "major-medical",
      subType: "LifeX Copay PPO",
      carrier: "LifeX Research Corp",
      planName: "Copay PPO $750",
      tier: "N/A",
      network: "PHCS PPO",
      monthlyPriceIndividual: 409.00,
      monthlyPriceFamily: null,
      priceUnitLabel: "starting /mo",
      rateTable: {
        columns: ["Employee", "Employee + Spouse", "Employee + Child(ren)", "Family"],
        rows: [
          { label: "18-29", prices: [409.00, 769.00, 759.00, 1039.00] },
          { label: "30-44", prices: [469.00, 799.00, 789.00, 1089.00] },
          { label: "45-54", prices: [499.00, 839.00, 829.00, 1149.00] },
          { label: "55-64", prices: [549.00, 869.00, 849.00, 1169.00] }
        ]
      },
      deductible: 750,
      outOfPocketMax: 9200,
      states: ["ALL"],
      keyBenefits: [
        "Rate is age-banded and varies by household tier — see the full pricing table",
        "PHCS PPO network — no referral needed for specialists",
        "$50 copay PCP/specialist/urgent care after deductible",
        "Out-of-network coverage available (copay + 10% coinsurance after deductible)",
        "$0 copay unlimited telemedicine via OurLiveDoc",
        "Preventive care covered at $0 copay / $0 deductible"
      ],
      brochureUrl: "docs/brochures/lifex-copay-ppo-brochure.pdf",
      sbcUrl: null,
      description: "LifeX Research Corp's Copay PPO plan — flat copays for everyday care with out-of-network coverage included. Rate shown is the starting price (age 18-29, Employee only) — see the full age/tier pricing table."
    },
    {
      id: "lifex-copay-ppo-1000",
      category: "major-medical",
      subType: "LifeX Copay PPO",
      carrier: "LifeX Research Corp",
      planName: "Copay PPO $1,000",
      tier: "N/A",
      network: "PHCS PPO",
      monthlyPriceIndividual: 389.00,
      monthlyPriceFamily: null,
      priceUnitLabel: "starting /mo",
      rateTable: {
        columns: ["Employee", "Employee + Spouse", "Employee + Child(ren)", "Family"],
        rows: [
          { label: "18-29", prices: [389.00, 749.00, 739.00, 1019.00] },
          { label: "30-44", prices: [449.00, 779.00, 769.00, 1059.00] },
          { label: "45-54", prices: [479.00, 819.00, 809.00, 1129.00] },
          { label: "55-64", prices: [529.00, 849.00, 839.00, 1149.00] }
        ]
      },
      deductible: 1000,
      outOfPocketMax: 9200,
      states: ["ALL"],
      keyBenefits: [
        "Rate is age-banded and varies by household tier — see the full pricing table",
        "PHCS PPO network — no referral needed for specialists",
        "$50 copay PCP/specialist/urgent care after deductible",
        "Out-of-network coverage available (copay + 10% coinsurance after deductible)",
        "$0 copay unlimited telemedicine via OurLiveDoc",
        "Preventive care covered at $0 copay / $0 deductible"
      ],
      brochureUrl: "docs/brochures/lifex-copay-ppo-brochure.pdf",
      sbcUrl: null,
      description: "LifeX Research Corp's Copay PPO plan — flat copays for everyday care with out-of-network coverage included. Rate shown is the starting price (age 18-29, Employee only) — see the full age/tier pricing table."
    },
    {
      id: "lifex-copay-ppo-1500",
      category: "major-medical",
      subType: "LifeX Copay PPO",
      carrier: "LifeX Research Corp",
      planName: "Copay PPO $1,500",
      tier: "N/A",
      network: "PHCS PPO",
      monthlyPriceIndividual: 369.00,
      monthlyPriceFamily: null,
      priceUnitLabel: "starting /mo",
      rateTable: {
        columns: ["Employee", "Employee + Spouse", "Employee + Child(ren)", "Family"],
        rows: [
          { label: "18-29", prices: [369.00, 729.00, 719.00, 999.00] },
          { label: "30-44", prices: [419.00, 759.00, 743.00, 1039.00] },
          { label: "45-54", prices: [459.00, 809.00, 789.00, 1109.00] },
          { label: "55-64", prices: [509.00, 839.00, 799.00, 1129.00] }
        ]
      },
      deductible: 1500,
      outOfPocketMax: 9200,
      states: ["ALL"],
      keyBenefits: [
        "Rate is age-banded and varies by household tier — see the full pricing table",
        "PHCS PPO network — no referral needed for specialists",
        "$50 copay PCP/specialist/urgent care after deductible",
        "Out-of-network coverage available (copay + 10% coinsurance after deductible)",
        "$0 copay unlimited telemedicine via OurLiveDoc",
        "Preventive care covered at $0 copay / $0 deductible"
      ],
      brochureUrl: "docs/brochures/lifex-copay-ppo-brochure.pdf",
      sbcUrl: null,
      description: "LifeX Research Corp's lowest-premium Copay PPO plan — flat copays for everyday care with out-of-network coverage included. Rate shown is the starting price (age 18-29, Employee only) — see the full age/tier pricing table."
    },
    {
      id: "lifex-dental-ppo-1500",
      category: "supplemental",
      subType: "Dental",
      carrier: "Humana (LifeX Research Corp)",
      planName: "Dental PPO $1,500 Annual Max",
      tier: "N/A",
      monthlyPriceIndividual: 52.07,
      monthlyPriceFamily: 184.86,
      rateTiers: [
        { label: "Employee", price: 52.07 },
        { label: "Employee + Spouse", price: 104.15 },
        { label: "Employee + Child(ren)", price: 132.78 },
        { label: "Family", price: 184.86 }
      ],
      deductible: 50,
      outOfPocketMax: null,
      states: ["AL", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "TN", "UT", "VT", "VA", "WA", "WI", "WY"],
      keyBenefits: [
        "Humana PPO/Traditional Preferred network",
        "$1,500 annual maximum + 30% extended coverage after it's met",
        "100% preventive care, no deductible (exams, cleanings, x-rays)",
        "80% basic services after deductible (fillings, extractions)",
        "50% major services after deductible (crowns, bridges, dentures)",
        "$50 individual / $150 family deductible"
      ],
      brochureUrl: "docs/brochures/lifex-dental-ppo-1500-brochure.pdf",
      sbcUrl: "docs/brochures/lifex-dental-ppo-1500-brochure.pdf",
      description: "Humana Dental PPO (Life Extension PPO), $1,500 annual max. Not sold in AK, GA, LA, SD, TX, or WV — the Dental TRP plan is offered in those states instead."
    },
    {
      id: "lifex-dental-ppo-unlimited-ortho",
      category: "supplemental",
      subType: "Dental",
      carrier: "Humana (LifeX Research Corp)",
      planName: "Dental PPO Unlimited + $1,000 Ortho",
      tier: "N/A",
      monthlyPriceIndividual: 59.48,
      monthlyPriceFamily: 220.49,
      rateTiers: [
        { label: "Employee", price: 59.48 },
        { label: "Employee + Spouse", price: 118.95 },
        { label: "Employee + Child(ren)", price: 159.01 },
        { label: "Family", price: 220.49 }
      ],
      deductible: 50,
      outOfPocketMax: null,
      states: ["AL", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "TN", "UT", "VT", "VA", "WA", "WI", "WY"],
      keyBenefits: [
        "Humana PPO/Traditional Preferred network",
        "Unlimited annual maximum for preventive, basic, and major services",
        "Adult & child orthodontia: 50% coverage up to $1,000 lifetime max",
        "100% preventive care, no deductible (exams, cleanings, x-rays)",
        "80% basic services after deductible (fillings, extractions)",
        "50% major services after deductible (crowns, bridges, dentures)"
      ],
      brochureUrl: "docs/brochures/lifex-dental-ppo-unlimited-ortho-brochure.pdf",
      sbcUrl: "docs/brochures/lifex-dental-ppo-unlimited-ortho-brochure.pdf",
      description: "Humana Dental PPO (Life Extension PPO), unlimited annual max with $1,000 adult/child orthodontia. Not sold in AK, GA, LA, SD, TX, or WV — the Dental TRP plan is offered in those states instead."
    },
    {
      id: "lifex-dental-trp-1500",
      category: "supplemental",
      subType: "Dental",
      carrier: "Humana (LifeX Research Corp)",
      planName: "Dental TRP $1,500 Annual Max",
      tier: "N/A",
      monthlyPriceIndividual: 45.50,
      monthlyPriceFamily: 161.52,
      rateTiers: [
        { label: "Employee", price: 45.50 },
        { label: "Employee + Spouse", price: 91.00 },
        { label: "Employee + Child(ren)", price: 116.03 },
        { label: "Family", price: 161.52 }
      ],
      deductible: 50,
      outOfPocketMax: null,
      states: ["AK", "GA", "LA", "SD", "TX", "WV"],
      keyBenefits: [
        "Humana Traditional Preferred (TRP) network",
        "$1,500 annual maximum + 30% extended coverage after it's met",
        "100% preventive care, no deductible, both in- and out-of-network (exams, cleanings, x-rays)",
        "80% basic services after deductible (fillings, extractions)",
        "50% major services after deductible (crowns, bridges, dentures)",
        "$50 individual / $150 family deductible"
      ],
      brochureUrl: "docs/brochures/lifex-dental-trp-1500-brochure.pdf",
      sbcUrl: "docs/brochures/lifex-dental-trp-1500-brochure.pdf",
      description: "Humana Dental Traditional Preferred (Life Extension TRP), $1,500 annual max. Only sold in AK, GA, LA, SD, TX, and WV — the Dental PPO plan is offered everywhere else."
    },
    {
      id: "lifex-dental-trp-unlimited-ortho",
      category: "supplemental",
      subType: "Dental",
      carrier: "Humana (LifeX Research Corp)",
      planName: "Dental TRP Unlimited + $1,000 Ortho",
      tier: "N/A",
      monthlyPriceIndividual: 53.98,
      monthlyPriceFamily: 200.97,
      rateTiers: [
        { label: "Employee", price: 53.98 },
        { label: "Employee + Spouse", price: 107.96 },
        { label: "Employee + Child(ren)", price: 144.99 },
        { label: "Family", price: 200.97 }
      ],
      deductible: 50,
      outOfPocketMax: null,
      states: ["AK", "GA", "LA", "SD", "TX", "WV"],
      keyBenefits: [
        "Humana Traditional Preferred (TRP) network",
        "Unlimited annual maximum for preventive, basic, and major services",
        "Adult & child orthodontia: 50% coverage up to $1,000 lifetime max",
        "100% preventive care, no deductible, both in- and out-of-network (exams, cleanings, x-rays)",
        "80% basic services after deductible (fillings, extractions)",
        "50% major services after deductible (crowns, bridges, dentures)"
      ],
      brochureUrl: "docs/brochures/lifex-dental-trp-unlimited-ortho-brochure.pdf",
      sbcUrl: "docs/brochures/lifex-dental-trp-unlimited-ortho-brochure.pdf",
      description: "Humana Dental Traditional Preferred (Life Extension TRP), unlimited annual max with $1,000 adult/child orthodontia. Only sold in AK, GA, LA, SD, TX, and WV — the Dental PPO plan is offered everywhere else."
    },
    {
      id: "lifex-vision-150",
      category: "supplemental",
      subType: "Vision",
      carrier: "Humana (LifeX Research Corp)",
      planName: "Vision 150",
      tier: "N/A",
      monthlyPriceIndividual: 10.74,
      monthlyPriceFamily: 29.04,
      rateTiers: [
        { label: "Employee", price: 10.74 },
        { label: "Employee + Spouse", price: 19.46 },
        { label: "Employee + Child(ren)", price: 18.48 },
        { label: "Family", price: 29.04 }
      ],
      deductible: 0,
      outOfPocketMax: null,
      states: ["ALL"],
      keyBenefits: [
        "$10 eye exam with dilation as necessary",
        "$150 frame allowance (20% off balance) every 12 months",
        "$10 copay standard single/bifocal/trifocal/lenticular lenses",
        "$150 allowance for conventional contact lenses, $0 for disposable (in lieu of glasses)",
        "Diabetic eye care covered at $0 copay",
        "Exam, lenses/contacts, and frame each covered once every 12 months"
      ],
      brochureUrl: "docs/brochures/lifex-vision-150-brochure.pdf",
      sbcUrl: "docs/brochures/lifex-vision-150-brochure.pdf",
      description: "Humana Vision 150 (Life Extension Vision)."
    },

    /* ---- Ameritas PrimeStar Dental & Vision, loaded 2026-08-18 ----
       NOTE: owner states these are available in all states, with no
       out-of-network coverage in TX. The source brochure's fine print lists
       availability in only ~29 states + DC (AL, AR, AZ, CA, CO, DC, DE, HI,
       IA, IN, KS, KY, ME, MI, MN, NC, ND, NE, NH, NV, OK, OR, SC, SD, TN, UT,
       VT, WV, WY) and does not mention TX at all — flagging this discrepancy
       for review; states are set to ALL per the owner's direction. */

    {
      id: "ameritas-dental-care-lite",
      category: "supplemental",
      subType: "Dental",
      carrier: "Ameritas",
      planName: "PrimeStar Care Lite",
      tier: "N/A",
      monthlyPriceIndividual: null,
      monthlyPriceFamily: null,
      priceNote: "Rated by state & county — quote by request",
      deductible: 50,
      outOfPocketMax: null,
      states: ["ALL"],
      keyBenefits: [
        "No waiting periods; Preventive Plus (preventive care doesn't count against your annual max)",
        "$750 basic & major annual max (day one), $1,500 after year one",
        "100% in-network / 70% out-of-network preventive care (exams, cleanings, bitewing x-rays)",
        "50%→80% in-network basic services after deductible (fillings, sealants, space maintainers)",
        "10%→20% in-network major services after deductible (crowns, bridges, dentures, root canals)",
        "No child orthodontia or hearing benefit on this tier",
        "No out-of-network coverage for Texas residents"
      ],
      brochureUrl: "docs/brochures/ameritas-dental-brochure.pdf",
      sbcUrl: null,
      description: "Ameritas PrimeStar Care Lite — the entry-level PrimeStar dental plan, best for people who mainly want preventive care covered. Rated by state and county — request a personalized quote."
    },
    {
      id: "ameritas-dental-care-boost",
      category: "supplemental",
      subType: "Dental",
      carrier: "Ameritas",
      planName: "PrimeStar Care Boost",
      tier: "N/A",
      monthlyPriceIndividual: null,
      monthlyPriceFamily: null,
      priceNote: "Rated by state & county — quote by request",
      deductible: 50,
      outOfPocketMax: null,
      states: ["ALL"],
      keyBenefits: [
        "No waiting periods; Preventive Plus (preventive care doesn't count against your annual max)",
        "$1,000 basic & major annual max (day one), $2,500 after year one",
        "100% in-network / 70% out-of-network preventive care",
        "65%→80% in-network basic services after deductible (fillings, simple extractions)",
        "20%→50% in-network major services after deductible, includes implants and teeth whitening",
        "Child orthodontia (under 19): 15%→50% coverage, $1,000 lifetime max",
        "No out-of-network coverage for Texas residents"
      ],
      brochureUrl: "docs/brochures/ameritas-dental-brochure.pdf",
      sbcUrl: null,
      description: "Ameritas PrimeStar Care Boost — a balanced family plan that adds child orthodontia and implant coverage. Rated by state and county — request a personalized quote."
    },
    {
      id: "ameritas-dental-care-complete",
      category: "supplemental",
      subType: "Dental",
      carrier: "Ameritas",
      planName: "PrimeStar Care Complete",
      tier: "N/A",
      monthlyPriceIndividual: null,
      monthlyPriceFamily: null,
      priceNote: "Rated by state & county — quote by request",
      deductible: 50,
      outOfPocketMax: null,
      states: ["ALL"],
      keyBenefits: [
        "No waiting periods; Preventive Plus (preventive care doesn't count against your annual max)",
        "$2,000 basic & major annual max (day one), $3,500 after year one",
        "100% in-network / 80% out-of-network preventive care",
        "80%→90% in-network basic services after deductible (fillings, simple extractions)",
        "20%→50% in-network major services after deductible, includes implants",
        "Hearing benefit: 50% of hearing aid cost, $200→$400/ear, plus a $75 annual hearing exam",
        "No out-of-network coverage for Texas residents"
      ],
      brochureUrl: "docs/brochures/ameritas-dental-brochure.pdf",
      sbcUrl: null,
      description: "Ameritas PrimeStar Care Complete — the most robust PrimeStar tier, adding a hearing benefit for mature individuals (no child orthodontia on this tier). Rated by state and county — request a personalized quote."
    },
    {
      id: "ameritas-vision-choice-vsp",
      category: "supplemental",
      subType: "Vision",
      carrier: "Ameritas",
      planName: "Choice Vision (VSP)",
      tier: "N/A",
      network: "VSP",
      monthlyPriceIndividual: 10.10,
      monthlyPriceFamily: null,
      priceUnitLabel: "varies by state, /mo",
      rateTable: {
        rowHeader: "State",
        columns: ["Policyholder", "Policyholder + 1 Dependent", "Policyholder + 2+ Dependents"],
        rows: [
          { label: "All other states", prices: [16.34, 30.07, 44.94] },
          { label: "FL, MS", prices: [13.07, 24.06, 35.95] },
          { label: "MN", prices: [10.10, 18.26, 26.96] },
          { label: "MI, NC", prices: [11.88, 21.48, 31.72] }
        ]
      },
      deductible: 10,
      outOfPocketMax: null,
      states: ["ALL"],
      keyBenefits: [
        "VSP network — one of the largest vision networks in the country (Costco Optical, Sam's Club, Visionworks, Walmart, eyeconic.com)",
        "No waiting periods, no enrollment fees",
        "Exam and eyeglass lenses/frames covered in full in-network, once every 12 months",
        "$150 frame allowance in-network",
        "Benefits apply to contacts OR frames each year, not both",
        "Rate varies by state — see the full pricing table"
      ],
      brochureUrl: "docs/brochures/ameritas-vision-brochure.pdf",
      sbcUrl: null,
      description: "Ameritas PrimeStar Vision, Choice Vision plan on the VSP network. Rate shown is the lowest state-tier price (MN) — see the full state pricing table for your rate."
    },
    {
      id: "ameritas-vision-select-eyemed",
      category: "supplemental",
      subType: "Vision",
      carrier: "Ameritas",
      planName: "Select Vision (EyeMed)",
      tier: "N/A",
      network: "EyeMed",
      monthlyPriceIndividual: 6.15,
      monthlyPriceFamily: null,
      priceUnitLabel: "varies by state, /mo",
      rateTable: {
        rowHeader: "State",
        columns: ["Policyholder", "Policyholder + 1 Dependent", "Policyholder + 2+ Dependents"],
        rows: [
          { label: "All other states", prices: [10.67, 19.63, 29.34] },
          { label: "FL, MS", prices: [8.54, 15.70, 23.47] },
          { label: "MN", prices: [6.15, 11.46, 16.83] },
          { label: "MI, NC", prices: [7.24, 13.48, 19.80] }
        ]
      },
      deductible: 25,
      outOfPocketMax: null,
      states: ["ALL"],
      keyBenefits: [
        "EyeMed network — large national network including LensCrafters, Pearle Vision, Target Optical, Glasses.com",
        "No waiting periods, no enrollment fees",
        "Exam covered in full in-network every 12 months; lenses/frames every 24 months",
        "$130 frame allowance in-network",
        "Benefits apply to contacts AND frames each year (subject to frequency)",
        "Rate varies by state — see the full pricing table"
      ],
      brochureUrl: "docs/brochures/ameritas-vision-brochure.pdf",
      sbcUrl: null,
      description: "Ameritas PrimeStar Vision, Select Vision plan on the EyeMed network — generally the lower-cost of the two Ameritas vision options. Rate shown is the lowest state-tier price (MN) — see the full state pricing table for your rate."
    }
  ]
};
