// ============================================================================
// PROJECT AIRFRAME - MASTER GLOBAL GAME STORE (ZUSTAND)
// ============================================================================

import { create } from 'zustand';
import type {
  CompanyState,
  MacroEconomy,
  GameDate,
  GameSpeed,
  CompetitorManufacturer,
  AirlineCustomer,
  AircraftProgram,
  AssemblyLine,
  FundingType,
  CompanyPhilosophy,
  ContractProposal,
  Facility,
  Department,
  ProgramPhase,
  ActiveTestMission
} from '../types';
import { SeededRNG } from '../simulation/rng';
import { executeDailySimulationTick } from '../simulation/engine';
import { INITIAL_COMPETITORS } from '../data/competitors';
import { INITIAL_AIRLINES } from '../data/airlines';
import { INITIAL_SUPPLIERS } from '../data/suppliers';
import { TEST_SCENARIOS } from '../data/testCampaigns';
import { synthesizeAircraftSpecs } from '../simulation/formulas';
import { generatePotentialAirlineRFP } from '../simulation/rfpEngine';
import { checkForInServiceIncident } from '../simulation/incidentEngine';
import { storageManager, CURRENT_SCHEMA_VERSION } from '../storage/db';
import type { FullGameState } from '../storage/db';
import type { AircraftDraft } from '../types';

export interface NewGameOptions {
  companyName: string;
  ticker: string;
  country: string;
  hqCity: string;
  philosophy: CompanyPhilosophy;
  fundingType: FundingType;
  startYear: number;
  seed: number;
  primaryColor: string;
  accentColor: string;
}

export const DEFAULT_AIRCRAFT_DRAFT: AircraftDraft = {
  currentStep: 1,
  name: 'A120',
  marketSegment: 'small_narrowbody',
  geometry: {
    length: 35.8,
    fuselageDiameter: 3.75,
    cabinWidth: 3.50,
    seatsAbreast: 5,
    aisles: 1,
    typicalSeats: 120,
    maxSeats: 145,
    seatPitchInches: 31,
    wingSpan: 32.5,
    wingArea: 112.0,
    aspectRatio: 9.4,
    wingSweepDegrees: 24.5,
    wingletType: 'split_scimitar',
    compositePercentageWing: 45,
    compositePercentageFuselage: 25,
    materialType: 'advanced_al_li',
    fuelCapacityLiters: 21500,
    cargoVolumeCubicMeters: 28,
    emergencyExits: 4,
    noseStyle: 'sharp_aerodynamic'
  },
  propulsion: {
    sourceType: 'third_party',
    engineModelId: 'LEAP_1A_26',
    engineName: 'AeroPower AP-1X (26k lbf)',
    numberOfEngines: 2,
    engineLocation: 'under_wing',
    thrustPerEngineKN: 120.5,
    fanDiameterMeters: 1.98,
    bypassRatio: 11.0,
    cruiseSFC: 0.515,
    dryWeightKg: 2980,
    pricePerEngine: 14.2
  },
  systems: {
    flightControls: 'digital_fbw',
    cockpitTech: 'modern_lcd_efis',
    autolandCat: 'CAT_IIIa',
    moreElectricArchitecture: true,
    hydraulicRedundancy: 3,
    cabinAltitudeFeet: 6500,
    wifiAndIFE: 'byod_streaming',
    noiseInsulationLevel: 'standard'
  },
  livery: {
    primaryColor: '#0ea5e9',
    accentColor: '#f59e0b',
    tailLogoStyle: 'wing',
    stripeStyle: 'swept'
  }
};

export interface GameStoreState {
  isInitialized: boolean;
  gameSpeed: GameSpeed;
  seed: number;
  currentDate: GameDate;
  macroEconomy: MacroEconomy;
  company: CompanyState;
  competitors: CompetitorManufacturer[];
  airlines: AirlineCustomer[];
  playtimeMinutes: number;
  activeView: 'dashboard' | 'studio' | 'engines' | 'testing' | 'production' | 'sales' | 'map' | 'airlines' | 'competitors' | 'safety' | 'company' | 'news' | 'milestones' | 'saves';
  selectedProgramId?: string;
  selectedRfpId?: string;
  activeModal?: string;
  saveStatus: 'idle' | 'saving' | 'saved';
  lastSavedTime?: string;
  aircraftDraft: AircraftDraft;
  
  // Actions
  autoHydrate: () => Promise<boolean>;
  initNewGame: (options: NewGameOptions) => void;
  setGameSpeed: (speed: GameSpeed) => void;
  setActiveView: (view: GameStoreState['activeView']) => void;
  setSelectedProgramId: (id?: string) => void;
  setSelectedRfpId: (id?: string) => void;
  tickGame: () => void;
  
  // Aircraft Draft actions
  updateAircraftDraft: (updates: Partial<AircraftDraft>) => void;
  setAircraftDraftStep: (step: number) => void;
  resetAircraftDraft: () => void;
  
