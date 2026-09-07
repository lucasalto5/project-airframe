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
 * Periodically generate new airline RFPs (Requests for Proposals)
 */
export function generatePotentialAirlineRFP(
  airlines: AirlineCustomer[],
  currentDate: GameDate,
  existingOpenRfps: RFPProposal[],
  _playerTrustLevel: string,
  macroPassengerDemand: number,
  rng: SeededRNG
): RFPProposal | null {
  if (existingOpenRfps.filter(r => r.status === 'open' || r.status === 'bid_submitted').length >= 4) {
    return null;
  }

  const chance = 0.28 * (macroPassengerDemand / 100);
  if (!rng.nextBool(chance)) return null;

  const airline = rng.pick(airlines);
  const segment = rng.pick(MARKET_SEGMENTS_DATA);

  let quantityFirm = rng.nextInt(6, 24);
  if (airline.businessModel === 'ultra_low_cost' || airline.businessModel === 'legacy') {
    quantityFirm = rng.nextInt(15, 60);
  }
  if (airline.activeFleetCount < 50) {
    quantityFirm = rng.nextInt(4, 12);
  }

  const quantityOptions = Math.round(quantityFirm * rng.nextRange(0.2, 0.6));
  const desiredDeliveryYear = currentDate.year + rng.nextInt(2, 5);

  const expiryDate: GameDate = {
    ...currentDate,
    month: currentDate.month + 3 > 12 ? (currentDate.month + 3 - 12) : currentDate.month + 3,
    year: currentDate.month + 3 > 12 ? currentDate.year + 1 : currentDate.year,
    totalDays: currentDate.totalDays + 90
  };

  const weights = {
    fuelEconomy: airline.businessModel === 'ultra_low_cost' ? 0.35 : 0.25,
    acquisitionPrice: airline.businessModel === 'ultra_low_cost' ? 0.30 : 0.20,
    deliverySpeed: airline.growthStrategy === 'rapid_expansion' ? 0.25 : 0.15,
    passengerComfort: airline.businessModel === 'legacy' ? 0.25 : 0.10,
    manufacturerTrust: airline.riskTolerance === 'very_conservative' ? 0.35 : 0.15,
    fleetCommonality: 0.10
  };

  return {
    id: `rfp_${currentDate.year}_${rng.nextInt(1000, 9999)}`,
    airlineId: airline.id,
    issuanceDate: { ...currentDate },
    expiryDate,
    title: `${airline.name} Fleet Renewal RFP: ${segment.name}`,
    requestedSegment: segment.id,
    targetSeatsMin: segment.seatRange[0],
    targetSeatsMax: segment.seatRange[1],
    targetRangeKm: segment.typicalRangeKm[0],
    quantityFirm,
    quantityOptions,
    desiredFirstDeliveryYear: desiredDeliveryYear,
    maxAcceptableUnitPrice: segment.averagePriceMillionsUSD * 1.15,
    importanceWeights: weights,
    status: 'open'
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
  const priceScore = Math.max(0, Math.min(100, (1.25 - priceRatio) * 100));

  const fuelBurn = program.performance.fuelBurnKgPerSeat1000Km;
  const fuelScore = Math.max(0, Math.min(100, (30 - fuelBurn) * 6));

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
 * Evaluate an RFP when the airline makes its final decision
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
      const compScore = Math.min(95, comp.reputation * 0.4 + family.fuelBurnScore * 0.35 + rng.nextInt(15, 30));
      matchingCompetitorPlanes.push({
        comp,
        planeName: family.name,
        score: compScore,
        price: family.listPrice * 0.82
      });
    }
  }

  const bestCompetitor = matchingCompetitorPlanes.sort((a, b) => b.score - a.score)[0] || {
    comp: competitors[0],
    planeName: 'Titan 730',
    score: 65,
    price: rfp.maxAcceptableUnitPrice * 0.85
  };

  let playerWon = false;
  let playerScore = 0;

  if (rfp.playerBid && program) {
    playerScore = scoreContractProposal(rfp.playerBid, rfp, program, airline, playerTrustScore);
    if (playerScore > bestCompetitor.score) {
      playerWon = true;
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
      impactType: 'orders'
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
      impactType: 'industry'
    };

    return {
      status: 'lost_to_competitor',
      newsArticle
    };
  }
}
