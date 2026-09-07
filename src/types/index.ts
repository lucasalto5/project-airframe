// ============================================================================
// PROJECT AIRFRAME - MASTER TYPE DEFINITIONS
// ============================================================================

export type GameSpeed = 0 | 1 | 2 | 4 | 8 | 16;

export type MarketSegmentId = 
  | 'regional_turboprop'
  | 'regional_jet'
  | 'small_narrowbody'
  | 'narrowbody'
  | 'large_narrowbody'
  | 'mid_market'
  | 'widebody'
  | 'large_widebody'
  | 'freighter_conversion'
  | 'purpose_built_freighter';

export type FundingType = 
  | 'bootstrapped'
  | 'private_equity'
  | 'venture_capital'
  | 'industrial_group'
  | 'state_backed';

export type CompanyPhilosophy = 
  | 'engineering_excellence'   // High quality, low fuel burn, higher development cost
  | 'cost_leadership'          // Fast to market, low unit cost, simpler systems
  | 'passenger_comfort'        // Wider cabin, lower cabin altitude, premium appeal
  | 'operational_ruggedness'   // High dispatch reliability, unpaved runway capability, robust landing gear
  | 'technological_pioneer';   // Aggressive composite/fly-by-wire adoption

export type MaterialType = 
  | 'conventional_aluminum'
  | 'advanced_al_li'
  | 'carbon_composite_hybrid'
  | 'full_carbon_composite';

export type WingletType = 
  | 'none'
  | 'canted'
  | 'blended'
  | 'split_scimitar'
  | 'raked_wingtip'
  | 'folding_wingtip';

export type FlightControlTech = 
  | 'hydromechanical'
  | 'analog_fbw'
  | 'digital_fbw'
  | 'adaptive_envelope_fbw';

export type CockpitTech = 
  | 'traditional_gauges'
  | 'glass_cockpit_crt'
  | 'modern_lcd_efis'
  | 'panoramic_touch_screens';

export type EngineSourceType = 
  | 'third_party'
  | 'joint_venture'
  | 'in_house';

export type ProgramPhase = 
  | 'concept'
  | 'preliminary_design'
  | 'detailed_design'
  | 'prototype_build'
  | 'ground_testing'
  | 'flight_testing'
  | 'certification'
  | 'production_ready'
  | 'entry_into_service'
  | 'mature_production'
  | 'production_ended';

export type TestResultOutcome = 
  | 'pass'
  | 'pass_observation'
  | 'anomaly'
  | 'fail'
  | 'critical_issue';

export type TrustLevel = 
  | 'unknown'        // Score < 15
  | 'experimental'   // Score 15-30
  | 'emerging'       // Score 30-50
  | 'proven'         // Score 50-70
  | 'trusted'        // Score 70-85
  | 'global_supplier'// Score 85-95
  | 'industry_leader'; // Score 95-100

export type IncidentSeverity = 
  | 'technical_diversion'
  | 'engine_shutdown_in_flight'
  | 'hydraulic_loss'
  | 'hard_landing'
  | 'runway_excursion'
  | 'uncontained_engine_failure'
  | 'hull_loss'
  | 'fatal_accident';

export type InvestigationPhase = 
  | 'initial_response'
  | 'evidence_collection'
  | 'preliminary_findings'
  | 'technical_analysis'
  | 'probable_cause'
  | 'final_report_closed';

export type NotificationCategory = 
  | 'info'
  | 'commercial'
  | 'engineering'
  | 'production'
  | 'financial'
  | 'safety'
  | 'critical';

export interface GameDate {
  day: number;
  month: number;   // 1 - 12
  year: number;
  quarter: 1 | 2 | 3 | 4;
  totalDays: number;
}

export interface MacroEconomy {
  gdpIndex: number;              // 100 base
  fuelPricePerGallon: number;    // e.g., $2.40 to $4.80
  fuelTrend: 'rising' | 'stable' | 'falling';
  passengerTravelDemandIndex: number; // 100 base
  cargoDemandIndex: number;      // 100 base
  businessConfidence: number;    // 0 - 100
  interestRate: number;          // e.g. 0.035 (3.5%)
  activeShock?: {
    id: string;
    title: string;
    description: string;
    passengerDemandMultiplier: number;
    fuelMultiplier: number;
    remainingDays: number;
  };
}

