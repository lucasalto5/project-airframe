import type { Airport } from '../types';

export const GLOBAL_AIRPORTS: Airport[] = [
  // North America
  { iata: 'JFK', icao: 'KJFK', name: 'John F. Kennedy Intl', city: 'New York', country: 'United States', lat: 40.6413, lon: -73.7781, runwayLengthMeters: 4423, elevationFeet: 13, hubTier: 'mega_hub', annualPassengerVolumeMillions: 62 },
  { iata: 'ORD', icao: 'KORD', name: "O'Hare Intl Airport", city: 'Chicago', country: 'United States', lat: 41.9742, lon: -87.9073, runwayLengthMeters: 3962, elevationFeet: 672, hubTier: 'mega_hub', annualPassengerVolumeMillions: 84 },
  { iata: 'LAX', icao: 'KLAX', name: 'Los Angeles Intl Airport', city: 'Los Angeles', country: 'United States', lat: 33.9416, lon: -118.4085, runwayLengthMeters: 3939, elevationFeet: 125, hubTier: 'mega_hub', annualPassengerVolumeMillions: 88 },
  { iata: 'ATL', icao: 'KATL', name: 'Hartsfield-Jackson Atlanta Intl', city: 'Atlanta', country: 'United States', lat: 33.6407, lon: -84.4277, runwayLengthMeters: 3776, elevationFeet: 1026, hubTier: 'mega_hub', annualPassengerVolumeMillions: 107 },
  { iata: 'DFW', icao: 'KDFW', name: 'Dallas/Fort Worth Intl', city: 'Dallas', country: 'United States', lat: 32.8998, lon: -97.0403, runwayLengthMeters: 4085, elevationFeet: 607, hubTier: 'mega_hub', annualPassengerVolumeMillions: 75 },
  { iata: 'DEN', icao: 'KDEN', name: 'Denver Intl Airport', city: 'Denver', country: 'United States', lat: 39.8561, lon: -104.6737, runwayLengthMeters: 4877, elevationFeet: 5434, hubTier: 'major_international', annualPassengerVolumeMillions: 69 },
  { iata: 'SEA', icao: 'KSEA', name: 'Seattle-Tacoma Intl Airport', city: 'Seattle', country: 'United States', lat: 47.4502, lon: -122.3088, runwayLengthMeters: 3627, elevationFeet: 433, hubTier: 'major_international', annualPassengerVolumeMillions: 51 },
  { iata: 'MIA', icao: 'KMIA', name: 'Miami Intl Airport', city: 'Miami', country: 'United States', lat: 25.7959, lon: -80.2870, runwayLengthMeters: 3962, elevationFeet: 8, hubTier: 'major_international', annualPassengerVolumeMillions: 46 },
  { iata: 'YYZ', icao: 'CYYZ', name: 'Toronto Pearson Intl', city: 'Toronto', country: 'Canada', lat: 43.6777, lon: -79.6248, runwayLengthMeters: 3389, elevationFeet: 569, hubTier: 'major_international', annualPassengerVolumeMillions: 49 },
  { iata: 'YVR', icao: 'CYVR', name: 'Vancouver Intl Airport', city: 'Vancouver', country: 'Canada', lat: 49.1967, lon: -123.1815, runwayLengthMeters: 3505, elevationFeet: 14, hubTier: 'major_international', annualPassengerVolumeMillions: 26 },
  { iata: 'MEX', icao: 'MMMX', name: 'Benito Juárez Intl', city: 'Mexico City', country: 'Mexico', lat: 19.4361, lon: -99.0719, runwayLengthMeters: 3985, elevationFeet: 7316, hubTier: 'major_international', annualPassengerVolumeMillions: 50 },

  // Latin America
  { iata: 'GRU', icao: 'SBGR', name: 'São Paulo/Guarulhos Intl', city: 'São Paulo', country: 'Brazil', lat: -23.4356, lon: -46.4731, runwayLengthMeters: 3700, elevationFeet: 2459, hubTier: 'major_international', annualPassengerVolumeMillions: 43 },
  { iata: 'GIG', icao: 'SBGL', name: 'Rio de Janeiro/Galeão Intl', city: 'Rio de Janeiro', country: 'Brazil', lat: -22.8134, lon: -43.2494, runwayLengthMeters: 4000, elevationFeet: 28, hubTier: 'regional_hub', annualPassengerVolumeMillions: 14 },
  { iata: 'BOG', icao: 'SKBO', name: 'El Dorado Intl Airport', city: 'Bogotá', country: 'Colombia', lat: 4.7016, lon: -74.1469, runwayLengthMeters: 3800, elevationFeet: 8361, hubTier: 'major_international', annualPassengerVolumeMillions: 35 },
  { iata: 'SCL', icao: 'SCEL', name: 'Arturo Merino Benítez Intl', city: 'Santiago', country: 'Chile', lat: -33.3928, lon: -70.7856, runwayLengthMeters: 3800, elevationFeet: 1555, hubTier: 'regional_hub', annualPassengerVolumeMillions: 24 },
  { iata: 'EZE', icao: 'SAEZ', name: 'Ministro Pistarini Intl', city: 'Buenos Aires', country: 'Argentina', lat: -34.8222, lon: -58.5358, runwayLengthMeters: 3300, elevationFeet: 67, hubTier: 'regional_hub', annualPassengerVolumeMillions: 12 },
  { iata: 'PTY', icao: 'MPTO', name: 'Tocumen Intl Airport', city: 'Panama City', country: 'Panama', lat: 9.0714, lon: -79.3835, runwayLengthMeters: 3050, elevationFeet: 135, hubTier: 'regional_hub', annualPassengerVolumeMillions: 16 },
  { iata: 'LIM', icao: 'SPJC', name: 'Jorge Chávez Intl', city: 'Lima', country: 'Peru', lat: -12.0219, lon: -77.1143, runwayLengthMeters: 3507, elevationFeet: 113, hubTier: 'regional_hub', annualPassengerVolumeMillions: 23 },

  // Europe
  { iata: 'LHR', icao: 'EGLL', name: 'London Heathrow Airport', city: 'London', country: 'United Kingdom', lat: 51.4700, lon: -0.4543, runwayLengthMeters: 3902, elevationFeet: 83, hubTier: 'mega_hub', annualPassengerVolumeMillions: 80 },
  { iata: 'CDG', icao: 'LFPG', name: 'Paris Charles de Gaulle', city: 'Paris', country: 'France', lat: 49.0097, lon: 2.5479, runwayLengthMeters: 4215, elevationFeet: 392, hubTier: 'mega_hub', annualPassengerVolumeMillions: 76 },
  { iata: 'FRA', icao: 'EDDF', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany', lat: 50.0379, lon: 8.5622, runwayLengthMeters: 4000, elevationFeet: 364, hubTier: 'mega_hub', annualPassengerVolumeMillions: 70 },
  { iata: 'AMS', icao: 'EHAM', name: 'Amsterdam Airport Schiphol', city: 'Amsterdam', country: 'Netherlands', lat: 52.3105, lon: 4.7683, runwayLengthMeters: 3800, elevationFeet: -11, hubTier: 'mega_hub', annualPassengerVolumeMillions: 72 },
  { iata: 'MAD', icao: 'LEMD', name: 'Adolfo Suárez Madrid-Barajas', city: 'Madrid', country: 'Spain', lat: 40.4839, lon: -3.5680, runwayLengthMeters: 4100, elevationFeet: 1998, hubTier: 'major_international', annualPassengerVolumeMillions: 61 },
  { iata: 'FCO', icao: 'LIRF', name: 'Leonardo da Vinci-Fiumicino', city: 'Rome', country: 'Italy', lat: 41.8003, lon: 12.2389, runwayLengthMeters: 3900, elevationFeet: 15, hubTier: 'major_international', annualPassengerVolumeMillions: 44 },
  { iata: 'MUC', icao: 'EDDM', name: 'Munich Airport', city: 'Munich', country: 'Germany', lat: 48.3537, lon: 11.7861, runwayLengthMeters: 4000, elevationFeet: 1487, hubTier: 'major_international', annualPassengerVolumeMillions: 48 },
  { iata: 'ZRH', icao: 'LSZH', name: 'Zurich Airport', city: 'Zurich', country: 'Switzerland', lat: 47.4582, lon: 8.5555, runwayLengthMeters: 3700, elevationFeet: 1416, hubTier: 'regional_hub', annualPassengerVolumeMillions: 31 },
  { iata: 'IST', icao: 'LTFM', name: 'Istanbul Airport', city: 'Istanbul', country: 'Turkey', lat: 41.2753, lon: 28.7519, runwayLengthMeters: 4100, elevationFeet: 325, hubTier: 'mega_hub', annualPassengerVolumeMillions: 68 },
  { iata: 'DME', icao: 'UUDD', name: 'Domodedovo Intl Airport', city: 'Moscow', country: 'Russia', lat: 55.4088, lon: 37.9063, runwayLengthMeters: 3794, elevationFeet: 588, hubTier: 'major_international', annualPassengerVolumeMillions: 30 },

  // Middle East & Africa
  { iata: 'DXB', icao: 'OMDB', name: 'Dubai Intl Airport', city: 'Dubai', country: 'United Arab Emirates', lat: 25.2532, lon: 55.3657, runwayLengthMeters: 4450, elevationFeet: 62, hubTier: 'mega_hub', annualPassengerVolumeMillions: 89 },
  { iata: 'DOH', icao: 'OTHH', name: 'Hamad Intl Airport', city: 'Doha', country: 'Qatar', lat: 25.2731, lon: 51.6081, runwayLengthMeters: 4850, elevationFeet: 13, hubTier: 'major_international', annualPassengerVolumeMillions: 39 },
  { iata: 'JED', icao: 'OEJN', name: 'King Abdulaziz Intl', city: 'Jeddah', country: 'Saudi Arabia', lat: 21.6796, lon: 39.1565, runwayLengthMeters: 4000, elevationFeet: 48, hubTier: 'major_international', annualPassengerVolumeMillions: 37 },
  { iata: 'CAI', icao: 'HECA', name: 'Cairo Intl Airport', city: 'Cairo', country: 'Egypt', lat: 30.1219, lon: 31.4056, runwayLengthMeters: 4000, elevationFeet: 382, hubTier: 'major_international', annualPassengerVolumeMillions: 17 },
  { iata: 'JNB', icao: 'FAOR', name: 'O.R. Tambo Intl Airport', city: 'Johannesburg', country: 'South Africa', lat: -26.1367, lon: 28.2411, runwayLengthMeters: 4421, elevationFeet: 5558, hubTier: 'major_international', annualPassengerVolumeMillions: 22 },
  { iata: 'NBO', icao: 'HKJK', name: 'Jomo Kenyatta Intl', city: 'Nairobi', country: 'Kenya', lat: -1.3192, lon: 36.9278, runwayLengthMeters: 4117, elevationFeet: 5327, hubTier: 'regional_hub', annualPassengerVolumeMillions: 8 },
  { iata: 'ADD', icao: 'HAAB', name: 'Bole Intl Airport', city: 'Addis Ababa', country: 'Ethiopia', lat: 8.9779, lon: 38.7993, runwayLengthMeters: 3800, elevationFeet: 7630, hubTier: 'regional_hub', annualPassengerVolumeMillions: 12 },

  // Asia Pacific
  { iata: 'HND', icao: 'RJTT', name: 'Tokyo Haneda Airport', city: 'Tokyo', country: 'Japan', lat: 35.5494, lon: 139.7798, runwayLengthMeters: 3360, elevationFeet: 21, hubTier: 'mega_hub', annualPassengerVolumeMillions: 87 },
  { iata: 'NRT', icao: 'RJAA', name: 'Narita Intl Airport', city: 'Tokyo', country: 'Japan', lat: 35.7647, lon: 140.3864, runwayLengthMeters: 4000, elevationFeet: 141, hubTier: 'major_international', annualPassengerVolumeMillions: 44 },
  { iata: 'PEK', icao: 'ZBAA', name: 'Beijing Capital Intl', city: 'Beijing', country: 'China', lat: 40.0799, lon: 116.6031, runwayLengthMeters: 3800, elevationFeet: 116, hubTier: 'mega_hub', annualPassengerVolumeMillions: 100 },
  { iata: 'PVG', icao: 'ZSPD', name: 'Shanghai Pudong Intl', city: 'Shanghai', country: 'China', lat: 31.1443, lon: 121.8083, runwayLengthMeters: 4000, elevationFeet: 13, hubTier: 'mega_hub', annualPassengerVolumeMillions: 76 },
  { iata: 'CAN', icao: 'ZGGG', name: 'Guangzhou Baiyun Intl', city: 'Guangzhou', country: 'China', lat: 23.3924, lon: 113.2988, runwayLengthMeters: 3800, elevationFeet: 50, hubTier: 'mega_hub', annualPassengerVolumeMillions: 73 },
  { iata: 'HKG', icao: 'VHHH', name: 'Hong Kong Intl Airport', city: 'Hong Kong', country: 'Hong Kong', lat: 22.3080, lon: 113.9185, runwayLengthMeters: 3800, elevationFeet: 28, hubTier: 'mega_hub', annualPassengerVolumeMillions: 71 },
  { iata: 'ICN', icao: 'RKSI', name: 'Incheon Intl Airport', city: 'Seoul', country: 'South Korea', lat: 37.4602, lon: 126.4407, runwayLengthMeters: 4000, elevationFeet: 23, hubTier: 'mega_hub', annualPassengerVolumeMillions: 71 },
  { iata: 'SIN', icao: 'WSSS', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore', lat: 1.3644, lon: 103.9915, runwayLengthMeters: 4000, elevationFeet: 22, hubTier: 'mega_hub', annualPassengerVolumeMillions: 68 },
  { iata: 'BKK', icao: 'VTBS', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand', lat: 13.6900, lon: 100.7501, runwayLengthMeters: 4000, elevationFeet: 5, hubTier: 'major_international', annualPassengerVolumeMillions: 65 },
  { iata: 'KUL', icao: 'WMKK', name: 'Kuala Lumpur Intl', city: 'Kuala Lumpur', country: 'Malaysia', lat: 2.7456, lon: 101.7072, runwayLengthMeters: 4050, elevationFeet: 69, hubTier: 'major_international', annualPassengerVolumeMillions: 60 },
  { iata: 'DEL', icao: 'VIDP', name: 'Indira Gandhi Intl', city: 'New Delhi', country: 'India', lat: 28.5562, lon: 77.1000, runwayLengthMeters: 4430, elevationFeet: 777, hubTier: 'mega_hub', annualPassengerVolumeMillions: 69 },
  { iata: 'BOM', icao: 'VABB', name: 'Chhatrapati Shivaji Maharaj Intl', city: 'Mumbai', country: 'India', lat: 19.0896, lon: 72.8656, runwayLengthMeters: 3660, elevationFeet: 39, hubTier: 'major_international', annualPassengerVolumeMillions: 49 },
  { iata: 'CGK', icao: 'WIII', name: 'Soekarno-Hatta Intl', city: 'Jakarta', country: 'Indonesia', lat: -6.1256, lon: 106.6559, runwayLengthMeters: 3660, elevationFeet: 34, hubTier: 'major_international', annualPassengerVolumeMillions: 54 },

  // Oceania
  { iata: 'SYD', icao: 'YSSY', name: 'Sydney Kingsford Smith', city: 'Sydney', country: 'Australia', lat: -33.9399, lon: 151.1753, runwayLengthMeters: 3962, elevationFeet: 21, hubTier: 'major_international', annualPassengerVolumeMillions: 44 },
  { iata: 'MEL', icao: 'YMML', name: 'Melbourne Airport', city: 'Melbourne', country: 'Australia', lat: -37.6690, lon: 144.8410, runwayLengthMeters: 3657, elevationFeet: 434, hubTier: 'regional_hub', annualPassengerVolumeMillions: 37 },
  { iata: 'AKL', icao: 'NZAA', name: 'Auckland Airport', city: 'Auckland', country: 'New Zealand', lat: -37.0082, lon: 174.7850, runwayLengthMeters: 3635, elevationFeet: 23, hubTier: 'regional_hub', annualPassengerVolumeMillions: 21 }
];

export function getAirportByIata(iata: string): Airport | undefined {
  return GLOBAL_AIRPORTS.find(a => a.iata === iata);
}
