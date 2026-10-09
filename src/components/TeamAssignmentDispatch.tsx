import React, { useState } from 'react';
import {
  DispatchApproval,
  RescueTeam,
  Incident,
  User
} from '../types/disaster';
import {
  Send,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Printer,
  Sparkles,
  ArrowRight,
  UserCheck,
  FileText,
  BadgeAlert
} from 'lucide-react';

interface TeamAssignmentDispatchProps {
  dispatchApprovals: DispatchApproval[];
  rescueTeams: RescueTeam[];
  incidents: Incident[];
  currentUser: User;
  onApproveDispatch: (dispatchId: string) => void;
  onRejectDispatch: (dispatchId: string, reason: string) => void;
  onTriggerAgentA: (incidentId?: string) => void;
}

export const TeamAssignmentDispatch: React.FC<TeamAssignmentDispatchProps> = ({
  dispatchApprovals,
  rescueTeams,
  incidents,
  currentUser,
  onApproveDispatch,
  onRejectDispatch,
  onTriggerAgentA
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [rejectionModalId, setRejectionModalId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [activeVoucher, setActiveVoucher] = useState<DispatchApproval | null>(null);

  const filteredApprovals = dispatchApprovals.filter((disp) => {
    if (filterStatus === 'ALL') return true;
    return disp.status === filterStatus;
  });

  const isAuthorizedToApprove =
    currentUser.role === 'INCIDENT_COMMANDER' || currentUser.role === 'DISPATCH_OFFICER';

  const handleConfirmReject = () => {
    if (!rejectionModalId) return;
    onRejectDispatch(rejectionModalId, rejectionReason || 'Coordinator selected alternative tactical staging.');
    setRejectionModalId(null);
    setRejectionReason('');
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto text-slate-100">
      {/* Header */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-amber-400 font-bold text-xs uppercase tracking-wider">
                HUMAN-IN-THE-LOOP SAFETY GATE
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-400">Section 10 Operational Compliance</span>
            </div>
            <h2 className="text-2xl font-black text-white">Team Assignment & Dispatch Authorization</h2>
            <p className="text-xs text-slate-300 mt-0.5">
              No rescue team is deployed without explicit digital signature and audit authorization from a designated Incident Commander or Dispatch Officer.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2 text-right">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Active Signatory:</div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5 justify-end">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{currentUser.name}</span>
              </div>
              <div className="text-[10px] font-mono text-orange-400">[{currentUser.role}]</div>
            </div>
          </div>
        </div>

        {/* Warning if current user lacks dispatch clearance */}
        {!isAuthorizedToApprove && (
          <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
            <BadgeAlert className="w-4 h-4 flex-shrink-0 text-amber-400" />
            <span>
              Your current role (<strong>{currentUser.role}</strong>) holds observation access only. Switch to <strong>Incident Commander</strong> or <strong>Dispatch Officer</strong> to authorize or reject dispatch orders.
            </span>
          </div>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-xs">
        <button
          onClick={() => setFilterStatus('ALL')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            filterStatus === 'ALL'
              ? 'bg-orange-600 text-white'
              : 'bg-slate-800/80 text-slate-400 hover:text-white'
          }`}
        >
          All Dispatch Orders ({dispatchApprovals.length})
        </button>
        <button
          onClick={() => setFilterStatus('PENDING_HUMAN_APPROVAL')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            filterStatus === 'PENDING_HUMAN_APPROVAL'
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'bg-slate-800/80 text-amber-300 hover:text-white'
          }`}
        >
          Pending Authorization ({dispatchApprovals.filter((d) => d.status === 'PENDING_HUMAN_APPROVAL').length})
        </button>
        <button
          onClick={() => setFilterStatus('APPROVED')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            filterStatus === 'APPROVED'
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-800/80 text-emerald-300 hover:text-white'
          }`}
        >
          Approved & Active ({dispatchApprovals.filter((d) => d.status === 'APPROVED').length})
        </button>
        <button
          onClick={() => setFilterStatus('REJECTED')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            filterStatus === 'REJECTED'
              ? 'bg-red-600 text-white'
              : 'bg-slate-800/80 text-red-300 hover:text-white'
          }`}
        >
          Rejected ({dispatchApprovals.filter((d) => d.status === 'REJECTED').length})
        </button>
      </div>

      {/* Dispatch Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredApprovals.map((approval) => {
          const isPending = approval.status === 'PENDING_HUMAN_APPROVAL';
          const isApproved = approval.status === 'APPROVED';
          const isRejected = approval.status === 'REJECTED';

          return (
            <div
              key={approval.id}
              className={`rounded-2xl border p-5 flex flex-col justify-between transition-all bg-[#111827]/90 shadow-xl ${
                isPending
                  ? 'border-amber-500/60 bg-gradient-to-b from-amber-950/20 to-[#111827]'
                  : isApproved
                  ? 'border-emerald-500/40 bg-gradient-to-b from-emerald-950/15 to-[#111827]'
                  : 'border-slate-800'
              }`}
            >
              <div>
                {/* Header bar */}
                <div className="flex items-center justify-between gap-3 mb-3 pb-2.5 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-400 text-sm">
                      {approval.dispatchOrderCode || approval.id}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      isPending
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                        : isApproved
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-red-500/20 text-red-300 border border-red-500/40'
                    }`}>
                      {approval.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                    Score: {approval.recommendationScore}% ({approval.confidencePercent}% Conf.)
                  </div>
                </div>

                {/* Target Incident & Selected Team */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                      TARGET INCIDENT:
                    </span>
                    <div className="font-mono font-bold text-orange-400 text-xs mb-0.5">
                      {approval.incidentCode}
                    </div>
                    <div className="font-bold text-white text-xs leading-snug">
                      {approval.incidentTitle}
                    </div>
                  </div>

                  <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                      ASSIGNED RESCUE UNIT:
                    </span>
                    <div className="font-mono font-bold text-blue-400 text-xs mb-0.5">
                      {approval.teamCallsign}
                    </div>
                    <div className="font-bold text-white text-xs leading-snug">
                      {approval.teamName}
                    </div>
                  </div>
                </div>

                {/* Agent A Recommendation Rationale */}
                <div className="bg-slate-900/80 rounded-xl p-3 mb-3 border border-slate-800/80 text-xs">
                  <div className="text-[10px] font-bold text-orange-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                    Agent 4 (Team Matching) Rationale:
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {approval.recommendedReason}
                  </p>
                </div>

                {/* Required Equipment & ETA */}
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-slate-950/60 rounded-xl p-3 mb-3 border border-slate-800">
                  <div>
                    <span className="text-slate-400 block text-[10px]">ESTIMATED ARRIVAL (ETA):</span>
                    <strong className="text-emerald-400 text-sm">{approval.etaMinutes} mins</strong> (Golden Hour)
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">RISK ASSESSMENT:</span>
                    <span className="text-amber-300 font-semibold">{approval.riskAssessment}</span>
                  </div>
                </div>

                {/* Required Resources List */}
                <div className="mb-4">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                    Required Equipment Manifest:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {approval.requiredResources.map((res, i) => (
                      <span key={i} className="bg-slate-800 text-slate-200 text-[10px] px-2 py-0.5 rounded border border-slate-700">
                        {res.name} (x{res.quantity})
                      </span>
                    ))}
                  </div>
                </div>

                {/* Approval metadata if already processed */}
                {isApproved && (
                  <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-3 mb-3 text-[11px] text-emerald-200">
                    <div className="font-bold flex items-center gap-1.5 mb-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      OFFICIAL DISPATCH AUTHORIZED
                    </div>
                    <div>Signatory: <strong>{approval.approvedByName}</strong></div>
                    <div className="text-slate-400 font-mono text-[10px]">
                      Timestamp: {new Date(approval.approvedAt || '').toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                    </div>
                  </div>
                )}

                {isRejected && (
                  <div className="bg-red-950/30 border border-red-500/30 rounded-xl p-3 mb-3 text-[11px] text-red-200">
                    <div className="font-bold flex items-center gap-1.5 mb-1">
                      <XCircle className="w-4 h-4 text-red-400" />
                      DISPATCH RECOMMENDATION DECLINED
                    </div>
                    <div>Reason: {approval.rejectionReason}</div>
                    <div className="text-slate-400 font-mono text-[10px]">Declined by {approval.approvedByName}</div>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
                {isPending ? (
                  <>
                    <button
                      onClick={() => onApproveDispatch(approval.id)}
                      disabled={!isAuthorizedToApprove}
                      className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg transition-all ${
                        isAuthorizedToApprove
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30 active:scale-95'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Sign & Authorize Dispatch</span>
                    </button>

                    <button
                      onClick={() => setRejectionModalId(approval.id)}
                      disabled={!isAuthorizedToApprove}
                      className={`py-2 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-1 border transition-colors ${
                        isAuthorizedToApprove
                          ? 'bg-slate-800 hover:bg-red-950 hover:text-red-300 text-slate-300 border-slate-700'
                          : 'bg-slate-800 text-slate-500 border-slate-800 cursor-not-allowed'
                      }`}
                    >
                      <span>Decline</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setActiveVoucher(approval)}
                    className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors"
                  >
                    <Printer className="w-4 h-4 text-orange-400" />
                    <span>View Official Dispatch Voucher & Radio Slip</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Rejection Modal */}
      {rejectionModalId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl text-slate-100">
            <h3 className="font-extrabold text-base text-white mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Operational Rejection Protocol
            </h3>
            <p className="text-xs text-slate-300 mb-4">
              Enter mandatory justification note for audit logging before declining Agent A recommendation.
            </p>

            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Unit currently reserved for critical hospital backup; alternative SDRF boat assigned."
              className="w-full h-24 p-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-red-500 mb-4"
            />

            <div className="flex items-center gap-2 justify-end">
              <button
                onClick={() => setRejectionModalId(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
              >
                Confirm Decline & Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Voucher Print Modal */}
      {activeVoucher && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-lg w-full shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-400" />
                <span className="font-mono font-bold text-white text-sm">
                  {activeVoucher.dispatchOrderCode}
                </span>
              </div>
              <button
                onClick={() => setActiveVoucher(null)}
                className="text-slate-400 hover:text-white text-base"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono">
              <div className="text-center font-bold text-orange-400 border-b border-slate-800 pb-2">
                GOVERNMENT OF ANDHRA PRADESH / NDRF UNIFIED EOC
                <div className="text-[10px] text-slate-400 font-normal">EMERGENCY TACTICAL DISPATCH SLIP</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>DISPATCH ORDER: <strong className="text-white">{activeVoucher.dispatchOrderCode}</strong></div>
                <div>DATE: <span className="text-slate-300">{new Date().toLocaleDateString('en-IN')}</span></div>
                <div>INCIDENT REF: <span className="text-orange-300">{activeVoucher.incidentCode}</span></div>
                <div>UNIT CALLSIGN: <span className="text-blue-300">{activeVoucher.teamCallsign}</span></div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <div className="text-slate-400 text-[10px]">MISSION LOCATION:</div>
                <div className="text-white font-semibold">{activeVoucher.incidentTitle}</div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <div className="text-slate-400 text-[10px]">AUTHORIZED SIGNATURE:</div>
                <div className="text-emerald-400 font-bold">{activeVoucher.approvedByName || 'Incident Commander'}</div>
                <div className="text-[9px] text-slate-500">DIGITALLY SIGNED VIA SAHAAYA EOC CONSOLE</div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
