// ============================================================================
// PROJECT AIRFRAME - MASTER APPLICATION ENTRY & VIEW ROUTER
// ============================================================================

import { useEffect, useState } from 'react';
import { useGameStore } from './store/gameStore';
import { useSettingsStore } from './store/useSettingsStore';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Topbar } from './components/shell/Topbar';
import { Sidebar } from './components/shell/Sidebar';
import { NewGameWizard } from './components/setup/NewGameWizard';
import { ExecutiveDashboard } from './components/dashboard/ExecutiveDashboard';
import { AircraftProgramStudio } from './components/studio/AircraftProgramStudio';
import { FlightTestCampaignView } from './components/testing/FlightTestCampaignView';
import { ProductionView } from './components/production/ProductionView';
import { SalesView } from './components/sales/SalesView';
import { WorldMapView } from './components/map/WorldMapView';
import { SafetyDashboard } from './components/safety/SafetyDashboard';
import { CompanyView } from './components/company/CompanyView';
import { NewsView } from './components/news/NewsView';
import { MilestonesView } from './components/milestones/MilestonesView';
import { SaveManagerModal } from './components/saves/SaveManagerModal';
import { DevPanel } from './components/dev/DevPanel';

export function App() {
  const {
    isInitialized,
    gameSpeed,
    tickGame,
    activeView,
    saveGame,
    company,
    currentDate,
    autoHydrate
  } = useGameStore();

  const { devModeUnlocked } = useSettingsStore();
  const [hasHydrated, setHasHydrated] = useState(false);

  // Auto-Hydrate state on initial load
  useEffect(() => {
    let isMounted = true;
    autoHydrate().finally(() => {
      if (isMounted) setHasHydrated(true);
    });
    return () => { isMounted = false; };
  }, [autoHydrate]);

  // Master Simulation Game Loop
  useEffect(() => {
    if (!isInitialized || gameSpeed === 0) return;

    const intervalMs = Math.max(50, Math.round(1000 / gameSpeed));
    const timer = setInterval(() => {
      tickGame();
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isInitialized, gameSpeed, tickGame]);

  // Periodic Autosave every in-game 30 days
  useEffect(() => {
    if (!isInitialized) return;
    if (currentDate.totalDays > 1 && currentDate.totalDays % 30 === 0) {
      saveGame('active_game_slot', `${company.name} [Active]`);
    }
  }, [currentDate.totalDays, isInitialized, company.name, saveGame]);

  if (!hasHydrated) {
    return (
      <div className="w-screen h-screen bg-[#0D0D0D] flex items-center justify-center text-[#A1A19A] text-sm">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#38bdf8] animate-ping" />
          <span>INITIALIZING AIRCRAFT SIMULATION ENVIRONMENT...</span>
        </div>
      </div>
    );
  }

  // If not started, show the New Company Wizard
  if (!isInitialized) {
    return (
      <ErrorBoundary>
        <NewGameWizard />
      </ErrorBoundary>
    );
  }

  // Active View Router
  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard': return <ExecutiveDashboard />;
      case 'studio': return <AircraftProgramStudio />;
      case 'testing': return <FlightTestCampaignView />;
      case 'production': return <ProductionView />;
      case 'sales': return <SalesView />;
      case 'map': return <WorldMapView />;
      case 'safety': return <SafetyDashboard />;
      case 'company': return <CompanyView />;
      case 'news': return <NewsView />;
      case 'milestones': return <MilestonesView />;
      case 'saves': return <SaveManagerModal />;
      default: return <ExecutiveDashboard />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="w-screen h-screen flex flex-col bg-[#0D0D0D] text-[#F5F5F3] overflow-hidden select-none font-sans">
        {/* Top Application Shell Bar */}
        <Topbar />

        {/* Main Workspace Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Navigation Sidebar */}
          <Sidebar />

          {/* Center Workspace Viewport */}
          <main className="flex-1 h-full overflow-hidden relative bg-[#0D0D0D]">
            {renderActiveView()}

            {/* Collapsible Developer Simulation Panel */}
            {devModeUnlocked && (
              <div className="absolute bottom-4 left-4 right-4 z-40">
                <DevPanel />
              </div>
            )}
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
