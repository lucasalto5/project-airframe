// ============================================================================
// PROJECT AIRFRAME - AEROSPACE & SIMULATION FORMULAS
// ============================================================================

import type {
  AircraftGeometry,
  PropulsionConfig,
  AircraftSystemsConfig,
  AircraftMassBreakdown,
  AircraftPerformance,
  MaterialType,
  WingletType,
  MarketSegmentId
} from '../types';

// Standard Physical Constants & Conversions
export const ISA_SEA_LEVEL_DENSITY = 1.225; // kg/m^3
export const GRAVITY = 9.80665; // m/s^2
export const SPEED_OF_SOUND_CRUISE_MS = 295.0; // m/s at FL350 (~1062 km/h)
export const KM_TO_NM = 0.539957;
export const NM_TO_KM = 1.852;
export const KG_TO_LBS = 2.20462;
export const LBS_TO_KG = 0.453592;
export const GALLONS_TO_LITERS = 3.78541;
export const JET_A1_DENSITY_KG_L = 0.804; // kg per liter

/**
 * Material weight savings and cost multipliers
 */
export const MATERIAL_SPECS: Record<MaterialType, { weightFactor: number; costFactor: number; complexityFactor: number }> = {
  conventional_aluminum: { weightFactor: 1.0, costFactor: 1.0, complexityFactor: 1.0 },
  advanced_al_li: { weightFactor: 0.91, costFactor: 1.35, complexityFactor: 1.25 },
  carbon_composite_hybrid: { weightFactor: 0.82, costFactor: 1.85, complexityFactor: 1.65 },
  full_carbon_composite: { weightFactor: 0.74, costFactor: 2.45, complexityFactor: 2.10 }
};

/**
 * Winglet aerodynamic drag reduction and weight addition
 */
export const WINGLET_SPECS: Record<WingletType, { inducedDragReduction: number; structuralWeightAddKg: number; costAddMUSD: number }> = {
  none: { inducedDragReduction: 0.0, structuralWeightAddKg: 0, costAddMUSD: 0 },
  canted: { inducedDragReduction: 0.035, structuralWeightAddKg: 180, costAddMUSD: 0.4 },
  blended: { inducedDragReduction: 0.050, structuralWeightAddKg: 240, costAddMUSD: 0.75 },
  split_scimitar: { inducedDragReduction: 0.065, structuralWeightAddKg: 310, costAddMUSD: 1.1 },
  raked_wingtip: { inducedDragReduction: 0.055, structuralWeightAddKg: 200, costAddMUSD: 0.9 },
  folding_wingtip: { inducedDragReduction: 0.070, structuralWeightAddKg: 850, costAddMUSD: 2.8 }
};

/**
 * 1. CABIN SEAT CAPACITY & DIMENSIONS
 */
export function calculateCabinCapacity(geom: AircraftGeometry): { typicalSeats: number; maxSeats: number; cargoVolM3: number } {
  const usableLengthM = Math.max(8, geom.length - 10.5);
  const rowPitchM = (geom.seatPitchInches * 0.0254);
  const rows = Math.max(4, Math.floor(usableLengthM / rowPitchM));
  
  const typicalSeats = rows * geom.seatsAbreast;
  const exitLimit = Math.max(19, geom.emergencyExits * 42);
  const maxDenseSeats = Math.min(exitLimit, Math.floor(rows * 1.15) * geom.seatsAbreast);
  
  const fuselageCrossSectionArea = Math.PI * Math.pow(geom.fuselageDiameter / 2, 2);
  const cargoFraction = geom.aisles === 2 ? 0.38 : 0.22;
  const cargoVolM3 = Math.max(4, Math.round(usableLengthM * fuselageCrossSectionArea * cargoFraction));
  
  return {
    typicalSeats,
    maxSeats: maxDenseSeats,
    cargoVolM3
  };
}

/**
 * 2. MASS BREAKDOWN ESTIMATION
 */
