// ============================================================================
// PROJECT AIRFRAME - AIRLINE RFP & CONTRACT NEGOTIATION ENGINE
// ============================================================================

import type {
  RFPProposal,
  ContractProposal,
  FirmOrderContract,
  AirlineCustomer,
  AircraftProgram,
  CompetitorManufacturer,
  GameDate,
  NewsArticle
} from '../types';
import { MARKET_SEGMENTS_DATA } from '../data/marketSegments';
import { SeededRNG } from './rng';

/**
 * Check compatibility between an aircraft program and an airline RFP
 */
export function checkAircraftRfpCompatibility(
  program: AircraftProgram,
  rfp: RFPProposal
): {
  rating: 'excellent' | 'good' | 'marginal' | 'incompatible';
  seatFit: 'ideal' | 'acceptable' | 'too_small' | 'too_large';
  rangeFit: 'adequate' | 'excessive' | 'insufficient';
  reasons: string[];
} {
  const seats = program.geometry.typicalSeats;
  const range = program.performance.rangeKm;
  const reasons: string[] = [];

  let seatFit: 'ideal' | 'acceptable' | 'too_small' | 'too_large' = 'ideal';
  if (seats < rfp.targetSeatsMin * 0.8) {
    seatFit = 'too_small';
    reasons.push(`Seat count (${seats}) is significantly lower than requested minimum (${rfp.targetSeatsMin})`);
  } else if (seats > rfp.targetSeatsMax * 1.25) {
    seatFit = 'too_large';
    reasons.push(`Seat count (${seats}) exceeds requested maximum capacity (${rfp.targetSeatsMax})`);
  } else if (seats < rfp.targetSeatsMin || seats > rfp.targetSeatsMax) {
    seatFit = 'acceptable';
  }

  let rangeFit: 'adequate' | 'excessive' | 'insufficient' = 'adequate';
  if (range < rfp.targetRangeKm * 0.88) {
    rangeFit = 'insufficient';
    reasons.push(`Range (${Math.round(range)} km) is insufficient for requested route network (${rfp.targetRangeKm} km)`);
  } else if (range > rfp.targetRangeKm * 1.6) {
    rangeFit = 'excessive';
  }

  let rating: 'excellent' | 'good' | 'marginal' | 'incompatible' = 'good';
  if (seatFit === 'too_small' || seatFit === 'too_large' || rangeFit === 'insufficient') {
    rating = 'incompatible';
  } else if (seatFit === 'ideal' && rangeFit === 'adequate') {
    rating = 'excellent';
  } else if (seatFit === 'acceptable' || rangeFit === 'excessive') {
    rating = 'marginal';
  }

  return { rating, seatFit, rangeFit, reasons };
}

/**
 * Periodically generate new airline RFPs (Requests for Proposals)
 */
