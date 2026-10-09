import React, { useState, useEffect } from 'react';
import { User, RegisteredAgent } from '../types/disaster';
import { INITIAL_REGISTERED_AGENTS } from '../data/mockDisasterData';
import {
  Workflow,
  Copy,
  Check,
  Play,
  Download,
  Terminal,
  ExternalLink,
  Zap,
  Code,
  CheckCircle2,
  Radio,
  Clock,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  BookOpen
} from 'lucide-react';

interface N8NIntegrationHubProps {
  currentUser: User;
}

export const N8NIntegrationHub: React.FC<N8NIntegrationHubProps> = ({ currentUser }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [agents, setAgents] = useState<RegisteredAgent[]>(INITIAL_REGISTERED_AGENTS);
  const [expandedAgentKey, setExpandedAgentKey] = useState<string>('incident');
  const [testingKey, setTestingKey] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'AGENTS' | 'WORKFLOW_JSON' | 'TUTORIAL'>('AGENTS');

  const hostUrl = typeof window !== 'undefined' ? window.location.origin : '';

  // Fetch agents from orchestrator API
  const fetchAgents = async () => {
    try {
      const res = await fetch('/api/orchestrator/agents');
      const data = await res.json();
      if (data.agents && data.agents.length > 0) {
        setAgents(data.agents);
      }
    } catch {
      // Use initial state
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleUpdateWebhookUrl = async (agentKey: string, newUrl: string) => {
    try {
      const res = await fetch(`/api/orchestrator/agents/${agentKey}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ n8nWebhookUrl: newUrl })
      });
      const data = await res.json();
      if (data.success) {
        fetchAgents();
      }
    } catch (err) {
      console.error('Error updating webhook URL:', err);
    }
  };

  const handleTestAgentWebhook = async (agentKey: string) => {
    setTestingKey(agentKey);
    setTestResult(null);
    try {
      const res = await fetch(`/api/orchestrator/agents/${agentKey}/ping`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      setTestResult({ agentKey, data });
      fetchAgents();
    } catch (err) {
      console.error('Error testing webhook:', err);
    } finally {
      setTestingKey(null);
    }
  };

  // Complete n8n Workflow Blueprint with nodes for the 5 agents
  const completeN8NWorkflowJSON = JSON.stringify(
    {
      name: 'SAHAAYA AI — 5 Agents Multi-Agent Disaster Response Pipeline',
      nodes: [
        {
          parameters: {
            httpMethod: 'POST',
            path: 'incident-agent',
            responseMode: 'onReceived',
            options: {}
          },
          name: 'Webhook: 1. Incident Agent',
          type: 'n8n-nodes-base.webhook',
          typeVersion: 1,
          position: [180, 200]
        },
        {
          parameters: {
            httpMethod: 'POST',
            path: 'resource-agent',
            responseMode: 'onReceived',
            options: {}
          },
          name: 'Webhook: 2. Resource Agent',
          type: 'n8n-nodes-base.webhook',
          typeVersion: 1,
          position: [180, 380]
        },
        {
          parameters: {
            httpMethod: 'POST',
            path: 'route-agent',
            responseMode: 'onReceived',
            options: {}
          },
          name: 'Webhook: 3. Route Agent',
          type: 'n8n-nodes-base.webhook',
          typeVersion: 1,
          position: [180, 560]
        },
        {
          parameters: {
            httpMethod: 'POST',
            path: 'response-agent',
            responseMode: 'onReceived',
            options: {}
          },
          name: 'Webhook: 4. Response Agent',
          type: 'n8n-nodes-base.webhook',
          typeVersion: 1,
          position: [180, 740]
        },
        {
          parameters: {
            httpMethod: 'POST',
            path: 'monitor-agent',
            responseMode: 'onReceived',
            options: {}
          },
          name: 'Webhook: 5. Monitor Agent',
          type: 'n8n-nodes-base.webhook',
          typeVersion: 1,
          position: [180, 920]
        },
        {
          parameters: {
            method: 'POST',
            url: `${hostUrl}/api/orchestrator/run-adk-pipeline`,
            sendBody: true,
            specifyBody: 'json',
            jsonBody: '={"source":"n8n_master_trigger","executedAt":"{{$now}}"}',
            options: {}
          },
          name: 'HTTP: Sync with Google ADK Orchestrator',
          type: 'n8n-nodes-base.httpRequest',
          typeVersion: 4,
          position: [560, 560]
        }
      ],
      connections: {
        'Webhook: 1. Incident Agent': {
          main: [[{ node: 'HTTP: Sync with Google ADK Orchestrator', type: 'main', index: 0 }]]
        },
        'Webhook: 2. Resource Agent': {
          main: [[{ node: 'HTTP: Sync with Google ADK Orchestrator', type: 'main', index: 0 }]]
        },
        'Webhook: 3. Route Agent': {
          main: [[{ node: 'HTTP: Sync with Google ADK Orchestrator', type: 'main', index: 0 }]]
        },
        'Webhook: 4. Response Agent': {
          main: [[{ node: 'HTTP: Sync with Google ADK Orchestrator', type: 'main', index: 0 }]]
        },
        'Webhook: 5. Monitor Agent': {
          main: [[{ node: 'HTTP: Sync with Google ADK Orchestrator', type: 'main', index: 0 }]]
        }
      }
    },
    null,
    2
  );

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto text-slate-100">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0b132b] via-[#1c2541] to-[#0f172a] border border-emerald-500/40 rounded-2xl p-5 md:p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-black bg-emerald-600 text-white tracking-widest uppercase flex items-center gap-1.5 shadow">
                <Workflow className="w-3.5 h-3.5" /> n8n INTEGRATION BRIDGE
              </span>
              <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/80 border border-cyan-800 px-2 py-0.5 rounded">
                GOOGLE ADK COORDINATED
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              n8n Multi-Agent Integration Hub
            </h1>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Connect the 5 disaster rescue agents you built in n8n (Incident, Resource, Route, Response, and Monitor) 
              with SAHAAYA AI&apos;s Google ADK Orchestrator. Supports bidirectional webhooks, live payload testing, and pre-built workflow templates.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('TUTORIAL')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'TUTORIAL'
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              How It Works
            </button>
            <button
              onClick={() => setActiveTab('AGENTS')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'AGENTS'
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              The 5 Agents
            </button>
            <button
              onClick={() => setActiveTab('WORKFLOW_JSON')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'WORKFLOW_JSON'
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              n8n Workflow JSON
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: How to Integrate (Step-by-step tutorial answering the user's "then how i integrated") */}
      {activeTab === 'TUTORIAL' && (
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              How Your 5 n8n Agents Integrate with Google ADK Orchestrator
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="w-7 h-7 rounded-lg bg-orange-500/20 text-orange-400 font-bold text-xs flex items-center justify-center">
                01
              </span>
              <h3 className="text-xs font-bold text-white">Create Webhook in n8n</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                In your n8n workflow canvas, create a Webhook Trigger node for each agent:
                <br />
                <code className="text-cyan-300 font-mono text-[10px]">/webhook/incident-agent</code>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 font-bold text-xs flex items-center justify-center">
                02
              </span>
              <h3 className="text-xs font-bold text-white">Register Webhook URLs</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Paste each webhook URL into the 5 Agent cards in the &quot;The 5 Agents&quot; tab. Click &quot;Test Ping&quot; to verify the heartbeat.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center">
                03
              </span>
              <h3 className="text-xs font-bold text-white">Google ADK Coordinates</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                When a disaster occurs, Google ADK queries your n8n agent webhooks in parallel (Incident, Resource, Route, Response, Monitor).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 font-bold text-xs flex items-center justify-center">
                04
              </span>
              <h3 className="text-xs font-bold text-white">Human Safety Gate</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                The synthesized output creates a real Dispatch Order on the map and queues it for the human Commander to digitally sign.
              </p>
            </div>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              Two Flexible Integration Modes
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="p-3 rounded-lg bg-black/40 border border-slate-800">
                <span className="font-bold text-emerald-400 block mb-1">Mode 1: Outbound from n8n ➔ SAHAAYA AI</span>
                <p className="text-slate-400 text-[11px]">
                  Your n8n agents can push directly to SAHAAYA AI REST endpoints anytime:
                  <br />
                  <code className="text-cyan-300 font-mono text-[10px] block mt-1">POST {hostUrl}/api/agents/incident</code>
                  <code className="text-cyan-300 font-mono text-[10px] block">POST {hostUrl}/api/agents/response</code>
                </p>
              </div>
              <div className="p-3 rounded-lg bg-black/40 border border-slate-800">
                <span className="font-bold text-cyan-400 block mb-1">Mode 2: Google ADK Orchestrator ➔ n8n Webhooks</span>
                <p className="text-slate-400 text-[11px]">
                  When you click &quot;Run Google ADK Pipeline&quot;, SAHAAYA AI sends tactical payloads to your n8n webhooks and incorporates their response into the live operations dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: The 5 Agents Configuration Cards */}
      {activeTab === 'AGENTS' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {agents.map((agent) => {
              const isExpanded = expandedAgentKey === agent.key;
              return (
                <div
                  key={agent.id}
                  className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden shadow-xl"
                >
                  <div
                    onClick={() => setExpandedAgentKey(isExpanded ? '' : agent.key)}
                    className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer hover:bg-slate-900/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 font-bold">
                        <Cpu className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-white">{agent.name}</h3>
                          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.2 rounded">
                            {agent.adkToolName}()
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{agent.role}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end md:self-auto">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {agent.status}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTestAgentWebhook(agent.key);
                        }}
                        disabled={testingKey === agent.key}
                        className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs cursor-pointer disabled:opacity-50"
                      >
                        {testingKey === agent.key ? 'Testing...' : 'Test Webhook'}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-5 border-t border-slate-800/80 bg-slate-900/40 space-y-4 text-xs">
                      {/* Webhook Configuration Input */}
                      <div>
                        <label className="text-slate-300 font-semibold mb-1 block">
                          Your n8n Webhook URL for this Agent:
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={agent.n8nWebhookUrl}
                            onChange={(e) => handleUpdateWebhookUrl(agent.key, e.target.value)}
                            placeholder="https://your-n8n-instance.com/webhook/..."
                            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-orange-500"
                          />
                          <button
                            onClick={() => copyToClipboard(agent.n8nWebhookUrl, `wh-${agent.key}`)}
                            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 cursor-pointer"
                          >
                            {copiedKey === `wh-${agent.key}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>Copy</span>
                          </button>
                        </div>
                      </div>

                      {/* Capabilities & Payload */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-slate-400 font-semibold block mb-1">Capabilities:</span>
                          <ul className="list-disc list-inside text-slate-300 space-y-1 text-[11px]">
                            {agent.capabilities.map((cap, i) => (
                              <li key={i}>{cap}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <span className="text-slate-400 font-semibold block mb-1">Sample Dispatched Payload (from Orchestrator):</span>
                          <pre className="bg-slate-950 p-2.5 rounded-lg text-emerald-300 font-mono text-[10px] overflow-x-auto">
                            {JSON.stringify(agent.samplePayload, null, 2)}
                          </pre>
                        </div>
                      </div>

                      {/* Direct Inbound REST endpoint */}
                      <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800 flex items-center justify-between">
                        <span className="text-slate-400 text-[11px]">
                          Direct SAHAAYA AI Inbound Endpoint (n8n ➔ Platform):
                        </span>
                        <code className="text-cyan-300 font-mono text-[11px]">
                          POST {hostUrl}/api/agents/{agent.key}
                        </code>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Test Result Inspector */}
          {testResult && (
            <div className="bg-[#111827] border border-emerald-500/40 rounded-2xl p-4 shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Webhook Roundtrip Verified ({testResult.agentKey})
                </span>
                <button
                  onClick={() => setTestResult(null)}
                  className="text-slate-400 hover:text-white text-xs cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
              <pre className="bg-slate-950 p-3 rounded-lg text-emerald-300 font-mono text-[11px] overflow-x-auto">
                {JSON.stringify(testResult.data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Complete n8n Workflow JSON Blueprint */}
      {activeTab === 'WORKFLOW_JSON' && (
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Code className="w-4 h-4 text-emerald-400" />
                Complete n8n Workflow JSON Template
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Import directly into your n8n instance via &quot;Import from File / Clipboard&quot;.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => copyToClipboard(completeN8NWorkflowJSON, 'workflow-json')}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
              >
                {copiedKey === 'workflow-json' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'workflow-json' ? 'Copied JSON!' : 'Copy Workflow JSON'}</span>
              </button>

              <button
                onClick={() => {
                  const blob = new Blob([completeN8NWorkflowJSON], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'sahaaya_ai_5_agents_workflow.json';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer border border-slate-700"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .json</span>
              </button>
            </div>
          </div>

          <pre className="bg-slate-950 p-4 rounded-xl text-emerald-300 font-mono text-[11px] overflow-x-auto max-h-96 border border-slate-800">
            {completeN8NWorkflowJSON}
          </pre>
        </div>
      )}
    </div>
  );
};
