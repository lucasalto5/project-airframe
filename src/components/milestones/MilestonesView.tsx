// ============================================================================
// PROJECT AIRFRAME - HISTORIC MILESTONES & COMPANY LEGACY TIMELINE
// ============================================================================

import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { useTranslation, formatGameDate } from '../../i18n';
import { Award, Building2, PlaneTakeoff, CheckCircle2, Trophy } from 'lucide-react';

export const MilestonesView: React.FC = () => {
  const { company } = useGameStore();
  const { t, locale } = useTranslation();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building2': return <Building2 className="w-5 h-5 text-[#38bdf8]" />;
      case 'PlaneTakeoff': return <PlaneTakeoff className="w-5 h-5 text-[#38bdf8]" />;
      case 'Award': return <Award className="w-5 h-5 text-emerald-400" />;
      case 'CheckCircle2': return <CheckCircle2 className="w-5 h-5 text-[#38bdf8]" />;
      default: return <Trophy className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-[#0E0F0F] text-[#F5F5F3] font-sans select-none">
      <div className="max-w-[1600px] mx-auto px-8 py-10 flex flex-col gap-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[rgba(255,255,255,0.07)]">
          <div>
            <div className="text-xs font-mono font-semibold tracking-wider text-[#73736C] uppercase">
              COMPANY HERITAGE // HISTORIC ACHIEVEMENTS
            </div>
            <h1 className="page-title text-3xl md:text-4xl mt-1">
              {t('milestones.title')}
            </h1>
            <p className="page-description max-w-2xl text-sm md:text-base mt-1">
              {t('milestones.subtitle')}
            </p>
          </div>

          <div className="text-sm font-semibold bg-[#171818] border border-[rgba(255,255,255,0.07)] px-4 py-2 rounded-lg text-[#A3A39C]">
            {t('milestones.unlocked')}: <span className="text-[#38bdf8] font-bold font-mono">{company.milestonesUnlocked.length}</span>
          </div>
        </div>

        {/* Timeline Stream */}
        <div className="relative pl-8 border-l-2 border-[rgba(255,255,255,0.1)] ml-6 flex flex-col gap-8 max-w-3xl">
          {company.milestonesUnlocked.map(ms => (
            <div key={ms.id} className="relative flex flex-col gap-2">
              {/* Timeline Node */}
              <div className="absolute -left-[41px] top-2 w-5 h-5 rounded-full bg-[#121313] border-2 border-[#38bdf8] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#38bdf8]" />
              </div>

              <div className="bg-[#171818] border border-[rgba(255,255,255,0.08)] rounded-2xl p-8 flex flex-col gap-4 shadow-sm">
                <div className="flex justify-between items-center pb-3 border-b border-[rgba(255,255,255,0.07)]">
                  <div className="flex items-center gap-3">
                    {getIcon(ms.iconName)}
                    <span className="text-lg font-bold text-[#F5F5F3]">{ms.title}</span>
                  </div>
                  <span className="text-xs font-mono font-semibold text-[#73736C]">
                    {formatGameDate(ms.achievedDate, locale)}
                  </span>
                </div>
                
                <p className="text-sm text-[#A3A39C] leading-relaxed">
                  {ms.description}
                </p>

                <div className="text-xs font-mono font-semibold text-emerald-400 pt-1">
                  Reputation Earned: +{ms.rewardReputation} pts
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