export function generatePotentialAirlineRFP(
  airlines: AirlineCustomer[],
  currentDate: GameDate,
  existingOpenRfps: RFPProposal[],
  playerTrustLevel: string,
  macroPassengerDemand: number,
  rng: SeededRNG
): RFPProposal | null {
  const activeTenders = existingOpenRfps.filter(
    r => r.status === 'open' || r.status === 'bid_submitted' || r.status === 'under_review'
  );
  if (activeTenders.length >= 4) {
    return null;
  }

  const chance = 0.25 * (macroPassengerDemand / 100);
  if (!rng.nextBool(chance)) return null;

  // Emerging manufacturers get smaller / regional early adopter opportunities
  let candidateAirlines = airlines;
  if (playerTrustLevel === 'unknown' || playerTrustLevel === 'experimental' || playerTrustLevel === 'emerging') {
    candidateAirlines = airlines.filter(
      a => a.businessModel === 'regional' || a.businessModel === 'low_cost' || a.riskTolerance === 'innovative' || a.activeFleetCount < 80
    );
    if (candidateAirlines.length === 0) candidateAirlines = airlines;
  }

  const airline = rng.pick(candidateAirlines);
  const segment = rng.pick(MARKET_SEGMENTS_DATA);

  let quantityFirm = rng.nextInt(4, 12);
  if (airline.businessModel === 'ultra_low_cost' || airline.businessModel === 'legacy') {
    quantityFirm = rng.nextInt(12, 36);
  }
  if (airline.activeFleetCount < 40) {
    quantityFirm = rng.nextInt(2, 8);
  }

  const quantityOptions = Math.round(quantityFirm * rng.nextRange(0.25, 0.5));
  const desiredDeliveryYear = currentDate.year + rng.nextInt(2, 4);

  const expiryDays = rng.nextInt(60, 90);
  const expiryTotalDays = currentDate.totalDays + expiryDays;
  const expiryDate: GameDate = {
    day: (currentDate.day + expiryDays) % 28 + 1,
    month: Math.min(12, ((currentDate.month + Math.floor(expiryDays / 30) - 1) % 12) + 1),
    year: currentDate.year + Math.floor((currentDate.month + Math.floor(expiryDays / 30) - 1) / 12),
    quarter: (Math.floor(Math.min(12, ((currentDate.month + Math.floor(expiryDays / 30) - 1) % 12) + 1) / 3) + 1) as 1 | 2 | 3 | 4,
    totalDays: expiryTotalDays
  };

  const weights = {
    fuelEconomy: airline.businessModel === 'ultra_low_cost' ? 0.35 : 0.25,
    acquisitionPrice: airline.businessModel === 'ultra_low_cost' ? 0.30 : 0.20,
    deliverySpeed: airline.growthStrategy === 'rapid_expansion' ? 0.25 : 0.15,
    passengerComfort: airline.businessModel === 'legacy' ? 0.25 : 0.10,
    manufacturerTrust: airline.riskTolerance === 'very_conservative' ? 0.35 : 0.12,
    fleetCommonality: 0.10
  };

  return {
    id: `rfp_${currentDate.year}_${rng.nextInt(1000, 9999)}`,
    airlineId: airline.id,
    issuanceDate: { ...currentDate },
    expiryDate,
    titleKey: 'rfp.fleetRenewalTitle',
    titleParams: { airline: airline.name, segment: segment.name },
    requestedSegment: segment.id,
    targetSeatsMin: segment.seatRange[0],
    targetSeatsMax: segment.seatRange[1],
    targetRangeKm: segment.typicalRangeKm[0],
    quantityFirm,
    quantityOptions,
    desiredFirstDeliveryYear: desiredDeliveryYear,
    maxAcceptableUnitPrice: segment.averagePriceMillionsUSD * 1.12,
    importanceWeights: weights,
    status: 'open',
    reviewDaysRemaining: 0
  };
}

/**
 * Score a proposal from 0 to 100 based on airline weights
 */
export function scoreContractProposal(
  proposal: ContractProposal,
  rfp: RFPProposal,
  program: AircraftProgram,
  _airline: AirlineCustomer,
  trustScoreValue: number
): number {
  const w = rfp.importanceWeights;

  const priceRatio = proposal.offeredUnitPrice / rfp.maxAcceptableUnitPrice;
  const priceScore = Math.max(0, Math.min(100, (1.20 - priceRatio) * 120));

  const fuelBurn = program.performance.fuelBurnKgPerSeat1000Km;
  const fuelScore = Math.max(0, Math.min(100, (28 - fuelBurn) * 7.5));

  const comfortScore = program.performance.passengerComfortScore;

  const deliveryYear = proposal.deliveryStartQuarter.year;
  const deliveryDelta = deliveryYear - rfp.desiredFirstDeliveryYear;
  const deliveryScore = Math.max(0, Math.min(100, 100 - Math.max(0, deliveryDelta) * 25));

  const trustScore = trustScoreValue;

  let supportBonus = 0;
  if (proposal.supportPackageIncluded === 'standard_turnkey') supportBonus = 5;
  if (proposal.supportPackageIncluded === 'comprehensive_fleet_care') supportBonus = 10;

  let guaranteeBonus = 0;
  if (proposal.performanceGuarantees.fuelBurnWarranty) guaranteeBonus += 4;
  if (proposal.performanceGuarantees.dispatchReliabilityWarranty) guaranteeBonus += 4;

  const totalScore =
    priceScore * w.acquisitionPrice +
    fuelScore * w.fuelEconomy +
    comfortScore * w.passengerComfort +
    deliveryScore * w.deliverySpeed +
    trustScore * w.manufacturerTrust +
    supportBonus +
    guaranteeBonus;

  return Math.min(100, Math.max(0, Math.round(totalScore)));
}

/**
 * Evaluate an RFP when the airline makes its final decision autonomously
 */
