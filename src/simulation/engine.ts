// ============================================================================
// PROJECT AIRFRAME - MASTER SIMULATION ENGINE
// ============================================================================

import type {
  CompanyState,
  MacroEconomy,
  GameDate,
  CompetitorManufacturer,
  AirlineCustomer,
  AircraftProgram,
  AssemblyLine,
  SerializedAircraftInService,
  HistoricMilestone,
  NewsArticle
} from '../types';
import { SeededRNG } from './rng';
import { updateSimulatedFlights } from './flightSimulator';
import { checkForInServiceIncident, advanceIncidentInvestigations } from './incidentEngine';
import { generatePotentialAirlineRFP, evaluateRfpDecision } from './rfpEngine';
import { updateCompetitorNPCs } from './npcEngine';
import { TEST_SCENARIOS } from '../data/testCampaigns';

export const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/**
 * Base durations (in days) for each development phase for a clean-sheet commercial aircraft
 */
export const BASE_PHASE_DURATIONS_DAYS: Record<string, number> = {
  concept: 150,               // ~5 months
  preliminary_design: 210,    // ~7 months
  detailed_design: 420,       // ~14 months
  prototype_build: 270,       // ~9 months
  ground_testing: 180,        // ~6 months
  flight_testing: 480,        // ~16 months
  certification: 180,         // ~6 months
  production_ready: 240       // ~8 months
};

/**
 * Advance calendar date by 1 day
 */
export function advanceDateByOneDay(current: GameDate): { newDate: GameDate; isMonthEnd: boolean; isQuarterEnd: boolean; isYearEnd: boolean } {
  let day = current.day + 1;
  let month = current.month;
  let year = current.year;
  let totalDays = current.totalDays + 1;

  const maxDays = DAYS_IN_MONTH[month - 1] || 30;
  let isMonthEnd = false;
  let isQuarterEnd = false;
  let isYearEnd = false;

  if (day > maxDays) {
    day = 1;
    month++;
    isMonthEnd = true;

    if (month % 3 === 1) {
      isQuarterEnd = true;
    }

    if (month > 12) {
      month = 1;
      year++;
      isYearEnd = true;
    }
  }

  const quarter = (Math.floor((month - 1) / 3) + 1) as 1 | 2 | 3 | 4;

  return {
    newDate: { day, month, year, quarter, totalDays },
    isMonthEnd,
    isQuarterEnd,
    isYearEnd
  };
}

/**
 * Update macroeconomic state (daily drift & quarterly trends)
 */
export function updateMacroEconomy(economy: MacroEconomy, rng: SeededRNG, isMonthEnd: boolean): MacroEconomy {
  const updated = { ...economy };

  const fuelDrift = rng.nextGaussian(0, 0.005);
  updated.fuelPricePerGallon = parseFloat(Math.min(5.50, Math.max(1.80, updated.fuelPricePerGallon + fuelDrift)).toFixed(3));

  if (isMonthEnd) {
    const gdpDrift = rng.nextGaussian(0.15, 0.4);
    updated.gdpIndex = parseFloat(Math.max(70, Math.min(160, updated.gdpIndex + gdpDrift)).toFixed(1));
    updated.passengerTravelDemandIndex = parseFloat(Math.max(60, Math.min(180, 100 + (updated.gdpIndex - 100) * 1.4)).toFixed(1));
    updated.cargoDemandIndex = parseFloat(Math.max(60, Math.min(170, 100 + (updated.gdpIndex - 100) * 1.2)).toFixed(1));
    updated.businessConfidence = Math.min(100, Math.max(20, Math.round(50 + (updated.gdpIndex - 100) * 0.8)));
  }

  return updated;
}

/**
 * Advance R&D, Flight Test missions, and Program state machines
 */
