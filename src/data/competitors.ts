import type { CompetitorManufacturer } from '../types';

export const INITIAL_COMPETITORS: CompetitorManufacturer[] = [
  {
    id: 'aeroglobal',
    name: 'AeroGlobal Consortium',
    country: 'France / Germany / Spain',
    archetype: 'european_consortium',
    reputation: 96,
    marketSharePercent: 44.5,
    financialReserves: 14200,
    engineeringSkill: 95,
    factoryCapacityPerMonth: 65,
    activeAircraftFamilies: [
      { name: 'Aero 320 Family', segment: 'narrowbody', seats: 165, rangeKm: 6200, fuelBurnScore: 92, listPrice: 105.0, unitsDelivered: 8400, backlog: 5200 },
      { name: 'Aero 321LR/XLR', segment: 'large_narrowbody', seats: 206, rangeKm: 7400, fuelBurnScore: 95, listPrice: 128.0, unitsDelivered: 2200, backlog: 2600 },
      { name: 'Aero 330neo', segment: 'widebody', seats: 280, rangeKm: 12500, fuelBurnScore: 88, listPrice: 260.0, unitsDelivered: 1450, backlog: 320 },
      { name: 'Aero 350 XWB', segment: 'large_widebody', seats: 350, rangeKm: 15400, fuelBurnScore: 96, listPrice: 345.0, unitsDelivered: 520, backlog: 890 }
    ],
    currentRndPipeline: {
      projectName: 'Aero 322 Ultrafan Concept',
      segment: 'large_narrowbody',
      targetEisYear: 2027,
      status: 'flight_testing'
    }
  },
  {
    id: 'skytitan',
    name: 'SkyTitan Aerospace',
    country: 'United States',
    archetype: 'established_giant',
    reputation: 94,
    marketSharePercent: 42.0,
    financialReserves: 11800,
    engineeringSkill: 93,
    factoryCapacityPerMonth: 60,
    activeAircraftFamilies: [
      { name: 'Titan 730-8 Max', segment: 'narrowbody', seats: 172, rangeKm: 6500, fuelBurnScore: 91, listPrice: 108.0, unitsDelivered: 9100, backlog: 4400 },
      { name: 'Titan 730-10', segment: 'large_narrowbody', seats: 210, rangeKm: 5900, fuelBurnScore: 89, listPrice: 132.0, unitsDelivered: 450, backlog: 1100 },
      { name: 'Titan 780 Dreamliner', segment: 'widebody', seats: 290, rangeKm: 14100, fuelBurnScore: 96, listPrice: 285.0, unitsDelivered: 1100, backlog: 780 },
      { name: 'Titan 770X', segment: 'large_widebody', seats: 395, rangeKm: 16100, fuelBurnScore: 94, listPrice: 420.0, unitsDelivered: 120, backlog: 410 }
    ],
    currentRndPipeline: {
      projectName: 'Titan NMA (Mid-Market)',
      segment: 'mid_market',
      targetEisYear: 2026,
      status: 'launched'
    }
  },
  {
    id: 'albatross',
    name: 'Albatross Commercial Aviation',
    country: 'Brazil',
    archetype: 'regional_specialist',
    reputation: 89,
    marketSharePercent: 7.8,
    financialReserves: 3400,
    engineeringSkill: 92,
    factoryCapacityPerMonth: 14,
    activeAircraftFamilies: [
      { name: 'AlbaJet 175-E2', segment: 'regional_jet', seats: 88, rangeKm: 4050, fuelBurnScore: 93, listPrice: 53.0, unitsDelivered: 980, backlog: 240 },
      { name: 'AlbaJet 190-E2', segment: 'small_narrowbody', seats: 106, rangeKm: 5250, fuelBurnScore: 94, listPrice: 62.0, unitsDelivered: 620, backlog: 180 },
      { name: 'AlbaJet 195-E2', segment: 'small_narrowbody', seats: 132, rangeKm: 4800, fuelBurnScore: 96, listPrice: 71.0, unitsDelivered: 410, backlog: 310 }
    ],
    currentRndPipeline: {
      projectName: 'Alba Turboprop NextGen',
      segment: 'regional_turboprop',
      targetEisYear: 2025,
      status: 'near_eis'
    }
  },
  {
    id: 'pacific_rim',
    name: 'Pacific Rim Commercial Aircraft Corp',
    country: 'China',
    archetype: 'asian_powerhouse',
    reputation: 76,
    marketSharePercent: 3.5,
    financialReserves: 9500,
    engineeringSkill: 81,
    factoryCapacityPerMonth: 8,
    activeAircraftFamilies: [
      { name: 'PRAC C919', segment: 'narrowbody', seats: 164, rangeKm: 5500, fuelBurnScore: 84, listPrice: 94.0, unitsDelivered: 110, backlog: 920 },
      { name: 'PRAC ARJ21', segment: 'regional_jet', seats: 90, rangeKm: 3700, fuelBurnScore: 78, listPrice: 42.0, unitsDelivered: 160, backlog: 210 }
    ],
    currentRndPipeline: {
      projectName: 'PRAC C929 Widebody',
      segment: 'widebody',
      targetEisYear: 2029,
      status: 'launched'
    }
  },
  {
    id: 'nordic_jet',
    name: 'Nordic Jet Aerospace',
    country: 'Canada / Sweden',
    archetype: 'agile_innovator',
    reputation: 84,
    marketSharePercent: 1.8,
    financialReserves: 1800,
    engineeringSkill: 90,
    factoryCapacityPerMonth: 6,
    activeAircraftFamilies: [
      { name: 'Nordic Series 100', segment: 'small_narrowbody', seats: 115, rangeKm: 5800, fuelBurnScore: 97, listPrice: 68.0, unitsDelivered: 290, backlog: 140 },
      { name: 'Nordic Series 300', segment: 'small_narrowbody', seats: 140, rangeKm: 6100, fuelBurnScore: 98, listPrice: 79.0, unitsDelivered: 380, backlog: 290 }
    ]
  },
  {
    id: 'sterling_aero',
    name: 'Sterling Aero & Defense',
    country: 'United Kingdom',
    archetype: 'agile_innovator',
    reputation: 81,
    marketSharePercent: 0.4,
    financialReserves: 1100,
    engineeringSkill: 87,
    factoryCapacityPerMonth: 3,
    activeAircraftFamilies: [
      { name: 'Sterling VIP Commuter', segment: 'regional_turboprop', seats: 48, rangeKm: 2600, fuelBurnScore: 88, listPrice: 24.0, unitsDelivered: 420, backlog: 35 }
    ]
  }
];

export function getCompetitorById(id: string): CompetitorManufacturer | undefined {
  return INITIAL_COMPETITORS.find(c => c.id === id);
}
