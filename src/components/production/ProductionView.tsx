// ============================================================================
// PROJECT AIRFRAME - FINAL ASSEMBLY LINE (FAL) OPERATIONS
// ============================================================================

import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { useTranslation } from '../../i18n';
import { Factory, Plus } from 'lucide-react';

const ASSEMBLY_STATIONS = [
  { index: 0, name: 'Fuselage Shell Joining & Splice', description: 'Forward, center, and aft fuselage section laser alignment.', durationDays: 3.5 },
  { index: 1, name: 'Wing-to-Body Laser Join', description: 'Laser alignment and high-tensile titanium wing-box mounting.', durationDays: 4.0 },
  { index: 2, name: 'Empennage & Fin Integration', description: 'Vertical stabilizer and active trim horizontal stabilizer integration.', durationDays: 2.5 },
  { index: 3, name: 'Hydraulics, Wiring & Fuel Lines', description: 'Over 120km of bundle wiring harnesses and hydraulic lines.', durationDays: 4.5 },
  { index: 4, name: 'Cabin Furnishing & Galleys', description: 'Passenger seating, overhead bins, sidewalls, and IFE.', durationDays: 3.5 },
  { index: 5, name: 'Propulsion Pylons & Turbofans', description: 'Engine pylon attachment and dual turbofan hang.', durationDays: 3.0 },
  { index: 6, name: 'Avionics Power-On & Tests', description: 'Full glass cockpit power-up, FBW servo testing, and leak checks.', durationDays: 3.0 },
  { index: 7, name: 'Paint Hangar & Flight Acceptance', description: 'Custom airline livery application and customer acceptance.', durationDays: 4.0 }
];

export const ProductionView: React.FC = () => {
  const { company, createAssemblyLine, setAssemblyLineRate, setActiveView } = useGameStore();
  const { t } = useTranslation();

  const activeLine = company.assemblyLines[0];

  const handleCreateNewLine = () => {
    if (company.programs.length === 0) {
      setActiveView('studio');
      return;
    }
    const prog = company.programs[0];
    createAssemblyLine(prog.id, 'fac_hq', 4);
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-[#0E0F0F] text-[#F5F5F3] font-sans select-none">
      <div className="max-w-[1600px] mx-auto px-8 py-10 flex flex-col gap-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[rgba(255,255,255,0.07)]">
          <div>
            <div className="text-xs font-mono font-semibold tracking-wider text-[#73736C] uppercase">
              MANUFACTURING OPERATIONS // FINAL ASSEMBLY
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
                {t('production.addLine')} ($85M)
              </button>
            )}
          </div>
        </div>

        {!activeLine ? (
          <div className="bg-[#171818] border border-[rgba(255,255,255,0.08)] rounded-2xl p-16 text-center flex flex-col items-center justify-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-[#1E1F1F] border border-[rgba(255,255,255,0.07)] flex items-center justify-center text-[#38bdf8]">
              <Factory className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-[#F5F5F3]">No Assembly Line Commissioned</h3>
            <p className="page-description max-w-md text-sm">
              Commission a dedicated final assembly line in your manufacturing facilities to begin series production and fulfill airline delivery contracts.
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
            {/* Production Controls & Metrics Bar */}
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
              </div>

              <div className="flex items-center gap-10 border-t md:border-t-0 md:border-l border-[rgba(255,255,255,0.07)] pt-4 md:pt-0 md:pl-10 text-xs">
                <div>
                  <span className="text-[#73736C] uppercase font-semibold block tracking-wider">UNITS ON LINE</span>
                  <span className="text-lg font-bold font-mono text-[#F5F5F3] mt-1 block">
                    {activeLine.activeUnitsOnLine.length} {t('common.units')}
                  </span>
                </div>
                <div>
                  <span className="text-[#73736C] uppercase font-semibold block tracking-wider">MAX CAPACITY RATE</span>
                  <span className="text-lg font-bold font-mono text-[#F5F5F3] mt-1 block">
                    {activeLine.maxMonthlyRate} / {t('common.month')}
                  </span>
                </div>
              </div>
            </div>

            {/* 8-Station Horizontal Moving Flow */}
            <div className="flex flex-col gap-4">
              <h2 className="section-title">
                Pulsed Moving Assembly Stations Flow
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {ASSEMBLY_STATIONS.map(st => {
                  const unitsAtStation = activeLine.activeUnitsOnLine.filter(u => u.currentStationIndex === st.index);

                  return (
                    <div
                      key={st.index}
                      className="bg-[#171818] border border-[rgba(255,255,255,0.08)] rounded-xl p-6 flex flex-col justify-between gap-5 shadow-sm"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs font-mono text-[#73736C]">
                          <span className="font-bold text-[#38bdf8]">STATION 0{st.index + 1}</span>
                          <span>{st.durationDays}d Cycle</span>
                        </div>
                        <h4 className="text-base font-bold text-[#F5F5F3] mt-2">{st.name}</h4>
                        <p className="text-xs text-[#A3A39C] mt-1.5 leading-relaxed">{st.description}</p>
                      </div>

                      <div className="pt-4 border-t border-[rgba(255,255,255,0.07)] flex items-center justify-between text-xs">
                        <span className="text-[#73736C]">Active Airframe:</span>
                        {unitsAtStation.length > 0 ? (
                          <span className="text-[#F5F5F3] font-mono font-bold">
                            MSN {unitsAtStation[0].serialNumber} ({Math.round(unitsAtStation[0].stationProgressPercent)}%)
                          </span>
                        ) : (
                          <span className="text-[#73736C] italic">Idle / Empty</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