export function advanceProgramsRnD(
  programs: AircraftProgram[],
  departments: CompanyState['departments'],
  currentDate: GameDate,
  rng: SeededRNG
): { updatedPrograms: AircraftProgram[]; news: NewsArticle[]; milestones: HistoricMilestone[] } {
  const news: NewsArticle[] = [];
  const milestones: HistoricMilestone[] = [];

  const engDept = departments.filter(d => d.category === 'engineering');
  const avgProductivity = engDept.length > 0 ? (engDept.reduce((acc, d) => acc + d.productivity, 0) / engDept.length) : 1.0;

  const updatedPrograms = programs.map(prog => {
    // 1. Advance Active Flight/Ground Test Missions
    const remainingMissions = [];
    for (const mission of prog.activeTestMissions) {
      mission.daysElapsed += 1;

      if (mission.daysElapsed >= mission.durationDays) {
        // Mission Completed!
        const scenarioDef = TEST_SCENARIOS.find(s => s.id === mission.scenarioId);
        
        // Credit flight hours & envelope
        prog.testCampaignsProgress.flightHoursLogged += mission.flightHoursExpected;
        prog.testCampaignsProgress.flightEnvelopeExpansionPercent = Math.min(
          100,
          prog.testCampaignsProgress.flightEnvelopeExpansionPercent + mission.envelopeGainExpected
        );

        // Update prototype stats
        const pt = prog.prototypesBuilt.find(p => p.id === mission.prototypeId);
        if (pt) {
          pt.flightHours += mission.flightHoursExpected;
          pt.cycles += 1;
          pt.status = 'flight_testing';
          pt.currentMissionId = undefined;
        }

        // Mark scenario completed
        if (!prog.completedScenarioIds.includes(mission.scenarioId)) {
          prog.completedScenarioIds.push(mission.scenarioId);
        }

        if (scenarioDef?.category === 'ground') {
          prog.groundTestsCompleted = Math.min(prog.groundTestsTotal, prog.groundTestsCompleted + 1);
        }

        // Check for deterministic anomalies
        if (scenarioDef && scenarioDef.potentialAnomalies.length > 0) {
          if (rng.nextBool(scenarioDef.riskFactor / 100)) {
            const anomalyDef = rng.pick(scenarioDef.potentialAnomalies);
            if (!prog.certificationFindings.some(f => f.id === anomalyDef.id)) {
              prog.certificationFindings.push({
                id: anomalyDef.id,
                programId: prog.id,
                titleKey: anomalyDef.titleKey,
                descKey: anomalyDef.descKey,
                severity: anomalyDef.severity,
                status: 'open',
                costToFix: anomalyDef.options[0]?.costMUSD || 5.0,
                daysToFix: anomalyDef.options[0]?.delayDays || 30
              });
              prog.testCampaignsProgress.anomaliesFound += 1;
            }
          }
        }
      } else {
        remainingMissions.push(mission);
      }
    }
    prog.activeTestMissions = remainingMissions;

    // 2. State Machine: Advance Development Phase
    if (prog.currentPhase === 'entry_into_service' || prog.currentPhase === 'mature_production' || prog.currentPhase === 'production_ended') {
      return prog;
    }

    const pressureMultiplier = prog.schedulePressure === 'crunch' ? 1.45 : (prog.schedulePressure === 'aggressive' ? 1.2 : 1.0);
    const baseDuration = BASE_PHASE_DURATIONS_DAYS[prog.currentPhase] || 180;
    prog.phaseEstimatedDurationDays = baseDuration;

    // Daily percentage based on realistic duration
    const dailyIncrement = (100 / baseDuration) * avgProductivity * pressureMultiplier * Math.min(2.0, Math.max(0.4, prog.allocatedHeadcount / 220));
    prog.phaseProgressPercent = Math.min(100, prog.phaseProgressPercent + dailyIncrement);
    prog.phaseElapsedDays += 1;

    // Crunch pressure tech debt risk
    if (prog.schedulePressure === 'crunch' && rng.nextBool(0.08)) {
      prog.accumulatedTechDebt = Math.min(100, prog.accumulatedTechDebt + 1);
    }

    // 3. Phase Gate Transitions
    if (prog.phaseProgressPercent >= 100) {
      if (prog.currentPhase === 'concept') {
        prog.currentPhase = 'preliminary_design';
        prog.phaseProgressPercent = 0;
        prog.phaseElapsedDays = 0;
      } else if (prog.currentPhase === 'preliminary_design') {
        prog.currentPhase = 'detailed_design';
        prog.phaseProgressPercent = 0;
        prog.phaseElapsedDays = 0;
      } else if (prog.currentPhase === 'detailed_design') {
        prog.currentPhase = 'prototype_build';
        prog.phaseProgressPercent = 0;
        prog.phaseElapsedDays = 0;
        if (prog.prototypesBuilt.length === 0) {
          prog.prototypesBuilt.push({
            id: `pt_${prog.id}_001`,
            programId: prog.id,
            serialNumber: 'PT-001',
            name: `${prog.name} Flight Test Article 1`,
            primaryRole: 'aerodynamics_envelope',
            status: 'under_construction',
            flightHours: 0,
            cycles: 0,
            completionPercent: 10,
            assignedLocationAirportId: 'ORD'
          });
        }
      } else if (prog.currentPhase === 'prototype_build') {
        // Prototype build progression
        const leadPt = prog.prototypesBuilt[0];
        if (leadPt) {
          leadPt.completionPercent = Math.min(100, leadPt.completionPercent + 3.5);
          if (leadPt.completionPercent >= 100) {
            leadPt.status = 'ground_testing';
            prog.currentPhase = 'ground_testing';
            prog.phaseProgressPercent = 0;
            prog.phaseElapsedDays = 0;
          }
        }
      } else if (prog.currentPhase === 'ground_testing') {
        // Gate: Requires minimum 4 ground test campaigns completed
        if (prog.groundTestsCompleted >= 4) {
          prog.currentPhase = 'flight_testing';
          prog.phaseProgressPercent = 0;
          prog.phaseElapsedDays = 0;
          prog.prototypesBuilt.forEach(pt => {
            if (pt.status === 'ground_testing') pt.status = 'flight_testing';
          });
          prog.scheduleMilestones.actualFirstFlight = { ...currentDate };

          news.push({
            id: `news_maiden_${prog.id}_${currentDate.year}`,
            publishedDate: { ...currentDate },
            category: 'engineering',
            headline: `Maiden Flight Achieved: ${prog.name} Takes to the Skies`,
            source: 'Aviation Week & Space Intelligence',
            summary: `The flagship prototype of the ${prog.name} completed its historic maiden flight today, beginning its formal flight test certification campaign.`,
            impactSubjectId: prog.id,
            impactType: 'reputation',
            templateId: 'news.templates.maidenFlight',
            templateParams: { aircraft: prog.name }
          });

          milestones.push({
            id: `ms_maiden_${prog.id}`,
            achievedDate: { ...currentDate },
            title: `Maiden Flight: ${prog.name}`,
            description: `Successfully achieved first flight of the ${prog.name} test prototype.`,
            iconName: 'PlaneTakeoff',
            rewardReputation: 15
          });
        }
      } else if (prog.currentPhase === 'flight_testing') {
        const hasBlockers = prog.certificationFindings.some(f => f.severity === 'airworthiness_blocker' && f.status !== 'verified_resolved');
        const mandatoryScenariosDone = TEST_SCENARIOS.filter(s => s.category === 'flight' && s.isMandatoryForCert).every(s => prog.completedScenarioIds.includes(s.id));

        if (prog.testCampaignsProgress.flightHoursLogged >= 1800 && prog.testCampaignsProgress.flightEnvelopeExpansionPercent >= 95 && !hasBlockers && mandatoryScenariosDone) {
          prog.currentPhase = 'certification';
          prog.phaseProgressPercent = 0;
          prog.phaseElapsedDays = 0;
        }
      } else if (prog.currentPhase === 'certification') {
        const hasOpenFindings = prog.certificationFindings.some(f => f.severity === 'airworthiness_blocker' && f.status !== 'verified_resolved');
        if (!hasOpenFindings) {
          prog.currentPhase = 'production_ready';
          prog.typeCertificateIssued = true;
          prog.productionCertificateIssued = true;
          prog.scheduleMilestones.actualCertification = { ...currentDate };

          news.push({
            id: `news_cert_${prog.id}_${currentDate.year}`,
            publishedDate: { ...currentDate },
            category: 'commercial',
            headline: `Type Certification Granted for ${prog.name}`,
            source: 'Civil Aviation Regulatory Authority',
            summary: `The ${prog.name} has officially received full commercial Type Certification, validating compliance with all airworthiness and safety standards.`,
            impactSubjectId: prog.id,
            impactType: 'reputation',
            templateId: 'news.templates.certificationGranted',
            templateParams: { aircraft: prog.name }
          });

          milestones.push({
            id: `ms_cert_${prog.id}`,
            achievedDate: { ...currentDate },
            title: `Type Certification: ${prog.name}`,
            description: `Received official Type Certificate from civil aviation authorities.`,
            iconName: 'Award',
            rewardReputation: 25
          });
        }
      }
    }

    return prog;
  });

  return {
    updatedPrograms,
    news,
    milestones
  };
}

