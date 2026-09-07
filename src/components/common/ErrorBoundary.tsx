// ============================================================================
// PROJECT AIRFRAME - AEROSPACE GRADE REACT ERROR BOUNDARY
// ============================================================================

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Download } from 'lucide-react';
import { storageManager } from '../../storage/db';


interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('CRITICAL UNCAUGHT UI EXCEPTION:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleEmergencyReset = () => {
    storageManager.clearActiveSaveId();
    storageManager.clearAircraftDraft();
    localStorage.removeItem('airframe_active_view');
    window.location.reload();
  };

  private handleExportBackup = async () => {
    try {
      const activeId = storageManager.getActiveSaveId() || 'active_game_slot';
      const json = await storageManager.exportSaveToJSON(activeId);
      if (json) {
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `airframe_emergency_backup_${Date.now()}.json`;
        a.click();
      }
    } catch (e) {
      alert('Could not export backup: ' + e);
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-screen h-screen bg-[#0D0D0D] text-[#F5F5F3] flex flex-col items-center justify-center p-8 select-none font-sans">
          <div className="max-w-xl w-full bg-[#141414] border border-[#242424] p-8 rounded-md flex flex-col gap-6">
            <div className="flex items-center gap-3 text-amber-400">
              <AlertTriangle className="w-8 h-8 flex-shrink-0" />
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-[#F5F5F3]">
                  Aero-Systems Interruption
                </h1>
                <p className="text-xs text-[#A1A19A]">
                  A user interface error occurred during execution. Your simulation state in storage is preserved.
                </p>
              </div>
            </div>

            {/* Error Message */}
            <div className="bg-[#1B1B1B] p-4 rounded border border-[#242424] text-xs font-mono text-red-300 overflow-auto max-h-40 whitespace-pre-wrap">
              {this.state.error?.toString() || 'Unknown runtime error'}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="btn-aerospace primary h-10 px-5 flex items-center gap-2 text-sm font-medium"
              >
                <RotateCcw className="w-4 h-4" />
                Reload Application
              </button>

              <button
                onClick={this.handleExportBackup}
                className="btn-aerospace h-10 px-4 flex items-center gap-2 text-sm font-medium text-[#A1A19A]"
              >
                <Download className="w-4 h-4" />
                Export Emergency Backup
              </button>

              <button
                onClick={this.handleEmergencyReset}
                className="btn-aerospace h-10 px-4 text-xs text-red-400 hover:text-red-300 ml-auto"
              >
                Reset Session
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
