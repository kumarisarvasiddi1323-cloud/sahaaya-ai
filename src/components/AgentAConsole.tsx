import React, { useState, useEffect } from 'react';
import {
  AgentASubAgentStatus,
  User,
  Incident,
  RegisteredAgent,
  OrchestrationResult,
  OrchestratorTraceStep
} from '../types/disaster';
import { INITIAL_REGISTERED_AGENTS } from '../data/mockDisasterData';
import {
  Bot,
  BrainCircuit,
  Cpu,
  Layers,
  Send,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Terminal,
  ShieldCheck,
  Zap,
  ArrowRight,
  Activity,
  Workflow,
  Radio,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Check,
  PlayCircle
} from 'lucide-react';

interface AgentAConsoleProps {
  subAgents: AgentASubAgentStatus[];
  incidents: Incident[];
  currentUser: User;
  onNavigateToDispatch: () => void;
  onRefreshData?: () => void;
}

export const AgentAConsole: React.FC<AgentAConsoleProps> = ({
  incidents,
  currentUser,
  onNavigateToDispatch,
  onRefreshData
}) => {
  const [registeredAgents, setRegisteredAgents] = useState<RegisteredAgent[]>(INITIAL_REGISTERED_AGENTS);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(incidents[0]?.id || '');
  const [customScenario, setCustomScenario] = useState('');
  const [isRunningPipeline, setIsRunningPipeline] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);
  const [orchestrationResult, setOrchestrationResult] = useState<OrchestrationResult | null>(null);
  const [selectedAgentDetails, setSelectedAgentDetails] = useState<RegisteredAgent | null>(null);
  const [pingingKey, setPingingKey] = useState<string | null>(null);
  const [pingNotice, setPingNotice] = useState<string | null>(null);

  // Fetch registered agents from backend
  const fetchAgents = async () => {
    try {
      const res = await fetch('/api/orchestrator/agents');
      const data = await res.json();
      if (data.agents && data.agents.length > 0) {
        setRegisteredAgents(data.agents);
      }
    } catch {
      // Fallback already in state
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  // Ping / test a single registered agent
  const handlePingAgent = async (agentKey: string) => {
    setPingingKey(agentKey);
    setPingNotice(null);
    try {
      const res = await fetch(`/api/orchestrator/agents/${agentKey}/ping`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (data.success) {
        setPingNotice(`Agent '${agentKey}' heartbeat verified: OK`);
        fetchAgents();
      }
    } catch {
      setPingNotice(`Agent '${agentKey}' heartbeat check completed.`);
    } finally {
      setPingingKey(null);
      setTimeout(() => setPingNotice(null), 3500);
    }
  };

  // Run full Google ADK Orchestrated Pipeline coordinating the 5 registered agents
  const handleRunADKPipeline = async () => {
    setIsRunningPipeline(true);
    setOrchestrationResult(null);
    setActiveStepIndex(0);

    // Step animation for presentation impact
    const interval = setInterval(() => {
      setActiveStepIndex((prev) => {
        if (prev < 4) return prev + 1;
        clearInterval(interval);
        return 4;
      });
    }, 450);

    try {
      const res = await fetch('/api/orchestrator/run-adk-pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incidentId: selectedIncidentId,
          query: customScenario || undefined
        })
      });
      const data = await res.json();
      if (data.result) {
        setOrchestrationResult(data.result);
        fetchAgents();
        if (onRefreshData) onRefreshData();
      }
    } catch (err) {
      console.error('Error running ADK pipeline:', err);
    } finally {
      clearInterval(interval);
      setActiveStepIndex(5);
      setIsRunningPipeline(false);
    }
  };

  const targetIncident = incidents.find((i) => i.id === selectedIncidentId) || incidents[0];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto text-slate-100">
      {/* Orchestrator Master Header */}
      <div className="bg-gradient-to-r from-[#0b132b] via-[#1c2541] to-[#0f172a] border border-orange-500/40 rounded-2xl p-5 md:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded text-[11px] font-black bg-orange-600 text-white tracking-widest uppercase flex items-center gap-1.5 shadow">
                <BrainCircuit className="w-3.5 h-3.5" /> GOOGLE ADK ORCHESTRATOR
              </span>
              <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/80 border border-cyan-800 px-2.5 py-1 rounded">
                SDK: @google/genai (v2.4.0)
              </span>
              <span className="text-[11px] font-mono text-emerald-300 bg-emerald-950/80 border border-emerald-800 px-2.5 py-1 rounded flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                5 REGISTERED SUB-AGENTS BOUND
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Master Orchestrator Agent
            </h1>
            <p className="text-xs md:text-sm text-slate-300 mt-1.5 max-w-3xl leading-relaxed">
              Coordinates 5 specialized sub-agents via the Google Agent Development Kit (ADK) and n8n webhooks. 
              Translates real-time disaster reports into verified dispatch packages with human-in-the-loop commander safety gates.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleRunADKPipeline}
              disabled={isRunningPipeline}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs md:text-sm font-bold flex items-center gap-2.5 shadow-xl shadow-orange-600/30 border border-orange-400/50 transition-all active:scale-95 cursor-pointer disabled:opacity-60"
            >
              <Sparkles className={`w-4 h-4 ${isRunningPipeline ? 'animate-spin' : ''}`} />
              <span>{isRunningPipeline ? 'Coordinating Multi-Agent Pipeline...' : 'Run Google ADK Pipeline'}</span>
            </button>
          </div>
        </div>

        {pingNotice && (
          <div className="mt-4 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{pingNotice}</span>
          </div>
        )}
      </div>

      {/* Visual Multi-Agent Architecture Coordination Flow */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Workflow className="w-4 h-4 text-orange-400" />
            <h2 className="text-sm font-bold text-white tracking-wide uppercase">
              Google ADK Multi-Agent Coordination Topology
            </h2>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Parallel Tool Invocations &bull; Orchestrator-Supervised
          </span>
        </div>

        {/* 5-Agent Interactive Pipeline Nodes */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {registeredAgents.map((agent, index) => {
            const isExecuting = isRunningPipeline && activeStepIndex === index;
            const isCompleted = isRunningPipeline ? activeStepIndex > index : orchestrationResult !== null;

            return (
              <div
                key={agent.id}
                onClick={() => setSelectedAgentDetails(agent)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                  isExecuting
                    ? 'bg-orange-950/40 border-orange-500 ring-2 ring-orange-500/40 shadow-lg shadow-orange-500/20'
                    : isCompleted
                    ? 'bg-emerald-950/20 border-emerald-600/50'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-slate-400">STEP 0{index + 1}</span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono ${
                      agent.status === 'N8N_CONNECTED'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {agent.status}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Cpu className="w-3 h-3 text-orange-400" />
                  {agent.name}
                </h3>
                <p className="text-[11px] font-mono text-cyan-300 mt-1 truncate">
                  {agent.adkToolName}()
                </p>
                <p className="text-[10px] text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                  {agent.role}
                </p>

                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Executions: {agent.executionCount}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePingAgent(agent.key);
                    }}
                    disabled={pingingKey === agent.key}
                    className="text-orange-400 hover:text-orange-300 font-bold underline cursor-pointer"
                  >
                    {pingingKey === agent.key ? 'Pinging...' : 'Ping n8n'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Target Incident & Pipeline Trigger Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Input Selection */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-orange-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wide">
              Target Disaster Context
            </h2>
          </div>

          <div>
            <label className="text-xs text-slate-300 font-semibold mb-1 block">
              Select Active Incident for Coordination:
            </label>
            <select
              value={selectedIncidentId}
              onChange={(e) => setSelectedIncidentId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
            >
              {incidents.map((inc) => (
                <option key={inc.id} value={inc.id}>
                  {inc.incidentCode} — {inc.title} ({inc.severity})
                </option>
              ))}
            </select>
          </div>

          {targetIncident && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Location:</span>
                <span className="font-semibold text-white">{targetIncident.locationName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Severity:</span>
                <span className="font-mono font-bold text-red-400">{targetIncident.severity}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Estimated Stranded:</span>
                <span className="font-semibold text-amber-300">{targetIncident.estimatedVictimsStranded} people</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Flood Inundation Depth:</span>
                <span className="font-mono text-cyan-300">{targetIncident.waterDepthMeters}m</span>
              </div>
            </div>
          )}

          <div>
            <label className="text-xs text-slate-300 font-semibold mb-1 block">
              Optional Tactical Directives:
            </label>
            <input
              type="text"
              placeholder="e.g. Prioritize pediatric evacuation and check hospital generators"
              value={customScenario}
              onChange={(e) => setCustomScenario(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          <button
            onClick={handleRunADKPipeline}
            disabled={isRunningPipeline}
            className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <PlayCircle className="w-4 h-4" />
            <span>{isRunningPipeline ? 'Executing Google ADK Pipeline...' : 'Run Pipeline on Target'}</span>
          </button>
        </div>

        {/* Right: Live Execution Trace & Synthesized Output */}
        <div className="lg:col-span-2 bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-bold text-white tracking-wide uppercase">
                  Google ADK Live Execution Trace
                </h2>
              </div>
              {orchestrationResult && (
                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                  <span className="text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
                    {orchestrationResult.engine}
                  </span>
                  <span>Latency: {orchestrationResult.latencyTotalMs}ms</span>
                </div>
              )}
            </div>

            {/* Trace Steps List */}
            {orchestrationResult ? (
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {orchestrationResult.traceSteps.map((step) => (
                  <div
                    key={step.step}
                    className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/90 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-[10px]">
                          {step.step}
                        </span>
                        <span className="font-bold text-white">{step.agentName}</span>
                        <span className="font-mono text-[10px] text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded">
                          {step.toolInvoked}()
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400">{step.latencyMs}ms</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] font-mono bg-black/40 p-2 rounded-lg border border-slate-800">
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase">Payload Dispatched:</span>
                        <span className="text-slate-300 break-all">{JSON.stringify(step.payloadSent)}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase">Agent Response:</span>
                        <span className="text-emerald-300 break-all">{JSON.stringify(step.responseReceived)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs">
                <BrainCircuit className="w-8 h-8 text-slate-600 mx-auto mb-2 animate-pulse" />
                <p>Click &quot;Run Google ADK Pipeline&quot; above to coordinate the 5 agents.</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Orchestrator will query Incident, Resource, Route, Response, and Monitor agents in sequence.
                </p>
              </div>
            )}
          </div>

          {/* Coordinated Recommendation Box */}
          {orchestrationResult && (
            <div className="mt-4 pt-4 border-t border-slate-800 bg-gradient-to-r from-orange-950/20 to-slate-900 p-4 rounded-xl border border-orange-500/30">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5 text-orange-400 text-[11px] font-bold uppercase tracking-wider mb-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Validated Mission Dispatch Formulated</span>
                  </div>
                  <h4 className="text-sm font-black text-white">
                    Deploy {orchestrationResult.coordinatedRecommendation.matchedTeamCallsign} &bull; Order {orchestrationResult.coordinatedRecommendation.dispatchOrderCode}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Safe Corridor: {orchestrationResult.coordinatedRecommendation.safeRouteCorridor} (ETA: {orchestrationResult.coordinatedRecommendation.etaMinutes} mins)
                  </p>
                </div>

                <button
                  onClick={onNavigateToDispatch}
                  className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer whitespace-nowrap active:scale-95"
                >
                  <span>Authorize in Safety Gate</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 5 Registered Agents Detail Table */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-orange-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wide">
              The 5 Registered Sub-Agents (Google ADK & n8n Bridge)
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Registered with Google ADK Master Orchestrator
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="pb-3 font-semibold">AGENT NAME</th>
                <th className="pb-3 font-semibold">ADK TOOL BINDING</th>
                <th className="pb-3 font-semibold">ROLE & SCOPE</th>
                <th className="pb-3 font-semibold">n8n WEBHOOK ENDPOINT</th>
                <th className="pb-3 font-semibold">STATUS</th>
                <th className="pb-3 font-semibold text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {registeredAgents.map((agent) => (
                <tr key={agent.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3 font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-400" />
                    {agent.name}
                  </td>
                  <td className="py-3 font-mono text-cyan-300">
                    {agent.adkToolName}()
                  </td>
                  <td className="py-3 text-slate-300 max-w-xs truncate">
                    {agent.role}
                  </td>
                  <td className="py-3 font-mono text-[11px] text-slate-400 max-w-xs truncate">
                    {agent.n8nWebhookUrl}
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {agent.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => handlePingAgent(agent.key)}
                      disabled={pingingKey === agent.key}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-orange-400 text-[11px] font-bold border border-slate-700 cursor-pointer disabled:opacity-50"
                    >
                      {pingingKey === agent.key ? 'Testing...' : 'Test n8n Ping'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal / Inspector for Agent Schema */}
      {selectedAgentDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111827] border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-orange-400" />
                <h3 className="text-base font-bold text-white">{selectedAgentDetails.name}</h3>
              </div>
              <button
                onClick={() => setSelectedAgentDetails(null)}
                className="text-slate-400 hover:text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block font-semibold mb-1">Google ADK Tool Declaration:</span>
                <code className="block bg-slate-950 p-2.5 rounded-lg text-cyan-300 font-mono text-[11px]">
                  {selectedAgentDetails.adkToolName}(parameters)
                </code>
              </div>

              <div>
                <span className="text-slate-400 block font-semibold mb-1">Capabilities:</span>
                <ul className="list-disc list-inside text-slate-300 space-y-1">
                  {selectedAgentDetails.capabilities.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-slate-400 block font-semibold mb-1">Sample Tool Payload:</span>
                <pre className="bg-slate-950 p-2.5 rounded-lg text-emerald-300 font-mono text-[10px] overflow-x-auto">
                  {JSON.stringify(selectedAgentDetails.samplePayload, null, 2)}
                </pre>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => {
                  handlePingAgent(selectedAgentDetails.key);
                  setSelectedAgentDetails(null);
                }}
                className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs cursor-pointer"
              >
                Test Ping Agent
              </button>
              <button
                onClick={() => setSelectedAgentDetails(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
