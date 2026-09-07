// ============================================================================
// PROJECT AIRFRAME - FLIGHT TEST CAMPAIGN & CERTIFICATION
// ============================================================================

import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { useTranslation } from '../../i18n';
import { TEST_SCENARIOS } from '../../data/testCampaigns';
import type { TestScenarioDefinition } from '../../data/testCampaigns';
import {
  Plane,
  Plus,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

export const FlightTestCampaignView: React.FC = () => {
  const { company, selectedProgramId, constructPrototype, setActiveView } = useGameStore();
  const { t } = useTranslation();

  const currentProgram = company.programs.find(p => p.id === selectedProgramId) || company.programs[0];

  const [, setSelectedScenario] = useState<TestScenarioDefinition | null>(null);
  const [activeAnomaly, setActiveAnomaly] = useState<any | null>(null);
  const [testResultFeedback, setTestResultFeedback] = useState<string | null>(null);

  if (!currentProgram) {
    return (
      <div className="w-full h-full p-12 flex flex-col items-center justify-center gap-5 bg-[#0E0F0F] text-center font-sans select-none">
        <div className="w-16 h-16 rounded-2xl bg-[#171818] border border-[rgba(255,255,255,0.07)] flex items-center justify-center text-[#38bdf8]">
          <Plane className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-[#F5F5F3]">No Active Aircraft Program</h3>
        <p className="page-description max-w-md text-sm">
          Design and launch an aircraft program in the studio first before conducting flight test campaigns.
        </p>
        <button
          onClick={() => setActiveView('studio')}
          className="btn-aerospace primary large h-12 px-8 text-sm font-semibold mt-2"
        >
          Open Aircraft Designer
        </button>
      </div>
    );
  }

  const prototypes = currentProgram.prototypesBuilt;
  const progress = currentProgram.testCampaignsProgress;

  const handleRunTestScenario = (scenario: TestScenarioDefinition) => {
    setSelectedScenario(scenario);
    setTestResultFeedback(null);

    if (scenario.potentialAnomalies.length > 0 && Math.random() < scenario.riskFactor / 100) {
      setActiveAnomaly(scenario.potentialAnomalies[0]);
    } else {
      setActiveAnomaly(null);
      setTestResultFeedback(`Test sortie completed with telemetry compliance. 50 flight hours logged.`);
    }
  };

  const handleResolveAnomalyOption = (optionIndex: number) => {
    if (!activeAnomaly) return;
    const opt = activeAnomaly.options[optionIndex];
    setTestResultFeedback(`Resolution applied: "${opt.label}". Cost: $${opt.costMUSD}M, Delay: +${opt.delayDays} days.`);
    setActiveAnomaly(null);
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-[#0E0F0F] text-[#F5F5F3] font-sans select-none">
      <div className="max-w-[1600px] mx-auto px-8 py-10 flex flex-col gap-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[rgba(255,255,255,0.07)]">
          <div>
            <div className="text-xs font-mono font-semibold tracking-wider text-[#73736C] uppercase">
              FLIGHT TEST OPERATIONS // {currentProgram.name}
            </div>
            <h1 className="page-title text-3xl md:text-4xl mt-1">
              {t('testing.title')}
            </h1>
            <p className="page-description max-w-2xl text-sm md:text-base mt-1">
              {t('testing.subtitle')}
            </p>
          </div>

          <button
            onClick={() => constructPrototype(currentProgram.id, 'aerodynamics_envelope')}
            className="btn-aerospace primary large h-12 px-7 text-sm font-semibold flex items-center gap-2.5 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            {t('testing.addPrototype')} ($35M)
          </button>
        </div>

        {/* Telemetry Bar */}
        <div className="bg-[#171818] border border-[rgba(255,255,255,0.08)] rounded-xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8 shadow-sm">
          <div>
            <span className="text-[#73736C] uppercase font-semibold text-xs tracking-wider block">
              {t('testing.flightHours')}
            </span>
            <span className="text-xl font-bold font-mono text-[#F5F5F3] mt-1 block">
              {progress.flightHoursLogged} / {progress.flightHoursRequired} hrs
            </span>
            <div className="w-full h-2 bg-[#242525] rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-[#F5F5F3] rounded-full"
                style={{ width: `${Math.min(100, (progress.flightHoursLogged / progress.flightHoursRequired) * 100)}%` }}
              />
            </div>
          </div>

          <div>
            <span className="text-[#73736C] uppercase font-semibold text-xs tracking-wider block">
              {t('testing.envelopeExpansion')}
            </span>
            <span className="text-xl font-bold font-mono text-[#F5F5F3] mt-1 block">
              {Math.round(progress.flightEnvelopeExpansionPercent)}% Complete
            </span>
            <div className="w-full h-2 bg-[#242525] rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full"
                style={{ width: `${progress.flightEnvelopeExpansionPercent}%` }}
              />
            </div>
          </div>

          <div>
            <span className="text-[#73736C] uppercase font-semibold text-xs tracking-wider block">
              {t('testing.testFleet')}
            </span>
            <span className="text-xl font-bold font-mono text-[#F5F5F3] mt-1 block">
              {prototypes.length} {t('common.aircraft')}
            </span>
            <span className="text-xs text-[#73736C] mt-1 block">Active flight test articles</span>
          </div>

          <div>
            <span className="text-[#73736C] uppercase font-semibold text-xs tracking-wider block">
              {t('testing.certProgress')}
            </span>
            <span className={`text-xl font-bold mt-1 block ${currentProgram.typeCertificateIssued ? 'text-emerald-400' : 'text-amber-400'}`}>
              {currentProgram.typeCertificateIssued ? 'TYPE CERTIFIED' : 'IN AUDIT'}
            </span>
            <span className="text-xs text-[#73736C] mt-1 block">FAA / EASA Part 25</span>
          </div>
        </div>

        {/* Test Feedback Notice */}
        {testResultFeedback && (
          <div className="p-5 bg-[#171818] border border-emerald-500/30 rounded-xl text-xs font-mono text-emerald-400 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>{testResultFeedback}</span>
          </div>
        )}

        {/* Active Anomaly Decision Modal / Banner */}
        {activeAnomaly && (
          <div className="bg-[#171818] border border-amber-500/30 rounded-xl p-8 flex flex-col gap-5">
            <div className="flex items-center gap-2.5 text-amber-400 font-bold text-base">
              <AlertTriangle className="w-5 h-5" />
              <span>FLIGHT TEST ANOMALY DETECTED: {activeAnomaly.title}</span>
            </div>
            <p className="text-sm text-[#A3A39C] leading-relaxed">
              {activeAnomaly.description}
            </p>

            <div className="flex flex-col gap-3 pt-3 border-t border-[rgba(255,255,255,0.07)]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#73736C]">
                Select Engineering Resolution:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeAnomaly.options.map((opt: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => handleResolveAnomalyOption(idx)}
                    className="p-4 bg-[#1E1F1F] hover:bg-[#242525] border border-[rgba(255,255,255,0.07)] rounded-xl text-left transition-all text-xs"
                  >
                    <div className="font-bold text-[#F5F5F3] text-sm">{opt.label}</div>
                    <div className="text-[#A3A39C] mt-1.5 font-mono text-xs">
                      Cost: ${opt.costMUSD}M • Delay: +{opt.delayDays} days
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Available Flight Test Scenarios Grid */}
        <div className="flex flex-col gap-4">
          <h2 className="section-title">
            Certification Flight Test Modules
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {TEST_SCENARIOS.slice(0, 6).map(scenario => (
              <div
                key={scenario.id}
                className="bg-[#171818] border border-[rgba(255,255,255,0.08)] rounded-xl p-6 flex flex-col justify-between gap-5 shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-[#73736C]">
                    <span className="capitalize text-[#38bdf8]">{scenario.category}</span>
                    <span>{scenario.requiredFlightHours} Flight Hrs</span>
                  </div>
                  <h4 className="text-base font-bold text-[#F5F5F3] mt-2">{scenario.name}</h4>
                  <p className="text-xs text-[#A3A39C] mt-1.5 leading-relaxed">{scenario.description}</p>
                </div>

                <div className="pt-4 border-t border-[rgba(255,255,255,0.07)] flex items-center justify-between">
                  <span className="text-xs font-mono text-[#73736C]">
                    Risk: {scenario.riskFactor}%
                  </span>
                  <button
                    onClick={() => handleRunTestScenario(scenario)}
                    disabled={prototypes.length === 0}
                    className="btn-aerospace secondary h-10 px-4 text-xs font-semibold"
                  >
                    {t('testing.conductTest')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
