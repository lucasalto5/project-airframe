// ============================================================================
// PROJECT AIRFRAME - FLIGHT TEST & CERTIFICATION CAMPAIGNS DATASET
// ============================================================================

export interface TestScenarioDefinition {
  id: string;
  name: string;
  category: 'ground' | 'flight';
  description: string;
  minPhase: 'prototype_build' | 'ground_testing' | 'flight_testing';
  requiredFlightHours: number;
  riskFactor: number; // 0 - 100
  potentialAnomalies: {
    id: string;
    title: string;
    description: string;
    severity: 'observation' | 'level_2_minor' | 'level_1_major' | 'airworthiness_blocker';
    options: {
      label: string;
      description: string;
      costMUSD: number;
      delayDays: number;
      techDebtAdded: number;
      safetyReliabilityImpact: number;
    }[];
  }[];
}

export const TEST_SCENARIOS: TestScenarioDefinition[] = [
  // Ground Tests
  {
    id: 'structural_ultimate_load',
    name: '150% Structural Ultimate Load Test',
    category: 'ground',
    description: 'Hydraulic actuators bend the carbon-aluminum wing box to 1.5x maximum aerodynamic limit until catastrophic fracture.',
    minPhase: 'ground_testing',
    requiredFlightHours: 0,
    riskFactor: 35,
    potentialAnomalies: [
      {
        id: 'wing_root_delamination',
        title: 'Premature Wing Root Fastener Delamination',
        description: 'During 142% ultimate bending load, localized composite fiber delamination was detected at the lower rear spar attachment.',
        severity: 'level_1_major',
        options: [
          { label: 'Reinforce Lower Spar Caps with Titanium Straps', description: 'Immediate titanium doubler retrofit adding 180 kg of structural weight.', costMUSD: 18.5, delayDays: 45, techDebtAdded: 0, safetyReliabilityImpact: 10 },
          { label: 'Recalibrate FBW Load Alleviation Law in Software', description: 'Use active aileron/spoiler deflection to unload wingtips during high-g maneuvers without adding physical weight.', costMUSD: 6.2, delayDays: 20, techDebtAdded: 8, safetyReliabilityImpact: 4 }
        ]
      }
    ]
  },
  {
    id: 'cabin_emergency_evacuation',
    name: '90-Second Full Cabin Evacuation Drill',
    category: 'ground',
    description: 'Evacuate maximum certified passenger load in total darkness with 50% of emergency slide exits deliberately blocked.',
    minPhase: 'ground_testing',
    requiredFlightHours: 0,
    riskFactor: 20,
    potentialAnomalies: [
      {
        id: 'overwing_slide_jam',
        title: 'Overwing Exit Hatch Deployment Snag',
        description: 'Overwing Type III escape slide deployed 4 seconds late due to pneumatic gas generator pressure drop in cold ambient conditions.',
        severity: 'level_2_minor',
        options: [
          { label: 'Redesign Aspirator Valve with Heated Solenoid', description: 'Standard industrial fix ensuring reliable sub-zero inflation.', costMUSD: 4.8, delayDays: 18, techDebtAdded: 0, safetyReliabilityImpact: 8 },
          { label: 'Update Emergency Operating Manual Procedures', description: 'Operational procedural change without redesign.', costMUSD: 0.8, delayDays: 5, techDebtAdded: 12, safetyReliabilityImpact: -4 }
        ]
      }
    ]
  },

  // Flight Tests
  {
    id: 'flutter_envelope_expansion',
    name: 'High-Speed Mach Dive & Flutter Margins',
    category: 'flight',
    description: 'Dive the aircraft to maximum design diving speed (Vd / Md = Mach 0.93) to verify aeroelastic damping across the empennage.',
    minPhase: 'flight_testing',
    requiredFlightHours: 65,
    riskFactor: 60,
    potentialAnomalies: [
      {
        id: 'horizontal_stabilizer_resonance',
        title: 'Aeroelastic Tail Buffeting at Mach 0.89',
        description: 'Telemetry captured sustained 12 Hz torsional oscillation in the horizontal stabilizer during high dynamic pressure transonic cruise.',
        severity: 'airworthiness_blocker',
        options: [
          { label: 'Full Empennage Fairing Redesign & Stiffener Gussets', description: 'Aerodynamically clean re-sculpting of the tailcone with internal stiffeners.', costMUSD: 38.0, delayDays: 90, techDebtAdded: 0, safetyReliabilityImpact: 15 },
          { label: 'Add Active Fly-by-Wire Flutter Damping Yaw-Damper Loop', description: 'Software-driven control surface oscillation compensation.', costMUSD: 14.5, delayDays: 30, techDebtAdded: 15, safetyReliabilityImpact: 5 },
          { label: 'Restrict Maximum Operating Mach (Mmo) by 0.02', description: 'Cap top speed, slightly degrading competitive cruise performance but avoiding redesign.', costMUSD: 2.0, delayDays: 7, techDebtAdded: 20, safetyReliabilityImpact: 0 }
        ]
      }
    ]
  },
  {
    id: 'hot_and_high_trials',
    name: 'Hot & High Altitude Takeoff Performance',
    category: 'flight',
    description: 'Deploy prototype to high-altitude airports (e.g. Denver KDEN or Bogotá SKBO at 8,300ft elevation) in 38°C ambient heat.',
    minPhase: 'flight_testing',
    requiredFlightHours: 45,
    riskFactor: 40,
    potentialAnomalies: [
      {
        id: 'engine_turbine_interstage_temp_spike',
        title: 'FADEC Turbine Interstage Temp Margin Breach',
        description: 'Full-power single-engine takeoff in thin 38°C air caused FADEC to automatically throttle back 4% to prevent turbine blade creep.',
        severity: 'level_1_major',
        options: [
          { label: 'Co-develop Thermal Ceramic Coating Engine Upgrade with Supplier', description: 'Upgraded turbine stator vanes with advanced ceramic matrix composites.', costMUSD: 24.0, delayDays: 60, techDebtAdded: 0, safetyReliabilityImpact: 12 },
          { label: 'Publish Hot & High MTOW Derating Chart', description: 'Reduce allowable payload when taking off in extreme hot-and-high conditions.', costMUSD: 1.2, delayDays: 10, techDebtAdded: 5, safetyReliabilityImpact: 2 }
        ]
      }
    ]
  },
  {
    id: 'natural_icing_campaign',
    name: 'Severe Meteorological Natural Icing Trials',
    category: 'flight',
    description: 'Hunt for supercooled liquid water cloud formations to test wing leading edge bleed air thermal de-icing and pitot probe heaters.',
    minPhase: 'flight_testing',
    requiredFlightHours: 55,
    riskFactor: 45,
    potentialAnomalies: [
      {
        id: 'windshield_optical_distortion_ice',
        title: 'Cockpit Side Window De-ice Heating Non-Uniformity',
        description: 'In severe icing conditions, uneven electro-thermal heating caused runback ice accumulation on the lower side cockpit windshield.',
        severity: 'level_2_minor',
        options: [
          { label: 'Upgrade to High-Wattage Dual-Zone Heating Controllers', description: 'Redesigned electrical controller with independent sensor feedback.', costMUSD: 5.5, delayDays: 25, techDebtAdded: 0, safetyReliabilityImpact: 6 },
          { label: 'Apply Hydrophobic Chemical Coating as Maintenance Task', description: 'Recurring airline ground maintenance application without hardware changes.', costMUSD: 0.9, delayDays: 8, techDebtAdded: 10, safetyReliabilityImpact: -2 }
        ]
      }
    ]
  },
  {
    id: 'crosswind_landing_trials',
    name: '35-Knot Gusting Crosswind Landings',
    category: 'flight',
    description: 'Validate crab-angle decrab maneuvers, rudder control authority, and main landing gear side-load absorption in 38 kt direct crosswinds.',
    minPhase: 'flight_testing',
    requiredFlightHours: 40,
    riskFactor: 30,
    potentialAnomalies: [
      {
        id: 'rudder_travel_limit_saturation',
        title: 'Rudder Ratio Changer Sensor Jitter in High Gusts',
        description: 'Sudden crosswind sheer caused brief hydraulic servo pressure pulsation on the lower rudder actuator.',
        severity: 'level_1_major',
        options: [
          { label: 'Install Dual-Channel Direct-Drive Hydraulic Actuators', description: 'Hardware replacement with higher bandwidth hydraulic servo valves.', costMUSD: 12.0, delayDays: 35, techDebtAdded: 0, safetyReliabilityImpact: 10 },
          { label: 'Filter Sensor Noise in Primary Flight Computer Software', description: 'Software digital low-pass filtering adjustment.', costMUSD: 3.2, delayDays: 14, techDebtAdded: 6, safetyReliabilityImpact: 3 }
        ]
      }
    ]
  }
];
