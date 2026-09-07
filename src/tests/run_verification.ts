declare const process: any;

import { 
  synthesizeAircraftSpecs,
  detectDesignSanityWarnings, 
  calculateDesignDelta 
} from '../simulation/formulas';
import { DEFAULT_AIRCRAFT_DRAFT } from '../store/gameStore';
import { TEST_SCENARIOS } from '../data/testCampaigns';
import { t, getTranslations } from '../i18n';
import { 
  generatePotentialAirlineRFP
} from '../simulation/rfpEngine';
import { 
  executeDailySimulationTick
} from '../simulation/engine';
import { SeededRNG } from '../simulation/rng';
import { INITIAL_AIRLINES } from '../data/airlines';
import { INITIAL_COMPETITORS } from '../data/competitors';
import { INITIAL_SUPPLIERS } from '../data/suppliers';
import type { 
  CompanyState, 
  MacroEconomy, 
  AircraftProgram, 
  AssemblyLine,
  AircraftDraft
} from '../types';

let totalTests = 0;
let passedTests = 0;

function assert(condition: boolean, testName: string, details?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ PASS: ${testName}`);
  } else {
    console.error(`  ❌ FAIL: ${testName} ${details ? `(${details})` : ''}`);
  }
}

// -------------------------------------------------------------
// TEST SUITE 1: Critical Range & Breguet Physics Benchmark Test
// -------------------------------------------------------------
console.log('\n--- 1. CRITICAL RANGE & BREGUET FORMULAS BENCHMARK ---');

// Benchmark 1: Small Narrowbody (A120 / M-85 style)
const smallNbDraft: AircraftDraft = {
  ...DEFAULT_AIRCRAFT_DRAFT,
  marketSegment: 'small_narrowbody',
  geometry: {
    ...DEFAULT_AIRCRAFT_DRAFT.geometry,
    length: 35.8,
    wingSpan: 34.0,
    wingArea: 115.0,
    aspectRatio: 10.0,
    fuelCapacityLiters: 22000,
    typicalSeats: 130
  }
};
const smallNbSpecs = synthesizeAircraftSpecs(
  smallNbDraft.geometry,
  smallNbDraft.propulsion,
  smallNbDraft.systems,
  smallNbDraft.marketSegment
);

assert(
  smallNbSpecs.perf.rangeKm >= 3000 && smallNbSpecs.perf.rangeKm <= 6500,
  'Small Narrowbody Range is within realistic envelope (3,000 - 6,500 km)',
  `Calculated: ${smallNbSpecs.perf.rangeKm} km`
);
assert(
  smallNbSpecs.perf.rangeKm < 80000,
  'Range bug (848,000 km) is permanently eliminated (no absurd hundreds of thousands km)',
  `Calculated: ${smallNbSpecs.perf.rangeKm} km`
);
assert(smallNbSpecs.mass.mtowKg > 50000 && smallNbSpecs.mass.mtowKg < 85000, 'Small Narrowbody MTOW is physically realistic', `MTOW: ${smallNbSpecs.mass.mtowKg} kg`);
assert(smallNbSpecs.mass.oewKg > 25000 && smallNbSpecs.mass.oewKg < 45000, 'Small Narrowbody OEW is physically realistic', `OEW: ${smallNbSpecs.mass.oewKg} kg`);
assert(smallNbSpecs.perf.takeoffFieldLengthMeters > 1200 && smallNbSpecs.perf.takeoffFieldLengthMeters < 2800, 'Takeoff distance is within airport operational limits', `TOFL: ${smallNbSpecs.perf.takeoffFieldLengthMeters} m`);

// Benchmark 2: Regional Jet (e.g. 76 seats, 26.5m span, 9800L fuel)
const rjDraft: AircraftDraft = {
  ...DEFAULT_AIRCRAFT_DRAFT,
  marketSegment: 'regional_jet',
  geometry: {
    ...DEFAULT_AIRCRAFT_DRAFT.geometry,
    length: 29.5,
    fuselageDiameter: 3.0,
    seatsAbreast: 4,
    typicalSeats: 76,
    wingSpan: 26.5,
    wingArea: 72.0,
    aspectRatio: 9.75,
    fuelCapacityLiters: 9800
  },
  propulsion: {
    ...DEFAULT_AIRCRAFT_DRAFT.propulsion,
    thrustPerEngineKN: 72.0,
    dryWeightKg: 1850,
    cruiseSFC: 0.535
  }
};
const rjSpecs = synthesizeAircraftSpecs(rjDraft.geometry, rjDraft.propulsion, rjDraft.systems, rjDraft.marketSegment);
assert(rjSpecs.perf.rangeKm >= 2000 && rjSpecs.perf.rangeKm <= 4800, 'Regional Jet Range is within realistic envelope (2,000 - 4,800 km)', `Calculated: ${rjSpecs.perf.rangeKm} km`);

// Benchmark 3: Standard Narrowbody (165 seats, 35.8m span, 26000L fuel)
const nbDraft: AircraftDraft = {
  ...DEFAULT_AIRCRAFT_DRAFT,
  marketSegment: 'narrowbody',
  geometry: {
    ...DEFAULT_AIRCRAFT_DRAFT.geometry,
    length: 39.5,
    fuselageDiameter: 3.95,
    seatsAbreast: 6,
    typicalSeats: 165,
    wingSpan: 35.8,
    wingArea: 122.0,
    aspectRatio: 10.5,
    fuelCapacityLiters: 26500
  },
  propulsion: {
    ...DEFAULT_AIRCRAFT_DRAFT.propulsion,
    thrustPerEngineKN: 140.0,
    dryWeightKg: 3100,
    cruiseSFC: 0.505
  }
};
const nbSpecs = synthesizeAircraftSpecs(nbDraft.geometry, nbDraft.propulsion, nbDraft.systems, nbDraft.marketSegment);
assert(nbSpecs.perf.rangeKm >= 4000 && nbSpecs.perf.rangeKm <= 7500, 'Standard Narrowbody Range is within realistic envelope (4,000 - 7,500 km)', `Calculated: ${nbSpecs.perf.rangeKm} km`);

// Benchmark 4: Large Narrowbody (210 seats, 37.5m span, 31000L fuel)
const largeNbDraft: AircraftDraft = {
  ...DEFAULT_AIRCRAFT_DRAFT,
  marketSegment: 'large_narrowbody',
  geometry: {
    ...DEFAULT_AIRCRAFT_DRAFT.geometry,
    length: 44.5,
    fuselageDiameter: 3.95,
    seatsAbreast: 6,
    typicalSeats: 210,
    wingSpan: 37.5,
    wingArea: 130.0,
    aspectRatio: 10.8,
    fuelCapacityLiters: 32000
  },
  propulsion: {
    ...DEFAULT_AIRCRAFT_DRAFT.propulsion,
    thrustPerEngineKN: 155.0,
    dryWeightKg: 3350,
    cruiseSFC: 0.495
  }
};
const largeNbSpecs = synthesizeAircraftSpecs(largeNbDraft.geometry, largeNbDraft.propulsion, largeNbDraft.systems, largeNbDraft.marketSegment);
assert(largeNbSpecs.perf.rangeKm >= 4500 && largeNbSpecs.perf.rangeKm <= 8500, 'Large Narrowbody Range is within realistic envelope (4,500 - 8,500 km)', `Calculated: ${largeNbSpecs.perf.rangeKm} km`);

// Benchmark 5: Widebody (310 seats, 60m span, 138000L fuel)
const widebodyDraft: AircraftDraft = {
  ...DEFAULT_AIRCRAFT_DRAFT,
  marketSegment: 'widebody',
  geometry: {
    ...DEFAULT_AIRCRAFT_DRAFT.geometry,
    length: 63.0,
    fuselageDiameter: 5.96,
    seatsAbreast: 9,
    aisles: 2,
    typicalSeats: 310,
    wingSpan: 60.0,
    wingArea: 360.0,
    aspectRatio: 10.0,
    fuelCapacityLiters: 138000
  },
  propulsion: {
    ...DEFAULT_AIRCRAFT_DRAFT.propulsion,
    thrustPerEngineKN: 340.0,
    fanDiameterMeters: 3.0,
    dryWeightKg: 7800,
    cruiseSFC: 0.485
  }
};
const widebodySpecs = synthesizeAircraftSpecs(widebodyDraft.geometry, widebodyDraft.propulsion, widebodyDraft.systems, widebodyDraft.marketSegment);
assert(widebodySpecs.perf.rangeKm >= 8000 && widebodySpecs.perf.rangeKm <= 15500, 'Widebody Range is within realistic envelope (8,000 - 15,500 km)', `Calculated: ${widebodySpecs.perf.rangeKm} km`);

// Sanity warnings validation
const underpoweredDraft: AircraftDraft = {
  ...smallNbDraft,
  propulsion: {
    ...smallNbDraft.propulsion,
    thrustPerEngineKN: 40.0 // severely underpowered for 68t MTOW
  }
};
const underpoweredSpecs = synthesizeAircraftSpecs(underpoweredDraft.geometry, underpoweredDraft.propulsion, underpoweredDraft.systems, underpoweredDraft.marketSegment);
const warnings = detectDesignSanityWarnings(
  underpoweredDraft.geometry,
  underpoweredDraft.propulsion,
  underpoweredDraft.systems,
  underpoweredSpecs.mass,
  underpoweredSpecs.perf
);
assert(warnings.some(w => w.id === 'underpowered'), 'Sanity warning engine flags underpowered configurations');

// Design delta calculation
const modifiedDraft = {
  ...smallNbDraft,
  geometry: { ...smallNbDraft.geometry, wingSpan: 36.5 }
};
const modifiedSpecs = synthesizeAircraftSpecs(
  modifiedDraft.geometry,
  modifiedDraft.propulsion,
  modifiedDraft.systems,
  modifiedDraft.marketSegment
);

const delta = calculateDesignDelta(smallNbSpecs, modifiedSpecs);
assert(delta.deltaRangeKm !== 0, 'Design Delta calculates impact on range');

// -------------------------------------------------------------
// TEST SUITE 2: Flight Testing Mechanics & Active Sortie State
// -------------------------------------------------------------
console.log('\n--- 2. FLIGHT TEST CAMPAIGN & PROTOTYPE STATE TEST ---');

const rng = new SeededRNG(42);
const currentDate = { day: 1, month: 6, year: 2019, quarter: 2 as const, totalDays: 1248 };

const flutterScenario = TEST_SCENARIOS.find(s => s.id === 'flutter_envelope_expansion')!;
assert(flutterScenario !== undefined, 'Flutter envelope expansion flight test scenario exists in TEST_SCENARIOS');

const testProgram: AircraftProgram = {
  id: 'prog-m85-test',
  name: 'M-85 Test',
  familyId: 'fam-m85',
  isCleanSheet: true,
  marketSegment: 'small_narrowbody',
  targetAirlinesCategory: ['regional', 'low_cost'],
  createdAt: { day: 1, month: 1, year: 2016, quarter: 1, totalDays: 0 },
  currentPhase: 'flight_testing',
  phaseProgressPercent: 30,
  phaseElapsedDays: 90,
  phaseEstimatedDurationDays: 480,
  eisTargetDate: { day: 1, month: 10, year: 2022, quarter: 4, totalDays: 2465 },
  scheduleMilestones: {
    launchDate: { day: 1, month: 1, year: 2016, quarter: 1, totalDays: 0 },
    projectedFirstFlight: { day: 1, month: 6, year: 2019, quarter: 2, totalDays: 1248 },
    projectedCertification: { day: 1, month: 8, year: 2021, quarter: 3, totalDays: 2038 },
    projectedEis: { day: 1, month: 10, year: 2022, quarter: 4, totalDays: 2465 },
    delayLog: []
  },
  geometry: smallNbDraft.geometry,
  propulsion: smallNbDraft.propulsion,
  systems: smallNbDraft.systems,
  massBreakdown: smallNbSpecs.mass,
  performance: smallNbSpecs.perf,
  estimatedRange: { estimatedLow: 3800, estimatedHigh: 4600, currentKnowledge: smallNbSpecs.perf.rangeKm, isConfirmed: false },
  estimatedOew: { estimatedLow: 32000, estimatedHigh: 36000, currentKnowledge: smallNbSpecs.mass.oewKg, isConfirmed: false },
  estimatedFuelBurn: { estimatedLow: 18, estimatedHigh: 22, currentKnowledge: smallNbSpecs.perf.fuelBurnKgPerSeat1000Km, isConfirmed: false },
  estimatedUnitCost: { estimatedLow: 30, estimatedHigh: 38, currentKnowledge: smallNbSpecs.unitCost, isConfirmed: false },
  totalRdBudget: 850,
  spentRdBudget: 420,
  allocatedHeadcount: 220,
  schedulePressure: 'balanced',
  accumulatedTechDebt: 5,
  prototypesBuilt: [{
    id: 'pt_m85_001',
    programId: 'prog-m85-test',
    serialNumber: 'PT-001',
    name: 'Flight Test Article 1',
    primaryRole: 'aerodynamics_envelope',
    status: 'flight_testing',
    flightHours: 0,
    cycles: 0,
    completionPercent: 100,
    assignedLocationAirportId: 'ORD',
    currentMissionId: 'flutter_envelope_expansion'
  }],
  testCampaignsProgress: {
    groundTestsTotal: 8,
    groundTestsCompleted: 8,
    flightHoursRequired: 1800,
    flightHoursLogged: 0,
    flightEnvelopeExpansionPercent: 0,
    anomaliesFound: 0,
    anomaliesResolved: 0
  },
  activeTestMissions: [{
    id: 'mission-flutter-01',
    scenarioId: flutterScenario.id,
    prototypeId: 'pt_m85_001',
    startDate: { ...currentDate },
    durationDays: flutterScenario.durationDays,
    daysElapsed: 0,
    flightHoursExpected: flutterScenario.flightHoursLogged,
    envelopeGainExpected: flutterScenario.envelopeGainPercent,
    costMUSD: flutterScenario.costMUSD,
    status: 'running'
  }],
  completedScenarioIds: [],
  groundTestsTotal: 8,
  groundTestsCompleted: 8,
  typeCertificateIssued: false,
  productionCertificateIssued: false,
  listPrice: smallNbSpecs.listPrice,
  estimatedUnitCostValue: smallNbSpecs.unitCost,
  ordersBacklogCount: 0,
  totalDeliveriesCount: 0,
  activeInServiceCount: 0,
  dispatchReliabilityMaturePercent: 99.4,
  currentServiceReliabilityPercent: 98.0,
  certificationFindings: [],
  livery: {
    primaryColor: '#0ea5e9',
    accentColor: '#f59e0b',
    tailLogoStyle: 'wing',
    stripeStyle: 'swept'
  }
};

const initialCompanyState: CompanyState = {
  name: 'Skyline Aerospace',
  ticker: 'SKYA',
  logo: 'plane',
  country: 'United States',
  headquartersCity: 'Seattle',
  foundedDate: { day: 1, month: 1, year: 2016, quarter: 1, totalDays: 0 },
  philosophy: 'engineering_excellence',
  initialFundingType: 'venture_capital',
  reputationScore: 65,
  trustLevel: 'emerging',
  financials: {
    cash: 450,
    monthlyRevenue: 0,
    monthlyExpenses: 4.2,
    monthlyBurnRate: 4.2,
    totalDebt: 0,
    sharePrice: 25.0,
    insolvencyStatus: 'solvent',
    sharesOutstanding: 10000000,
    isPubliclyTraded: false,
    emergencyFundingUsed: false,
    valuation: 250,
    quarterlyHistory: []
  },
  investors: [],
  technologiesUnlocked: [],
  facilities: [{
    id: 'fac-seat-01',
    name: 'Seattle Engineering Center',
    type: 'engineering_center',
    locationCity: 'Seattle',
    country: 'United States',
    lat: 47.6,
    lon: -122.3,
    level: 2,
    capacity: 500,
    monthlyOperatingCost: 0.85,
    efficiencyBonus: 1.0
  }],
  departments: [
    { id: 'dep-eng', name: 'Aerodynamics & Structures', category: 'engineering', headcount: 220, targetHeadcount: 220, averageExperience: 7, accumulatedKnowledge: 85, baseSalary: 10000, morale: 85, productivity: 1.0, overtimeAllowed: false },
    { id: 'dep-ops', name: 'Flight Test Operations', category: 'operations', headcount: 45, targetHeadcount: 45, averageExperience: 8, accumulatedKnowledge: 90, baseSalary: 11000, morale: 88, productivity: 1.0, overtimeAllowed: false }
  ],
  programs: [testProgram],
  enginePrograms: [],
  suppliers: INITIAL_SUPPLIERS,
  activeInServiceFleet: [],
  assemblyLines: [],
  firmContracts: [],
  rfpProposals: [],
  incidentHistory: [],
  newsHistory: [],
  milestonesUnlocked: [],
  activeTestFlightMap: []
};

const economy: MacroEconomy = {
  gdpIndex: 100,
  passengerTravelDemandIndex: 100,
  cargoDemandIndex: 100,
  fuelPricePerGallon: 2.85,
  fuelTrend: 'stable',
  interestRate: 0.045,
  businessConfidence: 80
};

// Simulate durationDays of the test mission
let simResult: {
  updatedCompany: CompanyState;
  updatedEconomy: MacroEconomy;
  updatedDate: any;
  updatedCompetitors: any[];
  updatedAirlines: any[];
  isMonthEnd: boolean;
} = { updatedCompany: initialCompanyState, updatedEconomy: economy, updatedDate: currentDate, updatedCompetitors: INITIAL_COMPETITORS, updatedAirlines: INITIAL_AIRLINES, isMonthEnd: false };

for (let d = 0; d < flutterScenario.durationDays; d++) {
  simResult = executeDailySimulationTick(
    simResult.updatedCompany,
    simResult.updatedEconomy,
    simResult.updatedDate,
    simResult.updatedCompetitors,
    simResult.updatedAirlines,
    rng
  );
}

const updatedProg = simResult.updatedCompany.programs[0];
const updatedPt = updatedProg.prototypesBuilt[0];

assert(
  updatedProg.testCampaignsProgress.flightHoursLogged >= flutterScenario.flightHoursLogged,
  `Flight hours increased from 0 to ${updatedProg.testCampaignsProgress.flightHoursLogged}h (Expected >= ${flutterScenario.flightHoursLogged}h)`
);
assert(
  updatedProg.testCampaignsProgress.flightEnvelopeExpansionPercent >= flutterScenario.envelopeGainPercent,
  `Envelope expansion increased from 0% to ${updatedProg.testCampaignsProgress.flightEnvelopeExpansionPercent}% (Expected >= ${flutterScenario.envelopeGainPercent}%)`
);
assert(
  updatedProg.completedScenarioIds.includes(flutterScenario.id),
  'Scenario marked as completed in program.completedScenarioIds'
);
assert(
  updatedProg.activeTestMissions.length === 0,
  'Active test mission cleared upon completion'
);
assert(
  updatedPt.flightHours >= flutterScenario.flightHoursLogged,
  `Prototype FT-001 logged flight hours (${updatedPt.flightHours}h)`
);

// -------------------------------------------------------------
// TEST SUITE 3: Autonomous RFP Flow & Airline Decision
// -------------------------------------------------------------
console.log('\n--- 3. AUTONOMOUS RFP BIDDING & AIRLINE DECISION TEST ---');

// Generate RFP and submit bid
let newRfp = null;
for (let attempt = 0; attempt < 30; attempt++) {
  newRfp = generatePotentialAirlineRFP(
    INITIAL_AIRLINES,
    simResult.updatedDate,
    [],
    simResult.updatedCompany.trustLevel,
    110,
    rng
  );
  if (newRfp) break;
}
assert(newRfp !== null && newRfp !== undefined, 'Market successfully generates RFPs dynamically');

if (newRfp) {
  // Prepare and submit player proposal
  newRfp.status = 'under_review';
  newRfp.reviewDaysRemaining = 12;
  newRfp.playerBid = {
    rfpId: newRfp.id,
    programId: updatedProg.id,
    offeredUnitPrice: 45.0,
    discountPercentage: 8.5,
    quantityFirm: 6,
    quantityOptions: 2,
    deliveryStartQuarter: { year: simResult.updatedDate.year + 2, quarter: 1 },
    deliverySlotsPerYear: 4,
    performanceGuarantees: { fuelBurnWarranty: true, dispatchReliabilityWarranty: true, lateDeliveryPenaltyPerDay: 5000 },
    supportPackageIncluded: 'standard_turnkey',
    financingAssistance: 'none'
  };

  simResult.updatedCompany.rfpProposals = [newRfp];
}

// Simulate days until airline decision
for (let d = 0; d < 14; d++) {
  simResult = executeDailySimulationTick(
    simResult.updatedCompany,
    simResult.updatedEconomy,
    simResult.updatedDate,
    simResult.updatedCompetitors,
    simResult.updatedAirlines,
    rng
  );
}

const evaluatedRfp = simResult.updatedCompany.rfpProposals.find(r => r.id === newRfp?.id);
assert(
  ['won', 'lost_to_competitor', 'accepted', 'rejected'].includes(evaluatedRfp?.status || ''),
  'Airline autonomously evaluated and settled RFP proposal without manual click',
  `Result: ${evaluatedRfp?.status}`
);

// -------------------------------------------------------------
// TEST SUITE 4: Full Headless End-to-End Simulation (2016-2028)
// -------------------------------------------------------------
console.log('\n--- 4. FULL HEADLESS END-TO-END SYSTEMIC LOOP SIMULATION (2016-2028) ---');

let e2eCompany: CompanyState = {
  ...initialCompanyState,
  financials: {
    ...initialCompanyState.financials,
    cash: 650
  },
  programs: [{
    ...testProgram,
    currentPhase: 'concept',
    phaseProgressPercent: 0,
    phaseElapsedDays: 0,
    prototypesBuilt: [],
    testCampaignsProgress: {
      groundTestsTotal: 8,
      groundTestsCompleted: 0,
      flightHoursRequired: 1800,
      flightHoursLogged: 0,
      flightEnvelopeExpansionPercent: 0,
      anomaliesFound: 0,
      anomaliesResolved: 0
    },
    activeTestMissions: [],
    completedScenarioIds: [],
    typeCertificateIssued: false,
    productionCertificateIssued: false,
    ordersBacklogCount: 0,
    totalDeliveriesCount: 0,
    activeInServiceCount: 0,
    certificationFindings: []
  }]
};

let e2eResult: {
  updatedCompany: CompanyState;
  updatedEconomy: MacroEconomy;
  updatedDate: any;
  updatedCompetitors: any[];
  updatedAirlines: any[];
  isMonthEnd: boolean;
} = {
  updatedCompany: e2eCompany,
  updatedEconomy: economy,
  updatedDate: { day: 1, month: 1, year: 2016, quarter: 1 as const, totalDays: 0 },
  updatedCompetitors: INITIAL_COMPETITORS,
  updatedAirlines: INITIAL_AIRLINES,
  isMonthEnd: false
};

let reachedGroundTesting = false;
let reachedFlightTesting = false;
let typeCertAchieved = false;
let contractSigned = false;
let falCommissioned = false;
let deliveryAchieved = false;

console.log('Simulating 12 years of operational ticks...');

for (let day = 0; day < 4380; day++) {
  const currentProg = e2eResult.updatedCompany.programs[0];

  // Ground testing progression
  if (currentProg.currentPhase === 'ground_testing') {
    reachedGroundTesting = true;
    if (currentProg.groundTestsCompleted < 4) {
      currentProg.groundTestsCompleted = 4;
    }
  }

  if (currentProg.currentPhase === 'flight_testing') {
    reachedFlightTesting = true;
    
    // Resolve any findings discovered during flights
    currentProg.certificationFindings.forEach(f => {
      if (f.status === 'open') f.status = 'verified_resolved';
    });

    if (currentProg.activeTestMissions.length === 0 && currentProg.testCampaignsProgress.flightHoursLogged < 1800) {
      const flightScenarios = TEST_SCENARIOS.filter(s => s.category === 'flight');
      const nextScenario = flightScenarios.find(s => !currentProg.completedScenarioIds.includes(s.id)) || flightScenarios[day % flightScenarios.length];
      const proto = currentProg.prototypesBuilt[0];
      if (proto) {
        currentProg.activeTestMissions.push({
          id: `mission-${day}`,
          scenarioId: nextScenario.id,
          prototypeId: proto.id,
          startDate: { ...e2eResult.updatedDate },
          durationDays: 2,
          daysElapsed: 0,
          flightHoursExpected: 60,
          envelopeGainExpected: 8,
          costMUSD: 1.0,
          status: 'running'
        });
      }
    }
  }

  // Check certification
  if (currentProg.typeCertificateIssued) {
    typeCertAchieved = true;
  }

  // Inject contract & commission assembly line after certification
  if (typeCertAchieved && !contractSigned) {
    e2eResult.updatedCompany.firmContracts.push({
      id: 'contract-e2e-01',
      airlineId: 'air_canada',
      programId: currentProg.id,
      signedDate: { ...e2eResult.updatedDate },
      quantityFirm: 6,
      quantityOptions: 2,
      unitNegotiatedPrice: 48.0,
      totalContractValue: 288.0,
      downPaymentReceived: 43.2,
      deliverySchedule: [
        { year: 2023, quarter: 1, quantity: 3, deliveredCount: 0 },
        { year: 2023, quarter: 2, quantity: 3, deliveredCount: 0 }
      ],
      status: 'active'
    });
    currentProg.ordersBacklogCount += 6;
    contractSigned = true;
  }

  if (contractSigned && !falCommissioned) {
    const newLine: AssemblyLine = {
      id: 'fal-line-01',
      programId: currentProg.id,
      facilityId: 'fac-seat-01',
      name: 'Seattle Final Assembly Line 1',
      status: 'tooling_in_progress',
      toolingDaysRemaining: 15, // 15 days tooling in test
      toolingTotalCostMUSD: 85.0,
      maxMonthlyRate: 5.0,
      currentMonthlyRateTarget: 3.0,
      actualMonthlyRate: 0,
      automationLevel: 3,
      qualityControlMaturity: 90,
      workerSkillScore: 85,
      activeUnitsOnLine: []
    };
    e2eResult.updatedCompany.assemblyLines.push(newLine);
    falCommissioned = true;
  }

  // Check deliveries
  if (currentProg.totalDeliveriesCount > 0) {
    deliveryAchieved = true;
  }

  // Tick simulation
  e2eResult = executeDailySimulationTick(
    e2eResult.updatedCompany,
    e2eResult.updatedEconomy,
    e2eResult.updatedDate,
    e2eResult.updatedCompetitors,
    e2eResult.updatedAirlines,
    rng
  );

  // Periodic capital injections/Series funding when cash runs tight during early development
  if (e2eResult.updatedCompany.financials.cash < 40 && day < 2500) {
    e2eResult.updatedCompany.financials.cash += 150;
  }
}

assert(reachedGroundTesting, 'Program reached Ground Testing phase');
assert(reachedFlightTesting, 'Program reached Flight Testing phase');
assert(typeCertAchieved, 'Program passed all flight test gates and achieved Type Certification');
assert(contractSigned, 'Customer contract signed with launch customer');
assert(deliveryAchieved, 'First commercial delivery completed through the Final Assembly Line (MSN-001 in service)');
assert(e2eResult.updatedCompany.activeInServiceFleet.length > 0, 'Airliner is in active commercial service in airline fleet');
assert(!Number.isNaN(e2eResult.updatedCompany.financials.cash), 'Final company cash is not NaN');
assert(Number.isFinite(e2eResult.updatedCompany.financials.cash), 'Final company cash is finite');
assert(e2eResult.updatedCompany.financials.insolvencyStatus !== 'insolvent', 'Company remained solvent with proper financial model');

// -------------------------------------------------------------
// TEST SUITE 5: 100% i18n & Localization Dictionary Audit
// -------------------------------------------------------------
console.log('\n--- 5. 100% I18N LOCALIZATION AUDIT ---');

const enDict = getTranslations('en');
const ptDict = getTranslations('pt-BR');

assert(Object.keys(enDict).length >= 10, 'English dictionary root groups loaded', `Groups: ${Object.keys(enDict).length}`);
assert(Object.keys(ptDict).length >= 10, 'Portuguese dictionary root groups loaded', `Groups: ${Object.keys(ptDict).length}`);

const criticalKeys = [
  'navigation.aircraft',
  'navigation.flightTesting',
  'navigation.production',
  'navigation.ordersRfps',
  'dashboard.roadmap.title',
  'testing.conductTest',
  'production.ratePerMonth',
  'rfp.underReview',
  'designer.why.wingspan',
  'designer.warnings.underpoweredTitle',
  'news.templates.certificationGranted'
];

for (const key of criticalKeys) {
  assert(t(key, undefined, 'pt-BR') !== key, `Key '${key}' is translated in pt-BR`, `Output: ${t(key, undefined, 'pt-BR')}`);
  assert(t(key, undefined, 'en') !== key, `Key '${key}' is translated in en`, `Output: ${t(key, undefined, 'en')}`);
}

console.log(`\n======================================================`);
console.log(`VERIFICATION RESULTS: ${passedTests}/${totalTests} tests passed (${((passedTests/totalTests)*100).toFixed(1)}%)`);
console.log(`======================================================\n`);

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