export interface Department {
  id: string;
  name: string;
  category: 'engineering' | 'production' | 'operations' | 'corporate';
  headcount: number;
  targetHeadcount: number;
  averageExperience: number; // 1 to 10
  morale: number;            // 0 - 100
  baseSalary: number;        // Monthly per person
  overtimeAllowed: boolean;
  productivity: number;      // Calculated multiplier (e.g. 0.85 - 1.3)
  accumulatedKnowledge: number;
}

export interface Facility {
  id: string;
  name: string;
  type: 
    | 'headquarters'
    | 'engineering_center'
    | 'wind_tunnel'
    | 'structural_test_rig'
    | 'engine_test_cell'
    | 'flight_test_center'
    | 'final_assembly_line'
    | 'customer_support_center'
    | 'spare_parts_depot';
  locationCity: string;
  country: string;
  lat: number;
  lon: number;
  level: number;
  capacity: number;
  monthlyOperatingCost: number;
  efficiencyBonus: number;
}

export interface Investor {
  id: string;
  name: string;
  type: FundingType;
  equityPercentage: number;
  expectations: 'cautious' | 'balanced' | 'aggressive';
  patience: number; // 0 - 100
  confidence: number; // 0 - 100
  boardSeats: number;
  milestoneDeadlineYear?: number;
  milestoneGoal?: string;
}

export interface Financials {
  cash: number;
  totalDebt: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  monthlyBurnRate: number;
  valuation: number;
  sharePrice?: number;
  sharesOutstanding: number;
  isPubliclyTraded: boolean;
  insolvencyStatus: 'solvent' | 'critical_liquidity' | 'insolvent';
  emergencyFundingUsed: boolean;
  quarterlyHistory: {
    year: number;
    quarter: number;
    revenue: number;
    cogs: number;
    rdExpense: number;
    operatingProfit: number;
    deliveries: number;
    firmOrders: number;
  }[];
}

export interface AircraftGeometry {
  length: number;           // meters (e.g., 34.5)
  fuselageDiameter: number; // meters (e.g., 3.75)
  cabinWidth: number;       // meters (e.g., 3.50)
  seatsAbreast: number;     // 4 (2+2), 5 (2+3), 6 (3+3), 7 (2+3+2), 8 (2+4+2), 9 (3+3+3)
  aisles: 1 | 2;
  typicalSeats: number;     // calculated
  maxSeats: number;         // exit limit calculation
  seatPitchInches: number;  // 29 to 34 inches
  wingSpan: number;         // meters
  wingArea: number;         // m^2
  aspectRatio: number;      // 8.0 - 13.5
  wingSweepDegrees: number; // 18 - 35 deg
  wingletType: WingletType;
  compositePercentageWing: number; // 0 - 85%
  compositePercentageFuselage: number; // 0 - 85%
  materialType: MaterialType;
  fuelCapacityLiters: number;
  cargoVolumeCubicMeters: number;
  emergencyExits: number;
  noseStyle: 'sharp_aerodynamic' | 'classic_drooped' | 'curved_composite';
}

export interface PropulsionConfig {
  sourceType: EngineSourceType;
  engineModelId: string;
  engineName: string;
  numberOfEngines: 2 | 4;
  engineLocation: 'under_wing' | 'rear_fuselage';
  thrustPerEngineKN: number;       // kN (e.g. 100 - 450 kN)
  fanDiameterMeters: number;      // meters (e.g. 1.7 - 3.2m)
  bypassRatio: number;            // e.g. 8.5 to 14.0
  cruiseSFC: number;              // Specific Fuel Consumption lb/(lbf*h)
  dryWeightKg: number;
  pricePerEngine: number;
}

export interface AircraftSystemsConfig {
  flightControls: FlightControlTech;
  cockpitTech: CockpitTech;
  autolandCat: 'CAT_I' | 'CAT_II' | 'CAT_IIIa' | 'CAT_IIIb';
  moreElectricArchitecture: boolean; // Replaces bleed air / hydraulic complexity with high-output generators
  hydraulicRedundancy: 2 | 3 | 4;   // Triple redundant system is standard widebody/modern narrowbody
  cabinAltitudeFeet: number;         // e.g. 6,000 ft (modern composite) vs 8,000 ft (traditional Al)
  wifiAndIFE: 'none' | 'byod_streaming' | 'seatback_hd_screens';
  noiseInsulationLevel: 'basic' | 'standard' | 'ultra_quiet';
}

