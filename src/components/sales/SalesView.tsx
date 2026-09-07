// ============================================================================
// PROJECT AIRFRAME - COMMERCIAL FLEET SALES & AIRLINE RFPS
// ============================================================================

import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { useTranslation, formatCurrency } from '../../i18n';
import type { RFPProposal, ContractProposal } from '../../types';
import { checkAircraftRfpCompatibility } from '../../simulation/rfpEngine';
import { X, Clock } from 'lucide-react';

export const SalesView: React.FC = () => {
  const { company, airlines, submitRfpProposal } = useGameStore();
  const { t, locale, isPtBr } = useTranslation();

  const [selectedRfp, setSelectedRfp] = useState<RFPProposal | null>(null);
  const [selectedProgramId, setSelectedProgramId] = useState<string>(
    company.programs[0]?.id || ''
  );
  const [offeredDiscount, setOfferedDiscount] = useState<number>(12);
  const [supportPackage] = useState<'basic' | 'standard_turnkey' | 'comprehensive_fleet_care'>('standard_turnkey');
  const [financingOption] = useState<'none' | 'manufacturer_backed_loan' | 'operating_lease_partner'>('none');

  const openRfps = company.rfpProposals.filter(
    r => r.status === 'open' || r.status === 'bid_submitted' || r.status === 'under_review'
  );
  const contracts = company.firmContracts || [];

  // Sync selected program
  useEffect(() => {
    if (!selectedProgramId && company.programs.length > 0) {
      setSelectedProgramId(company.programs[0].id);
    }
  }, [company.programs, selectedProgramId]);

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedRfp(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSendProposal = () => {
    if (!selectedRfp) return;
    const prog = company.programs.find(p => p.id === selectedProgramId) || company.programs[0];
    if (!prog) return;

    const discountedPrice = parseFloat((prog.listPrice * (1 - offeredDiscount / 100)).toFixed(2));

    const prop: ContractProposal = {
      rfpId: selectedRfp.id,
      programId: prog.id,
      offeredUnitPrice: discountedPrice,
      discountPercentage: offeredDiscount,
      quantityFirm: selectedRfp.quantityFirm,
      quantityOptions: selectedRfp.quantityOptions,
      deliverySlotsPerYear: 12,
      deliveryStartQuarter: {
        year: selectedRfp.desiredFirstDeliveryYear,
        quarter: 1
      },
      supportPackageIncluded: supportPackage,
      financingAssistance: financingOption,
      performanceGuarantees: {
        fuelBurnWarranty: true,
        dispatchReliabilityWarranty: true,
        lateDeliveryPenaltyPerDay: 0.05
      }
    };

    submitRfpProposal(selectedRfp.id, prop);
    setSelectedRfp(null);
  };

  const currentOfferedProgram = company.programs.find(p => p.id === selectedProgramId) || company.programs[0];
  const compatibility = selectedRfp && currentOfferedProgram
    ? checkAircraftRfpCompatibility(currentOfferedProgram, selectedRfp)
    : null;

  return (
    <div className="w-full h-full overflow-y-auto bg-[#0E0F0F] text-[#F5F5F3] font-sans select-none">
      <div className="max-w-[1600px] mx-auto px-8 py-10 flex flex-col gap-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[rgba(255,255,255,0.07)]">
          <div>
            <div className="text-xs font-mono font-semibold tracking-wider text-[#73736C] uppercase">
              {isPtBr ? 'DIVISÃO COMERCIAL // CONTRATOS DE FROTA' : 'COMMERCIAL DIVISION // AIRLINE FLEET TENDERS'}
            </div>
            <h1 className="page-title text-3xl md:text-4xl mt-1">
              {t('rfp.title')}
            </h1>
            <p className="page-description max-w-2xl text-sm md:text-base mt-1">
              {isPtBr
                ? 'Dispute pedidos de frotas globais com base em economia de combustível, preço unitário negociado e pontualidade de entrega.'
                : 'Compete for global airline orders against legacy airframers based on economics, range, and unit pricing.'}
            </p>
          </div>

          <div className="text-sm font-semibold bg-[#171818] border border-[rgba(255,255,255,0.07)] px-4 py-2.5 rounded-lg text-[#A3A39C]">
            {isPtBr ? 'Concorrências Abertas:' : 'Active Tenders:'} <span className="text-[#38bdf8] font-bold font-mono">{openRfps.length}</span>
          </div>
        </div>

        {/* Main Grid: RFPs & Signed Contracts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Open RFPs Stream */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <h2 className="section-title">
              {t('rfp.openTenders')} ({openRfps.length})
            </h2>

            {openRfps.length === 0 ? (
              <div className="p-12 text-center text-sm text-[#73736C] bg-[#171818] border border-[rgba(255,255,255,0.07)] rounded-xl">
                {isPtBr
                  ? 'Nenhuma concorrência aberta no momento. Novas solicitações de propostas são publicadas periodicamente pelas companhias aéreas.'
                  : 'No active airline RFPs open at this moment. New tenders are published periodically as airlines retire older fleets.'}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {openRfps.map(rfp => {
                  const airline = airlines.find(a => a.id === rfp.airlineId);
                  const isUnderReview = rfp.status === 'under_review' || rfp.status === 'bid_submitted';
                  const primaryProg = company.programs[0];
                  const compat = primaryProg ? checkAircraftRfpCompatibility(primaryProg, rfp) : null;

                  return (
                    <div
                      key={rfp.id}
                      className="bg-[#171818] border border-[rgba(255,255,255,0.08)] rounded-xl p-6 flex flex-col gap-5 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-lg font-bold text-[#F5F5F3]">
                            {t(rfp.titleKey, rfp.titleParams)}
                          </div>
                          <div className="text-xs text-[#A3A39C] mt-1 capitalize">
                            {airline?.name} ({airline?.country}) • {isPtBr ? 'Segmento:' : 'Segment:'} {rfp.requestedSegment.replace(/_/g, ' ')}
                          </div>
                        </div>

                        {/* Status / Compatibility Badge */}
                        <div className="flex flex-col items-end gap-1.5">
                          {isUnderReview ? (
                            <span className="text-xs font-mono font-bold px-3 py-1 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              {isPtBr ? `ANÁLISE (${rfp.reviewDaysRemaining || 14}d)` : `REVIEWING (${rfp.reviewDaysRemaining || 14}d)`}
                            </span>
                          ) : compat ? (
                            <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md border ${
                              compat.rating === 'excellent'
                                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                                : compat.rating === 'good'
                                ? 'bg-sky-500/10 text-sky-300 border-sky-500/30'
                                : compat.rating === 'marginal'
                                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                                : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                            }`}>
                              {t(`rfp.compatibility.${compat.rating}`)}
                            </span>
                          ) : (
                            <span className="text-xs font-semibold px-3 py-1 rounded-md bg-[#242525] text-[#38bdf8]">
                              OPEN TENDER
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Inline Specs */}
                      <div className="grid grid-cols-3 gap-4 py-4 border-y border-[rgba(255,255,255,0.07)] text-xs font-mono">
                        <div>
                          <span className="text-[#73736C] uppercase font-semibold block text-[10px]">{t('rfp.quantity')}</span>
                          <span className="text-sm font-bold text-[#F5F5F3] mt-0.5 block">
                            {rfp.quantityFirm} Firm (+{rfp.quantityOptions})
                          </span>
                        </div>
                        <div>
                          <span className="text-[#73736C] uppercase font-semibold block text-[10px]">{t('rfp.maxBudget')}</span>
                          <span className="text-sm font-bold text-[#F5F5F3] mt-0.5 block">
                            {formatCurrency(rfp.maxAcceptableUnitPrice, locale)}/unit
                          </span>
                        </div>
                        <div>
                          <span className="text-[#73736C] uppercase font-semibold block text-[10px]">{t('rfp.deliveryDesired')}</span>
                          <span className="text-sm font-bold text-[#F5F5F3] mt-0.5 block">
                            {isPtBr ? `Ano ${rfp.desiredFirstDeliveryYear}` : `Year ${rfp.desiredFirstDeliveryYear}`}
                          </span>
                        </div>
                      </div>

                      {/* Actions & Airline Autonomous Decision Notice */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="text-xs text-[#A3A39C]">
                          {isPtBr ? 'Critério prioritário:' : 'Key priority:'} <span className="text-[#F5F5F3]">{rfp.importanceWeights.fuelEconomy > 0.28 ? (isPtBr ? 'Economia de Combustível' : 'Fuel Economy') : (isPtBr ? 'Preço de Aquisição' : 'Acquisition Cost')}</span>
                        </div>

                        {rfp.status === 'open' ? (
                          <button
                            onClick={() => setSelectedRfp(rfp)}
                            className="btn-aerospace primary h-11 px-6 text-xs font-semibold"
                          >
                            {t('rfp.submitBid')}
                          </button>
                        ) : (
                          <div className="text-xs font-mono text-amber-300 flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            {isPtBr ? `Decisão da companhia em ~${rfp.reviewDaysRemaining || 14} dias` : `Airline decision in ~${rfp.reviewDaysRemaining || 14} days`}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Firm Order Contracts & Backlog */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <h2 className="section-title">
              {t('rfp.activeContracts')} ({contracts.length})
            </h2>

            <div className="bg-[#171818] border border-[rgba(255,255,255,0.08)] rounded-xl p-6 flex flex-col gap-3">
              {contracts.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#73736C]">
                  {isPtBr
                    ? 'Nenhum contrato de compra assinado ainda. Envie propostas em concorrências abertas para garantir sua carteira de entregas.'
                    : 'No customer purchase agreements signed yet. Submit bids on open tenders to secure customer delivery backlog.'}
                </div>
              ) : (
                contracts.map(cnt => (
                  <div key={cnt.id} className="p-4 bg-[#1E1F1F] rounded-xl flex flex-col gap-2 text-xs font-mono">
                    <div className="flex justify-between items-center font-bold text-sm text-[#F5F5F3]">
                      <span>{cnt.airlineId}</span>
                      <span className="text-emerald-400">{formatCurrency(cnt.totalContractValue, locale)}</span>
                    </div>
                    <div className="text-[#A3A39C]">
                      {cnt.quantityFirm} Firm units @ {formatCurrency(cnt.unitNegotiatedPrice, locale)} each
                    </div>
                    <div className="text-[11px] text-[#73736C] pt-1 border-t border-[rgba(255,255,255,0.05)] flex justify-between">
                      <span>{isPtBr ? 'Sinal recebido:' : 'Down payment:'} {formatCurrency(cnt.downPaymentReceived, locale)}</span>
                      <span className="text-emerald-400 font-bold">{isPtBr ? 'ATIVO' : 'ACTIVE'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Proposal Bid Modal (Directives #22, #23, #24) */}
        {selectedRfp && (
          <div
            className="modal-overlay"
            onClick={() => setSelectedRfp(null)}
          >
            <div
              className="bg-[#171818] border border-[rgba(255,255,255,0.15)] rounded-2xl max-w-xl w-full p-8 flex flex-col gap-6 font-sans shadow-2xl select-none"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center pb-4 border-b border-[rgba(255,255,255,0.07)]">
                <div>
                  <h3 className="text-lg font-bold text-[#F5F5F3]">
                    {t('rfp.submitBid')}
                  </h3>
                  <p className="text-xs text-[#A3A39C] mt-0.5">
                    {t(selectedRfp.titleKey, selectedRfp.titleParams)} ({selectedRfp.quantityFirm} Firm + {selectedRfp.quantityOptions} Options)
                  </p>
                </div>
                <button
                  onClick={() => setSelectedRfp(null)}
                  className="text-[#73736C] hover:text-[#F5F5F3] p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {company.programs.length === 0 ? (
                <div className="text-sm text-rose-400">
                  {isPtBr ? 'Nenhum programa de aeronave ativo. Lance um avião no estúdio primeiro.' : 'No active aircraft programs available. Launch a design program in the studio first.'}
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {/* Aircraft Selector (Directive #23) */}
                  <div>
                    <label className="text-xs font-semibold text-[#A3A39C] block mb-1.5 uppercase tracking-wider">
                      {isPtBr ? 'Selecione a Aeronave a Oferecer' : 'Select Aircraft Model Offered'}
                    </label>
                    <select
                      value={selectedProgramId}
                      onChange={e => setSelectedProgramId(e.target.value)}
                      className="w-full bg-[#1E1F1F] border border-[rgba(255,255,255,0.12)] p-3 rounded-lg text-sm text-[#F5F5F3] font-semibold"
                    >
                      {company.programs.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.geometry.typicalSeats} pax • List: {formatCurrency(p.listPrice, locale)})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Compatibility & Fit Breakdown (Directives #22, #24) */}
                  {compatibility && (
                    <div className="p-4 bg-[#1E1F1F] rounded-xl border border-[rgba(255,255,255,0.08)] flex flex-col gap-3 text-xs">
                      <div className="flex justify-between items-center font-bold">
                        <span className="text-[#A3A39C] uppercase">{isPtBr ? 'Adequação da Proposta' : 'Proposal Fit'}</span>
                        <span className={`font-mono px-2.5 py-0.5 rounded ${
                          compatibility.rating === 'excellent' ? 'bg-emerald-500/20 text-emerald-300' :
                          compatibility.rating === 'good' ? 'bg-sky-500/20 text-sky-300' :
                          compatibility.rating === 'marginal' ? 'bg-amber-500/20 text-amber-300' :
                          'bg-rose-500/20 text-rose-300'
                        }`}>
                          {t(`rfp.compatibility.${compatibility.rating}`)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-[11px] font-mono text-[#73736C]">
                        <div>
                          <span>{isPtBr ? 'Assentos:' : 'Seats:'} </span>
                          <span className="text-[#F5F5F3] font-bold">{currentOfferedProgram?.geometry.typicalSeats} (Req: {selectedRfp.targetSeatsMin}–{selectedRfp.targetSeatsMax})</span>
                        </div>
                        <div>
                          <span>{isPtBr ? 'Alcance:' : 'Range:'} </span>
                          <span className="text-[#F5F5F3] font-bold">{Math.round(currentOfferedProgram?.performance.rangeKm || 0)} km (Req: {selectedRfp.targetRangeKm} km)</span>
                        </div>
                      </div>

                      {compatibility.reasons.length > 0 && (
                        <div className="text-[11px] text-rose-300 font-mono">
                          ⚠ {compatibility.reasons.join(' • ')}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Pricing Discount Slider */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-2">
                      <span className="text-[#A3A39C] uppercase tracking-wider">{isPtBr ? 'Desconto sobre o Preço de Tabela' : 'Volume Discount Off List Price'}</span>
                      <span className="text-[#F5F5F3] font-bold font-mono">{offeredDiscount}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="35"
                      value={offeredDiscount}
                      onChange={e => setOfferedDiscount(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs font-mono text-[#73736C] mt-2">
                      <span>{isPtBr ? 'Negociado:' : 'Negotiated:'} {formatCurrency((currentOfferedProgram?.listPrice || 60) * (1 - offeredDiscount / 100), locale)}/un</span>
                      <span>{isPtBr ? 'Teto do Cliente:' : 'Max Target:'} {formatCurrency(selectedRfp.maxAcceptableUnitPrice, locale)}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[rgba(255,255,255,0.07)] flex justify-end gap-3">
                    <button
                      onClick={() => setSelectedRfp(null)}
                      className="btn-aerospace secondary h-11 px-5 text-sm"
                    >
                      {t('common.cancel')}
                    </button>
                    <button
                      onClick={handleSendProposal}
                      disabled={compatibility?.rating === 'incompatible'}
                      className="btn-aerospace primary h-11 px-7 text-sm font-semibold"
                    >
                      {isPtBr ? 'Enviar Proposta Vinculante' : 'Dispatch Binding Fleet Proposal'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
