// ============================================================================
// PROJECT AIRFRAME - COMPETITOR NPC SIMULATION ENGINE
// ============================================================================

import type { CompetitorManufacturer, GameDate, NewsArticle } from '../types';
import { SeededRNG } from './rng';

/**
 * Monthly tick for competitor NPC manufacturers
 */
export function updateCompetitorNPCs(
  competitors: CompetitorManufacturer[],
  currentDate: GameDate,
  rng: SeededRNG
): { updatedCompetitors: CompetitorManufacturer[]; newsArticles: NewsArticle[] } {
  const newsArticles: NewsArticle[] = [];

  const updatedCompetitors = competitors.map(comp => {
    comp.activeAircraftFamilies.forEach(family => {
      const deliveriesThisMonth = Math.min(
        Math.floor(comp.factoryCapacityPerMonth / comp.activeAircraftFamilies.length),
        family.backlog
      );
      family.unitsDelivered += deliveriesThisMonth;
      family.backlog = Math.max(0, family.backlog - deliveriesThisMonth);

      if (rng.nextBool(0.35)) {
        const newOrders = rng.nextInt(2, 18);
        family.backlog += newOrders;
      }
    });

    if (comp.currentRndPipeline) {
      const pipe = comp.currentRndPipeline;
      if (pipe.status === 'rumored' && currentDate.year >= pipe.targetEisYear - 4) {
        pipe.status = 'launched';
        newsArticles.push({
          id: `news_comp_${comp.id}_launched_${currentDate.year}`,
          publishedDate: { ...currentDate },
          category: 'commercial',
          headline: `${comp.name} Officially Launches ${pipe.projectName}`,
          source: 'Aviation Week & Space Technology',
          summary: `${comp.name} has committed $4.2B in development funding for the ${pipe.projectName}, targeting EIS by ${pipe.targetEisYear}.`,
          impactSubjectId: comp.id,
          impactType: 'industry'
        });
      } else if (pipe.status === 'launched' && currentDate.year >= pipe.targetEisYear - 2) {
        pipe.status = 'flight_testing';
        newsArticles.push({
          id: `news_comp_${comp.id}_flight_${currentDate.year}`,
          publishedDate: { ...currentDate },
          category: 'engineering',
          headline: `Maiden Flight Achieved for ${comp.name} ${pipe.projectName}`,
          source: 'FlightGlobal Aerospace Bulletin',
          summary: `The prototype ${pipe.projectName} successfully completed its 2-hour 45-minute maiden test flight from company flight test headquarters.`,
          impactSubjectId: comp.id,
          impactType: 'industry'
        });
      } else if (pipe.status === 'flight_testing' && currentDate.year >= pipe.targetEisYear) {
        pipe.status = 'near_eis';
        comp.activeAircraftFamilies.push({
          name: pipe.projectName,
          segment: pipe.segment,
          seats: pipe.segment === 'large_narrowbody' ? 220 : 180,
          rangeKm: 7200,
          fuelBurnScore: 95,
          listPrice: 125.0,
          unitsDelivered: 0,
          backlog: rng.nextInt(120, 350)
        });

        newsArticles.push({
          id: `news_comp_${comp.id}_cert_${currentDate.year}`,
          publishedDate: { ...currentDate },
          category: 'commercial',
          headline: `${comp.name} Receives Type Certificate for ${pipe.projectName}`,
          source: 'Civil Aviation Authority Daily',
          summary: `The regulatory authority has formally granted Type Certification for the ${pipe.projectName}, clearing the way for immediate commercial customer deliveries.`,
          impactSubjectId: comp.id,
          impactType: 'industry'
        });

        comp.currentRndPipeline = undefined;
      }
    }

    return comp;
  });

  return {
    updatedCompetitors,
    newsArticles
  };
}
