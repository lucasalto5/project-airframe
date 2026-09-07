// ============================================================================
// PROJECT AIRFRAME - EXECUTIVE COMMAND OVERVIEW (EDITORIAL LAYOUT)
// ============================================================================

import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { useTranslation, formatCurrency, formatNumber, formatGameDate, formatDistance } from '../../i18n';
import {
  ArrowRight,
  Plus,
  Compass,
  FileText,
  Newspaper,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Layers
} from 'lucide-react';

export const ExecutiveDashboard: React.FC = () => {
  const {
    company,
    setActiveView,
    setSelectedProgramId,
    setAircraftDraftStep,
    devAddCash
  } = useGameStore();

  const { t, locale, isPtBr } = useTranslation();

  const activePrograms = company.programs || [];
  const primaryProgram = activePrograms[0];
  const openRfps = company.rfpProposals.filter(r => r.status === 'open' || r.status === 'bid_submitted' || r.status === 'under_review');
  const recentNews = (company.newsHistory || []).slice(0, 4);

  const totalBacklogCount = company.programs.reduce((acc, p) => acc + p.ordersBacklogCount, 0);
  const monthlyBurn = company.financials.monthlyBurnRate || 5.5;
  const cash = company.financials.cash;
  const runwayMonths = monthlyBurn > 0 ? (cash > 0 ? Math.floor(cash / monthlyBurn) : 0) : 99;

  const trustLevelLabel = t(`common.reputationLevels.${company.trustLevel}`);
  const isInsolvent = company.financials.insolvencyStatus === 'insolvent' || cash < 0;

  // Determine Next Recommended Action (Directives #46 & #47)
  const getNextRecommendedAction = () => {
    if (activePrograms.length === 0) {
      return {
        key: 'designFirst',
        view: 'studio' as const,
        title: t('dashboard.nextAction.designFirst.title'),
        desc: t('dashboard.nextAction.designFirst.desc'),
        action: t('dashboard.nextAction.designFirst.action')
      };
    }

    const prog = primaryProgram;
    if (prog.currentPhase === 'detailed_design' || (prog.currentPhase === 'prototype_build' && prog.prototypesBuilt.length === 0)) {
      return {
        key: 'buildPrototype',
        view: 'testing' as const,
        title: t('dashboard.nextAction.buildPrototype.title'),
        desc: t('dashboard.nextAction.buildPrototype.desc'),
        action: t('dashboard.nextAction.buildPrototype.action')
      };
    }

    if (prog.currentPhase === 'ground_testing') {
      return {
        key: 'conductGroundTests',
        view: 'testing' as const,
        title: t('dashboard.nextAction.conductGroundTests.title'),
        desc: t('dashboard.nextAction.conductGroundTests.desc'),
        action: t('dashboard.nextAction.conductGroundTests.action')
      };
    }

    if (prog.currentPhase === 'flight_testing') {
      const remainingHours = Math.max(0, (prog.testCampaignsProgress.flightHoursRequired || 1800) - prog.testCampaignsProgress.flightHoursLogged);
      return {
        key: 'flightTestCampaign',
        view: 'testing' as const,
        title: t('dashboard.nextAction.flightTestCampaign.title'),
        desc: t('dashboard.nextAction.flightTestCampaign.desc', { aircraft: prog.name, hoursRemaining: remainingHours }),
        action: t('dashboard.nextAction.flightTestCampaign.action')
      };
    }

    if (prog.ordersBacklogCount === 0 && (prog.currentPhase === 'certification' || prog.currentPhase === 'production_ready')) {
      return {
        key: 'secureOrders',
        view: 'sales' as const,
        title: t('dashboard.nextAction.secureOrders.title'),
        desc: t('dashboard.nextAction.secureOrders.desc'),
        action: t('dashboard.nextAction.secureOrders.action')
      };
    }

    if (company.assemblyLines.length === 0 && prog.ordersBacklogCount > 0) {
      return {
        key: 'commissionLine',
        view: 'production' as const,
        title: t('dashboard.nextAction.commissionLine.title'),
        desc: t('dashboard.nextAction.commissionLine.desc'),
        action: t('dashboard.nextAction.commissionLine.action')
      };
    }

    return {
      key: 'deliverAircraft',
      view: 'production' as const,
      title: t('dashboard.nextAction.deliverAircraft.title'),
      desc: t('dashboard.nextAction.deliverAircraft.desc'),
      action: t('dashboard.nextAction.deliverAircraft.action')
    };
  };

  const nextAction = getNextRecommendedAction();

  return (
    <div className="w-full h-full overflow-y-auto bg-[#0E0F0F] text-[#F5F5F3] select-none font-sans">
      <div className="max-w-[1600px] mx-auto px-8 py-10 flex flex-col gap-10">
        
        {/* ================================================================ */}
        {/* 1. EXECUTIVE BRIEFING HERO */}
        {/* ================================================================ */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-[rgba(255,255,255,0.07)]">
          <div className="flex flex-col gap-3">
            <div className="text-xs font-mono font-semibold tracking-wider text-[#73736C] uppercase">
              {t('topbar.briefing')} // {company.headquartersCity.toUpperCase()}, {company.country.toUpperCase()}
            </div>

            <h1 className="page-title text-3xl md:text-4xl">
              {t('dashboard.greeting', { companyName: company.name })}
            </h1>

            <p className="page-description max-w-2xl text-sm md:text-base">
              {activePrograms.length === 0
                ? t('dashboard.briefingSubtitle')
                : t('dashboard.briefingWithProgram', { count: activePrograms.length, city: company.headquartersCity })}
            </p>

            {/* Inline Key Executive Metrics Line */}
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-3 text-sm font-mono">
              <div>
                <span className="text-xs font-semibold text-[#73736C] uppercase tracking-wider block">
                  {t('dashboard.metrics.cash')}
                </span>
                <span className={`text-lg font-bold ${cash < 0 ? 'text-rose-400' : 'text-[#F5F5F3]'}`}>
                  {formatCurrency(cash, locale)}
                </span>
              </div>

              <div className="border-l border-[rgba(255,255,255,0.07)] pl-8">
                <span className="text-xs font-semibold text-[#73736C] uppercase tracking-wider block">
                  {t('dashboard.metrics.runway')}
                </span>
                <span className={`text-lg font-bold ${cash < 0 ? 'text-rose-400 font-sans' : 'text-[#F5F5F3]'}`}>
                  {cash < 0 ? (isPtBr ? 'INSOLVENTE' : 'INSOLVENT') : `${runwayMonths} ${t('common.months')}`}
                </span>
              </div>

              <div className="border-l border-[rgba(255,255,255,0.07)] pl-8">
                <span className="text-xs font-semibold text-[#73736C] uppercase tracking-wider block">
                  {t('dashboard.metrics.backlog')}
                </span>
                <span className="text-lg font-bold text-[#F5F5F3]">
                  {formatNumber(totalBacklogCount, undefined, locale)} {t('common.units')}
                </span>
              </div>

              <div className="border-l border-[rgba(255,255,255,0.07)] pl-8 font-sans">
                <span className="text-xs font-semibold text-[#73736C] uppercase tracking-wider block">
                  {t('dashboard.metrics.trust')}
                </span>
                <span className="text-lg font-bold text-[#38bdf8] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#38bdf8]" />
                  {trustLevelLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Top Quick Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setAircraftDraftStep(1);
                setActiveView('studio');
              }}
              className="btn-aerospace primary large h-12 px-7 flex items-center gap-2.5 text-sm font-semibold shadow-lg"
            >
              <Plus className="w-4 h-4" />
              {t('navigation.aircraft')}
            </button>
          </div>
        </div>

        {/* Insolvency Warning Banner if cash < 0 (Directives #34 & #35) */}
        {isInsolvent && (
          <div className="bg-rose-950/40 border border-rose-500/50 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
            <div className="flex items-center gap-3.5">
              <AlertTriangle className="w-8 h-8 text-rose-400 flex-shrink-0" />
              <div>
                <h4 className="text-base font-bold text-rose-300">
                  {t('dashboard.insolvency.bannerTitle')} ({formatCurrency(cash, locale)})
                </h4>
                <p className="text-xs text-rose-200/80 mt-0.5">
                  {t('dashboard.insolvency.bannerDesc')}
                </p>
              </div>
            </div>
            <button
              onClick={() => devAddCash(100)}
              className="btn-aerospace primary h-11 px-5 text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white flex-shrink-0"
            >
              {t('dashboard.insolvency.emergencyFunding')}
            </button>
          </div>
        )}

        {/* Next Recommended Action Banner (Directives #46 & #47) */}
        <div className="bg-[#171818] border border-sky-500/30 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-[#38bdf8] flex-shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#38bdf8]">
                {t('dashboard.nextAction.title')}
              </div>
              <h3 className="text-lg font-bold text-[#F5F5F3] mt-0.5">
                {nextAction.title}
              </h3>
              <p className="text-xs text-[#A3A39C] mt-1 leading-relaxed max-w-2xl">
                {nextAction.desc}
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveView(nextAction.view)}
            className="btn-aerospace primary h-11 px-6 text-xs font-semibold flex items-center gap-2 flex-shrink-0 shadow-md"
          >
            {nextAction.action}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* ================================================================ */}
        {/* 2. ACTIVE PROGRAM & ROADMAP TO SERVICE */}
        {/* ================================================================ */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="section-title">
              {t('dashboard.activeProgram.title')}
            </h2>
            {activePrograms.length > 0 && (
              <button
                onClick={() => setActiveView('studio')}
                className="text-xs text-[#A3A39C] hover:text-[#F5F5F3] flex items-center gap-1.5 font-medium transition-colors"
              >
                {t('dashboard.activeProgram.viewAll', { count: activePrograms.length })}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {primaryProgram ? (
            <div className="bg-[#171818] border border-[rgba(255,255,255,0.08)] rounded-xl p-8 flex flex-col gap-7 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl md:text-3xl font-bold text-[#F5F5F3] tracking-tight">
                      {primaryProgram.name}
                    </h3>
                    <span className="text-xs px-3 py-1 rounded-md bg-[#242525] text-[#38bdf8] font-semibold capitalize">
                      {primaryProgram.marketSegment.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-[#A3A39C] mt-1.5 font-mono">
                    {t('dashboard.activeProgram.phase')}: <span className="text-[#F5F5F3] uppercase font-semibold">{primaryProgram.currentPhase.replace(/_/g, ' ')}</span> • {t('dashboard.activeProgram.targetEis', { year: primaryProgram.eisTargetDate.year })}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setSelectedProgramId(primaryProgram.id);
                      setActiveView('testing');
                    }}
                    className="btn-aerospace secondary h-11 px-5 flex items-center gap-2 text-xs font-semibold"
                  >
                    <Compass className="w-4 h-4 text-[#38bdf8]" />
                    {t('dashboard.activeProgram.flightOpsAction')}
                  </button>
                </div>
              </div>

              {/* Road to Service Lifecycle Roadmap (Directive #45) */}
              <div className="flex flex-col gap-3 pt-2">
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#666660]">
                  {t('dashboard.roadmap.title')}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 text-center text-xs font-mono">
                  {[
                    { key: 'concept', label: t('dashboard.roadmap.concept') },
                    { key: 'preliminary_design', label: t('dashboard.roadmap.preliminary') },
                    { key: 'detailed_design', label: t('dashboard.roadmap.detailed') },
                    { key: 'prototype_build', label: t('dashboard.roadmap.prototype') },
                    { key: 'ground_testing', label: t('dashboard.roadmap.groundTests') },
                    { key: 'flight_testing', label: t('dashboard.roadmap.flightTesting') },
                    { key: 'certification', label: t('dashboard.roadmap.certification') },
                    { key: 'entry_into_service', label: t('dashboard.roadmap.firstDelivery') }
                  ].map((phase, idx) => {
                    const phasesOrder = ['concept', 'preliminary_design', 'detailed_design', 'prototype_build', 'ground_testing', 'flight_testing', 'certification', 'production_ready', 'entry_into_service'];
                    const currentIdx = phasesOrder.indexOf(primaryProgram.currentPhase);
                    const phaseIdx = phasesOrder.indexOf(phase.key);
                    const isPassed = currentIdx > phaseIdx;
                    const isCurrent = currentIdx === phaseIdx || (phase.key === 'certification' && primaryProgram.currentPhase === 'production_ready');

                    return (
                      <div
                        key={phase.key}
                        className={`p-3 rounded-lg border flex flex-col justify-between gap-1 transition-all ${
                          isPassed
                            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                            : isCurrent
                            ? 'bg-sky-950/30 border-[#38bdf8] text-[#F5F5F3] font-bold shadow-sm'
                            : 'bg-[#1E1F1F] border-[rgba(255,255,255,0.06)] text-[#666660]'
                        }`}
                      >
                        <span className="text-[10px] text-[#73736C]">0{idx + 1}</span>
                        <span className="text-[11px] leading-tight">{phase.label}</span>
                        <span className="text-[9px] uppercase mt-1">
                          {isPassed ? (isPtBr ? 'Concluído' : 'Done') : isCurrent ? `${Math.round(primaryProgram.phaseProgressPercent)}%` : (isPtBr ? 'Pendente' : 'Pending')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Key Aircraft Specifications Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-5 border-t border-[rgba(255,255,255,0.07)] text-xs font-mono">
                <div>
                  <span className="text-[#73736C] uppercase tracking-wider block font-semibold text-[10px]">
                    {t('dashboard.activeProgram.specs.seating')}
                  </span>
                  <span className="text-base font-bold text-[#F5F5F3] mt-1 block">
                    {primaryProgram.geometry.typicalSeats} {t('common.passengers')}
                  </span>
                </div>
                <div>
                  <span className="text-[#73736C] uppercase tracking-wider block font-semibold text-[10px]">
                    {t('dashboard.activeProgram.specs.range')}
                  </span>
                  <span className="text-base font-bold text-[#F5F5F3] mt-1 block">
                    {formatDistance(primaryProgram.performance.rangeKm, locale)}
                  </span>
                </div>
                <div>
                  <span className="text-[#73736C] uppercase tracking-wider block font-semibold text-[10px]">
                    {t('dashboard.activeProgram.specs.listPrice')}
                  </span>
                  <span className="text-base font-bold text-[#F5F5F3] mt-1 block">
                    {formatCurrency(primaryProgram.listPrice, locale)}
                  </span>
                </div>
                <div>
                  <span className="text-[#73736C] uppercase tracking-wider block font-semibold text-[10px]">
                    {t('dashboard.activeProgram.specs.backlog')}
                  </span>
                  <span className="text-base font-bold text-[#38bdf8] mt-1 block">
                    {formatNumber(primaryProgram.ordersBacklogCount, undefined, locale)} {t('common.units')}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#171818] border border-[rgba(255,255,255,0.08)] rounded-2xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden">
              <div className="flex flex-col gap-4 max-w-xl z-10">
                <div className="text-xs font-mono font-semibold text-[#38bdf8] uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  CLEAN-SHEET R&D
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-[#F5F5F3] tracking-tight">
                  {t('dashboard.emptyState.title')}
                </h3>
                <p className="page-description text-sm md:text-base leading-relaxed">
                  {t('dashboard.emptyState.desc')}
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setAircraftDraftStep(1);
                      setActiveView('studio');
                    }}
                    className="btn-aerospace primary large h-12 px-8 flex items-center gap-2.5 text-sm font-semibold shadow-lg"
                  >
                    <Plus className="w-4 h-4" />
                    {t('dashboard.emptyState.action')}
                  </button>
                </div>
              </div>

              <div className="w-full md:w-80 h-52 bg-[#121313] border border-[rgba(255,255,255,0.06)] rounded-xl cad-grid-bg flex items-center justify-center p-4 relative shadow-inner">
                <svg className="w-full h-full text-[#38bdf8] opacity-75" viewBox="0 0 320 180" fill="none">
                  <line x1="20" y1="90" x2="300" y2="90" stroke="rgba(56, 189, 248, 0.25)" strokeDasharray="3 3" />
                  <path d="M 40 90 C 40 70, 70 65, 120 65 L 240 65 C 270 65, 290 80, 295 90 C 290 100, 270 115, 240 115 L 120 115 C 70 115, 40 110, 40 90 Z" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M 140 65 L 180 20 L 205 20 L 175 65" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M 140 115 L 180 160 L 205 160 L 175 115" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M 260 65 L 285 40 L 295 40 L 280 65" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M 260 115 L 285 140 L 295 140 L 280 115" stroke="currentColor" strokeWidth="1.2" />
                  <rect x="155" y="32" width="22" height="8" rx="3" stroke="currentColor" strokeWidth="1.2" fill="rgba(56, 189, 248, 0.1)" />
                  <rect x="155" y="140" width="22" height="8" rx="3" stroke="currentColor" strokeWidth="1.2" fill="rgba(56, 189, 248, 0.1)" />
                  <text x="24" y="30" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="monospace">REF: DWG-001</text>
                  <text x="220" y="170" fill="rgba(56, 189, 248, 0.6)" fontSize="9" fontFamily="monospace">SPAN: 34.1m</text>
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* ================================================================ */}
        {/* 3. TWO-COLUMN: RFPs & AVIATION NEWS WIRE */}
        {/* ================================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Commercial RFPs */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="section-title flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#38bdf8]" />
                {t('dashboard.rfpSection.title')}
              </h2>
              <button
                onClick={() => setActiveView('sales')}
                className="text-xs text-[#A3A39C] hover:text-[#F5F5F3] flex items-center gap-1 font-medium transition-colors"
              >
                {t('dashboard.rfpSection.viewAll', { count: openRfps.length })}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {openRfps.length === 0 ? (
                <div className="bg-[#171818] border border-[rgba(255,255,255,0.07)] rounded-xl p-8 text-center text-xs text-[#73736C]">
                  {t('dashboard.rfpSection.empty')}
                </div>
              ) : (
                openRfps.slice(0, 3).map(rfp => (
                  <div
                    key={rfp.id}
                    onClick={() => setActiveView('sales')}
                    className="bg-[#171818] hover:bg-[#1E1F1F] border border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.15)] rounded-xl p-5 transition-all cursor-pointer flex flex-col justify-between gap-3 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="font-semibold text-base text-[#F5F5F3] block">
                          {t(rfp.titleKey, rfp.titleParams)}
                        </span>
                        <span className="text-xs text-[#A3A39C] mt-0.5 block capitalize">
                          {rfp.requestedSegment.replace(/_/g, ' ')} • {rfp.targetSeatsMin}–{rfp.targetSeatsMax} {t('common.passengers')}
                        </span>
                      </div>
                      <span className="px-3 py-1 rounded-md bg-[#242525] font-mono font-bold text-xs text-[#F5F5F3]">
                        {rfp.quantityFirm} {t('common.units')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[rgba(255,255,255,0.05)] text-xs font-mono">
                      <span className="text-[#38bdf8]">
                        {t('dashboard.rfpSection.budgetPerUnit', { amount: Math.round(rfp.maxAcceptableUnitPrice) })}
                      </span>
                      <span className="text-[#A3A39C] flex items-center gap-1 font-sans">
                        {t('dashboard.rfpSection.action')} <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Aviation News Feed */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="section-title flex items-center gap-2">
                <Newspaper className="w-4 h-4 text-[#38bdf8]" />
                {t('dashboard.newsSection.title')}
              </h2>
              <button
                onClick={() => setActiveView('news')}
                className="text-xs text-[#A3A39C] hover:text-[#F5F5F3] flex items-center gap-1 font-medium transition-colors"
              >
                {t('dashboard.newsSection.viewAll')}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {recentNews.length === 0 ? (
                <div className="bg-[#171818] border border-[rgba(255,255,255,0.07)] rounded-xl p-8 text-center text-xs text-[#73736C]">
                  {t('dashboard.newsSection.empty')}
                </div>
              ) : (
                recentNews.map(news => (
                  <div
                    key={news.id}
                    onClick={() => setActiveView('news')}
                    className="bg-[#171818] hover:bg-[#1E1F1F] border border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.15)] rounded-xl p-5 transition-all cursor-pointer flex flex-col gap-2 shadow-sm"
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#73736C]">
                        {formatGameDate(news.publishedDate, locale)}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#242525] text-[10px] text-[#A3A39C] uppercase font-bold">
                        {news.category}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-[#F5F5F3] leading-snug">
                      {news.headline}
                    </h4>

                    <p className="text-xs text-[#A3A39C] line-clamp-2 leading-relaxed">
                      {news.templateId ? t(news.templateId, news.templateParams) : news.summary}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
