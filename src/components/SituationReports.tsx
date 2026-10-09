import React from 'react';
import { SituationReport, User } from '../types/disaster';
import {
  FileText,
  Printer,
  Sparkles,
  Download,
  Share2,
  CheckCircle2,
  Clock,
  Compass,
  Wind,
  ShieldCheck,
  Workflow
} from 'lucide-react';

interface SituationReportsProps {
  sitrep: SituationReport;
  currentUser: User;
  onTriggerN8nRelay: () => void;
}

export const SituationReports: React.FC<SituationReportsProps> = ({
  sitrep,
  currentUser,
  onTriggerN8nRelay
}) => {
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto text-slate-100">
      {/* Header with actions */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-orange-400 font-bold text-xs uppercase tracking-wider">
              OFFICIAL DISASTER SITREP
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400">National & State Disaster Management Authority Format</span>
          </div>
          <h2 className="text-2xl font-black text-white">{sitrep.title}</h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Reporting Period: <strong className="text-white font-mono">{sitrep.reportingPeriod}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            <Printer className="w-4 h-4 text-orange-400" />
            <span>Print Official SITREP</span>
          </button>

          <button
            onClick={onTriggerN8nRelay}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 transition-colors"
          >
            <Workflow className="w-4 h-4" />
            <span>Relay to State EOC via n8n</span>
          </button>
        </div>
      </div>

      {/* Main Official Document Layout */}
      <div className="bg-slate-900/95 border border-slate-700 rounded-2xl p-6 md:p-8 shadow-2xl space-y-6 text-xs text-slate-200 font-sans">
        {/* Document Header Seal */}
        <div className="text-center border-b border-slate-700 pb-5">
          <div className="text-[11px] font-bold text-orange-400 tracking-widest uppercase mb-1">
            GOVERNMENT OF ANDHRA PRADESH • STATE DISASTER MANAGEMENT AUTHORITY (AP-SDMA)
          </div>
          <h1 className="text-xl font-black text-white uppercase tracking-tight">
            JOINT EMERGENCY OPERATIONS SITUATION REPORT
          </h1>
          <div className="text-xs text-slate-400 mt-1 font-mono">
            Document No: <strong className="text-white">{sitrep.reportCode}</strong> | Date: 09-OCT-2026
          </div>
        </div>

        {/* 1. Executive Summary */}
        <div>
          <h3 className="text-sm font-black text-white uppercase tracking-wider mb-2 flex items-center gap-2 border-b border-slate-800 pb-1">
            <span>1. EXECUTIVE DISASTER SUMMARY</span>
          </h3>
          <p className="text-xs leading-relaxed text-slate-300 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            {sitrep.summary}
          </p>
        </div>

        {/* 2. Key Operational Metrics Matrix */}
        <div>
          <h3 className="text-sm font-black text-white uppercase tracking-wider mb-2 flex items-center gap-2 border-b border-slate-800 pb-1">
            <span>2. RESCUE & EVACUATION METRICS</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase block mb-1">Active Incidents</span>
              <span className="text-2xl font-black text-red-400 font-mono">{sitrep.keyMetrics.totalActiveIncidents}</span>
              <span className="text-[10px] text-red-300 block mt-0.5">({sitrep.keyMetrics.criticalS1Count} Critical S1)</span>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase block mb-1">Persons Rescued</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">{sitrep.keyMetrics.peopleRescued}</span>
              <span className="text-[10px] text-emerald-300 block mt-0.5">Safely Evacuated</span>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase block mb-1">Stranded Remaining</span>
              <span className="text-2xl font-black text-orange-400 font-mono">{sitrep.keyMetrics.peopleStrandedRemaining}</span>
              <span className="text-[10px] text-orange-300 block mt-0.5">Under Operations</span>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase block mb-1">Forces Deployed</span>
              <span className="text-2xl font-black text-blue-400 font-mono">{sitrep.keyMetrics.deployedTeamsCount} Units</span>
              <span className="text-[10px] text-blue-300 block mt-0.5">{sitrep.keyMetrics.boatsDeployed} Boats Active</span>
            </div>
          </div>
        </div>

        {/* 3. Agent A AI Strategic Insights */}
        <div>
          <h3 className="text-sm font-black text-white uppercase tracking-wider mb-2 flex items-center gap-2 border-b border-slate-800 pb-1">
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span>3. AGENT A TACTICAL & ORCHESTRATION ASSESSMENT</span>
          </h3>
          <div className="space-y-2 bg-slate-950/70 p-4 rounded-xl border border-orange-500/30">
            {sitrep.agentAInsights.map((insight, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                <span className="text-orange-400 font-bold font-mono">§{idx + 1}</span>
                <span className="leading-relaxed">{insight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Weather & Meteorological Synopsis */}
        <div>
          <h3 className="text-sm font-black text-white uppercase tracking-wider mb-2 flex items-center gap-2 border-b border-slate-800 pb-1">
            <Wind className="w-4 h-4 text-cyan-400" />
            <span>4. METEOROLOGICAL & TIDAL CONDITIONS</span>
          </h3>
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
            {sitrep.weatherSynopsis}
          </div>
        </div>

        {/* 5. Recommended Priority Focus Zones */}
        <div>
          <h3 className="text-sm font-black text-white uppercase tracking-wider mb-2 flex items-center gap-2 border-b border-slate-800 pb-1">
            <Compass className="w-4 h-4 text-red-400" />
            <span>5. MANDATORY THEATRE EVACUATION ZONES</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {sitrep.recommendedFocusZones.map((zone, idx) => (
              <div key={idx} className="p-3 bg-red-950/20 border border-red-500/30 rounded-xl text-red-200 font-semibold text-xs">
                {zone}
              </div>
            ))}
          </div>
        </div>

        {/* Signature & Seal Footer */}
        <div className="pt-6 border-t border-slate-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs font-mono">
          <div>
            <div className="text-slate-400 text-[10px]">VERIFIED BY INCIDENT COMMANDER:</div>
            <div className="font-bold text-white text-sm">{sitrep.approvedByCommander}</div>
            <div className="text-emerald-400 text-[10px] flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5" /> DIGITAL SIGNATURE HASH VERIFIED
            </div>
          </div>

          <div className="text-right text-[10px] text-slate-400">
            <div>TRANSMISSION ID: SEC-EOC-2026-9910</div>
            <div>COORDINATION NET: VISAKHAPATNAM UNIFIED DISASTER HUB</div>
          </div>
        </div>
      </div>
    </div>
  );
};
