// ============================================================================
// PROJECT AIRFRAME - GLOBAL GREAT-CIRCLE FLIGHT SIMULATOR
// ============================================================================

import type { SimulatedFlight, SerializedAircraftInService } from '../types';
import { GLOBAL_AIRPORTS, getAirportByIata } from '../data/airports';
import { SeededRNG } from './rng';

export function calculateGreatCircleDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export function interpolateGreatCirclePoint(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  fraction: number
): { lat: number; lon: number; heading: number } {
  const f = Math.max(0, Math.min(1, fraction));
  const φ1 = (lat1 * Math.PI) / 180;
  const λ1 = (lon1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const λ2 = (lon2 * Math.PI) / 180;

  const d = 2 * Math.asin(Math.sqrt(
    Math.pow(Math.sin((φ1 - φ2) / 2), 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.pow(Math.sin((λ1 - λ2) / 2), 2)
  ));

  if (d === 0) {
    return { lat: lat1, lon: lon1, heading: 0 };
  }

  const A = Math.sin((1 - f) * d) / Math.sin(d);
  const B = Math.sin(f * d) / Math.sin(d);

  const x = A * Math.cos(φ1) * Math.cos(λ1) + B * Math.cos(φ2) * Math.cos(λ2);
  const y = A * Math.cos(φ1) * Math.sin(λ1) + B * Math.cos(φ2) * Math.sin(λ2);
  const z = A * Math.sin(φ1) + B * Math.sin(φ2);

  const φ_i = Math.atan2(z, Math.sqrt(x * x + y * y));
  const λ_i = Math.atan2(y, x);

  const yH = Math.sin(λ2 - λ_i) * Math.cos(φ2);
  const xH = Math.cos(φ_i) * Math.sin(φ2) - Math.sin(φ_i) * Math.cos(φ2) * Math.cos(λ2 - λ_i);
  let heading = (Math.atan2(yH, xH) * 180) / Math.PI;
  heading = (heading + 360) % 360;

  return {
    lat: (φ_i * 180) / Math.PI,
    lon: (λ_i * 180) / Math.PI,
    heading: Math.round(heading)
  };
}

export function dispatchNextFlightForAircraft(
  aircraft: SerializedAircraftInService,
  currentTotalDays: number,
  maxRangeKm: number,
  hubAirportIata: string,
  rng: SeededRNG
): SimulatedFlight {
  const originIata = aircraft.currentLocationAirportIata || hubAirportIata;
  const originAirport = getAirportByIata(originIata) || GLOBAL_AIRPORTS[0];

  const validDestinations = GLOBAL_AIRPORTS.filter(dest => {
    if (dest.iata === originIata) return false;
    const dist = calculateGreatCircleDistanceKm(originAirport.lat, originAirport.lon, dest.lat, dest.lon);
    return dist <= maxRangeKm * 0.95 && dist >= 250;
  });

  const destAirport = validDestinations.length > 0 
    ? rng.pick(validDestinations)
    : (originIata === hubAirportIata ? GLOBAL_AIRPORTS[1] : (getAirportByIata(hubAirportIata) || GLOBAL_AIRPORTS[0]));

  const distanceKm = calculateGreatCircleDistanceKm(originAirport.lat, originAirport.lon, destAirport.lat, destAirport.lon);
  const avgCruiseSpeedKmh = 840;
  const durationHours = Math.max(0.75, distanceKm / avgCruiseSpeedKmh + 0.4);

  const flightNumber = `${aircraft.airlineId.substring(0, 2).toUpperCase()}${rng.nextInt(100, 999)}`;

  return {
    flightNumber,
    aircraftSerial: aircraft.serialNumber,
    airlineId: aircraft.airlineId,
    programId: aircraft.programId,
    originIata: originAirport.iata,
    destinationIata: destAirport.iata,
    distanceKm,
    departureTimeTotalDays: currentTotalDays,
    durationHours,
    progressPercent: 0,
    currentLat: originAirport.lat,
    currentLon: originAirport.lon,
    currentAltitudeFeet: 34000,
    headingDegrees: 90
  };
}

export function updateSimulatedFlights(
  activeFleet: SerializedAircraftInService[],
  programsRangeMap: Record<string, number>,
  airlineHubMap: Record<string, string>,
  currentTotalDays: number,
  _deltaTimeDays: number,
  rng: SeededRNG
): { updatedFleet: SerializedAircraftInService[]; currentActiveFlights: SimulatedFlight[] } {
  const currentActiveFlights: SimulatedFlight[] = [];

  const updatedFleet = activeFleet.map(aircraft => {
    let flight = aircraft.assignedFlight;
    const maxRange = programsRangeMap[aircraft.programId] || 4500;
    const hubIata = airlineHubMap[aircraft.airlineId] || 'ORD';

    if (!flight || flight.progressPercent >= 100) {
      if (flight && flight.progressPercent >= 100) {
        aircraft.accumulatedFlightHours += Math.round(flight.durationHours);
        aircraft.accumulatedCycles += 1;
        aircraft.currentLocationAirportIata = flight.destinationIata;
      }
      flight = dispatchNextFlightForAircraft(aircraft, currentTotalDays, maxRange, hubIata, rng);
      aircraft.assignedFlight = flight;
    }

    const origin = getAirportByIata(flight.originIata) || GLOBAL_AIRPORTS[0];
    const dest = getAirportByIata(flight.destinationIata) || GLOBAL_AIRPORTS[1];

    const elapsedDays = (currentTotalDays - flight.departureTimeTotalDays);
    const flightDurationDays = flight.durationHours / 24;
    const progress = Math.min(100, Math.max(0, (elapsedDays / flightDurationDays) * 100));

    flight.progressPercent = progress;

    if (progress < 100) {
      const position = interpolateGreatCirclePoint(origin.lat, origin.lon, dest.lat, dest.lon, progress / 100);
      flight.currentLat = position.lat;
      flight.currentLon = position.lon;
      flight.headingDegrees = position.heading;

      if (progress < 15) {
        flight.currentAltitudeFeet = Math.round(1000 + (progress / 15) * 33000);
      } else if (progress > 85) {
        flight.currentAltitudeFeet = Math.round(34000 - ((progress - 85) / 15) * 33000);
      } else {
        flight.currentAltitudeFeet = 34000;
      }

      currentActiveFlights.push(flight);
    }

    return aircraft;
  });

  return {
    updatedFleet,
    currentActiveFlights
  };
}
