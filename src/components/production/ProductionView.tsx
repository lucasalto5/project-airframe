// ============================================================================
// PROJECT AIRFRAME - FINAL ASSEMBLY LINE (FAL) OPERATIONS
// ============================================================================

import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { useTranslation, formatGameDate } from '../../i18n';
import { Factory, Plus, Clock, X, AlertCircle } from 'lucide-react';

const ASSEMBLY_STATIONS_KEYS = [
  { index: 0, key: 's1', durationDays: 3.5 },
  { index: 1, key: 's2', durationDays: 4.0 },
  { index: 2, key: 's3', durationDays: 2.5 },
  { index: 3, key: 's4', durationDays: 4.5 },
  { index: 4, key: 's5', durationDays: 3.5 },
  { index: 5, key: 's6', durationDays: 3.0 },
  { index: 6, key: 's7', durationDays: 3.0 },
  { index: 7, key: 's8', durationDays: 4.0 }
];

export const ProductionView: React.FC = () => {
  const { company, createAssemblyLine, setAssemblyLineRate, setActiveView } = useGameStore();
  const { t, locale, isPtBr } = useTranslation();

  const [selectedStationIndex, setSelectedStationIndex] = useState<number | null>(null);

  const activeLine = company.assemblyLines[0];
  const activeProg = company.programs.find(p => p.id === activeLine?.programId) || company.programs[0];
  const activeContracts = company.firmContracts.filter(c => c.status === 'active');

  const handleCreateNewLine = () => {
    if (company.programs.length === 0) {
      setActiveView('studio');
      return;
    }
    const prog = company.programs[0];
    createAssemblyLine(prog.id, 'fac_hq', 4);
  };

  const selectedStationUnits = activeLine && selectedStationIndex !== null
    ? activeLine.activeUnitsOnLine.filter(u => u.currentStationIndex === selectedStationIndex)
    : [];

  return (
    <div className="w-full h-full overflow-y-auto bg-[#0E0F0F] text-[#F5F5F3] font-sans select-none">
      <div className="max-w-[1600px] mx-auto px-8 py-10 flex flex-col gap-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[rgba(255,255,255,0.07)]">
          <div>
            <div className="text-xs font-mono font-semibold tracking-wider text-[#73736C] uppercase">
              {isPtBr ? `OPERAÇÕES DE MANUFATURA // ${activeProg?.name || 'AIRFRAME'}` : `MANUFACTURING OPERATIONS // ${activeProg?.name || 'AIRFRAME'}`}
            </div>
            <h1 className="page-title text-3xl md:text-4xl mt-1">
              {t('production.title')}
            </h1>
            <p className="page-description max-w-2xl text-sm md:text-base mt-1">
              {t('production.subtitle')}
            </p>
          </div>

          <div>
            {!activeLine && (
              <button
                onClick={handleCreateNewLine}
                className="btn-aerospace primary large h-12 px-7 text-sm font-semibold flex items-center gap-2.5 shadow-lg"
              >
                <Plus className="w-4 h-4" />
                {t('production.addLine')}
              </button>
            )}
          </div>
        </div>

        {!activeLine ? (
          <div className="bg-[#171818] border border-[rgba(255,255,255,0.08)] rounded-2xl p-16 text-center flex flex-col items-center justify-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-[#1E1F1F] border border-[rgba(255,255,255,0.07)] flex items-center justify-center text-[#38bdf8]">
              <Factory className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-[#F5F5F3]">{isPtBr ? 'Nenhuma Linha de Montagem Comissionada' : 'No Assembly Line Commissioned'}</h3>
            <p className="page-description max-w-md text-sm">
              {isPtBr
                ? 'Comissione uma linha de montagem dedicada ($85M em ferramental e gabaritos) para iniciar a produção em série e atender aos pedidos das companhias aéreas.'
                : 'Commission a dedicated final assembly line ($85M tooling and jigs) to begin series production and fulfill customer delivery contracts.'}
            </p>
            <button
              onClick={handleCreateNewLine}
              className="btn-aerospace primary large h-12 px-8 text-sm font-semibold mt-2"
            >
              {t('production.addLine')}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            
            {/* Tooling Banner if in progress */}
            {activeLine.status === 'tooling_in_progress' && (
              <div className="bg-sky-950/20 border border-sky-500/30 rounded-xl p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-[#38bdf8]" />
                  <div>
                    <div className="font-bold text-[#F5F5F3] text-sm">
                      {isPtBr ? 'FERRAMENTAL E GABARITOS EM PREPARAÇÃO' : 'TOOLING & ASSEMBLY JIGS IN PROGRESS'}
                    </div>
                    <div className="text-xs text-[#A3A39C] mt-0.5">
                      {isPtBr
                        ? `A instalação das estações robóticas e gabaritos a laser está em andamento. Conclusão prevista em ${activeLine.toolingDaysRemaining} dias.`
                        : `Robotic station jigs and laser alignment tooling installation underway. Completion in ${activeLine.toolingDaysRemaining} days.`}
                    </div>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold px-3 py-1 bg-sky-500/20 text-[#38bdf8] rounded-md">
                  {activeLine.toolingDaysRemaining} {isPtBr ? 'dias restantes' : 'days left'}
                </span>
              </div>
            )}

            {/* Production Controls & Metrics Bar (Directives #32, #33) */}
            <div className="bg-[#171818] border border-[rgba(255,255,255,0.08)] rounded-xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-8 shadow-sm">
              <div className="flex-1 max-w-md">
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-[#A3A39C] uppercase tracking-wider">{t('production.ratePerMonth')}</span>
                  <span className="text-[#F5F5F3] font-bold font-mono text-sm">
                    {activeLine.currentMonthlyRateTarget} {t('common.aircraft')} / {t('common.month')}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max={activeLine.maxMonthlyRate}
                  value={activeLine.currentMonthlyRateTarget}
                  onChange={e => setAssemblyLineRate(activeLine.id, parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-[11px] text-[#73736C] font-mono mt-2">
                  <span>{isPtBr ? 'Taxa Real:' : 'Actual Rate:'} {activeLine.activeUnitsOnLine.length > 0 ? `${activeLine.currentMonthlyRateTarget}.0` : '0.0'} / {t('common.month')}</span>
                  <span>{activeContracts.length === 0 ? (isPtBr ? 'Sem pedidos firmes' : 'No firm backlog') : (isPtBr ? 'Produção ativa' : 'Production active')}</span>
                </div>
              </div>

              <div className="flex items-center gap-10 border-t md:border-t-0 md:border-l border-[rgba(255,255,255,0.07)] pt-4 md:pt-0 md:pl-10 text-xs">
                <div>
                  <span className="text-[#73736C] uppercase font-semibold block tracking-wider">{isPtBr ? 'UNIDADES NA LINHA' : 'UNITS ON LINE'}</span>
                  <span className="text-lg font-bold font-mono text-[#F5F5F3] mt-1 block">
                    {activeLine.activeUnitsOnLine.length} {t('common.units')}
                  </span>
                </div>
                <div>
                  <span className="text-[#73736C] uppercase font-semibold block tracking-wider">{isPtBr ? 'CAPACIDADE MÁXIMA' : 'MAX CAPACITY RATE'}</span>
                  <span className="text-lg font-bold font-mono text-[#F5F5F3] mt-1 block">
                    {activeLine.maxMonthlyRate} / {t('common.month')}
                  </span>
                </div>
                <div>
                  <span className="text-[#73736C] uppercase font-semibold block tracking-wider">{isPtBr ? 'CARTEIRA ATIVA' : 'ACTIVE BACKLOG'}</span>
                  <span className="text-lg font-bold font-mono text-[#38bdf8] mt-1 block">
                    {activeProg?.ordersBacklogCount || 0} {t('common.units')}
                  </span>
                </div>
              </div>
            </div>

            {/* 8-Station Horizontal Moving Flow (Directives #28 & #31) */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="section-title">
                  {isPtBr ? 'Fluxo das 8 Estações de Montagem Pulsada' : 'Pulsed Moving Assembly Stations Flow'}
                </h2>
                <span className="text-xs text-[#73736C]">
                  {isPtBr ? 'Clique em uma estação para ver detalhes da unidade' : 'Click on a station to view active unit details'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {ASSEMBLY_STATIONS_KEYS.map(st => {
                  const unitsAtStation = activeLine.activeUnitsOnLine.filter(u => u.currentStationIndex === st.index);
                  const isStationActive = unitsAtStation.length > 0;

                  return (
                    <div
                      key={st.index}
                      onClick={() => setSelectedStationIndex(st.index)}
                      className={`border rounded-xl p-6 flex flex-col justify-between gap-5 shadow-sm transition-all cursor-pointer ${
                        isStationActive
                          ? 'bg-[#1E1F1F] border-[#38bdf8]/50 hover:border-[#38bdf8]'
                          : 'bg-[#171818] border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.15)]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs font-mono text-[#73736C]">
                          <span className={`font-bold ${isStationActive ? 'text-[#38bdf8]' : 'text-[#73736C]'}`}>
                            STATION 0{st.index + 1}
                          </span>
                          <span>{st.durationDays}d {isPtBr ? 'Ciclo' : 'Cycle'}</span>
                        </div>
                        <h4 className="text-base font-bold text-[#F5F5F3] mt-2">
                          {t(`production.stations.${st.key}.name`)}
                        </h4>
                        <p className="text-xs text-[#A3A39C] mt-1.5 leading-relaxed">
                          {t(`production.stations.${st.key}.desc`)}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-[rgba(255,255,255,0.07)] flex items-center justify-between text-xs">
                        <span className="text-[#73736C]">{isPtBr ? 'Aeronave:' : 'Airframe:'}</span>
                        {isStationActive ? (
                          <span className="text-[#38bdf8] font-mono font-bold">
                            {unitsAtStation[0].serialNumber} ({Math.round(unitsAtStation[0].stationProgressPercent)}%)
                          </span>
                        ) : (
                          <span className="text-[#73736C] italic">{isPtBr ? 'Vazia / Aguardando' : 'Idle / Empty'}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* Station Detail Drawer / Modal (Directive #31) */}
        {selectedStationIndex !== null && (
          <div
            className="modal-overlay"
            onClick={() => setSelectedStationIndex(null)}
          >
            <div
              className="bg-[#171818] border border-[rgba(255,255,255,0.15)] rounded-2xl max-w-lg w-full p-8 flex flex-col gap-6 font-sans shadow-2xl select-none"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center pb-4 border-b border-[rgba(255,255,255,0.07)]">
                <div>
                  <span className="text-xs font-mono font-bold text-[#38bdf8] uppercase">
                    STATION 0{selectedStationIndex + 1}
                  </span>
                  <h3 className="text-xl font-bold text-[#F5F5F3] mt-1">
                    {t(`production.stations.${ASSEMBLY_STATIONS_KEYS[selectedStationIndex].key}.name`)}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedStationIndex(null)}
                  className="text-[#73736C] hover:text-[#F5F5F3] p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {selectedStationUnits.length > 0 ? (
                <div className="flex flex-col gap-5">
                  <div className="p-4 bg-[#1E1F1F] rounded-xl border border-[rgba(255,255,255,0.07)] flex flex-col gap-3 font-mono text-xs">
                    <div className="flex justify-between items-center text-sm font-bold">
                      <span className="text-[#F5F5F3]">MSN: {selectedStationUnits[0].serialNumber}</span>
                      <span className="text-emerald-400">{Math.round(selectedStationUnits[0].stationProgressPercent)}% Complete</span>
                    </div>
                    <div className="flex justify-between text-[#A3A39C]">
                      <span>{isPtBr ? 'Cliente / Companhia:' : 'Customer Airline:'}</span>
                      <span className="text-[#F5F5F3] font-bold">{selectedStationUnits[0].customerAirlineId}</span>
                    </div>
                    <div className="flex justify-between text-[#A3A39C]">
                      <span>{isPtBr ? 'Data de Início:' : 'Started Date:'}</span>
                      <span className="text-[#F5F5F3]">{formatGameDate(selectedStationUnits[0].startedDate, locale)}</span>
                    </div>
                    <div className="flex justify-between text-[#A3A39C]">
                      <span>{isPtBr ? 'Previsão de Entrega:' : 'Estimated Delivery:'}</span>
                      <span className="text-[#F5F5F3]">{formatGameDate(selectedStationUnits[0].estimatedDeliveryDate, locale)}</span>
                    </div>
                    <div className="flex justify-between text-[#A3A39C]">
                      <span>{isPtBr ? 'Índice de Qualidade:' : 'Quality Index:'}</span>
                      <span className="text-emerald-400 font-bold">99.2%</span>
                    </div>
                  </div>

                  <div className="w-full h-3 bg-[#242525] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#38bdf8] rounded-full transition-all duration-300"
                      style={{ width: `${selectedStationUnits[0].stationProgressPercent}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="p-8 bg-[#1E1F1F] rounded-xl text-center flex flex-col items-center gap-3 text-xs text-[#73736C]">
                  <AlertCircle className="w-8 h-8 text-[#73736C]" />
                  <div>
                    <div className="font-bold text-[#F5F5F3] text-sm">{isPtBr ? 'Nenhuma aeronave nesta estação' : 'No airframe currently at this station'}</div>
                    <p className="mt-1">{isPtBr ? 'A próxima unidade entrará assim que a estação anterior for concluída.' : 'The next unit will advance into this station once the preceding pulse cycle completes.'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
