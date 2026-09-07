// ============================================================================
// PROJECT AIRFRAME - CENTRAL INTERNATIONALIZATION (i18n) ENGINE
// ============================================================================

import { create } from 'zustand';
import { en } from './locales/en';
import { ptBR } from './locales/pt-BR';
import type { GameDate } from '../types';

export type SupportedLocale = 'en' | 'pt-BR';

export interface I18nStoreState {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
}

const STORAGE_KEY = 'airframe_language';

// Detect initial locale from LocalStorage or Browser
function getInitialLocale(): SupportedLocale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'pt-BR') {
      return saved;
    }
    if (typeof navigator !== 'undefined' && navigator.language) {
      if (navigator.language.toLowerCase().startsWith('pt')) {
        return 'pt-BR';
      }
    }
  } catch {
    // Fallback if storage access is restricted
  }
  return 'en';
}

export const useI18nStore = create<I18nStoreState>((set) => ({
  locale: getInitialLocale(),
  setLocale: (newLocale: SupportedLocale) => {
    try {
      localStorage.setItem(STORAGE_KEY, newLocale);
    } catch {
      // Ignore storage error
    }
    set({ locale: newLocale });
  }
}));

const dictionaries: Record<SupportedLocale, typeof en> = {
  en: en as typeof en,
  'pt-BR': ptBR as typeof en
};

/**
 * Access nested dictionary property with key path "a.b.c"
 */
function getNestedValue(obj: unknown, path: string): string | undefined {
  if (!obj || typeof obj !== 'object') return undefined;
  const keys = path.split('.');
  let current: any = obj;
  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = current[k];
    } else {
      return undefined;
    }
  }
  return typeof current === 'string' ? current : undefined;
}

/**
 * Replace placeholders like {{name}} with params
 */
function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => {
    return params[key] !== undefined ? String(params[key]) : `{{${key}}}`;
  });
}

/**
 * Global translation function
 */
export function t(key: string, params?: Record<string, string | number>, forcedLocale?: SupportedLocale): string {
  const activeLocale = forcedLocale || useI18nStore.getState().locale;
  const dict = dictionaries[activeLocale] || dictionaries.en;
  
  // Try selected language
  let val = getNestedValue(dict, key);
  
  // Fallback to English if key missing
  if (val === undefined && activeLocale !== 'en') {
    val = getNestedValue(dictionaries.en, key);
  }
  
  if (val === undefined) {
    return key;
  }
  
  return interpolate(val, params);
}

/**
 * React Hook for reactive translations
 */
export function useTranslation() {
  const locale = useI18nStore((s) => s.locale);
  const setLocale = useI18nStore((s) => s.setLocale);

  const translate = (key: string, params?: Record<string, string | number>) => {
    return t(key, params, locale);
  };

  return {
    t: translate,
    locale,
    setLocale,
    isPtBr: locale === 'pt-BR'
  };
}

// ============================================================================
// REGIONAL FORMATTERS (Currency, Numbers, Dates)
// ============================================================================

/**
 * Format Currency in Millions of USD
 * EN:   $650.0M
 * PT-BR: US$ 650,0M
 */
export function formatCurrency(amountMillions: number, locale?: SupportedLocale): string {
  const currentLocale = locale || useI18nStore.getState().locale;
  const isPt = currentLocale === 'pt-BR';
  
  if (amountMillions >= 1000) {
    const billions = amountMillions / 1000;
    const formatted = new Intl.NumberFormat(isPt ? 'pt-BR' : 'en-US', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 2
    }).format(billions);
    return isPt ? `US$ ${formatted}B` : `$${formatted}B`;
  }

  const formatted = new Intl.NumberFormat(isPt ? 'pt-BR' : 'en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(amountMillions);

  return isPt ? `US$ ${formatted}M` : `$${formatted}M`;
}

/**
 * Format Standard Integer / Float numbers with proper thousand separators
 * EN: 5,420
 * PT-BR: 5.420
 */
export function formatNumber(value: number, options?: Intl.NumberFormatOptions, locale?: SupportedLocale): string {
  const currentLocale = locale || useI18nStore.getState().locale;
  const isPt = currentLocale === 'pt-BR';
  return new Intl.NumberFormat(isPt ? 'pt-BR' : 'en-US', options).format(value);
}

/**
 * Format In-Game Date
 * EN: Jan 03, 2016
 * PT-BR: 03 jan. 2016
 */
export function formatGameDate(date: GameDate | { year: number; month: number; day: number }, locale?: SupportedLocale): string {
  const currentLocale = locale || useI18nStore.getState().locale;
  const isPt = currentLocale === 'pt-BR';
  
  if (isPt) {
    const day = date.day.toString().padStart(2, '0');
    const monthNames = ['jan.', 'fev.', 'mar.', 'abr.', 'mai.', 'jun.', 'jul.', 'ago.', 'set.', 'out.', 'nov.', 'dez.'];
    return `${day} ${monthNames[date.month - 1]} ${date.year}`;
  } else {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = date.day.toString().padStart(2, '0');
    return `${monthNames[date.month - 1]} ${day}, ${date.year}`;
  }
}

/**
 * Format Distance (Kilometers or Nautical Miles)
 */
export function formatDistance(km: number, locale?: SupportedLocale): string {
  const currentLocale = locale || useI18nStore.getState().locale;
  const formatted = formatNumber(Math.round(km), undefined, currentLocale);
  return `${formatted} km`;
}