  // Engineering & R&D
  createAircraftProgram: (programData: Partial<AircraftProgram>) => void;
  updateProgramDesign: (programId: string, updates: Partial<AircraftProgram>) => void;
  constructPrototype: (programId: string, role: 'aerodynamics_envelope' | 'systems_avionics' | 'extreme_weather_hot_high' | 'cabin_evac_function') => void;
  scheduleFlightTest: (programId: string, scenarioId: string, prototypeId: string) => boolean;
  resolveCertificationFinding: (programId: string, findingId: string, optionIndex: number) => void;
  
  // Production & Lines
  createAssemblyLine: (programId: string, facilityId: string, targetRate: number) => void;
  setAssemblyLineRate: (lineId: string, targetRate: number) => void;
  
  // Commercial Sales & Contracts
  submitRfpProposal: (rfpId: string, proposal: ContractProposal) => void;
  
  // Company & Staffing
  updateDepartmentHeadcount: (deptId: string, delta: number) => void;
  toggleDepartmentOvertime: (deptId: string) => void;
  buildFacility: (facility: Facility) => void;
  
  // Save & Load
  saveGame: (saveId: string, saveName: string) => Promise<void>;
  loadGame: (saveId: string) => Promise<boolean>;
  exportSaveJson: () => Promise<string | null>;
  importSaveJson: (json: string) => Promise<boolean>;
  
  // Developer Cheats
  devAdvanceDays: (days: number) => void;
  devAddCash: (amountMUSD: number) => void;
  devSetPhase: (programId: string, phase: ProgramPhase) => void;
  devAddFlightHours: (programId: string, hours: number) => void;
  devPassCertification: (programId: string) => void;
  devForceRfp: () => void;
  devForceIncident: () => void;
}

const DEFAULT_DEPARTMENTS: Department[] = [
  { id: 'dept_aero', name: 'Aerodynamics & CFD', category: 'engineering', headcount: 45, targetHeadcount: 50, averageExperience: 7.2, morale: 88, baseSalary: 8500, overtimeAllowed: false, productivity: 1.05, accumulatedKnowledge: 65 },
  { id: 'dept_struct', name: 'Structures & Stress Analysis', category: 'engineering', headcount: 60, targetHeadcount: 65, averageExperience: 6.9, morale: 85, baseSalary: 8200, overtimeAllowed: false, productivity: 1.0, accumulatedKnowledge: 70 },
  { id: 'dept_prop', name: 'Propulsion & Integration', category: 'engineering', headcount: 35, targetHeadcount: 40, averageExperience: 8.0, morale: 90, baseSalary: 9200, overtimeAllowed: false, productivity: 1.1, accumulatedKnowledge: 75 },
  { id: 'dept_avionics', name: 'Avionics & Cockpit Human Factors', category: 'engineering', headcount: 40, targetHeadcount: 45, averageExperience: 7.5, morale: 87, baseSalary: 8800, overtimeAllowed: false, productivity: 1.02, accumulatedKnowledge: 60 },
  { id: 'dept_software', name: 'Flight Control Laws & Software', category: 'engineering', headcount: 50, targetHeadcount: 60, averageExperience: 6.5, morale: 82, baseSalary: 9500, overtimeAllowed: false, productivity: 0.98, accumulatedKnowledge: 55 },
  { id: 'dept_flight_test', name: 'Flight Test Operations & Pilots', category: 'engineering', headcount: 25, targetHeadcount: 30, averageExperience: 8.9, morale: 94, baseSalary: 12000, overtimeAllowed: false, productivity: 1.15, accumulatedKnowledge: 80 },
  { id: 'dept_cert', name: 'Airworthiness & Certification Office', category: 'engineering', headcount: 20, targetHeadcount: 25, averageExperience: 8.5, morale: 86, baseSalary: 9800, overtimeAllowed: false, productivity: 1.05, accumulatedKnowledge: 72 },
  { id: 'dept_manufacturing', name: 'Tooling & Assembly Operations', category: 'production', headcount: 140, targetHeadcount: 150, averageExperience: 6.2, morale: 84, baseSalary: 5200, overtimeAllowed: false, productivity: 1.0, accumulatedKnowledge: 60 },
  { id: 'dept_quality', name: 'Quality Assurance & Conformity', category: 'production', headcount: 30, targetHeadcount: 35, averageExperience: 7.8, morale: 89, baseSalary: 6800, overtimeAllowed: false, productivity: 1.08, accumulatedKnowledge: 78 },
  { id: 'dept_sales', name: 'Commercial Sales & Fleet Bidding', category: 'corporate', headcount: 22, targetHeadcount: 25, averageExperience: 8.1, morale: 91, baseSalary: 11000, overtimeAllowed: false, productivity: 1.12, accumulatedKnowledge: 85 },
  { id: 'dept_support', name: 'Customer Fleet Care & AOG Support', category: 'operations', headcount: 35, targetHeadcount: 40, averageExperience: 7.0, morale: 86, baseSalary: 6400, overtimeAllowed: false, productivity: 1.0, accumulatedKnowledge: 65 }
];

let rngInstance = new SeededRNG(20160101);
let autosaveTimer: any = null;

