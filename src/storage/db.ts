// ============================================================================
// PROJECT AIRFRAME - LOCAL STORAGE & INDEXEDDB PERSISTENCE LAYER
// ============================================================================

import type { CompanyState, MacroEconomy, GameDate, GameSaveMetadata, CompetitorManufacturer, AirlineCustomer } from '../types';

export const CURRENT_SCHEMA_VERSION = 1;
const DB_NAME = 'ProjectAirframeDB';
const DB_VERSION = 1;
const SAVES_STORE_NAME = 'game_saves';
const METADATA_STORE_NAME = 'save_metadata';

export interface FullGameState {
  schemaVersion: number;
  seed: number;
  currentDate: GameDate;
  gameSpeed: number;
  macroEconomy: MacroEconomy;
  company: CompanyState;
  competitors: CompetitorManufacturer[];
  airlines: AirlineCustomer[];
  playtimeMinutes: number;
  savedAtTimestamp: number;
}

class StorageManager {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private openDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(SAVES_STORE_NAME)) {
          db.createObjectStore(SAVES_STORE_NAME, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(METADATA_STORE_NAME)) {
          db.createObjectStore(METADATA_STORE_NAME, { keyPath: 'id' });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        console.error('Failed to open IndexedDB:', request.error);
        reject(request.error);
      };
    });

    return this.dbPromise;
  }

  public async saveGame(
    saveId: string,
    saveName: string,
    state: FullGameState,
    isAutosave: boolean = false
  ): Promise<GameSaveMetadata> {
    const metadata: GameSaveMetadata = {
      id: saveId,
      name: saveName,
      companyName: state.company.name,
      companyTicker: state.company.ticker,
      currentDate: { ...state.currentDate },
      savedAtTimestamp: Date.now(),
      schemaVersion: CURRENT_SCHEMA_VERSION,
      seed: state.seed,
      playtimeMinutes: state.playtimeMinutes,
      isAutosave
    };

    try {
      const db = await this.openDB();
      const tx = db.transaction([SAVES_STORE_NAME, METADATA_STORE_NAME], 'readwrite');
      
      const saveRecord = {
        id: saveId,
        metadata,
        state: JSON.parse(JSON.stringify(state))
      };

      tx.objectStore(SAVES_STORE_NAME).put(saveRecord);
      tx.objectStore(METADATA_STORE_NAME).put(metadata);

      await new Promise<void>((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });

      return metadata;
    } catch (err) {
      console.warn('IndexedDB failed, falling back to localStorage:', err);
      localStorage.setItem(`airframe_save_${saveId}`, JSON.stringify({ id: saveId, metadata, state }));
      return metadata;
    }
  }

  public async loadGame(saveId: string): Promise<FullGameState | null> {
    try {
      const db = await this.openDB();
      const tx = db.transaction(SAVES_STORE_NAME, 'readonly');
      const store = tx.objectStore(SAVES_STORE_NAME);
      const req = store.get(saveId);

      const result = await new Promise<{ id: string; metadata: GameSaveMetadata; state: FullGameState } | undefined>((resolve, reject) => {
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });

      if (result && result.state) {
        return result.state;
      }
    } catch (err) {
      console.warn('Error loading from IndexedDB:', err);
    }

    const localData = localStorage.getItem(`airframe_save_${saveId}`);
    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        return parsed.state;
      } catch (e) {
        console.error('Failed to parse localStorage save:', e);
      }
    }

    return null;
  }

  public async listSaves(): Promise<GameSaveMetadata[]> {
    try {
      const db = await this.openDB();
      const tx = db.transaction(METADATA_STORE_NAME, 'readonly');
      const store = tx.objectStore(METADATA_STORE_NAME);
      const req = store.getAll();

      const list = await new Promise<GameSaveMetadata[]>((resolve, reject) => {
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
      });

      return list.sort((a, b) => b.savedAtTimestamp - a.savedAtTimestamp);
    } catch (err) {
      console.warn('Listing saves from IndexedDB failed:', err);
      const saves: GameSaveMetadata[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('airframe_save_')) {
          try {
            const raw = localStorage.getItem(key);
            if (raw) saves.push(JSON.parse(raw).metadata);
          } catch {
            // ignore
          }
        }
      }
      return saves.sort((a, b) => b.savedAtTimestamp - a.savedAtTimestamp);
    }
  }

  public async deleteSave(saveId: string): Promise<void> {
    try {
      const db = await this.openDB();
      const tx = db.transaction([SAVES_STORE_NAME, METADATA_STORE_NAME], 'readwrite');
      tx.objectStore(SAVES_STORE_NAME).delete(saveId);
      tx.objectStore(METADATA_STORE_NAME).delete(saveId);
      await new Promise<void>((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch {
      // fallback
    }
    localStorage.removeItem(`airframe_save_${saveId}`);
  }

  public saveAircraftDraft(draft: unknown): void {
    try {
      localStorage.setItem('airframe_aircraft_draft', JSON.stringify(draft));
    } catch (e) {
      console.warn('Failed to save aircraft draft to localStorage:', e);
    }
  }

  public loadAircraftDraft(): unknown | null {
    try {
      const data = localStorage.getItem('airframe_aircraft_draft');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  public clearAircraftDraft(): void {
    localStorage.removeItem('airframe_aircraft_draft');
  }

  public setActiveSaveId(saveId: string): void {
    localStorage.setItem('airframe_active_save_id', saveId);
  }

  public getActiveSaveId(): string | null {
    return localStorage.getItem('airframe_active_save_id');
  }

  public clearActiveSaveId(): void {
    localStorage.removeItem('airframe_active_save_id');
  }

  public async duplicateSave(sourceSaveId: string, newName: string): Promise<GameSaveMetadata | null> {
    const existing = await this.loadGame(sourceSaveId);
    if (!existing) return null;
    const newSaveId = `save_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    return this.saveGame(newSaveId, newName, existing, false);
  }

  public async exportSaveToJSON(saveId: string): Promise<string | null> {
    const state = await this.loadGame(saveId);
    if (!state) return null;
    return JSON.stringify({
      schemaVersion: CURRENT_SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      state
    }, null, 2);
  }

  public async importSaveFromJSON(jsonString: string): Promise<GameSaveMetadata> {
    const parsed = JSON.parse(jsonString);
    const state: FullGameState = parsed.state || parsed;
    const saveId = `imported_${Date.now()}`;
    const saveName = `Imported - ${state.company?.name || 'Airframe Company'}`;
    return this.saveGame(saveId, saveName, state, false);
  }
}

export const storageManager = new StorageManager();

