import type { MarketSegmentData } from '../types';

export const MARKET_SEGMENTS_DATA: MarketSegmentData[] = [
  {
    id: 'regional_turboprop',
    name: 'Regional Turboprop (40–78 Seats)',
    seatRange: [40, 78],
    typicalRangeKm: [1800, 2800],
    projected20YearDemandUnits: 3100,
    currentFleetWorldwide: 2450,
    averageAgeYears: 13.8,
    dominantCompetitors: ['Albatross Commercial', 'Sterling Aero & Defense'],
    averagePriceMillionsUSD: 26.5,
    projectedAnnualGrowthPercent: 2.1,
    description: 'High-efficiency short-field feeder aircraft connecting remote communities and island chains with unpaved or short runway operations.'
  },
  {
    id: 'regional_jet',
    name: 'Regional Jet (70–95 Seats)',
    seatRange: [70, 95],
    typicalRangeKm: [3200, 4200],
    projected20YearDemandUnits: 4400,
    currentFleetWorldwide: 3800,
    averageAgeYears: 11.2,
    dominantCompetitors: ['Albatross Commercial', 'Pacific Rim Aero'],
    averagePriceMillionsUSD: 49.0,
    projectedAnnualGrowthPercent: 3.2,
    description: 'Sub-100 seat regional feed, governed heavily by US pilot scope clauses (76-seat MTOW limits) and European point-to-point secondary city routes.'
  },
  {
    id: 'small_narrowbody',
    name: 'Small Narrowbody (100–140 Seats)',
    seatRange: [100, 140],
    typicalRangeKm: [4500, 6200],
    projected20YearDemandUnits: 6800,
    currentFleetWorldwide: 4100,
    averageAgeYears: 9.5,
    dominantCompetitors: ['Nordic Jet', 'Albatross Commercial'],
    averagePriceMillionsUSD: 72.0,
    projectedAnnualGrowthPercent: 4.5,
    description: 'Sweet spot for thin transcontinental routes, opening long-thin secondary airport pairs with mainline jet comfort and 5-abreast economics.'
  },
  {
    id: 'narrowbody',
    name: 'Standard Narrowbody (150–190 Seats)',
    seatRange: [150, 190],
    typicalRangeKm: [5500, 6800],
    projected20YearDemandUnits: 21500,
    currentFleetWorldwide: 16800,
    averageAgeYears: 7.8,
    dominantCompetitors: ['AeroGlobal Consortium', 'SkyTitan Aerospace', 'Pacific Rim Aero'],
    averagePriceMillionsUSD: 108.0,
    projectedAnnualGrowthPercent: 5.1,
    description: 'The backbone of global aviation. Ultra-high volume, intense airline price sensitivity, and rigorous turn-around and utilization requirements.'
  },
  {
    id: 'large_narrowbody',
    name: 'Large Narrowbody (195–240 Seats)',
    seatRange: [195, 240],
    typicalRangeKm: [6500, 8000],
    projected20YearDemandUnits: 7200,
    currentFleetWorldwide: 3900,
    averageAgeYears: 6.4,
    dominantCompetitors: ['AeroGlobal Consortium', 'SkyTitan Aerospace'],
    averagePriceMillionsUSD: 135.0,
    projectedAnnualGrowthPercent: 5.8,
    description: 'High-density domestic trunk routes and transatlantic narrowbody long-range flights eating into traditional widebody market share.'
  },
  {
    id: 'mid_market',
    name: 'Middle of Market / MoM (220–270 Seats)',
    seatRange: [220, 270],
    typicalRangeKm: [8500, 11000],
    projected20YearDemandUnits: 3800,
    currentFleetWorldwide: 2100,
    averageAgeYears: 14.5,
    dominantCompetitors: ['SkyTitan Aerospace', 'AeroGlobal Consortium'],
    averagePriceMillionsUSD: 195.0,
    projectedAnnualGrowthPercent: 4.1,
    description: 'The 757/767 replacement territory. Twin-aisle comfort with single-aisle economics for medium-haul high-density city pairs.'
  },
  {
    id: 'widebody',
    name: 'Standard Twin-Aisle Widebody (270–340 Seats)',
    seatRange: [270, 340],
    typicalRangeKm: [12000, 15500],
    projected20YearDemandUnits: 5100,
    currentFleetWorldwide: 3400,
    averageAgeYears: 8.9,
    dominantCompetitors: ['SkyTitan Aerospace', 'AeroGlobal Consortium'],
    averagePriceMillionsUSD: 280.0,
    projectedAnnualGrowthPercent: 3.8,
    description: 'Intercontinental flagship long-haul workhorse with heavy belly cargo capacity and multi-class premium passenger layout.'
  },
  {
    id: 'large_widebody',
    name: 'Large Widebody (350–450+ Seats)',
    seatRange: [350, 480],
    typicalRangeKm: [14000, 16800],
    projected20YearDemandUnits: 2200,
    currentFleetWorldwide: 1600,
    averageAgeYears: 9.8,
    dominantCompetitors: ['AeroGlobal Consortium', 'SkyTitan Aerospace'],
    averagePriceMillionsUSD: 390.0,
    projectedAnnualGrowthPercent: 2.4,
    description: 'Ultra-long range global trunk routes connecting mega-hubs across polar and transpacific trajectories.'
  }
];

export function getMarketSegmentData(id: string): MarketSegmentData | undefined {
  return MARKET_SEGMENTS_DATA.find(s => s.id === id);
}
