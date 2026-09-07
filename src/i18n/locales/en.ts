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
            capital: '$180M',
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
    insolvency: {
      bannerTitle: 'CRITICAL LIQUIDITY DEFICIT',
      bannerDesc: 'Treasury cash has dropped below zero. The company is operating under liquidity restructuring.',
      emergencyFunding: 'Request Emergency Bridge Loan ($100M)',
      slowdownPrograms: 'Reduce R&D Burn'
    },
    nextAction: {
      title: 'RECOMMENDED NEXT ACTION',
      designFirst: {
        title: 'Design Clean-Sheet Aircraft',
        desc: 'Your company has no active programs. Open the Aircraft Designer to configure and launch your first airliner.',
        action: 'Open Aircraft Designer'
      },
      buildPrototype: {
        title: 'Construct Flight Test Article',
        desc: 'Detailed engineering complete. Build your first prototype aircraft ($35M) to prepare for ground testing.',
        action: 'Build Prototype'
      },
      conductGroundTests: {
        title: 'Execute Ground Test Campaigns',
        desc: 'Your prototype is built. Complete mandatory ground static and systems integration tests before first flight.',
        action: 'Go to Ground Tests'
      },
      flightTestCampaign: {
        title: 'Advance Flight Test Campaign',
        desc: 'Your {{aircraft}} requires {{hoursRemaining}} additional flight-test hours and mandatory scenarios before certification.',
        action: 'Open Flight Testing'
      },
      secureOrders: {
        title: 'Secure Launch Customer Orders',
        desc: 'Your aircraft is approaching certification. Submit bids on compatible airline RFPs to build your backlog.',
        action: 'View Compatible RFPs'
      },
      commissionLine: {
        title: 'Commission Final Assembly Line',
        desc: 'You have firm customer contracts. Commission a final assembly line ($85M tooling) to begin deliveries.',
        action: 'Open Final Assembly'
      },
      deliverAircraft: {
        title: 'Fulfill Customer Deliveries',
        desc: 'Aircraft units are advancing down the assembly line. Complete production to deliver units and collect revenue.',
        action: 'View Production Line'
      }
    },
    roadmap: {
      title: 'Road to Entry into Service',
      concept: 'Concept',
      preliminary: 'Preliminary Design',
      detailed: 'Detailed Design',
      prototype: 'Prototype Build',
      groundTests: 'Ground Tests',
      firstFlight: 'First Flight',
      flightTesting: 'Flight Test Campaign',
      certification: 'Type Certification',
      production: 'Series Production',
      firstDelivery: 'First Delivery (EIS)',
      projectedDate: 'Estimated: {{date}}',
      actualDate: 'Completed: {{date}}',
      pending: 'Pending prerequisites'
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
    warnings: {
      highWingLoadingTitle: 'HIGH WING LOADING ({{value}} kg/m²)',
      highWingLoadingDesc: 'Requires high takeoff speeds and longer runway field lengths.',
      lowWingLoadingTitle: 'LOW WING LOADING ({{value}} kg/m²)',
      lowWingLoadingDesc: 'Larger wing than necessary increases structural empty weight and cruise skin friction.',
      underpoweredTitle: 'UNDERPOWERED THRUST-TO-WEIGHT (T/W {{tw}})',
      underpoweredDesc: 'Current engines provide inadequate climb gradient margin for the selected MTOW.',
      excessiveFuelTitle: 'EXCESSIVE FUEL VOLUME ({{pct}}% MTOW)',
      excessiveFuelDesc: 'Fuel mass represents an excessive proportion of takeoff weight for this cabin capacity.',
      runwayRestrictiveTitle: 'RESTRICTIVE RUNWAY REQUIREMENT ({{tofl}} m)',
      runwayRestrictiveDesc: 'Takeoff distance limits operations to major intercontinental hub runways.'
    },
    why: {
      wingspan: 'A higher aspect ratio wing reduces induced vortex drag during cruise, boosting range and fuel economy, but increases wing bending moments and empty weight.',
      sweep: 'Wing sweep delays transonic compressibility drag, allowing higher cruise Mach numbers (0.78–0.85), but reduces low-speed maximum lift coefficient.',
      winglets: 'Wingtip devices diffuse the tip vortex, delivering up to 4–6% fuel burn reductions on long stages with minimal structural weight additions.',
      materials: 'Advanced carbon composites significantly reduce airframe empty weight and eliminate corrosion, at the expense of higher tooling capital and non-destructive testing requirements.',
      engines: 'Modern high-bypass turbofans lower specific fuel consumption (SFC) and acoustic emissions, but feature larger nacelle drag and higher dry engine mass.',
      fbw: 'Full Fly-By-Wire provides autonomous flight envelope protection, eliminates heavy control cables, and enables load alleviation during gust encounters.'
    },
    deltas: {
      range: 'Range Delta',
      fuelBurn: 'Fuel Burn Delta',
      oew: 'Empty Mass Delta',
      mtow: 'MTOW Delta',
      tofl: 'Takeoff Run Delta',
      unitCost: 'Unit Cost Delta',
      rdCost: 'R&D Budget Delta'
    }
  },

  rfp: {
    title: 'Airline Fleet Tenders & Orders',
    fleetRenewalTitle: '{{airline}} Fleet Renewal Tender: {{segment}}',
    openTenders: 'Open Airline RFPs',
    activeContracts: 'Signed Production Contracts',
    airline: 'Airline',
    segment: 'Requested Segment',
    quantity: 'Quantity',
    firmAndOptions: '{{firm}} Firm + {{options}} Options',
    maxBudget: 'Max Budget',
    deliveryDesired: 'Target Delivery',
    submitBid: 'Prepare & Submit Bid',
    bidSubmitted: 'Bid Submitted — Airline Reviewing',
    underReview: 'Airline Evaluating Tender ({{days}} days remaining)',
    compatibility: {
      title: 'Aircraft Compatibility',
      excellent: 'Excellent Fit',
      good: 'Good Fit',
      marginal: 'Marginal Match',
      incompatible: 'Incompatible'
    }
  },

  production: {
    title: 'Final Assembly Lines & Manufacturing',
    subtitle: 'Manage airframe assembly rates, tooling investments, and delivery slots.',
    activeLines: 'Active Assembly Lines',
    addLine: 'Commission Assembly Line ($85M)',
    toolingInProgress: 'Tooling & Jigs Commissioning ({{days}} days remaining)',
    status: {
      tooling: 'TOOLING IN PROGRESS',
      ready: 'READY FOR PRODUCTION',
      producing: 'ASSEMBLY ACTIVE'
    },
    ratePerMonth: 'Monthly Production Rate Target',
    actualRate: 'Actual Rate: {{rate}} / month',
    stations: {
      s1: { name: 'Fuselage Shell Joining & Splice', desc: 'Laser alignment and automatic riveting of forward, center, and aft fuselage sections.' },
      s2: { name: 'Wing-to-Body Laser Join', desc: 'High-precision laser alignment and titanium main wing-box mounting.' },
      s3: { name: 'Empennage & Fin Integration', desc: 'Vertical stabilizer attachment and horizontal stabilizer actuator fitting.' },
      s4: { name: 'Hydraulics, Wiring & Fuel Lines', desc: 'Installation of high-pressure hydraulic lines, bundle harnesses, and fuel pumps.' },
      s5: { name: 'Cabin Furnishing & Galleys', desc: 'Seating installation, overhead stowage bins, galleys, lavatories, and IFE.' },
      s6: { name: 'Propulsion Pylons & Turbofans', desc: 'Engine pylon attachment, dual turbofan hanging, and nacelle cowlings.' },
      s7: { name: 'Avionics Power-On & Systems Test', desc: 'Cockpit glass power-up, flight control servo calibration, and pressure test.' },
      s8: { name: 'Paint Hangar & Customer Acceptance', desc: 'Custom customer livery application, engine run-up, and acceptance flight.' }
    }
  },

  testing: {
    title: 'Flight Test & Certification Campaign',
    subtitle: 'Conduct ground tests, flutter envelope expansion, and type certification flights.',
    testFleet: 'Prototype Test Fleet',
    addPrototype: 'Build Prototype Tail ($35M)',
    flightHours: 'Flight Test Hours',
    envelopeExpansion: 'Flight Envelope Expansion',
    certProgress: 'Type Certification Status',
    conductTest: 'Schedule Test Sortie',
    sortiesRunning: 'Sortie in progress (Day {{elapsed}}/{{total}})',
    scenarios: {
      structural_ultimate_load: { name: '150% Structural Ultimate Load Test', desc: 'Hydraulic actuators bend the carbon-aluminum wing box to 1.5x design limit.' },
      cabin_emergency_evacuation: { name: '90-Second Full Cabin Evacuation Drill', desc: 'Evacuate maximum passenger load in darkness with 50% exits blocked.' },
      landing_gear_rto_brakes: { name: 'Max Energy Rejected Takeoff (RTO) Brakes', desc: 'Abort takeoff at maximum weight with worn carbon brakes without reversers.' },
      iron_bird_systems_integration: { name: 'Iron Bird Integrated Systems Rig', desc: 'Full-scale ground test rig powering avionics, hydraulics, and actuators.' },
      basic_handling_qualities: { name: 'Basic Handling Qualities Shakedown', desc: 'Initial flight test sortie checking trim, pitch response, and basic stability.' },
      stall_campaign: { name: 'Low-Speed Stall & Alpha Protection', desc: 'Explore high angle-of-attack limits, stall warning horns, and FBW protection.' },
      flutter_envelope_expansion: { name: 'Transonic Dive & Flutter Margin', desc: 'Dive to Mach 0.93 to verify aeroelastic damping across the empennage.' },
      hot_and_high_trials: { name: 'Hot & High Altitude Trials', desc: 'Deploy to high-elevation airport in 38°C heat to validate climb gradients.' },
      natural_icing_campaign: { name: 'Severe Meteorological Natural Icing', desc: 'Hunt for supercooled liquid cloud droplets to validate wing bleed heating.' },
      crosswind_landing_trials: { name: '35-Knot Gusting Crosswind Landings', desc: 'Test crab-angle decrab authority and landing gear side loads in heavy gusts.' },
      autoland_cat3_validation: { name: 'CAT IIIb Zero-Visibility Autoland', desc: 'Precision ILS approach and automatic rollout in zero-visibility conditions.' },
      long_range_endurance_validation: { name: 'Extended Range ETOPS Proving', desc: 'Multi-hour endurance flight validating diversion reliability and oil consumption.' }
    }
  },

  news: {
    templates: {
      maidenFlight: 'The flagship prototype of the {{aircraft}} completed its historic maiden flight today, beginning its formal flight test certification campaign.',
      certificationGranted: 'The {{aircraft}} has officially received full commercial Type Certification, validating compliance with all airworthiness and safety standards.',
      firstDelivery: 'The very first production {{aircraft}} ({{msn}}) has been handed over to launch customer {{customer}}.',
      rfpWon: '{{airline}} has officially selected the {{aircraft}}, placing a firm order for {{quantity}} aircraft valued at ${{valueB}}B.',
      rfpLost: '{{airline}} has awarded its fleet tender to {{competitor}} for {{quantity}} units of the {{planeName}}.'
    }
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
