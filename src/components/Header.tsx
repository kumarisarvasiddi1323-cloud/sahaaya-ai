import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Radio,
  Clock,
  UserCheck,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  LogOut,
  ChevronDown,
  Layers,
  MapPin,
  Flame,
  Volume2
} from 'lucide-react';
import { User } from '../types/disaster';

interface HeaderProps {
  currentUser: User;
  onOpenAuthModal: () => void;
  onOpenAgentA: () => void;
  criticalIncidentCount: number;
  pendingDispatchCount: number;
  onRefreshData: () => void;
  isRefreshing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onOpenAuthModal,
  onOpenAgentA,
  criticalIncidentCount,
  pendingDispatchCount,
  onRefreshData,
  isRefreshing
}) => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }) + ' IST'
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'INCIDENT_COMMANDER':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'DISPATCH_OFFICER':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'FIELD_TEAM_LEADER':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      case 'LOGISTICS_CHIEF':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      default:
        return 'bg-purple-500/20 text-purple-400 border-purple-500/40';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0d1527] border-b border-slate-800 text-slate-100 shadow-sm">
      {/* Official Status Strip */}
      <div className="bg-[#090e1a] border-b border-slate-800/80 px-4 py-1 text-xs flex items-center justify-between text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
          <span className="font-medium text-slate-300">National Emergency Operations Grid</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Visakhapatnam Unified Command (GVMC Sector)</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-mono">
          <span className="text-slate-400">Tactical Comms: <strong className="text-emerald-400 font-semibold">Active</strong></span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300 flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            {time || '10:00:00 IST'}
          </span>
        </div>
      </div>

      {/* Main Command Bar */}
      <div className="px-4 py-2.5 flex items-center justify-between">
        {/* Logo & Operational ID */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold shadow-sm">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white">SAHAAYA AI</span>
              <span className="px-1.5 py-0.2 text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700 rounded uppercase">
                Operations Platform
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Disaster Response & Multi-Agency Rescue Coordination
            </p>
          </div>
        </div>

        {/* Central Summary Badges */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700/80 text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span className="text-slate-300 font-medium">Critical Incidents:</span>
            <strong className="text-white font-mono">{criticalIncidentCount}</strong>
          </div>

          <div className="px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700/80 text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span className="text-slate-300 font-medium">Pending Approvals:</span>
            <strong className="text-white font-mono">{pendingDispatchCount}</strong>
          </div>

          <button
            onClick={onOpenAgentA}
            className="px-3 py-1 rounded-lg bg-orange-600/15 hover:bg-orange-600/25 border border-orange-500/40 text-orange-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>Google ADK Orchestrator</span>
          </button>
        </div>

        {/* Right Action & User Profile */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onRefreshData}
            disabled={isRefreshing}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs transition-colors cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-orange-400' : ''}`} />
          </button>

          <button
            onClick={onOpenAuthModal}
            className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-left transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center overflow-hidden flex-shrink-0">
              {currentUser.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
              ) : (
                <UserCheck className="w-3.5 h-3.5 text-slate-300" />
              )}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold text-white leading-tight flex items-center gap-1">
                {currentUser.name}
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                {currentUser.role.replace(/_/g, ' ')}
              </div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
