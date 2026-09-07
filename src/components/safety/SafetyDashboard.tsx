// ============================================================================
// PROJECT AIRFRAME - AIR SAFETY BUREAU & FLEET RELIABILITY
// ============================================================================

import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { useTranslation, formatNumber, formatGameDate } from '../../i18n';
import type { AircraftIncident } from '../../types';
import { ShieldCheck } from 'lucide-react';

export const SafetyDashboard: React.FC = () => {
  const { company } = useGameStore();
  const { t, locale } = useTranslation();

  const [selectedIncident, setSelectedIncident] = useState<AircraftIncident | null>(null);

  const incidents = company.incidentHistory || [];
  const openIncidents = incidents.filter(i => i.investigation.phase !== 'final_report_closed');

  const fleet = company.activeInServiceFleet || [];
  const totalFleetHours = fleet.reduce((acc, p) => acc + p.accumulatedFlightHours, 0);
  const avgReliability = fleet.length > 0
    ? (fleet.reduce((acc, p) => acc + p.currentDispatchReliability, 0) / fleet.length)
    : 99.4;

  return (
    <div className="w-full h-full overflow-y-auto bg-[#0E0F0F] text-[#F5F5F3] font-sans select-none">
      <div className="max-w-[1600px] mx-auto px-8 py-10 flex flex-col gap-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[rgba(255,255,255,0.07)]">
          <div>
            <div className="text-xs font-mono font-semibold tracking-wider text-[#73736C] uppercase">
              AIR SAFETY BUREAU // FLEET RELIABILITY
            </div>
            <h1 className="page-title text-3xl md:text-4xl mt-1">
              {t('safety.title')}
            </h1>
            <p className="page-description max-w-2xl text-sm md:text-base mt-1">
              {t('safety.subtitle')}
            </p>
          </div>

          <div>
            <span className={`px-4 py-2 rounded-lg font-semibold text-xs flex items-center gap-2 ${
              openIncidents.length > 0
                ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30 animate-pulse'
                : 'bg-[#171818] text-emerald-400 border border-[rgba(255,255,255,0.07)]'
            }`}>
              <ShieldCheck className="w-4 h-4" />
              {openIncidents.length > 0 ? `${openIncidents.length} ACTIVE INVESTIGATIONS` : 'DISPATCH STATUS NORMAL'}
            </span>
          </div>
        </div>

        {/* Aligned KPI Stats Bar */}
        <div className="bg-[#171818] border border-[rgba(255,255,255,0.08)] rounded-xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8 shadow-sm">
          <div>
            <span className="text-[#73736C] uppercase font-semibold text-xs tracking-wider block">
              {t('safety.fleetDispatchReliability')}
            </span>
            <span className="text-2xl font-bold font-mono text-[#F5F5F3] mt-1 block">{avgReliability.toFixed(2)}%</span>
            <span className="text-xs text-[#73736C] mt-1 block">Industry target: 99.4%</span>
          </div>

          <div>
            <span className="text-[#73736C] uppercase font-semibold text-xs tracking-wider block">
              TOTAL FLEET HOURS
            </span>
            <span className="text-2xl font-bold font-mono text-[#F5F5F3] mt-1 block">
              {formatNumber(totalFleetHours, undefined, locale)} hrs
            </span>
            <span className="text-xs text-[#73736C] mt-1 block">
              {fleet.length} {t('common.aircraft')} in service
            </span>
          </div>

          <div>
            <span className="text-[#73736C] uppercase font-semibold text-xs tracking-wider block">
              {t('safety.adDirectives')}
            </span>
            <span className="text-2xl font-bold font-mono text-[#F5F5F3] mt-1 block">
              {openIncidents.filter(i => i.investigation.airworthinessDirectiveIssued).length} Directives
            </span>
            <span className="text-xs text-[#73736C] mt-1 block">Mandatory compliance</span>
          </div>

          <div>
            <span className="text-[#73736C] uppercase font-semibold text-xs tracking-wider block">
              {t('safety.incidentHistory')}
            </span>
            <span className="text-2xl font-bold font-mono text-[#F5F5F3] mt-1 block">{incidents.length} Occurrences</span>
            <span className="text-xs text-[#73736C] mt-1 block">Total historical log</span>
          </div>
        </div>

        {/* Incident Stream & Investigation War Room */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 flex flex-col gap-4">
            <h2 className="section-title">
              {t('safety.incidentHistory')} ({incidents.length})
            </h2>

            {incidents.length === 0 ? (
              <div className="p-12 text-center text-sm text-[#73736C] bg-[#171818] border border-[rgba(255,255,255,0.07)] rounded-xl">
                {t('safety.noIncidents')}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {incidents.map(inc => (
                  <div
                    key={inc.id}
                    onClick={() => setSelectedIncident(inc)}
                    className={`bg-[#171818] border rounded-xl p-6 flex flex-col gap-3 cursor-pointer transition-all ${
                      selectedIncident?.id === inc.id
                        ? 'border-[#38bdf8] bg-[#1E1F1F]'
                        : 'border-[rgba(255,255,255,0.08)] hover:bg-[#1E1F1F]'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-base text-[#F5F5F3]">
                        {inc.flightRoute.originIata} ➔ {inc.flightRoute.destinationIata} (MSN {inc.aircraftSerialNumber})
                      </span>
                      <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-[#242525] text-[#A3A39C] uppercase">
                        {inc.severity.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-[#A3A39C] leading-relaxed">
                      {inc.investigation.rootCauseDescription || `Flight anomaly occurred on ${inc.flightRoute.originIata} to ${inc.flightRoute.destinationIata} route.`}
                    </p>
                    <div className="flex items-center justify-between text-xs font-mono text-[#73736C] pt-3 border-t border-[rgba(255,255,255,0.05)]">
                      <span>Phase: {inc.investigation.phase.replace(/_/g, ' ').toUpperCase()}</span>
                      <span>{formatGameDate(inc.occurredDate, locale)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Detailed Investigation Report */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <h2 className="section-title">
              {t('safety.investigationPhase')}
            </h2>

            <div className="bg-[#171818] border border-[rgba(255,255,255,0.08)] rounded-xl p-6 flex flex-col gap-5 text-xs">
              {selectedIncident ? (
                <>
                  <div className="border-b border-[rgba(255,255,255,0.07)] pb-4">
                    <div className="text-xs font-mono text-[#73736C] uppercase">CASE #{selectedIncident.id}</div>
                    <div className="text-lg font-bold text-[#F5F5F3] mt-1 capitalize">
                      {selectedIncident.severity.replace(/_/g, ' ')} Incident
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-[#73736C] uppercase font-semibold text-xs">Causal Root Category:</span>
                    <div className="p-4 bg-[#1E1F1F] rounded-lg border border-[rgba(255,255,255,0.07)] text-[#A3A39C] leading-relaxed text-xs capitalize">
                      {selectedIncident.investigation.rootCauseCategory?.replace(/_/g, ' ') || 'Under active air safety board technical review.'}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-[#73736C] uppercase font-semibold text-xs">Corrective Action / AD:</span>
                    <div className="p-4 bg-[#1E1F1F] rounded-lg border border-[rgba(255,255,255,0.07)] text-[#A3A39C] leading-relaxed text-xs">
                      {selectedIncident.investigation.airworthinessDirectiveIssued
                        ? `Airworthiness Directive: ${selectedIncident.investigation.airworthinessDirectiveIssued.title} (${selectedIncident.investigation.airworthinessDirectiveIssued.mandatoryAction.replace(/_/g, ' ')})`
                        : 'No fleet grounding or mandatory hardware retrofits required.'}
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-16 text-center text-[#73736C]">
                  Select an occurrence from the registry to inspect full investigation telemetry.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
