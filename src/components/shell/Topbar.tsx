// ============================================================================
// PROJECT AIRFRAME - REFINED AEROSPACE TOPBAR SHELL
// ============================================================================

import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { useTranslation, formatCurrency, formatGameDate } from '../../i18n';
import type { GameSpeed } from '../../types';
import {
  Pause,
  AlertTriangle,
  Bell,
  Save,
  Loader2,
  Globe2,
  Calendar
} from 'lucide-react';

export const Topbar: React.FC = () => {
  const {
    company,
    currentDate,
    gameSpeed,
    setGameSpeed,
    setActiveView,
    saveStatus,
    saveGame
  } = useGameStore();

  const { t, locale, setLocale } = useTranslation();

  const activeIncidents = company.incidentHistory.filter(
    i => i.investigation.phase !== 'final_report_closed'
  );

  const handleManualSave = () => {
    saveGame('active_game_slot', `${company.name} [Active]`);
  };

  return (
    <header className="w-full h-16 bg-[#121313] border-b border-[rgba(255,255,255,0.07)] px-6 flex items-center justify-between select-none z-30 font-sans">
      {/* Left: Manufacturer Brand & Ticker */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <span className="text-base font-bold tracking-tight text-[#F5F5F3]">
            {company.name}
          </span>
          <span className="px-2 py-0.5 rounded bg-[#1E1F1F] text-xs font-mono font-bold text-[#38bdf8]">
            {company.ticker}
          </span>
        </div>

        <div className="hidden xl:flex items-center gap-2 border-l border-[rgba(255,255,255,0.07)] pl-4">
          <span className="text-xs text-[#A3A39C]">
            {company.headquartersCity}, {company.country}
          </span>
        </div>
      </div>

      {/* Center: In-Game Date & Speed Controls */}
      <div className="flex items-center gap-5">
        {/* Localized In-Game Date */}
        <div className="flex items-center gap-2.5 bg-[#171818] border border-[rgba(255,255,255,0.07)] px-4 py-2 rounded-lg text-xs font-mono text-[#F5F5F3]">
          <Calendar className="w-3.5 h-3.5 text-[#38bdf8]" />
          <span className="font-semibold text-sm">
            {formatGameDate(currentDate, locale)}
          </span>
          <span className="text-[#73736C] border-l border-[rgba(255,255,255,0.07)] pl-2.5">
            Q{currentDate.quarter}
          </span>
        </div>

        {/* Speed Controls Popover / Discrete Buttons */}
        <div className="flex items-center bg-[#171818] border border-[rgba(255,255,255,0.07)] rounded-lg p-1 gap-1">
          <button
            onClick={() => setGameSpeed(0)}
            title={t('topbar.pause')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
              gameSpeed === 0
                ? 'bg-[#242525] text-[#38bdf8] font-bold shadow-sm'
                : 'text-[#73736C] hover:text-[#F5F5F3]'
            }`}
          >
            <Pause className="w-3.5 h-3.5" />
          </button>

          {([1, 2, 4, 8] as GameSpeed[]).map(s => (
            <button
              key={s}
              onClick={() => setGameSpeed(s)}
              title={`${s}× Speed`}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-colors ${
                gameSpeed === s
                  ? 'bg-[#F5F5F3] text-[#0E0F0F] font-bold shadow-sm'
                  : 'text-[#A3A39C] hover:text-[#F5F5F3] hover:bg-[#1E1F1F]'
              }`}
            >
              {s}×
            </button>
          ))}
        </div>
      </div>

      {/* Right: Cash Treasury, Language Switcher, Alerts, Actions */}
      <div className="flex items-center gap-4 text-xs">
        {/* Treasury Cash Display */}
        <div className="flex items-center gap-2 bg-[#171818] border border-[rgba(255,255,255,0.07)] px-4 py-2 rounded-lg">
          <span className="text-[#73736C] uppercase font-semibold text-[11px] tracking-wider">
            {t('topbar.treasury')}
          </span>
          <span className="text-sm font-bold font-mono text-[#F5F5F3]">
            {formatCurrency(company.financials.cash, locale)}
          </span>
        </div>

        {/* Language Switcher Button (Directive #26) */}
        <button
          onClick={() => setLocale(locale === 'en' ? 'pt-BR' : 'en')}
          title={t('topbar.language')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#171818] hover:bg-[#1E1F1F] border border-[rgba(255,255,255,0.07)] text-[#F5F5F3] font-semibold transition-colors"
        >
          <Globe2 className="w-3.5 h-3.5 text-[#38bdf8]" />
          <span>{locale === 'en' ? 'EN' : 'PT'}</span>
        </button>

        {/* Active Incidents Alert */}
        {activeIncidents.length > 0 && (
          <button
            onClick={() => setActiveView('safety')}
            title={t('topbar.alerts')}
            className="flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 px-3 py-2 rounded-lg font-mono font-bold animate-pulse"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{activeIncidents.length}</span>
          </button>
        )}

        {/* News Bell */}
        <button
          onClick={() => setActiveView('news')}
          title={t('topbar.dispatches')}
          className="p-2.5 text-[#A3A39C] hover:text-[#F5F5F3] rounded-lg bg-[#171818] hover:bg-[#1E1F1F] border border-[rgba(255,255,255,0.07)] transition-colors"
        >
          <Bell className="w-4 h-4" />
        </button>

        {/* Manual Save / Status */}
        <button
          onClick={handleManualSave}
          title={t('topbar.manualSave')}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#171818] hover:bg-[#1E1F1F] border border-[rgba(255,255,255,0.07)] text-[#A3A39C] hover:text-[#F5F5F3] transition-colors"
        >
          {saveStatus === 'saving' ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#38bdf8]" />
          ) : (
            <Save className="w-4 h-4" />
          )}
        </button>
      </div>
    </header>
  );
};
