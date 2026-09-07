// ============================================================================
// PROJECT AIRFRAME - DEVELOPER SIMULATION DEBUG PANEL
// ============================================================================

import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { Terminal, FileText, AlertOctagon } from 'lucide-react';

export const DevPanel: React.FC = () => {
  const {
    seed,
    currentDate,
    devAdvanceDays,
    devAddCash,
    devForceRfp,
    devForceIncident
  } = useGameStore();

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

        {/* Add Cash */}
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
            <button onClick={devForceRfp} className="btn-aerospace text-[10px] py-1 text-sky-300">
              <FileText className="w-3 h-3" />
              INJECT AIRLINE RFP
            </button>
            <button onClick={devForceIncident} className="btn-aerospace danger text-[10px] py-1">
              <AlertOctagon className="w-3 h-3" />
              FORCE IN-SERVICE INCIDENT
            </button>
          </div>
        </div>

        {/* State Telemetry */}
        <div className="bg-[#162032] p-3 rounded flex flex-col gap-1 text-[11px] text-slate-300">
          <span className="text-[10px] text-slate-500 uppercase font-bold">STATE TELEMETRY</span>
          <div>CURRENT DATE: Y{currentDate.year} M{currentDate.month} D{currentDate.day}</div>
          <div>QUARTER: Q{currentDate.quarter} (TOTAL DAYS: {currentDate.totalDays})</div>
          <div className="text-emerald-400">RNG STATUS: SYNCHRONIZED</div>
        </div>
      </div>
    </div>
  );
};
