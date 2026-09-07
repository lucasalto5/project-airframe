// ============================================================================
// PROJECT AIRFRAME - SAVE ARCHIVE & BACKUP MANAGER
// ============================================================================

import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { storageManager } from '../../storage/db';
import { useTranslation, formatGameDate } from '../../i18n';
import type { GameSaveMetadata } from '../../types';
import {
  Download,
  Upload,
  Copy,
  Trash2,
  Plus,
  CheckCircle2
} from 'lucide-react';

export const SaveManagerModal: React.FC = () => {
  const { company, saveGame, loadGame, importSaveJson, setActiveView } = useGameStore();
  const { t, locale } = useTranslation();

  const [saves, setSaves] = useState<GameSaveMetadata[]>([]);
  const [newSaveName, setNewSaveName] = useState<string>(`${company.name} - Simulation Archive`);
  const [importJsonText, setImportJsonText] = useState<string>('');
  const [showImportArea, setShowImportArea] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const refreshSaves = async () => {
    const list = await storageManager.listSaves();
    setSaves(list);
  };

  useEffect(() => {
    refreshSaves();
  }, []);

  const handleCreateNewSave = async () => {
    if (!newSaveName.trim()) return;
    const saveId = `save_${Date.now()}`;
    await saveGame(saveId, newSaveName);
    setStatusMessage('Simulation saved successfully into local IndexedDB storage.');
    refreshSaves();
  };

  const handleLoad = async (saveId: string) => {
    const success = await loadGame(saveId);
    if (success) {
      setStatusMessage('Simulation restored successfully.');
      setActiveView('dashboard');
    } else {
      setStatusMessage('Failed to load save state.');
    }
  };

  const handleDelete = async (saveId: string) => {
    await storageManager.deleteSave(saveId);
    refreshSaves();
  };

  const handleDuplicate = async (saveId: string, name: string) => {
    await storageManager.duplicateSave(saveId, `${name} (Copy)`);
    refreshSaves();
  };

  const handleExportJson = async (saveId: string) => {
    const json = await storageManager.exportSaveToJSON(saveId);
    if (!json) return;
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `project_airframe_${saveId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = async () => {
    if (!importJsonText.trim()) return;
    const success = await importSaveJson(importJsonText);
    if (success) {
      setStatusMessage('Save backup imported successfully.');
      setActiveView('dashboard');
    } else {
      setStatusMessage('Invalid save file format.');
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-[#0E0F0F] text-[#F5F5F3] font-sans select-none">
      <div className="max-w-[1600px] mx-auto px-8 py-10 flex flex-col gap-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[rgba(255,255,255,0.07)]">
          <div>
            <div className="text-xs font-mono font-semibold tracking-wider text-[#73736C] uppercase">
              LOCAL PERSISTENCE // SAVE ARCHIVE
            </div>
            <h1 className="page-title text-3xl md:text-4xl mt-1">
              {t('navigation.saveArchive')}
            </h1>
            <p className="page-description max-w-2xl text-sm md:text-base mt-1">
              Manage multi-slot IndexedDB saves, export backups as JSON, and duplicate simulation timelines.
            </p>
          </div>

          <button
            onClick={() => setShowImportArea(!showImportArea)}
            className="btn-aerospace secondary h-11 px-5 text-sm font-semibold flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            {showImportArea ? 'Hide Import' : 'Import JSON Save'}
          </button>
        </div>

        {statusMessage && (
          <div className="p-5 bg-[#171818] border border-emerald-500/30 rounded-xl text-xs font-mono text-emerald-400 flex items-center gap-3 shadow-sm">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* JSON Import Area */}
        {showImportArea && (
          <div className="bg-[#171818] border border-[rgba(255,255,255,0.12)] rounded-2xl p-8 flex flex-col gap-4 shadow-xl">
            <h3 className="section-title">Import JSON Simulation Backup</h3>
            <textarea
              rows={4}
              value={importJsonText}
              onChange={e => setImportJsonText(e.target.value)}
              placeholder="Paste exported Project Airframe JSON string here..."
              className="w-full bg-[#121313] border border-[rgba(255,255,255,0.08)] rounded-xl p-4 font-mono text-xs text-[#F5F5F3] outline-none"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={handleImportSubmit}
                className="btn-aerospace primary h-11 px-6 text-sm font-semibold"
              >
                Restore Simulation from JSON
              </button>
            </div>
          </div>
        )}

        {/* Create New Save Slot Bar */}
        <div className="bg-[#171818] border border-[rgba(255,255,255,0.08)] rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-4 shadow-sm">
          <input
            type="text"
            value={newSaveName}
            onChange={e => setNewSaveName(e.target.value)}
            placeholder="Archive slot label..."
            className="flex-1 font-semibold text-base"
          />
          <button
            onClick={handleCreateNewSave}
            className="btn-aerospace primary large h-12 px-8 text-sm font-semibold flex items-center gap-2.5 shadow-lg w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            Create Save Slot
          </button>
        </div>

        {/* Save Slots List */}
        <div className="flex flex-col gap-4">
          <h2 className="section-title">
            Archived Simulation Slots ({saves.length})
          </h2>

          <div className="flex flex-col gap-4">
            {saves.map(save => (
              <div
                key={save.id}
                className="bg-[#171818] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm"
              >
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-lg text-[#F5F5F3]">{save.name}</span>
                    {save.isAutosave && (
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#242525] text-[#38bdf8] uppercase">
                        Autosave
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-[#A3A39C] flex items-center gap-4 font-mono">
                    <span>Company: {save.companyName} [{save.companyTicker}]</span>
                    <span>Date: {formatGameDate(save.currentDate, locale)}</span>
                    <span>Saved: {new Date(save.savedAtTimestamp).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 self-end md:self-center">
                  <button
                    onClick={() => handleLoad(save.id)}
                    className="btn-aerospace primary h-10 px-5 text-xs font-semibold"
                  >
                    Restore
                  </button>
                  <button
                    onClick={() => handleDuplicate(save.id, save.name)}
                    title="Duplicate Slot"
                    className="btn-aerospace secondary h-10 px-3.5"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleExportJson(save.id)}
                    title="Export JSON"
                    className="btn-aerospace secondary h-10 px-3.5"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(save.id)}
                    title="Delete Slot"
                    className="btn-aerospace danger h-10 px-3.5"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