function triggerDebouncedAutosave(get: () => GameStoreState) {
  if (autosaveTimer) clearTimeout(autosaveTimer);
  autosaveTimer = setTimeout(() => {
    try {
      const state = get();
      if (!state.isInitialized) return;
      const fullState: FullGameState = {
        schemaVersion: CURRENT_SCHEMA_VERSION,
        seed: state.seed,
        currentDate: state.currentDate,
        gameSpeed: state.gameSpeed,
        macroEconomy: state.macroEconomy,
        company: state.company,
        competitors: state.competitors,
        airlines: state.airlines,
        playtimeMinutes: state.playtimeMinutes,
        savedAtTimestamp: Date.now()
      };
      storageManager.saveGame('active_game_slot', `${state.company.name} [Active]`, fullState, true);
    } catch {
      // Ignore autosave error
    }
  }, 1000);
}

export const useGameStore = create<GameStoreState>((set, get) => ({
  isInitialized: false,
  gameSpeed: 0,
  seed: 20160101,
  currentDate: { day: 1, month: 1, year: 2016, quarter: 1, totalDays: 1 },
  macroEconomy: {
    gdpIndex: 100.0,
    fuelPricePerGallon: 2.45,
    fuelTrend: 'stable',
    passengerTravelDemandIndex: 100.0,
    cargoDemandIndex: 100.0,
    businessConfidence: 75,
    interestRate: 0.035
  },
  company: {
    name: 'Aureon Aerospace',
    ticker: 'AUR',
    logo: 'wing',
    country: 'United States',
    headquartersCity: 'Seattle',
    foundedDate: { day: 1, month: 1, year: 2016, quarter: 1, totalDays: 1 },
    philosophy: 'engineering_excellence',
    initialFundingType: 'private_equity',
    reputationScore: 40,
    trustLevel: 'emerging',
    financials: {
      cash: 650.0,
      totalDebt: 0,
      monthlyRevenue: 0,
      monthlyExpenses: 5.5,
      monthlyBurnRate: 5.5,
      valuation: 1100.0,
      sharesOutstanding: 100_000_000,
      isPubliclyTraded: false,
      insolvencyStatus: 'solvent',
      emergencyFundingUsed: false,
      quarterlyHistory: []
    },
    investors: [
      { id: 'inv_1', name: 'Vanguard Aerospace Syndicate', type: 'private_equity', equityPercentage: 35, expectations: 'balanced', patience: 80, confidence: 85, boardSeats: 2 }
    ],
    departments: DEFAULT_DEPARTMENTS,
    facilities: [
      { id: 'fac_hq', name: 'Seattle Commercial Headquarters', type: 'headquarters', locationCity: 'Seattle', country: 'United States', lat: 47.4502, lon: -122.3088, level: 1, capacity: 500, monthlyOperatingCost: 1.2, efficiencyBonus: 0.05 },
      { id: 'fac_rd', name: 'Advanced Engineering Center', type: 'engineering_center', locationCity: 'Seattle', country: 'United States', lat: 47.4502, lon: -122.3088, level: 1, capacity: 350, monthlyOperatingCost: 2.1, efficiencyBonus: 0.10 }
    ],
    technologiesUnlocked: ['digital_fbw', 'modern_lcd_efis', 'advanced_al_li'],
    programs: [],
    enginePrograms: [],
    assemblyLines: [],
    firmContracts: [],
    activeInServiceFleet: [],
    incidentHistory: [],
    newsHistory: [
      {
        id: 'news_founding',
        publishedDate: { day: 1, month: 1, year: 2016, quarter: 1, totalDays: 1 },
        category: 'commercial',
        headline: `Aureon Aerospace Founded to Pioneer Modern Commercial Aircraft`,
        source: 'Aviation Week Global Daily',
        summary: `Aureon Aerospace has officially incorporated with $650M in initial capital, setting sights on designing next-generation fuel-efficient passenger airliners.`
      }
    ],
    milestonesUnlocked: [
      {
        id: 'ms_founding',
        achievedDate: { day: 1, month: 1, year: 2016, quarter: 1, totalDays: 1 },
        title: 'Company Founded',
        description: 'Incorporated the aerospace manufacturer with initial seed capital.',
        iconName: 'Building2',
        rewardReputation: 10
      }
    ],
    rfpProposals: [],
    suppliers: INITIAL_SUPPLIERS,
    activeTestFlightMap: []
  },
  competitors: INITIAL_COMPETITORS,
  airlines: INITIAL_AIRLINES,
  playtimeMinutes: 0,
  activeView: 'dashboard',
  saveStatus: 'idle',
  lastSavedTime: undefined,
  aircraftDraft: DEFAULT_AIRCRAFT_DRAFT,

  autoHydrate: async () => {
    try {
      const savedDraft = storageManager.loadAircraftDraft() as AircraftDraft | null;
      if (savedDraft) {
        set({ aircraftDraft: savedDraft });
      }

      const activeSaveId = storageManager.getActiveSaveId() || 'active_game_slot';
      const loaded = await storageManager.loadGame(activeSaveId);
      if (loaded) {
        rngInstance = new SeededRNG(loaded.seed);
        const lastView = (localStorage.getItem('airframe_active_view') as GameStoreState['activeView']) || 'dashboard';
        const lastProgId = localStorage.getItem('airframe_selected_program') || undefined;
        set({
          isInitialized: true,
          gameSpeed: 0,
          seed: loaded.seed,
          currentDate: loaded.currentDate,
          macroEconomy: loaded.macroEconomy,
          company: loaded.company,
          competitors: loaded.competitors,
          airlines: loaded.airlines,
          playtimeMinutes: loaded.playtimeMinutes,
          activeView: lastView,
          selectedProgramId: lastProgId || (loaded.company.programs[0]?.id),
          saveStatus: 'saved',
          lastSavedTime: 'Restored from local session'
        });
        return true;
      }
    } catch (err) {
      console.warn('Auto-hydration failed:', err);
    }
    return false;
  },

  updateAircraftDraft: (updates) => {
    const { aircraftDraft } = get();
    const updated = {
      ...aircraftDraft,
      ...updates,
      geometry: { ...aircraftDraft.geometry, ...(updates.geometry || {}) },
      propulsion: { ...aircraftDraft.propulsion, ...(updates.propulsion || {}) },
      systems: { ...aircraftDraft.systems, ...(updates.systems || {}) },
      livery: { ...aircraftDraft.livery, ...(updates.livery || {}) }
    };
    storageManager.saveAircraftDraft(updated);
    set({ aircraftDraft: updated });
  },

  setAircraftDraftStep: (step) => {
    const { aircraftDraft } = get();
    const updated = { ...aircraftDraft, currentStep: step };
    storageManager.saveAircraftDraft(updated);
    set({ aircraftDraft: updated });
  },

  resetAircraftDraft: () => {
    storageManager.clearAircraftDraft();
    set({ aircraftDraft: DEFAULT_AIRCRAFT_DRAFT });
  },

  initNewGame: (options: NewGameOptions) => {
    rngInstance = new SeededRNG(options.seed);

    let initialCash = 650.0;
    if (options.fundingType === 'bootstrapped') initialCash = 180.0;
    else if (options.fundingType === 'private_equity') initialCash = 650.0;
    else if (options.fundingType === 'venture_capital') initialCash = 950.0;
    else if (options.fundingType === 'industrial_group') initialCash = 1200.0;
    else if (options.fundingType === 'state_backed') initialCash = 1600.0;

    const startDate: GameDate = { day: 1, month: 1, year: options.startYear, quarter: 1, totalDays: 1 };

    const initialCompany: CompanyState = {
      name: options.companyName,
      ticker: options.ticker,
      logo: 'wing',
      country: options.country,
      headquartersCity: options.hqCity,
      foundedDate: startDate,
      philosophy: options.philosophy,
      initialFundingType: options.fundingType,
      reputationScore: 35,
      trustLevel: 'emerging',
      financials: {
        cash: initialCash,
        totalDebt: 0,
        monthlyRevenue: 0,
        monthlyExpenses: 5.5,
        monthlyBurnRate: 5.5,
        valuation: initialCash * 1.6,
        sharesOutstanding: 100_000_000,
        isPubliclyTraded: false,
        insolvencyStatus: 'solvent',
        emergencyFundingUsed: false,
        quarterlyHistory: []
      },
      investors: [
        {
          id: 'inv_lead',
          name: options.fundingType === 'state_backed' ? 'National Sovereign Aviation Fund' : `${options.companyName} Primary Syndicate`,
          type: options.fundingType,
          equityPercentage: options.fundingType === 'bootstrapped' ? 0 : 30,
          expectations: 'balanced',
          patience: 85,
          confidence: 90,
          boardSeats: options.fundingType === 'bootstrapped' ? 0 : 2
        }
      ],
      departments: DEFAULT_DEPARTMENTS,
      facilities: [
        { id: `fac_hq_${options.hqCity}`, name: `${options.hqCity} Corporate Headquarters`, type: 'headquarters', locationCity: options.hqCity, country: options.country, lat: 40.0, lon: -75.0, level: 1, capacity: 500, monthlyOperatingCost: 1.2, efficiencyBonus: 0.05 },
        { id: `fac_rd_${options.hqCity}`, name: `${options.hqCity} Aviation R&D Complex`, type: 'engineering_center', locationCity: options.hqCity, country: options.country, lat: 40.0, lon: -75.0, level: 1, capacity: 350, monthlyOperatingCost: 2.1, efficiencyBonus: 0.10 }
      ],
      technologiesUnlocked: ['digital_fbw', 'modern_lcd_efis', 'advanced_al_li'],
      programs: [],
      enginePrograms: [],
      assemblyLines: [],
      firmContracts: [],
      activeInServiceFleet: [],
      incidentHistory: [],
      newsHistory: [
        {
          id: `news_founded_${startDate.year}`,
          publishedDate: startDate,
          category: 'commercial',
          headline: `${options.companyName} Founded to Pioneer Next-Generation Aircraft`,
          source: 'Aviation Week Global Daily',
          summary: `${options.companyName} has officially been established in ${options.hqCity}, ${options.country} with $${initialCash}M in starting capital.`
        }
      ],
      milestonesUnlocked: [
        {
          id: 'ms_founding',
          achievedDate: startDate,
          title: 'Company Founded',
          description: `Established ${options.companyName} with ${options.fundingType.replace(/_/g, ' ')} financing.`,
          iconName: 'Building2',
          rewardReputation: 10
        }
      ],
      rfpProposals: [],
      suppliers: INITIAL_SUPPLIERS,
      activeTestFlightMap: []
    };

    const initialEconomy = {
      gdpIndex: 100.0,
      fuelPricePerGallon: 2.45,
      fuelTrend: 'stable' as const,
      passengerTravelDemandIndex: 100.0,
      cargoDemandIndex: 100.0,
      businessConfidence: 75,
      interestRate: 0.035
    };

    set({
      isInitialized: true,
      gameSpeed: 1,
      seed: options.seed,
      currentDate: startDate,
      macroEconomy: initialEconomy,
      company: initialCompany,
      competitors: INITIAL_COMPETITORS,
      airlines: INITIAL_AIRLINES,
      activeView: 'dashboard',
      saveStatus: 'saved',
      lastSavedTime: 'Just now'
    });

    triggerDebouncedAutosave(get);
    localStorage.setItem('airframe_active_view', 'dashboard');
  },

  setGameSpeed: (speed: GameSpeed) => set({ gameSpeed: speed }),
  setActiveView: (view) => {
    localStorage.setItem('airframe_active_view', view);
    set({ activeView: view });
  },
  setSelectedProgramId: (id) => {
    if (id) localStorage.setItem('airframe_selected_program', id);
    else localStorage.removeItem('airframe_selected_program');
    set({ selectedProgramId: id });
  },
  setSelectedRfpId: (id) => set({ selectedRfpId: id }),

  tickGame: () => {
    const { company, macroEconomy, currentDate, competitors, airlines } = get();
    const result = executeDailySimulationTick(company, macroEconomy, currentDate, competitors, airlines, rngInstance);
    set({
      company: result.updatedCompany,
      macroEconomy: result.updatedEconomy,
      currentDate: result.updatedDate,
      competitors: result.updatedCompetitors,
      airlines: result.updatedAirlines
    });
  },

  createAircraftProgram: (programData) => {
    const { company, currentDate } = get();
    const segment = programData.marketSegment || 'small_narrowbody';
    
    const geom = programData.geometry!;
    const prop = programData.propulsion!;
    const sys = programData.systems!;
    const synth = synthesizeAircraftSpecs(geom, prop, sys, segment);

    // Realistic milestone projections
    const projectedFirstFlight: GameDate = {
      day: currentDate.day,
      month: ((currentDate.month + 10 - 1) % 12) + 1,
      year: currentDate.year + 3,
      quarter: (Math.floor(((currentDate.month + 10 - 1) % 12) / 3) + 1) as 1 | 2 | 3 | 4,
      totalDays: currentDate.totalDays + 1100
    };

    const projectedCert: GameDate = {
      day: currentDate.day,
      month: ((currentDate.month + 4 - 1) % 12) + 1,
      year: currentDate.year + 5,
      quarter: (Math.floor(((currentDate.month + 4 - 1) % 12) / 3) + 1) as 1 | 2 | 3 | 4,
      totalDays: currentDate.totalDays + 1650
    };

    const projectedEis: GameDate = {
      day: currentDate.day,
      month: ((currentDate.month + 8 - 1) % 12) + 1,
      year: currentDate.year + 5,
      quarter: (Math.floor(((currentDate.month + 8 - 1) % 12) / 3) + 1) as 1 | 2 | 3 | 4,
      totalDays: currentDate.totalDays + 1800
    };

    const newProg: AircraftProgram = {
      id: programData.id || `prog_${Date.now()}`,
      name: programData.name || 'A120',
      familyId: programData.familyId || `fam_${Date.now()}`,
      isCleanSheet: true,
      marketSegment: segment,
      targetAirlinesCategory: ['legacy', 'low_cost', 'regional'],
      createdAt: { ...currentDate },
      eisTargetDate: projectedEis,
      currentPhase: 'concept',
      phaseProgressPercent: 0,
      phaseElapsedDays: 0,
      phaseEstimatedDurationDays: 150,
      scheduleMilestones: {
        launchDate: { ...currentDate },
        projectedFirstFlight,
        projectedCertification: projectedCert,
        projectedEis,
        delayLog: []
      },
      geometry: geom,
      propulsion: prop,
      systems: sys,
      massBreakdown: synth.mass,
      performance: synth.perf,
      estimatedRange: {
        estimatedLow: Math.round(synth.perf.rangeKm * 0.92),
        estimatedHigh: Math.round(synth.perf.rangeKm * 1.08),
        currentKnowledge: synth.perf.rangeKm,
        isConfirmed: false
      },
      estimatedOew: {
        estimatedLow: Math.round(synth.mass.oewKg * 0.94),
        estimatedHigh: Math.round(synth.mass.oewKg * 1.08),
        currentKnowledge: synth.mass.oewKg,
        isConfirmed: false
      },
      estimatedFuelBurn: {
        estimatedLow: parseFloat((synth.perf.fuelBurnKgPerSeat1000Km * 0.92).toFixed(1)),
        estimatedHigh: parseFloat((synth.perf.fuelBurnKgPerSeat1000Km * 1.10).toFixed(1)),
        currentKnowledge: synth.perf.fuelBurnKgPerSeat1000Km,
        isConfirmed: false
      },
      estimatedUnitCost: {
        estimatedLow: parseFloat((synth.unitCost * 0.90).toFixed(1)),
        estimatedHigh: parseFloat((synth.unitCost * 1.15).toFixed(1)),
        currentKnowledge: synth.unitCost,
        isConfirmed: false
      },
      totalRdBudget: synth.rdCost,
      spentRdBudget: 0,
      allocatedHeadcount: 220,
      schedulePressure: 'balanced',
      accumulatedTechDebt: 0,
      prototypesBuilt: [],
      activeTestMissions: [],
      completedScenarioIds: [],
      groundTestsCompleted: 0,
      groundTestsTotal: 4,
      testCampaignsProgress: {
        groundTestsCompleted: 0,
        groundTestsTotal: 4,
        flightHoursLogged: 0,
        flightHoursRequired: 1800,
        flightEnvelopeExpansionPercent: 0,
        anomaliesFound: 0,
        anomaliesResolved: 0
      },
      certificationFindings: [],
      typeCertificateIssued: false,
      productionCertificateIssued: false,
      listPrice: synth.listPrice,
      estimatedUnitCostValue: synth.unitCost,
      ordersBacklogCount: 0,
      totalDeliveriesCount: 0,
      activeInServiceCount: 0,
      dispatchReliabilityMaturePercent: 99.4,
      currentServiceReliabilityPercent: 98.5,
      livery: {
        primaryColor: programData.livery?.primaryColor || '#0ea5e9',
        accentColor: programData.livery?.accentColor || '#f59e0b',
        tailLogoStyle: 'wing',
        stripeStyle: 'swept'
      }
    };

    storageManager.clearAircraftDraft();
    const updatedPrograms = [...company.programs, newProg];
    const updatedCompany = { ...company, programs: updatedPrograms };
    
    set({
      company: updatedCompany,
      selectedProgramId: newProg.id,
      aircraftDraft: DEFAULT_AIRCRAFT_DRAFT,
      activeView: 'dashboard',
      saveStatus: 'saved',
      lastSavedTime: 'Just now'
    });

    triggerDebouncedAutosave(get);
  },

  updateProgramDesign: (programId, updates) => {
    const { company } = get();
    const updatedPrograms = company.programs.map(p => {
      if (p.id !== programId) return p;
      const merged = { ...p, ...updates };
      const synth = synthesizeAircraftSpecs(merged.geometry, merged.propulsion, merged.systems, merged.marketSegment);
      merged.massBreakdown = synth.mass;
      merged.performance = synth.perf;
      merged.listPrice = synth.listPrice;
      merged.estimatedUnitCostValue = synth.unitCost;
      return merged;
    });

    set({ company: { ...company, programs: updatedPrograms } });
    triggerDebouncedAutosave(get);
  },

  constructPrototype: (programId, role) => {
    const { company } = get();
    const PROTOTYPE_COST_MUSD = 35.0;

    if (company.financials.cash < PROTOTYPE_COST_MUSD) {
      // Insufficient funds
      return;
    }

    const updatedPrograms = company.programs.map(p => {
      if (p.id !== programId) return p;
      const num = p.prototypesBuilt.length + 1;
      const pt = {
        id: `pt_${programId}_${num}`,
        programId,
        serialNumber: `PT-00${num}`,
        name: `${p.name} Flight Test Article ${num}`,
        primaryRole: role,
        status: 'under_construction' as const,
        flightHours: 0,
        cycles: 0,
        completionPercent: 0,
        assignedLocationAirportId: 'ORD'
      };
      return {
        ...p,
        prototypesBuilt: [...p.prototypesBuilt, pt]
      };
    });

    const updatedFinancials = {
      ...company.financials,
      cash: parseFloat((company.financials.cash - PROTOTYPE_COST_MUSD).toFixed(2))
    };

    set({
      company: {
        ...company,
        financials: updatedFinancials,
        programs: updatedPrograms
      }
    });

    triggerDebouncedAutosave(get);
  },

  scheduleFlightTest: (programId, scenarioId, prototypeId) => {
    const { company, currentDate } = get();
    const prog = company.programs.find(p => p.id === programId);
    const scenario = TEST_SCENARIOS.find(s => s.id === scenarioId);
    if (!prog || !scenario) return false;

    const pt = prog.prototypesBuilt.find(p => p.id === prototypeId);
    if (!pt || pt.status === 'under_construction' || pt.currentMissionId) return false;

    if (company.financials.cash < scenario.costMUSD) return false;

    const newMission: ActiveTestMission = {
      id: `mission_${Date.now()}_${rngInstance.nextInt(100, 999)}`,
      scenarioId: scenario.id,
      prototypeId: pt.id,
      startDate: { ...currentDate },
      durationDays: scenario.durationDays,
      daysElapsed: 0,
      flightHoursExpected: scenario.flightHoursLogged,
      envelopeGainExpected: scenario.envelopeGainPercent,
      costMUSD: scenario.costMUSD,
      status: 'running'
    };

    pt.currentMissionId = newMission.id;

    const updatedPrograms = company.programs.map(p => {
      if (p.id !== programId) return p;
      return {
        ...p,
        activeTestMissions: [...p.activeTestMissions, newMission]
      };
    });

    const updatedFinancials = {
      ...company.financials,
      cash: parseFloat((company.financials.cash - scenario.costMUSD).toFixed(2))
    };

    set({
      company: {
        ...company,
        financials: updatedFinancials,
        programs: updatedPrograms
      }
    });

    triggerDebouncedAutosave(get);
    return true;
  },

  resolveCertificationFinding: (programId, findingId, optionIndex) => {
    const { company } = get();
    const prog = company.programs.find(p => p.id === programId);
    if (!prog) return;

    const finding = prog.certificationFindings.find(f => f.id === findingId);
    if (!finding) return;

    const scenario = TEST_SCENARIOS.flatMap(s => s.potentialAnomalies).find(a => a.id === findingId);
    const option = scenario?.options[optionIndex];
    const cost = option?.costMUSD || finding.costToFix;
    const delay = option?.delayDays || finding.daysToFix;

    const updatedPrograms = company.programs.map(p => {
      if (p.id !== programId) return p;
      const updatedFindings = p.certificationFindings.map(f => {
        if (f.id === findingId) {
          return { ...f, status: 'verified_resolved' as const };
        }
        return f;
      });

      const updatedDelayLog = [...(p.scheduleMilestones.delayLog || [])];
      if (delay > 0) {
        updatedDelayLog.push({
          id: `delay_${Date.now()}`,
          date: { ...get().currentDate },
          reasonKey: finding.titleKey,
          daysAdded: delay
        });
      }

      return {
        ...p,
        certificationFindings: updatedFindings,
        scheduleMilestones: {
          ...p.scheduleMilestones,
          delayLog: updatedDelayLog
        },
        testCampaignsProgress: {
          ...p.testCampaignsProgress,
          anomaliesResolved: p.testCampaignsProgress.anomaliesResolved + 1
        }
      };
    });

    const updatedFinancials = {
      ...company.financials,
      cash: parseFloat((company.financials.cash - cost).toFixed(2))
    };

    set({
      company: {
        ...company,
        financials: updatedFinancials,
        programs: updatedPrograms
      }
    });

    triggerDebouncedAutosave(get);
  },

  createAssemblyLine: (programId, facilityId, targetRate) => {
    const { company } = get();
    const TOOLING_COST_MUSD = 85.0;

    if (company.financials.cash < TOOLING_COST_MUSD) return;

    const prog = company.programs.find(p => p.id === programId);
    const newLine: AssemblyLine = {
      id: `line_${Date.now()}`,
      name: `${prog?.name || 'Airframe'} Final Assembly Line 1`,
      facilityId,
      programId,
      status: 'tooling_in_progress',
      toolingDaysRemaining: 180,
      toolingTotalCostMUSD: TOOLING_COST_MUSD,
      maxMonthlyRate: 14,
      currentMonthlyRateTarget: targetRate,
      actualMonthlyRate: 0,
      automationLevel: 3,
      qualityControlMaturity: 85,
      workerSkillScore: 82,
      activeUnitsOnLine: []
    };

    const updatedFinancials = {
      ...company.financials,
      cash: parseFloat((company.financials.cash - TOOLING_COST_MUSD).toFixed(2))
    };

    set({
      company: {
        ...company,
        financials: updatedFinancials,
        assemblyLines: [...company.assemblyLines, newLine]
      },
      activeView: 'production'
    });

    triggerDebouncedAutosave(get);
  },

  setAssemblyLineRate: (lineId, targetRate) => {
    const { company } = get();
    const updated = company.assemblyLines.map(l => l.id === lineId ? { ...l, currentMonthlyRateTarget: targetRate } : l);
    set({ company: { ...company, assemblyLines: updated } });
    triggerDebouncedAutosave(get);
  },

  submitRfpProposal: (rfpId, proposal) => {
    const { company } = get();
    const updatedRfps = company.rfpProposals.map(r => {
      if (r.id === rfpId) {
        return {
          ...r,
          status: 'under_review' as const,
          reviewDaysRemaining: rngInstance.nextInt(14, 28),
          playerBid: proposal
        };
      }
      return r;
    });
    set({ company: { ...company, rfpProposals: updatedRfps } });
    triggerDebouncedAutosave(get);
  },

  updateDepartmentHeadcount: (deptId, delta) => {
    const { company } = get();
    const updatedDepts = company.departments.map(d => {
      if (d.id === deptId) {
        const newCount = Math.max(5, d.headcount + delta);
        return { ...d, headcount: newCount, targetHeadcount: newCount };
      }
      return d;
    });
    set({ company: { ...company, departments: updatedDepts } });
    triggerDebouncedAutosave(get);
  },

  toggleDepartmentOvertime: (deptId) => {
    const { company } = get();
    const updatedDepts = company.departments.map(d => {
      if (d.id === deptId) {
        return { ...d, overtimeAllowed: !d.overtimeAllowed };
      }
      return d;
    });
    set({ company: { ...company, departments: updatedDepts } });
    triggerDebouncedAutosave(get);
  },

  buildFacility: (facility) => {
    const { company } = get();
    set({ company: { ...company, facilities: [...company.facilities, facility] } });
    triggerDebouncedAutosave(get);
  },

  saveGame: async (saveId, saveName) => {
    set({ saveStatus: 'saving' });
    const state = get();
    const fullState: FullGameState = {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      seed: state.seed,
      currentDate: state.currentDate,
      gameSpeed: state.gameSpeed,
      macroEconomy: state.macroEconomy,
      company: state.company,
      competitors: state.competitors,
      airlines: state.airlines,
      playtimeMinutes: state.playtimeMinutes,
      savedAtTimestamp: Date.now()
    };
    await storageManager.saveGame(saveId, saveName, fullState, false);
    storageManager.setActiveSaveId(saveId);
    set({ saveStatus: 'saved', lastSavedTime: 'Just now' });
  },

  loadGame: async (saveId) => {
    const loaded = await storageManager.loadGame(saveId);
    if (!loaded) return false;
    rngInstance = new SeededRNG(loaded.seed);
    storageManager.setActiveSaveId(saveId);
    set({
      isInitialized: true,
      gameSpeed: loaded.gameSpeed as GameSpeed,
      seed: loaded.seed,
      currentDate: loaded.currentDate,
      macroEconomy: loaded.macroEconomy,
      company: loaded.company,
      competitors: loaded.competitors,
      airlines: loaded.airlines,
      playtimeMinutes: loaded.playtimeMinutes,
      activeView: 'dashboard',
      saveStatus: 'saved',
      lastSavedTime: 'Restored'
    });
    return true;
  },

  exportSaveJson: async () => {
    const state = get();
    const fullState: FullGameState = {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      seed: state.seed,
      currentDate: state.currentDate,
      gameSpeed: state.gameSpeed,
      macroEconomy: state.macroEconomy,
      company: state.company,
      competitors: state.competitors,
      airlines: state.airlines,
      playtimeMinutes: state.playtimeMinutes,
      savedAtTimestamp: Date.now()
    };
    return JSON.stringify({ schemaVersion: CURRENT_SCHEMA_VERSION, state: fullState }, null, 2);
  },

  importSaveJson: async (json) => {
    try {
      const parsed = JSON.parse(json);
      const state: FullGameState = parsed.state || parsed;
      rngInstance = new SeededRNG(state.seed);
      set({
        isInitialized: true,
        gameSpeed: state.gameSpeed as GameSpeed,
        seed: state.seed,
        currentDate: state.currentDate,
        macroEconomy: state.macroEconomy,
        company: state.company,
        competitors: state.competitors,
        airlines: state.airlines,
        playtimeMinutes: state.playtimeMinutes,
        activeView: 'dashboard'
      });
      return true;
    } catch {
      return false;
    }
  },

  devAdvanceDays: (days) => {
    for (let i = 0; i < days; i++) {
      get().tickGame();
    }
  },

  devAddCash: (amountMUSD) => {
    const { company } = get();
    set({
      company: {
        ...company,
        financials: { ...company.financials, cash: company.financials.cash + amountMUSD, insolvencyStatus: 'solvent' }
      }
    });
  },

  devSetPhase: (programId, phase) => {
    const { company } = get();
    const updated = company.programs.map(p => p.id === programId ? { ...p, currentPhase: phase, phaseProgressPercent: 0 } : p);
    set({ company: { ...company, programs: updated } });
  },

  devAddFlightHours: (programId, hours) => {
    const { company } = get();
    const updated = company.programs.map(p => {
      if (p.id !== programId) return p;
      return {
        ...p,
        testCampaignsProgress: {
          ...p.testCampaignsProgress,
          flightHoursLogged: p.testCampaignsProgress.flightHoursLogged + hours,
          flightEnvelopeExpansionPercent: Math.min(100, p.testCampaignsProgress.flightEnvelopeExpansionPercent + (hours / 18))
        }
      };
    });
    set({ company: { ...company, programs: updated } });
  },

  devPassCertification: (programId) => {
    const { company, currentDate } = get();
    const updated = company.programs.map(p => {
      if (p.id !== programId) return p;
      return {
        ...p,
        currentPhase: 'production_ready' as const,
        typeCertificateIssued: true,
        productionCertificateIssued: true,
        scheduleMilestones: {
          ...p.scheduleMilestones,
          actualCertification: { ...currentDate }
        },
        testCampaignsProgress: {
          ...p.testCampaignsProgress,
          flightHoursLogged: 1800,
          flightEnvelopeExpansionPercent: 100
        }
      };
    });
    set({ company: { ...company, programs: updated } });
  },

  devForceRfp: () => {
    const { airlines, currentDate, company } = get();
    const newRfp = generatePotentialAirlineRFP(airlines, currentDate, company.rfpProposals, company.trustLevel, 120, rngInstance);
    if (newRfp) {
      set({ company: { ...company, rfpProposals: [...company.rfpProposals, newRfp] } });
    }
  },

  devForceIncident: () => {
    const { company, currentDate } = get();
    if (company.activeInServiceFleet.length > 0 && company.programs.length > 0) {
      const plane = company.activeInServiceFleet[0];
      const prog = company.programs[0];
      const inc = checkForInServiceIncident(plane, prog, currentDate, rngInstance);
      if (inc) {
        set({ company: { ...company, incidentHistory: [...company.incidentHistory, inc] } });
      }
    }
  }
}));
