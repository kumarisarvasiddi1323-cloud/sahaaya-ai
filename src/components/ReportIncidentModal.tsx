import React, { useState } from 'react';
import {
  Incident,
  DisasterType,
  IncidentSeverity,
  User
} from '../types/disaster';
import {
  AlertTriangle,
  MapPin,
  X,
  Compass,
  LifeBuoy,
  ShieldAlert,
  Send,
  Sparkles
} from 'lucide-react';

interface ReportIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onSubmitIncident: (incidentData: Partial<Incident>) => void;
}

const VIZAG_LANDMARK_PRESETS = [
  {
    name: 'RK Beach Fishermen Settlement',
    lat: 17.7145,
    lng: 83.3280,
    type: 'FLOOD' as DisasterType
  },
  {
    name: 'Gajuwaka Industrial Belt - Sector 4',
    lat: 17.6890,
    lng: 83.2120,
    type: 'FLOOD' as DisasterType
  },
  {
    name: 'Simhachalam Lower Ghat Curve',
    lat: 17.7680,
    lng: 83.2505,
    type: 'LANDSLIDE' as DisasterType
  },
  {
    name: 'Gangavaram Outer Breakwater',
    lat: 17.6250,
    lng: 83.2420,
    type: 'BOAT_CAPSIZE' as DisasterType
  },
  {
    name: 'Madhurawada Hillside Lowland',
    lat: 17.7650,
    lng: 83.3320,
    type: 'FLOOD' as DisasterType
  },
  {
    name: 'Rushikonda Coastal Creek Area',
    lat: 17.7820,
    lng: 83.3850,
    type: 'COASTAL_SURGE' as DisasterType
  }
];

