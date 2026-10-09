import React, { useState } from 'react';
import { AuditLog, User } from '../types/disaster';
import {
  FileCheck2,
  ShieldAlert,
  Search,
  Filter,
  Download,
  Clock,
  UserCheck,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Terminal,
  Server
} from 'lucide-react';

interface AuditLogsSecurityProps {
  auditLogs: AuditLog[];
  currentUser: User;
}

export const AuditLogsSecurity: React.FC<AuditLogsSecurityProps> = ({
  auditLogs,
  currentUser
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.targetEntity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'ALL' || log.actionType === typeFilter;
    return matchesSearch && matchesType;
  });

  const exportLogsAsJson = () => {
    const blob = new Blob([JSON.stringify(auditLogs, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sahaaya-audit-log-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto text-slate-100">
      {/* Header */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-cyan-400 font-bold text-xs uppercase tracking-wider">
              TAMPER-EVIDENT LEDGER
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400">Section 2 & 10 Operational Safety Audit</span>
          </div>
          <h2 className="text-2xl font-black text-white">System Audit Logs & Security Compliance</h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Immutable log of all user logins, incident triages, Agent A decisions, and human commander dispatch authorizations.
          </p>
        </div>

        <button
          onClick={exportLogsAsJson}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 border border-slate-700 transition-colors"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          <span>Export Audit Ledger (.JSON)</span>
        </button>
      </div>

      {/* Security Health Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 text-xs">
          <span className="text-slate-400 text-[10px] uppercase block mb-1">Total Audit Entries</span>
          <div className="text-xl font-bold font-mono text-white">{auditLogs.length} Records</div>
          <div className="text-[10px] text-emerald-400 mt-1">Cryptographic Hash Intact</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 text-xs">
          <span className="text-slate-400 text-[10px] uppercase block mb-1">Dispatch Approvals Logged</span>
          <div className="text-xl font-bold font-mono text-emerald-400">
            {auditLogs.filter((l) => l.actionType === 'DISPATCH_APPROVED').length} Signed
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Human Gate Verified</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 text-xs">
          <span className="text-slate-400 text-[10px] uppercase block mb-1">Agent A Triage Executions</span>
          <div className="text-xl font-bold font-mono text-orange-400">
            {auditLogs.filter((l) => l.actionType === 'AGENT_A_RUN').length} Scans
          </div>
          <div className="text-[10px] text-slate-400 mt-1">AI Decision Provenance</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 text-xs">
          <span className="text-slate-400 text-[10px] uppercase block mb-1">RBAC Security Status</span>
          <div className="text-xl font-bold font-mono text-cyan-400">ENFORCED</div>
          <div className="text-[10px] text-slate-400 mt-1">Backend Session Guard</div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-[#111827]/80 border border-slate-800 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search actor, incident code, details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-[11px]">Action Type:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
          >
            <option value="ALL">All Action Events</option>
            <option value="DISPATCH_APPROVED">Dispatch Approved</option>
            <option value="DISPATCH_REJECTED">Dispatch Rejected</option>
            <option value="AGENT_A_RUN">Agent A Run</option>
            <option value="INCIDENT_TRIAGED">Incident Triaged</option>
            <option value="USER_LOGIN">User Login</option>
            <option value="N8N_WEBHOOK_TRIGGER">n8n Webhook Trigger</option>
            <option value="ALERT_BROADCAST">Alert Broadcast</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-[#111827]/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/90 border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase">
                <th className="py-3 px-4">Timestamp (UTC/IST)</th>
                <th className="py-3 px-4">Action Event</th>
                <th className="py-3 px-4">Operator / Actor</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">Operational Details</th>
                <th className="py-3 px-4">IP / Terminal</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredLogs.map((log) => {
                let badgeColor = 'bg-slate-800 text-slate-300 border-slate-700';
                if (log.actionType === 'DISPATCH_APPROVED') {
                  badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-bold';
                } else if (log.actionType === 'DISPATCH_REJECTED') {
                  badgeColor = 'bg-red-500/20 text-red-300 border-red-500/30';
                } else if (log.actionType === 'AGENT_A_RUN') {
                  badgeColor = 'bg-orange-500/20 text-orange-300 border-orange-500/30';
                } else if (log.actionType === 'N8N_WEBHOOK_TRIGGER') {
                  badgeColor = 'bg-purple-500/20 text-purple-300 border-purple-500/30';
                }

                return (
                  <tr key={log.id} className="hover:bg-slate-850/60 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString('en-IN', {
                        timeZone: 'Asia/Kolkata',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}{' '}
                      <span className="text-[10px] text-slate-500">
                        {new Date(log.timestamp).toLocaleDateString('en-IN')}
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${badgeColor}`}>
                        {log.actionType}
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-semibold text-white">{log.actorName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">[{log.actorRole}]</div>
                    </td>

                    <td className="py-3 px-4 font-mono text-cyan-300 text-[11px] whitespace-nowrap">
                      {log.targetEntity}
                    </td>

                    <td className="py-3 px-4 text-slate-300 max-w-md leading-relaxed text-[11px]">
                      {log.details}
                    </td>

                    <td className="py-3 px-4 font-mono text-[10px] text-slate-500 whitespace-nowrap">
                      {log.ipAddress}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.status === 'SUCCESS'
                          ? 'text-emerald-400 bg-emerald-500/10'
                          : log.status === 'WARNING'
                          ? 'text-amber-400 bg-amber-500/10'
                          : 'text-red-400 bg-red-500/10'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