export interface AircraftMassBreakdown {
  structureMassKg: number;
  propulsionSystemMassKg: number;
  systemsAndAvionicsMassKg: number;
  cabinAndFurnishingsMassKg: number;
  oewKg: number;                 // Operating Empty Weight
  maxPayloadKg: number;
  mzfwKg: number;                // Max Zero Fuel Weight
  maxFuelKg: number;
  mtowKg: number;                // Max Takeoff Weight
  mlwKg: number;                 // Max Landing Weight
}

export interface AircraftPerformance {
  rangeKm: number;               // Breguet calculation with nominal payload
  rangeNm: number;
  cruiseMach: number;            // Mach 0.76 - 0.86
  cruiseSpeedKmh: number;
  serviceCeilingFeet: number;
  takeoffFieldLengthMeters: number; // TOFL at MTOW ISA SL
  landingFieldLengthMeters: number;
  liftToDragRatioCruise: number; // L/D (e.g. 17.5 - 21.0)
  fuelBurnKgPerSeat1000Km: number;
  directOperatingCostPerSeatKm: number; // USD ($0.035 - $0.075)
  noiseEPNdB: number;
  co2GramsPerPaxKm: number;
  turnaroundTimeMinutes: number;
  passengerComfortScore: number; // 0 - 100
  airlineAppealScore: number;    // Calculated fit for airlines
  designAppealScore: number;     // Aesthetic industrial design score
}

export interface EstimatedVsActual<T> {
  estimatedLow: T;
  estimatedHigh: T;
  currentKnowledge: T;
  isConfirmed: boolean;
}

export interface ProgramScheduleMilestones {
  launchDate: GameDate;
  projectedFirstFlight: GameDate;
  projectedCertification: GameDate;
  projectedEis: GameDate;
  actualFirstFlight?: GameDate;
  actualCertification?: GameDate;
  actualEis?: GameDate;
  delayLog: {
    id: string;
    date: GameDate;
    reasonKey: string;
    reasonParams?: Record<string, any>;
    daysAdded: number;
  }[];
}

export interface ActiveTestMission {
  id: string;
  scenarioId: string;
  prototypeId: string;
  startDate: GameDate;
  durationDays: number;
  daysElapsed: number;
  flightHoursExpected: number;
  envelopeGainExpected: number;
  costMUSD: number;
  status: 'running' | 'completed' | 'requires_retest';
}

export interface AircraftProgram {
  id: string;
  name: string;             // e.g. "A120"
  familyId: string;
  isCleanSheet: boolean;
  baseVariantId?: string;
  marketSegment: MarketSegmentId;
  targetAirlinesCategory: string[];
  createdAt: GameDate;
  eisTargetDate: GameDate;
  actualEisDate?: GameDate;
  currentPhase: ProgramPhase;
  phaseProgressPercent: number; // 0 - 100
  phaseElapsedDays: number;
  phaseEstimatedDurationDays: number;
  scheduleMilestones: ProgramScheduleMilestones;
  
  // Design specifications
  geometry: AircraftGeometry;
  propulsion: PropulsionConfig;
  systems: AircraftSystemsConfig;
  massBreakdown: AircraftMassBreakdown;
  performance: AircraftPerformance;
  
  // Fog of development (estimates narrow down during testing)
  estimatedRange: EstimatedVsActual<number>;
  estimatedOew: EstimatedVsActual<number>;
  estimatedFuelBurn: EstimatedVsActual<number>;
  estimatedUnitCost: EstimatedVsActual<number>;
  
  // Program Financials & R&D
  totalRdBudget: number;
  spentRdBudget: number;
  allocatedHeadcount: number;
  schedulePressure: 'relaxed' | 'balanced' | 'aggressive' | 'crunch';
  accumulatedTechDebt: number; // 0 - 100
  
  // Testing & Certification
  prototypesBuilt: PrototypeAircraft[];
  activeTestMissions: ActiveTestMission[];
  completedScenarioIds: string[];
  groundTestsCompleted: number;
  groundTestsTotal: number;
  testCampaignsProgress: {
    groundTestsCompleted: number;
    groundTestsTotal: number;
    flightHoursLogged: number;
    flightHoursRequired: number;
    flightEnvelopeExpansionPercent: number;
    anomaliesFound: number;
    anomaliesResolved: number;
  };
  certificationFindings: CertificationFinding[];
  typeCertificateIssued: boolean;
  productionCertificateIssued: boolean;
  