export const ReportIncidentModal: React.FC<ReportIncidentModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSubmitIncident
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<DisasterType>('FLOOD');
  const [severity, setSeverity] = useState<IncidentSeverity>('HIGH_S2');
  const [locationName, setLocationName] = useState('');
  const [lat, setLat] = useState<number>(17.7145);
  const [lng, setLng] = useState<number>(83.3000);
  const [strandedCount, setStrandedCount] = useState<number>(12);
  const [injuredCount, setInjuredCount] = useState<number>(2);
  const [waterDepth, setWaterDepth] = useState<number>(1.2);
  const [needs, setNeeds] = useState<string[]>([
    'Inflatable Rescue Boats',
    'Life Jackets'
  ]);
  const [hazards, setHazards] = useState('');

  if (!isOpen) return null;

  const handleSelectPreset = (preset: typeof VIZAG_LANDMARK_PRESETS[0]) => {
    setLocationName(preset.name);
    setLat(preset.lat);
    setLng(preset.lng);
    setType(preset.type);
    if (!title) {
      setTitle(`Disaster Alert at ${preset.name}`);
    }
  };

  const toggleNeed = (needItem: string) => {
    if (needs.includes(needItem)) {
      setNeeds(needs.filter((n) => n !== needItem));
    } else {
      setNeeds([...needs, needItem]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !locationName) return;

    onSubmitIncident({
      title,
      description: description || 'Emergency rescue assistance required.',
      type,
      severity,
      locationName,
      coordinates: { lat, lng },
      estimatedVictimsStranded: strandedCount,
      injuredCount,
      waterDepthMeters: waterDepth,
      criticalNeeds: needs,
      accessHazards: hazards ? hazards.split(',').map((h) => h.trim()) : []
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#111827] border border-slate-700 rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Report New Disaster Incident</h2>
              <p className="text-xs text-slate-400">Authorised Incident Intake & Agent A Triage Entry</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Quick Landmark Presets */}
          <div>
            <label className="text-slate-400 block mb-1 font-semibold">
              Vizag Geographic Sector Quick Presets:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {VIZAG_LANDMARK_PRESETS.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleSelectPreset(preset)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-[11px] transition-colors"
                >
                  📍 {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-slate-300 block mb-1 font-semibold">Incident Headline:</label>
            <input
              type="text"
              required
              placeholder="e.g. Inundated residential colony with stranded families"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Type & Severity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Disaster Category:</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as DisasterType)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none"
              >
                <option value="FLOOD">FLOOD (Inundation / Breached Canal)</option>
                <option value="CYCLONE">CYCLONE (Gale Damage / Tidal Surge)</option>
                <option value="LANDSLIDE">LANDSLIDE (Mudslide / Hill Collapse)</option>
                <option value="BOAT_CAPSIZE">BOAT CAPSIZE (Marine / Offshore)</option>
                <option value="BUILDING_COLLAPSE">BUILDING COLLAPSE (Urban Structure)</option>
                <option value="CHEMICAL_LEAK">CHEMICAL / HAZMAT SPILL</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Initial Severity Index:</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as IncidentSeverity)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none"
              >
                <option value="CRITICAL_S1">CRITICAL S1 (Immediate Life Threat, &gt;20 Stranded)</option>
                <option value="HIGH_S2">HIGH S2 (Trapped / Rising Water / Injuries)</option>
                <option value="MEDIUM_S3">MEDIUM S3 (Assistance Needed, Structural Risk)</option>
                <option value="LOW_S4">LOW S4 (Localized Monitoring)</option>
              </select>
            </div>
          </div>

          {/* Location Name & Coordinates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Location / Landmark Name:</label>
              <input
                type="text"
                required
                placeholder="e.g. RK Beach South Hamlet"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Latitude (°N):</label>
              <input
                type="number"
                step="0.0001"
                required
                value={lat}
                onChange={(e) => setLat(parseFloat(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Longitude (°E):</label>
              <input
                type="number"
                step="0.0001"
                required
                value={lng}
                onChange={(e) => setLng(parseFloat(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Stranded Victims, Injured, Water Depth */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
            <div>
              <label className="text-slate-400 block mb-1 font-mono text-[10px]">STRANDED VICTIMS:</label>
              <input
                type="number"
                min={0}
                value={strandedCount}
                onChange={(e) => setStrandedCount(parseInt(e.target.value, 10) || 0)}
                className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-red-400 font-bold font-mono text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-mono text-[10px]">INJURED CASES:</label>
              <input
                type="number"
                min={0}
                value={injuredCount}
                onChange={(e) => setInjuredCount(parseInt(e.target.value, 10) || 0)}
                className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-amber-400 font-bold font-mono text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-mono text-[10px]">WATER DEPTH (METERS):</label>
              <input
                type="number"
                step="0.1"
                min={0}
                value={waterDepth}
                onChange={(e) => setWaterDepth(parseFloat(e.target.value) || 0)}
                className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-cyan-400 font-bold font-mono text-sm focus:outline-none"
              />
            </div>
          </div>

          {/* Critical Needs Checkboxes */}
          <div>
            <label className="text-slate-300 block mb-1.5 font-semibold">Critical Equipment Needs:</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[
                'Inflatable Rescue Boats',
                'Life Jackets',
                'Field Ambulances',
                'Paramedic Resuscitation',
                'Hydraulic Extricators',
                'Dewatering Trash Pumps',
                'Survival Rations',
                'Satellite Phones'
              ].map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => toggleNeed(item)}
                  className={`p-2 rounded-lg border text-left text-[11px] transition-colors flex items-center justify-between ${
                    needs.includes(item)
                      ? 'bg-orange-600/20 border-orange-500/50 text-orange-200 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <span>{item}</span>
                  {needs.includes(item) && <span className="text-orange-400">✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Description & Access Hazards */}
          <div>
            <label className="text-slate-300 block mb-1 font-semibold">Field Situation Description:</label>
            <textarea
              rows={2}
              placeholder="Describe access conditions, structural integrity, and victim vulnerability..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="text-slate-300 block mb-1 font-semibold">Access Hazards (comma-separated):</label>
            <input
              type="text"
              placeholder="e.g. Downed electrical cables, strong currents, narrow alleyway"
              value={hazards}
              onChange={(e) => setHazards(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold flex items-center gap-2 shadow-lg shadow-red-600/30"
            >
              <Send className="w-4 h-4" />
              <span>Submit Incident to EOC & Agent A</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
