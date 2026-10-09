import React from 'react';
import {
  LayoutDashboard,
  Map,
  AlertCircle,
  Users,
  Boxes,
  Send,
  Radio,
  FileText,
  Building2,
  FileCheck2,
  Bot,
  Workflow
} from 'lucide-react';

export type NavTab =
  | 'DASHBOARD'
  | 'MAP'
  | 'INCIDENTS'
  | 'TEAMS'
  | 'RESOURCES'
  | 'DISPATCH'
  | 'COMMS'
  | 'SITREP'
  | 'ORGANIZATIONS'
  | 'AUDIT'
  | 'AGENT_A'
  | 'N8N';

interface NavigationProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  pendingDispatchCount: number;
  criticalIncidentCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  pendingDispatchCount,
  criticalIncidentCount
}) => {
  const tabs = [
    {
      id: 'DASHBOARD' as NavTab,
      label: 'Ops Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'MAP' as NavTab,
      label: 'Live Incident Map',
      icon: Map,
      badge: 'LIVE'
    },
    {
      id: 'INCIDENTS' as NavTab,
      label: 'Incidents & Triage',
      icon: AlertCircle,
      badge: criticalIncidentCount > 0 ? `${criticalIncidentCount} S1` : null,
      badgeVariant: 'danger'
    },
    {
      id: 'DISPATCH' as NavTab,
      label: 'Dispatch Approvals',
      icon: Send,
      badge: pendingDispatchCount > 0 ? `${pendingDispatchCount} Gate` : null,
      badgeVariant: 'warning'
    },
    {
      id: 'TEAMS' as NavTab,
      label: 'Rescue Teams',
      icon: Users,
      badge: null
    },
    {
      id: 'RESOURCES' as NavTab,
      label: 'Resource Depot',
      icon: Boxes,
      badge: null
    },
    {
      id: 'AGENT_A' as NavTab,
      label: 'Google ADK Orchestrator',
      icon: Bot,
      badge: '5 Agents',
      badgeVariant: 'ai'
    },
    {
      id: 'N8N' as NavTab,
      label: 'n8n Agent Bridge',
      icon: Workflow,
      badge: 'Live Hub',
      badgeVariant: 'success'
    },
    {
      id: 'COMMS' as NavTab,
      label: 'Comms Centre',
      icon: Radio,
      badge: null
    },
    {
      id: 'SITREP' as NavTab,
      label: 'SITREP Reports',
      icon: FileText,
      badge: null
    },
    {
      id: 'ORGANIZATIONS' as NavTab,
      label: 'Rescue Org Network',
      icon: Building2,
      badge: null
    },
    {
      id: 'AUDIT' as NavTab,
      label: 'Audit & Security',
      icon: FileCheck2,
      badge: null
    }
  ];

  return (
    <nav className="bg-[#0f172a] border-b border-slate-800 text-slate-300 px-3 py-1 flex items-center gap-1 overflow-x-auto scrollbar-thin">
      <div className="flex items-center gap-1 min-w-max py-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          let badgeClasses = 'bg-slate-800 text-slate-400 border-slate-700';
          if (tab.badgeVariant === 'danger') {
            badgeClasses = 'bg-red-500/20 text-red-300 border-red-500/30 animate-pulse';
          } else if (tab.badgeVariant === 'warning') {
            badgeClasses = 'bg-amber-500/20 text-amber-300 border-amber-500/30 font-bold';
          } else if (tab.badgeVariant === 'ai') {
            badgeClasses = 'bg-orange-500/20 text-orange-300 border-orange-500/30';
          } else if (tab.badgeVariant === 'success') {
            badgeClasses = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
          }

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap border ${
                isActive
                  ? 'bg-orange-600/15 border-orange-500/50 text-white font-semibold shadow-inner'
                  : 'bg-transparent border-transparent hover:bg-slate-800/80 hover:text-slate-100 hover:border-slate-700/60'
              }`}
            >
              <Icon
                className={`w-3.5 h-3.5 ${
                  isActive ? 'text-orange-400' : 'text-slate-400'
                }`}
              />
              <span>{tab.label}</span>

              {tab.badge && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded border font-mono ${badgeClasses}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
