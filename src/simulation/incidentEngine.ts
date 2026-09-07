// ============================================================================
// PROJECT AIRFRAME - IN-SERVICE RELIABILITY & ACCIDENT INVESTIGATION ENGINE
// ============================================================================

import type {
  AircraftIncident,
  IncidentSeverity,
  SerializedAircraftInService,
  AircraftProgram,
  GameDate,
  NewsArticle
} from '../types';
import { SeededRNG } from './rng';

/**
 * Calculate in-service dispatch reliability based on fleet age, maturity, tech debt, and maintenance
 */
export function calculateFleetDispatchReliability(
  program: AircraftProgram,
  totalFleetHours: number
): { dispatchReliability: number; aogRatePerThousandHours: number } {
  const matureHoursThreshold = 80000;
  const maturityFactor = Math.min(1.0, Math.max(0.75, 0.75 + (totalFleetHours / matureHoursThreshold) * 0.25));
  const techDebtPenalty = (program.accumulatedTechDebt / 100) * 0.015;

  const target = (program.dispatchReliabilityMaturePercent || 99.4) / 100;
  const currentReliability = parseFloat(((target * maturityFactor - techDebtPenalty) * 100).toFixed(2));
  const aogRate = parseFloat(((100 - currentReliability) * 1.8).toFixed(1));

  return {
    dispatchReliability: Math.min(99.8, Math.max(94.0, currentReliability)),
    aogRatePerThousandHours: Math.max(0.5, aogRate)
  };
}

/**
 * Check if a random in-service incident should occur based on causal failure probabilities
 */
export function checkForInServiceIncident(
  activeAircraft: SerializedAircraftInService,
  program: AircraftProgram,
  currentDate: GameDate,
  rng: SeededRNG
): AircraftIncident | null {
  let dailyIncidentProbability = 0.00012;
  dailyIncidentProbability += (program.accumulatedTechDebt / 100) * 0.00035;

  if (!rng.nextBool(dailyIncidentProbability)) {
    return null;
  }

  const severityRoll = rng.nextFloat();
  let severity: IncidentSeverity = 'technical_diversion';
  let fatalities = 0;
  let injuries = 0;

  if (severityRoll < 0.65) {
    severity = 'technical_diversion';
  } else if (severityRoll < 0.85) {
    severity = 'engine_shutdown_in_flight';
  } else if (severityRoll < 0.94) {
    severity = 'hydraulic_loss';
  } else if (severityRoll < 0.98) {
    severity = 'hard_landing';
    injuries = rng.nextInt(0, 4);
  } else if (severityRoll < 0.995) {
    severity = 'runway_excursion';
    injuries = rng.nextInt(2, 12);
  } else {
    severity = 'uncontained_engine_failure';
    injuries = rng.nextInt(5, 25);
  }

  const weatherRoll = rng.pick<AircraftIncident['weatherConditions']>([
    'clear', 'turbulence', 'severe_icing', 'crosswind_gusts', 'thunderstorm'
  ]);

  const originIata = activeAircraft.assignedFlight?.originIata || 'ORD';
  const destIata = activeAircraft.assignedFlight?.destinationIata || 'JFK';

  const incidentId = `inc_${currentDate.year}_${rng.nextInt(1000, 9999)}`;

  return {
    id: incidentId,
    aircraftSerialNumber: activeAircraft.serialNumber,
    programId: activeAircraft.programId,
    airlineId: activeAircraft.airlineId,
    occurredDate: { ...currentDate },
    severity,
    flightRoute: { originIata, destinationIata: destIata },
    altitudeFeet: activeAircraft.assignedFlight?.currentAltitudeFeet || 31000,
    weatherConditions: weatherRoll,
    casualties: {
      fatalities,
      injuries,
      passengersOnboard: program.geometry.typicalSeats
    },
    investigation: {
      phase: 'initial_response',
      daysInvestigating: 0,
      blackBoxRecovered: false,
      publicBlameOnPlayerScore: 0
    }
  };
}

/**
 * Advance ongoing aviation accident investigations
 */