  // Commercial Specs
  listPrice: number;            // Millions USD
  estimatedUnitCostValue: number;// Millions USD to manufacture
  ordersBacklogCount: number;
  totalDeliveriesCount: number;
  activeInServiceCount: number;
  dispatchReliabilityMaturePercent: number; // e.g. 99.4%
  currentServiceReliabilityPercent: number;
  
  // Livery & Visual
  livery: {
    primaryColor: string;
    accentColor: string;
    tailLogoStyle: 'globe' | 'arrow' | 'wing' | 'crest';
    stripeStyle: 'straight' | 'swept' | 'dynamic' | 'minimalist';
  };
}

export interface PrototypeAircraft {
  id: string;
  programId: string;
  serialNumber: string;        // e.g. "PT-001"
  name: string;
  primaryRole: 'aerodynamics_envelope' | 'systems_avionics' | 'extreme_weather_hot_high' | 'cabin_evac_function';
  status: 'under_construction' | 'ground_testing' | 'flight_testing' | 'maintenance' | 'retired';
  flightHours: number;
  cycles: number;
  completionPercent: number;
  assignedLocationAirportId: string;
  currentMissionId?: string;
  currentFlightActivity?: {
    testScenarioId: string;
    originAirportId: string;
    destinationAirportId: string;
    lat: number;
    lon: number;
    heading: number;
    altitudeFeet: number;
    progressPercent: number;
  };
}

export interface CertificationFinding {
  id: string;
  programId: string;
  titleKey: string;
  descKey: string;
  severity: 'observation' | 'level_2_minor' | 'level_1_major' | 'airworthiness_blocker';
  status: 'open' | 'investigating' | 'redesign_in_progress' | 'verified_resolved';
  costToFix: number;
  daysToFix: number;
}

export interface EngineProgram {
  id: string;
  name: string;
  family: string;
  sourceType: EngineSourceType;
  thrustRatingKN: number;
  fanDiameterMeters: number;
  bypassRatio: number;
  turbineInletTempKelvin: number;
  cruiseSFC: number;
  dryWeightKg: number;
  developmentCost: number;
  developmentProgressPercent: number;
  status: 'development' | 'certified' | 'in_production';
  reliabilityScore: number;
  unitCost: number;
  unitPrice: number;
  salesCount: number;
}

export interface AssemblyLine {
  id: string;
  name: string;
  facilityId: string;
  programId: string;
  status: 'tooling_in_progress' | 'ready_for_production' | 'active_producing';
  toolingDaysRemaining: number;
  toolingTotalCostMUSD: number;
  maxMonthlyRate: number;
  currentMonthlyRateTarget: number;
  actualMonthlyRate: number;
  automationLevel: number; // 1 - 5
  qualityControlMaturity: number; // 0 - 100
  workerSkillScore: number;
  activeBottleneckKey?: string;
  activeUnitsOnLine: AssemblyUnit[];
}

export interface AssemblyUnit {
  serialNumber: string; // MSN (Manufacturer Serial Number)
  programId: string;
  customerAirlineId: string;
  contractId: string;
  currentStationIndex: number; // 0 to 7
  stationProgressPercent: number;
  qualityDefectsCount: number;
  startedDate: GameDate;
  estimatedDeliveryDate: GameDate;
}

export interface Airport {
  iata: string;
  icao: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
  runwayLengthMeters: number;
  elevationFeet: number;
  hubTier: 'mega_hub' | 'major_international' | 'regional_hub' | 'small_feeder';
  annualPassengerVolumeMillions: number;
}

export interface AirlineCustomer {
  id: string;
  name: string;
  icao: string;
  country: string;
  region: 'north_america' | 'europe' | 'asia_pacific' | 'latin_america' | 'middle_east' | 'africa' | 'oceania';
  hubAirportIata: string;
  businessModel: 'legacy' | 'low_cost' | 'ultra_low_cost' | 'regional' | 'cargo' | 'leisure' | 'government';
  reputation: number; // 0 - 100
  financialHealth: 'prosperous' | 'stable' | 'struggling' | 'distressed';
  riskTolerance: 'very_conservative' | 'balanced' | 'innovative';
  growthStrategy: 'rapid_expansion' | 'steady_renewal' | 'cost_cutting';
  relationshipWithPlayer: number; // 0 - 100
  trustInPlayer: TrustLevel;
  manufacturerPreference: Record<string, number>; // brand affinity
  activeFleetCount: number;
  fleetComposition: {
    modelName: string;
    manufacturerName: string;
    isPlayerAircraft: boolean;
    count: number;
    averageAgeYears: number;
  }[];
  primaryColors: {
    primary: string;
    secondary: string;
  };
}

