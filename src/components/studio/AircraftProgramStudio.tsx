// ============================================================================
// PROJECT AIRFRAME - GUIDED 14-STEP AIRCRAFT ENGINEERING DESIGNER WIZARD
// ============================================================================

import React, { useState } from 'react';
import { useGameStore, DEFAULT_AIRCRAFT_DRAFT } from '../../store/gameStore';
import { useTranslation, formatCurrency, formatDistance } from '../../i18n';
import { TechnicalBlueprint } from './TechnicalBlueprint';
import type {
  MarketSegmentId,
  MaterialType,
  WingletType,
  FlightControlTech,
  CockpitTech,
  AircraftDraft
} from '../../types';
import { THIRD_PARTY_ENGINE_CATALOG } from '../../data/suppliers';
import {
  synthesizeAircraftSpecs,
  detectDesignSanityWarnings,
  calculateDesignDelta
} from '../../simulation/formulas';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Rocket,
  Plus,
  AlertTriangle,
  HelpCircle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

const TOTAL_STEPS = 14;

const STEP_TITLES_KEYS = [
  'Mission & Category',
  'Cabin Cross-Section',
  'Fuselage & Capacity',
  'Wing Planform & Span',
  'Wing Sweep & Speed',
  'Wingtip Devices',
  'Structural Materials',
  'Propulsion Integration',
  'Flight Controls & FBW',
  'Cockpit & Avionics',
  'Systems & Pressurization',
  'Passenger Experience',
  'Performance Trade-Offs',
  'Final Program Review'
];

