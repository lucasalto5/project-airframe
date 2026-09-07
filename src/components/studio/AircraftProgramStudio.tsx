// ============================================================================
// PROJECT AIRFRAME - GUIDED 14-STEP AIRCRAFT ENGINEERING DESIGNER WIZARD
// ============================================================================

import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { TechnicalBlueprint } from './TechnicalBlueprint';
import type {
  MarketSegmentId,
  MaterialType,
  WingletType,
  FlightControlTech,
  CockpitTech,
  AircraftDraft
} from '../../types';
import { THIRD_PARTY_ENGINE_CATALOG } from '../../data/suppliers';
import { synthesizeAircraftSpecs } from '../../simulation/formulas';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Rocket,
  Plus,
  Check
} from 'lucide-react';

const TOTAL_STEPS = 14;

const STEP_TITLES = [
  'Mission & Category',
  'Cabin Cross-Section',
  'Fuselage & Capacity',
  'Wing Planform & Span',
  'Wing Sweep & Speed',
  'Wingtip Devices',
  'Structural Materials',
  'Propulsion Integration',
  'Flight Controls & FBW',
  'Cockpit & Avionics',
  'Systems & Pressurization',
  'Passenger Experience',
  'Performance Trade-Offs',
  'Final Program Review'
];

export const AircraftProgramStudio: React.FC = () => {
  const {
    company,
    selectedProgramId,
    setSelectedProgramId,
    createAircraftProgram,
    aircraftDraft,
    updateAircraftDraft,
    setAircraftDraftStep
  } = useGameStore();

  const [isDesigningNew, setIsDesigningNew] = useState(
    !selectedProgramId || company.programs.length === 0
  );
  const [showTechDetails, setShowTechDetails] = useState(false);

  // Active Draft state
  const step = aircraftDraft.currentStep || 1;
  const geom = aircraftDraft.geometry;
  const prop = aircraftDraft.propulsion;
  const sys = aircraftDraft.systems;
  const segment = aircraftDraft.marketSegment;
  const progName = aircraftDraft.name;

  // Synthesize current specs
  const synth = synthesizeAircraftSpecs(geom, prop, sys, segment);

  // Sync step change
  const handleNextStep = () => {
    if (step < TOTAL_STEPS) {
      setAircraftDraftStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setAircraftDraftStep(step - 1);
    }
  };

  const handleLaunchProgram = () => {
    createAircraftProgram({
      name: progName,
      marketSegment: segment,
      geometry: geom,
      propulsion: prop,
      systems: sys,
      livery: aircraftDraft.livery
    });
    setIsDesigningNew(false);
  };

  // Determine active component to highlight in CAD blueprint
  const getHighlightComponent = (): 'fuselage' | 'wing' | 'propulsion' | 'winglet' | 'cabin' | 'all' => {
    if (step === 2 || step === 3) return 'fuselage';
    if (step === 4 || step === 5) return 'wing';
    if (step === 6) return 'winglet';
    if (step === 8) return 'propulsion';
    return 'all';
  };

  // If viewing existing programs and not in designer mode
  if (!isDesigningNew && company.programs.length > 0) {
    const selectedProg = company.programs.find(p => p.id === selectedProgramId) || company.programs[0];
    const progSynth = synthesizeAircraftSpecs(selectedProg.geometry, selectedProg.propulsion, selectedProg.systems, selectedProg.marketSegment);

    return (
      <div className="w-full h-full flex flex-col bg-[#0D0D0D] text-[#F5F5F3] overflow-hidden">
        {/* Header */}
        <div className="h-16 px-8 border-b border-[#242424] flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-[#F5F5F3]">
              Aircraft Programs & Engineering
            </h1>
            <p className="text-xs text-[#A1A19A]">
              Manage commercial airliner families, active development, and design iterations.
            </p>
          </div>

          <button
            onClick={() => {
              setIsDesigningNew(true);
              setAircraftDraftStep(1);
            }}
            className="btn-aerospace primary h-10 px-5 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            + New Aircraft Program
          </button>
        </div>

        {/* Workspace: Program Selector & Active Aircraft Details */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Program List */}
          <div className="w-72 bg-[#141414] border-r border-[#242424] p-4 flex flex-col gap-2 overflow-y-auto">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#666660] px-2 py-1">
              Active Programs ({company.programs.length})
            </div>
            {company.programs.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedProgramId(p.id)}
                className={`w-full p-3 rounded-md text-left transition-all ${
                  p.id === selectedProg.id
                    ? 'bg-[#242424] text-[#F5F5F3] border border-[#3D3D3D]'
                    : 'bg-[#1B1B1B] text-[#A1A19A] hover:bg-[#242424] border border-transparent'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">{p.name}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#303030] text-[#A1A19A] uppercase">
                    {p.currentPhase.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="text-xs text-[#666660] mt-1 capitalize">
                  {p.marketSegment.replace(/_/g, ' ')} • {p.geometry.typicalSeats} pax
                </div>
              </button>
            ))}
          </div>

          {/* Center: CAD Blueprint */}
          <div className="flex-1 h-full relative">
            <TechnicalBlueprint
              geometry={selectedProg.geometry}
              propulsion={selectedProg.propulsion}
              highlightComponent="all"
            />
          </div>

          {/* Right: Program Telemetry & Specs */}
          <div className="w-96 bg-[#141414] border-l border-[#242424] p-6 flex flex-col gap-6 overflow-y-auto font-sans">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-[#666660]">
                PROGRAM SPECIFICATIONS
              </div>
              <h2 className="text-2xl font-bold text-[#F5F5F3] mt-1">{selectedProg.name}</h2>
              <div className="text-sm text-[#A1A19A] capitalize">
                {selectedProg.marketSegment.replace(/_/g, ' ')}
              </div>
            </div>

            {/* Key Inline Data Metrics */}
            <div className="grid grid-cols-2 gap-4 py-4 border-y border-[#242424] font-mono text-sm">
              <div>
                <div className="text-[11px] text-[#666660] uppercase">Max Range</div>
                <div className="text-lg font-semibold text-[#F5F5F3]">{Math.round(progSynth.perf.rangeKm).toLocaleString()} km</div>
              </div>
              <div>
                <div className="text-[11px] text-[#666660] uppercase">Passenger Seats</div>
                <div className="text-lg font-semibold text-[#F5F5F3]">{selectedProg.geometry.typicalSeats} pax</div>
              </div>
              <div>
                <div className="text-[11px] text-[#666660] uppercase">Max Takeoff Wt</div>
                <div className="text-lg font-semibold text-[#F5F5F3]">{(progSynth.mass.mtowKg / 1000).toFixed(1)} t</div>
              </div>
              <div>
                <div className="text-[11px] text-[#666660] uppercase">Unit List Price</div>
                <div className="text-lg font-semibold text-[#F5F5F3]">${progSynth.listPrice.toFixed(1)}M</div>
              </div>
            </div>

            {/* Program Status & Orders */}
            <div className="flex flex-col gap-3 font-mono text-xs">
              <div className="flex items-center justify-between text-[#A1A19A]">
                <span>Backlog Orders:</span>
                <span className="text-[#F5F5F3] font-bold">{selectedProg.ordersBacklogCount} units</span>
              </div>
              <div className="flex items-center justify-between text-[#A1A19A]">
                <span>Total Deliveries:</span>
                <span className="text-[#F5F5F3] font-bold">{selectedProg.totalDeliveriesCount} in service</span>
              </div>
              <div className="flex items-center justify-between text-[#A1A19A]">
                <span>Certification Status:</span>
                <span className={selectedProg.typeCertificateIssued ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                  {selectedProg.typeCertificateIssued ? 'TYPE CERTIFIED' : 'IN DEVELOPMENT'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // GUIDED 14-STEP AIRCRAFT CREATION WIZARD
  // ==========================================================================
  return (
    <div className="w-full h-full flex flex-col bg-[#0D0D0D] text-[#F5F5F3] overflow-hidden select-none">
      {/* Top Header: Step Indicator & Title */}
      <div className="h-16 px-8 border-b border-[#242424] bg-[#141414] flex items-center justify-between">
        <div className="flex items-center gap-6">
          {company.programs.length > 0 && (
            <button
              onClick={() => setIsDesigningNew(false)}
              className="text-xs text-[#A1A19A] hover:text-[#F5F5F3] flex items-center gap-1 font-mono"
            >
              <ChevronLeft className="w-4 h-4" /> Cancel
            </button>
          )}

          <div>
            <div className="text-[11px] font-mono text-[#666660] uppercase tracking-wider">
              STEP {step.toString().padStart(2, '0')} OF {TOTAL_STEPS} • {STEP_TITLES[step - 1].toUpperCase()}
            </div>
            <div className="text-base font-semibold text-[#F5F5F3] tracking-tight">
              {progName} — Clean-Sheet Development
            </div>
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="flex items-center gap-2">
          <div className="w-48 h-1.5 bg-[#242424] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#F5F5F3] transition-all duration-200"
              style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            />
          </div>
          <span className="text-xs font-mono text-[#666660]">
            {Math.round((step / TOTAL_STEPS) * 100)}%
          </span>
        </div>
      </div>

      {/* Main Split Body: Dominant Blueprint (~60%) + Step Decisions (~40%) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left / Center: Dominant SVG CAD Technical Blueprint */}
        <div className="flex-1 h-full relative border-r border-[#242424]">
          <TechnicalBlueprint
            geometry={geom}
            propulsion={prop}
            highlightComponent={getHighlightComponent()}
          />
        </div>

        {/* Right: Step Decision Panel with Progressive Disclosure */}
        <div className="w-[460px] bg-[#141414] flex flex-col justify-between p-8 overflow-y-auto">
          <div className="flex flex-col gap-6">
            {/* Step Header */}
            <div>
              <h2 className="text-xl font-semibold text-[#F5F5F3] tracking-tight">
                {STEP_TITLES[step - 1]}
              </h2>
              <p className="text-xs text-[#A1A19A] mt-1 leading-relaxed">
                {getStepDescription(step)}
              </p>
            </div>

            {/* Level 1: Primary Decision Controls */}
            <div className="flex flex-col gap-5">
              {renderStepControls(step, aircraftDraft, updateAircraftDraft)}
            </div>

            {/* Level 2: Direct Practical Impact Summary */}
            <div className="pt-4 border-t border-[#242424] flex flex-col gap-2">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#666660]">
                ESTIMATED IMPACT
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="flex items-center justify-between text-[#A1A19A]">
                  <span>Design Range:</span>
                  <span className="text-[#F5F5F3] font-bold">{Math.round(synth.perf.rangeKm).toLocaleString()} km</span>
                </div>
                <div className="flex items-center justify-between text-[#A1A19A]">
                  <span>Fuel / Seat-km:</span>
                  <span className="text-[#F5F5F3] font-bold">{synth.perf.fuelBurnKgPerSeat1000Km.toFixed(1)} kg</span>
                </div>
                <div className="flex items-center justify-between text-[#A1A19A]">
                  <span>MTOW:</span>
                  <span className="text-[#F5F5F3] font-bold">{(synth.mass.mtowKg / 1000).toFixed(1)} t</span>
                </div>
                <div className="flex items-center justify-between text-[#A1A19A]">
                  <span>Takeoff Field:</span>
                  <span className="text-[#F5F5F3] font-bold">{Math.round(synth.perf.takeoffFieldLengthMeters)} m</span>
                </div>
              </div>
            </div>

            {/* Level 3: Collapsible Technical Engineering Details */}
            <div className="border border-[#242424] rounded-md bg-[#1B1B1B] overflow-hidden">
              <button
                onClick={() => setShowTechDetails(!showTechDetails)}
                className="w-full px-4 py-2.5 flex items-center justify-between text-xs text-[#A1A19A] hover:text-[#F5F5F3] transition-colors"
              >
                <span className="font-mono uppercase text-[11px]">Technical Engineering Details</span>
                {showTechDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showTechDetails && (
                <div className="p-4 border-t border-[#242424] font-mono text-[11px] text-[#A1A19A] flex flex-col gap-2 bg-[#141414]">
                  <div className="flex justify-between">
                    <span>Aspect Ratio (AR):</span>
                    <span className="text-[#F5F5F3]">{(Math.pow(geom.wingSpan, 2) / geom.wingArea).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Wing Loading (W/S):</span>
                    <span className="text-[#F5F5F3]">{(synth.mass.mtowKg / geom.wingArea).toFixed(1)} kg/m²</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Max Cruise L/D:</span>
                    <span className="text-[#F5F5F3]">{synth.perf.liftToDragRatioCruise.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Operating Empty Mass (OEW):</span>
                    <span className="text-[#F5F5F3]">{(synth.mass.oewKg / 1000).toFixed(1)} t</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Breguet Cruise Velocity:</span>
                    <span className="text-[#F5F5F3]">Mach {synth.perf.cruiseMach.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="pt-6 border-t border-[#242424] flex items-center justify-between gap-4">
            <button
              onClick={handlePrevStep}
              disabled={step === 1}
              className="btn-aerospace secondary h-11 px-5 flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>

            {step < TOTAL_STEPS ? (
              <button
                onClick={handleNextStep}
                className="btn-aerospace primary h-11 px-6 flex items-center gap-2"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleLaunchProgram}
                className="btn-aerospace primary h-11 px-6 flex items-center gap-2 font-bold"
              >
                <Rocket className="w-4 h-4" /> Launch Program
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// STEP DESCRIPTIONS & CONTROLS HELPER
// ============================================================================

function getStepDescription(step: number): string {
  switch (step) {
    case 1: return 'Select target commercial market category and assign official program designation.';
    case 2: return 'Define fuselage cross-section diameter and seating abreast arrangement.';
    case 3: return 'Configure passenger cabin length, seat pitch, and total passenger payload.';
    case 4: return 'Dimension the aerodynamic lifting surface area and total wingspan.';
    case 5: return 'Set wing sweep angle for target cruise Mach number and high-speed efficiency.';
    case 6: return 'Select aerodynamic wingtip devices to reduce induced vortex drag.';
    case 7: return 'Choose structural materials for the airframe, fuselage barrel, and wings.';
    case 8: return 'Select high-efficiency turbofan propulsion units and thrust rating.';
    case 9: return 'Configure flight control laws, sidestick architecture, and envelope protection.';
    case 10: return 'Equip flight deck avionics, panoramic displays, and low-visibility autoland.';
    case 11: return 'Set environmental control systems, hydraulic redundancy, and cabin altitude.';
    case 12: return 'Customize passenger cabin lighting, acoustics, and inflight connectivity.';
    case 13: return 'Review aerodynamic polar performance and economic operating costs.';
    case 14: return 'Conduct final engineering sign-off and officially authorize R&D program rollout.';
    default: return '';
  }
}

function renderStepControls(
  step: number,
  draft: AircraftDraft,
  update: (updates: Partial<AircraftDraft>) => void
) {
  const { geometry: geom, propulsion: prop, systems: sys } = draft;
  const synth = synthesizeAircraftSpecs(geom, prop, sys, draft.marketSegment);

  switch (step) {
    // STEP 1: MISSION & MARKET CATEGORY
    case 1:
      return (
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-mono text-[#A1A19A] uppercase block mb-1.5">
              Program Designation
            </label>
            <input
              type="text"
              value={draft.name}
              onChange={e => update({ name: e.target.value })}
              className="w-full font-semibold"
              placeholder="e.g. A120"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-[#A1A19A] uppercase block mb-1.5">
              Target Aircraft Category
            </label>
            <div className="grid grid-cols-1 gap-2">
              {[
                { id: 'regional_jet', name: 'Regional Jet', desc: '70–100 seats, short-haul feeder routes' },
                { id: 'small_narrowbody', name: 'Small Narrowbody', desc: '110–145 seats, high-frequency regional' },
                { id: 'narrowbody', name: 'Standard Narrowbody', desc: '150–190 seats, mainline workhorse' },
                { id: 'large_narrowbody', name: 'Large Narrowbody', desc: '190–240 seats, high-density & transcon' },
                { id: 'widebody', name: 'Twin-Aisle Widebody', desc: '250–350 seats, long-range international' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => update({ marketSegment: cat.id as MarketSegmentId })}
                  className={`p-3 rounded-md text-left transition-colors ${
                    draft.marketSegment === cat.id
                      ? 'bg-[#242424] border border-[#38bdf8] text-[#F5F5F3]'
                      : 'bg-[#1B1B1B] border border-[#242424] text-[#A1A19A] hover:bg-[#242424]'
                  }`}
                >
                  <div className="font-semibold text-sm">{cat.name}</div>
                  <div className="text-xs text-[#666660] mt-0.5">{cat.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      );

    // STEP 2: CABIN CROSS-SECTION
    case 2:
      return (
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-mono text-[#A1A19A] uppercase block mb-1.5">
              Fuselage Diameter ({geom.fuselageDiameter.toFixed(2)} m)
            </label>
            <input
              type="range"
              min="2.8"
              max="6.2"
              step="0.05"
              value={geom.fuselageDiameter}
              onChange={e => update({ geometry: { ...geom, fuselageDiameter: parseFloat(e.target.value) } })}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-[#A1A19A] uppercase block mb-1.5">
              Seating Abreast Configuration
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[4, 5, 6, 8].map(count => (
                <button
                  key={count}
                  onClick={() => update({ geometry: { ...geom, seatsAbreast: count, aisles: count > 6 ? 2 : 1 } })}
                  className={`h-11 rounded-md font-mono text-sm font-semibold transition-colors ${
                    geom.seatsAbreast === count
                      ? 'bg-[#F5F5F3] text-[#0D0D0D]'
                      : 'bg-[#1B1B1B] border border-[#242424] text-[#A1A19A] hover:bg-[#242424]'
                  }`}
                >
                  {count}-abreast
                </button>
              ))}
            </div>
          </div>
        </div>
      );

    // STEP 3: FUSELAGE LENGTH & CAPACITY
    case 3:
      return (
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-mono text-[#A1A19A] uppercase block mb-1.5">
              Fuselage Length ({geom.length.toFixed(1)} m)
            </label>
            <input
              type="range"
              min="24.0"
              max="72.0"
              step="0.5"
              value={geom.length}
              onChange={e => {
                const len = parseFloat(e.target.value);
                const seats = Math.round((len - 8.0) * (geom.seatsAbreast / 0.82));
                update({ geometry: { ...geom, length: len, typicalSeats: seats, maxSeats: Math.round(seats * 1.15) } });
              }}
              className="w-full"
            />
          </div>

          <div className="p-4 bg-[#1B1B1B] rounded-md border border-[#242424] font-mono text-xs flex justify-between">
            <span className="text-[#A1A19A]">Typical Seating Capacity:</span>
            <span className="text-[#F5F5F3] font-bold">{geom.typicalSeats} Passengers</span>
          </div>
        </div>
      );

    // STEP 4: WING PLANFORM & SPAN
    case 4:
      return (
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-mono text-[#A1A19A] uppercase block mb-1.5">
              Wingspan ({geom.wingSpan.toFixed(1)} m)
            </label>
            <input
              type="range"
              min="20.0"
              max="68.0"
              step="0.5"
              value={geom.wingSpan}
              onChange={e => update({ geometry: { ...geom, wingSpan: parseFloat(e.target.value) } })}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-[#A1A19A] uppercase block mb-1.5">
              Wing Reference Area ({geom.wingArea.toFixed(1)} m²)
            </label>
            <input
              type="range"
              min="60.0"
              max="450.0"
              step="2.0"
              value={geom.wingArea}
              onChange={e => update({ geometry: { ...geom, wingArea: parseFloat(e.target.value) } })}
              className="w-full"
            />
          </div>
        </div>
      );

    // STEP 5: WING SWEEP
    case 5:
      return (
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-mono text-[#A1A19A] uppercase block mb-1.5">
              Leading Edge Sweep ({geom.wingSweepDegrees.toFixed(1)}°)
            </label>
            <input
              type="range"
              min="15.0"
              max="35.0"
              step="0.5"
              value={geom.wingSweepDegrees}
              onChange={e => update({ geometry: { ...geom, wingSweepDegrees: parseFloat(e.target.value) } })}
              className="w-full"
            />
          </div>
          <div className="text-xs text-[#A1A19A] leading-relaxed">
            Higher sweep angles delay transonic shockwave onset, enabling cruise speeds up to Mach 0.82–0.85, but require reinforced wing roots.
          </div>
        </div>
      );

    // STEP 6: WINGTIP DEVICES
    case 6:
      return (
        <div className="flex flex-col gap-2">
          {[
            { id: 'none', name: 'Conventional Clean Tip', desc: 'Simplest structure, baseline drag' },
            { id: 'blended', name: 'Blended Winglet', desc: '+3.2% Fuel efficiency, low weight' },
            { id: 'split_scimitar', name: 'Split-Scimitar Winglet', desc: '+4.5% Fuel efficiency, dual aerofoil' },
            { id: 'raked_wingtip', name: 'Raked Wingtip', desc: '+5.0% Long-range efficiency, extended span' }
          ].map(tip => (
            <button
              key={tip.id}
              onClick={() => update({ geometry: { ...geom, wingletType: tip.id as WingletType } })}
              className={`p-3 rounded-md text-left transition-colors ${
                geom.wingletType === tip.id
                  ? 'bg-[#242424] border border-[#38bdf8] text-[#F5F5F3]'
                  : 'bg-[#1B1B1B] border border-[#242424] text-[#A1A19A] hover:bg-[#242424]'
              }`}
            >
              <div className="font-semibold text-sm">{tip.name}</div>
              <div className="text-xs text-[#666660] mt-0.5">{tip.desc}</div>
            </button>
          ))}
        </div>
      );

    // STEP 7: STRUCTURAL MATERIALS
    case 7:
      return (
        <div className="flex flex-col gap-2">
          {[
            { id: 'conventional_aluminum', name: 'Standard Aerospace Aluminum (2024/7075)', desc: 'Lowest unit cost, mature tooling, baseline weight' },
            { id: 'advanced_al_li', name: 'Advanced Aluminum-Lithium Alloys', desc: '-7% Airframe mass, superior corrosion resistance' },
            { id: 'full_carbon_composite', name: 'Full Carbon Fiber Composites (CFRP)', desc: '-18% Airframe mass, higher fatigue life, increased tooling R&D' }
          ].map(mat => (
            <button
              key={mat.id}
              onClick={() => update({ geometry: { ...geom, materialType: mat.id as MaterialType } })}
              className={`p-3 rounded-md text-left transition-colors ${
                geom.materialType === mat.id
                  ? 'bg-[#242424] border border-[#38bdf8] text-[#F5F5F3]'
                  : 'bg-[#1B1B1B] border border-[#242424] text-[#A1A19A] hover:bg-[#242424]'
              }`}
            >
              <div className="font-semibold text-sm">{mat.name}</div>
              <div className="text-xs text-[#666660] mt-0.5">{mat.desc}</div>
            </button>
          ))}
        </div>
      );

    // STEP 8: PROPULSION INTEGRATION
    case 8:
      return (
        <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
          {THIRD_PARTY_ENGINE_CATALOG.slice(0, 5).map(eng => (
            <button
              key={eng.engineModelId}
              onClick={() => update({ propulsion: eng })}
              className={`p-3 rounded-md text-left transition-colors ${
                prop.engineModelId === eng.engineModelId
                  ? 'bg-[#242424] border border-[#38bdf8] text-[#F5F5F3]'
                  : 'bg-[#1B1B1B] border border-[#242424] text-[#A1A19A] hover:bg-[#242424]'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold text-sm">{eng.engineName}</span>
                <span className="text-xs font-mono text-[#38bdf8]">{eng.thrustPerEngineKN} kN</span>
              </div>
              <div className="text-xs text-[#666660] mt-0.5 font-mono">
                BPR {eng.bypassRatio}:1 • SFC {eng.cruiseSFC} • ${eng.pricePerEngine}M/ea
              </div>
            </button>
          ))}
        </div>
      );

    // STEP 9: FLIGHT CONTROLS & FBW
    case 9:
      return (
        <div className="flex flex-col gap-2">
          {[
            { id: 'analog_fbw', name: 'Analog Electronic Flight Controls', desc: 'Basic stability augmentation, mechanical backup cables' },
            { id: 'digital_fbw', name: 'Full Digital Fly-By-Wire (FBW)', desc: 'Flight envelope protection, sidestick controls, -350 kg mass' },
            { id: 'adaptive_envelope_fbw', name: 'Adaptive Autonomous FBW', desc: 'Predictive gust alleviation, maximum passenger ride smoothness' }
          ].map(fc => (
            <button
              key={fc.id}
              onClick={() => update({ systems: { ...sys, flightControls: fc.id as FlightControlTech } })}
              className={`p-3 rounded-md text-left transition-colors ${
                sys.flightControls === fc.id
                  ? 'bg-[#242424] border border-[#38bdf8] text-[#F5F5F3]'
                  : 'bg-[#1B1B1B] border border-[#242424] text-[#A1A19A] hover:bg-[#242424]'
              }`}
            >
              <div className="font-semibold text-sm">{fc.name}</div>
              <div className="text-xs text-[#666660] mt-0.5">{fc.desc}</div>
            </button>
          ))}
        </div>
      );

    // STEP 10: COCKPIT & AVIONICS
    case 10:
      return (
        <div className="flex flex-col gap-2">
          {[
            { id: 'modern_lcd_efis', name: 'Modern Multi-Function LCD EFIS', desc: 'Standard airline standard glass cockpit with synthetic vision' },
            { id: 'panoramic_touch_screens', name: 'Panoramic Large-Format Touch Cockpit', desc: 'Next-gen dual HUDs, paperless electronic flight bag, pilot workload reduction' }
          ].map(cockpit => (
            <button
              key={cockpit.id}
              onClick={() => update({ systems: { ...sys, cockpitTech: cockpit.id as CockpitTech } })}
              className={`p-3 rounded-md text-left transition-colors ${
                sys.cockpitTech === cockpit.id
                  ? 'bg-[#242424] border border-[#38bdf8] text-[#F5F5F3]'
                  : 'bg-[#1B1B1B] border border-[#242424] text-[#A1A19A] hover:bg-[#242424]'
              }`}
            >
              <div className="font-semibold text-sm">{cockpit.name}</div>
              <div className="text-xs text-[#666660] mt-0.5">{cockpit.desc}</div>
            </button>
          ))}
        </div>
      );

    // STEP 11: SYSTEMS & PRESSURIZATION
    case 11:
      return (
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-mono text-[#A1A19A] uppercase block mb-1.5">
              Cruise Cabin Altitude ({sys.cabinAltitudeFeet} ft)
            </label>
            <input
              type="range"
              min="5000"
              max="8000"
              step="500"
              value={sys.cabinAltitudeFeet}
              onChange={e => update({ systems: { ...sys, cabinAltitudeFeet: parseInt(e.target.value) } })}
              className="w-full"
            />
          </div>
          <div className="text-xs text-[#A1A19A] leading-relaxed">
            Lower cabin altitude (6,000 ft vs 8,000 ft) significantly reduces passenger travel fatigue, but requires increased fuselage pressure vessel strength.
          </div>
        </div>
      );

    // STEP 12: PASSENGER EXPERIENCE
    case 12:
      return (
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-mono text-[#A1A19A] uppercase block mb-1.5">
              Economy Seat Pitch ({geom.seatPitchInches} inches)
            </label>
            <input
              type="range"
              min="29"
              max="34"
              step="1"
              value={geom.seatPitchInches}
              onChange={e => update({ geometry: { ...geom, seatPitchInches: parseInt(e.target.value) } })}
              className="w-full"
            />
          </div>

          <div className="p-4 bg-[#1B1B1B] rounded-md border border-[#242424] font-mono text-xs flex justify-between">
            <span className="text-[#A1A19A]">Passenger Comfort Index:</span>
            <span className="text-[#F5F5F3] font-bold">{synth.perf.passengerComfortScore} / 100</span>
          </div>
        </div>
      );

    // STEP 13: PERFORMANCE TRADE-OFFS
    case 13:
      return (
        <div className="flex flex-col gap-3 font-mono text-xs">
          <div className="p-3 bg-[#1B1B1B] rounded border border-[#242424] flex justify-between">
            <span className="text-[#A1A19A]">Direct Operating Cost (DOC):</span>
            <span className="text-[#F5F5F3] font-bold">${synth.perf.directOperatingCostPerSeatKm.toFixed(4)} / seat-km</span>
          </div>
          <div className="p-3 bg-[#1B1B1B] rounded border border-[#242424] flex justify-between">
            <span className="text-[#A1A19A]">Estimated Unit Manufacturing Cost:</span>
            <span className="text-[#F5F5F3] font-bold">${synth.unitCost.toFixed(1)}M USD</span>
          </div>
          <div className="p-3 bg-[#1B1B1B] rounded border border-[#242424] flex justify-between">
            <span className="text-[#A1A19A]">Suggested List Price:</span>
            <span className="text-[#F5F5F3] font-bold">${synth.listPrice.toFixed(1)}M USD</span>
          </div>
        </div>
      );

    // STEP 14: FINAL PROGRAM REVIEW
    case 14:
      return (
        <div className="flex flex-col gap-4 font-mono text-xs">
          <div className="p-4 bg-[#1B1B1B] rounded-md border border-[#242424] flex flex-col gap-2">
            <div className="text-[#666660] uppercase text-[11px]">Engineering Strengths</div>
            <div className="text-[#34d399] flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" /> High cruise aerodynamic efficiency (L/D {synth.perf.liftToDragRatioCruise.toFixed(1)})
            </div>
            <div className="text-[#34d399] flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" /> Favorable runway compatibility ({Math.round(synth.perf.takeoffFieldLengthMeters)} m TOFL)
            </div>
          </div>

          <div className="p-4 bg-[#1B1B1B] rounded-md border border-[#242424] flex flex-col gap-2">
            <div className="text-[#666660] uppercase text-[11px]">Program Investment</div>
            <div className="flex justify-between text-[#A1A19A]">
              <span>R&D Capital Required:</span>
              <span className="text-[#F5F5F3] font-bold">${synth.rdCost.toFixed(1)}M</span>
            </div>
            <div className="flex justify-between text-[#A1A19A]">
              <span>Estimated EIS Timeline:</span>
              <span className="text-[#F5F5F3] font-bold">48 Months</span>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}