/**
 * Advance 2D Assembly Line stations and aircraft deliveries
 */
export function advanceAssemblyLines(
  assemblyLines: AssemblyLine[],
  programs: AircraftProgram[],
  contracts: CompanyState['firmContracts'],
  _activeFleet: SerializedAircraftInService[],
  currentDate: GameDate,
  rng: SeededRNG
): {
  updatedLines: AssemblyLine[];
  updatedContracts: CompanyState['firmContracts'];
  newDeliveries: SerializedAircraftInService[];
  deliveryRevenueMUSD: number;
  newsArticles: NewsArticle[];
  milestones: HistoricMilestone[];
} {
  const newDeliveries: SerializedAircraftInService[] = [];
  let deliveryRevenueMUSD = 0;
  const newsArticles: NewsArticle[] = [];
  const milestones: HistoricMilestone[] = [];

  const updatedLines = assemblyLines.map(line => {
    const prog = programs.find(p => p.id === line.programId);
    if (!prog) return line;

    // Tooling Phase progression
    if (line.status === 'tooling_in_progress') {
      line.toolingDaysRemaining = Math.max(0, line.toolingDaysRemaining - 1);
      if (line.toolingDaysRemaining === 0) {
        line.status = 'ready_for_production';
      }
      return line;
    }

    // Line is ready or active: takt time advance (e.g. rate 3/mo = 10% station progress per day = 10 days/station)
    const stationDailyAdvance = (line.currentMonthlyRateTarget * 100) / 30;

    line.activeUnitsOnLine = line.activeUnitsOnLine.filter(unit => {
      unit.stationProgressPercent += stationDailyAdvance;

      if (unit.stationProgressPercent >= 100) {
        unit.stationProgressPercent = 0;
        unit.currentStationIndex++;

        // Station 7 completed -> Delivery to Customer!
        if (unit.currentStationIndex > 7) {
          const contract = contracts.find(c => c.id === unit.contractId);
          const unitPrice = contract ? contract.unitNegotiatedPrice : prog.listPrice;
          
          // 85% remaining contract balance paid on delivery
          deliveryRevenueMUSD += unitPrice * 0.85;
          prog.totalDeliveriesCount++;
          prog.activeInServiceCount++;
          prog.ordersBacklogCount = Math.max(0, prog.ordersBacklogCount - 1);

          const deliveredPlane: SerializedAircraftInService = {
            serialNumber: unit.serialNumber,
            programId: unit.programId,
            airlineId: unit.customerAirlineId,
            deliveryDate: { ...currentDate },
            registration: `N${rng.nextInt(100, 999)}AF`,
            accumulatedFlightHours: 0,
            accumulatedCycles: 0,
            currentDispatchReliability: 99.5,
            currentLocationAirportIata: 'ORD'
          };

          newDeliveries.push(deliveredPlane);

          if (contract) {
            const schedItem = contract.deliverySchedule.find(s => s.deliveredCount < s.quantity);
            if (schedItem) schedItem.deliveredCount++;
          }

          // First delivery milestone and transition to Entry into Service!
          if (prog.totalDeliveriesCount === 1) {
            prog.currentPhase = 'entry_into_service';
            prog.actualEisDate = { ...currentDate };
            prog.scheduleMilestones.actualEis = { ...currentDate };

            newsArticles.push({
              id: `news_first_del_${prog.id}`,
              publishedDate: { ...currentDate },
              category: 'commercial',
              headline: `First Commercial Delivery of ${prog.name} Handed Over`,
              source: 'FlightGlobal Aerospace Delivery Wire',
              summary: `The very first production ${prog.name} (${unit.serialNumber}) has been delivered to launch customer ${unit.customerAirlineId}.`,
              impactSubjectId: prog.id,
              impactType: 'orders',
              templateId: 'news.templates.firstDelivery',
              templateParams: {
                aircraft: prog.name,
                msn: unit.serialNumber,
                customer: unit.customerAirlineId
              }
            });

            milestones.push({
              id: `ms_first_delivery_${prog.id}`,
              achievedDate: { ...currentDate },
              title: `First Delivery: ${prog.name}`,
              description: `Handed over the first customer airliner into operational service.`,
              iconName: 'CheckCircle2',
              rewardReputation: 20
            });
          }

          return false;
        }
      }
      return true;
    });

    // Spawn new units from active firm contracts if station 0 is free
    const activeContract = contracts.find(c => c.programId === line.programId && c.status === 'active');
    const isStation0Free = !line.activeUnitsOnLine.some(u => u.currentStationIndex === 0);

    if (activeContract && isStation0Free && line.activeUnitsOnLine.length < 8) {
      const nextMsn = `MSN-${String(prog.totalDeliveriesCount + line.activeUnitsOnLine.length + 1).padStart(3, '0')}`;
      line.activeUnitsOnLine.push({
        serialNumber: nextMsn,
        programId: line.programId,
        customerAirlineId: activeContract.airlineId,
        contractId: activeContract.id,
        currentStationIndex: 0,
        stationProgressPercent: 0,
        qualityDefectsCount: 0,
        startedDate: { ...currentDate },
        estimatedDeliveryDate: {
          ...currentDate,
          month: (currentDate.month + 3) > 12 ? (currentDate.month + 3 - 12) : currentDate.month + 3,
          year: (currentDate.month + 3) > 12 ? currentDate.year + 1 : currentDate.year
        }
      });
      line.status = 'active_producing';
    }

    return line;
  });

  return {
    updatedLines,
    updatedContracts: contracts,
    newDeliveries,
    deliveryRevenueMUSD,
    newsArticles,
    milestones
  };
}

