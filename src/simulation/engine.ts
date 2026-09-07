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
import { generatePotentialAirlineRFP } from './rfpEngine';
import { updateCompetitorNPCs } from './npcEngine';

export const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

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
 * Advance R&D and flight test program progression
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
    if (prog.currentPhase === 'entry_into_service' || prog.currentPhase === 'mature_production' || prog.currentPhase === 'production_ended') {
      return prog;
    }

    const pressureMultiplier = prog.schedulePressure === 'crunch' ? 1.45 : (prog.schedulePressure === 'aggressive' ? 1.2 : 1.0);
    const dailyProgress = (0.28 * avgProductivity * pressureMultiplier * Math.min(2.0, Math.max(0.4, prog.allocatedHeadcount / 250)));

    prog.phaseProgressPercent = Math.min(100, prog.phaseProgressPercent + dailyProgress);

    if (prog.schedulePressure === 'crunch' && rng.nextBool(0.15)) {
      prog.accumulatedTechDebt = Math.min(100, prog.accumulatedTechDebt + 1);
    }

    if (prog.phaseProgressPercent >= 100) {
      prog.phaseProgressPercent = 0;

      if (prog.currentPhase === 'concept') {
        prog.currentPhase = 'preliminary_design';
      } else if (prog.currentPhase === 'preliminary_design') {
        prog.currentPhase = 'detailed_design';
      } else if (prog.currentPhase === 'detailed_design') {
        prog.currentPhase = 'prototype_build';
        if (prog.prototypesBuilt.length === 0) {
          prog.prototypesBuilt.push({
            id: `pt_${prog.id}_001`,
            programId: prog.id,
            serialNumber: 'PT-001',
            name: `${prog.name} Aerodynamics Lead Prototype`,
            primaryRole: 'aerodynamics_envelope',
            status: 'under_construction',
            flightHours: 0,
            cycles: 0,
            completionPercent: 0,
            assignedLocationAirportId: 'ORD'
          });
        }
      } else if (prog.currentPhase === 'prototype_build') {
        prog.currentPhase = 'ground_testing';
        prog.prototypesBuilt.forEach(pt => {
          if (pt.status === 'under_construction') pt.status = 'ground_testing';
        });
      } else if (prog.currentPhase === 'ground_testing') {
        prog.currentPhase = 'flight_testing';
        prog.prototypesBuilt.forEach(pt => {
          if (pt.status === 'ground_testing') pt.status = 'flight_testing';
        });

        news.push({
          id: `news_maiden_${prog.id}_${currentDate.year}`,
          publishedDate: { ...currentDate },
          category: 'engineering',
          headline: `Maiden Flight Achieved: ${prog.name} Takes to the Skies`,
          source: 'Aviation Week & Space Intelligence',
          summary: `The flagship prototype of the ${prog.name} commercial airliner completed its historic first flight today, launching its formal flight test certification campaign.`,
          impactSubjectId: prog.id,
          impactType: 'reputation'
        });

        milestones.push({
          id: `ms_maiden_${prog.id}`,
          achievedDate: { ...currentDate },
          title: `Maiden Flight: ${prog.name}`,
          description: `Successfully achieved first flight of the ${prog.name} flight test prototype aircraft.`,
          iconName: 'PlaneTakeoff',
          rewardReputation: 15
        });
      } else if (prog.currentPhase === 'flight_testing') {
        prog.currentPhase = 'certification';
      } else if (prog.currentPhase === 'certification') {
        prog.currentPhase = 'production_ready';
        prog.typeCertificateIssued = true;
        prog.productionCertificateIssued = true;
        prog.actualEisDate = { ...currentDate };

        news.push({
          id: `news_cert_${prog.id}_${currentDate.year}`,
          publishedDate: { ...currentDate },
          category: 'commercial',
          headline: `Type Certification Granted for ${prog.name}`,
          source: 'Civil Aviation Regulatory Authority',
          summary: `The ${prog.name} has officially received full commercial Type Certification, validating compliance with all airworthiness and environmental requirements.`,
          impactSubjectId: prog.id,
          impactType: 'reputation'
        });

        milestones.push({
          id: `ms_cert_${prog.id}`,
          achievedDate: { ...currentDate },
          title: `Type Certification: ${prog.name}`,
          description: `Received official Type Certificate from regulatory authorities for the ${prog.name}.`,
          iconName: 'Award',
          rewardReputation: 25
        });
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
    if (!prog || !prog.typeCertificateIssued) return line;

    const stationDailyAdvance = (line.currentMonthlyRateTarget * 8) / 30;

    line.activeUnitsOnLine = line.activeUnitsOnLine.filter(unit => {
      unit.stationProgressPercent += stationDailyAdvance;

      if (unit.stationProgressPercent >= 100) {
        unit.stationProgressPercent = 0;
        unit.currentStationIndex++;

        if (unit.currentStationIndex > 7) {
          const contract = contracts.find(c => c.id === unit.contractId);
          const unitPrice = contract ? contract.unitNegotiatedPrice : prog.listPrice;
          
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

          if (prog.totalDeliveriesCount === 1) {
            newsArticles.push({
              id: `news_first_del_${prog.id}`,
              publishedDate: { ...currentDate },
              category: 'commercial',
              headline: `First Commercial Delivery of ${prog.name} Handed Over`,
              source: 'FlightGlobal Aerospace Delivery Wire',
              summary: `The very first production ${prog.name} (MSN 001) has been officially delivered to launch customer ${unit.customerAirlineId}.`,
              impactSubjectId: prog.id,
              impactType: 'orders'
            });

            milestones.push({
              id: `ms_first_delivery_${prog.id}`,
              achievedDate: { ...currentDate },
              title: `First Delivery: ${prog.name}`,
              description: `Handed over the first customer aircraft to airline service.`,
              iconName: 'CheckCircle2',
              rewardReputation: 20
            });
          }

          return false;
        }
      }
      return true;
    });

    const activeContract = contracts.find(c => c.programId === line.programId && c.status === 'active');
    if (activeContract && line.activeUnitsOnLine.length < 8) {
      const nextMsn = `MSN-${String(prog.totalDeliveriesCount + line.activeUnitsOnLine.length + 1).padStart(3, '0')}`;
      line.activeUnitsOnLine.push({
        serialNumber: nextMsn,
        programId: line.programId,
        customerAirlineId: activeContract.airlineId,
        contractId: activeContract.id,
        currentStationIndex: 0,
        stationProgressPercent: 0,
        qualityDefectsCount: 0,
        estimatedDeliveryDate: {
          ...currentDate,
          month: (currentDate.month + 3) > 12 ? (currentDate.month + 3 - 12) : currentDate.month + 3,
          year: (currentDate.month + 3) > 12 ? currentDate.year + 1 : currentDate.year
        }
      });
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

  const { updatedPrograms, news: rndNews, milestones: rndMilestones } = advanceProgramsRnD(
    currentCompany.programs,
    currentCompany.departments,
    newDate,
    rng
  );

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

  const updatedFleet = [...currentCompany.activeInServiceFleet, ...newDeliveries];

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

  const financials = { ...currentCompany.financials };
  financials.cash += deliveryRevenueMUSD;

  if (isMonthEnd) {
    const monthlyPayroll = currentCompany.departments.reduce((acc, d) => {
      const ot = d.overtimeAllowed ? 1.25 : 1.0;
      return acc + (d.headcount * d.baseSalary * ot);
    }, 0) / 1_000_000;

    const facilitiesCost = currentCompany.facilities.reduce((acc, f) => acc + f.monthlyOperatingCost, 0);

    const rdMonthlySpend = updatedPrograms.reduce((acc, p) => {
      return acc + (p.currentPhase !== 'entry_into_service' ? 14.5 : 0);
    }, 0);

    const totalMonthlyExpenses = monthlyPayroll + facilitiesCost + rdMonthlySpend;
    financials.monthlyExpenses = parseFloat(totalMonthlyExpenses.toFixed(2));
    financials.monthlyRevenue = parseFloat(deliveryRevenueMUSD.toFixed(2));
    financials.monthlyBurnRate = parseFloat((totalMonthlyExpenses - deliveryRevenueMUSD).toFixed(2));
    financials.cash = parseFloat((financials.cash - totalMonthlyExpenses).toFixed(2));
  }

  let updatedRfps = [...currentCompany.rfpProposals];
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

  let updatedCompetitors = competitors;
  let compNews: NewsArticle[] = [];
  if (isMonthEnd) {
    const compResult = updateCompetitorNPCs(competitors, newDate, rng);
    updatedCompetitors = compResult.updatedCompetitors;
    compNews = compResult.newsArticles;
  }

  const allNewArticles = [...rndNews, ...deliveryNews, ...invNews, ...compNews];
  const updatedNewsHistory = [...allNewArticles, ...currentCompany.newsHistory].slice(0, 100);

  const allNewMilestones = [...rndMilestones, ...deliveryMilestones];
  const updatedMilestones = [...currentCompany.milestonesUnlocked, ...allNewMilestones];

  const updatedCompany: CompanyState = {
    ...currentCompany,
    financials,
    programs: updatedPrograms,
    assemblyLines: updatedLines,
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
