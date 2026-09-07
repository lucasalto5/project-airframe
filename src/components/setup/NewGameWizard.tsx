// ============================================================================
// PROJECT AIRFRAME - FOUND NEW AEROSPACE MANUFACTURER (5-STEP WIZARD)
// ============================================================================

import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { useTranslation, formatCurrency } from '../../i18n';
import type { FundingType, CompanyPhilosophy } from '../../types';
import {
  ArrowRight,
  ArrowLeft,
  Building2,
  CheckCircle2,
  Sparkles,
  MapPin
} from 'lucide-react';

interface HQOption {
  city: string;
  country: string;
  region: string;
  engineeringTalent: string;
  laborCost: string;
  supplierAccess: string;
  governmentSupport: string;
  desc: string;
}

const HQ_PRESETS: HQOption[] = [
  {
    city: 'Seattle',
    country: 'United States',
    region: 'North America',
    engineeringTalent: 'Excellent',
    laborCost: 'Premium',
    supplierAccess: 'Excellent',
    governmentSupport: 'Moderate',
    desc: 'Historic aerospace capital with unparalleled widebody assembly heritage and deep Boeing/tier-1 supplier talent pool.'
  },
  {
    city: 'São José dos Campos',
    country: 'Brazil',
    region: 'Latin America',
    engineeringTalent: 'Excellent',
    laborCost: 'Moderate',
    supplierAccess: 'Strong',
    governmentSupport: 'Strong',
    desc: 'World leader in regional jet engineering (Embraer hub) with outstanding aerostructures talent and competitive operational costs.'
  },
  {
    city: 'Toulouse',
    country: 'France',
    region: 'Europe',
    engineeringTalent: 'Excellent',
    laborCost: 'High',
    supplierAccess: 'Excellent',
    governmentSupport: 'Strong',
    desc: 'European aerospace epicenter (Airbus hub) with world-class aerodynamics research institutes and flight testing infrastructure.'
  },
  {
    city: 'Hamburg',
    country: 'Germany',
    region: 'Europe',
    engineeringTalent: 'Excellent',
    laborCost: 'High',
    supplierAccess: 'Strong',
    governmentSupport: 'Moderate',
    desc: 'Premier center for cabin interiors, systems integration, and high-rate narrowbody fuselage manufacturing.'
  },
  {
    city: 'Nagoya',
    country: 'Japan',
    region: 'Asia Pacific',
    engineeringTalent: 'Strong',
    laborCost: 'High',
    supplierAccess: 'Excellent',
    governmentSupport: 'Strong',
    desc: 'Advanced carbon-composite fabrication cluster with legendary precision manufacturing and avionics expertise.'
  },
  {
    city: 'Xi\'an',
    country: 'China',
    region: 'Asia Pacific',
    engineeringTalent: 'Strong',
    laborCost: 'Low',
    supplierAccess: 'Moderate',
    governmentSupport: 'Excellent',
    desc: 'Rapidly emerging aerospace manufacturing center backed by massive state infrastructure support and high domestic growth.'
  },
  {
    city: 'Montreal',
    country: 'Canada',
    region: 'North America',
    engineeringTalent: 'Excellent',
    laborCost: 'Moderate',
    supplierAccess: 'Strong',
    governmentSupport: 'Strong',
    desc: 'Thriving aerospace ecosystem (Bombardier / Pratt & Whitney Canada) with strong specialized avionics and business jet expertise.'
  },
  {
    city: 'Derby',
    country: 'United Kingdom',
    region: 'Europe',
    engineeringTalent: 'Excellent',
    laborCost: 'High',
    supplierAccess: 'Strong',
    governmentSupport: 'Moderate',
    desc: 'Global propulsion heartland (Rolls-Royce) with cutting-edge turbine materials and thermodynamic engineering talent.'
  }
];

interface FundingData {
  type: FundingType;
  titleKey: string;
  capitalAmount: number; // in Millions
  equity: number;
  boardSeats: number;
  pressure: 'Low' | 'Moderate' | 'High' | 'Strategic';
  burnEst: number;
}