/**
 * Advance autonomous airline reviews on submitted RFPs
 */
export function advanceRfpReviews(
  rfps: CompanyState['rfpProposals'],
  programs: AircraftProgram[],
  competitors: CompetitorManufacturer[],
  airlines: AirlineCustomer[],
  companyReputation: number,
  currentDate: GameDate,
  rng: SeededRNG
): {
  updatedRfps: CompanyState['rfpProposals'];
  newContracts: CompanyState['firmContracts'];
  newsArticles: NewsArticle[];
  downPaymentMUSD: number;
} {
  const newContracts: CompanyState['firmContracts'] = [];
  const newsArticles: NewsArticle[] = [];
  let downPaymentMUSD = 0;

  const updatedRfps = rfps.map(rfp => {
    if (rfp.status === 'under_review' || rfp.status === 'bid_submitted') {
      rfp.reviewDaysRemaining = Math.max(0, (rfp.reviewDaysRemaining || 14) - 1);

      if (rfp.reviewDaysRemaining === 0) {
        const airline = airlines.find(a => a.id === rfp.airlineId) || airlines[0];
        const program = programs.find(p => p.id === rfp.playerBid?.programId) || programs[0];

        const decision = evaluateRfpDecision(
          rfp,
          program,
          competitors,
          airline,
          companyReputation,
          currentDate,
          rng
        );

        rfp.status = decision.status;
        if (decision.firmContract) {
          newContracts.push(decision.firmContract);
          downPaymentMUSD += decision.firmContract.downPaymentReceived;
          if (program) {
            program.ordersBacklogCount += decision.firmContract.quantityFirm;
          }
        }
        newsArticles.push(decision.newsArticle);
      }
    }
    return rfp;
  });

  return {
    updatedRfps,
    newContracts,
    newsArticles,
    downPaymentMUSD
  };
}

