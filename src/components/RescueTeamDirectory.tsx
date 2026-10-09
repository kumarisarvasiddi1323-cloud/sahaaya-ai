import React, { useState } from 'react';
import {
  RescueTeam,
  TeamStatus,
  TeamSpecialty,
  User
} from '../types/disaster';
import {
  Users,
  Shield,
  Phone,
  Radio,
  Fuel,
  Compass,
  CheckCircle,
  AlertCircle,
  Filter,
  Search,
  Battery,
  Award
} from 'lucide-react';

interface RescueTeamDirectoryProps {
  teams: RescueTeam[];
  currentUser: User;
  onUpdateTeamStatus: (teamId: string, status: TeamStatus) => void;
  onViewOnMap: (team: RescueTeam) => void;
}

export const RescueTeamDirectory: React.FC<RescueTeamDirectoryProps> = ({
  teams,
  currentUser,
  onUpdateTeamStatus,
  onViewOnMap
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredTeams = teams.filter((team) => {
    const matchesSearch =
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.callsign.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.orgName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = specialtyFilter === 'ALL' || team.specialty === specialtyFilter;
    const matchesStatus = statusFilter === 'ALL' || team.status === statusFilter;
    return matchesSearch && matchesSpecialty && matchesStatus;
  });

  const getStatusBadge = (status: TeamStatus) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'ON_SCENE':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold';
      case 'EN_ROUTE':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse';
      case 'ASSIGNED':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'RESTING':
        return 'bg-slate-700/50 text-slate-300 border-slate-600';
      default:
        return 'bg-red-500/20 text-red-300 border-red-500/40';
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto text-slate-100">
      {/* Header */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-blue-400 font-bold text-xs uppercase tracking-wider">
              AUTHORIZED FORCES ROSTER
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400">{teams.length} Verified Operational Units</span>
          </div>
          <h2 className="text-2xl font-black text-white">Rescue Team Directory & Telemetry</h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Real-time readiness monitoring, communication frequencies, personnel count, and deployment status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-center">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Ready for Deployment:</div>
            <div className="text-xl font-black text-blue-400 font-mono">
              {teams.filter((t) => t.status === 'AVAILABLE').length} <span className="text-xs text-slate-500 font-normal">/ {teams.length} Units</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-[#111827]/80 border border-slate-800 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search team name, callsign, agency..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1">
            <span className="text-slate-400 text-[11px]">Specialty:</span>
            <select
              value={specialtyFilter}
              onChange={(e) => setSpecialtyFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
            >
              <option value="ALL">All Specialties</option>
              <option value="WATER_RESCUE">Water & Flood Rescue</option>
              <option value="AIR_DROP_COASTAL">Helicopter SAR & Winch</option>
              <option value="URBAN_SAR">Urban Extrication (CSSR)</option>
              <option value="MEDICAL_EVAC">Medical Trauma Evacuation</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-slate-400 text-[11px]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="AVAILABLE">Available</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="EN_ROUTE">En Route</option>
              <option value="ON_SCENE">On Scene</option>
              <option value="RESTING">Resting</option>
            </select>
          </div>
        </div>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeams.map((team) => (
          <div
            key={team.id}
            className="rounded-2xl border border-slate-800 bg-[#111827]/90 p-5 flex flex-col justify-between shadow-xl hover:border-slate-700 transition-all text-xs"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-blue-400 text-sm">{team.callsign}</span>
                  <span className="text-[10px] text-slate-400 font-semibold">[{team.specialty}]</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadge(team.status)}`}>
                  {team.status}
                </span>
              </div>

              <h3 className="font-extrabold text-white text-base mb-1">{team.name}</h3>
              <div className="text-slate-400 text-[11px] mb-3">{team.orgName}</div>

              {/* Stats Box */}
              <div className="bg-slate-900/90 rounded-xl p-3 mb-3 grid grid-cols-2 gap-2 text-[11px] font-mono border border-slate-800">
                <div>
                  <span className="text-slate-400 block text-[10px]">PERSONNEL:</span>
                  <strong className="text-white text-sm">{team.memberCount}</strong> Members
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">READINESS:</span>
                  <strong className="text-emerald-400 text-sm">{team.readinessRating}/10</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">BATTERY / FUEL:</span>
                  <strong className="text-cyan-400">{team.fuelBatteryLevel}%</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">LAST CHECK-IN:</span>
                  <span className="text-amber-300">{team.lastCheckIn}</span>
                </div>
              </div>

              {/* Leadership & Base */}
              <div className="space-y-1.5 text-[11px] text-slate-300 mb-3">
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>Leader: <strong>{team.teamLeader}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono text-slate-300">{team.leaderContact}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-orange-400" />
                  <span className="truncate">Base: {team.baseLocationName}</span>
                </div>
              </div>

              {/* Equipment Highlights */}
              <div className="mb-3">
                <div className="text-[10px] text-slate-400 uppercase font-semibold mb-1">Assigned Equipment:</div>
                <div className="flex flex-wrap gap-1">
                  {team.equipmentSummary.map((eq, i) => (
                    <span key={i} className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded border border-slate-700">
                      {eq}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onViewOnMap(team)}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
                >
                  <Compass className="w-3.5 h-3.5 text-blue-400" />
                  <span>Map Location</span>
                </button>
              </div>

              {/* Quick status override */}
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Update Status:</span>
                <select
                  value={team.status}
                  onChange={(e) => onUpdateTeamStatus(team.id, e.target.value as TeamStatus)}
                  className="bg-slate-900 border border-slate-700 text-slate-200 rounded px-2 py-0.5 text-[11px] focus:outline-none"
                >
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="ASSIGNED">ASSIGNED</option>
                  <option value="EN_ROUTE">EN_ROUTE</option>
                  <option value="ON_SCENE">ON_SCENE</option>
                  <option value="RESTING">RESTING</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
