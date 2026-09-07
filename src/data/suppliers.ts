import type { SupplierPartner, PropulsionConfig } from '../types';

export const INITIAL_SUPPLIERS: SupplierPartner[] = [
  // Propulsion & Engines
  {
    id: 'cfm_aeropower',
    name: 'AeroPower International (Joint Turbofans)',
    country: 'United States / France',
    category: 'engines',
    qualityRating: 97,
    reliabilityScore: 98,
    financialHealth: 'strong',
    leadTimeWeeks: 48,
    costTier: 'standard',
    isDualSourced: false
  },
  {
    id: 'pratt_turbogear',
    name: 'Geared Turbofan Alliance',
    country: 'United States',
    category: 'engines',
    qualityRating: 92,
    reliabilityScore: 89,
    financialHealth: 'strong',
    leadTimeWeeks: 54,
    costTier: 'premium',
    isDualSourced: false
  },
  {
    id: 'rolls_aero',
    name: 'Royal Trent Propulsion',
    country: 'United Kingdom',
    category: 'engines',
    qualityRating: 95,
    reliabilityScore: 94,
    financialHealth: 'strong',
    leadTimeWeeks: 60,
    costTier: 'premium',
    isDualSourced: false
  },

  // Avionics & Flight Controls
  {
    id: 'collins_aerospace_sys',
    name: 'Horizon Integrated Avionics',
    country: 'United States',
    category: 'avionics',
    qualityRating: 96,
    reliabilityScore: 97,
    financialHealth: 'strong',
    leadTimeWeeks: 32,
    costTier: 'standard',
    isDualSourced: true
  },
  {
    id: 'thales_flight_digital',
    name: 'Thalesia Digital Cockpits',
    country: 'France',
    category: 'avionics',
    qualityRating: 94,
    reliabilityScore: 95,
    financialHealth: 'strong',
    leadTimeWeeks: 34,
    costTier: 'standard',
    isDualSourced: true
  },

  // Landing Gear & Brakes
  {
    id: 'safran_landing_sys',
    name: 'Apex Landing Gears & Brakes',
    country: 'France',
    category: 'landing_gear',
    qualityRating: 95,
    reliabilityScore: 96,
    financialHealth: 'strong',
    leadTimeWeeks: 40,
    costTier: 'standard',
    isDualSourced: false
  },
  {
    id: 'liebherr_aerodynamics',
    name: 'Bavaria Landing Systems',
    country: 'Germany',
    category: 'landing_gear',
    qualityRating: 93,
    reliabilityScore: 94,
    financialHealth: 'strong',
    leadTimeWeeks: 38,
    costTier: 'standard',
    isDualSourced: true
  },

  // Advanced Carbon Composites
  {
    id: 'toray_carbon_structures',
    name: 'Toray Polymer Carbon Tech',
    country: 'Japan',
    category: 'composites',
    qualityRating: 98,
    reliabilityScore: 99,
    financialHealth: 'strong',
    leadTimeWeeks: 28,
    costTier: 'premium',
    isDualSourced: true
  },
  {
    id: 'hexcel_matrix_sys',
    name: 'Hexcel Composites Global',
    country: 'United States',
    category: 'composites',
    qualityRating: 94,
    reliabilityScore: 95,
    financialHealth: 'strong',
    leadTimeWeeks: 26,
    costTier: 'standard',
    isDualSourced: true
  },

  // Cabin Interiors & Galleys
  {
    id: 'zodiac_interiors',
    name: 'Starlight Modular Interiors',
    country: 'Germany',
    category: 'seats_interiors',
    qualityRating: 88,
    reliabilityScore: 89,
    financialHealth: 'stable',
    leadTimeWeeks: 24,
    costTier: 'budget',
    isDualSourced: true
  },
  {
    id: 'recaro_premium_seats',
    name: 'AeroComfort Ergonomics',
    country: 'Germany',
    category: 'seats_interiors',
    qualityRating: 97,
    reliabilityScore: 98,
    financialHealth: 'strong',
    leadTimeWeeks: 28,
    costTier: 'premium',
    isDualSourced: true
  },

  // APU & Auxiliary Systems
  {
    id: 'honeywell_turbines',
    name: 'Garrett APU & Environmental',
    country: 'United States',
    category: 'apu',
    qualityRating: 96,
    reliabilityScore: 97,
    financialHealth: 'strong',
    leadTimeWeeks: 30,
    costTier: 'standard',
    isDualSourced: false
  }
];

export const THIRD_PARTY_ENGINE_CATALOG: PropulsionConfig[] = [
  {
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
  {
    sourceType: 'third_party',
    engineModelId: 'LEAP_1A_32',
    engineName: 'AeroPower AP-1X Heavy (32k lbf)',
    numberOfEngines: 2,
    engineLocation: 'under_wing',
    thrustPerEngineKN: 143.0,
    fanDiameterMeters: 2.05,
    bypassRatio: 10.8,
    cruiseSFC: 0.522,
    dryWeightKg: 3150,
    pricePerEngine: 15.8
  },
  {
    sourceType: 'third_party',
    engineModelId: 'PW_GTF_1100',
    engineName: 'Turbogear GTF-110 (24k lbf)',
    numberOfEngines: 2,
    engineLocation: 'under_wing',
    thrustPerEngineKN: 107.0,
    fanDiameterMeters: 2.06,
    bypassRatio: 12.5,
    cruiseSFC: 0.498,
    dryWeightKg: 2860,
    pricePerEngine: 13.9
  },
  {
    sourceType: 'third_party',
    engineModelId: 'PW_GTF_1900',
    engineName: 'Turbogear Regional GTF (19k lbf)',
    numberOfEngines: 2,
    engineLocation: 'under_wing',
    thrustPerEngineKN: 85.0,
    fanDiameterMeters: 1.85,
    bypassRatio: 12.0,
    cruiseSFC: 0.505,
    dryWeightKg: 2320,
    pricePerEngine: 11.4
  },
  {
    sourceType: 'third_party',
    engineModelId: 'CF34_10E',
    engineName: 'General Jet GE-34 Regional (20k lbf)',
    numberOfEngines: 2,
    engineLocation: 'under_wing',
    thrustPerEngineKN: 89.0,
    fanDiameterMeters: 1.45,
    bypassRatio: 5.4,
    cruiseSFC: 0.620,
    dryWeightKg: 1720,
    pricePerEngine: 8.5
  },
  {
    sourceType: 'third_party',
    engineModelId: 'TRENT_1000',
    engineName: 'Royal Trent 1000 Widebody (74k lbf)',
    numberOfEngines: 2,
    engineLocation: 'under_wing',
    thrustPerEngineKN: 330.0,
    fanDiameterMeters: 2.85,
    bypassRatio: 10.0,
    cruiseSFC: 0.510,
    dryWeightKg: 5940,
    pricePerEngine: 28.5
  },
  {
    sourceType: 'third_party',
    engineModelId: 'GE9X_SUPER',
    engineName: 'AeroPower Giant 9X (105k lbf)',
    numberOfEngines: 2,
    engineLocation: 'under_wing',
    thrustPerEngineKN: 470.0,
    fanDiameterMeters: 3.40,
    bypassRatio: 10.0,
    cruiseSFC: 0.505,
    dryWeightKg: 8600,
    pricePerEngine: 42.0
  }
];
