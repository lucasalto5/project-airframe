// ============================================================================
// PROJECT AIRFRAME - FLIGHT TEST & CERTIFICATION CAMPAIGNS DATASET
// ============================================================================

export interface TestAnomalyOption {
  labelKey: string;
  descKey: string;
  costMUSD: number;
  delayDays: number;
  techDebtAdded: number;
  safetyReliabilityImpact: number;
}

export interface TestAnomalyDefinition {
  id: string;
  titleKey: string;
  descKey: string;
  severity: 'observation' | 'level_2_minor' | 'level_1_major' | 'airworthiness_blocker';
  options: TestAnomalyOption[];
}

export interface TestScenarioDefinition {
  id: string;
  nameKey: string;
  category: 'ground' | 'flight';
  descKey: string;
  minPhase: 'prototype_build' | 'ground_testing' | 'flight_testing';
  durationDays: number;
  flightHoursLogged: number;
  envelopeGainPercent: number;
  costMUSD: number;
  isMandatoryForCert: boolean;
  riskFactor: number; // 0 - 100
  potentialAnomalies: TestAnomalyDefinition[];
}

export const TEST_SCENARIOS: TestScenarioDefinition[] = [
  // ==========================================
  // GROUND TEST CAMPAIGNS
  // ==========================================
  {
    id: 'structural_ultimate_load',
    nameKey: 'testing.scenarios.structural_ultimate_load.name',
    category: 'ground',
    descKey: 'testing.scenarios.structural_ultimate_load.desc',
    minPhase: 'ground_testing',
    durationDays: 14,
    flightHoursLogged: 0,
    envelopeGainPercent: 0,
    costMUSD: 8.5,
    isMandatoryForCert: true,
    riskFactor: 30,
    potentialAnomalies: [
      {
        id: 'wing_root_delamination',
        titleKey: 'testing.anomalies.wing_root_delamination.title',
        descKey: 'testing.anomalies.wing_root_delamination.desc',
        severity: 'level_1_major',
        options: [
          {
            labelKey: 'testing.anomalies.wing_root_delamination.opt1_label',
            descKey: 'testing.anomalies.wing_root_delamination.opt1_desc',
            costMUSD: 18.5,
            delayDays: 45,
            techDebtAdded: 0,
            safetyReliabilityImpact: 10
          },
          {
            labelKey: 'testing.anomalies.wing_root_delamination.opt2_label',
            descKey: 'testing.anomalies.wing_root_delamination.opt2_desc',
            costMUSD: 6.2,
            delayDays: 20,
            techDebtAdded: 8,
            safetyReliabilityImpact: 4
          }
        ]
      }
    ]
  },
  {
    id: 'cabin_emergency_evacuation',
    nameKey: 'testing.scenarios.cabin_emergency_evacuation.name',
    category: 'ground',
    descKey: 'testing.scenarios.cabin_emergency_evacuation.desc',
    minPhase: 'ground_testing',
    durationDays: 5,
    flightHoursLogged: 0,
    envelopeGainPercent: 0,
    costMUSD: 2.2,
    isMandatoryForCert: true,
    riskFactor: 20,
    potentialAnomalies: [
      {
        id: 'overwing_slide_jam',
        titleKey: 'testing.anomalies.overwing_slide_jam.title',
        descKey: 'testing.anomalies.overwing_slide_jam.desc',
        severity: 'level_2_minor',
        options: [
          {
            labelKey: 'testing.anomalies.overwing_slide_jam.opt1_label',
            descKey: 'testing.anomalies.overwing_slide_jam.opt1_desc',
            costMUSD: 4.8,
            delayDays: 18,
            techDebtAdded: 0,
            safetyReliabilityImpact: 8
          },
          {
            labelKey: 'testing.anomalies.overwing_slide_jam.opt2_label',
            descKey: 'testing.anomalies.overwing_slide_jam.opt2_desc',
            costMUSD: 0.8,
            delayDays: 5,
            techDebtAdded: 12,
            safetyReliabilityImpact: -4
          }
        ]
      }
    ]
  },
  {
    id: 'landing_gear_rto_brakes',
    nameKey: 'testing.scenarios.landing_gear_rto_brakes.name',
    category: 'ground',
    descKey: 'testing.scenarios.landing_gear_rto_brakes.desc',
    minPhase: 'ground_testing',
    durationDays: 7,
    flightHoursLogged: 0,
    envelopeGainPercent: 0,
    costMUSD: 4.2,
    isMandatoryForCert: true,
    riskFactor: 25,
    potentialAnomalies: [
      {
        id: 'carbon_brake_thermal_fuse',
        titleKey: 'testing.anomalies.carbon_brake_thermal_fuse.title',
        descKey: 'testing.anomalies.carbon_brake_thermal_fuse.desc',
        severity: 'level_2_minor',
        options: [
          {
            labelKey: 'testing.anomalies.carbon_brake_thermal_fuse.opt1_label',
            descKey: 'testing.anomalies.carbon_brake_thermal_fuse.opt1_desc',
            costMUSD: 3.5,
            delayDays: 14,
            techDebtAdded: 0,
            safetyReliabilityImpact: 6
          }
        ]
      }
    ]
  },
  {
    id: 'iron_bird_systems_integration',
    nameKey: 'testing.scenarios.iron_bird_systems_integration.name',
    category: 'ground',
    descKey: 'testing.scenarios.iron_bird_systems_integration.desc',
    minPhase: 'ground_testing',
    durationDays: 12,
    flightHoursLogged: 0,
    envelopeGainPercent: 0,
    costMUSD: 6.0,
    isMandatoryForCert: true,
    riskFactor: 20,
    potentialAnomalies: []
  },

  // ==========================================
  // FLIGHT TEST CAMPAIGNS
  // ==========================================
  {
    id: 'basic_handling_qualities',
    nameKey: 'testing.scenarios.basic_handling_qualities.name',
    category: 'flight',
    descKey: 'testing.scenarios.basic_handling_qualities.desc',
    minPhase: 'flight_testing',
    durationDays: 4,
    flightHoursLogged: 20,
    envelopeGainPercent: 5,
    costMUSD: 1.4,
    isMandatoryForCert: false,
    riskFactor: 15,
    potentialAnomalies: []
  },
  {
    id: 'stall_campaign',
    nameKey: 'testing.scenarios.stall_campaign.name',
    category: 'flight',
    descKey: 'testing.scenarios.stall_campaign.desc',
    minPhase: 'flight_testing',
    durationDays: 8,
    flightHoursLogged: 32,
    envelopeGainPercent: 12,
    costMUSD: 2.8,
    isMandatoryForCert: true,
    riskFactor: 40,
    potentialAnomalies: [
      {
        id: 'stick_pusher_pitch_instability',
        titleKey: 'testing.anomalies.stick_pusher_pitch_instability.title',
        descKey: 'testing.anomalies.stick_pusher_pitch_instability.desc',
        severity: 'level_1_major',
        options: [
          {
            labelKey: 'testing.anomalies.stick_pusher_pitch_instability.opt1_label',
            descKey: 'testing.anomalies.stick_pusher_pitch_instability.opt1_desc',
            costMUSD: 12.0,
            delayDays: 30,
            techDebtAdded: 0,
            safetyReliabilityImpact: 8
          },
          {
            labelKey: 'testing.anomalies.stick_pusher_pitch_instability.opt2_label',
            descKey: 'testing.anomalies.stick_pusher_pitch_instability.opt2_desc',
            costMUSD: 4.5,
            delayDays: 14,
            techDebtAdded: 6,
            safetyReliabilityImpact: 2
          }
        ]
      }
    ]
  },
  {
    id: 'flutter_envelope_expansion',
    nameKey: 'testing.scenarios.flutter_envelope_expansion.name',
    category: 'flight',
    descKey: 'testing.scenarios.flutter_envelope_expansion.desc',
    minPhase: 'flight_testing',
    durationDays: 9,
    flightHoursLogged: 42,
    envelopeGainPercent: 15,
    costMUSD: 3.6,
    isMandatoryForCert: true,
    riskFactor: 55,
    potentialAnomalies: [
      {
        id: 'horizontal_stabilizer_resonance',
        titleKey: 'testing.anomalies.horizontal_stabilizer_resonance.title',
        descKey: 'testing.anomalies.horizontal_stabilizer_resonance.desc',
        severity: 'airworthiness_blocker',
        options: [
          {
            labelKey: 'testing.anomalies.horizontal_stabilizer_resonance.opt1_label',
            descKey: 'testing.anomalies.horizontal_stabilizer_resonance.opt1_desc',
            costMUSD: 38.0,
            delayDays: 90,
            techDebtAdded: 0,
            safetyReliabilityImpact: 15
          },
          {
            labelKey: 'testing.anomalies.horizontal_stabilizer_resonance.opt2_label',
            descKey: 'testing.anomalies.horizontal_stabilizer_resonance.opt2_desc',
            costMUSD: 14.5,
            delayDays: 30,
            techDebtAdded: 15,
            safetyReliabilityImpact: 5
          }
        ]
      }
    ]
  },
  {
    id: 'hot_and_high_trials',
    nameKey: 'testing.scenarios.hot_and_high_trials.name',
    category: 'flight',
    descKey: 'testing.scenarios.hot_and_high_trials.desc',
    minPhase: 'flight_testing',
    durationDays: 7,
    flightHoursLogged: 28,
    envelopeGainPercent: 8,
    costMUSD: 2.5,
    isMandatoryForCert: true,
    riskFactor: 35,
    potentialAnomalies: [
      {
        id: 'engine_turbine_interstage_temp_spike',
        titleKey: 'testing.anomalies.engine_turbine_interstage_temp_spike.title',
        descKey: 'testing.anomalies.engine_turbine_interstage_temp_spike.desc',
        severity: 'level_1_major',
        options: [
          {
            labelKey: 'testing.anomalies.engine_turbine_interstage_temp_spike.opt1_label',
            descKey: 'testing.anomalies.engine_turbine_interstage_temp_spike.opt1_desc',
            costMUSD: 24.0,
            delayDays: 60,
            techDebtAdded: 0,
            safetyReliabilityImpact: 12
          },
          {
            labelKey: 'testing.anomalies.engine_turbine_interstage_temp_spike.opt2_label',
            descKey: 'testing.anomalies.engine_turbine_interstage_temp_spike.opt2_desc',
            costMUSD: 1.2,
            delayDays: 10,
            techDebtAdded: 5,
            safetyReliabilityImpact: 2
          }
        ]
      }
    ]
  },
  {
    id: 'natural_icing_campaign',
    nameKey: 'testing.scenarios.natural_icing_campaign.name',
    category: 'flight',
    descKey: 'testing.scenarios.natural_icing_campaign.desc',
    minPhase: 'flight_testing',
    durationDays: 8,
    flightHoursLogged: 34,
    envelopeGainPercent: 10,
    costMUSD: 3.1,
    isMandatoryForCert: true,
    riskFactor: 40,
    potentialAnomalies: [
      {
        id: 'windshield_optical_distortion_ice',
        titleKey: 'testing.anomalies.windshield_optical_distortion_ice.title',
        descKey: 'testing.anomalies.windshield_optical_distortion_ice.desc',
        severity: 'level_2_minor',
        options: [
          {
            labelKey: 'testing.anomalies.windshield_optical_distortion_ice.opt1_label',
            descKey: 'testing.anomalies.windshield_optical_distortion_ice.opt1_desc',
            costMUSD: 5.5,
            delayDays: 25,
            techDebtAdded: 0,
            safetyReliabilityImpact: 6
          },
          {
            labelKey: 'testing.anomalies.windshield_optical_distortion_ice.opt2_label',
            descKey: 'testing.anomalies.windshield_optical_distortion_ice.opt2_desc',
            costMUSD: 0.9,
            delayDays: 8,
            techDebtAdded: 10,
            safetyReliabilityImpact: -2
          }
        ]
      }
    ]
  },
  {
    id: 'crosswind_landing_trials',
    nameKey: 'testing.scenarios.crosswind_landing_trials.name',
    category: 'flight',
    descKey: 'testing.scenarios.crosswind_landing_trials.desc',
    minPhase: 'flight_testing',
    durationDays: 6,
    flightHoursLogged: 24,
    envelopeGainPercent: 7,
    costMUSD: 2.1,
    isMandatoryForCert: true,
    riskFactor: 30,
    potentialAnomalies: [
      {
        id: 'rudder_travel_limit_saturation',
        titleKey: 'testing.anomalies.rudder_travel_limit_saturation.title',
        descKey: 'testing.anomalies.rudder_travel_limit_saturation.desc',
        severity: 'level_1_major',
        options: [
          {
            labelKey: 'testing.anomalies.rudder_travel_limit_saturation.opt1_label',
            descKey: 'testing.anomalies.rudder_travel_limit_saturation.opt1_desc',
            costMUSD: 12.0,
            delayDays: 35,
            techDebtAdded: 0,
            safetyReliabilityImpact: 10
          },
          {
            labelKey: 'testing.anomalies.rudder_travel_limit_saturation.opt2_label',
            descKey: 'testing.anomalies.rudder_travel_limit_saturation.opt2_desc',
            costMUSD: 3.2,
            delayDays: 14,
            techDebtAdded: 6,
            safetyReliabilityImpact: 3
          }
        ]
      }
    ]
  },
  {
    id: 'autoland_cat3_validation',
    nameKey: 'testing.scenarios.autoland_cat3_validation.name',
    category: 'flight',
    descKey: 'testing.scenarios.autoland_cat3_validation.desc',
    minPhase: 'flight_testing',
    durationDays: 6,
    flightHoursLogged: 26,
    envelopeGainPercent: 8,
    costMUSD: 2.4,
    isMandatoryForCert: false,
    riskFactor: 25,
    potentialAnomalies: []
  },
  {
    id: 'long_range_endurance_validation',
    nameKey: 'testing.scenarios.long_range_endurance_validation.name',
    category: 'flight',
    descKey: 'testing.scenarios.long_range_endurance_validation.desc',
    minPhase: 'flight_testing',
    durationDays: 10,
    flightHoursLogged: 48,
    envelopeGainPercent: 12,
    costMUSD: 4.2,
    isMandatoryForCert: false,
    riskFactor: 20,
    potentialAnomalies: []
  }
];