export function evaluateRfpDecision(
  rfp: RFPProposal,
  program: AircraftProgram | undefined,
  competitors: CompetitorManufacturer[],
  airline: AirlineCustomer,
  playerTrustScore: number,
  currentDate: GameDate,
  rng: SeededRNG
): { status: 'won_by_player' | 'lost_to_competitor'; firmContract?: FirmOrderContract; newsArticle: NewsArticle } {
  const matchingCompetitorPlanes: { comp: CompetitorManufacturer; planeName: string; score: number; price: number }[] = [];

  for (const comp of competitors) {
    const family = comp.activeAircraftFamilies.find(f => f.segment === rfp.requestedSegment);
    if (family) {
      const compScore = Math.min(95, comp.reputation * 0.35 + family.fuelBurnScore * 0.35 + rng.nextInt(10, 25));
      matchingCompetitorPlanes.push({
        comp,
        planeName: family.name,
        score: compScore,
        price: family.listPrice * 0.84
      });
    }
  }

  const bestCompetitor = matchingCompetitorPlanes.sort((a, b) => b.score - a.score)[0] || {
    comp: competitors[0],
    planeName: 'Competitor Model',
    score: 62,
    price: rfp.maxAcceptableUnitPrice * 0.88
  };

  let playerWon = false;
  let playerScore = 0;

  if (rfp.playerBid && program) {
    const compat = checkAircraftRfpCompatibility(program, rfp);
    if (compat.rating !== 'incompatible') {
      playerScore = scoreContractProposal(rfp.playerBid, rfp, program, airline, playerTrustScore);
      if (playerScore >= bestCompetitor.score) {
        playerWon = true;
      }
    }
  }

  if (playerWon && rfp.playerBid && program) {
    const totalContractValue = rfp.playerBid.offeredUnitPrice * rfp.playerBid.quantityFirm;
    const downPayment = totalContractValue * 0.15;

    const deliverySchedule: FirmOrderContract['deliverySchedule'] = [];
    let remaining = rfp.playerBid.quantityFirm;
    let schedYear = rfp.playerBid.deliveryStartQuarter.year;
    let schedQuarter = rfp.playerBid.deliveryStartQuarter.quarter;

    while (remaining > 0) {
      const batch = Math.min(remaining, Math.ceil(rfp.playerBid.deliverySlotsPerYear / 4));
      deliverySchedule.push({
        year: schedYear,
        quarter: schedQuarter,
        quantity: batch,
        deliveredCount: 0
      });
      remaining -= batch;
      schedQuarter++;
      if (schedQuarter > 4) {
        schedQuarter = 1;
        schedYear++;
      }
    }

    const firmContract: FirmOrderContract = {
      id: `cnt_${currentDate.year}_${rng.nextInt(1000, 9999)}`,
      rfpId: rfp.id,
      airlineId: airline.id,
      programId: program.id,
      signedDate: { ...currentDate },
      quantityFirm: rfp.playerBid.quantityFirm,
      quantityOptions: rfp.playerBid.quantityOptions,
      unitNegotiatedPrice: rfp.playerBid.offeredUnitPrice,
      totalContractValue,
      downPaymentReceived: downPayment,
      deliverySchedule,
      status: 'active'
    };

    const newsArticle: NewsArticle = {
      id: `news_order_${firmContract.id}`,
      publishedDate: { ...currentDate },
      category: 'commercial',
      headline: `${airline.name} Selects ${program.name} in Major $${(totalContractValue / 1000).toFixed(2)}B Deal`,
      source: 'Aviation Week Global Dispatch',
      summary: `${airline.name} has officially awarded its ${rfp.requestedSegment.replace(/_/g, ' ')} tender to the ${program.name}, placing a firm order for ${rfp.playerBid.quantityFirm} aircraft plus ${rfp.playerBid.quantityOptions} options.`,
      impactSubjectId: program.id,
      impactType: 'orders',
      templateId: 'news.templates.rfpWon',
      templateParams: {
        airline: airline.name,
        aircraft: program.name,
        quantity: rfp.playerBid.quantityFirm,
        valueB: (totalContractValue / 1000).toFixed(2)
      }
    };

    return {
      status: 'won_by_player',
      firmContract,
      newsArticle
    };
  } else {
    const newsArticle: NewsArticle = {
      id: `news_lost_${rfp.id}`,
      publishedDate: { ...currentDate },
      category: 'commercial',
      headline: `${airline.name} Awards Fleet Tender to ${bestCompetitor.comp.name}`,
      source: 'FlightGlobal Market Intelligence',
      summary: `${airline.name} has finalized a purchasing agreement with ${bestCompetitor.comp.name} for ${rfp.quantityFirm} units of the ${bestCompetitor.planeName}.`,
      impactSubjectId: rfp.id,
      impactType: 'industry',
      templateId: 'news.templates.rfpLost',
      templateParams: {
        airline: airline.name,
        competitor: bestCompetitor.comp.name,
        quantity: rfp.quantityFirm,
        planeName: bestCompetitor.planeName
      }
    };

    return {
      status: 'lost_to_competitor',
      newsArticle
    };
  }
}
