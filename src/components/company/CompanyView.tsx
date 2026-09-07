// ============================================================================
// PROJECT AIRFRAME - ENTERPRISE RESOURCES, WORKFORCE & FINANCIAL P&L
// ============================================================================

import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { useTranslation, formatCurrency, formatNumber } from '../../i18n';
import { MARKET_SEGMENTS_DATA } from '../../data/marketSegments';
import { Plus, Minus } from 'lucide-react';

export const CompanyView: React.FC = () => {
  const { company, updateDepartmentHeadcount } = useGameStore();
  const { t, locale } = useTranslation();

  const [activeTab, setActiveTab] = useState<'workforce' | 'facilities' | 'financials' | 'market_forecast'>('workforce');

  const departments = company.departments || [];
  const facilities = company.facilities || [];
  const financials = company.financials;

  return (
    <div className="w-full h-full overflow-y-auto bg-[#0E0F0F] text-[#F5F5F3] font-sans select-none">
      <div className="max-w-[1600px] mx-auto px-8 py-10 flex flex-col gap-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[rgba(255,255,255,0.07)]">
          <div>
            <div className="text-xs font-mono font-semibold tracking-wider text-[#73736C] uppercase">
              ENTERPRISE RESOURCES // {company.name} [{company.ticker}]
            </div>
            <h1 className="page-title text-3xl md:text-4xl mt-1">
              {t('navigation.organization')} & {t('navigation.finance')}
            </h1>
            <p className="page-description max-w-2xl text-sm md:text-base mt-1">
              Department staffing levels, engineering knowledge pools, real estate footprint, and quarterly cash flow statements.
            </p>
          </div>

          {/* Tab Controls */}
          <div className="flex items-center gap-1.5 bg-[#171818] p-1.5 rounded-xl border border-[rgba(255,255,255,0.07)] text-xs font-medium">
            {[
              { id: 'workforce', label: `Staffing (${departments.length})` },
              { id: 'facilities', label: `Facilities (${facilities.length})` },
              { id: 'financials', label: 'Financial P&L' },
              { id: 'market_forecast', label: 'Market Forecast' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#1E1F1F] text-[#F5F5F3] font-bold border border-[rgba(255,255,255,0.12)] shadow-sm'
                    : 'text-[#A3A39C] hover:text-[#F5F5F3] hover:bg-[#1E1F1F]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 1. Workforce Tab */}
        {activeTab === 'workforce' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {departments.map(dept => (
              <div
                key={dept.id}
                className="bg-[#171818] border border-[rgba(255,255,255,0.08)] rounded-xl p-6 flex flex-col justify-between gap-5 shadow-sm"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-base text-[#F5F5F3]">{dept.name}</span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#242525] text-[#38bdf8] uppercase">
                      {dept.category}
                    </span>
                  </div>
                  <div className="text-xs text-[#A3A39C] mt-1.5">
                    Avg Experience: {dept.averageExperience.toFixed(1)} yrs • Morale: {dept.morale}%
                  </div>
                </div>

                <div className="pt-4 border-t border-[rgba(255,255,255,0.07)] flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[#73736C] uppercase font-semibold text-[11px] block">HEADCOUNT</span>
                    <span className="text-base font-bold font-mono text-[#F5F5F3] mt-0.5 block">{dept.headcount} Staff</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateDepartmentHeadcount(dept.id, -5)}
                      className="p-2 rounded-lg bg-[#1E1F1F] hover:bg-[#242525] border border-[rgba(255,255,255,0.07)] text-[#A3A39C] hover:text-[#F5F5F3] transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => updateDepartmentHeadcount(dept.id, 5)}
                      className="p-2 rounded-lg bg-[#1E1F1F] hover:bg-[#242525] border border-[rgba(255,255,255,0.07)] text-[#A3A39C] hover:text-[#F5F5F3] transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 2. Facilities Tab */}
        {activeTab === 'facilities' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {facilities.map(fac => (
              <div
                key={fac.id}
                className="bg-[#171818] border border-[rgba(255,255,255,0.08)] rounded-xl p-8 flex flex-col justify-between gap-6 shadow-sm"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-lg text-[#F5F5F3]">{fac.name}</span>
                    <span className="text-xs px-2.5 py-1 rounded bg-[#242525] text-[#38bdf8] font-bold uppercase">
                      Level {fac.level}
                    </span>
                  </div>
                  <div className="text-sm text-[#A3A39C] mt-1">
                    {fac.locationCity}, {fac.country}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-5 border-t border-[rgba(255,255,255,0.07)] text-xs">
                  <div>
                    <span className="text-[#73736C] uppercase font-semibold block">STAFF CAPACITY</span>
                    <span className="text-base font-bold font-mono text-[#F5F5F3] mt-1 block">{fac.capacity} Workstations</span>
                  </div>
                  <div>
                    <span className="text-[#73736C] uppercase font-semibold block">OPERATING COST</span>
                    <span className="text-base font-bold font-mono text-[#F5F5F3] mt-1 block">${fac.monthlyOperatingCost}M / month</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 3. Financial P&L Statement */}
        {activeTab === 'financials' && (
          <div className="bg-[#171818] border border-[rgba(255,255,255,0.08)] rounded-2xl p-10 flex flex-col gap-8 max-w-2xl text-xs shadow-sm">
            <h3 className="text-base font-bold uppercase tracking-wider text-[#73736C]">
              Quarterly Cash Flow & Burn Breakdown
            </h3>

            <div className="flex flex-col gap-4">
              <div className="flex justify-between py-3 border-b border-[rgba(255,255,255,0.07)]">
                <span className="text-sm text-[#A3A39C]">Gross Liquid Treasury:</span>
                <span className="font-bold text-[#F5F5F3] text-base font-mono">{formatCurrency(financials.cash, locale)}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-[rgba(255,255,255,0.07)]">
                <span className="text-sm text-[#A3A39C]">Estimated Corporate Valuation:</span>
                <span className="font-bold text-[#F5F5F3] text-base font-mono">{formatCurrency(financials.valuation, locale)}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-[rgba(255,255,255,0.07)]">
                <span className="text-sm text-[#A3A39C]">Total Outstanding Debt:</span>
                <span className="font-bold text-[#F5F5F3] text-base font-mono">{formatCurrency(financials.totalDebt, locale)}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-[rgba(255,255,255,0.07)]">
                <span className="text-sm text-[#A3A39C]">Monthly Operating Expenses (Opex):</span>
                <span className="font-bold text-rose-400 text-base font-mono">-{formatCurrency(financials.monthlyExpenses, locale)}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-sm text-[#A3A39C]">Net Monthly Burn Rate:</span>
                <span className="font-bold text-rose-400 text-base font-mono">-{formatCurrency(financials.monthlyBurnRate, locale)}</span>
              </div>
            </div>
          </div>
        )}

        {/* 4. 20-Year Global Market Forecast */}
        {activeTab === 'market_forecast' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {MARKET_SEGMENTS_DATA.map(seg => (
              <div
                key={seg.id}
                className="bg-[#171818] border border-[rgba(255,255,255,0.08)] rounded-xl p-6 flex flex-col justify-between gap-5 shadow-sm"
              >
                <div>
                  <h4 className="font-bold text-base text-[#F5F5F3]">{seg.name}</h4>
                  <p className="text-xs text-[#A3A39C] mt-2 leading-relaxed">{seg.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[rgba(255,255,255,0.07)] text-xs font-mono">
                  <div>
                    <span className="text-[#73736C] block uppercase font-semibold text-[11px]">20-YR DEMAND</span>
                    <span className="text-sm font-bold text-[#F5F5F3] mt-0.5 block">{formatNumber(seg.projected20YearDemandUnits, undefined, locale)} {t('common.units')}</span>
                  </div>
                  <div>
                    <span className="text-[#73736C] block uppercase font-semibold text-[11px]">ANNUAL GROWTH</span>
                    <span className="text-sm font-bold text-emerald-400 mt-0.5 block">+{seg.projectedAnnualGrowthPercent}% / yr</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