export interface CompetitorManufacturer {
  id: string;
  name: string;
  country: string;
  archetype: 'established_giant' | 'european_consortium' | 'regional_specialist' | 'asian_powerhouse' | 'state_enterprise' | 'agile_innovator';
  reputation: number;
  marketSharePercent: number;
  financialReserves: number;
  engineeringSkill: number;
  factoryCapacityPerMonth: number;
  activeAircraftFamilies: {
    name: string;
    segment: MarketSegmentId;
    seats: number;
    rangeKm: number;
    fuelBurnScore: number;
    listPrice: number;
    unitsDelivered: number;
    backlog: number;
  }[];
  currentRndPipeline?: {
    projectName: string;
    segment: MarketSegmentId;
    targetEisYear: number;
    status: 'rumored' | 'launched' | 'flight_testing' | 'near_eis';
  };
}

export interface RFPProposal {
  id: string;
  airlineId: string;
  issuanceDate: GameDate;
  expiryDate: GameDate;
  titleKey: string;
  titleParams?: Record<string, any>;
  requestedSegment: MarketSegmentId;
  targetSeatsMin: number;
  targetSeatsMax: number;
  targetRangeKm: number;
  quantityFirm: number;
  quantityOptions: number;
  desiredFirstDeliveryYear: number;
  maxAcceptableUnitPrice: number;
  importanceWeights: {
    fuelEconomy: number;     // 0 - 1
    acquisitionPrice: number;
    deliverySpeed: number;
    passengerComfort: number;
    manufacturerTrust: number;
    fleetCommonality: number;
  };
  status: 'open' | 'bid_submitted' | 'under_review' | 'won_by_player' | 'lost_to_competitor' | 'expired' | 'cancelled';
  reviewDaysRemaining: number;
  playerBid?: ContractProposal;
  competitorWinningBid?: {
    competitorId: string;
    aircraftName: string;
    unitPrice: number;
  };
}

export interface ContractProposal {
  rfpId: string;
  programId: string;
  offeredUnitPrice: number;
  discountPercentage: number;
  quantityFirm: number;
  quantityOptions: number;
  deliveryStartQuarter: {
    year: number;
    quarter: 1 | 2 | 3 | 4;
  };
  deliverySlotsPerYear: number;
  performanceGuarantees: {
    fuelBurnWarranty: boolean;
    dispatchReliabilityWarranty: boolean; // e.g. guaranteed 99.2%
    lateDeliveryPenaltyPerDay: number;
  };
  supportPackageIncluded: 'basic' | 'standard_turnkey' | 'comprehensive_fleet_care';
  financingAssistance: 'none' | 'manufacturer_backed_loan' | 'operating_lease_partner';
}

export interface FirmOrderContract {
  id: string;
  rfpId?: string;
  airlineId: string;
  programId: string;
  signedDate: GameDate;
  quantityFirm: number;
  quantityOptions: number;
  unitNegotiatedPrice: number;
  totalContractValue: number;
  downPaymentReceived: number;
  deliverySchedule: {
    year: number;
    quarter: 1 | 2 | 3 | 4;
    quantity: number;
    deliveredCount: number;
  }[];
  status: 'active' | 'completed' | 'cancelled_by_airline';
}

export interface SerializedAircraftInService {
  serialNumber: string;
  programId: string;
  airlineId: string;
  deliveryDate: GameDate;
  registration: string; // e.g. "N148AF"
  accumulatedFlightHours: number;
  accumulatedCycles: number;
  currentDispatchReliability: number;
  currentLocationAirportIata: string;
  assignedFlight?: SimulatedFlight;
}

export interface SimulatedFlight {
  flightNumber: string;
  aircraftSerial: string;
  airlineId: string;
  programId: string;
  originIata: string;
  destinationIata: string;
  distanceKm: number;
  departureTimeTotalDays: number;
  durationHours: number;
  progressPercent: number; // 0 - 100
  currentLat: number;
  currentLon: number;
  currentAltitudeFeet: number;
  headingDegrees: number;
}

