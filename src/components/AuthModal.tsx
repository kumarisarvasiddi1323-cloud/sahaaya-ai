import React, { useState } from 'react';
import { User, UserRole } from '../types/disaster';
import {
  ShieldAlert,
  UserCheck,
  KeyRound,
  Lock,
  CheckCircle2,
  X,
  FileCheck2,
  AlertCircle
} from 'lucide-react';

interface AuthModalProps {
  currentUser: User;
  allUsers: User[];
  isOpen: boolean;
  onClose: () => void;
  onSwitchUser: (userId: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  currentUser,
  allUsers,
  isOpen,
  onClose,
  onSwitchUser
}) => {
  const [selectedUserId, setSelectedUserId] = useState(currentUser.id);

  if (!isOpen) return null;

  const handleSwitch = (userId: string) => {
    setSelectedUserId(userId);
    onSwitchUser(userId);
    onClose();
  };

  const getRolePermissions = (role: UserRole) => {
    switch (role) {
      case 'INCIDENT_COMMANDER':
        return {
          signDispatches: 'AUTHORIZE & SIGN',
          createIncidents: 'FULL ACCESS',
          allocateResources: 'FULL CLEARANCE',
          auditLedger: 'ADMIN ACCESS'
        };
      case 'DISPATCH_OFFICER':
        return {
          signDispatches: 'AUTHORIZE & DISPATCH',
          createIncidents: 'FULL ACCESS',
          allocateResources: 'MUTUAL AID REQUEST',
          auditLedger: 'READ ONLY'
        };
      case 'FIELD_TEAM_LEADER':
        return {
          signDispatches: 'NO CLEARANCE',
          createIncidents: 'FIELD TELEMETRY',
          allocateResources: 'ON-SITE CONSUMPTION',
          auditLedger: 'NO CLEARANCE'
        };
      case 'LOGISTICS_CHIEF':
        return {
          signDispatches: 'RESOURCE VOUCHER ONLY',
          createIncidents: 'READ & STATUS',
          allocateResources: 'FULL DEPOT CONTROL',
          auditLedger: 'READ ONLY'
        };
      case 'AUDIT_OBSERVER':
        return {
          signDispatches: 'NO CLEARANCE (READ)',
          createIncidents: 'READ ONLY',
          allocateResources: 'INSPECTION ONLY',
          auditLedger: 'COMPLIANCE EXPORT'
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#111827] border border-slate-700 rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">SAHAAYA Identity & Access Control</h2>
              <p className="text-xs text-slate-400">Authorized Personnel Role Verification & Session Switcher</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Exclusive access warning banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 mb-5 text-xs text-slate-300">
          <div className="flex items-center gap-2 text-amber-400 font-bold mb-1">
            <Lock className="w-4 h-4" />
            <span>SECURE GOVERNMENT & EMERGENCY DISASTER ACCESS ONLY</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Per national SOPs, public and anonymous registration is disabled. All operations, dispatches, and location telemetry require an active badge token from an accredited disaster authority (NDRF, SDRF, Indian Navy ENC, Coast Guard, or DDMA).
          </p>
        </div>

        {/* User / Persona Selector */}
        <div className="space-y-3 mb-6">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Select Active Authorized Persona:
          </h3>

          <div className="space-y-2">
            {allUsers.map((user) => {
              const isSelected = user.id === currentUser.id;
              const perms = getRolePermissions(user.role);

              return (
                <div
                  key={user.id}
                  onClick={() => handleSwitch(user.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs ${
                    isSelected
                      ? 'bg-orange-950/20 border-orange-500/60 shadow-md shadow-orange-500/10'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <UserCheck className="w-5 h-5 text-slate-400" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{user.name}</span>
                        {isSelected && (
                          <span className="bg-orange-500 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded uppercase">
                            ACTIVE SESSION
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400">{user.organizationName}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono text-[10px] text-amber-400 bg-slate-950 px-1.5 py-0.2 rounded border border-slate-800">
                          BADGE: {user.badgeNumber}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">
                          {user.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0 md:self-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSwitch(user.id);
                      }}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors ${
                        isSelected
                          ? 'bg-orange-600 text-white shadow'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      {isSelected ? 'Current Sign-in' : 'Switch Identity'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Active Permissions Breakdown */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
          <div className="text-xs font-bold text-slate-200 mb-2 flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-emerald-400" />
            <span>Active Permissions for [{currentUser.role}]:</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] font-mono">
            {Object.entries(getRolePermissions(currentUser.role)).map(([key, val]) => (
              <div key={key} className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-500 uppercase block text-[9px]">{key.replace(/([A-Z])/g, ' $1')}</span>
                <span className="text-emerald-300 font-bold">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