const FUNDING_PRESETS: FundingData[] = [
  {
    type: 'bootstrapped',
    titleKey: 'bootstrapped',
    capitalAmount: 120,
    equity: 100,
    boardSeats: 0,
    pressure: 'Low',
    burnEst: 3.2
  },
  {
    type: 'private_equity',
    titleKey: 'private_equity',
    capitalAmount: 650,
    equity: 65,
    boardSeats: 2,
    pressure: 'Moderate',
    burnEst: 5.8
  },
  {
    type: 'venture_capital',
    titleKey: 'venture_capital',
    capitalAmount: 950,
    equity: 50,
    boardSeats: 3,
    pressure: 'High',
    burnEst: 8.5
  },
  {
    type: 'industrial_group',
    titleKey: 'industrial_group',
    capitalAmount: 1200,
    equity: 40,
    boardSeats: 3,
    pressure: 'Moderate',
    burnEst: 9.6
  },
  {
    type: 'state_backed',
    titleKey: 'state_backed',
    capitalAmount: 1600,
    equity: 30,
    boardSeats: 4,
    pressure: 'Strategic',
    burnEst: 11.2
  }
];

const PHILOSOPHY_TYPES: CompanyPhilosophy[] = [
  'engineering_excellence',
  'cost_leadership',
  'passenger_comfort',
  'operational_ruggedness',
  'technological_pioneer'
];