export interface AircraftIncident {
  id: string;
  aircraftSerialNumber: string;
  programId: string;
  airlineId: string;
  occurredDate: GameDate;
  severity: IncidentSeverity;
  flightRoute: {
    originIata: string;
    destinationIata: string;
  };
  altitudeFeet: number;
  weatherConditions: 'clear' | 'turbulence' | 'severe_icing' | 'crosswind_gusts' | 'thunderstorm';
  casualties: {
    fatalities: number;
    injuries: number;
    passengersOnboard: number;
  };
  investigation: {
    phase: InvestigationPhase;
    daysInvestigating: number;
    blackBoxRecovered: boolean;
    rootCauseCategory?: 'design_flaw' | 'software_logic' | 'supplier_defect' | 'operator_maintenance' | 'pilot_error' | 'severe_weather' | 'undetermined';
    rootCauseDescription?: string;
    airworthinessDirectiveIssued?: {
      title: string;
      mandatoryAction: 'inspect_within_10_days' | 'software_patch' | 'replace_component' | 'ground_fleet_until_redesign';
      estimatedFleetCost: number;
      complianceDeadlineDays: number;
    };
    publicBlameOnPlayerScore: number; // 0 (100% airline/pilot error) to 100 (100% manufacturer design fault)
  };
}

export interface NewsArticle {
  id: string;
  publishedDate: GameDate;
  category: NotificationCategory;
  headline: string;
  source: string; // e.g. "Aviation Week & Space Intelligence", "FlightGlobal Dispatch", "Wall Street Aerospace Daily"
  summary: string;
  impactSubjectId?: string;
  impactType?: 'stock' | 'reputation' | 'orders' | 'industry';
  templateId?: string;
  templateParams?: Record<string, string | number>;
}

export interface HistoricMilestone {
  id: string;
  achievedDate: GameDate;
  title: string;
  description: string;
  iconName: string;
  rewardReputation: number;
  templateId?: string;
  templateParams?: Record<string, string | number>;
}

export interface SupplierPartner {
  id: string;
  name: string;
  country: string;
  category: 'engines' | 'avionics' | 'landing_gear' | 'apu' | 'seats_interiors' | 'composites' | 'brakes' | 'electrical_systems';
  qualityRating: number; // 0 - 100
  reliabilityScore: number; // 0 - 100
  financialHealth: 'strong' | 'stable' | 'vulnerable';
  leadTimeWeeks: number;
  costTier: 'budget' | 'standard' | 'premium';
  isDualSourced: boolean;
}

export interface MarketSegmentData {
  id: MarketSegmentId;
  name: string;
  seatRange: [number, number];
  typicalRangeKm: [number, number];
  projected20YearDemandUnits: number;
  currentFleetWorldwide: number;
  averageAgeYears: number;
  dominantCompetitors: string[];
  averagePriceMillionsUSD: number;
  projectedAnnualGrowthPercent: number;
  description: string;
}

export interface CompanyState {
  name: string;
  ticker: string;
  logo: string;
  country: string;
  headquartersCity: string;
  foundedDate: GameDate;
  philosophy: CompanyPhilosophy;
  initialFundingType: FundingType;
  reputationScore: number; // 0 - 100
  trustLevel: TrustLevel;
  financials: Financials;
  investors: Investor[];
  departments: Department[];
  facilities: Facility[];
  technologiesUnlocked: string[];
  programs: AircraftProgram[];
  enginePrograms: EngineProgram[];
  assemblyLines: AssemblyLine[];
  firmContracts: FirmOrderContract[];
  activeInServiceFleet: SerializedAircraftInService[];
  incidentHistory: AircraftIncident[];
  newsHistory: NewsArticle[];
  milestonesUnlocked: HistoricMilestone[];
  rfpProposals: RFPProposal[];
  suppliers: SupplierPartner[];
  activeTestFlightMap: SimulatedFlight[];
}

export interface GameSaveMetadata {
  id: string;
  name: string;
  companyName: string;
  companyTicker: string;
  currentDate: GameDate;
  savedAtTimestamp: number;
  schemaVersion: number;
  seed: number;
  playtimeMinutes: number;
  isAutosave: boolean;
}

export interface AircraftDraft {
  currentStep: number;
  name: string;
  marketSegment: MarketSegmentId;
  geometry: AircraftGeometry;
  propulsion: PropulsionConfig;
  systems: AircraftSystemsConfig;
  livery: {
    primaryColor: string;
    accentColor: string;
    tailLogoStyle: 'globe' | 'arrow' | 'wing' | 'crest';
    stripeStyle: 'straight' | 'swept' | 'dynamic' | 'minimalist';
  };
}
