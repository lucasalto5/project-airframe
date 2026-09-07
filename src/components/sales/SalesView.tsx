// ============================================================================
// PROJECT AIRFRAME - COMMERCIAL FLEET SALES & AIRLINE RFPS
// ============================================================================

import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { useTranslation, formatCurrency } from '../../i18n';
import type { RFPProposal, ContractProposal } from '../../types';
import { X } from 'lucide-react';

export const SalesView: React.FC = () => {
  const { company, airlines, submitRfpProposal, evaluateRfp } = useGameStore();
  const { t, locale } = useTranslation();

  const [selectedRfp, setSelectedRfp] = useState<RFPProposal | null>(null);
  const [offeredDiscount, setOfferedDiscount] = useState<number>(12);
  const [supportPackage] = useState<'basic' | 'standard_turnkey' | 'comprehensive_fleet_care'>('standard_turnkey');
  const [financingOption] = useState<'none' | 'manufacturer_backed_loan' | 'operating_lease_partner'>('none');

  const openRfps = company.rfpProposals.filter(r => r.status === 'open' || r.status === 'bid_submitted');
  const contracts = company.firmContracts || [];

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedRfp(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSendProposal = () => {
    if (!selectedRfp || company.programs.length === 0) return;
    const prog = company.programs[0];
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

  return (
    <div className="w-full h-full overflow-y-auto bg-[#0E0F0F] text-[#F5F5F3] font-sans select-none">
      <div className="max-w-[1600px] mx-auto px-8 py-10 flex flex-col gap-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[rgba(255,255,255,0.07)]">
          <div>
            <div className="text-xs font-mono font-semibold tracking-wider text-[#73736C] uppercase">
              COMMERCIAL DIVISION // AIRLINE CONTRACTS
            </div>
            <h1 className="page-title text-3xl md:text-4xl mt-1">
              {t('rfp.title')}
            </h1>
            <p className="page-description max-w-2xl text-sm md:text-base mt-1">
              Compete for global airline orders against legacy airframers based on economics, range, and unit pricing.
            </p>
          </div>

          <div className="text-sm font-semibold bg-[#171818] border border-[rgba(255,255,255,0.07)] px-4 py-2 rounded-lg text-[#A3A39C]">
            Active Tenders: <span className="text-[#38bdf8] font-bold font-mono">{openRfps.length}</span>
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
                No active airline RFPs open at this moment. New tenders are published periodically as airlines retire older fleets.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {openRfps.map(rfp => {
                  const airline = airlines.find(a => a.id === rfp.airlineId);

                  return (
                    <div
                      key={rfp.id}
                      className="bg-[#171818] border border-[rgba(255,255,255,0.08)] rounded-xl p-6 flex flex-col gap-5 shadow-sm"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-lg font-bold text-[#F5F5F3]">{rfp.title}</div>
                          <div className="text-xs text-[#A3A39C] mt-1 capitalize">
                            {airline?.name} ({airline?.country}) • Segment: {rfp.requestedSegment.replace(/_/g, ' ')}
                          </div>
                        </div>

                        <span className={`text-xs font-semibold px-3 py-1 rounded-md ${
                          rfp.status === 'bid_submitted'
                            ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                            : 'bg-[#242525] text-[#38bdf8]'
                        }`}>
                          {rfp.status === 'bid_submitted' ? 'BID PENDING' : 'OPEN TENDER'}
                        </span>
                      </div>

                      {/* Inline Specs */}
                      <div className="grid grid-cols-3 gap-4 py-4 border-y border-[rgba(255,255,255,0.07)] text-xs">
                        <div>
                          <span className="text-[#73736C] uppercase font-semibold block">{t('rfp.quantity')}</span>
                          <span className="text-sm font-bold text-[#F5F5F3] mt-0.5 block font-mono">
                            {rfp.quantityFirm} Firm (+{rfp.quantityOptions})
                          </span>
                        </div>
                        <div>
                          <span className="text-[#73736C] uppercase font-semibold block">{t('rfp.maxBudget')}</span>
                          <span className="text-sm font-bold text-[#F5F5F3] mt-0.5 block font-mono">
                            {formatCurrency(rfp.maxAcceptableUnitPrice, locale)}/unit
                          </span>
                        </div>
                        <div>
                          <span className="text-[#73736C] uppercase font-semibold block">{t('rfp.deliveryDesired')}</span>
                          <span className="text-sm font-bold text-[#F5F5F3] mt-0.5 block font-mono">
                            Year {rfp.desiredFirstDeliveryYear}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="text-xs text-[#A3A39C]">
                          Key criteria: {rfp.importanceWeights.fuelEconomy > 0.25 ? 'Fuel Economy' : 'Acquisition Cost'} & Passenger Comfort
                        </div>

                        {rfp.status === 'open' ? (
                          <button
                            onClick={() => setSelectedRfp(rfp)}
                            className="btn-aerospace primary h-11 px-6 text-sm font-semibold"
                          >
                            {t('rfp.submitBid')}
                          </button>
                        ) : (
                          <button
                            onClick={() => evaluateRfp(rfp.id)}
                            className="btn-aerospace secondary h-11 px-5 text-xs font-semibold text-amber-300"
                          >
                            Evaluate Airline Decision
                          </button>
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
                  No customer purchase agreements signed yet. Submit bids on open tenders to secure customer delivery backlog.
                </div>
              ) : (
                contracts.map(cnt => (
                  <div key={cnt.id} className="p-4 bg-[#1E1F1F] rounded-lg flex flex-col gap-1.5 text-xs">
                    <div className="flex justify-between items-center font-bold text-sm text-[#F5F5F3]">
                      <span>{cnt.airlineId}</span>
                      <span className="text-emerald-400 font-mono">{formatCurrency(cnt.totalContractValue, locale)}</span>
                    </div>
                    <div className="text-[#A3A39C]">
                      {cnt.quantityFirm} Firm units @ {formatCurrency(cnt.unitNegotiatedPrice, locale)} each
                    </div>
                    <div className="text-[11px] text-[#73736C]">
                      Down payment: {formatCurrency(cnt.downPaymentReceived, locale)} liquid cash received
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Proposal Bid Modal */}
        {selectedRfp && (
          <div
            className="modal-overlay"
            onClick={() => setSelectedRfp(null)}
          >
            <div
              className="bg-[#171818] border border-[rgba(255,255,255,0.12)] rounded-2xl max-w-lg w-full p-8 flex flex-col gap-6 font-sans shadow-2xl select-none"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center pb-4 border-b border-[rgba(255,255,255,0.07)]">
                <div>
                  <h3 className="text-lg font-bold text-[#F5F5F3]">
                    {t('rfp.submitBid')}
                  </h3>
                  <p className="text-xs text-[#A3A39C] mt-0.5">
                    {selectedRfp.title} ({selectedRfp.quantityFirm} Firm + {selectedRfp.quantityOptions} Options)
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
                  No active aircraft programs available. Launch a design program in the studio first.
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  <div>
                    <label className="text-xs font-semibold text-[#A3A39C] block mb-1.5 uppercase tracking-wider">
                      Airliner Model Offered
                    </label>
                    <div className="text-sm font-semibold text-[#F5F5F3] bg-[#1E1F1F] p-4 rounded-lg border border-[rgba(255,255,255,0.07)]">
                      {company.programs[0].name} (Standard List Price: {formatCurrency(company.programs[0].listPrice, locale)})
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-2">
                      <span className="text-[#A3A39C] uppercase tracking-wider">Volume Discount Off List Price</span>
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
                      <span>Negotiated: {formatCurrency(company.programs[0].listPrice * (1 - offeredDiscount / 100), locale)}/unit</span>
                      <span>Max Target: {formatCurrency(selectedRfp.maxAcceptableUnitPrice, locale)}</span>
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
                      className="btn-aerospace primary h-11 px-7 text-sm font-semibold"
                    >
                      Dispatch Binding Fleet Proposal
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