export const NewGameWizard: React.FC = () => {
  const { initNewGame } = useGameStore();
  const { t, locale, setLocale } = useTranslation();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 5;

  // Form State
  const [companyName, setCompanyName] = useState('Aureon Aerospace');
  const [ticker, setTicker] = useState('AUR');
  const [selectedHqIndex, setSelectedHqIndex] = useState<number>(1); // Default to São José dos Campos or Seattle
  const [selectedFunding, setSelectedFunding] = useState<FundingType>('private_equity');
  const [selectedPhilosophy, setSelectedPhilosophy] = useState<CompanyPhilosophy>('engineering_excellence');

  const selectedHq = HQ_PRESETS[selectedHqIndex];
  const selectedFundingObj = FUNDING_PRESETS.find(f => f.type === selectedFunding) || FUNDING_PRESETS[1];

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(s => s + 1);
    } else {
      handleFinalSubmit();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(s => s - 1);
    }
  };

  const handleFinalSubmit = () => {
    initNewGame({
      companyName: companyName.trim() || 'Aureon Aerospace',
      ticker: ticker.trim().toUpperCase() || 'AUR',
      country: selectedHq.country,
      hqCity: selectedHq.city,
      philosophy: selectedPhilosophy,
      fundingType: selectedFunding,
      startYear: 2016,
      seed: 20160101,
      primaryColor: '#0ea5e9',
      accentColor: '#f59e0b'
    });
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-[#0E0F0F] text-[#F5F5F3] font-sans flex flex-col justify-between select-none">
      {/* Top Header Bar */}
      <header className="w-full border-b border-[rgba(255,255,255,0.07)] px-8 py-5 flex items-center justify-between bg-[#121313]">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#38bdf8]" />
          <span className="text-xs font-mono font-semibold tracking-wider text-[#A3A39C] uppercase">
            {t('company.founding.badge')}
          </span>
        </div>

        {/* Language Quick Toggle */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setLocale(locale === 'en' ? 'pt-BR' : 'en')}
            className="px-3 py-1.5 rounded bg-[#1E1F1F] hover:bg-[#242525] border border-[rgba(255,255,255,0.08)] text-[#F5F5F3] font-medium transition-colors"
          >
            {locale === 'en' ? 'Português (Brasil)' : 'English (US)'}
          </button>
        </div>
      </header>

      {/* Main Content Workspace Container */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-4xl flex flex-col gap-8">
          {/* Progress Indicator */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-sm font-medium text-[#A3A39C]">
              <span>
                {t('company.founding.stepIndicator', { current: currentStep, total: totalSteps })}
              </span>
              <span className="text-[#F5F5F3] font-semibold">
                {currentStep === 1 && t('company.founding.steps.identity')}
                {currentStep === 2 && t('company.founding.steps.headquarters')}
                {currentStep === 3 && t('company.founding.steps.financing')}
                {currentStep === 4 && t('company.founding.steps.philosophy')}
                {currentStep === 5 && t('company.founding.steps.review')}
              </span>
            </div>

            {/* Stepper bar */}
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map(step => (
                <div
                  key={step}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    step <= currentStep ? 'bg-[#F5F5F3]' : 'bg-[#1E1F1F]'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* ================================================================ */}
          {/* STEP 1: IDENTITY */}
          {/* ================================================================ */}
          {currentStep === 1 && (
            <div className="flex flex-col gap-8 animate-fadeIn">
              <div className="flex flex-col gap-2">
                <h1 className="page-title">{t('company.founding.step1.title')}</h1>
                <p className="page-description">{t('company.founding.step1.desc')}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Inputs */}
                <div className="flex flex-col gap-6 bg-[#171818] border border-[rgba(255,255,255,0.07)] p-8 rounded-xl">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#A3A39C]">
                      {t('company.founding.step1.nameLabel')}
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      placeholder={t('company.founding.step1.namePlaceholder')}
                      className="w-full text-base font-semibold"
                      maxLength={32}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#A3A39C]">
                      {t('company.founding.step1.tickerLabel')}
                    </label>
                    <input
                      type="text"
                      value={ticker}
                      onChange={e => setTicker(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
                      placeholder={t('company.founding.step1.tickerPlaceholder')}
                      className="w-full text-base font-mono font-bold"
                      maxLength={4}
                    />
                  </div>
                </div>

                {/* Live Brand Identity Preview */}
                <div className="bg-[#171818] border border-[rgba(255,255,255,0.07)] p-8 rounded-xl flex flex-col gap-6">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#A3A39C] uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-[#38bdf8]" />
                    {t('company.founding.step1.previewTitle')}
                  </div>

                  <div className="bg-[#121313] border border-[rgba(255,255,255,0.05)] p-6 rounded-lg flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-[#F5F5F3]">
                        {companyName || 'Aureon Aerospace'}
                      </span>
                      <span className="px-2.5 py-1 rounded bg-[#242525] font-mono font-bold text-sm text-[#38bdf8]">
                        {ticker || 'AUR'}
                      </span>
                    </div>
                    <p className="text-xs text-[#73736C] leading-relaxed">
                      {t('company.founding.step1.previewDesc')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* STEP 2: HEADQUARTERS */}
          {/* ================================================================ */}
          {currentStep === 2 && (
            <div className="flex flex-col gap-8 animate-fadeIn">
              <div className="flex flex-col gap-2">
                <h1 className="page-title">{t('company.founding.step2.title')}</h1>
                <p className="page-description">{t('company.founding.step2.desc')}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                {/* 8 Global Aerospace Hub Cards */}
                <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-1">
                  {HQ_PRESETS.map((hq, idx) => {
                    const isSelected = selectedHqIndex === idx;
                    return (
                      <button
                        key={hq.city}
                        onClick={() => setSelectedHqIndex(idx)}
                        className={`p-4 rounded-xl text-left transition-all border ${
                          isSelected
                            ? 'bg-[#1E1F1F] border-[#F5F5F3] shadow-lg'
                            : 'bg-[#171818] border-[rgba(255,255,255,0.07)] hover:bg-[#1E1F1F] hover:border-[rgba(255,255,255,0.15)]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-base text-[#F5F5F3]">{hq.city}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-[#F5F5F3]" />}
                        </div>
                        <div className="text-xs text-[#A3A39C] mt-1">{hq.country}</div>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Hub Consequence Details */}
                <div className="md:col-span-5 bg-[#171818] border border-[rgba(255,255,255,0.07)] p-6 rounded-xl flex flex-col gap-5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#A3A39C] uppercase tracking-wider">
                    <MapPin className="w-4 h-4 text-[#38bdf8]" />
                    {selectedHq.city}, {selectedHq.country}
                  </div>

                  <p className="text-xs text-[#A3A39C] leading-relaxed">
                    {selectedHq.desc}
                  </p>

                  <div className="flex flex-col gap-3 pt-3 border-t border-[rgba(255,255,255,0.07)] text-xs">
                    <div className="flex justify-between items-center py-1">
                      <span className="text-[#73736C]">{t('company.founding.step2.engineeringTalent')}</span>
                      <span className="font-semibold text-[#F5F5F3]">{selectedHq.engineeringTalent}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-[#73736C]">{t('company.founding.step2.laborCost')}</span>
                      <span className="font-semibold text-[#F5F5F3]">{selectedHq.laborCost}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-[#73736C]">{t('company.founding.step2.supplierAccess')}</span>
                      <span className="font-semibold text-[#F5F5F3]">{selectedHq.supplierAccess}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-[#73736C]">{t('company.founding.step2.governmentSupport')}</span>
                      <span className="font-semibold text-[#F5F5F3]">{selectedHq.governmentSupport}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* STEP 3: FINANCING */}
          {/* ================================================================ */}
          {currentStep === 3 && (
            <div className="flex flex-col gap-8 animate-fadeIn">
              <div className="flex flex-col gap-2">
                <h1 className="page-title">{t('company.founding.step3.title')}</h1>
                <p className="page-description">{t('company.founding.step3.desc')}</p>
              </div>

              <div className="flex flex-col gap-3 max-h-[460px] overflow-y-auto pr-1">
                {FUNDING_PRESETS.map(fund => {
                  const isSelected = selectedFunding === fund.type;
                  const title = t(`company.founding.step3.options.${fund.titleKey}.title`);
                  const desc = t(`company.founding.step3.options.${fund.titleKey}.desc`);

                  return (
                    <button
                      key={fund.type}
                      onClick={() => setSelectedFunding(fund.type)}
                      className={`p-5 rounded-xl text-left transition-all border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        isSelected
                          ? 'bg-[#1E1F1F] border-[#F5F5F3] shadow-md'
                          : 'bg-[#171818] border-[rgba(255,255,255,0.07)] hover:bg-[#1E1F1F]'
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-base text-[#F5F5F3]">{title}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-[#F5F5F3]" />}
                        </div>
                        <p className="text-xs text-[#A3A39C] mt-1.5 leading-relaxed">{desc}</p>
                      </div>

                      <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-[rgba(255,255,255,0.07)] pt-3 md:pt-0 md:pl-6 text-xs">
                        <div>
                          <span className="text-[#73736C] block">{t('company.founding.step3.startingCapital')}</span>
                          <span className="font-bold text-base text-[#F5F5F3]">
                            {formatCurrency(fund.capitalAmount)}
                          </span>
                        </div>

                        <div>
                          <span className="text-[#73736C] block">{t('company.founding.step3.founderEquity')}</span>
                          <span className="font-semibold text-sm text-[#F5F5F3]">{fund.equity}%</span>
                        </div>

                        <div>
                          <span className="text-[#73736C] block">{t('company.founding.step3.boardSeats')}</span>
                          <span className="font-semibold text-sm text-[#F5F5F3]">{fund.boardSeats}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* STEP 4: PHILOSOPHY */}
          {/* ================================================================ */}
          {currentStep === 4 && (
            <div className="flex flex-col gap-8 animate-fadeIn">
              <div className="flex flex-col gap-2">
                <h1 className="page-title">{t('company.founding.step4.title')}</h1>
                <p className="page-description">{t('company.founding.step4.desc')}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[460px] overflow-y-auto pr-1">
                {PHILOSOPHY_TYPES.map(philType => {
                  const isSelected = selectedPhilosophy === philType;
                  const title = t(`company.founding.step4.options.${philType}.title`);
                  const desc = t(`company.founding.step4.options.${philType}.desc`);

                  return (
                    <button
                      key={philType}
                      onClick={() => setSelectedPhilosophy(philType)}
                      className={`p-5 rounded-xl text-left transition-all border flex flex-col justify-between gap-4 ${
                        isSelected
                          ? 'bg-[#1E1F1F] border-[#F5F5F3] shadow-md'
                          : 'bg-[#171818] border-[rgba(255,255,255,0.07)] hover:bg-[#1E1F1F]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-base text-[#F5F5F3]">{title}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-[#F5F5F3]" />}
                        </div>
                        <p className="text-xs text-[#A3A39C] mt-2 leading-relaxed">{desc}</p>
                      </div>

                      {/* Smooth expansion on select (Directive #51 & #52) */}
                      {isSelected && (
                        <div className="pt-3 border-t border-[rgba(255,255,255,0.07)] flex flex-col gap-1 text-[11px] text-[#38bdf8] animate-fadeIn">
                          <span>✓ Strategic performance multiplier</span>
                          <span>✓ Tailored market perception</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* STEP 5: REVIEW & INCORPORATE */}
          {/* ================================================================ */}
          {currentStep === 5 && (
            <div className="flex flex-col gap-8 animate-fadeIn">
              <div className="flex flex-col gap-2">
                <h1 className="page-title">{t('company.founding.step5.title')}</h1>
                <p className="page-description">{t('company.founding.step5.desc')}</p>
              </div>

              {/* Official Incorporation Certificate Layout */}
              <div className="bg-[#171818] border border-[rgba(255,255,255,0.12)] p-8 rounded-2xl flex flex-col gap-8 shadow-2xl relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[rgba(255,255,255,0.07)]">
                  <div>
                    <span className="text-2xl font-bold text-[#F5F5F3] tracking-tight block">
                      {companyName || 'Aureon Aerospace'}
                    </span>
                    <span className="text-xs text-[#A3A39C] mt-1 block">
                      {selectedHq.city}, {selectedHq.country}
                    </span>
                  </div>

                  <span className="px-4 py-1.5 rounded-lg bg-[#242525] font-mono font-bold text-lg text-[#38bdf8] self-start">
                    {ticker || 'AUR'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm">
                  <div>
                    <span className="text-xs text-[#73736C] block uppercase tracking-wider">
                      {t('company.founding.step5.startingCapital')}
                    </span>
                    <span className="text-xl font-bold text-[#F5F5F3] mt-1 block font-mono">
                      {formatCurrency(selectedFundingObj.capitalAmount)}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-[#73736C] block uppercase tracking-wider">
                      {t('company.founding.step5.monthlyBurnEst')}
                    </span>
                    <span className="text-xl font-bold text-[#F5F5F3] mt-1 block font-mono">
                      {formatCurrency(selectedFundingObj.burnEst)}/mo
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-[#73736C] block uppercase tracking-wider">
                      {t('company.founding.step5.founderOwnership')}
                    </span>
                    <span className="text-xl font-bold text-[#F5F5F3] mt-1 block font-mono">
                      {selectedFundingObj.equity}%
                    </span>
                  </div>

                  <div className="col-span-2 sm:col-span-3 pt-4 border-t border-[rgba(255,255,255,0.07)]">
                    <span className="text-xs text-[#73736C] block uppercase tracking-wider">
                      {t('company.founding.step5.philosophyLabel')}
                    </span>
                    <span className="text-base font-semibold text-[#F5F5F3] mt-1 block">
                      {t(`company.founding.step4.options.${selectedPhilosophy}.title`)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls Footer */}
          <div className="flex items-center justify-between pt-6 border-t border-[rgba(255,255,255,0.07)]">
            {currentStep > 1 ? (
              <button
                onClick={handlePrevStep}
                className="btn-aerospace secondary h-11 px-6 flex items-center gap-2 text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                {t('common.back')}
              </button>
            ) : (
              <div />
            )}

            {currentStep < totalSteps ? (
              <button
                onClick={handleNextStep}
                className="btn-aerospace primary h-11 px-8 flex items-center gap-2 text-sm font-semibold"
              >
                {t('common.continue')}
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinalSubmit}
                className="btn-aerospace primary large h-12 px-10 flex items-center gap-3 text-base font-bold shadow-lg"
              >
                <Building2 className="w-5 h-5" />
                {t('company.founding.step5.submitButton', { companyName })}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
