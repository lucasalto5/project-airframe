// ============================================================================
// PROJECT AIRFRAME - DEVELOPER SIMULATION DEBUG PANEL
// ============================================================================

import React from 'react';
import { useGameStore } from '../../store/gameStore';
import type { ProgramPhase } from '../../types';
import { Terminal, FileText, AlertOctagon } from 'lucide-react';

export const DevPanel: React.FC = () => {
  const {
    seed,
    currentDate,
    company,
    devAdvanceDays,
    devAddCash,
    devSetPhase,
    devAddFlightHours,
    devPassCertification,
    devForceRfp,
    devForceIncident
  } = useGameStore();

  const prog = company.programs[0];

  const phases: ProgramPhase[] = [
    'concept',
    'preliminary_design',
    'detailed_design',
    'prototype_build',
    'ground_testing',
    'flight_testing',
    'certification',
    'production_ready',
    'entry_into_service'
  ];

  return (
    <div className="bg-[#0f1724] border border-amber-500/50 rounded-lg p-5 font-mono text-xs flex flex-col gap-4 shadow-2xl">
      <div className="flex justify-between items-center border-b border-[#1e2d42] pb-2 text-amber-400 font-bold">
        <span className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-amber-400" />
          DEVELOPER SIMULATION CONTROL PANEL
        </span>
        <span className="text-[10px] text-slate-400">SEED: {seed}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Advance Days */}
        <div className="bg-[#162032] p-3 rounded flex flex-col gap-2">
          <span className="text-[10px] text-slate-400 uppercase font-bold">SIMULATION SPEED-FORWARD</span>
          <div className="grid grid-cols-2 gap-1.5">
            <button onClick={() => devAdvanceDays(7)} className="btn-aerospace text-[10px] py-1">
              +7 DAYS
            </button>
            <button onClick={() => devAdvanceDays(30)} className="btn-aerospace text-[10px] py-1 text-sky-400">
              +1 MONTH
            </button>
            <button onClick={() => devAdvanceDays(90)} className="btn-aerospace text-[10px] py-1 text-amber-400">
              +1 QUARTER
            </button>
            <button onClick={() => devAdvanceDays(365)} className="btn-aerospace text-[10px] py-1 text-emerald-400">
              +1 YEAR
            </button>
          </div>
        </div>

        {/* Program State Jump */}
        <div className="bg-[#162032] p-3 rounded flex flex-col gap-2">
          <span className="text-[10px] text-slate-400 uppercase font-bold">PROGRAM PHASE CHEATS</span>
          {prog ? (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-400">Current:</span>
                <span className="text-sky-300 font-bold">{prog.currentPhase}</span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-[9px]">
                <button
                  onClick={() => devAddFlightHours(prog.id, 500)}
                  className="btn-aerospace text-[9px] py-1 text-sky-400"
                >
                  +500 FLT HRS
                </button>
                <button
                  onClick={() => devPassCertification(prog.id)}
                  className="btn-aerospace text-[9px] py-1 text-emerald-400 font-bold"
                >
                  PASS CERT
                </button>
              </div>
              <select
                value={prog.currentPhase}
                onChange={e => devSetPhase(prog.id, e.target.value as ProgramPhase)}
                className="bg-[#0f1724] border border-[#1e2d42] text-slate-300 text-[10px] p-1 rounded mt-1"
              >
                {phases.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          ) : (
            <span className="text-slate-500 italic">No program launched</span>
          )}
        </div>

        {/* Capital Injection */}
        <div className="bg-[#162032] p-3 rounded flex flex-col gap-2">
          <span className="text-[10px] text-slate-400 uppercase font-bold">CAPITAL INJECTION</span>
          <div className="grid grid-cols-2 gap-1.5">
            <button onClick={() => devAddCash(100)} className="btn-aerospace text-[10px] py-1 text-emerald-400">
              +$100M CASH
            </button>
            <button onClick={() => devAddCash(500)} className="btn-aerospace text-[10px] py-1 text-emerald-400 font-bold">
              +$500M CASH
            </button>
            <button onClick={() => devAddCash(1000)} className="btn-aerospace text-[10px] py-1 text-emerald-300 font-bold col-span-2">
              +$1.0B TREASURY
            </button>
          </div>
        </div>

        {/* Force Events */}
        <div className="bg-[#162032] p-3 rounded flex flex-col gap-2">
          <span className="text-[10px] text-slate-400 uppercase font-bold">TRIGGER EVENTS</span>
          <div className="flex flex-col gap-1.5">
            <button onClick={devForceRfp} className="btn-aerospace text-[10px] py-1 text-sky-300 flex items-center justify-center gap-1">
              <FileText className="w-3 h-3" />
              INJECT AIRLINE RFP
            </button>
            <button onClick={devForceIncident} className="btn-aerospace danger text-[10px] py-1 flex items-center justify-center gap-1">
              <AlertOctagon className="w-3 h-3" />
              FORCE INCIDENT
            </button>
          </div>
        </div>
      </div>

      {/* State Telemetry Footer */}
      <div className="bg-[#162032] p-3 rounded flex items-center justify-between text-[11px] text-slate-300">
        <div>DATE: Y{currentDate.year} M{currentDate.month} D{currentDate.day} (TOTAL DAYS: {currentDate.totalDays})</div>
        <div className="text-emerald-400 font-bold">SOLVENCY: {company.financials.insolvencyStatus.toUpperCase()}</div>
      </div>
    </div>
  );
};
