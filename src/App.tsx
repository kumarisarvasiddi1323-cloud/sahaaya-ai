/**
 * SAHAAYA AI — Intelligent Disaster Rescue Coordination Platform
 * Visakhapatnam (Vizag) Disaster Response Sector
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation, NavTab } from './components/Navigation';
import { OperationsDashboard } from './components/OperationsDashboard';
import { LiveIncidentMap } from './components/LiveIncidentMap';
import { IncidentManagement } from './components/IncidentManagement';
import { RescueTeamDirectory } from './components/RescueTeamDirectory';
import { ResourceInventoryView } from './components/ResourceInventory';
import { TeamAssignmentDispatch } from './components/TeamAssignmentDispatch';
import { CommunicationCentre } from './components/CommunicationCentre';
import { SituationReports } from './components/SituationReports';
import { OrganizationManagement } from './components/OrganizationManagement';
import { AuditLogsSecurity } from './components/AuditLogsSecurity';
import { AgentAConsole } from './components/AgentAConsole';
import { N8NIntegrationHub } from './components/N8NIntegrationHub';
import { AuthModal } from './components/AuthModal';
import { ReportIncidentModal } from './components/ReportIncidentModal';

import {
  User,
  Incident,
  RescueTeam,
  ResourceInventory,
  DispatchApproval,
  AuditLog,
  OperationalAlert,
  Organization,
  SituationReport,
  AgentASubAgentStatus,
  IncidentStatus,
  TeamStatus
} from './types/disaster';

import {
  INITIAL_USERS,
  INITIAL_ORGANIZATIONS,
  INITIAL_RESCUE_TEAMS,
  INITIAL_INCIDENTS,
  INITIAL_RESOURCES,
  INITIAL_DISPATCH_APPROVALS,
  INITIAL_AUDIT_LOGS,
  INITIAL_ALERTS,
  INITIAL_SITREP,
  INITIAL_SUB_AGENTS
} from './data/mockDisasterData';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]);
  const [allUsers, setAllUsers] = useState<User[]>(INITIAL_USERS);
  const [organizations, setOrganizations] = useState<Organization[]>(INITIAL_ORGANIZATIONS);
  const [rescueTeams, setRescueTeams] = useState<RescueTeam[]>(INITIAL_RESCUE_TEAMS);
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [resources, setResources] = useState<ResourceInventory[]>(INITIAL_RESOURCES);
  const [dispatchApprovals, setDispatchApprovals] = useState<DispatchApproval[]>(INITIAL_DISPATCH_APPROVALS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [alerts, setAlerts] = useState<OperationalAlert[]>(INITIAL_ALERTS);
  const [sitrep, setSitrep] = useState<SituationReport>(INITIAL_SITREP);
  const [subAgents, setSubAgents] = useState<AgentASubAgentStatus[]>(INITIAL_SUB_AGENTS);

  const [activeTab, setActiveTab] = useState<NavTab>('DASHBOARD');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch initial telemetry from backend if available
  const fetchAllData = async () => {
    setIsRefreshing(true);
    try {
      const [uRes, incRes, tRes, rRes, dRes, aRes, audRes, sRes] = await Promise.all([
        fetch('/api/auth/current-user').then((r) => r.json()).catch(() => null),
        fetch('/api/incidents').then((r) => r.json()).catch(() => null),
        fetch('/api/teams').then((r) => r.json()).catch(() => null),
        fetch('/api/resources').then((r) => r.json()).catch(() => null),
        fetch('/api/dispatch').then((r) => r.json()).catch(() => null),
        fetch('/api/alerts').then((r) => r.json()).catch(() => null),
        fetch('/api/audit-logs').then((r) => r.json()).catch(() => null),
        fetch('/api/sitrep').then((r) => r.json()).catch(() => null)
      ]);

      if (uRes?.user) setCurrentUser(uRes.user);
      if (incRes?.incidents) setIncidents(incRes.incidents);
      if (tRes?.teams) setRescueTeams(tRes.teams);
      if (rRes?.resources) setResources(rRes.resources);
      if (dRes?.dispatchApprovals) setDispatchApprovals(dRes.dispatchApprovals);
      if (aRes?.alerts) setAlerts(aRes.alerts);
      if (audRes?.auditLogs) setAuditLogs(audRes.auditLogs);
      if (sRes?.sitrep) setSitrep(sRes.sitrep);
    } catch (e) {
      console.warn('Backend fetch bypassed, running client-state session:', e);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Switch User identity & Role
  const handleSwitchUser = async (userId: string) => {
    try {
      const res = await fetch('/api/auth/switch-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      const data = await res.json();
      if (data.user) {
        setCurrentUser(data.user);
        fetchAllData();
        return;
      }
    } catch (err) {
      console.warn('Switching user locally:', err);
    }
    const found = allUsers.find((u) => u.id === userId);
    if (found) setCurrentUser(found);
  };

  // Create Incident
  const handleCreateIncident = async (newIncidentData: Partial<Incident>) => {
    try {
      const res = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newIncidentData)
      });
      const data = await res.json();
      if (data.incident) {
        setIncidents([data.incident, ...incidents]);
        fetchAllData();
        return;
      }
    } catch (err) {
      console.warn('Posting incident locally:', err);
    }

    const fallbackIncident: Incident = {
      id: `inc-vzg-${Date.now()}`,
      incidentCode: `VZG-${(newIncidentData.type || 'EMG').substring(0, 3)}-0${incidents.length + 101}`,
      type: newIncidentData.type || 'FLOOD',
      severity: newIncidentData.severity || 'HIGH_S2',
      status: 'REPORTED',
      title: newIncidentData.title || 'Reported Incident',
      description: newIncidentData.description || 'Assistance requested.',
      locationName: newIncidentData.locationName || 'Vizag Zone',
      coordinates: newIncidentData.coordinates || { lat: 17.7000, lng: 83.3000 },
      waterDepthMeters: newIncidentData.waterDepthMeters || 0,
      estimatedVictimsStranded: newIncidentData.estimatedVictimsStranded || 0,
      injuredCount: newIncidentData.injuredCount || 0,
      criticalNeeds: newIncidentData.criticalNeeds || ['Rescue Support'],
      reportedAt: new Date().toISOString(),
      reportedByOrgId: currentUser.organizationId,
      reportedByOrgName: currentUser.organizationName,
      verifiedByCommander: currentUser.role === 'INCIDENT_COMMANDER',
      assignedTeamIds: [],
      priorityScore: 88,
      accessHazards: newIncidentData.accessHazards || []
    };
    setIncidents([fallbackIncident, ...incidents]);
  };

  // Approve Dispatch
  const handleApproveDispatch = async (dispatchId: string) => {
    try {
      const res = await fetch(`/api/dispatch/${dispatchId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (data.success) {
        fetchAllData();
        return;
      }
    } catch (err) {
      console.warn('Approving locally:', err);
    }

    // Local fallback update
    setDispatchApprovals(
      dispatchApprovals.map((d) =>
        d.id === dispatchId
          ? {
              ...d,
              status: 'APPROVED',
              approvedByName: currentUser.name,
              approvedByUserId: currentUser.id,
              approvedAt: new Date().toISOString()
            }
          : d
      )
    );
  };

  // Reject Dispatch
  const handleRejectDispatch = async (dispatchId: string, reason: string) => {
    try {
      const res = await fetch(`/api/dispatch/${dispatchId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });
      const data = await res.json();
      if (data.success) {
        fetchAllData();
        return;
      }
    } catch (err) {
      console.warn('Rejecting locally:', err);
    }

    setDispatchApprovals(
      dispatchApprovals.map((d) =>
        d.id === dispatchId
          ? {
              ...d,
              status: 'REJECTED',
              rejectionReason: reason,
              approvedByName: currentUser.name,
              approvedAt: new Date().toISOString()
            }
          : d
      )
    );
  };

  // Allocate Resource
  const handleAllocateResource = async (resourceId: string, quantity: number, incidentCode: string) => {
    try {
      const res = await fetch(`/api/resources/${resourceId}/allocate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity, incidentCode })
      });
      const data = await res.json();
      if (data.success) {
        fetchAllData();
        return;
      }
    } catch (err) {
      console.warn('Allocating resource locally:', err);
    }

    setResources(
      resources.map((r) =>
        r.id === resourceId
          ? {
              ...r,
              availableQuantity: Math.max(0, r.availableQuantity - quantity),
              allocatedQuantity: r.allocatedQuantity + quantity,
              assignedIncidents: [...r.assignedIncidents, incidentCode]
            }
          : r
      )
    );
  };

  // Update Team Status
  const handleUpdateTeamStatus = async (teamId: string, status: TeamStatus) => {
    try {
      await fetch(`/api/teams/${teamId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchAllData();
    } catch (err) {
      setRescueTeams(rescueTeams.map((t) => (t.id === teamId ? { ...t, status } : t)));
    }
  };

  // Update Incident Status
  const handleUpdateIncidentStatus = async (incidentId: string, status: IncidentStatus) => {
    try {
      await fetch(`/api/incidents/${incidentId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchAllData();
    } catch (err) {
      setIncidents(incidents.map((i) => (i.id === incidentId ? { ...i, status } : i)));
    }
  };

  // Broadcast Alert
  const handleBroadcastAlert = async (title: string, message: string, priority: any, channel: any) => {
    try {
      await fetch('/api/alerts/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, message, priority, channel })
      });
      fetchAllData();
    } catch (err) {
      setAlerts([
        {
          id: `alt-${Date.now()}`,
          title,
          message,
          priority,
          channel,
          sentAt: 'Just now',
          type: 'DISPATCH_ALERT',
          deliveredCount: 18,
          acknowledgedCount: 12
        },
        ...alerts
      ]);
    }
  };

  const criticalIncidentCount = incidents.filter((i) => i.severity === 'CRITICAL_S1').length;
  const pendingDispatchCount = dispatchApprovals.filter((d) => d.status === 'PENDING_HUMAN_APPROVAL').length;

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Top Header */}
      <Header
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenAgentA={() => setActiveTab('AGENT_A')}
        criticalIncidentCount={criticalIncidentCount}
        pendingDispatchCount={pendingDispatchCount}
        onRefreshData={fetchAllData}
        isRefreshing={isRefreshing}
      />

      {/* Navigation Bar */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        pendingDispatchCount={pendingDispatchCount}
        criticalIncidentCount={criticalIncidentCount}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-12">
        {activeTab === 'DASHBOARD' && (
          <OperationsDashboard
            currentUser={currentUser}
            incidents={incidents}
            teams={rescueTeams}
            resources={resources}
            dispatchApprovals={dispatchApprovals}
            alerts={alerts}
            sitrep={sitrep}
            onNavigateToTab={setActiveTab}
            onApproveDispatch={handleApproveDispatch}
            onRejectDispatch={(id) => handleRejectDispatch(id, 'Coordinator modified deployment vector.')}
            onOpenIncidentDetail={(inc) => {
              setActiveTab('INCIDENTS');
            }}
            onTriggerAgentA={(incId) => {
              setActiveTab('AGENT_A');
            }}
            onOpenReportIncidentModal={() => setIsReportModalOpen(true)}
          />
        )}

        {activeTab === 'MAP' && (
          <LiveIncidentMap
            incidents={incidents}
            teams={rescueTeams}
            resources={resources}
            onSelectIncident={(inc) => {}}
            onSelectTeam={(team) => {}}
            onTriggerAgentA={(incId) => {
              setActiveTab('AGENT_A');
            }}
          />
        )}

        {activeTab === 'INCIDENTS' && (
          <IncidentManagement
            incidents={incidents}
            currentUser={currentUser}
            onOpenReportModal={() => setIsReportModalOpen(true)}
            onTriggerAgentA={(incId) => {
              setActiveTab('AGENT_A');
            }}
            onUpdateIncidentStatus={handleUpdateIncidentStatus}
            onToggleVerifyIncident={(id, v) => {
              fetch(`/api/incidents/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ verifiedByCommander: v })
              }).then(() => fetchAllData());
            }}
            onViewOnMap={(inc) => setActiveTab('MAP')}
          />
        )}

        {activeTab === 'DISPATCH' && (
          <TeamAssignmentDispatch
            dispatchApprovals={dispatchApprovals}
            rescueTeams={rescueTeams}
            incidents={incidents}
            currentUser={currentUser}
            onApproveDispatch={handleApproveDispatch}
            onRejectDispatch={handleRejectDispatch}
            onTriggerAgentA={(incId) => setActiveTab('AGENT_A')}
          />
        )}

        {activeTab === 'TEAMS' && (
          <RescueTeamDirectory
            teams={rescueTeams}
            currentUser={currentUser}
            onUpdateTeamStatus={handleUpdateTeamStatus}
            onViewOnMap={(team) => setActiveTab('MAP')}
          />
        )}

        {activeTab === 'RESOURCES' && (
          <ResourceInventoryView
            resources={resources}
            incidents={incidents}
            currentUser={currentUser}
            onAllocateResource={handleAllocateResource}
          />
        )}

        {activeTab === 'AGENT_A' && (
          <AgentAConsole
            subAgents={subAgents}
            incidents={incidents}
            currentUser={currentUser}
            onNavigateToDispatch={() => setActiveTab('DISPATCH')}
            onRefreshData={fetchAllData}
          />
        )}

        {activeTab === 'N8N' && (
          <N8NIntegrationHub currentUser={currentUser} />
        )}

        {activeTab === 'COMMS' && (
          <CommunicationCentre
            alerts={alerts}
            teams={rescueTeams}
            currentUser={currentUser}
            onBroadcastAlert={handleBroadcastAlert}
          />
        )}

        {activeTab === 'SITREP' && (
          <SituationReports
            sitrep={sitrep}
            currentUser={currentUser}
            onTriggerN8nRelay={() => setActiveTab('N8N')}
          />
        )}

        {activeTab === 'ORGANIZATIONS' && (
          <OrganizationManagement
            organizations={organizations}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'AUDIT' && (
          <AuditLogsSecurity
            auditLogs={auditLogs}
            currentUser={currentUser}
          />
        )}
      </main>

      {/* Auth & Role Switcher Modal */}
      <AuthModal
        currentUser={currentUser}
        allUsers={allUsers}
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSwitchUser={handleSwitchUser}
      />

      {/* Report Incident Modal */}
      <ReportIncidentModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        currentUser={currentUser}
        onSubmitIncident={handleCreateIncident}
      />

      {/* Tactical Footer Bar */}
      <footer className="border-t border-slate-800 bg-[#070b14] py-3 px-6 text-slate-500 text-[11px] flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-400">SAHAAYA AI OPS</span>
          <span>•</span>
          <span>Visakhapatnam Emergency Operations Centre (EOC)</span>
          <span>•</span>
          <span className="text-emerald-500">Autonomous Gate Online</span>
        </div>
        <div className="flex items-center gap-4 text-slate-500 font-mono text-[10px]">
          <span>AGENT A V3.8 FLASH</span>
          <span>•</span>
          <span>N8N WEBHOOK COMPLIANT</span>
          <span>•</span>
          <span>ISO 22320 DISASTER MGMT STANDARD</span>
        </div>
      </footer>
    </div>
  );
}
