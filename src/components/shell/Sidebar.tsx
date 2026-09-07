// ============================================================================
// PROJECT AIRFRAME - REFINED AEROSPACE SIDEBAR SHELL
// ============================================================================

import React from 'react';
import { useGameStore } from '../../store/gameStore';
import type { GameStoreState } from '../../store/gameStore';
import { useTranslation } from '../../i18n';
import {
  LayoutDashboard,
  Plane,
  Factory,
  FileText,
  Globe2,
  ShieldCheck,
  Building2,
  Newspaper,
  Trophy,
  Save,
  Compass
} from 'lucide-react';

interface NavItem {
  id: GameStoreState['activeView'];
  labelKey: string;
  icon: React.ReactNode;
  badge?: number | string;
}

interface NavGroup {
  groupKey: string;
  items: NavItem[];
}

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, company } = useGameStore();
  const { t } = useTranslation();

  const openRfpsCount = company.rfpProposals.filter(r => r.status === 'open').length;
  const openIncidentsCount = company.incidentHistory.filter(i => i.investigation.phase !== 'final_report_closed').length;

  const NAV_GROUPS: NavGroup[] = [
    {
      groupKey: 'navigation.companyGroup',
      items: [
        { id: 'dashboard', labelKey: 'navigation.overview', icon: <LayoutDashboard className="w-[18px] h-[18px]" /> },
        { id: 'company', labelKey: 'navigation.organization', icon: <Building2 className="w-[18px] h-[18px]" /> },
        { id: 'milestones', labelKey: 'navigation.legacyTimeline', icon: <Trophy className="w-[18px] h-[18px]" /> }
      ]
    },
    {
      groupKey: 'navigation.productsGroup',
      items: [
        { id: 'studio', labelKey: 'navigation.aircraft', icon: <Plane className="w-[18px] h-[18px]" /> },
        { id: 'testing', labelKey: 'navigation.flightTesting', icon: <Compass className="w-[18px] h-[18px]" /> }
      ]
    },
    {
      groupKey: 'navigation.commercialGroup',
      items: [
        { id: 'sales', labelKey: 'navigation.ordersRfps', icon: <FileText className="w-[18px] h-[18px]" />, badge: openRfpsCount || undefined }
      ]
    },
    {
      groupKey: 'navigation.operationsGroup',
      items: [
        { id: 'production', labelKey: 'navigation.production', icon: <Factory className="w-[18px] h-[18px]" />, badge: company.assemblyLines.length || undefined },
        { id: 'safety', labelKey: 'navigation.airworthiness', icon: <ShieldCheck className="w-[18px] h-[18px]" />, badge: openIncidentsCount ? `${openIncidentsCount}!` : undefined },
        { id: 'map', labelKey: 'navigation.fleetMap', icon: <Globe2 className="w-[18px] h-[18px]" /> }
      ]
    },
    {
      groupKey: 'navigation.worldGroup',
      items: [
        { id: 'news', labelKey: 'navigation.news', icon: <Newspaper className="w-[18px] h-[18px]" /> },
        { id: 'saves', labelKey: 'navigation.saveArchive', icon: <Save className="w-[18px] h-[18px]" /> }
      ]
    }
  ];

  return (
    <aside className="w-64 h-full bg-[#121313] border-r border-[rgba(255,255,255,0.07)] flex flex-col justify-between p-4 select-none font-sans text-sm z-20">
      {/* Navigation Groups */}
      <div className="flex flex-col gap-6 overflow-y-auto pr-1">
        {NAV_GROUPS.map(group => (
          <div key={group.groupKey} className="flex flex-col gap-1.5">
            <div className="px-3 py-1 text-xs font-semibold text-[#73736C] tracking-wider uppercase">
              {t(group.groupKey)}
            </div>

            {group.items.map(item => {
              const isActive = activeView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-left transition-all ${
                    isActive
                      ? 'bg-[#1E1F1F] text-[#F5F5F3] font-semibold border border-[rgba(255,255,255,0.12)] shadow-sm'
                      : 'text-[#A3A39C] hover:text-[#F5F5F3] hover:bg-[#171818]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-[#38bdf8]' : 'text-[#73736C]'}>
                      {item.icon}
                    </span>
                    <span className="text-sm font-medium">{t(item.labelKey)}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-xs px-2 py-0.5 rounded font-mono font-bold ${
                      item.badge.toString().includes('!')
                        ? 'bg-rose-500/20 text-rose-300'
                        : 'bg-[#242525] text-[#A3A39C]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer System Status */}
      <div className="pt-4 border-t border-[rgba(255,255,255,0.07)] flex items-center justify-between px-2 text-xs text-[#73736C]">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
          <span className="font-medium text-[#A3A39C]">AIRFRAME SIM</span>
        </span>
        <span className="font-mono text-[#73736C]">v2.1</span>
      </div>
    </aside>
  );
};
