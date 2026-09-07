// ============================================================================
// PROJECT AIRFRAME - TECHNICAL TOP-VIEW CAD AIRCRAFT SCHEMATIC (SVG)
// ============================================================================

import React from 'react';
import type { AircraftGeometry, PropulsionConfig } from '../../types';

interface TechnicalBlueprintProps {
  geometry: AircraftGeometry;
  propulsion: PropulsionConfig;
  highlightComponent?: 'fuselage' | 'wing' | 'propulsion' | 'winglet' | 'cabin' | 'all';
  showDimensions?: boolean;
}

export const TechnicalBlueprint: React.FC<TechnicalBlueprintProps> = ({
  geometry,
  propulsion,
  highlightComponent = 'all',
  showDimensions = true
}) => {
  const {
    length = 35.8,
    wingSpan = 32.5,
    fuselageDiameter = 3.75,
    wingSweepDegrees = 24.5,
    wingletType = 'split_scimitar'
  } = geometry;

  // ViewBox Coordinates (scaled in meters, centered at origin)
  // X: -Span/2 to +Span/2, Y: -5m (nose) to Length+5m (tail)
  const margin = 5.0;
  const viewWidth = Math.max(wingSpan + margin * 2, 45);
  const viewHeight = Math.max(length + margin * 2, 48);

  const minX = -viewWidth / 2;
  const minY = -margin;

  // Parametric measurements
  const noseY = 0;
  const tailY = length;
  const halfDiameter = fuselageDiameter / 2;
  const halfSpan = wingSpan / 2;

  // Wing root and tip geometry
  const wingRootY = length * 0.42;
  const wingRootChord = Math.max(4.5, (geometry.wingArea || 112) / (wingSpan * 0.65));
  const sweepRad = (wingSweepDegrees * Math.PI) / 180;
  const wingTipY = wingRootY + Math.tan(sweepRad) * (halfSpan - halfDiameter);
  const wingTipChord = wingRootChord * 0.32;

  // Engine nacelle position (on wing pylon)
  const enginePylonX = halfSpan * 0.38;
  const enginePylonY = wingRootY + Math.tan(sweepRad) * (enginePylonX - halfDiameter) + 0.2;
  const engineRadius = Math.max(0.9, (propulsion.bypassRatio || 10) * 0.11);
  const engineLength = Math.max(3.2, (propulsion.thrustPerEngineKN || 120) * 0.028);


  // Horizontal stabilizer geometry
  const stabSpan = wingSpan * 0.35;
  const stabRootY = length * 0.88;
  const stabTipY = stabRootY + Math.tan(sweepRad * 1.1) * (stabSpan / 2);
  const stabRootChord = 3.2;
  const stabTipChord = 1.1;

  // Color scheme based on highlight
  const getStroke = (part: string) => {
    if (highlightComponent === part) return '#38bdf8';
    return '#A1A19A';
  };

  const getFill = (part: string) => {
    if (highlightComponent === part) return 'rgba(56, 189, 248, 0.08)';
    return 'rgba(255, 255, 255, 0.02)';
  };

  return (
    <div className="w-full h-full relative flex items-center justify-center cad-grid-bg overflow-hidden p-6 select-none">
      {/* CAD Schematic Header / Engineering Stamp */}
      <div className="absolute top-4 left-4 z-10 font-mono text-[11px] text-[#A1A19A] flex flex-col gap-0.5 pointer-events-none">
        <span className="text-[#F5F5F3] font-semibold tracking-wider">PROJECT AIRFRAME // TOP-VIEW SCHEMATIC</span>
        <span className="text-[#666660]">SCALE 1:1 METRIC ORTHOGRAPHIC</span>
        <span className="text-[#666660]">
          SPAN: {wingSpan.toFixed(1)}m | LENGTH: {length.toFixed(1)}m | DIA: {fuselageDiameter.toFixed(2)}m
        </span>
      </div>

      <svg
        viewBox={`${minX} ${minY} ${viewWidth} ${viewHeight}`}
        className="w-full h-full max-h-full max-w-full drop-shadow-sm"
        style={{ vectorEffect: 'non-scaling-stroke' }}
      >
        <defs>
          <pattern id="blueprint-subgrid" width="2" height="2" patternUnits="userSpaceOnUse">
            <path d="M 2 0 L 0 0 0 2" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="0.05" />
          </pattern>
        </defs>

        {/* Centerline Axis Line */}
        <line
          x1="0"
          y1="-2"
          x2="0"
          y2={length + 3}
          stroke="#454540"
          strokeWidth="0.08"
          strokeDasharray="0.6,0.3,0.1,0.3"
        />

        {/* Fuselage Station Lines */}
        {[0.2, 0.35, 0.5, 0.65, 0.8].map((ratio, i) => (
          <line
            key={`st-${i}`}
            x1={-halfDiameter * 1.3}
            y1={length * ratio}
            x2={halfDiameter * 1.3}
            y2={length * ratio}
            stroke="#303030"
            strokeWidth="0.05"
            strokeDasharray="0.3,0.3"
          />
        ))}

        {/* 1. MAIN WING PLANFORM (LEFT & RIGHT) */}
        {/* Right Wing */}
        <path
          d={`
            M ${halfDiameter} ${wingRootY}
            L ${halfSpan} ${wingTipY}
            L ${halfSpan} ${wingTipY + wingTipChord}
            L ${halfDiameter} ${wingRootY + wingRootChord}
            Z
          `}
          fill={getFill('wing')}
          stroke={getStroke('wing')}
          strokeWidth="0.12"
          strokeLinejoin="round"
        />

        {/* Left Wing */}
        <path
          d={`
            M ${-halfDiameter} ${wingRootY}
            L ${-halfSpan} ${wingTipY}
            L ${-halfSpan} ${wingTipY + wingTipChord}
            L ${-halfDiameter} ${wingRootY + wingRootChord}
            Z
          `}
          fill={getFill('wing')}
          stroke={getStroke('wing')}
          strokeWidth="0.12"
          strokeLinejoin="round"
        />

        {/* Wing Flap Track Fairings */}
        {[-0.55, -0.75, 0.55, 0.75].map((pos, idx) => {
          const trackX = halfSpan * pos;
          const trackY = wingRootY + Math.tan(sweepRad) * (Math.abs(trackX) - halfDiameter) + wingRootChord * 0.7;
          return (
            <rect
              key={`flap-${idx}`}
              x={trackX - 0.15}
              y={trackY}
              width="0.3"
              height="1.6"
              rx="0.15"
              fill="#242424"
              stroke="#666660"
              strokeWidth="0.06"
            />
          );
        })}

        {/* Winglet Devices */}
        {wingletType !== 'none' && (
          <>
            {/* Right Wingtip */}
            <path
              d={
                wingletType === 'split_scimitar'
                  ? `M ${halfSpan} ${wingTipY} L ${halfSpan + 0.4} ${wingTipY - 0.8} L ${halfSpan + 0.3} ${wingTipY + wingTipChord + 0.6} Z`
                  : wingletType === 'raked_wingtip'
                  ? `M ${halfSpan} ${wingTipY} L ${halfSpan + 1.2} ${wingTipY + wingTipChord * 0.7} L ${halfSpan} ${wingTipY + wingTipChord} Z`
                  : `M ${halfSpan} ${wingTipY} L ${halfSpan + 0.5} ${wingTipY - 0.6} L ${halfSpan} ${wingTipY + wingTipChord} Z`
              }
              fill={getFill('winglet')}
              stroke={getStroke('winglet')}
              strokeWidth="0.10"
            />
            {/* Left Wingtip */}
            <path
              d={
                wingletType === 'split_scimitar'
                  ? `M ${-halfSpan} ${wingTipY} L ${-halfSpan - 0.4} ${wingTipY - 0.8} L ${-halfSpan - 0.3} ${wingTipY + wingTipChord + 0.6} Z`
                  : wingletType === 'raked_wingtip'
                  ? `M ${-halfSpan} ${wingTipY} L ${-halfSpan - 1.2} ${wingTipY + wingTipChord * 0.7} L ${-halfSpan} ${wingTipY + wingTipChord} Z`
                  : `M ${-halfSpan} ${wingTipY} L ${-halfSpan - 0.5} ${wingTipY - 0.6} L ${-halfSpan} ${wingTipY + wingTipChord} Z`
              }
              fill={getFill('winglet')}
              stroke={getStroke('winglet')}
              strokeWidth="0.10"
            />
          </>
        )}

        {/* 2. HORIZONTAL STABILIZERS */}
        {/* Right Stabilizer */}
        <path
          d={`
            M ${halfDiameter * 0.6} ${stabRootY}
            L ${stabSpan / 2} ${stabTipY}
            L ${stabSpan / 2} ${stabTipY + stabTipChord}
            L ${halfDiameter * 0.4} ${stabRootY + stabRootChord}
            Z
          `}
          fill={getFill('wing')}
          stroke={getStroke('wing')}
          strokeWidth="0.10"
        />
        {/* Left Stabilizer */}
        <path
          d={`
            M ${-halfDiameter * 0.6} ${stabRootY}
            L ${-stabSpan / 2} ${stabTipY}
            L ${-stabSpan / 2} ${stabTipY + stabTipChord}
            L ${-halfDiameter * 0.4} ${stabRootY + stabRootChord}
            Z
          `}
          fill={getFill('wing')}
          stroke={getStroke('wing')}
          strokeWidth="0.10"
        />

        {/* Vertical Fin Top Profile / Dorsal Spine */}
        <path
          d={`
            M 0 ${length * 0.75}
            L 0.25 ${length * 0.88}
            L 0.15 ${length * 0.98}
            L -0.15 ${length * 0.98}
            L -0.25 ${length * 0.88}
            Z
          `}
          fill="#1B1B1B"
          stroke="#A1A19A"
          strokeWidth="0.08"
        />

        {/* 3. FUSELAGE BARREL & NOSE RADOME */}
        <path
          d={`
            M 0 ${noseY}
            C ${halfDiameter * 0.8} ${noseY + 1.2}, ${halfDiameter} ${noseY + 3.0}, ${halfDiameter} ${noseY + 5.0}
            L ${halfDiameter} ${tailY - 5.0}
            C ${halfDiameter} ${tailY - 2.0}, ${halfDiameter * 0.5} ${tailY - 0.5}, 0 ${tailY}
            C ${-halfDiameter * 0.5} ${tailY - 0.5}, ${-halfDiameter} ${tailY - 2.0}, ${-halfDiameter} ${tailY - 5.0}
            L ${-halfDiameter} ${noseY + 5.0}
            C ${-halfDiameter} ${noseY + 3.0}, ${-halfDiameter * 0.8} ${noseY + 1.2}, 0 ${noseY}
            Z
          `}
          fill={getFill('fuselage')}
          stroke={getStroke('fuselage')}
          strokeWidth="0.14"
          strokeLinejoin="round"
        />

        {/* Cockpit Windshield Eyebrow Outline */}
        <path
          d={`
            M ${-halfDiameter * 0.55} ${noseY + 2.2}
            C ${-halfDiameter * 0.3} ${noseY + 1.6}, ${halfDiameter * 0.3} ${noseY + 1.6}, ${halfDiameter * 0.55} ${noseY + 2.2}
            L ${halfDiameter * 0.45} ${noseY + 2.6}
            L ${-halfDiameter * 0.45} ${noseY + 2.6}
            Z
          `}
          fill="#141414"
          stroke="#666660"
          strokeWidth="0.06"
        />

        {/* 4. PROPULSION NACELLES & PYLONS */}
        {/* Right Engine Pylon */}
        <rect
          x={enginePylonX - 0.25}
          y={enginePylonY - 1.2}
          width="0.5"
          height={engineLength * 0.9}
          fill="#242424"
          stroke={getStroke('propulsion')}
          strokeWidth="0.08"
        />
        {/* Right Engine Nacelle */}
        <ellipse
          cx={enginePylonX}
          cy={enginePylonY}
          rx={engineRadius}
          ry={engineLength / 2}
          fill={getFill('propulsion')}
          stroke={getStroke('propulsion')}
          strokeWidth="0.12"
        />
        {/* Right Engine Spinner / Fan Face */}
        <line
          x1={enginePylonX - engineRadius * 0.75}
          y1={enginePylonY - engineLength * 0.42}
          x2={enginePylonX + engineRadius * 0.75}
          y2={enginePylonY - engineLength * 0.42}
          stroke="#666660"
          strokeWidth="0.08"
        />

        {/* Left Engine Pylon */}
        <rect
          x={-enginePylonX - 0.25}
          y={enginePylonY - 1.2}
          width="0.5"
          height={engineLength * 0.9}
          fill="#242424"
          stroke={getStroke('propulsion')}
          strokeWidth="0.08"
        />
        {/* Left Engine Nacelle */}
        <ellipse
          cx={-enginePylonX}
          cy={enginePylonY}
          rx={engineRadius}
          ry={engineLength / 2}
          fill={getFill('propulsion')}
          stroke={getStroke('propulsion')}
          strokeWidth="0.12"
        />
        {/* Left Engine Spinner / Fan Face */}
        <line
          x1={-enginePylonX - engineRadius * 0.75}
          y1={enginePylonY - engineLength * 0.42}
          x2={-enginePylonX + engineRadius * 0.75}
          y2={enginePylonY - engineLength * 0.42}
          stroke="#666660"
          strokeWidth="0.08"
        />

        {/* 5. DIMENSION LINES & METRIC CALLOUTS */}
        {showDimensions && (
          <g className="font-mono text-[10px] text-[#A1A19A]" fill="#A1A19A">
            {/* Wingspan Dimension Line (Top) */}
            <line
              x1={-halfSpan}
              y1={-3.0}
              x2={halfSpan}
              y2={-3.0}
              stroke="#666660"
              strokeWidth="0.06"
            />
            <line x1={-halfSpan} y1={-3.8} x2={-halfSpan} y2={-2.2} stroke="#666660" strokeWidth="0.06" />
            <line x1={halfSpan} y1={-3.8} x2={halfSpan} y2={-2.2} stroke="#666660" strokeWidth="0.06" />
            <text
              x="0"
              y="-3.5"
              textAnchor="middle"
              fontSize="0.9"
              fill="#F5F5F3"
              fontWeight="bold"
            >
              WINGSPAN {wingSpan.toFixed(1)} m
            </text>

            {/* Fuselage Length Dimension Line (Right side) */}
            <line
              x1={halfSpan + 3.0}
              y1={0}
              x2={halfSpan + 3.0}
              y2={length}
              stroke="#666660"
              strokeWidth="0.06"
            />
            <line x1={halfSpan + 2.2} y1={0} x2={halfSpan + 3.8} y2={0} stroke="#666660" strokeWidth="0.06" />
            <line x1={halfSpan + 2.2} y1={length} x2={halfSpan + 3.8} y2={length} stroke="#666660" strokeWidth="0.06" />
            <text
              x={halfSpan + 4.2}
              y={length / 2}
              textAnchor="middle"
              transform={`rotate(90, ${halfSpan + 4.2}, ${length / 2})`}
              fontSize="0.9"
              fill="#F5F5F3"
              fontWeight="bold"
            >
              LENGTH {length.toFixed(1)} m
            </text>

            {/* Fuselage Diameter Callout */}
            <line
              x1={-halfDiameter}
              y1={length * 0.25}
              x2={halfDiameter}
              y2={length * 0.25}
              stroke="#38bdf8"
              strokeWidth="0.05"
            />
            <text
              x="0"
              y={length * 0.25 - 0.4}
              textAnchor="middle"
              fontSize="0.75"
              fill="#38bdf8"
            >
              Ø {fuselageDiameter.toFixed(2)} m
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};
