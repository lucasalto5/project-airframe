// ============================================================================
// PROJECT AIRFRAME - 2D PROCEDURAL CAD BLUEPRINT AIRCRAFT VISUALIZER
// ============================================================================

import React, { useState } from 'react';
import type { AircraftGeometry, PropulsionConfig } from '../../types';

interface AircraftVisualizerProps {
  geometry: AircraftGeometry;
  propulsion: PropulsionConfig;
  livery: {
    primaryColor: string;
    accentColor: string;
    tailLogoStyle?: string;
    stripeStyle?: string;
  };
  aircraftName: string;
}

export const AircraftVisualizer: React.FC<AircraftVisualizerProps> = ({
  geometry,
  propulsion,
  livery,
  aircraftName
}) => {
  const [viewMode, setViewMode] = useState<'side' | 'top' | 'cross_section'>('side');

  const scaleM = 14;
  const centerX = 500;
  const centerY = 210;

  const lengthPx = geometry.length * scaleM;
  const diameterPx = geometry.fuselageDiameter * scaleM;
  const spanPx = geometry.wingSpan * scaleM;
  const fanDiameterPx = propulsion.fanDiameterMeters * scaleM;

  const noseX = centerX - lengthPx / 2;
  const tailX = centerX + lengthPx / 2;

  const primaryPaint = livery.primaryColor || '#0ea5e9';
  const accentPaint = livery.accentColor || '#f59e0b';

  return (
    <div className="w-full bg-[#0a0f18] border border-[#1e2d42] rounded flex flex-col overflow-hidden">
      {/* Top Header Bar */}
      <div className="bg-[#0f1724] border-b border-[#1e2d42] px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400">
            CAD Schematic // {aircraftName || 'AIRFRAME CONCEPT'}
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            L: {geometry.length}m | SPAN: {geometry.wingSpan}m | DIA: {geometry.fuselageDiameter}m
          </span>
        </div>

        <div className="flex items-center gap-1 bg-[#162032] p-0.5 rounded border border-[#1e2d42]">
          <button
            onClick={() => setViewMode('side')}
            className={`px-3 py-1 text-xs font-mono font-medium rounded transition-all ${
              viewMode === 'side' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            SIDE PROFILE
          </button>
          <button
            onClick={() => setViewMode('top')}
            className={`px-3 py-1 text-xs font-mono font-medium rounded transition-all ${
              viewMode === 'top' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            TOP PLANFORM
          </button>
          <button
            onClick={() => setViewMode('cross_section')}
            className={`px-3 py-1 text-xs font-mono font-medium rounded transition-all ${
              viewMode === 'cross_section' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            CABIN SEATING
          </button>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative w-full h-[360px] cad-grid-bg flex items-center justify-center p-4">
        <div className="absolute top-3 left-4 text-[10px] font-mono text-slate-500 flex flex-col gap-0.5">
          <span>SCALE: 1:71.4 // PROJECTION: ORTHOGRAPHIC</span>
          <span>AIRFOIL: TRANSONIC SUPERCRITICAL (t/c 11.2%)</span>
          <span>SWEEP: {geometry.wingSweepDegrees}° // AR: {geometry.aspectRatio}</span>
        </div>

        <div className="absolute bottom-3 right-4 text-[10px] font-mono text-sky-400/70">
          DESIGNED WITH PROJECT AIRFRAME CAD ENGINE
        </div>

        <svg viewBox="0 0 1000 400" className="w-full h-full max-h-[340px] drop-shadow-lg">
          <defs>
            <linearGradient id="fuselageShading" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="25%" stopColor="#ffffff" />
              <stop offset="70%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>

            <linearGradient id="engineNacelle" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="50%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>

            <pattern id="cadGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(56, 189, 248, 0.08)" strokeWidth="0.5" />
            </pattern>
          </defs>

          <rect width="1000" height="400" fill="url(#cadGrid)" />

          <line x1="40" y1="200" x2="960" y2="200" stroke="rgba(56, 189, 248, 0.25)" strokeDasharray="4 4" strokeWidth="0.75" />
          <line x1={centerX} y1="30" x2={centerX} y2="370" stroke="rgba(56, 189, 248, 0.25)" strokeDasharray="4 4" strokeWidth="0.75" />

          {/* 1. SIDE VIEW PROFILE */}
          {viewMode === 'side' && (
            <g transform="translate(0, 0)">
              <path
                d={`M ${tailX - 110} ${centerY - diameterPx / 2} 
                   L ${tailX - 25} ${centerY - diameterPx / 2 - 125} 
                   L ${tailX + 15} ${centerY - diameterPx / 2 - 125} 
                   L ${tailX - 5} ${centerY - diameterPx / 2} Z`}
                fill={primaryPaint}
                stroke="#1e293b"
                strokeWidth="1.5"
              />

              <path
                d={`M ${tailX - 60} ${centerY - diameterPx / 2} 
                   L ${tailX - 15} ${centerY - diameterPx / 2 - 120} 
                   L ${tailX + 5} ${centerY - diameterPx / 2 - 120} 
                   L ${tailX - 20} ${centerY - diameterPx / 2} Z`}
                fill={accentPaint}
                opacity="0.9"
              />

              <polygon
                points={`${tailX - 70},${centerY - 5} ${tailX + 15},${centerY - 10} ${tailX + 25},${centerY} ${tailX - 40},${centerY}`}
                fill="#cbd5e1"
                stroke="#334155"
                strokeWidth="1"
              />

              <rect
                x={noseX + 50}
                y={centerY - diameterPx / 2}
                width={lengthPx - 120}
                height={diameterPx}
                rx="2"
                fill="url(#fuselageShading)"
                stroke="#334155"
                strokeWidth="1.5"
              />

              <path
                d={`M ${noseX + 50} ${centerY - diameterPx / 2}
                   C ${noseX + 15} ${centerY - diameterPx / 2}, ${noseX} ${centerY - diameterPx / 4}, ${noseX} ${centerY}
                   C ${noseX} ${centerY + diameterPx / 4}, ${noseX + 15} ${centerY + diameterPx / 2}, ${noseX + 50} ${centerY + diameterPx / 2}
                   Z`}
                fill="url(#fuselageShading)"
                stroke="#334155"
                strokeWidth="1.5"
              />

              <path
                d={`M ${tailX - 70} ${centerY - diameterPx / 2}
                   C ${tailX - 20} ${centerY - diameterPx / 2}, ${tailX} ${centerY - diameterPx / 4}, ${tailX + 20} ${centerY - 8}
                   L ${tailX + 20} ${centerY + 8}
                   C ${tailX} ${centerY + diameterPx / 4}, ${tailX - 20} ${centerY + diameterPx / 2}, ${tailX - 70} ${centerY + diameterPx / 2}
                   Z`}
                fill="url(#fuselageShading)"
                stroke="#334155"
                strokeWidth="1.5"
              />

              <path
                d={`M ${noseX + 25} ${centerY + 2} L ${tailX - 20} ${centerY + 2} L ${tailX - 20} ${centerY + 10} L ${noseX + 28} ${centerY + 10} Z`}
                fill={primaryPaint}
              />
              <path
                d={`M ${noseX + 30} ${centerY + 11} L ${tailX - 35} ${centerY + 11} L ${tailX - 35} ${centerY + 14} L ${noseX + 32} ${centerY + 14} Z`}
                fill={accentPaint}
              />

              <path
                d={`M ${noseX + 18} ${centerY - 6} 
                   L ${noseX + 32} ${centerY - 14} 
                   L ${noseX + 44} ${centerY - 13} 
                   L ${noseX + 42} ${centerY - 4} 
                   L ${noseX + 24} ${centerY - 4} Z`}
                fill="#0f1724"
                stroke="#38bdf8"
                strokeWidth="0.75"
              />

              {Array.from({ length: Math.min(48, Math.max(12, Math.floor((lengthPx - 160) / 9))) }).map((_, i) => (
                <rect
                  key={`pax_win_${i}`}
                  x={noseX + 65 + i * 8.5}
                  y={centerY - 8}
                  width="4"
                  height="6"
                  rx="1.5"
                  fill="#0f1724"
                  stroke="#64748b"
                  strokeWidth="0.5"
                />
              ))}

              <rect x={noseX + 52} y={centerY - diameterPx / 2 + 4} width="9" height={diameterPx - 8} rx="1.5" fill="none" stroke="#475569" strokeWidth="1" />
              <rect x={tailX - 85} y={centerY - diameterPx / 2 + 4} width="9" height={diameterPx - 8} rx="1.5" fill="none" stroke="#475569" strokeWidth="1" />
              {geometry.typicalSeats > 130 && (
                <rect x={centerX + 20} y={centerY - diameterPx / 2 + 4} width="8" height={diameterPx - 8} rx="1.5" fill="none" stroke="#475569" strokeWidth="1" />
              )}

              <path
                d={`M ${centerX - 70} ${centerY + diameterPx / 2 - 2}
                   C ${centerX - 20} ${centerY + diameterPx / 2 - 12}, ${centerX + 50} ${centerY + diameterPx / 2 - 10}, ${centerX + 85} ${centerY + diameterPx / 2}
                   Z`}
                fill="#94a3b8"
                stroke="#475569"
                strokeWidth="1"
              />

              <g transform={`translate(${centerX - 35}, ${centerY + diameterPx / 2 + 2})`}>
                <polygon points="5,-8 28,-8 20,4 2,4" fill="#64748b" stroke="#334155" strokeWidth="1" />
                <rect x="-15" y="0" width={fanDiameterPx * 1.6} height={fanDiameterPx * 0.9} rx="6" fill="url(#engineNacelle)" stroke="#1e293b" strokeWidth="1.5" />
                <ellipse cx="-15" cy={fanDiameterPx * 0.45} rx="3" ry={fanDiameterPx * 0.42} fill="#0f1724" stroke="#cbd5e1" strokeWidth="1" />
                <polygon points={`${fanDiameterPx * 1.6},4 ${fanDiameterPx * 1.8},12 ${fanDiameterPx * 1.6},${fanDiameterPx * 0.9 - 4}`} fill="#1e293b" />
              </g>

              <g stroke="#38bdf8" strokeWidth="0.75">
                <line x1={noseX} y1="360" x2={tailX} y2="360" />
                <line x1={noseX} y1="352" x2={noseX} y2="368" />
                <line x1={tailX} y1="352" x2={tailX} y2="368" />
                <text x={centerX} y="375" fill="#38bdf8" fontSize="11" fontFamily="JetBrains Mono" textAnchor="middle">
                  LENGTH OVERALL: {geometry.length.toFixed(1)} m ({(geometry.length * 3.28084).toFixed(1)} ft)
                </text>
              </g>
            </g>
          )}

          {/* 2. TOP VIEW PLANFORM */}
          {viewMode === 'top' && (
            <g transform="translate(0, 0)">
              {(() => {
                const sweepOffset = Math.tan((geometry.wingSweepDegrees * Math.PI) / 180) * (spanPx / 2);
                const rootChord = (geometry.length * 0.24) * scaleM;
                const tipChord = rootChord * 0.28;
                const wingletAddY = geometry.wingletType !== 'none' ? 14 : 0;

                return (
                  <>
                    <path
                      d={`M ${centerX - rootChord * 0.4} ${centerY - diameterPx / 2}
                         L ${centerX - rootChord * 0.4 + sweepOffset} ${centerY - spanPx / 2 - wingletAddY}
                         L ${centerX - rootChord * 0.4 + sweepOffset + tipChord} ${centerY - spanPx / 2}
                         L ${centerX + rootChord * 0.6} ${centerY - diameterPx / 2}
                         Z`}
                      fill="#e2e8f0"
                      stroke="#334155"
                      strokeWidth="1.5"
                    />

                    {geometry.wingletType !== 'none' && (
                      <polygon
                        points={`${centerX - rootChord * 0.4 + sweepOffset},${centerY - spanPx / 2 - wingletAddY} ${centerX - rootChord * 0.4 + sweepOffset + tipChord},${centerY - spanPx / 2} ${centerX - rootChord * 0.4 + sweepOffset + tipChord - 4},${centerY - spanPx / 2 - wingletAddY}`}
                        fill={primaryPaint}
                      />
                    )}

                    <path
                      d={`M ${centerX - rootChord * 0.4} ${centerY + diameterPx / 2}
                         L ${centerX - rootChord * 0.4 + sweepOffset} ${centerY + spanPx / 2 + wingletAddY}
                         L ${centerX - rootChord * 0.4 + sweepOffset + tipChord} ${centerY + spanPx / 2}
                         L ${centerX + rootChord * 0.6} ${centerY + diameterPx / 2}
                         Z`}
                      fill="#e2e8f0"
                      stroke="#334155"
                      strokeWidth="1.5"
                    />

                    {geometry.wingletType !== 'none' && (
                      <polygon
                        points={`${centerX - rootChord * 0.4 + sweepOffset},${centerY + spanPx / 2 + wingletAddY} ${centerX - rootChord * 0.4 + sweepOffset + tipChord},${centerY + spanPx / 2} ${centerX - rootChord * 0.4 + sweepOffset + tipChord - 4},${centerY + spanPx / 2 + wingletAddY}`}
                        fill={primaryPaint}
                      />
                    )}

                    <rect x={centerX - rootChord * 0.15 + sweepOffset * 0.38} y={centerY - spanPx * 0.22 - fanDiameterPx / 2} width={fanDiameterPx * 1.5} height={fanDiameterPx} rx="4" fill="url(#engineNacelle)" stroke="#1e293b" strokeWidth="1" />
                    <rect x={centerX - rootChord * 0.15 + sweepOffset * 0.38} y={centerY + spanPx * 0.22 - fanDiameterPx / 2} width={fanDiameterPx * 1.5} height={fanDiameterPx} rx="4" fill="url(#engineNacelle)" stroke="#1e293b" strokeWidth="1" />

                    <polygon points={`${tailX - 60},${centerY - diameterPx / 3} ${tailX + 15},${centerY - spanPx * 0.24} ${tailX + 35},${centerY - spanPx * 0.24 + 10} ${tailX - 10},${centerY - diameterPx / 4}`} fill="#cbd5e1" stroke="#334155" strokeWidth="1" />
                    <polygon points={`${tailX - 60},${centerY + diameterPx / 3} ${tailX + 15},${centerY + spanPx * 0.24} ${tailX + 35},${centerY + spanPx * 0.24 - 10} ${tailX - 10},${centerY + diameterPx / 4}`} fill="#cbd5e1" stroke="#334155" strokeWidth="1" />
                  </>
                );
              })()}

              <rect x={noseX + 50} y={centerY - diameterPx / 2} width={lengthPx - 110} height={diameterPx} rx="2" fill="url(#fuselageShading)" stroke="#334155" strokeWidth="1.5" />
              <path
                d={`M ${noseX + 50} ${centerY - diameterPx / 2}
                   C ${noseX + 10} ${centerY - diameterPx / 2}, ${noseX} ${centerY - diameterPx / 4}, ${noseX} ${centerY}
                   C ${noseX} ${centerY + diameterPx / 4}, ${noseX + 10} ${centerY + diameterPx / 2}, ${noseX + 50} ${centerY + diameterPx / 2}
                   Z`}
                fill="url(#fuselageShading)"
                stroke="#334155"
                strokeWidth="1.5"
              />
              <polygon points={`${tailX - 60},${centerY - diameterPx / 2} ${tailX + 15},${centerY - 3} ${tailX + 15},${centerY + 3} ${tailX - 60},${centerY + diameterPx / 2}`} fill="url(#fuselageShading)" stroke="#334155" strokeWidth="1.5" />

              <path d={`M ${noseX + 40} ${centerY - 4} L ${tailX - 40} ${centerY - 4} L ${tailX - 40} ${centerY + 4} L ${noseX + 40} ${centerY + 4} Z`} fill={primaryPaint} />

              <g stroke="#38bdf8" strokeWidth="0.75">
                <line x1="940" y1={centerY - spanPx / 2} x2="940" y2={centerY + spanPx / 2} />
                <line x1="932" y1={centerY - spanPx / 2} x2="948" y2={centerY - spanPx / 2} />
                <line x1="932" y1={centerY + spanPx / 2} x2="948" y2={centerY + spanPx / 2} />
                <text x="965" y={centerY + 4} fill="#38bdf8" fontSize="11" fontFamily="JetBrains Mono" textAnchor="start">
                  SPAN: {geometry.wingSpan.toFixed(1)} m
                </text>
              </g>
            </g>
          )}

          {/* 3. CABIN CROSS-SECTION */}
          {viewMode === 'cross_section' && (
            <g transform={`translate(${centerX - 140}, ${centerY - 100})`}>
              <circle cx="140" cy="100" r="95" fill="#0f1724" stroke="#38bdf8" strokeWidth="2" />
              <line x1="55" y1="125" x2="225" y2="125" stroke="#64748b" strokeWidth="2.5" />

              <rect x="70" y="35" width="45" height="22" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="1" />
              <rect x="165" y="35" width="45" height="22" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="1" />

              {(() => {
                const seats = geometry.seatsAbreast;
                const seatWidth = 14;
                const seatSpacing = 16;
                const startX = 140 - (seats * seatSpacing + (geometry.aisles * 12)) / 2;

                let curX = startX;
                const seatElements = [];

                for (let s = 0; s < seats; s++) {
                  if (geometry.aisles === 1 && s === Math.floor(seats / 2)) {
                    curX += 14;
                  }
                  if (geometry.aisles === 2 && (s === 2 || s === seats - 2)) {
                    curX += 12;
                  }

                  seatElements.push(
                    <g key={`seat_cross_${s}`} transform={`translate(${curX}, 85)`}>
                      <rect x="0" y="0" width={seatWidth} height="32" rx="3" fill={primaryPaint} stroke="#0f1724" strokeWidth="1" />
                      <rect x="2" y="-6" width={seatWidth - 4} height="8" rx="2" fill="#e2e8f0" />
                    </g>
                  );
                  curX += seatSpacing;
                }
                return seatElements;
              })()}

              <rect x="80" y="135" width="55" height="42" rx="2" fill="#334155" stroke="#64748b" strokeWidth="1" />
              <text x="107" y="160" fill="#94a3b8" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle">LD3-45</text>
              <rect x="145" y="135" width="55" height="42" rx="2" fill="#334155" stroke="#64748b" strokeWidth="1" />
              <text x="172" y="160" fill="#94a3b8" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle">LD3-45</text>

              <text x="140" y="225" fill="#38bdf8" fontSize="11" fontFamily="JetBrains Mono" textAnchor="middle">
                CROSS SECTION: {geometry.fuselageDiameter}m DIA // {geometry.seatsAbreast}-ABREAST ({geometry.aisles} AISLE)
              </text>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};
