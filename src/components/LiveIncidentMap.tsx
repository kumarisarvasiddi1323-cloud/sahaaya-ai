import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Incident,
  RescueTeam,
  ResourceInventory
} from '../types/disaster';
import {
  Layers,
  MapPin,
  Compass,
  AlertTriangle,
  Users,
  Boxes,
  Maximize2,
  Clock,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface LiveIncidentMapProps {
  incidents: Incident[];
  teams: RescueTeam[];
  resources: ResourceInventory[];
  onSelectIncident: (incident: Incident) => void;
  onSelectTeam: (team: RescueTeam) => void;
  onTriggerAgentA: (incidentId?: string) => void;
}

export const LiveIncidentMap: React.FC<LiveIncidentMapProps> = ({
  incidents,
  teams,
  resources,
  onSelectIncident,
  onSelectTeam,
  onTriggerAgentA
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [showTeams, setShowTeams] = useState<boolean>(true);
  const [showHubs, setShowHubs] = useState<boolean>(true);
  const [cursorCoords, setCursorCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedIncidentDetail, setSelectedIncidentDetail] = useState<Incident | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Visakhapatnam central coordinates: 17.7041, 83.2977
      const map = L.map(mapContainerRef.current, {
        center: [17.7145, 83.3000],
        zoom: 12,
        zoomControl: false,
        attributionControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Dark / Tactical OpenStreetMap tile layer (CartoDB Dark Matter)
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        {
          maxZoom: 19,
          subdomains: 'abcd'
        }
      ).addTo(map);

      // Create overlay layers
      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;

      map.on('mousemove', (e) => {
        setCursorCoords({
          lat: parseFloat(e.latlng.lat.toFixed(4)),
          lng: parseFloat(e.latlng.lng.toFixed(4))
        });
      });

      mapInstanceRef.current = map;
    }

    return () => {
      // Cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update map markers when data or filters change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    const group = markersLayerRef.current;
    group.clearLayers();

    // 1. Render Incidents
    incidents.forEach((inc) => {
      if (filterSeverity !== 'ALL' && inc.severity !== filterSeverity) return;

      const isS1 = inc.severity === 'CRITICAL_S1';
      const isS2 = inc.severity === 'HIGH_S2';

      const colorHex = isS1 ? '#ef4444' : isS2 ? '#f97316' : '#eab308';
      const pulseHtml = isS1
        ? `<div class="w-7 h-7 -ml-3.5 -mt-3.5 rounded-full bg-red-600/30 animate-ping absolute"></div>`
        : '';

      const markerHtml = `
        <div class="relative cursor-pointer group">
          ${pulseHtml}
          <div style="background-color: ${colorHex};" class="w-7 h-7 -ml-3.5 -mt-3.5 rounded-full flex items-center justify-center text-white text-[11px] font-bold shadow-lg border-2 border-white">
            ${isS1 ? 'S1' : isS2 ? 'S2' : 'S3'}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-incident-marker',
        iconSize: [28, 28]
      });

      const marker = L.marker([inc.coordinates.lat, inc.coordinates.lng], {
        icon: customIcon
      });

      // Bind popup
      const popupContent = document.createElement('div');
      popupContent.className = 'p-1 text-slate-100 text-xs min-w-[220px]';
      popupContent.innerHTML = `
        <div class="flex items-center justify-between pb-1 mb-1 border-b border-slate-700">
          <span class="font-bold text-orange-400 font-mono">${inc.incidentCode}</span>
          <span class="px-1.5 py-0.2 rounded text-[10px] font-bold ${
            isS1 ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
          }">${inc.severity}</span>
        </div>
        <div class="font-semibold text-white mb-1">${inc.title}</div>
        <div class="text-slate-300 text-[11px] mb-1.5">📍 ${inc.locationName}</div>
        <div class="grid grid-cols-2 gap-1 text-[11px] bg-slate-800/80 p-1.5 rounded mb-2 font-mono">
          <div>Stranded: <strong class="text-red-400">${inc.estimatedVictimsStranded}</strong></div>
          <div>Depth: <strong class="text-cyan-400">${inc.waterDepthMeters ? inc.waterDepthMeters + 'm' : 'N/A'}</strong></div>
          <div>Status: <span class="text-emerald-400">${inc.status}</span></div>
          <div>Score: <span class="text-amber-400">${inc.priorityScore}/100</span></div>
        </div>
        <button id="view-inc-${inc.id}" class="w-full py-1 px-2 rounded bg-orange-600 hover:bg-orange-500 text-white font-bold text-[11px] flex items-center justify-center gap-1">
          Inspect & Coordinate →
        </button>
      `;

      marker.bindPopup(popupContent);
      marker.on('popupopen', () => {
        const btn = document.getElementById(`view-inc-${inc.id}`);
        if (btn) {
          btn.onclick = () => {
            setSelectedIncidentDetail(inc);
            onSelectIncident(inc);
          };
        }
      });

      marker.on('click', () => {
        setSelectedIncidentDetail(inc);
      });

      group.addLayer(marker);

      // Add high water risk circle overlay for S1 flood incidents
      if (isS1 && inc.type === 'FLOOD') {
        const riskCircle = L.circle([inc.coordinates.lat, inc.coordinates.lng], {
          radius: 850,
          color: '#ef4444',
          weight: 1,
          fillColor: '#ef4444',
          fillOpacity: 0.15
        });
        group.addLayer(riskCircle);
      }
    });

    // 2. Render Rescue Teams
    if (showTeams) {
      teams.forEach((team) => {
        const isAvailable = team.status === 'AVAILABLE';
        const teamColor = isAvailable ? '#3b82f6' : '#10b981';

        const teamHtml = `
          <div class="cursor-pointer group">
            <div style="background-color: ${teamColor};" class="w-6 h-6 -ml-3 -mt-3 rounded-md flex items-center justify-center text-white text-[10px] font-bold shadow-md border-2 border-white">
              ⚓
            </div>
            <div class="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/90 text-[9px] text-white px-1 py-0.5 rounded border border-slate-700 font-mono shadow">
              ${team.callsign}
            </div>
          </div>
        `;

        const teamIcon = L.divIcon({
          html: teamHtml,
          className: 'custom-team-marker',
          iconSize: [24, 24]
        });

        const marker = L.marker([team.currentLat, team.currentLng], {
          icon: teamIcon
        });

        marker.bindPopup(`
          <div class="p-1 text-slate-100 text-xs">
            <div class="font-bold text-blue-400 font-mono">${team.callsign} (${team.name})</div>
            <div class="text-[11px] text-slate-300">Org: ${team.orgName}</div>
            <div class="text-[11px] mt-1">Status: <strong class="${isAvailable ? 'text-blue-400' : 'text-emerald-400'}">${team.status}</strong></div>
            <div class="text-[10px] text-slate-400 mt-1">Specialty: ${team.specialty} (${team.memberCount} personnel)</div>
            <div class="text-[10px] text-slate-400">Readiness: ${team.readinessRating}/10 | Fuel/Bat: ${team.fuelBatteryLevel}%</div>
          </div>
        `);

        marker.on('click', () => {
          onSelectTeam(team);
        });

        group.addLayer(marker);
      });
    }

    // 3. Render Logistics Hubs
    if (showHubs) {
      resources.forEach((res) => {
        const hubHtml = `
          <div class="cursor-pointer">
            <div class="w-5 h-5 -ml-2.5 -mt-2.5 rounded bg-emerald-600 flex items-center justify-center text-white text-[9px] shadow border border-white">
              📦
            </div>
          </div>
        `;
        const hubIcon = L.divIcon({
          html: hubHtml,
          className: 'custom-hub-marker',
          iconSize: [20, 20]
        });

        const marker = L.marker([res.hubCoordinates.lat, res.hubCoordinates.lng], {
          icon: hubIcon
        });

        marker.bindPopup(`
          <div class="p-1 text-slate-100 text-xs">
            <div class="font-bold text-emerald-400 font-mono">DEPOT: ${res.storageHub}</div>
            <div class="text-[11px] text-slate-200 mt-1">${res.name}</div>
            <div class="text-[10px] font-mono text-emerald-300">Avail: ${res.availableQuantity} / Total: ${res.totalQuantity} ${res.unit}</div>
          </div>
        `);

        group.addLayer(marker);
      });
    }
  }, [incidents, teams, resources, filterSeverity, showTeams, showHubs]);

  const panToLocation = (lat: number, lng: number, zoom = 14) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], zoom, { duration: 1.2 });
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-125px)] bg-[#0b132b] text-slate-100 overflow-hidden relative">
      {/* Top Map Action & Filter Ribbon */}
      <div className="bg-[#0f172a]/95 border-b border-slate-800 px-4 py-2 flex flex-wrap items-center justify-between gap-3 z-10">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5 text-orange-400" />
            Tactical Map:
          </span>

          {/* Quick preset locations */}
          <div className="flex items-center gap-1 text-xs">
            <button
              onClick={() => panToLocation(17.7145, 83.3280, 15)}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] transition-colors"
            >
              RK Beach (S1)
            </button>
            <button
              onClick={() => panToLocation(17.6890, 83.2120, 15)}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] transition-colors"
            >
              Gajuwaka (S1)
            </button>
            <button
              onClick={() => panToLocation(17.7680, 83.2505, 14)}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] transition-colors"
            >
              Simhachalam Ghat (S2)
            </button>
            <button
              onClick={() => panToLocation(17.6250, 83.2420, 14)}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] transition-colors"
            >
              Gangavaram Offshore (S2)
            </button>
          </div>
        </div>

        {/* Severity Filter & Layer Toggles */}
        <div className="flex items-center gap-2 text-xs flex-wrap">
          <div className="flex items-center bg-slate-800/80 rounded-md p-0.5 border border-slate-700 text-[11px]">
            <button
              onClick={() => setFilterSeverity('ALL')}
              className={`px-2 py-0.5 rounded ${filterSeverity === 'ALL' ? 'bg-orange-600 text-white font-bold' : 'text-slate-400'}`}
            >
              All ({incidents.length})
            </button>
            <button
              onClick={() => setFilterSeverity('CRITICAL_S1')}
              className={`px-2 py-0.5 rounded ${filterSeverity === 'CRITICAL_S1' ? 'bg-red-600 text-white font-bold' : 'text-red-400'}`}
            >
              S1 Critical
            </button>
            <button
              onClick={() => setFilterSeverity('HIGH_S2')}
              className={`px-2 py-0.5 rounded ${filterSeverity === 'HIGH_S2' ? 'bg-amber-600 text-white font-bold' : 'text-amber-400'}`}
            >
              S2 High
            </button>
          </div>

          <button
            onClick={() => setShowTeams(!showTeams)}
            className={`px-2.5 py-1 rounded-md text-[11px] flex items-center gap-1 border transition-colors ${
              showTeams ? 'bg-blue-600/20 text-blue-300 border-blue-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <Users className="w-3 h-3" /> Teams ({teams.length})
          </button>

          <button
            onClick={() => setShowHubs(!showHubs)}
            className={`px-2.5 py-1 rounded-md text-[11px] flex items-center gap-1 border transition-colors ${
              showHubs ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <Boxes className="w-3 h-3" /> Depots ({resources.length})
          </button>
        </div>
      </div>

      {/* Main Map Body with overlay drawer */}
      <div className="relative flex-1 w-full h-full">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Tactical Legend & Data Freshness Badge */}
        <div className="absolute bottom-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-2.5 rounded-lg shadow-2xl text-[11px] max-w-xs pointer-events-auto">
          <div className="font-bold text-slate-200 mb-1.5 flex items-center justify-between">
            <span>MAP TELEMETRY</span>
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
              <ShieldCheck className="w-3 h-3" /> VERIFIED
            </span>
          </div>

          <div className="space-y-1 text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 border border-white inline-block"></span>
              <span>Critical S1 Incident (&gt;20 Stranded)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-500 border border-white inline-block"></span>
              <span>High S2 Incident (Trapped / Structural)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-blue-500 border border-white inline-block"></span>
              <span>Available Rescue Unit (NDRF/SDRF)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-emerald-600 border border-white inline-block"></span>
              <span>Relief Resource Hub & Depot</span>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-400">
            <div className="flex items-center gap-1 text-amber-300/80 mb-0.5">
              <Clock className="w-3 h-3" /> Data Freshness: <strong>2m ago</strong>
            </div>
            <p className="leading-tight text-slate-500">
              Coordinates verified from SDRF/NDRF radio reports & GPS beacon checkpoints.
            </p>
          </div>
        </div>

        {/* Selected Incident Drawer on right if selected */}
        {selectedIncidentDetail && (
          <div className="absolute top-4 right-4 z-20 w-80 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-xl shadow-2xl p-4 text-xs animate-in slide-in-from-right">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
              <div>
                <span className="font-mono font-bold text-orange-400">{selectedIncidentDetail.incidentCode}</span>
                <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/30">
                  {selectedIncidentDetail.severity}
                </span>
              </div>
              <button
                onClick={() => setSelectedIncidentDetail(null)}
                className="text-slate-400 hover:text-white text-base leading-none"
              >
                ✕
              </button>
            </div>

            <h4 className="font-bold text-sm text-white mb-1.5">{selectedIncidentDetail.title}</h4>
            <p className="text-slate-300 text-[11px] mb-3 leading-relaxed">{selectedIncidentDetail.description}</p>

            <div className="bg-slate-800/90 rounded-lg p-2.5 mb-3 space-y-1.5 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Location:</span>
                <span className="text-white text-right max-w-[150px] truncate">{selectedIncidentDetail.locationName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Victims Stranded:</span>
                <span className="text-red-400 font-bold">{selectedIncidentDetail.estimatedVictimsStranded}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Injured:</span>
                <span className="text-amber-400 font-bold">{selectedIncidentDetail.injuredCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Flood Depth:</span>
                <span className="text-cyan-400">{selectedIncidentDetail.waterDepthMeters ? `${selectedIncidentDetail.waterDepthMeters}m` : 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Agent A Score:</span>
                <span className="text-emerald-400 font-bold">{selectedIncidentDetail.priorityScore}/100</span>
              </div>
            </div>

            <div className="mb-3">
              <div className="text-[10px] text-slate-400 uppercase font-semibold mb-1">Critical Requirements:</div>
              <div className="flex flex-wrap gap-1">
                {selectedIncidentDetail.criticalNeeds.map((need, idx) => (
                  <span key={idx} className="bg-slate-800 text-slate-300 text-[10px] px-1.5 py-0.5 rounded border border-slate-700">
                    {need}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <button
                onClick={() => onTriggerAgentA(selectedIncidentDetail.id)}
                className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-orange-500/20"
              >
                <span>Agent A Tactical Triage</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Coordinates indicator at bottom right */}
        {cursorCoords && (
          <div className="absolute bottom-4 right-14 z-10 bg-slate-900/80 backdrop-blur-sm border border-slate-800 px-2.5 py-1 rounded text-[10px] font-mono text-slate-400">
            LAT: {cursorCoords.lat}° N | LNG: {cursorCoords.lng}° E (Vizag Sector)
          </div>
        )}
      </div>
    </div>
  );
};
