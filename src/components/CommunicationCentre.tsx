import React, { useState } from 'react';
import {
  OperationalAlert,
  User,
  RescueTeam
} from '../types/disaster';
import {
  Radio,
  Send,
  MessageSquare,
  AlertTriangle,
  Volume2,
  CheckCheck,
  Clock,
  Shield,
  Wifi,
  Workflow
} from 'lucide-react';

interface CommunicationCentreProps {
  alerts: OperationalAlert[];
  teams: RescueTeam[];
  currentUser: User;
  onBroadcastAlert: (title: string, message: string, priority: any, channel: any) => void;
}

export const CommunicationCentre: React.FC<CommunicationCentreProps> = ({
  alerts,
  teams,
  currentUser,
  onBroadcastAlert
}) => {
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [priority, setPriority] = useState<'URGENT' | 'HIGH' | 'NORMAL'>('HIGH');
  const [channel, setChannel] = useState<'RADIO_TAC' | 'SMS_PRIORITY' | 'N8N_WEBHOOK' | 'PLATFORM_PUSH'>('RADIO_TAC');
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMessage) return;
    onBroadcastAlert(broadcastTitle, broadcastMessage, priority, channel);
    setBroadcastTitle('');
    setBroadcastMessage('');
    setShowBroadcastModal(false);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto text-slate-100">
      {/* Header */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-cyan-400 font-bold text-xs uppercase tracking-wider">
              TACTICAL COMMS BUS
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400">Section 4 (Agent 5 Communication Agent)</span>
          </div>
          <h2 className="text-2xl font-black text-white">Emergency Communication & Dispatch Dispatcher</h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Encrypted VHF/UHF tactical radio repeaters, priority cellular broadcasts, and automated n8n webhook web bus.
          </p>
        </div>

        <button
          onClick={() => setShowBroadcastModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-red-600/30 border border-red-400/40"
        >
          <Volume2 className="w-4 h-4" />
          <span>Broadcast Emergency Alert</span>
        </button>
      </div>

      {/* Radio Frequencies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {[
          {
            ch: 'VHF CH 16',
            freq: '156.800 MHz',
            name: 'Maritime SAR & Coastal Distress',
            org: 'Indian Navy & Coast Guard',
            status: 'ONLINE'
          },
          {
            ch: 'NDRF TAC-4',
            freq: '148.650 MHz',
            name: '10th Bn Tactical Command Net',
            org: 'NDRF Vijayawada/Vizag',
            status: 'ONLINE'
          },
          {
            ch: 'SDRF OPS-2',
            freq: '152.125 MHz',
            name: 'Urban Flood Evacuation Net',
            org: 'AP SDRF Vizag Battalion',
            status: 'ONLINE'
          },
          {
            ch: 'MED-NET',
            freq: '149.200 MHz',
            name: 'Trauma & Casualty Dispatch',
            org: 'KGH Emergency Response',
            status: 'ONLINE'
          }
        ].map((freq, i) => (
          <div key={i} className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono font-bold text-orange-400">{freq.ch}</span>
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                <Wifi className="w-3 h-3" /> {freq.status}
              </span>
            </div>
            <div className="text-white font-bold mb-0.5">{freq.name}</div>
            <div className="text-[11px] text-slate-400">{freq.org}</div>
            <div className="text-[10px] font-mono text-cyan-300 mt-2 pt-1 border-t border-slate-800">
              Freq: {freq.freq} (Repeater Active)
            </div>
          </div>
        ))}
      </div>

      {/* Broadcast Feed */}
      <div className="bg-[#111827]/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <h3 className="font-extrabold text-base text-white mb-4 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-orange-400" />
          Dispatched Tactical Broadcasts & Delivery Receipts
        </h3>

        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs flex flex-col md:flex-row md:items-center md:justify-between gap-3"
            >
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    alert.priority === 'URGENT'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    {alert.priority}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    Channel: {alert.channel}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {alert.sentAt}
                  </span>
                </div>

                <h4 className="font-bold text-white text-sm">{alert.title}</h4>
                <p className="text-slate-300 text-xs leading-relaxed">{alert.message}</p>
              </div>

              {/* Delivery Receipt telemetry */}
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 text-[11px] font-mono flex items-center gap-4 flex-shrink-0">
                <div>
                  <span className="text-slate-500 block text-[9px]">DELIVERED:</span>
                  <strong className="text-cyan-400">{alert.deliveredCount} Units</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px]">ACKNOWLEDGED:</span>
                  <strong className="text-emerald-400">{alert.acknowledgedCount} Units</strong>
                </div>
                <CheckCheck className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Broadcast Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSendBroadcast}
            className="bg-[#111827] border border-slate-700 rounded-2xl p-6 max-w-lg w-full shadow-2xl text-slate-100 space-y-4"
          >
            <h3 className="font-extrabold text-base text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-red-500" />
              Send Tactical Broadcast Bulletin
            </h3>

            <div>
              <label className="text-slate-400 text-xs block mb-1">Bulletin Headline:</label>
              <input
                type="text"
                required
                placeholder="e.g. Mandatory Evacuation Order: Zone 3 Fishing Hamlets"
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 text-xs block mb-1">Priority Level:</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none"
                >
                  <option value="URGENT">URGENT (Flash Dispatch)</option>
                  <option value="HIGH">HIGH (Priority)</option>
                  <option value="NORMAL">NORMAL (Routine Notice)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 text-xs block mb-1">Channel:</label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none"
                >
                  <option value="RADIO_TAC">Radio Tactical Net (VHF)</option>
                  <option value="SMS_PRIORITY">Cellular Priority SMS</option>
                  <option value="N8N_WEBHOOK">n8n Webhook Pipeline</option>
                  <option value="PLATFORM_PUSH">Platform In-App Push</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-slate-400 text-xs block mb-1">Message Text:</label>
              <textarea
                required
                rows={3}
                placeholder="Detail tactical instructions, evacuation routes, and commander directives..."
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="flex items-center gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowBroadcastModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Transmit Broadcast</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
