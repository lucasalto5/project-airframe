// ============================================================================
// PROJECT AIRFRAME - INTERACTIVE 2D WORLD MAP & LIVE FLIGHT TRACKER
// ============================================================================

import React, { useRef, useEffect, useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { GLOBAL_AIRPORTS } from '../../data/airports';
import type { Airport } from '../../types';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  X
} from 'lucide-react';

export const WorldMapView: React.FC = () => {
  const { company } = useGameStore();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);
  const [zoom, setZoom] = useState<number>(1.0);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });


  const activeFlights = company.activeTestFlightMap || [];

  const latLonToCanvasXY = (lat: number, lon: number, width: number, height: number) => {
    const x = ((lon + 180) / 360) * width;
    const latRad = (lat * Math.PI) / 180;
    const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
    const y = height / 2 - (width * mercN) / (2 * Math.PI);
    return {
      x: (x - width / 2) * zoom + width / 2 + panOffset.x,
      y: (y - height / 2) * zoom + height / 2 + panOffset.y
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = '#0D0D0D';
    ctx.fillRect(0, 0, width, height);

    // Subtle longitude / latitude grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;

    for (let lon = -180; lon <= 180; lon += 30) {
      const p1 = latLonToCanvasXY(75, lon, width, height);
      const p2 = latLonToCanvasXY(-60, lon, width, height);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }

    for (let lat = -60; lat <= 75; lat += 20) {
      const p1 = latLonToCanvasXY(lat, -180, width, height);
      const p2 = latLonToCanvasXY(lat, 180, width, height);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }

    // Great Circle Flight Arcs
    activeFlights.forEach(flight => {
      const orig = GLOBAL_AIRPORTS.find(a => a.iata === flight.originIata);
      const dest = GLOBAL_AIRPORTS.find(a => a.iata === flight.destinationIata);
      if (!orig || !dest) return;

      const pOrig = latLonToCanvasXY(orig.lat, orig.lon, width, height);
      const pDest = latLonToCanvasXY(dest.lat, dest.lon, width, height);

      ctx.beginPath();
      ctx.moveTo(pOrig.x, pOrig.y);
      const midX = (pOrig.x + pDest.x) / 2;
      const midY = Math.min(pOrig.y, pDest.y) - 25 * zoom;
      ctx.quadraticCurveTo(midX, midY, pDest.x, pDest.y);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.lineWidth = 1.0;
      ctx.stroke();

      const pPlane = latLonToCanvasXY(flight.currentLat, flight.currentLon, width, height);

      ctx.save();
      ctx.translate(pPlane.x, pPlane.y);
      ctx.rotate((flight.headingDegrees * Math.PI) / 180);

      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(0, -5);
      ctx.lineTo(4, 5);
      ctx.lineTo(0, 3);
      ctx.lineTo(-4, 5);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    });

    // Airport Hub Nodes
    GLOBAL_AIRPORTS.forEach(ap => {
      const p = latLonToCanvasXY(ap.lat, ap.lon, width, height);
      if (p.x < -10 || p.x > width + 10 || p.y < -10 || p.y > height + 10) return;

      const isMajor = ap.hubTier === 'mega_hub';
      ctx.fillStyle = isMajor ? '#F5F5F3' : '#666660';
      ctx.beginPath();
      ctx.arc(p.x, p.y, isMajor ? 2.5 : 1.5, 0, Math.PI * 2);
      ctx.fill();

      if (zoom >= 1.4 && isMajor) {
        ctx.fillStyle = '#A1A19A';
        ctx.font = '9px JetBrains Mono, monospace';
        ctx.fillText(ap.iata, p.x + 5, p.y + 3);
      }
    });

  }, [zoom, panOffset, activeFlights]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#0D0D0D] select-none">
      <canvas
        ref={canvasRef}
        width={1920}
        height={1080}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
      />

      {/* Top Left: Clean Operational Badge */}
      <div className="absolute top-6 left-6 z-10 font-mono text-xs text-[#A1A19A] flex items-center gap-3 pointer-events-none">
        <span className="text-[#F5F5F3] font-semibold tracking-wider uppercase">
          LIVE GLOBAL AIR ROUTE NETWORK
        </span>
        <span className="text-[#666660]">
          • {GLOBAL_AIRPORTS.length} HUBS • {activeFlights.length} AIRBORNE
        </span>
      </div>

      {/* Top Right: Zoom & Reset Controls */}
      <div className="absolute top-6 right-6 z-10 flex items-center gap-1.5 bg-[#141414] border border-[#242424] rounded-md p-1 font-mono text-xs">
        <button
          onClick={() => setZoom(z => Math.min(z + 0.3, 3.5))}
          title="Zoom In"
          className="p-2 rounded hover:bg-[#242424] text-[#A1A19A] hover:text-[#F5F5F3]"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom(z => Math.max(z - 0.3, 0.7))}
          title="Zoom Out"
          className="p-2 rounded hover:bg-[#242424] text-[#A1A19A] hover:text-[#F5F5F3]"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            setZoom(1.0);
            setPanOffset({ x: 0, y: 0 });
          }}
          title="Reset View"
          className="p-2 rounded hover:bg-[#242424] text-[#A1A19A] hover:text-[#F5F5F3]"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Floating Airport / Flight Drawer (User Directive #33) */}
      {selectedAirport && (
        <div className="absolute bottom-6 right-6 z-20 w-80 bg-[#141414] border border-[#242424] rounded-lg p-5 font-mono text-xs shadow-2xl flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-base font-bold text-[#F5F5F3]">{selectedAirport.iata}</span>
              <span className="text-xs text-[#A1A19A] block mt-0.5">{selectedAirport.city}, {selectedAirport.country}</span>
            </div>
            <button onClick={() => setSelectedAirport(null)} className="text-[#666660] hover:text-[#F5F5F3]">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="pt-2 border-t border-[#242424] text-[11px] text-[#A1A19A] flex flex-col gap-1">
            <div className="flex justify-between">
              <span>Runway Length:</span>
              <span className="text-[#F5F5F3]">{selectedAirport.runwayLengthMeters} m</span>
            </div>
            <div className="flex justify-between">
              <span>Elevation:</span>
              <span className="text-[#F5F5F3]">{selectedAirport.elevationFeet} ft</span>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
