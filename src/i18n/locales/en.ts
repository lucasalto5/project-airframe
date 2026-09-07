// ============================================================================
// PROJECT AIRFRAME - ENGLISH LOCALIZATION DICTIONARY (EN)
// ============================================================================

export const en = {
  common: {
    appName: 'Project Airframe',
    loading: 'Loading aerospace simulation environment...',
    cancel: 'Cancel',
    continue: 'Continue',
    confirm: 'Confirm',
    back: 'Back',
    save: 'Save',
    saving: 'Saving...',
    saved: 'Saved',
    autosaved: 'Autosaved',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    select: 'Select',
    selected: 'Selected',
    active: 'Active',
    completed: 'Completed',
    inProgress: 'In Progress',
    pending: 'Pending',
    open: 'Open',
    closed: 'Closed',
    units: 'Units',
    aircraft: 'Aircraft',
    passengers: 'Passengers',
    pax: 'pax',
    month: 'Month',
    months: 'Months',
    year: 'Year',
    years: 'Years',
    day: 'Day',
    days: 'Days',
    quarter: 'Quarter',
    usd: 'USD',
    reputation: 'Reputation',
    reputationLevels: {
      unknown: 'Unknown',
      experimental: 'Experimental',
      emerging: 'Emerging',
      proven: 'Proven',
      trusted: 'Trusted',
      global_supplier: 'Global Supplier',
      industry_leader: 'Industry Leader'
    }
  },

  navigation: {
    companyGroup: 'COMPANY',
    overview: 'Overview',
    organization: 'Organization',
    finance: 'Finance',
    legacyTimeline: 'Legacy Timeline',
    
    productsGroup: 'PRODUCTS',
    aircraft: 'Aircraft Programs',
    engines: 'Engine Programs',
    flightTesting: 'Flight Testing',

    commercialGroup: 'COMMERCIAL',
    ordersRfps: 'Orders & RFPs',
    customers: 'Airlines & Customers',
    marketIntel: 'Market Intelligence',

    operationsGroup: 'OPERATIONS',
    production: 'Final Assembly',
    airworthiness: 'Airworthiness & Safety',
    fleetMap: 'Live Operations Map',

    worldGroup: 'WORLD',
    news: 'Aviation Dispatches',
    competitors: 'Competitors',
    saveArchive: 'Save Archive',
    settings: 'Settings'
  },

  topbar: {
    briefing: 'EXECUTIVE BRIEFING',
    pause: 'Pause Simulation',
    speed1x: '1× Normal Speed',
    speed2x: '2× Accelerated',
    speed4x: '4× Fast',
    speed8x: '8× High Speed',
    speed16x: '16× Maximum Speed',
    speedMenu: 'Simulation Speed',
    treasury: 'Treasury',
    runway: 'Runway',
    notifications: 'Notifications',
    alerts: 'Air Safety Anomaly',
    dispatches: 'Aviation News Wire',
    manualSave: 'Save Simulation Slot',
    language: 'Language',
    settings: 'Settings'
  },

  company: {
    founding: {
      badge: 'PROJECT AIRFRAME // NEW ENTERPRISE',
      title: 'Found an Aircraft Manufacturer',
      subtitle: 'Establish your commercial aerospace manufacturing company. Design airliners, manage production lines, negotiate airline fleet orders, and build an enduring aviation legacy.',
      stepIndicator: 'Step {{current}} of {{total}}',
      steps: {
        identity: 'Identity',
        headquarters: 'Headquarters',
        financing: 'Financing',
        philosophy: 'Philosophy',
        review: 'Review & Launch'
      },
      step1: {
        title: 'Create your manufacturer',
        desc: 'Start by defining the identity and public market presence of your aerospace company.',
        nameLabel: 'Company / Manufacturer Name',
        namePlaceholder: 'e.g. Aureon Aerospace',
        tickerLabel: 'Stock / Call-Sign Ticker',
        tickerPlaceholder: 'e.g. AUR',
        previewTitle: 'Commercial Identity Preview',
        previewDesc: 'This identifier will appear on aircraft type certificates, stock listings, and airline purchase contracts.'
      },
      step2: {
        title: 'Choose your headquarters',
        desc: 'Select your global engineering and manufacturing hub. Cluster location influences engineering talent, labor costs, and supplier network strength.',
        consequencesTitle: 'Regional Cluster Advantages',
        engineeringTalent: 'Engineering Talent',
        laborCost: 'Labor Cost',
        supplierAccess: 'Supplier Access',
        governmentSupport: 'Government Support',
        high: 'High',
        moderate: 'Moderate',
        low: 'Low',
        excellent: 'Excellent',
        strong: 'Strong',
        premium: 'Premium'
      },
      step3: {
        title: 'Select capital structure & financing',
        desc: 'Choose how your new venture will be funded. Greater initial capital demands more equity dilution, investor pressure, and board seats.',
        founderEquity: 'Founder Equity',
        boardSeats: 'Board Seats',
        growthPressure: 'Growth Pressure',
        startingCapital: 'Starting Capital',
        options: {
          bootstrapped: {
            title: 'Bootstrapped Founder',
            capital: '$120M',
            desc: 'Self-funded startup. Retain 100% founder equity with zero board interference and conservative growth milestones.'
          },
          private_equity: {
            title: 'Private Investors Syndicate',
            capital: '$650M',
            desc: 'Balanced institutional backing with reasonable growth targets, strong industry contacts, and 2 board seats.'
          },
          venture_capital: {
            title: 'Venture Capital Alliance',
            capital: '$950M',
            desc: 'Aggressive growth capital demanding rapid market entry, aggressive technology adoption, and short entry-into-service timelines.'
          },
          industrial_group: {
            title: 'Industrial Conglomerate',
            capital: '$1.2B',
            desc: 'Heavy industrial parent partnership providing direct access to tier-1 aerospace suppliers, tooling, and materials networks.'
          },
          state_backed: {
            title: 'State-Backed Sovereign Fund',
            capital: '$1.6B',
            desc: 'Massive sovereign development fund aimed at establishing a national champion with strategic industrial mandates.'
          }
        }
      },
      step4: {
        title: 'What should define your company?',
        desc: 'Select your foundational engineering and business philosophy. This shapes R&D speed, unit costs, and airline brand perception.',
        options: {
          engineering_excellence: {
            title: 'Engineering Excellence',
            desc: 'Build aircraft around aerodynamic purity, structural quality, and low fuel burn per seat.',
            pros: ['+15% Aerodynamic & fuel efficiency', '+20% Brand engineering reputation'],
            cons: ['+18% Higher R&D program development costs']
          },
          cost_leadership: {
            title: 'Cost Leadership & Simplicity',
            desc: 'Deliver competitive airliners with low purchase price, rapid tooling, and minimal manufacturing complexity.',
            pros: ['-20% Assembly and tooling cost', '+15% Production ramp-up velocity'],
            cons: ['-10% Range capability vs premium rivals']
          },
          passenger_comfort: {
            title: 'Passenger Comfort & Space',
            desc: 'Prioritize wide cabin cross-sections, low cabin altitudes, and quiet acoustic insulation.',
            pros: ['+25% Passenger brand preference', '+15% Airline cabin yield appeal'],
            cons: ['+8% Fuselage structural weight']
          },
          operational_ruggedness: {
            title: 'Operational Ruggedness',
            desc: 'Over-engineer landing gear, electrical redundancy, and unpaved airfield compatibility.',
            pros: ['+25% Dispatch reliability in harsh climates', 'Secondary/gravel runway certification'],
            cons: ['+10% Empty weight margin']
          },
          technological_pioneer: {
            title: 'Technological Pioneer',
            desc: 'Aggressive adoption of advanced Fly-By-Wire flight envelope protection and more-electric systems.',
            pros: ['+20% Flight deck modernization appeal', '+12% Maintenance interval extension'],
            cons: ['Higher flight test certification risks']
          }
        }
      },
      step5: {
        title: 'Review & Incorporate Enterprise',
        desc: 'Confirm your foundational charter before officially incorporating your aerospace manufacturing company.',
        startingCapital: 'Liquid Treasury',
        monthlyBurnEst: 'Estimated Initial Burn',
        founderOwnership: 'Founder Ownership',
        headquartersLabel: 'Headquarters Hub',
        philosophyLabel: 'Corporate Philosophy',
        submitButton: 'Found {{companyName}}',
        foundingHeadline: '{{companyName}} Officially Founded',
        foundingSummary: '{{companyName}} has been established in {{city}}, {{country}} with {{capital}} in founding capital.'
      }
    }
  },

  dashboard: {
    greeting: 'Good morning, {{companyName}}',
    briefingSubtitle: 'Your company is funded and ready to enter the commercial aircraft market.',
    briefingWithProgram: 'Managing {{count}} active aircraft program(s) from your {{city}} facility.',
    metrics: {
      cash: 'Treasury Cash',
      runway: 'Runway',
      backlog: 'Firm Backlog',
      trust: 'Industry Trust'
    },
    emptyState: {
      title: 'Your First Aircraft Starts Here',
      desc: 'Your company has no active aircraft programs yet. Launch your first clean-sheet commercial aircraft and compete for your first airline fleet customers.',
      action: 'Launch First Aircraft Program'
    },
    activeProgram: {
      title: 'Active Aircraft Program',
      viewAll: 'All Programs ({{count}})',
      phase: 'Current Phase',
      phaseProgress: 'Phase Progress ({{percent}}%)',
      targetEis: 'Target EIS: Year {{year}}',
      flightOpsAction: 'Flight Test Operations',
      specs: {
        seating: 'Seating Capacity',
        range: 'Design Range',
        listPrice: 'Unit List Price',
        backlog: 'Firm Backlog'
      }
    },
    rfpSection: {
      title: 'Market Opportunities & RFPs',
      viewAll: 'View All ({{count}})',
      empty: 'No pending airline tenders open right now.',
      closingIn: 'Proposal closes in {{days}} days',
      budgetPerUnit: 'Budget: ${{amount}}M/unit',
      action: 'View RFP'
    },
    newsSection: {
      title: 'Latest Aviation Intelligence',
      viewAll: 'News Wire',
      empty: 'No news dispatches recorded yet.'
    }
  },

  designer: {
    title: 'Clean-Sheet Aircraft Designer',
    step: 'Step {{current}} of {{total}}: {{name}}',
    steps: {
      segment: 'Market Segment',
      fuselage: 'Fuselage & Cabin',
      wing: 'Wing & Aerodynamics',
      propulsion: 'Propulsion & Engines',
      systems: 'Avionics & Flight Controls',
      materials: 'Structural Materials',
      livery: 'Brand Livery',
      summary: 'Program Launch'
    },
    blueprint: 'Technical CAD Blueprint',
    projectedMetrics: 'Calculated Engineering Metrics',
    mtow: 'Max Takeoff Weight (MTOW)',
    oew: 'Operating Empty Weight (OEW)',
    fuelCapacity: 'Fuel Capacity',
    typicalSeats: 'Typical Seating',
    maxRange: 'Maximum Range',
    cruiseMach: 'Cruise Speed',
    takeoffDistance: 'Takeoff Field Length',
    estimatedDevCost: 'Estimated R&D Cost',
    estimatedDevTime: 'Target R&D Schedule',
    listPrice: 'Unit List Price',
    launchProgram: 'Initiate Program Development',
    saveDraft: 'Save Design Draft'
  },

  rfp: {
    title: 'Airline Fleet Tenders & Orders',
    openTenders: 'Open Airline RFPs',
    activeContracts: 'Signed Production Contracts',
    airline: 'Airline',
    segment: 'Requested Segment',
    quantity: 'Quantity',
    firmAndOptions: '{{firm}} Firm + {{options}} Options',
    maxBudget: 'Max Budget',
    deliveryDesired: 'Target Delivery',
    submitBid: 'Prepare & Submit Bid',
    bidSubmitted: 'Bid Submitted',
    importanceFactors: 'Evaluation Criteria'
  },

  production: {
    title: 'Final Assembly Lines & Manufacturing',
    subtitle: 'Manage airframe assembly rates, tooling investments, and delivery slots.',
    activeLines: 'Active Assembly Lines',
    addLine: 'Commission New Assembly Line',
    lineName: 'Assembly Line {{number}}',
    ratePerMonth: 'Monthly Production Rate',
    workers: 'Manufacturing Workforce',
    efficiency: 'Factory Efficiency',
    monthlyOperatingCost: 'Monthly Facility Cost'
  },

  testing: {
    title: 'Flight Test & Certification Campaign',
    subtitle: 'Conduct ground tests, flutter envelope expansion, and type certification flights.',
    testFleet: 'Prototype Test Fleet',
    addPrototype: 'Build Prototype Tail',
    flightHours: 'Flight Test Hours',
    certProgress: 'Type Certification Progress',
    conductTest: 'Execute Test Sortie',
    groundTests: 'Ground Static Tests',
    envelopeExpansion: 'Flight Envelope Expansion',
    avionicsCert: 'Avionics & Systems Cert',
    icingColdOps: 'Extreme Weather & Icing'
  },

  safety: {
    title: 'Airworthiness & Safety Operations',
    subtitle: 'Fleet reliability tracking, incident investigations, and regulatory directives.',
    activeFleetInService: 'Active Fleet in Service',
    fleetDispatchReliability: 'Fleet Dispatch Reliability',
    incidentHistory: 'Reported In-Service Occurrences',
    noIncidents: 'Clean safety record. No active service anomalies reported.',
    investigationPhase: 'Investigation Phase',
    adDirectives: 'Airworthiness Directives'
  },

  news: {
    title: 'Global Aviation Intelligence Wire',
    subtitle: 'Real-time industry dispatches, regulatory rulings, and competitor movements.',
    categories: {
      all: 'All Dispatches',
      commercial: 'Commercial & Orders',
      engineering: 'R&D & Engineering',
      safety: 'Safety & Directives',
      financial: 'Corporate & Finance'
    }
  },

  milestones: {
    title: 'Aviation Legacy Timeline',
    subtitle: 'Track your historic corporate and aerospace engineering achievements.',
    unlocked: 'Milestones Achieved',
    locked: 'Locked Future Milestones'
  },

  settings: {
    title: 'Application Preferences',
    language: 'Language / Idioma',
    theme: 'Interface Theme',
    darkTheme: 'Industrial Dark (Default)',
    lightTheme: 'Technical Light',
    units: 'Measurement Units',
    metric: 'Metric (km, kg, m)',
    imperial: 'Imperial (nm, lbs, ft)',
    autosave: 'Autosave Interval',
    sound: 'Audio Feedback'
  }
};