export function calculateMassBreakdown(
  geom: AircraftGeometry,
  prop: PropulsionConfig,
  sys: AircraftSystemsConfig,
  typicalSeats: number
): AircraftMassBreakdown {
  const mat = MATERIAL_SPECS[geom.materialType];
  const winglet = WINGLET_SPECS[geom.wingletType];
  
  const wingBaseMassKg = 42 * geom.wingArea * Math.sqrt(geom.aspectRatio / 9.5) * (1 - (geom.compositePercentageWing / 100) * 0.22);
  const fuselageWettedArea = Math.PI * geom.fuselageDiameter * geom.length;
  const fuselageBaseMassKg = 32 * fuselageWettedArea * mat.weightFactor;
  const empennageMassKg = wingBaseMassKg * 0.20;
  const landingGearMassKg = (geom.typicalSeats * 380) * 0.038 * (sys.moreElectricArchitecture ? 0.95 : 1.0);
  
  const structureMassKg = Math.round(wingBaseMassKg + fuselageBaseMassKg + empennageMassKg + landingGearMassKg + winglet.structuralWeightAddKg);
  const nacelleAndPylonMassKg = prop.numberOfEngines * (prop.fanDiameterMeters * 320);
  const propulsionSystemMassKg = Math.round((prop.dryWeightKg * prop.numberOfEngines) + nacelleAndPylonMassKg);
  
  let systemsMassKg = 450 + (geom.typicalSeats * 18);
  if (sys.flightControls === 'digital_fbw' || sys.flightControls === 'adaptive_envelope_fbw') systemsMassKg -= 220;
  if (sys.cockpitTech === 'panoramic_touch_screens') systemsMassKg -= 90;
  if (sys.hydraulicRedundancy === 4) systemsMassKg += 340;
  if (sys.moreElectricArchitecture) systemsMassKg -= 180;
  
  const seatMassKg = geom.typicalSeats * 14.5;
  const galleysAndLavsKg = Math.ceil(geom.typicalSeats / 45) * 480;
  const ifeMassKg = sys.wifiAndIFE === 'seatback_hd_screens' ? geom.typicalSeats * 4.5 : 80;
  const insulationMassKg = sys.noiseInsulationLevel === 'ultra_quiet' ? 420 : 180;
  const cabinAndFurnishingsMassKg = Math.round(seatMassKg + galleysAndLavsKg + ifeMassKg + insulationMassKg);
  
  const oewKg = Math.round(structureMassKg + propulsionSystemMassKg + systemsMassKg + cabinAndFurnishingsMassKg);
  const paxAndBagsMassKg = typicalSeats * 105;
  const maxFreightKg = geom.cargoVolumeCubicMeters * 160;
  const maxPayloadKg = Math.round(paxAndBagsMassKg + maxFreightKg);
  const mzfwKg = Math.round(oewKg + maxPayloadKg);
  const maxFuelKg = Math.round(geom.fuelCapacityLiters * JET_A1_DENSITY_KG_L);
  const structuralMtowMargin = geom.length > 50 ? 1.68 : 1.48;
  const mtowKg = Math.round(Math.min(mzfwKg + maxFuelKg, mzfwKg * structuralMtowMargin));
  const mlwKg = Math.round(mtowKg * 0.86);
  
  return {
    structureMassKg,
    propulsionSystemMassKg,
    systemsAndAvionicsMassKg: Math.round(systemsMassKg),
    cabinAndFurnishingsMassKg,
    oewKg,
    maxPayloadKg,
    mzfwKg,
    maxFuelKg,
    mtowKg,
    mlwKg
  };
}

/**
 * 3. AERODYNAMICS & LIFT-TO-DRAG RATIO (L/D)
 */