export function advanceIncidentInvestigations(
  incidents: AircraftIncident[],
  deltaTimeDays: number,
  currentDate: GameDate,
  rng: SeededRNG
): { updatedIncidents: AircraftIncident[]; generatedNews: NewsArticle[] } {
  const generatedNews: NewsArticle[] = [];

  const updatedIncidents = incidents.map(incident => {
    const inv = incident.investigation;
    if (inv.phase === 'final_report_closed') return incident;

    inv.daysInvestigating += deltaTimeDays;

    if (inv.phase === 'initial_response' && inv.daysInvestigating >= 7) {
      inv.phase = 'evidence_collection';
      inv.blackBoxRecovered = true;
      generatedNews.push({
        id: `news_inv_${incident.id}_box`,
        publishedDate: { ...currentDate },
        category: 'safety',
        headline: `FDR & CVR Black Boxes Recovered from ${incident.aircraftSerialNumber}`,
        source: 'Aviation Safety Regulatory Bureau',
        summary: `Investigators have successfully secured flight telemetry and cockpit audio recorders from the recent ${incident.severity.replace(/_/g, ' ')} incident.`,
        impactSubjectId: incident.programId,
        impactType: 'reputation'
      });
    } else if (inv.phase === 'evidence_collection' && inv.daysInvestigating >= 30) {
      inv.phase = 'preliminary_findings';
      const causes: AircraftIncident['investigation']['rootCauseCategory'][] = [
        'operator_maintenance', 'pilot_error', 'severe_weather', 'supplier_defect', 'design_flaw'
      ];
      inv.rootCauseCategory = rng.pick(causes);

      if (inv.rootCauseCategory === 'design_flaw') {
        inv.publicBlameOnPlayerScore = 85;
        inv.rootCauseDescription = 'Aerodynamic flutter interaction with FBW actuator servo latency under rapid gust reversals.';
        inv.airworthinessDirectiveIssued = {
          title: 'AD 2026-08-01: Mandatory Flight Envelope Control Law Firmware Patch',
          mandatoryAction: 'software_patch',
          estimatedFleetCost: 12.5,
          complianceDeadlineDays: 45
        };
      } else if (inv.rootCauseCategory === 'supplier_defect') {
        inv.publicBlameOnPlayerScore = 40;
        inv.rootCauseDescription = 'Micro-fracture detected in forged titanium landing gear trunnion pin supplied by third-party vendor.';
        inv.airworthinessDirectiveIssued = {
          title: 'AD 2026-08-04: Ultrasonic Inspection of Main Landing Gear Trunnions',
          mandatoryAction: 'inspect_within_10_days',
          estimatedFleetCost: 4.8,
          complianceDeadlineDays: 20
        };
      } else {
        inv.publicBlameOnPlayerScore = 10;
        inv.rootCauseDescription = 'Operational factor: Airline maintenance crew skipped prescribed torque check during C-check inspection.';
      }

      generatedNews.push({
        id: `news_inv_${incident.id}_prelim`,
        publishedDate: { ...currentDate },
        category: 'safety',
        headline: `Preliminary Safety Findings Released on Flight Incident`,
        source: 'Civil Aviation Safety Board',
        summary: `Preliminary analysis points to: ${inv.rootCauseDescription || 'operational factors'}. Airworthiness directives issued.`,
        impactSubjectId: incident.programId,
        impactType: 'stock'
      });
    } else if (inv.phase === 'preliminary_findings' && inv.daysInvestigating >= 90) {
      inv.phase = 'technical_analysis';
    } else if (inv.phase === 'technical_analysis' && inv.daysInvestigating >= 180) {
      inv.phase = 'probable_cause';
    } else if (inv.phase === 'probable_cause' && inv.daysInvestigating >= 270) {
      inv.phase = 'final_report_closed';
      generatedNews.push({
        id: `news_inv_${incident.id}_final`,
        publishedDate: { ...currentDate },
        category: 'safety',
        headline: `Investigation Formally Closed on ${incident.aircraftSerialNumber}`,
        source: 'Aviation Safety Regulatory Bureau',
        summary: `Final official report published. All corrective actions and mandatory compliance checks completed.`,
        impactSubjectId: incident.programId,
        impactType: 'reputation'
      });
    }

    return incident;
  });

  return {
    updatedIncidents,
    generatedNews
  };
}
