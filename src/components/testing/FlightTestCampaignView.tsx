// ============================================================================
// PROJECT AIRFRAME - FLIGHT TEST CAMPAIGN & CERTIFICATION OPERATIONS
// ============================================================================

import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { useTranslation, formatNumber } from '../../i18n';
import { TEST_SCENARIOS } from '../../data/testCampaigns';
import type { TestScenarioDefinition } from '../../data/testCampaigns';
import {
  Plane,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Calendar
} from 'lucide-react';

export const FlightTestCampaignView: React.FC = () => {
  const {
    company,
    selectedProgramId,
    constructPrototype,
    scheduleFlightTest,
    resolveCertificationFinding,
    setActiveView
  } = useGameStore();

  const { t, locale, isPtBr } = useTranslation();

  const currentProgram = company.programs.find(p => p.id === selectedProgramId) || company.programs[0];
  const [selectedPrototypeId, setSelectedPrototypeId] = useState<string | undefined>(undefined);
  const [testResultFeedback, setTestResultFeedback] = useState<string | null>(null);

  if (!currentProgram) {
    return (
      <div className="w-full h-full p-12 flex flex-col items-center justify-center gap-5 bg-[#0E0F0F] text-center font-sans select-none">
        <div className="w-16 h-16 rounded-2xl bg-[#171818] border border-[rgba(255,255,255,0.07)] flex items-center justify-center text-[#38bdf8]">
          <Plane className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-[#F5F5F3]">{isPtBr ? 'Nenhum Programa de Aeronave Ativo' : 'No Active Aircraft Program'}</h3>
        <p className="page-description max-w-md text-sm">
          {isPtBr ? 'Projete e lance um programa de aeronave no estúdio primeiro para conduzir ensaios em voo.' : 'Design and launch an aircraft program in the studio first before conducting flight test campaigns.'}
        </p>
        <button
          onClick={() => setActiveView('studio')}
          className="btn-aerospace primary large h-12 px-8 text-sm font-semibold mt-2"
        >
          {t('navigation.aircraft')}
        </button>
      </div>
    );
  }

  const prototypes = currentProgram.prototypesBuilt || [];
  const progress = currentProgram.testCampaignsProgress;
  const activeMissions = currentProgram.activeTestMissions || [];
  const completedScenarios = currentProgram.completedScenarioIds || [];
  const openFindings = currentProgram.certificationFindings.filter(f => f.status !== 'verified_resolved');

  const readyPrototypes = prototypes.filter(p => p.status !== 'under_construction' && !p.currentMissionId);
  const activeProtoId = selectedPrototypeId || readyPrototypes[0]?.id || prototypes[0]?.id;

  const handleScheduleTest = (scenario: TestScenarioDefinition) => {
    if (!activeProtoId) return;
    const success = scheduleFlightTest(currentProgram.id, scenario.id, activeProtoId);
    if (success) {
      setTestResultFeedback(
        isPtBr
          ? `Missão "${t(scenario.nameKey)}" agendada com sucesso com o protótipo. Duração estimada: ${scenario.durationDays} dias.`
          : `Sortie "${t(scenario.nameKey)}" successfully scheduled. Duration: ${scenario.durationDays} days.`
      );
    } else {
      setTestResultFeedback(
        isPtBr
          ? 'Falha ao agendar: fundos insuficientes ou protótipo ocupado/em construção.'
          : 'Failed to schedule: insufficient treasury funds or prototype busy/under construction.'
      );
    }
  };

  const handleResolveFinding = (findingId: string, optionIndex: number) => {
    resolveCertificationFinding(currentProgram.id, findingId, optionIndex);
    setTestResultFeedback(isPtBr ? 'Anomalia de certificação resolvida com sucesso.' : 'Certification finding resolved successfully.');
  };

  // Gate readiness checklist
  const reqHours = progress.flightHoursRequired || 1800;
  const hoursDone = progress.flightHoursLogged >= reqHours;
  const envelopeDone = progress.flightEnvelopeExpansionPercent >= 95;
  const mandatoryScenariosDone = TEST_SCENARIOS.filter(s => s.isMandatoryForCert).every(s => completedScenarios.includes(s.id));
  const noBlockers = !openFindings.some(f => f.severity === 'airworthiness_blocker');

  return (
    <div className="w-full h-full overflow-y-auto bg-[#0E0F0F] text-[#F5F5F3] font-sans select-none">
      <div className="max-w-[1600px] mx-auto px-8 py-10 flex flex-col gap-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[rgba(255,255,255,0.07)]">
          <div>
            <div className="text-xs font-mono font-semibold tracking-wider text-[#73736C] uppercase">
              {isPtBr ? `OPERAÇÕES DE ENSAIO EM VOO // ${currentProgram.name}` : `FLIGHT TEST OPERATIONS // ${currentProgram.name}`}
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
            {t('testing.addPrototype')}
          </button>
        </div>

        {/* Telemetry Bar */}
        <div className="bg-[#171818] border border-[rgba(255,255,255,0.08)] rounded-xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8 shadow-sm">
          <div>
            <span className="text-[#73736C] uppercase font-semibold text-xs tracking-wider block">
              {t('testing.flightHours')}
            </span>
            <span className="text-xl font-bold font-mono text-[#F5F5F3] mt-1 block">
              {formatNumber(progress.flightHoursLogged, undefined, locale)} / {reqHours} hrs
            </span>
            <div className="w-full h-2 bg-[#242525] rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-[#38bdf8] rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (progress.flightHoursLogged / reqHours) * 100)}%` }}
              />
            </div>
          </div>

          <div>
            <span className="text-[#73736C] uppercase font-semibold text-xs tracking-wider block">
              {t('testing.envelopeExpansion')}
            </span>
            <span className="text-xl font-bold font-mono text-[#F5F5F3] mt-1 block">
              {Math.round(progress.flightEnvelopeExpansionPercent)}% {isPtBr ? 'Completo' : 'Complete'}
            </span>
            <div className="w-full h-2 bg-[#242525] rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-300"
                style={{ width: `${progress.flightEnvelopeExpansionPercent}%` }}
              />
            </div>
          </div>

          <div>
            <span className="text-[#73736C] uppercase font-semibold text-xs tracking-wider block">
              {t('testing.testFleet')}
            </span>
            <span className="text-xl font-bold font-mono text-[#F5F5F3] mt-1 block">
              {prototypes.length} {isPtBr ? 'Protótipo(s)' : 'Articles'}
            </span>
            <span className="text-xs text-[#73736C] mt-1 block">
              {readyPrototypes.length} {isPtBr ? 'disponíveis para voo' : 'ready for sortie'}
            </span>
          </div>

          <div>
            <span className="text-[#73736C] uppercase font-semibold text-xs tracking-wider block">
              {t('testing.certProgress')}
            </span>
            <span className={`text-xl font-bold mt-1 block ${currentProgram.typeCertificateIssued ? 'text-emerald-400' : 'text-amber-400'}`}>
              {currentProgram.typeCertificateIssued ? (isPtBr ? 'CERTIFICADO DE TIPO' : 'TYPE CERTIFIED') : (isPtBr ? 'EM AUDITORIA' : 'IN AUDIT')}
            </span>
            <span className="text-xs text-[#73736C] mt-1 block">FAA / EASA Part 25</span>
          </div>
        </div>

        {/* Feedback Banner */}
        {testResultFeedback && (
          <div className="p-4 bg-[#171818] border border-emerald-500/40 rounded-xl text-xs font-mono text-emerald-400 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>{testResultFeedback}</span>
            </div>
            <button onClick={() => setTestResultFeedback(null)} className="text-[#73736C] hover:text-[#F5F5F3]">✕</button>
          </div>
        )}

        {/* Gate Blockers & Prerequisites (Directives #10 & #11) */}
        <div className="bg-[#171818] border border-[rgba(255,255,255,0.08)] rounded-xl p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#A3A39C] flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#38bdf8]" />
              {isPtBr ? 'Requisitos Mandatórios para Certificação de Tipo' : 'Type Certification Gate Requirements'}
            </h3>
            <span className="text-xs font-mono text-[#73736C]">
              {mandatoryScenariosDone && hoursDone && envelopeDone && noBlockers ? (isPtBr ? 'PRONTO PARA CERTIFICAÇÃO' : 'READY FOR CERTIFICATION') : (isPtBr ? 'PENDÊNCIAS EM ABERTO' : 'PENDING REQUIREMENTS')}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
            <div className={`p-3 rounded-lg border ${hoursDone ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400' : 'bg-[#1E1F1F] border-[rgba(255,255,255,0.07)] text-[#A3A39C]'}`}>
              <div className="flex items-center gap-2 font-bold">
                {hoursDone ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Clock className="w-4 h-4 text-amber-400" />}
                <span>1,800 Flight Hours</span>
              </div>
              <div className="text-[11px] mt-1 text-[#73736C]">
                {progress.flightHoursLogged} / {reqHours} hrs ({Math.round((progress.flightHoursLogged / reqHours) * 100)}%)
              </div>
            </div>

            <div className={`p-3 rounded-lg border ${envelopeDone ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400' : 'bg-[#1E1F1F] border-[rgba(255,255,255,0.07)] text-[#A3A39C]'}`}>
              <div className="flex items-center gap-2 font-bold">
                {envelopeDone ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Clock className="w-4 h-4 text-amber-400" />}
                <span>95% Envelope Expansion</span>
              </div>
              <div className="text-[11px] mt-1 text-[#73736C]">
                {Math.round(progress.flightEnvelopeExpansionPercent)}% / 95%
              </div>
            </div>

            <div className={`p-3 rounded-lg border ${mandatoryScenariosDone ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400' : 'bg-[#1E1F1F] border-[rgba(255,255,255,0.07)] text-[#A3A39C]'}`}>
              <div className="flex items-center gap-2 font-bold">
                {mandatoryScenariosDone ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Clock className="w-4 h-4 text-amber-400" />}
                <span>Mandatory Scenarios</span>
              </div>
              <div className="text-[11px] mt-1 text-[#73736C]">
                {TEST_SCENARIOS.filter(s => s.isMandatoryForCert && completedScenarios.includes(s.id)).length} / {TEST_SCENARIOS.filter(s => s.isMandatoryForCert).length} {isPtBr ? 'concluídos' : 'completed'}
              </div>
            </div>

            <div className={`p-3 rounded-lg border ${noBlockers ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400' : 'bg-rose-950/20 border-rose-500/30 text-rose-400'}`}>
              <div className="flex items-center gap-2 font-bold">
                {noBlockers ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />}
                <span>Airworthiness Findings</span>
              </div>
              <div className="text-[11px] mt-1 text-[#73736C]">
                {openFindings.length} {isPtBr ? 'anomalias abertas' : 'open findings'}
              </div>
            </div>
          </div>
        </div>

        {/* Prototype Fleet List */}
        <div className="flex flex-col gap-4">
          <h2 className="section-title">
            {t('testing.testFleet')} ({prototypes.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {prototypes.map(pt => (
              <div
                key={pt.id}
                onClick={() => pt.status !== 'under_construction' && setSelectedPrototypeId(pt.id)}
                className={`p-6 rounded-xl border transition-all cursor-pointer ${
                  activeProtoId === pt.id
                    ? 'bg-[#1E1F1F] border-[#38bdf8] shadow-md'
                    : 'bg-[#171818] border-[rgba(255,255,255,0.08)]'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-base text-[#F5F5F3]">{pt.serialNumber}</div>
                    <div className="text-xs text-[#A3A39C] mt-0.5">{pt.name}</div>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                    pt.status === 'under_construction'
                      ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                      : pt.currentMissionId
                      ? 'bg-sky-500/10 text-sky-300 border border-sky-500/30'
                      : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {pt.status === 'under_construction' ? (isPtBr ? 'EM CONSTRUÇÃO' : 'UNDER BUILD') : pt.currentMissionId ? (isPtBr ? 'EM VOO' : 'IN SORTIE') : (isPtBr ? 'DISPONÍVEL' : 'AVAILABLE')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-[rgba(255,255,255,0.07)] text-xs font-mono">
                  <div>
                    <span className="text-[#73736C] block">{isPtBr ? 'Horas de Voo:' : 'Flight Hours:'}</span>
                    <span className="font-bold text-[#F5F5F3] mt-0.5 block">{pt.flightHours} hrs</span>
                  </div>
                  <div>
                    <span className="text-[#73736C] block">{isPtBr ? 'Ciclos Realizados:' : 'Cycles Logged:'}</span>
                    <span className="font-bold text-[#F5F5F3] mt-0.5 block">{pt.cycles} cycles</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Open Findings / Anomalies (Directives #5, #7) */}
        {openFindings.length > 0 && (
          <div className="flex flex-col gap-4">
            <h2 className="section-title text-rose-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              {isPtBr ? 'Anomalias Críticas e Findings de Certificação' : 'Open Airworthiness Findings'} ({openFindings.length})
            </h2>

            <div className="flex flex-col gap-4">
              {openFindings.map(f => {
                const scenario = TEST_SCENARIOS.flatMap(s => s.potentialAnomalies).find(a => a.id === f.id);
                return (
                  <div key={f.id} className="bg-[#171818] border border-rose-500/30 rounded-xl p-6 flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-base font-bold text-rose-300">{t(f.titleKey)}</div>
                        <div className="text-xs text-[#A3A39C] mt-1">{t(f.descKey)}</div>
                      </div>
                      <span className="text-xs font-mono px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 font-bold uppercase">
                        {f.severity.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-[rgba(255,255,255,0.07)] flex flex-col gap-2">
                      <span className="text-xs font-semibold text-[#73736C] uppercase">{isPtBr ? 'Selecione a Resolução de Engenharia:' : 'Select Engineering Resolution:'}</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {scenario?.options.map((opt, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleResolveFinding(f.id, idx)}
                            className="p-4 bg-[#1E1F1F] hover:bg-[#242525] border border-[rgba(255,255,255,0.07)] rounded-xl text-left transition-all text-xs"
                          >
                            <div className="font-bold text-[#F5F5F3]">{t(opt.labelKey)}</div>
                            <div className="text-[#73736C] mt-1 font-mono">
                              {isPtBr ? `Custo: US$ ${opt.costMUSD}M • Atraso: +${opt.delayDays} dias` : `Cost: $${opt.costMUSD}M • Delay: +${opt.delayDays} days`}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Test Scenarios Grid (Directives #5, #6, #7, #9) */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="section-title">
              {isPtBr ? 'Módulos e Campanhas de Ensaio' : 'Flight & Ground Test Scenarios'}
            </h2>
            <span className="text-xs text-[#A3A39C] font-mono">
              {isPtBr ? 'Protótipo Selecionado:' : 'Selected Prototype:'} <span className="text-[#38bdf8] font-bold">{activeProtoId || 'None'}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {TEST_SCENARIOS.map(scenario => {
              const isCompleted = completedScenarios.includes(scenario.id);
              const isRunning = activeMissions.some(m => m.scenarioId === scenario.id);
              const mission = activeMissions.find(m => m.scenarioId === scenario.id);

              return (
                <div
                  key={scenario.id}
                  className={`bg-[#171818] border rounded-xl p-6 flex flex-col justify-between gap-5 shadow-sm transition-all ${
                    isCompleted
                      ? 'border-emerald-500/30'
                      : isRunning
                      ? 'border-sky-500/40'
                      : 'border-[rgba(255,255,255,0.08)]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono text-[#73736C]">
                      <span className="capitalize text-[#38bdf8] font-bold">{scenario.category}</span>
                      {scenario.isMandatoryForCert && (
                        <span className="text-amber-400 font-bold uppercase text-[10px]">{isPtBr ? 'MANDATÓRIO' : 'MANDATORY'}</span>
                      )}
                    </div>
                    <h4 className="text-base font-bold text-[#F5F5F3] mt-2">{t(scenario.nameKey)}</h4>
                    <p className="text-xs text-[#A3A39C] mt-1.5 leading-relaxed">{t(scenario.descKey)}</p>

                    {/* Scenario Metrics */}
                    <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[rgba(255,255,255,0.07)] text-xs font-mono">
                      <div>
                        <span className="text-[#73736C] block text-[10px]">{isPtBr ? 'Duração:' : 'Duration:'}</span>
                        <span className="text-[#F5F5F3] font-bold">{scenario.durationDays}d</span>
                      </div>
                      <div>
                        <span className="text-[#73736C] block text-[10px]">{isPtBr ? 'Horas:' : 'Hours:'}</span>
                        <span className="text-[#F5F5F3] font-bold">+{scenario.flightHoursLogged}h</span>
                      </div>
                      <div>
                        <span className="text-[#73736C] block text-[10px]">{isPtBr ? 'Custo:' : 'Cost:'}</span>
                        <span className="text-[#F5F5F3] font-bold">US${scenario.costMUSD}M</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[rgba(255,255,255,0.07)] flex items-center justify-between">
                    {isRunning ? (
                      <div className="text-xs text-sky-400 font-mono font-bold flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {isPtBr ? `Em voo (Dia ${mission?.daysElapsed}/${mission?.durationDays})` : `Running (Day ${mission?.daysElapsed}/${mission?.durationDays})`}
                      </div>
                    ) : isCompleted ? (
                      <div className="text-xs text-emerald-400 font-mono font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        {isPtBr ? 'Concluído' : 'Completed'}
                      </div>
                    ) : (
                      <button
                        onClick={() => handleScheduleTest(scenario)}
                        disabled={readyPrototypes.length === 0}
                        className="btn-aerospace secondary h-10 px-4 text-xs font-semibold w-full"
                      >
                        {t('testing.conductTest')}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