export function calculateAerodynamics(
  geom: AircraftGeometry,
  prop: PropulsionConfig,
  sys: AircraftSystemsConfig
): { liftToDragCruise: number; cruiseMach: number; cruiseSpeedKmh: number } {
  const winglet = WINGLET_SPECS[geom.wingletType];
  
  let oswaldE = 0.82;
  if (geom.wingletType !== 'none') oswaldE += winglet.inducedDragReduction * 1.5;
  if (geom.materialType === 'full_carbon_composite') oswaldE += 0.02;
  
  const kInduced = 1 / (Math.PI * geom.aspectRatio * oswaldE);
  const finenessRatio = geom.length / geom.fuselageDiameter;
  const formFactorFuselage = 1 + 60 / Math.pow(finenessRatio, 3) + 0.0025 * finenessRatio;
  let cd0 = 0.0165 * formFactorFuselage * (1 - (geom.compositePercentageFuselage / 100) * 0.06);
  
  const nacelleArea = prop.numberOfEngines * Math.PI * Math.pow(prop.fanDiameterMeters / 2, 2);
  cd0 += (nacelleArea / geom.wingArea) * 0.024;
  
  let lOverDCruise = 0.5 * Math.sqrt(1 / (cd0 * kInduced));
  if (sys.flightControls === 'adaptive_envelope_fbw') lOverDCruise *= 1.03;
  
  const cruiseMach = Math.min(0.86, Math.max(0.74, 0.72 + (geom.wingSweepDegrees * 0.0042)));
  const cruiseSpeedKmh = Math.round(cruiseMach * SPEED_OF_SOUND_CRUISE_MS * 3.6);
  
  return {
    liftToDragCruise: parseFloat(lOverDCruise.toFixed(2)),
    cruiseMach: parseFloat(cruiseMach.toFixed(2)),
    cruiseSpeedKmh
  };
}

/**
 * 4. BREGUET RANGE EQUATION & FUEL BURN
 */
export function calculateRangeAndFuelBurn(
  mass: AircraftMassBreakdown,
  aero: { liftToDragCruise: number; cruiseSpeedKmh: number },
  prop: PropulsionConfig,
  typicalSeats: number
): { rangeKm: number; rangeNm: number; fuelBurnPerSeat1000Km: number; co2GramsPerPaxKm: number } {
  const nominalPayloadKg = typicalSeats * 105;
  const zeroFuelNominalKg = mass.oewKg + nominalPayloadKg;
  const availableFuelKg = Math.min(mass.maxFuelKg, mass.mtowKg - zeroFuelNominalKg);
  const reserveFuelKg = Math.min(availableFuelKg * 0.35, Math.max(1400, nominalPayloadKg * 0.18));
  const tripFuelKg = Math.max(0, availableFuelKg - reserveFuelKg);
  
  const wInitial = zeroFuelNominalKg + reserveFuelKg + tripFuelKg;
  const wFinal = zeroFuelNominalKg + reserveFuelKg;
  
  const vCruiseMs = (aero.cruiseSpeedKmh / 3.6);
  const sfcKgNs = (prop.cruiseSFC / 3600000);
  
  let rangeMeters = (vCruiseMs / (GRAVITY * sfcKgNs)) * aero.liftToDragCruise * Math.log(wInitial / wFinal);
  if (isNaN(rangeMeters) || rangeMeters < 0) rangeMeters = 0;
  
  const rangeKm = Math.round(rangeMeters / 1000);
  const rangeNm = Math.round(rangeKm * KM_TO_NM);
  
  const totalTripLiters = tripFuelKg / JET_A1_DENSITY_KG_L;
  const fuelBurnPerSeat1000Km = rangeKm > 0 
    ? parseFloat(((totalTripLiters / typicalSeats / (rangeKm / 1000))).toFixed(2))
    : 35.0;
    
  const co2GramsPerPaxKm = rangeKm > 0
    ? Math.round((tripFuelKg * 3.16 * 1000) / (typicalSeats * rangeKm))
    : 110;
    
  return {
    rangeKm,
    rangeNm,
    fuelBurnPerSeat1000Km,
    co2GramsPerPaxKm
  };
}

/**
 * 5. TAKEOFF & LANDING RUNWAY FIELD LENGTHS
 */
