import type { AirlineCustomer } from '../types';

export const INITIAL_AIRLINES: AirlineCustomer[] = [
  // North America
  {
    id: 'orion_air',
    name: 'Orion Air',
    icao: 'ORN',
    country: 'United States',
    region: 'north_america',
    hubAirportIata: 'ORD',
    businessModel: 'legacy',
    reputation: 92,
    financialHealth: 'prosperous',
    riskTolerance: 'very_conservative',
    growthStrategy: 'steady_renewal',
    relationshipWithPlayer: 25,
    trustInPlayer: 'unknown',
    manufacturerPreference: { 'AeroGlobal': 55, 'SkyTitan': 45 },
    activeFleetCount: 380,
    fleetComposition: [
      { modelName: 'Titan 730', manufacturerName: 'SkyTitan', isPlayerAircraft: false, count: 180, averageAgeYears: 8.5 },
      { modelName: 'Aero 320', manufacturerName: 'AeroGlobal', isPlayerAircraft: false, count: 140, averageAgeYears: 6.2 },
      { modelName: 'Titan 770', manufacturerName: 'SkyTitan', isPlayerAircraft: false, count: 60, averageAgeYears: 11.0 }
    ],
    primaryColors: { primary: '#0f2b48', secondary: '#c5a059' }
  },
  {
    id: 'jet_nova',
    name: 'JetNova Airways',
    icao: 'JNV',
    country: 'United States',
    region: 'north_america',
    hubAirportIata: 'DEN',
    businessModel: 'ultra_low_cost',
    reputation: 74,
    financialHealth: 'stable',
    riskTolerance: 'innovative',
    growthStrategy: 'rapid_expansion',
    relationshipWithPlayer: 40,
    trustInPlayer: 'unknown',
    manufacturerPreference: { 'AeroGlobal': 70, 'Pacific Rim Aero': 30 },
    activeFleetCount: 115,
    fleetComposition: [
      { modelName: 'Aero 320-dense', manufacturerName: 'AeroGlobal', isPlayerAircraft: false, count: 115, averageAgeYears: 4.8 }
    ],
    primaryColors: { primary: '#008080', secondary: '#ff6600' }
  },
  {
    id: 'cascade_regional',
    name: 'Cascade Regional Express',
    icao: 'CAS',
    country: 'United States',
    region: 'north_america',
    hubAirportIata: 'SEA',
    businessModel: 'regional',
    reputation: 80,
    financialHealth: 'stable',
    riskTolerance: 'balanced',
    growthStrategy: 'steady_renewal',
    relationshipWithPlayer: 50,
    trustInPlayer: 'experimental',
    manufacturerPreference: { 'Albatross Commercial': 60, 'Nordic Jet': 40 },
    activeFleetCount: 85,
    fleetComposition: [
      { modelName: 'AlbaJet 175', manufacturerName: 'Albatross Commercial', isPlayerAircraft: false, count: 55, averageAgeYears: 7.1 },
      { modelName: 'Nordic Q40', manufacturerName: 'Nordic Jet', isPlayerAircraft: false, count: 30, averageAgeYears: 12.4 }
    ],
    primaryColors: { primary: '#1a4731', secondary: '#a3c293' }
  },
  {
    id: 'aurora_canadian',
    name: 'Aurora Canadian Lines',
    icao: 'AUR',
    country: 'Canada',
    region: 'north_america',
    hubAirportIata: 'YYZ',
    businessModel: 'legacy',
    reputation: 88,
    financialHealth: 'prosperous',
    riskTolerance: 'balanced',
    growthStrategy: 'steady_renewal',
    relationshipWithPlayer: 30,
    trustInPlayer: 'unknown',
    manufacturerPreference: { 'SkyTitan': 50, 'Albatross Commercial': 50 },
    activeFleetCount: 195,
    fleetComposition: [
      { modelName: 'Titan 730', manufacturerName: 'SkyTitan', isPlayerAircraft: false, count: 90, averageAgeYears: 9.2 },
      { modelName: 'Titan 780', manufacturerName: 'SkyTitan', isPlayerAircraft: false, count: 35, averageAgeYears: 4.5 },
      { modelName: 'AlbaJet 190', manufacturerName: 'Albatross Commercial', isPlayerAircraft: false, count: 70, averageAgeYears: 8.0 }
    ],
    primaryColors: { primary: '#9e1b32', secondary: '#ffffff' }
  },
  {
    id: 'volare_mexico',
    name: 'AeroVolare México',
    icao: 'VLR',
    country: 'Mexico',
    region: 'latin_america',
    hubAirportIata: 'MEX',
    businessModel: 'low_cost',
    reputation: 79,
    financialHealth: 'stable',
    riskTolerance: 'innovative',
    growthStrategy: 'rapid_expansion',
    relationshipWithPlayer: 45,
    trustInPlayer: 'experimental',
    manufacturerPreference: { 'AeroGlobal': 80 },
    activeFleetCount: 80,
    fleetComposition: [
      { modelName: 'Aero 320', manufacturerName: 'AeroGlobal', isPlayerAircraft: false, count: 80, averageAgeYears: 5.5 }
    ],
    primaryColors: { primary: '#4b0082', secondary: '#ff1493' }
  },

  // Latin America
  {
    id: 'condor_latam',
    name: 'Condor Sudamericana',
    icao: 'CND',
    country: 'Brazil',
    region: 'latin_america',
    hubAirportIata: 'GRU',
    businessModel: 'legacy',
    reputation: 85,
    financialHealth: 'stable',
    riskTolerance: 'balanced',
    growthStrategy: 'steady_renewal',
    relationshipWithPlayer: 35,
    trustInPlayer: 'unknown',
    manufacturerPreference: { 'SkyTitan': 40, 'AeroGlobal': 60 },
    activeFleetCount: 220,
    fleetComposition: [
      { modelName: 'Aero 320', manufacturerName: 'AeroGlobal', isPlayerAircraft: false, count: 140, averageAgeYears: 6.9 },
      { modelName: 'Titan 770', manufacturerName: 'SkyTitan', isPlayerAircraft: false, count: 45, averageAgeYears: 10.3 },
      { modelName: 'Aero 350', manufacturerName: 'AeroGlobal', isPlayerAircraft: false, count: 35, averageAgeYears: 3.8 }
    ],
    primaryColors: { primary: '#002b49', secondary: '#d9272e' }
  },
  {
    id: 'amazonia_express',
    name: 'Amazonia Linhas Aéreas',
    icao: 'AMZ',
    country: 'Brazil',
    region: 'latin_america',
    hubAirportIata: 'GIG',
    businessModel: 'low_cost',
    reputation: 82,
    financialHealth: 'prosperous',
    riskTolerance: 'balanced',
    growthStrategy: 'rapid_expansion',
    relationshipWithPlayer: 50,
    trustInPlayer: 'experimental',
    manufacturerPreference: { 'SkyTitan': 100 },
    activeFleetCount: 130,
    fleetComposition: [
      { modelName: 'Titan 730', manufacturerName: 'SkyTitan', isPlayerAircraft: false, count: 130, averageAgeYears: 7.2 }
    ],
    primaryColors: { primary: '#ff6600', secondary: '#ffffff' }
  },
  {
    id: 'andes_airways',
    name: 'Andes Royal Airways',
    icao: 'AND',
    country: 'Colombia',
    region: 'latin_america',
    hubAirportIata: 'BOG',
    businessModel: 'legacy',
    reputation: 86,
    financialHealth: 'stable',
    riskTolerance: 'balanced',
    growthStrategy: 'steady_renewal',
    relationshipWithPlayer: 30,
    trustInPlayer: 'unknown',
    manufacturerPreference: { 'AeroGlobal': 65, 'SkyTitan': 35 },
    activeFleetCount: 140,
    fleetComposition: [
      { modelName: 'Aero 320', manufacturerName: 'AeroGlobal', isPlayerAircraft: false, count: 105, averageAgeYears: 7.4 },
      { modelName: 'Titan 780', manufacturerName: 'SkyTitan', isPlayerAircraft: false, count: 35, averageAgeYears: 5.1 }
    ],
    primaryColors: { primary: '#cc0000', secondary: '#ffffff' }
  },
  {
    id: 'patagonia_feeder',
    name: 'Patagonia Wings Regional',
    icao: 'PAT',
    country: 'Argentina',
    region: 'latin_america',
    hubAirportIata: 'EZE',
    businessModel: 'regional',
    reputation: 73,
    financialHealth: 'struggling',
    riskTolerance: 'innovative',
    growthStrategy: 'cost_cutting',
    relationshipWithPlayer: 60,
    trustInPlayer: 'experimental',
    manufacturerPreference: { 'Albatross Commercial': 80 },
    activeFleetCount: 28,
    fleetComposition: [
      { modelName: 'AlbaJet 170', manufacturerName: 'Albatross Commercial', isPlayerAircraft: false, count: 28, averageAgeYears: 13.5 }
    ],
    primaryColors: { primary: '#75aadb', secondary: '#ffffff' }
  },

  // Europe
  {
    id: 'europa_flag',
    name: 'Europa Continental Airlines',
    icao: 'ECL',
    country: 'Germany',
    region: 'europe',
    hubAirportIata: 'FRA',
    businessModel: 'legacy',
    reputation: 96,
    financialHealth: 'prosperous',
    riskTolerance: 'very_conservative',
    growthStrategy: 'steady_renewal',
    relationshipWithPlayer: 20,
    trustInPlayer: 'unknown',
    manufacturerPreference: { 'AeroGlobal': 75, 'SkyTitan': 25 },
    activeFleetCount: 420,
    fleetComposition: [
      { modelName: 'Aero 320', manufacturerName: 'AeroGlobal', isPlayerAircraft: false, count: 210, averageAgeYears: 6.8 },
      { modelName: 'Aero 350', manufacturerName: 'AeroGlobal', isPlayerAircraft: false, count: 65, averageAgeYears: 3.2 },
      { modelName: 'Titan 740-8', manufacturerName: 'SkyTitan', isPlayerAircraft: false, count: 35, averageAgeYears: 8.5 },
      { modelName: 'Aero 330', manufacturerName: 'AeroGlobal', isPlayerAircraft: false, count: 110, averageAgeYears: 11.2 }
    ],
    primaryColors: { primary: '#00205b', secondary: '#ffc72c' }
  },
  {
    id: 'celtic_wings',
    name: 'Celtic LowCost Express',
    icao: 'CLT',
    country: 'United Kingdom',
    region: 'europe',
    hubAirportIata: 'LHR',
    businessModel: 'ultra_low_cost',
    reputation: 84,
    financialHealth: 'prosperous',
    riskTolerance: 'innovative',
    growthStrategy: 'rapid_expansion',
    relationshipWithPlayer: 45,
    trustInPlayer: 'unknown',
    manufacturerPreference: { 'SkyTitan': 100 },
    activeFleetCount: 390,
    fleetComposition: [
      { modelName: 'Titan 730', manufacturerName: 'SkyTitan', isPlayerAircraft: false, count: 390, averageAgeYears: 6.5 }
    ],
    primaryColors: { primary: '#0038a8', secondary: '#ffdd00' }
  },
  {
    id: 'alpine_jet',
    name: 'Alpine Swiss Jet',
    icao: 'ALJ',
    country: 'Switzerland',
    region: 'europe',
    hubAirportIata: 'ZRH',
    businessModel: 'legacy',
    reputation: 94,
    financialHealth: 'prosperous',
    riskTolerance: 'balanced',
    growthStrategy: 'steady_renewal',
    relationshipWithPlayer: 35,
    trustInPlayer: 'unknown',
    manufacturerPreference: { 'AeroGlobal': 85, 'Albatross Commercial': 15 },
    activeFleetCount: 92,
    fleetComposition: [
      { modelName: 'Aero 320', manufacturerName: 'AeroGlobal', isPlayerAircraft: false, count: 52, averageAgeYears: 5.1 },
      { modelName: 'Aero 330', manufacturerName: 'AeroGlobal', isPlayerAircraft: false, count: 22, averageAgeYears: 9.8 },
      { modelName: 'AlbaJet 190', manufacturerName: 'Albatross Commercial', isPlayerAircraft: false, count: 18, averageAgeYears: 7.5 }
    ],
    primaryColors: { primary: '#d90000', secondary: '#ffffff' }
  },
  {
    id: 'iberian_sun',
    name: 'Iberian Sun Leisure',
    icao: 'IBS',
    country: 'Spain',
    region: 'europe',
    hubAirportIata: 'MAD',
    businessModel: 'leisure',
    reputation: 78,
    financialHealth: 'stable',
    riskTolerance: 'balanced',
    growthStrategy: 'steady_renewal',
    relationshipWithPlayer: 40,
    trustInPlayer: 'experimental',
    manufacturerPreference: { 'AeroGlobal': 60, 'SkyTitan': 40 },
    activeFleetCount: 65,
    fleetComposition: [
      { modelName: 'Aero 321-dense', manufacturerName: 'AeroGlobal', isPlayerAircraft: false, count: 45, averageAgeYears: 8.2 },
      { modelName: 'Aero 330-300', manufacturerName: 'AeroGlobal', isPlayerAircraft: false, count: 20, averageAgeYears: 12.0 }
    ],
    primaryColors: { primary: '#ffcc00', secondary: '#d40000' }
  },
  {
    id: 'viking_scandic',
    name: 'Scandic Airlink',
    icao: 'SCA',
    country: 'Sweden',
    region: 'europe',
    hubAirportIata: 'AMS',
    businessModel: 'regional',
    reputation: 89,
    financialHealth: 'stable',
    riskTolerance: 'balanced',
    growthStrategy: 'steady_renewal',
    relationshipWithPlayer: 55,
    trustInPlayer: 'experimental',
    manufacturerPreference: { 'Nordic Jet': 60, 'Albatross Commercial': 40 },
    activeFleetCount: 52,
    fleetComposition: [
      { modelName: 'Nordic Jet 90', manufacturerName: 'Nordic Jet', isPlayerAircraft: false, count: 32, averageAgeYears: 6.4 },
      { modelName: 'AlbaJet 195', manufacturerName: 'Albatross Commercial', isPlayerAircraft: false, count: 20, averageAgeYears: 4.8 }
    ],
    primaryColors: { primary: '#002f6c', secondary: '#f2a900' }
  },

  // Middle East & Africa
  {
    id: 'gulf_prestige',
    name: 'Gulf Prestige Airways',
    icao: 'GPX',
    country: 'United Arab Emirates',
    region: 'middle_east',
    hubAirportIata: 'DXB',
    businessModel: 'legacy',
    reputation: 98,
    financialHealth: 'prosperous',
    riskTolerance: 'balanced',
    growthStrategy: 'rapid_expansion',
    relationshipWithPlayer: 15,
    trustInPlayer: 'unknown',
    manufacturerPreference: { 'SkyTitan': 50, 'AeroGlobal': 50 },
    activeFleetCount: 260,
    fleetComposition: [
      { modelName: 'Aero 380 Superjumbo', manufacturerName: 'AeroGlobal', isPlayerAircraft: false, count: 110, averageAgeYears: 7.5 },
      { modelName: 'Titan 770', manufacturerName: 'SkyTitan', isPlayerAircraft: false, count: 150, averageAgeYears: 6.2 }
    ],
    primaryColors: { primary: '#8b0000', secondary: '#c5a059' }
  },
  {
    id: 'safari_air',
    name: 'Pan-African Airways',
    icao: 'PAA',
    country: 'Kenya',
    region: 'africa',
    hubAirportIata: 'NBO',
    businessModel: 'regional',
    reputation: 76,
    financialHealth: 'struggling',
    riskTolerance: 'innovative',
    growthStrategy: 'cost_cutting',
    relationshipWithPlayer: 65,
    trustInPlayer: 'experimental',
    manufacturerPreference: { 'Albatross Commercial': 70, 'SkyTitan': 30 },
    activeFleetCount: 38,
    fleetComposition: [
      { modelName: 'AlbaJet 170', manufacturerName: 'Albatross Commercial', isPlayerAircraft: false, count: 24, averageAgeYears: 11.2 },
      { modelName: 'Titan 730', manufacturerName: 'SkyTitan', isPlayerAircraft: false, count: 14, averageAgeYears: 14.8 }
    ],
    primaryColors: { primary: '#006400', secondary: '#ff8c00' }
  },
  {
    id: 'habesha_wings',
    name: 'Ethiopian Crown Airlines',
    icao: 'ETX',
    country: 'Ethiopia',
    region: 'africa',
    hubAirportIata: 'ADD',
    businessModel: 'legacy',
    reputation: 90,
    financialHealth: 'prosperous',
    riskTolerance: 'balanced',
    growthStrategy: 'rapid_expansion',
    relationshipWithPlayer: 45,
    trustInPlayer: 'experimental',
    manufacturerPreference: { 'SkyTitan': 70, 'AeroGlobal': 30 },
    activeFleetCount: 110,
    fleetComposition: [
      { modelName: 'Titan 780', manufacturerName: 'SkyTitan', isPlayerAircraft: false, count: 32, averageAgeYears: 5.2 },
      { modelName: 'Aero 350', manufacturerName: 'AeroGlobal', isPlayerAircraft: false, count: 18, averageAgeYears: 3.5 },
      { modelName: 'Titan 730', manufacturerName: 'SkyTitan', isPlayerAircraft: false, count: 60, averageAgeYears: 7.9 }
    ],
    primaryColors: { primary: '#007a3d', secondary: '#fed100' }
  },

  // Asia Pacific
  {
    id: 'nippon_shangri',
    name: 'Nippon Imperial Airways',
    icao: 'NIA',
    country: 'Japan',
    region: 'asia_pacific',
    hubAirportIata: 'HND',
    businessModel: 'legacy',
    reputation: 97,
    financialHealth: 'prosperous',
    riskTolerance: 'very_conservative',
    growthStrategy: 'steady_renewal',
    relationshipWithPlayer: 20,
    trustInPlayer: 'unknown',
    manufacturerPreference: { 'SkyTitan': 75, 'AeroGlobal': 25 },
    activeFleetCount: 245,
    fleetComposition: [
      { modelName: 'Titan 780', manufacturerName: 'SkyTitan', isPlayerAircraft: false, count: 75, averageAgeYears: 4.5 },
      { modelName: 'Titan 770', manufacturerName: 'SkyTitan', isPlayerAircraft: false, count: 50, averageAgeYears: 12.0 },
      { modelName: 'Aero 320', manufacturerName: 'AeroGlobal', isPlayerAircraft: false, count: 120, averageAgeYears: 6.8 }
    ],
    primaryColors: { primary: '#002b49', secondary: '#e60012' }
  },
  {
    id: 'dragon_silk',
    name: 'Silk Road Orient Express',
    icao: 'SRO',
    country: 'China',
    region: 'asia_pacific',
    hubAirportIata: 'PEK',
    businessModel: 'legacy',
    reputation: 91,
    financialHealth: 'prosperous',
    riskTolerance: 'balanced',
    growthStrategy: 'rapid_expansion',
    relationshipWithPlayer: 30,
    trustInPlayer: 'unknown',
    manufacturerPreference: { 'AeroGlobal': 45, 'SkyTitan': 40, 'Pacific Rim Aero': 15 },
    activeFleetCount: 480,
    fleetComposition: [
      { modelName: 'Aero 320', manufacturerName: 'AeroGlobal', isPlayerAircraft: false, count: 240, averageAgeYears: 5.8 },
      { modelName: 'Titan 730', manufacturerName: 'SkyTitan', isPlayerAircraft: false, count: 160, averageAgeYears: 6.2 },
      { modelName: 'Aero 350', manufacturerName: 'AeroGlobal', isPlayerAircraft: false, count: 80, averageAgeYears: 3.1 }
    ],
    primaryColors: { primary: '#b22222', secondary: '#ffd700' }
  },
  {
    id: 'singapore_celestial',
    name: 'Merlion Celestial Air',
    icao: 'MCA',
    country: 'Singapore',
    region: 'asia_pacific',
    hubAirportIata: 'SIN',
    businessModel: 'legacy',
    reputation: 99,
    financialHealth: 'prosperous',
    riskTolerance: 'very_conservative',
    growthStrategy: 'steady_renewal',
    relationshipWithPlayer: 10,
    trustInPlayer: 'unknown',
    manufacturerPreference: { 'AeroGlobal': 60, 'SkyTitan': 40 },
    activeFleetCount: 155,
    fleetComposition: [
      { modelName: 'Aero 350-900', manufacturerName: 'AeroGlobal', isPlayerAircraft: false, count: 65, averageAgeYears: 3.4 },
      { modelName: 'Titan 780-10', manufacturerName: 'SkyTitan', isPlayerAircraft: false, count: 40, averageAgeYears: 3.8 },
      { modelName: 'Aero 380', manufacturerName: 'AeroGlobal', isPlayerAircraft: false, count: 50, averageAgeYears: 9.2 }
    ],
    primaryColors: { primary: '#1c3f60', secondary: '#d4af37' }
  },
  {
    id: 'siam_lowcost',
    name: 'Siam Smile Jet',
    icao: 'SSJ',
    country: 'Thailand',
    region: 'asia_pacific',
    hubAirportIata: 'BKK',
    businessModel: 'low_cost',
    reputation: 77,
    financialHealth: 'stable',
    riskTolerance: 'innovative',
    growthStrategy: 'rapid_expansion',
    relationshipWithPlayer: 55,
    trustInPlayer: 'experimental',
    manufacturerPreference: { 'AeroGlobal': 80 },
    activeFleetCount: 72,
    fleetComposition: [
      { modelName: 'Aero 320', manufacturerName: 'AeroGlobal', isPlayerAircraft: false, count: 72, averageAgeYears: 4.9 }
    ],
    primaryColors: { primary: '#ed1b24', secondary: '#ffffff' }
  },
  {
    id: 'bharat_skies',
    name: 'Bharat Skyways',
    icao: 'BSK',
    country: 'India',
    region: 'asia_pacific',
    hubAirportIata: 'DEL',
    businessModel: 'ultra_low_cost',
    reputation: 83,
    financialHealth: 'prosperous',
    riskTolerance: 'innovative',
    growthStrategy: 'rapid_expansion',
    relationshipWithPlayer: 40,
    trustInPlayer: 'unknown',
    manufacturerPreference: { 'AeroGlobal': 90 },
    activeFleetCount: 260,
    fleetComposition: [
      { modelName: 'Aero 320-neo', manufacturerName: 'AeroGlobal', isPlayerAircraft: false, count: 260, averageAgeYears: 3.2 }
    ],
    primaryColors: { primary: '#002060', secondary: '#ff6600' }
  },

  // Oceania
  {
    id: 'kangaroo_pacific',
    name: 'Southern Cross Pacific',
    icao: 'SCP',
    country: 'Australia',
    region: 'oceania',
    hubAirportIata: 'SYD',
    businessModel: 'legacy',
    reputation: 95,
    financialHealth: 'prosperous',
    riskTolerance: 'very_conservative',
    growthStrategy: 'steady_renewal',
    relationshipWithPlayer: 20,
    trustInPlayer: 'unknown',
    manufacturerPreference: { 'SkyTitan': 60, 'AeroGlobal': 40 },
    activeFleetCount: 135,
    fleetComposition: [
      { modelName: 'Titan 730', manufacturerName: 'SkyTitan', isPlayerAircraft: false, count: 75, averageAgeYears: 10.2 },
      { modelName: 'Aero 330', manufacturerName: 'AeroGlobal', isPlayerAircraft: false, count: 28, averageAgeYears: 12.4 },
      { modelName: 'Titan 780', manufacturerName: 'SkyTitan', isPlayerAircraft: false, count: 32, averageAgeYears: 4.1 }
    ],
    primaryColors: { primary: '#e0001a', secondary: '#ffffff' }
  },

  // Global Cargo Carriers
  {
    id: 'global_freight_logistics',
    name: 'Apex Global Cargo Logistics',
    icao: 'AGL',
    country: 'United States',
    region: 'north_america',
    hubAirportIata: 'MIA',
    businessModel: 'cargo',
    reputation: 93,
    financialHealth: 'prosperous',
    riskTolerance: 'balanced',
    growthStrategy: 'steady_renewal',
    relationshipWithPlayer: 40,
    trustInPlayer: 'unknown',
    manufacturerPreference: { 'SkyTitan': 80, 'AeroGlobal': 20 },
    activeFleetCount: 290,
    fleetComposition: [
      { modelName: 'Titan 760 Freighter', manufacturerName: 'SkyTitan', isPlayerAircraft: false, count: 120, averageAgeYears: 14.5 },
      { modelName: 'Titan 770 Freighter', manufacturerName: 'SkyTitan', isPlayerAircraft: false, count: 65, averageAgeYears: 7.2 },
      { modelName: 'Aero 300 Freighter', manufacturerName: 'AeroGlobal', isPlayerAircraft: false, count: 105, averageAgeYears: 22.0 }
    ],
    primaryColors: { primary: '#4b146b', secondary: '#ff6200' }
  },
  {
    id: 'trans_eurasia_cargo',
    name: 'Trans-Eurasia Air Bridge',
    icao: 'TEA',
    country: 'Germany',
    region: 'europe',
    hubAirportIata: 'FRA',
    businessModel: 'cargo',
    reputation: 87,
    financialHealth: 'stable',
    riskTolerance: 'innovative',
    growthStrategy: 'steady_renewal',
    relationshipWithPlayer: 50,
    trustInPlayer: 'experimental',
    manufacturerPreference: { 'SkyTitan': 50, 'AeroGlobal': 50 },
    activeFleetCount: 45,
    fleetComposition: [
      { modelName: 'Titan 770 Freighter', manufacturerName: 'SkyTitan', isPlayerAircraft: false, count: 25, averageAgeYears: 8.0 },
      { modelName: 'Aero 330 Freighter', manufacturerName: 'AeroGlobal', isPlayerAircraft: false, count: 20, averageAgeYears: 6.5 }
    ],
    primaryColors: { primary: '#ffcc00', secondary: '#000000' }
  }
];

export function getAirlineById(id: string): AirlineCustomer | undefined {
  return INITIAL_AIRLINES.find(a => a.id === id);
}