/**
 * Execute master daily simulation tick
 */
export function executeDailySimulationTick(
  currentCompany: CompanyState,
  macroEconomy: MacroEconomy,
  currentDate: GameDate,
  competitors: CompetitorManufacturer[],
  airlines: AirlineCustomer[],
  rng: SeededRNG
): {
  updatedCompany: CompanyState;
  updatedEconomy: MacroEconomy;
  updatedDate: GameDate;
  updatedCompetitors: CompetitorManufacturer[];
  updatedAirlines: AirlineCustomer[];
  isMonthEnd: boolean;
} {
  const { newDate, isMonthEnd } = advanceDateByOneDay(currentDate);

  const updatedEconomy = updateMacroEconomy(macroEconomy, rng, isMonthEnd);

  // 1. Advance R&D & Test campaigns
  const { updatedPrograms, news: rndNews, milestones: rndMilestones } = advanceProgramsRnD(
    currentCompany.programs,
    currentCompany.departments,
    newDate,
    rng
  );

  // 2. Advance Assembly Lines
  const {
    updatedLines,
    newDeliveries,
    deliveryRevenueMUSD,
    newsArticles: deliveryNews,
    milestones: deliveryMilestones
  } = advanceAssemblyLines(
    currentCompany.assemblyLines,
    updatedPrograms,
    currentCompany.firmContracts,
    currentCompany.activeInServiceFleet,
    newDate,
    rng
  );

  // 3. Advance Autonomous RFP Reviews
  const {
    updatedRfps: reviewedRfps,
    newContracts,
    newsArticles: rfpNews,
    downPaymentMUSD
  } = advanceRfpReviews(
    currentCompany.rfpProposals,
    updatedPrograms,
    competitors,
    airlines,
    currentCompany.reputationScore,
    newDate,
    rng
  );

  const updatedFleet = [...currentCompany.activeInServiceFleet, ...newDeliveries];

  // 4. Update simulated flights
  const programsRangeMap: Record<string, number> = {};
  updatedPrograms.forEach(p => { programsRangeMap[p.id] = p.performance.rangeKm; });
  const airlineHubMap: Record<string, string> = {};
  airlines.forEach(a => { airlineHubMap[a.id] = a.hubAirportIata; });

  const { updatedFleet: fleetWithFlightData, currentActiveFlights } = updateSimulatedFlights(
    updatedFleet,
    programsRangeMap,
    airlineHubMap,
    newDate.totalDays,
    1.0,
    rng
  );

  // 5. Incidents
  const newIncidents: CompanyState['incidentHistory'] = [];
  fleetWithFlightData.forEach(plane => {
    const prog = updatedPrograms.find(p => p.id === plane.programId);
    if (prog) {
      const inc = checkForInServiceIncident(plane, prog, newDate, rng);
      if (inc) newIncidents.push(inc);
    }
  });

  const { updatedIncidents, generatedNews: invNews } = advanceIncidentInvestigations(
    [...currentCompany.incidentHistory, ...newIncidents],
    1.0,
    newDate,
    rng
  );

  // 6. Financials Update
  const financials = { ...currentCompany.financials };
  financials.cash += deliveryRevenueMUSD + downPaymentMUSD;

  if (isMonthEnd) {
    const monthlyPayroll = currentCompany.departments.reduce((acc, d) => {
      const ot = d.overtimeAllowed ? 1.25 : 1.0;
      return acc + (d.headcount * d.baseSalary * ot);
    }, 0) / 1_000_000;

    const facilitiesCost = currentCompany.facilities.reduce((acc, f) => acc + f.monthlyOperatingCost, 0);

    // Rebalanced active R&D burn: ~2.5M to 4.5M per program
    const rdMonthlySpend = updatedPrograms.reduce((acc, p) => {
      if (p.currentPhase === 'entry_into_service' || p.currentPhase === 'mature_production') return acc + 0.5;
      return acc + (p.allocatedHeadcount * 12000) / 1_000_000 + 1.8;
    }, 0);

    const totalMonthlyExpenses = monthlyPayroll + facilitiesCost + rdMonthlySpend;
    financials.monthlyExpenses = parseFloat(totalMonthlyExpenses.toFixed(2));
    financials.monthlyRevenue = parseFloat((deliveryRevenueMUSD + downPaymentMUSD).toFixed(2));
    financials.monthlyBurnRate = parseFloat((totalMonthlyExpenses - (deliveryRevenueMUSD + downPaymentMUSD)).toFixed(2));
    financials.cash = parseFloat((financials.cash - totalMonthlyExpenses).toFixed(2));

    // Insolvency state check
    if (financials.cash < 0) {
      financials.insolvencyStatus = 'insolvent';
    } else if (financials.cash < 40) {
      financials.insolvencyStatus = 'critical_liquidity';
    } else {
      financials.insolvencyStatus = 'solvent';
    }
  }

  // 7. Generate potential new RFPs
  let updatedRfps = [...reviewedRfps];
  const newRfp = generatePotentialAirlineRFP(
    airlines,
    newDate,
    updatedRfps,
    currentCompany.trustLevel,
    updatedEconomy.passengerTravelDemandIndex,
    rng
  );
  if (newRfp) {
    updatedRfps.push(newRfp);
  }

  // 8. Competitors
  let updatedCompetitors = competitors;
  let compNews: NewsArticle[] = [];
  if (isMonthEnd) {
    const compResult = updateCompetitorNPCs(competitors, newDate, rng);
    updatedCompetitors = compResult.updatedCompetitors;
    compNews = compResult.newsArticles;
  }

  const allNewArticles = [...rndNews, ...deliveryNews, ...invNews, ...compNews, ...rfpNews];
  const updatedNewsHistory = [...allNewArticles, ...currentCompany.newsHistory].slice(0, 100);

  const allNewMilestones = [...rndMilestones, ...deliveryMilestones];
  const updatedMilestones = [...currentCompany.milestonesUnlocked, ...allNewMilestones];

  const updatedCompany: CompanyState = {
    ...currentCompany,
    financials,
    programs: updatedPrograms,
    assemblyLines: updatedLines,
    firmContracts: [...currentCompany.firmContracts, ...newContracts],
    activeInServiceFleet: fleetWithFlightData,
    incidentHistory: updatedIncidents,
    newsHistory: updatedNewsHistory,
    milestonesUnlocked: updatedMilestones,
    rfpProposals: updatedRfps,
    activeTestFlightMap: currentActiveFlights
  };

  return {
    updatedCompany,
    updatedEconomy,
    updatedDate: newDate,
    updatedCompetitors,
    updatedAirlines: airlines,
    isMonthEnd
  };
}
