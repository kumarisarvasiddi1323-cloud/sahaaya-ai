import React, { useState } from 'react';
import {
  Incident,
  DisasterType,
  IncidentSeverity,
  IncidentStatus,
  User
} from '../types/disaster';
import {
  AlertTriangle,
  Search,
  Filter,
  Plus,
  Compass,
  Sparkles,
  Users,
  ShieldCheck,
  CheckCircle,
  Clock,
  Layers,
  ArrowUpDown,
  LifeBuoy
} from 'lucide-react';

interface IncidentManagementProps {
  incidents: Incident[];
  currentUser: User;
  onOpenReportModal: () => void;
  onTriggerAgentA: (incidentId?: string) => void;
  onUpdateIncidentStatus: (incidentId: string, status: IncidentStatus) => void;
  onToggleVerifyIncident: (incidentId: string, verified: boolean) => void;
  onViewOnMap: (incident: Incident) => void;
}

export const IncidentManagement: React.FC<IncidentManagementProps> = ({
  incidents,
  currentUser,
  onOpenReportModal,
  onTriggerAgentA,
  onUpdateIncidentStatus,
  onToggleVerifyIncident,
  onViewOnMap
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  const filteredIncidents = incidents.filter((inc) => {
    const matchesSearch =
      inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.incidentCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.locationName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'ALL' || inc.type === typeFilter;
    const matchesSeverity = severityFilter === 'ALL' || inc.severity === severityFilter;
    const matchesStatus = statusFilter === 'ALL' || inc.status === statusFilter;
    return matchesSearch && matchesType && matchesSeverity && matchesStatus;
  });

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto text-slate-100">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-orange-400 font-bold text-xs uppercase tracking-wider">
              SAHAAYA OPERATIONS GRID
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400">Total {incidents.length} Incident Records</span>
          </div>
          <h2 className="text-2xl font-black text-white">Disaster Incidents & Tactical Triage</h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Real-time incident registration, casualty verification, and autonomous Agent A priority evaluation.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onTriggerAgentA()}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-orange-500/20 border border-orange-400/40"
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>Agent A Batch Triage</span>
          </button>

          <button
            onClick={onOpenReportModal}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-red-600/30 border border-red-400/40"
          >
            <Plus className="w-4 h-4" />
            <span>Report Incident</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-[#111827]/80 border border-slate-800 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search code (e.g. VZG-FLD), title, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 text-xs"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1">
            <span className="text-slate-400 text-[11px]">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-orange-500"
            >
              <option value="ALL">All Disaster Types</option>
              <option value="FLOOD">Flood</option>
              <option value="CYCLONE">Cyclone</option>
              <option value="LANDSLIDE">Landslide</option>
              <option value="BOAT_CAPSIZE">Boat Capsize</option>
              <option value="BUILDING_COLLAPSE">Building Collapse</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-slate-400 text-[11px]">Severity:</span>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-orange-500"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL_S1">Critical S1</option>
              <option value="HIGH_S2">High S2</option>
              <option value="MEDIUM_S3">Medium S3</option>
              <option value="LOW_S4">Low S4</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-slate-400 text-[11px]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-orange-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="REPORTED">Reported</option>
              <option value="DISPATCH_PROPOSED">Dispatch Proposed</option>
              <option value="DISPATCHED">Dispatched</option>
              <option value="OPERATIONAL">Operational</option>
              <option value="STABILIZED">Stabilized</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Incidents Table / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIncidents.map((incident) => {
          const isS1 = incident.severity === 'CRITICAL_S1';
          const isS2 = incident.severity === 'HIGH_S2';

          return (
            <div
              key={incident.id}
              className={`rounded-2xl border p-4.5 flex flex-col justify-between transition-all bg-[#111827]/90 hover:border-slate-600 shadow-xl ${
                isS1 ? 'border-red-500/40 bg-gradient-to-b from-red-950/20 to-[#111827]' : 'border-slate-800'
              }`}
            >
              <div>
                {/* Code and Badges */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-orange-400 text-xs">{incident.incidentCode}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      isS1
                        ? 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse'
                        : isS2
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40'
                    }`}>
                      {incident.severity.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {incident.verifiedByCommander ? (
                      <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 rounded font-bold">
                        <ShieldCheck className="w-3 h-3" /> VERIFIED
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 rounded">
                        UNVERIFIED
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-bold text-white text-sm mb-1.5 line-clamp-2">{incident.title}</h3>
                <p className="text-slate-300 text-xs mb-3 line-clamp-2">{incident.description}</p>

                {/* Tactical Telemetry Box */}
                <div className="bg-slate-900/90 rounded-xl p-2.5 mb-3 grid grid-cols-2 gap-2 text-[11px] font-mono border border-slate-800">
                  <div>
                    <span className="text-slate-400 block text-[10px]">STRANDED:</span>
                    <strong className="text-red-400 text-sm">{incident.estimatedVictimsStranded}</strong> Victims
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">INJURED:</span>
                    <strong className="text-amber-400 text-sm">{incident.injuredCount}</strong> Cases
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">WATER LEVEL:</span>
                    <strong className="text-cyan-400">{incident.waterDepthMeters ? `${incident.waterDepthMeters}m` : 'Dry'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">PRIORITY SCORE:</span>
                    <strong className="text-emerald-400 text-sm">{incident.priorityScore}/100</strong>
                  </div>
                </div>

                {/* Location and Source */}
                <div className="text-[11px] text-slate-400 space-y-1 mb-3">
                  <div className="flex items-start gap-1">
                    <span className="text-orange-400">📍</span>
                    <span className="text-slate-200">{incident.locationName}</span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Source: {incident.reportedByOrgName} • {new Date(incident.reportedAt).toLocaleTimeString()}
                  </div>
                </div>

                {/* Critical requirements pills */}
                <div className="mb-3">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold mb-1">Required Assets:</div>
                  <div className="flex flex-wrap gap-1">
                    {incident.criticalNeeds.slice(0, 3).map((need, idx) => (
                      <span key={idx} className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded border border-slate-700">
                        {need}
                      </span>
                    ))}
                    {incident.criticalNeeds.length > 3 && (
                      <span className="text-[10px] text-slate-500 self-center">+{incident.criticalNeeds.length - 3}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-3 border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onViewOnMap(incident)}
                    className="flex-1 py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1 border border-slate-700 transition-colors"
                  >
                    <Compass className="w-3.5 h-3.5 text-orange-400" />
                    <span>View Map</span>
                  </button>

                  <button
                    onClick={() => onTriggerAgentA(incident.id)}
                    className="flex-1 py-1.5 px-2.5 rounded-lg bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-md shadow-orange-500/20"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                    <span>Agent A</span>
                  </button>
                </div>

                {/* Coordinator quick status change */}
                <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400">
                  <span>Status:</span>
                  <select
                    value={incident.status}
                    onChange={(e) => onUpdateIncidentStatus(incident.id, e.target.value as IncidentStatus)}
                    className="bg-slate-900 border border-slate-700 text-slate-200 rounded px-2 py-0.5 text-[11px] focus:outline-none"
                  >
                    <option value="REPORTED">REPORTED</option>
                    <option value="DISPATCH_PROPOSED">DISPATCH_PROPOSED</option>
                    <option value="DISPATCHED">DISPATCHED</option>
                    <option value="OPERATIONAL">OPERATIONAL</option>
                    <option value="STABILIZED">STABILIZED</option>
                    <option value="RESOLVED">RESOLVED</option>
                  </select>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