export const AircraftProgramStudio: React.FC = () => {
  const {
    company,
    selectedProgramId,
    setSelectedProgramId,
    createAircraftProgram,
    aircraftDraft,
    updateAircraftDraft,
    setAircraftDraftStep
  } = useGameStore();

  const { t, locale, isPtBr } = useTranslation();

  const [isDesigningNew, setIsDesigningNew] = useState(
    !selectedProgramId || company.programs.length === 0
  );
  const [showTechDetails, setShowTechDetails] = useState(false);
  const [showWhyReasoning, setShowWhyReasoning] = useState(false);

  // Active Draft state
  const step = aircraftDraft.currentStep || 1;
  const geom = aircraftDraft.geometry;
  const prop = aircraftDraft.propulsion;
  const sys = aircraftDraft.systems;
  const segment = aircraftDraft.marketSegment;
  const progName = aircraftDraft.name;

  // Synthesize current specs & baseline for delta comparison
  const synth = synthesizeAircraftSpecs(geom, prop, sys, segment);
  const baselineSynth = synthesizeAircraftSpecs(
    DEFAULT_AIRCRAFT_DRAFT.geometry,
    DEFAULT_AIRCRAFT_DRAFT.propulsion,
    DEFAULT_AIRCRAFT_DRAFT.systems,
    DEFAULT_AIRCRAFT_DRAFT.marketSegment
  );

  const deltas = calculateDesignDelta(baselineSynth, synth);
  const warnings = detectDesignSanityWarnings(geom, prop, sys, synth.mass, synth.perf);

  const handleNextStep = () => {
    if (step < TOTAL_STEPS) {
      setAircraftDraftStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setAircraftDraftStep(step - 1);
    }
  };

  const handleLaunchProgram = () => {
    createAircraftProgram({
      name: progName,
      marketSegment: segment,
      geometry: geom,
      propulsion: prop,
      systems: sys,
      livery: aircraftDraft.livery
    });
    setIsDesigningNew(false);
  };

  // Active component highlight in CAD blueprint
  const getHighlightComponent = (): 'fuselage' | 'wing' | 'propulsion' | 'winglet' | 'cabin' | 'all' => {
    if (step === 2 || step === 3) return 'fuselage';
    if (step === 4 || step === 5) return 'wing';
    if (step === 6) return 'winglet';
    if (step === 8) return 'propulsion';
    return 'all';
  };

  // If viewing existing programs
  if (!isDesigningNew && company.programs.length > 0) {
    const selectedProg = company.programs.find(p => p.id === selectedProgramId) || company.programs[0];
    const progSynth = synthesizeAircraftSpecs(selectedProg.geometry, selectedProg.propulsion, selectedProg.systems, selectedProg.marketSegment);

    return (
      <div className="w-full h-full flex flex-col bg-[#0D0D0D] text-[#F5F5F3] overflow-hidden select-none font-sans">
        {/* Header */}
        <div className="h-16 px-8 border-b border-[#242424] bg-[#141414] flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-[#F5F5F3]">
              {t('navigation.aircraft')}
            </h1>
            <p className="text-xs text-[#A1A19A]">
              {isPtBr ? 'Gerencie famílias de aeronaves comerciais, desenvolvimento e iterações de projeto.' : 'Manage commercial airliner families, active development, and design iterations.'}
            </p>
          </div>

          <button
            onClick={() => {
              setIsDesigningNew(true);
              setAircraftDraftStep(1);
            }}
            className="btn-aerospace primary h-10 px-5 flex items-center gap-2 text-xs font-semibold shadow-md"
          >
            <Plus className="w-4 h-4" />
            {isPtBr ? '+ Novo Projeto de Aeronave' : '+ New Aircraft Program'}
          </button>
        </div>

        {/* Workspace: Program Selector & Active Aircraft Details */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Program List */}
          <div className="w-72 bg-[#141414] border-r border-[#242424] p-4 flex flex-col gap-2 overflow-y-auto">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#666660] px-2 py-1">
              {isPtBr ? `Programas Ativos (${company.programs.length})` : `Active Programs (${company.programs.length})`}
            </div>
            {company.programs.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedProgramId(p.id)}
                className={`w-full p-3 rounded-md text-left transition-all ${
                  p.id === selectedProg.id
                    ? 'bg-[#242424] text-[#F5F5F3] border border-[#3D3D3D]'
                    : 'bg-[#1B1B1B] text-[#A1A19A] hover:bg-[#242424] border border-transparent'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">{p.name}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#303030] text-[#A1A19A] uppercase">
                    {p.currentPhase.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="text-xs text-[#666660] mt-1 capitalize">
                  {p.marketSegment.replace(/_/g, ' ')} • {p.geometry.typicalSeats} pax
                </div>
              </button>
            ))}
          </div>

          {/* Center: CAD Blueprint */}
          <div className="flex-1 h-full relative">
            <TechnicalBlueprint
              geometry={selectedProg.geometry}
              propulsion={selectedProg.propulsion}
              highlightComponent="all"
            />
          </div>

          {/* Right: Program Telemetry & Specs */}
          <div className="w-96 bg-[#141414] border-l border-[#242424] p-6 flex flex-col gap-6 overflow-y-auto font-sans">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-[#666660]">
                {isPtBr ? 'ESPECIFICAÇÕES DO PROGRAMA' : 'PROGRAM SPECIFICATIONS'}
              </div>
              <h2 className="text-2xl font-bold text-[#F5F5F3] mt-1">{selectedProg.name}</h2>
              <div className="text-sm text-[#A1A19A] capitalize">
                {selectedProg.marketSegment.replace(/_/g, ' ')}
              </div>
            </div>

            {/* Key Inline Data Metrics */}
            <div className="grid grid-cols-2 gap-4 py-4 border-y border-[#242424] font-mono text-sm">
              <div>
                <div className="text-[11px] text-[#666660] uppercase">{isPtBr ? 'Alcance Máximo' : 'Max Range'}</div>
                <div className="text-lg font-semibold text-[#F5F5F3]">{formatDistance(progSynth.perf.rangeKm, locale)}</div>
              </div>
              <div>
                <div className="text-[11px] text-[#666660] uppercase">{isPtBr ? 'Assentos' : 'Passenger Seats'}</div>
                <div className="text-lg font-semibold text-[#F5F5F3]">{selectedProg.geometry.typicalSeats} pax</div>
              </div>
              <div>
                <div className="text-[11px] text-[#666660] uppercase">MTOW</div>
                <div className="text-lg font-semibold text-[#F5F5F3]">{(progSynth.mass.mtowKg / 1000).toFixed(1)} t</div>
              </div>
              <div>
                <div className="text-[11px] text-[#666660] uppercase">{isPtBr ? 'Preço de Tabela' : 'List Price'}</div>
                <div className="text-lg font-semibold text-[#F5F5F3]">{formatCurrency(progSynth.listPrice, locale)}</div>
              </div>
            </div>

            {/* Program Status & Orders */}
            <div className="flex flex-col gap-3 font-mono text-xs">
              <div className="flex items-center justify-between text-[#A1A19A]">
                <span>{isPtBr ? 'Pedidos em Carteira:' : 'Backlog Orders:'}</span>
                <span className="text-[#F5F5F3] font-bold">{selectedProg.ordersBacklogCount} {isPtBr ? 'unidades' : 'units'}</span>
              </div>
              <div className="flex items-center justify-between text-[#A1A19A]">
                <span>{isPtBr ? 'Entregas Realizadas:' : 'Total Deliveries:'}</span>
                <span className="text-[#F5F5F3] font-bold">{selectedProg.totalDeliveriesCount} {isPtBr ? 'em serviço' : 'in service'}</span>
              </div>
              <div className="flex items-center justify-between text-[#A1A19A]">
                <span>{isPtBr ? 'Certificação:' : 'Certification Status:'}</span>
                <span className={selectedProg.typeCertificateIssued ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                  {selectedProg.typeCertificateIssued ? (isPtBr ? 'CERTIFICADO DE TIPO EMITIDO' : 'TYPE CERTIFIED') : (isPtBr ? 'EM DESENVOLVIMENTO' : 'IN DEVELOPMENT')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // GUIDED 14-STEP AIRCRAFT CREATION WIZARD
  // ==========================================================================
  return (
    <div className="w-full h-full flex flex-col bg-[#0D0D0D] text-[#F5F5F3] overflow-hidden select-none font-sans">
      {/* Top Header */}
      <div className="h-16 px-8 border-b border-[#242424] bg-[#141414] flex items-center justify-between">
        <div className="flex items-center gap-6">
          {company.programs.length > 0 && (
            <button
              onClick={() => setIsDesigningNew(false)}
              className="text-xs text-[#A1A19A] hover:text-[#F5F5F3] flex items-center gap-1 font-mono"
            >
              <ChevronLeft className="w-4 h-4" /> {t('common.cancel')}
            </button>
          )}

          <div>
            <div className="text-[11px] font-mono text-[#666660] uppercase tracking-wider">
              {isPtBr ? `ETAPA ${step.toString().padStart(2, '0')} DE ${TOTAL_STEPS} • ${STEP_TITLES_KEYS[step - 1].toUpperCase()}` : `STEP ${step.toString().padStart(2, '0')} OF ${TOTAL_STEPS} • ${STEP_TITLES_KEYS[step - 1].toUpperCase()}`}
            </div>
            <div className="text-base font-semibold text-[#F5F5F3] tracking-tight">
              {progName} — {isPtBr ? 'Projeto Clean-Sheet' : 'Clean-Sheet Development'}
            </div>
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="flex items-center gap-3">
          <div className="w-48 h-2 bg-[#242424] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#38bdf8] transition-all duration-200"
              style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            />
          </div>
          <span className="text-xs font-mono text-[#666660]">
            {Math.round((step / TOTAL_STEPS) * 100)}%
          </span>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left / Center: CAD Blueprint */}
        <div className="flex-1 h-full relative border-r border-[#242424]">
          <TechnicalBlueprint
            geometry={geom}
            propulsion={prop}
            highlightComponent={getHighlightComponent()}
          />
        </div>

        {/* Right: Step Decision Panel */}
        <div className="w-[480px] bg-[#141414] flex flex-col justify-between p-7 overflow-y-auto">
          <div className="flex flex-col gap-5">
            {/* Step Header */}
            <div>
              <h2 className="text-xl font-semibold text-[#F5F5F3] tracking-tight">
                {STEP_TITLES_KEYS[step - 1]}
              </h2>
              <p className="text-xs text-[#A1A19A] mt-1 leading-relaxed">
                {getStepDescription(step, isPtBr)}
              </p>
            </div>

            {/* Design Sanity Warnings */}
            {warnings.length > 0 && (
              <div className="flex flex-col gap-2">
                {warnings.map(w => (
                  <div
                    key={w.id}
                    className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
                      w.type === 'critical'
                        ? 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                        : 'bg-amber-950/30 border-amber-500/40 text-amber-300'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold font-mono">{t(w.titleKey, w.params)}</div>
                      <div className="text-[11px] opacity-90 mt-0.5">{t(w.descKey, w.params)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Decision Controls */}
            <div className="flex flex-col gap-4">
              {renderStepControls(step, aircraftDraft, updateAircraftDraft, isPtBr)}
            </div>

            {/* Direct Impact Deltas vs Baseline */}
            <div className="pt-4 border-t border-[#242424] flex flex-col gap-2.5">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#666660] flex items-center justify-between">
                <span>{isPtBr ? 'IMPACTO E VARIAÇÃO DO PROJETO' : 'DESIGN IMPACT & DELTAS'}</span>
                <span className="text-[10px] text-[#73736C]">{isPtBr ? 'vs Linha Base' : 'vs Baseline'}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-2.5 bg-[#1B1B1B] rounded border border-[#242424] flex flex-col gap-1">
                  <span className="text-[10px] text-[#A1A19A] uppercase">{isPtBr ? 'Alcance de Projeto' : 'Design Range'}</span>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#F5F5F3]">{formatDistance(synth.perf.rangeKm, locale)}</span>
                    <span className={`text-[10px] flex items-center ${deltas.deltaRangeKm >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {deltas.deltaRangeKm >= 0 ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                      {deltas.deltaRangeKm >= 0 ? `+${deltas.deltaRangeKm}` : deltas.deltaRangeKm} km
                    </span>
                  </div>
                </div>

                <div className="p-2.5 bg-[#1B1B1B] rounded border border-[#242424] flex flex-col gap-1">
                  <span className="text-[10px] text-[#A1A19A] uppercase">{isPtBr ? 'Consumo / Assento' : 'Fuel / Seat-km'}</span>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#F5F5F3]">{synth.perf.fuelBurnKgPerSeat1000Km.toFixed(1)} L</span>
                    <span className={`text-[10px] flex items-center ${deltas.deltaFuelBurnPercent <= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {deltas.deltaFuelBurnPercent <= 0 ? <TrendingDown className="w-3 h-3 mr-0.5" /> : <TrendingUp className="w-3 h-3 mr-0.5" />}
                      {deltas.deltaFuelBurnPercent > 0 ? `+${deltas.deltaFuelBurnPercent}` : deltas.deltaFuelBurnPercent}%
                    </span>
                  </div>
                </div>

                <div className="p-2.5 bg-[#1B1B1B] rounded border border-[#242424] flex flex-col gap-1">
                  <span className="text-[10px] text-[#A1A19A] uppercase">MTOW</span>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#F5F5F3]">{(synth.mass.mtowKg / 1000).toFixed(1)} t</span>
                    <span className="text-[10px] text-[#A1A19A]">
                      {deltas.deltaMtowKg >= 0 ? `+${(deltas.deltaMtowKg / 1000).toFixed(1)}` : (deltas.deltaMtowKg / 1000).toFixed(1)} t
                    </span>
                  </div>
                </div>

                <div className="p-2.5 bg-[#1B1B1B] rounded border border-[#242424] flex flex-col gap-1">
                  <span className="text-[10px] text-[#A1A19A] uppercase">{isPtBr ? 'Pista Decolagem' : 'Takeoff Field'}</span>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#F5F5F3]">{Math.round(synth.perf.takeoffFieldLengthMeters)} m</span>
                    <span className={`text-[10px] ${deltas.deltaToflMeters <= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {deltas.deltaToflMeters >= 0 ? `+${deltas.deltaToflMeters}` : deltas.deltaToflMeters} m
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* "Why?" Educational Drawer */}
            <div className="border border-[#242424] rounded-md bg-[#1B1B1B] overflow-hidden">
              <button
                onClick={() => setShowWhyReasoning(!showWhyReasoning)}
                className="w-full px-4 py-2.5 flex items-center justify-between text-xs text-[#38bdf8] hover:text-[#7dd3fc] transition-colors"
              >
                <span className="font-mono uppercase text-[11px] flex items-center gap-1.5 font-bold">
                  <HelpCircle className="w-3.5 h-3.5" />
                  {isPtBr ? 'Por que essa escolha importa?' : 'Why does this trade-off matter?'}
                </span>
                {showWhyReasoning ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showWhyReasoning && (
                <div className="p-4 border-t border-[#242424] text-xs text-[#A1A19A] leading-relaxed bg-[#141414]">
                  {getStepWhyReasoning(step, isPtBr)}
                </div>
              )}
            </div>

            {/* Technical Engineering Telemetry Drawer */}
            <div className="border border-[#242424] rounded-md bg-[#1B1B1B] overflow-hidden">
              <button
                onClick={() => setShowTechDetails(!showTechDetails)}
                className="w-full px-4 py-2.5 flex items-center justify-between text-xs text-[#A1A19A] hover:text-[#F5F5F3] transition-colors"
              >
                <span className="font-mono uppercase text-[11px]">{isPtBr ? 'Detalhes Técnicos de Engenharia' : 'Technical Engineering Details'}</span>
                {showTechDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showTechDetails && (
                <div className="p-4 border-t border-[#242424] font-mono text-[11px] text-[#A1A19A] flex flex-col gap-2 bg-[#141414]">
                  <div className="flex justify-between">
                    <span>Aspect Ratio (AR):</span>
                    <span className="text-[#F5F5F3]">{(Math.pow(geom.wingSpan, 2) / geom.wingArea).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Wing Loading (W/S):</span>
                    <span className="text-[#F5F5F3]">{(synth.mass.mtowKg / geom.wingArea).toFixed(1)} kg/m²</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Max Cruise L/D:</span>
                    <span className="text-[#F5F5F3]">{synth.perf.liftToDragRatioCruise.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Operating Empty Mass (OEW):</span>
                    <span className="text-[#F5F5F3]">{(synth.mass.oewKg / 1000).toFixed(1)} t</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Breguet Cruise Velocity:</span>
                    <span className="text-[#F5F5F3]">Mach {synth.perf.cruiseMach.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="pt-6 border-t border-[#242424] flex items-center justify-between gap-4">
            <button
              onClick={handlePrevStep}
              disabled={step === 1}
              className="btn-aerospace secondary h-11 px-5 flex items-center gap-2 text-xs font-semibold"
            >
              <ChevronLeft className="w-4 h-4" /> {t('common.back')}
            </button>

            {step < TOTAL_STEPS ? (
              <button
                onClick={handleNextStep}
                className="btn-aerospace primary h-11 px-6 flex items-center gap-2 text-xs font-semibold"
              >
                {t('common.continue')} <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleLaunchProgram}
                className="btn-aerospace primary h-11 px-6 flex items-center gap-2 font-bold text-xs shadow-lg"
              >
                <Rocket className="w-4 h-4" /> {isPtBr ? 'Lançar Programa' : 'Launch Program'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getStepDescription(step: number, isPtBr: boolean): string {
  if (isPtBr) {
    switch (step) {
      case 1: return 'Selecione o segmento comercial alvo e atribua a designação oficial do programa.';
      case 2: return 'Defina o diâmetro da fuselagem e a disposição de assentos por fileira.';
      case 3: return 'Configure o comprimento da cabine, distância entre poltronas e capacidade de passageiros.';
      case 4: return 'Dimensione a área de sustentação e a envergadura das asas.';
      case 5: return 'Ajuste o ângulo de enflechamento para a velocidade Mach de cruzeiro desejada.';
      case 6: return 'Selecione dispositivos de ponta de asa (winglets) para reduzir o arrasto induzido.';
      case 7: return 'Escolha os materiais estruturais para a fuselagem e caixas de asa.';
      case 8: return 'Selecione turbofans de alta eficiência e o empuxo unitário.';
      case 9: return 'Configure as leis de controle de voo Fly-By-Wire e proteção de envelope.';
      case 10: return 'Equipe os aviônicos do cockpit, telas panorâmicas e pouso automático CAT III.';
      case 11: return 'Defina a altitude de pressurização da cabine e redundância hidráulica.';
      case 12: return 'Ajuste o conforto dos passageiros, isolamento acústico e conectividade.';
      case 13: return 'Revise os desempenhos aerodinâmicos, custos operacionais e preço de tabela.';
      case 14: return 'Conclua a autorização de engenharia e oficialize o lançamento do programa de P&D.';
      default: return '';
    }
  }

  switch (step) {
    case 1: return 'Select target commercial market category and assign official program designation.';
    case 2: return 'Define fuselage cross-section diameter and seating abreast arrangement.';
    case 3: return 'Configure passenger cabin length, seat pitch, and total passenger payload.';
    case 4: return 'Dimension the aerodynamic lifting surface area and total wingspan.';
    case 5: return 'Set wing sweep angle for target cruise Mach number and high-speed efficiency.';
    case 6: return 'Select aerodynamic wingtip devices to reduce induced vortex drag.';
    case 7: return 'Choose structural materials for the airframe, fuselage barrel, and wings.';
    case 8: return 'Select high-efficiency turbofan propulsion units and thrust rating.';
    case 9: return 'Configure flight control laws, sidestick architecture, and envelope protection.';
    case 10: return 'Equip flight deck avionics, panoramic displays, and low-visibility autoland.';
    case 11: return 'Set environmental control systems, hydraulic redundancy, and cabin altitude.';
    case 12: return 'Customize passenger cabin lighting, acoustics, and inflight connectivity.';
    case 13: return 'Review aerodynamic polar performance and economic operating costs.';
    case 14: return 'Conduct final engineering sign-off and officially authorize R&D program rollout.';
    default: return '';
  }
}

function getStepWhyReasoning(step: number, isPtBr: boolean): string {
  if (isPtBr) {
    switch (step) {
      case 2:
      case 3: return 'O diâmetro e comprimento determinam o espaço interno dos passageiros e a capacidade de carga no porão, porém afetam o arrasto de fricção.';
      case 4: return 'Asas com maior envergadura diminuem o arrasto induzido durante o cruzeiro, mas exigem reforços estruturais mais pesados e maior espaço nos gates dos aeroportos.';
      case 5: return 'O enflechamento atrasa a compressibilidade transônica, permitindo velocidades até Mach 0,82–0,85, mas reduz o coeficiente de sustentação em baixas velocidades.';
      case 6: return 'Winglets dissipam os vórtices de ponta de asa, proporcionando economia de 4% a 6% de combustível em voos médios/longos com baixo ganho de peso.';
      case 7: return 'Compósitos avançados de carbono reduzem o peso estrutural e eliminam corrosão, porém exigem maior investimento em ferramental e autoclaves.';
      case 8: return 'Turbofans modernos de alta razão de diluição (BPR) diminuem o consumo específico de combustível e ruído, mas possuem diâmetro maior e maior arrasto de nacele.';
      case 9: return 'Comandos Fly-By-Wire digitais oferecem proteção ativa de envelope, dispensam cabos de aço pesados e aliviam cargas estruturais durante rajadas de vento.';
      default: return 'Cada decisão equilibra desempenho operacional, custos de desenvolvimento em P&D e atratividade comercial para as companhias aéreas.';
    }
  }

  switch (step) {
    case 4: return 'A higher aspect ratio wing reduces induced vortex drag during cruise, boosting range and fuel economy, but increases wing bending moments and empty weight.';
    case 5: return 'Wing sweep delays transonic compressibility drag, allowing higher cruise Mach numbers (0.78–0.85), but reduces low-speed maximum lift coefficient.';
    case 6: return 'Wingtip devices diffuse the tip vortex, delivering up to 4–6% fuel burn reductions on long stages with minimal structural weight additions.';
    case 7: return 'Advanced carbon composites significantly reduce airframe empty weight and eliminate corrosion, at the expense of higher tooling capital and non-destructive testing requirements.';
    case 8: return 'Modern high-bypass turbofans lower specific fuel consumption (SFC) and acoustic emissions, but feature larger nacelle drag and higher dry engine mass.';
    case 9: return 'Full Fly-By-Wire provides autonomous flight envelope protection, eliminates heavy control cables, and enables load alleviation during gust encounters.';
    default: return 'Every engineering parameter balances operational fuel burn, unit manufacturing cost, and airline market appeal.';
  }
}

function renderStepControls(
  step: number,
  draft: AircraftDraft,
  update: (updates: Partial<AircraftDraft>) => void,
  isPtBr: boolean
) {
  const { geometry: geom, propulsion: prop, systems: sys } = draft;
  const synth = synthesizeAircraftSpecs(geom, prop, sys, draft.marketSegment);

  switch (step) {
    case 1:
      return (
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-mono text-[#A1A19A] uppercase block mb-1.5">
              {isPtBr ? 'Designação do Modelo' : 'Program Designation'}
            </label>
            <input
              type="text"
              value={draft.name}
              onChange={e => update({ name: e.target.value })}
              className="w-full font-semibold"
              placeholder="ex: A120"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-[#A1A19A] uppercase block mb-1.5">
              {isPtBr ? 'Categoria de Mercado' : 'Target Aircraft Category'}
            </label>
            <div className="grid grid-cols-1 gap-2">
              {[
                { id: 'regional_jet', name: isPtBr ? 'Jato Regional' : 'Regional Jet', desc: isPtBr ? '70–100 assentos, rotas alimentadoras' : '70–100 seats, short-haul feeder routes' },
                { id: 'small_narrowbody', name: isPtBr ? 'Small Narrowbody' : 'Small Narrowbody', desc: isPtBr ? '110–145 assentos, alta frequência regional' : '110–145 seats, high-frequency regional' },
                { id: 'narrowbody', name: isPtBr ? 'Narrowbody Padrão' : 'Standard Narrowbody', desc: isPtBr ? '150–190 assentos, espinha dorsal da aviação comercial' : '150–190 seats, mainline workhorse' },
                { id: 'large_narrowbody', name: isPtBr ? 'Large Narrowbody' : 'Large Narrowbody', desc: isPtBr ? '190–240 assentos, alta densidade e transcontinental' : '190–240 seats, high-density & transcon' },
                { id: 'widebody', name: isPtBr ? 'Widebody Dois Corredores' : 'Twin-Aisle Widebody', desc: isPtBr ? '250–350 assentos, longo curso internacional' : '250–350 seats, long-range international' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => update({ marketSegment: cat.id as MarketSegmentId })}
                  className={`p-3 rounded-md text-left transition-colors ${
                    draft.marketSegment === cat.id
                      ? 'bg-[#242424] border border-[#38bdf8] text-[#F5F5F3]'
                      : 'bg-[#1B1B1B] border border-[#242424] text-[#A1A19A] hover:bg-[#242424]'
                  }`}
                >
                  <div className="font-semibold text-sm">{cat.name}</div>
                  <div className="text-xs text-[#666660] mt-0.5">{cat.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      );

    case 2:
      return (
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-mono text-[#A1A19A] uppercase block mb-1.5">
              {isPtBr ? `Diâmetro da Fuselagem (${geom.fuselageDiameter.toFixed(2)} m)` : `Fuselage Diameter (${geom.fuselageDiameter.toFixed(2)} m)`}
            </label>
            <input
              type="range"
              min="2.8"
              max="6.2"
              step="0.05"
              value={geom.fuselageDiameter}
              onChange={e => update({ geometry: { ...geom, fuselageDiameter: parseFloat(e.target.value) } })}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-[#A1A19A] uppercase block mb-1.5">
              {isPtBr ? 'Disposição de Assentos por Fileira' : 'Seating Abreast Configuration'}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[4, 5, 6, 8].map(count => (
                <button
                  key={count}
                  onClick={() => update({ geometry: { ...geom, seatsAbreast: count, aisles: count > 6 ? 2 : 1 } })}
                  className={`h-11 rounded-md font-mono text-sm font-semibold transition-colors ${
                    geom.seatsAbreast === count
                      ? 'bg-[#F5F5F3] text-[#0D0D0D]'
                      : 'bg-[#1B1B1B] border border-[#242424] text-[#A1A19A] hover:bg-[#242424]'
                  }`}
                >
                  {count}-abreast
                </button>
              ))}
            </div>
          </div>
        </div>
      );

    case 3:
      return (
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-mono text-[#A1A19A] uppercase block mb-1.5">
              {isPtBr ? `Comprimento da Fuselagem (${geom.length.toFixed(1)} m)` : `Fuselage Length (${geom.length.toFixed(1)} m)`}
            </label>
            <input
              type="range"
              min="24.0"
              max="72.0"
              step="0.5"
              value={geom.length}
              onChange={e => {
                const len = parseFloat(e.target.value);
                const seats = Math.round((len - 8.0) * (geom.seatsAbreast / 0.82));
                update({ geometry: { ...geom, length: len, typicalSeats: seats, maxSeats: Math.round(seats * 1.15) } });
              }}
              className="w-full"
            />
          </div>

          <div className="p-4 bg-[#1B1B1B] rounded-md border border-[#242424] font-mono text-xs flex justify-between">
            <span className="text-[#A1A19A]">{isPtBr ? 'Capacidade Típica de Assentos:' : 'Typical Seating Capacity:'}</span>
            <span className="text-[#F5F5F3] font-bold">{geom.typicalSeats} {isPtBr ? 'Passageiros' : 'Passengers'}</span>
          </div>
        </div>
      );

    case 4:
      return (
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-mono text-[#A1A19A] uppercase block mb-1.5">
              {isPtBr ? `Envergadura da Asa (${geom.wingSpan.toFixed(1)} m)` : `Wingspan (${geom.wingSpan.toFixed(1)} m)`}
            </label>
            <input
              type="range"
              min="20.0"
              max="68.0"
              step="0.5"
              value={geom.wingSpan}
              onChange={e => update({ geometry: { ...geom, wingSpan: parseFloat(e.target.value) } })}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-[#A1A19A] uppercase block mb-1.5">
              {isPtBr ? `Área Alar de Referência (${geom.wingArea.toFixed(1)} m²)` : `Wing Reference Area (${geom.wingArea.toFixed(1)} m²)`}
            </label>
            <input
              type="range"
              min="60.0"
              max="450.0"
              step="2.0"
              value={geom.wingArea}
              onChange={e => update({ geometry: { ...geom, wingArea: parseFloat(e.target.value) } })}
              className="w-full"
            />
          </div>
        </div>
      );

    case 5:
      return (
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-mono text-[#A1A19A] uppercase block mb-1.5">
              {isPtBr ? `Enflechamento da Asa (${geom.wingSweepDegrees.toFixed(1)}°)` : `Leading Edge Sweep (${geom.wingSweepDegrees.toFixed(1)}°)`}
            </label>
            <input
              type="range"
              min="15.0"
              max="35.0"
              step="0.5"
              value={geom.wingSweepDegrees}
              onChange={e => update({ geometry: { ...geom, wingSweepDegrees: parseFloat(e.target.value) } })}
              className="w-full"
            />
          </div>
        </div>
      );

    case 6:
      return (
        <div className="flex flex-col gap-2">
          {[
            { id: 'none', name: isPtBr ? 'Ponta de Asa Limpa Convencional' : 'Conventional Clean Tip', desc: isPtBr ? 'Estrutura simples, arrasto de referência' : 'Simplest structure, baseline drag' },
            { id: 'blended', name: isPtBr ? 'Blended Winglet Curvado' : 'Blended Winglet', desc: isPtBr ? '+3,2% de eficiência em cruzeiro' : '+3.2% Fuel efficiency, low weight' },
            { id: 'split_scimitar', name: isPtBr ? 'Split-Scimitar Winglet Duplo' : 'Split-Scimitar Winglet', desc: isPtBr ? '+4,5% de eficiência aerodinâmica' : '+4.5% Fuel efficiency, dual aerofoil' },
            { id: 'raked_wingtip', name: isPtBr ? 'Ponta de Asa Enflechada (Raked)' : 'Raked Wingtip', desc: isPtBr ? '+5,0% de eficiência em longo alcance' : '+5.0% Long-range efficiency, extended span' }
          ].map(tip => (
            <button
              key={tip.id}
              onClick={() => update({ geometry: { ...geom, wingletType: tip.id as WingletType } })}
              className={`p-3 rounded-md text-left transition-colors ${
                geom.wingletType === tip.id
                  ? 'bg-[#242424] border border-[#38bdf8] text-[#F5F5F3]'
                  : 'bg-[#1B1B1B] border border-[#242424] text-[#A1A19A] hover:bg-[#242424]'
              }`}
            >
              <div className="font-semibold text-sm">{tip.name}</div>
              <div className="text-xs text-[#666660] mt-0.5">{tip.desc}</div>
            </button>
          ))}
        </div>
      );

    case 7:
      return (
        <div className="flex flex-col gap-2">
          {[
            { id: 'conventional_aluminum', name: isPtBr ? 'Alumínio Aeroespacial Convencional' : 'Standard Aerospace Aluminum', desc: isPtBr ? 'Menor custo de ferramental, peso de referência' : 'Lowest unit cost, mature tooling, baseline weight' },
            { id: 'advanced_al_li', name: isPtBr ? 'Ligas Avançadas de Alumínio-Lítio (Al-Li)' : 'Advanced Aluminum-Lithium Alloys', desc: isPtBr ? '-7% de peso estrutural, alta resistência a corrosão' : '-7% Airframe mass, superior corrosion resistance' },
            { id: 'full_carbon_composite', name: isPtBr ? 'Compósitos de Fibra de Carbono (CFRP)' : 'Full Carbon Fiber Composites (CFRP)', desc: isPtBr ? '-18% de peso estrutural, alta vida em fadiga' : '-18% Airframe mass, higher fatigue life, increased tooling R&D' }
          ].map(mat => (
            <button
              key={mat.id}
              onClick={() => update({ geometry: { ...geom, materialType: mat.id as MaterialType } })}
              className={`p-3 rounded-md text-left transition-colors ${
                geom.materialType === mat.id
                  ? 'bg-[#242424] border border-[#38bdf8] text-[#F5F5F3]'
                  : 'bg-[#1B1B1B] border border-[#242424] text-[#A1A19A] hover:bg-[#242424]'
              }`}
            >
              <div className="font-semibold text-sm">{mat.name}</div>
              <div className="text-xs text-[#666660] mt-0.5">{mat.desc}</div>
            </button>
          ))}
        </div>
      );

    case 8:
      return (
        <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
          {THIRD_PARTY_ENGINE_CATALOG.slice(0, 5).map(eng => (
            <button
              key={eng.engineModelId}
              onClick={() => update({ propulsion: eng })}
              className={`p-3 rounded-md text-left transition-colors ${
                prop.engineModelId === eng.engineModelId
                  ? 'bg-[#242424] border border-[#38bdf8] text-[#F5F5F3]'
                  : 'bg-[#1B1B1B] border border-[#242424] text-[#A1A19A] hover:bg-[#242424]'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold text-sm">{eng.engineName}</span>
                <span className="text-xs font-mono text-[#38bdf8]">{eng.thrustPerEngineKN} kN</span>
              </div>
              <div className="text-xs text-[#666660] mt-0.5 font-mono">
                BPR {eng.bypassRatio}:1 • SFC {eng.cruiseSFC} • US$ {eng.pricePerEngine}M/un
              </div>
            </button>
          ))}
        </div>
      );

    case 9:
      return (
        <div className="flex flex-col gap-2">
          {[
            { id: 'analog_fbw', name: isPtBr ? 'Comandos Analógicos com Cabos de Backup' : 'Analog Electronic Flight Controls', desc: isPtBr ? 'Estabilidade básica aumentada, peso mecânico tradicional' : 'Basic stability augmentation, mechanical backup cables' },
            { id: 'digital_fbw', name: isPtBr ? 'Fly-By-Wire Digital Completo' : 'Full Digital Fly-By-Wire (FBW)', desc: isPtBr ? 'Proteção de envelope de voo, sidestick, -350 kg de peso' : 'Flight envelope protection, sidestick controls, -350 kg mass' },
            { id: 'adaptive_envelope_fbw', name: isPtBr ? 'FBW Adaptativo Autônomo com Alívio de Rajadas' : 'Adaptive Autonomous FBW', desc: isPtBr ? 'Alívio ativo de cargas em turbulência e conforto máximo' : 'Predictive gust alleviation, maximum passenger ride smoothness' }
          ].map(fc => (
            <button
              key={fc.id}
              onClick={() => update({ systems: { ...sys, flightControls: fc.id as FlightControlTech } })}
              className={`p-3 rounded-md text-left transition-colors ${
                sys.flightControls === fc.id
                  ? 'bg-[#242424] border border-[#38bdf8] text-[#F5F5F3]'
                  : 'bg-[#1B1B1B] border border-[#242424] text-[#A1A19A] hover:bg-[#242424]'
              }`}
            >
              <div className="font-semibold text-sm">{fc.name}</div>
              <div className="text-xs text-[#666660] mt-0.5">{fc.desc}</div>
            </button>
          ))}
        </div>
      );

    case 10:
      return (
        <div className="flex flex-col gap-2">
          {[
            { id: 'modern_lcd_efis', name: isPtBr ? 'Cockpit EFIS com Telas LCD Multifuncionais' : 'Modern Multi-Function LCD EFIS', desc: isPtBr ? 'Padrão da indústria com visão sintética integrada' : 'Standard airline standard glass cockpit with synthetic vision' },
            { id: 'panoramic_touch_screens', name: isPtBr ? 'Telas Panorâmicas Touch de Grande Formato' : 'Panoramic Large-Format Touch Cockpit', desc: isPtBr ? 'Dual HUDs, redução da carga de trabalho dos pilotos' : 'Next-gen dual HUDs, paperless electronic flight bag, pilot workload reduction' }
          ].map(cockpit => (
            <button
              key={cockpit.id}
              onClick={() => update({ systems: { ...sys, cockpitTech: cockpit.id as CockpitTech } })}
              className={`p-3 rounded-md text-left transition-colors ${
                sys.cockpitTech === cockpit.id
                  ? 'bg-[#242424] border border-[#38bdf8] text-[#F5F5F3]'
                  : 'bg-[#1B1B1B] border border-[#242424] text-[#A1A19A] hover:bg-[#242424]'
              }`}
            >
              <div className="font-semibold text-sm">{cockpit.name}</div>
              <div className="text-xs text-[#666660] mt-0.5">{cockpit.desc}</div>
            </button>
          ))}
        </div>
      );

    case 11:
      return (
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-mono text-[#A1A19A] uppercase block mb-1.5">
              {isPtBr ? `Altitude de Pressurização em Cruzeiro (${sys.cabinAltitudeFeet} pés)` : `Cruise Cabin Altitude (${sys.cabinAltitudeFeet} ft)`}
            </label>
            <input
              type="range"
              min="5000"
              max="8000"
              step="500"
              value={sys.cabinAltitudeFeet}
              onChange={e => update({ systems: { ...sys, cabinAltitudeFeet: parseInt(e.target.value) } })}
              className="w-full"
            />
          </div>
        </div>
      );

    case 12:
      return (
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-mono text-[#A1A19A] uppercase block mb-1.5">
              {isPtBr ? `Distância Entre Poltronas (${geom.seatPitchInches} polegadas)` : `Economy Seat Pitch (${geom.seatPitchInches} inches)`}
            </label>
            <input
              type="range"
              min="29"
              max="34"
              step="1"
              value={geom.seatPitchInches}
              onChange={e => update({ geometry: { ...geom, seatPitchInches: parseInt(e.target.value) } })}
              className="w-full"
            />
          </div>
        </div>
      );

    case 13:
      return (
        <div className="flex flex-col gap-3 font-mono text-xs">
          <div className="p-3 bg-[#1B1B1B] rounded border border-[#242424] flex justify-between">
            <span className="text-[#A1A19A]">{isPtBr ? 'Custo Operacional Direto (DOC):' : 'Direct Operating Cost (DOC):'}</span>
            <span className="text-[#F5F5F3] font-bold">US$ {synth.perf.directOperatingCostPerSeatKm.toFixed(4)} / assento-km</span>
          </div>
          <div className="p-3 bg-[#1B1B1B] rounded border border-[#242424] flex justify-between">
            <span className="text-[#A1A19A]">{isPtBr ? 'Custo Unitário de Fabricação:' : 'Estimated Unit Manufacturing Cost:'}</span>
            <span className="text-[#F5F5F3] font-bold">US$ {synth.unitCost.toFixed(1)}M</span>
          </div>
          <div className="p-3 bg-[#1B1B1B] rounded border border-[#242424] flex justify-between">
            <span className="text-[#A1A19A]">{isPtBr ? 'Preço Sugerido de Tabela:' : 'Suggested List Price:'}</span>
            <span className="text-[#F5F5F3] font-bold">US$ {synth.listPrice.toFixed(1)}M</span>
          </div>
        </div>
      );

    case 14:
      return (
        <div className="flex flex-col gap-4 font-mono text-xs">
          <div className="p-4 bg-[#1B1B1B] rounded border border-[#38bdf8]/40 flex flex-col gap-2">
            <div className="text-[#38bdf8] font-bold text-sm">{isPtBr ? 'Resumo da Aprovação de Engenharia' : 'Engineering Rollout Summary'}</div>
            <div className="text-[#A1A19A]">{isPtBr ? 'Orçamento de P&D Estimado:' : 'Estimated Development Budget:'} <span className="text-[#F5F5F3] font-bold">US$ {synth.rdCost}M</span></div>
            <div className="text-[#A1A19A]">{isPtBr ? 'Cronograma Estimado até o Primeiro Voo:' : 'Projected Schedule to First Flight:'} <span className="text-[#F5F5F3] font-bold">~36 {isPtBr ? 'meses' : 'months'}</span></div>
          </div>
        </div>
      );

    default:
      return null;
  }
}