export function calculateRunwayPerformance(
  mass: AircraftMassBreakdown,
  geom: AircraftGeometry,
  prop: PropulsionConfig
): { toflMeters: number; lflMeters: number } {
  const totalThrustKN = prop.thrustPerEngineKN * prop.numberOfEngines;
  const thrustToWeight = (totalThrustKN * 1000) / (mass.mtowKg * GRAVITY);
  const wingLoadingKgM2 = mass.mtowKg / geom.wingArea;
  const clMaxTakeoff = 2.25;
  
  const tofl = (37.5 * wingLoadingKgM2) / (clMaxTakeoff * Math.max(0.18, thrustToWeight));
  const toflMeters = Math.round(Math.min(3900, Math.max(1100, tofl)));
  
  const landingWingLoading = mass.mlwKg / geom.wingArea;
  const clMaxLanding = 2.75;
  const lflMeters = Math.round(Math.min(2600, Math.max(1000, 22.0 * (landingWingLoading / clMaxLanding) + 420)));
  
  return {
    toflMeters,
    lflMeters
  };
}

/**
 * 6. DIRECT OPERATING COST (DOC) & COMFORT SCORES
 */
export function calculateEconomicsAndComfort(
  geom: AircraftGeometry,
  sys: AircraftSystemsConfig,
  fuelBurn: { fuelBurnPerSeat1000Km: number; rangeKm: number },
  typicalSeats: number
): { docPerSeatKm: number; comfortScore: number; noiseEPNdB: number; turnaroundMins: number } {
  const fuelCostPerSeatKm = (fuelBurn.fuelBurnPerSeat1000Km / 1000) * 0.85;
  
  let maintFactor = 0.018;
  if (geom.materialType === 'full_carbon_composite') maintFactor *= 0.85;
  if (sys.flightControls === 'adaptive_envelope_fbw') maintFactor *= 0.95;
  if (sys.moreElectricArchitecture) maintFactor *= 0.92;
  
  const capitalFactor = 0.012;
  const docPerSeatKm = parseFloat((fuelCostPerSeatKm + maintFactor + capitalFactor).toFixed(4));
  
  let comfort = 50;
  const seatWidthInches = ((geom.cabinWidth - (geom.aisles * 0.50)) / geom.seatsAbreast) / 0.0254;
  comfort += (seatWidthInches - 17.5) * 8;
  comfort += (geom.seatPitchInches - 30) * 4;
  comfort += ((8000 - sys.cabinAltitudeFeet) / 1000) * 3.5;
  
  if (sys.noiseInsulationLevel === 'ultra_quiet') comfort += 6;
  if (sys.wifiAndIFE === 'seatback_hd_screens') comfort += 5;
  
  const comfortScore = Math.min(100, Math.max(10, Math.round(comfort)));
  const noiseEPNdB = Math.round(84 + (geom.typicalSeats * 0.035) - (sys.noiseInsulationLevel === 'ultra_quiet' ? 3.5 : 0));
  const turnaroundMins = Math.round(18 + (typicalSeats / (geom.aisles * 12)));
  
  return {
    docPerSeatKm,
    comfortScore,
    noiseEPNdB,
    turnaroundMins
  };
}

/**
 * 7. UNIT MANUFACTURING COST & LIST PRICE
 */
export function calculateUnitCostsAndPrice(
  mass: AircraftMassBreakdown,
  geom: AircraftGeometry,
  prop: PropulsionConfig,
  sys: AircraftSystemsConfig,
  _segment: MarketSegmentId
): { estimatedUnitCost: number; suggestedListPrice: number; developmentCostMUSD: number } {
  const mat = MATERIAL_SPECS[geom.materialType];
  const structureCostMUSD = (mass.structureMassKg * 880 * mat.costFactor) / 1_000_000;
  const enginesCostMUSD = (prop.pricePerEngine * prop.numberOfEngines);
  
  let systemsCostMUSD = 6.5 + (mass.systemsAndAvionicsMassKg * 1200) / 1_000_000;
  if (sys.flightControls === 'adaptive_envelope_fbw') systemsCostMUSD += 4.5;
  if (sys.cockpitTech === 'panoramic_touch_screens') systemsCostMUSD += 2.8;
  
  const interiorCostMUSD = (mass.cabinAndFurnishingsMassKg * 650) / 1_000_000;
  const rawUnitCost = structureCostMUSD + enginesCostMUSD + systemsCostMUSD + interiorCostMUSD;
  const estimatedUnitCost = parseFloat(rawUnitCost.toFixed(2));
  const suggestedListPrice = parseFloat((estimatedUnitCost * 1.48).toFixed(2));
  
  const techNoveltyMultiplier = mat.complexityFactor * (sys.flightControls === 'adaptive_envelope_fbw' ? 1.25 : 1.0);
  const baseRdMUSD = 950 + Math.pow(mass.mtowKg / 1000, 1.25) * 16 * techNoveltyMultiplier;
  const developmentCostMUSD = Math.round(baseRdMUSD);
  
  return {
    estimatedUnitCost,
    suggestedListPrice,
    developmentCostMUSD
  };
}

/**
 * 8. COMPLETE AIRCRAFT SYNTHESIS
 */
export function synthesizeAircraftSpecs(
  geom: AircraftGeometry,
  prop: PropulsionConfig,
  sys: AircraftSystemsConfig,
  segment: MarketSegmentId
): { mass: AircraftMassBreakdown; perf: AircraftPerformance; unitCost: number; listPrice: number; rdCost: number } {
  const { typicalSeats, maxSeats, cargoVolM3 } = calculateCabinCapacity(geom);
  geom.typicalSeats = typicalSeats;
  geom.maxSeats = maxSeats;
  geom.cargoVolumeCubicMeters = cargoVolM3;
  
  const mass = calculateMassBreakdown(geom, prop, sys, typicalSeats);
  const aero = calculateAerodynamics(geom, prop, sys);
  const rangeData = calculateRangeAndFuelBurn(mass, aero, prop, typicalSeats);
  const runway = calculateRunwayPerformance(mass, geom, prop);
  const econ = calculateEconomicsAndComfort(geom, sys, rangeData, typicalSeats);
  const costs = calculateUnitCostsAndPrice(mass, geom, prop, sys, segment);
  
  const airlineAppealScore = Math.min(100, Math.max(20, Math.round(
    50 + (20 - rangeData.fuelBurnPerSeat1000Km) * 2.5 + (econ.comfortScore - 50) * 0.4
  )));
  
  const fineness = geom.length / geom.fuselageDiameter;
  const visualProportionsScore = Math.min(100, Math.max(40, Math.round(
    85 - Math.abs(fineness - 9.5) * 4 + (geom.wingletType !== 'none' ? 6 : 0)
  )));
  
  const perf: AircraftPerformance = {
    rangeKm: rangeData.rangeKm,
    rangeNm: rangeData.rangeNm,
    cruiseMach: aero.cruiseMach,
    cruiseSpeedKmh: aero.cruiseSpeedKmh,
    serviceCeilingFeet: geom.length > 50 ? 43000 : 39000,
    takeoffFieldLengthMeters: runway.toflMeters,
    landingFieldLengthMeters: runway.lflMeters,
    liftToDragRatioCruise: aero.liftToDragCruise,
    fuelBurnKgPerSeat1000Km: rangeData.fuelBurnPerSeat1000Km,
    directOperatingCostPerSeatKm: econ.docPerSeatKm,
    noiseEPNdB: econ.noiseEPNdB,
    co2GramsPerPaxKm: rangeData.co2GramsPerPaxKm,
    turnaroundTimeMinutes: econ.turnaroundMins,
    passengerComfortScore: econ.comfortScore,
    airlineAppealScore,
    designAppealScore: visualProportionsScore
  };
  
  return {
    mass,
    perf,
    unitCost: costs.estimatedUnitCost,
    listPrice: costs.suggestedListPrice,
    rdCost: costs.developmentCostMUSD
  };
}
