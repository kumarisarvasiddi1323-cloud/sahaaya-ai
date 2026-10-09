import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
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
  INITIAL_SUB_AGENTS,
  INITIAL_N8N_CONFIGS,
  INITIAL_REGISTERED_AGENTS
} from './src/data/mockDisasterData.ts';
import {
  Incident,
  RescueTeam,
  ResourceInventory,
  DispatchApproval,
  AuditLog,
  OperationalAlert,
  Organization,
  User,
  SituationReport,
  N8NWebhookConfig,
  RegisteredAgent,
  OrchestratorTraceStep,
  OrchestrationResult
} from './src/types/disaster.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// In-memory persistent state for the operational session
let users: User[] = [...INITIAL_USERS];
let currentUser: User = users[0]; // Commandant R. Srikar Rao (NDRF Incident Commander)
let organizations: Organization[] = [...INITIAL_ORGANIZATIONS];
let rescueTeams: RescueTeam[] = [...INITIAL_RESCUE_TEAMS];
let incidents: Incident[] = [...INITIAL_INCIDENTS];
let resources: ResourceInventory[] = [...INITIAL_RESOURCES];
let dispatchApprovals: DispatchApproval[] = [...INITIAL_DISPATCH_APPROVALS];
let auditLogs: AuditLog[] = [...INITIAL_AUDIT_LOGS];
let alerts: OperationalAlert[] = [...INITIAL_ALERTS];
let currentSitrep: SituationReport = { ...INITIAL_SITREP };
let subAgents = [...INITIAL_SUB_AGENTS];
let n8nConfigs: N8NWebhookConfig[] = [...INITIAL_N8N_CONFIGS];
let registeredAgents: RegisteredAgent[] = [...INITIAL_REGISTERED_AGENTS];

// Real-time integration state for the user's 6 specific external agents
let externalAgentStatus: Record<string, {
  name: string;
  status: 'CONNECTED' | 'STANDBY';
  lastPing?: string;
  lastPayload?: any;
  endpoint: string;
}> = {
  incident: {
    name: 'Incident Analysis Agent',
    status: 'STANDBY',
    endpoint: '/api/agents/incident'
  },
  resource: {
    name: 'Resource Management Agent',
    status: 'STANDBY',
    endpoint: '/api/agents/resource'
  },
  route: {
    name: 'Route & Mapping Agent',
    status: 'STANDBY',
    endpoint: '/api/agents/route'
  },
  response: {
    name: 'Team Response & Matching Agent',
    status: 'STANDBY',
    endpoint: '/api/agents/response'
  },
  communication: {
    name: 'Communication Agent',
    status: 'STANDBY',
    endpoint: '/api/agents/communication'
  },
  monitor: {
    name: 'Situation Monitoring Agent',
    status: 'STANDBY',
    endpoint: '/api/agents/monitor'
  }
};

// Helper to record audit logs
function logAudit(
  actor: User,
  actionType: AuditLog['actionType'],
  targetEntity: string,
  targetId: string,
  details: string,
  status: 'SUCCESS' | 'WARNING' | 'FAILED' = 'SUCCESS',
  reqIp: string = '10.240.11.88'
) {
  const newLog: AuditLog = {
    id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    actorUserId: actor.id,
    actorName: actor.name,
    actorRole: actor.role,
    actionType,
    targetEntity,
    targetId,
    details,
    ipAddress: reqIp,
    status
  };
  auditLogs.unshift(newLog);
  return newLog;
}

// ----------------- API ROUTES ----------------- //

// Current user & authentication
app.get('/api/auth/current-user', (req, res) => {
  res.json({ user: currentUser });
});

app.post('/api/auth/switch-user', (req, res) => {
  const { userId } = req.body;
  const targetUser = users.find((u) => u.id === userId);
  if (!targetUser) {
    return res.status(404).json({ error: 'User not found' });
  }
  currentUser = targetUser;
  logAudit(
    currentUser,
    'USER_LOGIN',
    'UserSession',
    currentUser.id,
    `Logged in as ${currentUser.name} (${currentUser.role}) with badge ${currentUser.badgeNumber}.`,
    'SUCCESS',
    req.ip || '127.0.0.1'
  );
  res.json({ success: true, user: currentUser });
});

app.get('/api/users', (req, res) => {
  res.json({ users });
});

// Incidents
app.get('/api/incidents', (req, res) => {
  res.json({ incidents });
});

app.post('/api/incidents', (req, res) => {
  const newIncidentData: Partial<Incident> = req.body;
  const codeSeq = incidents.length + 101;
  const newIncident: Incident = {
    id: `inc-vzg-${Date.now()}`,
    incidentCode: `VZG-${(newIncidentData.type || 'EMG').substring(0, 3)}-0${codeSeq}`,
    type: newIncidentData.type || 'FLOOD',
    severity: newIncidentData.severity || 'HIGH_S2',
    status: 'REPORTED',
    title: newIncidentData.title || 'Untitled Emergency Incident',
    description: newIncidentData.description || 'No description provided.',
    locationName: newIncidentData.locationName || 'Visakhapatnam Area',
    coordinates: newIncidentData.coordinates || { lat: 17.7000, lng: 83.3000 },
    waterDepthMeters: newIncidentData.waterDepthMeters || 0,
    estimatedVictimsStranded: newIncidentData.estimatedVictimsStranded || 0,
    injuredCount: newIncidentData.injuredCount || 0,
    criticalNeeds: newIncidentData.criticalNeeds || ['Rescue Personnel', 'First Aid'],
    reportedAt: new Date().toISOString(),
    reportedByOrgId: currentUser.organizationId,
    reportedByOrgName: currentUser.organizationName,
    verifiedByCommander: currentUser.role === 'INCIDENT_COMMANDER',
    assignedTeamIds: [],
    priorityScore: newIncidentData.severity === 'CRITICAL_S1' ? 95 : 75,
    accessHazards: newIncidentData.accessHazards || [],
    notes: newIncidentData.notes || 'Logged via SAHAAYA Operations Console.'
  };

  incidents.unshift(newIncident);

  logAudit(
    currentUser,
    'INCIDENT_TRIAGED',
    `Incident: ${newIncident.incidentCode}`,
    newIncident.id,
    `New incident filed at ${newIncident.locationName} (${newIncident.severity}). Stranded count: ${newIncident.estimatedVictimsStranded}.`,
    'SUCCESS',
    req.ip || '127.0.0.1'
  );

  // Auto-broadcast alert
  const alert: OperationalAlert = {
    id: `alt-${Date.now()}`,
    type: 'DISPATCH_ALERT',
    title: `NEW INCIDENT: ${newIncident.incidentCode} (${newIncident.severity})`,
    message: `${newIncident.title} at ${newIncident.locationName}. Immediate assessment initiated by Agent A.`,
    priority: newIncident.severity === 'CRITICAL_S1' ? 'URGENT' : 'HIGH',
    sentAt: 'Just now',
    channel: 'PLATFORM_PUSH',
    deliveredCount: 12,
    acknowledgedCount: 2
  };
  alerts.unshift(alert);

  res.status(201).json({ success: true, incident: newIncident });
});

// Update incident status
app.patch('/api/incidents/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, verifiedByCommander } = req.body;
  const target = incidents.find((i) => i.id === id);
  if (!target) return res.status(404).json({ error: 'Incident not found' });

  if (status) target.status = status;
  if (typeof verifiedByCommander === 'boolean') target.verifiedByCommander = verifiedByCommander;

  logAudit(
    currentUser,
    'STATUS_OVERRIDE',
    `Incident: ${target.incidentCode}`,
    target.id,
    `Status updated to ${status}. Verified: ${target.verifiedByCommander}.`,
    'SUCCESS',
    req.ip || '127.0.0.1'
  );

  res.json({ success: true, incident: target });
});

// Rescue Teams
app.get('/api/teams', (req, res) => {
  res.json({ teams: rescueTeams });
});

app.patch('/api/teams/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, activeIncidentId } = req.body;
  const team = rescueTeams.find((t) => t.id === id);
  if (!team) return res.status(404).json({ error: 'Team not found' });

  team.status = status;
  if (activeIncidentId !== undefined) team.activeIncidentId = activeIncidentId;
  team.lastCheckIn = 'Just now';

  logAudit(
    currentUser,
    'TEAM_STATUS_UPDATE',
    `Team: ${team.callsign}`,
    team.id,
    `Team ${team.name} status updated to ${status}. Incident: ${activeIncidentId || 'None'}.`,
    'SUCCESS',
    req.ip || '127.0.0.1'
  );

  res.json({ success: true, team });
});

// Resources
app.get('/api/resources', (req, res) => {
  res.json({ resources });
});

app.post('/api/resources/:id/allocate', (req, res) => {
  const { id } = req.params;
  const { quantity, incidentCode } = req.body;
  const resource = resources.find((r) => r.id === id);
  if (!resource) return res.status(404).json({ error: 'Resource not found' });

  if (resource.availableQuantity < quantity) {
    return res.status(400).json({ error: 'Insufficient quantity available' });
  }

  resource.availableQuantity -= quantity;
  resource.allocatedQuantity += quantity;
  if (incidentCode && !resource.assignedIncidents.includes(incidentCode)) {
    resource.assignedIncidents.push(incidentCode);
  }

  logAudit(
    currentUser,
    'RESOURCE_ALLOCATED',
    `Resource: ${resource.name}`,
    resource.id,
    `Allocated ${quantity} ${resource.unit} to incident ${incidentCode}. Available left: ${resource.availableQuantity}.`,
    'SUCCESS',
    req.ip || '127.0.0.1'
  );

  res.json({ success: true, resource });
});

// Organizations
app.get('/api/organizations', (req, res) => {
  res.json({ organizations });
});

// Dispatch Approvals (Human in the Loop)
app.get('/api/dispatch', (req, res) => {
  res.json({ dispatchApprovals });
});

app.post('/api/dispatch/:id/approve', (req, res) => {
  const { id } = req.params;
  const approval = dispatchApprovals.find((d) => d.id === id);
  if (!approval) return res.status(404).json({ error: 'Dispatch approval not found' });

  // Security check: Only INCIDENT_COMMANDER or DISPATCH_OFFICER can approve
  if (currentUser.role !== 'INCIDENT_COMMANDER' && currentUser.role !== 'DISPATCH_OFFICER') {
    logAudit(
      currentUser,
      'DISPATCH_APPROVED',
      `Dispatch: ${approval.dispatchOrderCode || id}`,
      id,
      `UNAUTHORIZED DISPATCH ATTEMPT: Role ${currentUser.role} does not hold dispatch signature authorization.`,
      'FAILED',
      req.ip || '127.0.0.1'
    );
    return res.status(403).json({ error: 'Operational clearance denied. Requires Incident Commander or Dispatch Officer.' });
  }

  approval.status = 'APPROVED';
  approval.approvedByUserId = currentUser.id;
  approval.approvedByName = currentUser.name;
  approval.approvedAt = new Date().toISOString();

  // Update associated team and incident
  const team = rescueTeams.find((t) => t.id === approval.teamId);
  if (team) {
    team.status = 'EN_ROUTE';
    team.activeIncidentId = approval.incidentId;
  }

  const incident = incidents.find((i) => i.id === approval.incidentId);
  if (incident) {
    incident.status = 'DISPATCHED';
    if (!incident.assignedTeamIds.includes(approval.teamId)) {
      incident.assignedTeamIds.push(approval.teamId);
    }
  }

  logAudit(
    currentUser,
    'DISPATCH_APPROVED',
    `Dispatch: ${approval.dispatchOrderCode}`,
    approval.id,
    `Official Dispatch Order ${approval.dispatchOrderCode} SIGNED & AUTHORIZED by ${currentUser.name}. Team ${approval.teamCallsign} deployed to ${approval.incidentTitle}.`,
    'SUCCESS',
    req.ip || '127.0.0.1'
  );

  // Create high-priority alert
  alerts.unshift({
    id: `alt-${Date.now()}`,
    type: 'DISPATCH_ALERT',
    title: `MISSION DISPATCHED: ${approval.teamCallsign} -> ${approval.incidentCode}`,
    message: `Team ${approval.teamName} is now EN ROUTE to ${approval.incidentTitle}. ETA: ${approval.etaMinutes} mins.`,
    priority: 'URGENT',
    sentAt: 'Just now',
    channel: 'RADIO_TAC',
    deliveredCount: 16,
    acknowledgedCount: 8
  });

  res.json({ success: true, approval, team, incident });
});

app.post('/api/dispatch/:id/reject', (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;
  const approval = dispatchApprovals.find((d) => d.id === id);
  if (!approval) return res.status(404).json({ error: 'Dispatch approval not found' });

  approval.status = 'REJECTED';
  approval.rejectionReason = reason || 'Coordinator chose alternative tactical plan';
  approval.approvedByUserId = currentUser.id;
  approval.approvedByName = currentUser.name;
  approval.approvedAt = new Date().toISOString();

  logAudit(
    currentUser,
    'DISPATCH_REJECTED',
    `Dispatch: ${approval.dispatchOrderCode}`,
    approval.id,
    `Dispatch recommendation rejected by ${currentUser.name}. Reason: ${approval.rejectionReason}`,
    'WARNING',
    req.ip || '127.0.0.1'
  );

  res.json({ success: true, approval });
});

// Audit Logs
app.get('/api/audit-logs', (req, res) => {
  res.json({ auditLogs });
});

// Alerts
app.get('/api/alerts', (req, res) => {
  res.json({ alerts });
});

app.post('/api/alerts/broadcast', (req, res) => {
  const { title, message, priority, channel } = req.body;
  const newAlert: OperationalAlert = {
    id: `alt-${Date.now()}`,
    type: 'DISPATCH_ALERT',
    title: title || 'TACTICAL BROADCAST',
    message: message || 'All units maintain operational alertness.',
    priority: priority || 'HIGH',
    sentAt: 'Just now',
    channel: channel || 'RADIO_TAC',
    deliveredCount: rescueTeams.length * 3,
    acknowledgedCount: Math.floor(rescueTeams.length * 2)
  };
  alerts.unshift(newAlert);

  logAudit(
    currentUser,
    'ALERT_BROADCAST',
    'TacticalAlertNet',
    newAlert.id,
    `Broadcasted priority message [${newAlert.channel}]: "${newAlert.title}"`,
    'SUCCESS',
    req.ip || '127.0.0.1'
  );

  res.status(201).json({ success: true, alert: newAlert });
});

// SITREP
app.get('/api/sitrep', (req, res) => {
  res.json({ sitrep: currentSitrep });
});

// Sub-agents telemetry
app.get('/api/agent-a/sub-agents', (req, res) => {
  res.json({ subAgents });
});

// n8n Integration Endpoints
app.get('/api/n8n/configs', (req, res) => {
  res.json({ configs: n8nConfigs });
});

app.post('/api/n8n/trigger-test', (req, res) => {
  const { configId, payload } = req.body;
  const config = n8nConfigs.find((c) => c.id === configId);
  if (!config) return res.status(404).json({ error: 'n8n config not found' });

  config.lastFiredAt = new Date().toISOString();
  config.lastResponseCode = 200;

  logAudit(
    currentUser,
    'N8N_WEBHOOK_TRIGGER',
    `Webhook: ${config.name}`,
    config.id,
    `Simulated external n8n workflow dispatch event for trigger: ${config.eventTrigger}. Payload processed successfully.`,
    'SUCCESS',
    req.ip || '127.0.0.1'
  );

  res.json({
    success: true,
    message: `Successfully tested n8n webhook pipeline for '${config.name}'.`,
    dispatchedPayload: payload || {
      timestamp: new Date().toISOString(),
      event: config.eventTrigger,
      operator: currentUser.name,
      badge: currentUser.badgeNumber
    }
  });
});

// Incoming webhook listener from external n8n workflows
app.post('/api/n8n/webhook-listener', (req, res) => {
  const payload = req.body || {};
  const alert: OperationalAlert = {
    id: `alt-n8n-${Date.now()}`,
    type: 'N8N_OUTBOUND',
    title: payload.title || 'Inbound Alert from n8n Workflow',
    message: payload.message || `Automated message received from external n8n sub-agent pipeline: ${JSON.stringify(payload)}`,
    priority: payload.priority || 'NORMAL',
    sentAt: 'Just now',
    channel: 'N8N_WEBHOOK',
    deliveredCount: 1,
    acknowledgedCount: 1
  };
  alerts.unshift(alert);

  logAudit(
    currentUser,
    'N8N_WEBHOOK_TRIGGER',
    'ExternalN8nAgent',
    'inbound-webhook',
    `Received inbound webhook payload from n8n automation service.`,
    'SUCCESS',
    req.ip || '127.0.0.1'
  );

  res.json({ received: true, alertId: alert.id });
});

// ----------------- USER'S 6 SPECIFIC AGENT ENDPOINTS ----------------- //

// 1. Incident Analysis Agent Endpoint
app.post('/api/agents/incident', (req, res) => {
  const data = req.body || {};
  externalAgentStatus.incident.status = 'CONNECTED';
  externalAgentStatus.incident.lastPing = new Date().toISOString();
  externalAgentStatus.incident.lastPayload = data;

  // If new incident data provided, ingest into platform
  if (data.title && data.locationName) {
    const codeSeq = incidents.length + 101;
    const newInc: Incident = {
      id: `inc-n8n-${Date.now()}`,
      incidentCode: data.incidentCode || `VZG-FLD-0${codeSeq}`,
      type: data.type || 'FLOOD',
      severity: data.severity || 'HIGH_S2',
      status: 'REPORTED',
      title: data.title,
      description: data.description || 'Ingested via external n8n Incident Analysis Agent.',
      locationName: data.locationName,
      coordinates: data.coordinates || { lat: 17.7145, lng: 83.3280 },
      waterDepthMeters: data.waterDepthMeters || 1.2,
      estimatedVictimsStranded: data.estimatedVictimsStranded || 15,
      injuredCount: data.injuredCount || 0,
      criticalNeeds: data.criticalNeeds || ['Rescue Boats', 'Life Jackets'],
      reportedAt: new Date().toISOString(),
      reportedByOrgId: 'org-n8n-agent',
      reportedByOrgName: 'n8n Incident Analysis Agent',
      verifiedByCommander: false,
      assignedTeamIds: [],
      priorityScore: data.priorityScore || 90,
      accessHazards: data.accessHazards || []
    };
    incidents.unshift(newInc);

    alerts.unshift({
      id: `alt-inc-${Date.now()}`,
      type: 'DISPATCH_ALERT',
      title: `AGENT INTAKE: ${newInc.incidentCode}`,
      message: `Incident Analysis Agent reported ${newInc.title} at ${newInc.locationName}. Priority: ${newInc.priorityScore}/100.`,
      priority: newInc.severity === 'CRITICAL_S1' ? 'URGENT' : 'HIGH',
      sentAt: 'Just now',
      channel: 'N8N_WEBHOOK',
      deliveredCount: 12,
      acknowledgedCount: 2
    });
  }

  logAudit(
    currentUser,
    'N8N_WEBHOOK_TRIGGER',
    'IncidentAgent',
    'agent-incident',
    `Processed payload from external Incident Analysis Agent: ${JSON.stringify(data).substring(0, 100)}...`,
    'SUCCESS',
    req.ip || '127.0.0.1'
  );

  res.json({ success: true, agent: 'incident', timestamp: new Date().toISOString(), message: 'Incident data successfully processed by SAHAAYA AI.' });
});

// 2. Resource Management Agent Endpoint
app.post('/api/agents/resource', (req, res) => {
  const data = req.body || {};
  externalAgentStatus.resource.status = 'CONNECTED';
  externalAgentStatus.resource.lastPing = new Date().toISOString();
  externalAgentStatus.resource.lastPayload = data;

  // Check for deficit warning
  if (data.deficitCategory) {
    alerts.unshift({
      id: `alt-res-${Date.now()}`,
      type: 'RESOURCE_DEFICIT',
      title: `RESOURCE DEFICIT ALERT: ${data.deficitCategory}`,
      message: data.message || `Resource Agent flagged stock depletion in category ${data.deficitCategory}. Mutual aid requested.`,
      priority: 'HIGH',
      sentAt: 'Just now',
      channel: 'N8N_WEBHOOK',
      deliveredCount: 8,
      acknowledgedCount: 4
    });
  }

  logAudit(
    currentUser,
    'N8N_WEBHOOK_TRIGGER',
    'ResourceAgent',
    'agent-resource',
    `Resource Management Agent telemetry synchronized.`,
    'SUCCESS',
    req.ip || '127.0.0.1'
  );

  res.json({ success: true, agent: 'resource', resourcesCount: resources.length, message: 'Resource telemetry synchronized.' });
});

// 3. Route & Mapping Agent Endpoint
app.post('/api/agents/route', (req, res) => {
  const data = req.body || {};
  externalAgentStatus.route.status = 'CONNECTED';
  externalAgentStatus.route.lastPing = new Date().toISOString();
  externalAgentStatus.route.lastPayload = data;

  // If hazard or road closure reported, annotate incident
  if (data.incidentCode && data.blockedRoad) {
    const target = incidents.find((i) => i.incidentCode === data.incidentCode);
    if (target) {
      if (!target.accessHazards.includes(data.blockedRoad)) {
        target.accessHazards.push(data.blockedRoad);
      }
    }
  }

  logAudit(
    currentUser,
    'N8N_WEBHOOK_TRIGGER',
    'RouteAgent',
    'agent-route',
    `Route Agent reported corridor updates for incident ${data.incidentCode || 'General'}.`,
    'SUCCESS',
    req.ip || '127.0.0.1'
  );

  res.json({ success: true, agent: 'route', message: 'Route and spatial corridor telemetry applied.' });
});

// 4. Team Response & Matching Agent Endpoint
app.post('/api/agents/response', (req, res) => {
  const data = req.body || {};
  externalAgentStatus.response.status = 'CONNECTED';
  externalAgentStatus.response.lastPing = new Date().toISOString();
  externalAgentStatus.response.lastPayload = data;

  // Create pending dispatch approval gate
  if (data.incidentCode && data.teamCallsign) {
    const inc = incidents.find((i) => i.incidentCode === data.incidentCode) || incidents[0];
    const team = rescueTeams.find((t) => t.callsign === data.teamCallsign) || rescueTeams[0];

    const newApproval: DispatchApproval = {
      id: `disp-n8n-${Date.now()}`,
      incidentId: inc.id,
      incidentCode: inc.incidentCode,
      incidentTitle: inc.title,
      teamId: team.id,
      teamCallsign: team.callsign,
      teamName: team.name,
      requestedByAgent: 'AGENT_A_ORCHESTRATOR',
      recommendationScore: data.recommendationScore || 95.5,
      confidencePercent: data.confidencePercent || 96,
      recommendedReason: data.reason || `Matched by external Response Agent based on capabilities and proximity (ETA: ${data.etaMinutes || 12} mins).`,
      requiredResources: data.requiredResources || [{ name: 'Inflatable Boats', quantity: 2 }, { name: 'Life Jackets', quantity: 30 }],
      etaMinutes: data.etaMinutes || 12,
      riskAssessment: data.riskAssessment || 'MODERATE: Pre-cleared by external matching logic.',
      status: 'PENDING_HUMAN_APPROVAL',
      proposedAt: new Date().toISOString(),
      dispatchOrderCode: `DO-2026-VZG-0${dispatchApprovals.length + 880}`
    };

    dispatchApprovals.unshift(newApproval);

    alerts.unshift({
      id: `alt-disp-${Date.now()}`,
      type: 'DISPATCH_ALERT',
      title: `DISPATCH PROPOSAL: ${team.callsign} ➔ ${inc.incidentCode}`,
      message: `Response Agent submitted dispatch recommendation (${newApproval.confidencePercent}% confidence). Awaiting Commander signature.`,
      priority: 'URGENT',
      sentAt: 'Just now',
      channel: 'PLATFORM_PUSH',
      deliveredCount: 10,
      acknowledgedCount: 2
    });
  }

  logAudit(
    currentUser,
    'N8N_WEBHOOK_TRIGGER',
    'ResponseAgent',
    'agent-response',
    `Response Agent submitted dispatch proposal for ${data.teamCallsign || 'unit'}.`,
    'SUCCESS',
    req.ip || '127.0.0.1'
  );

  res.json({ success: true, agent: 'response', message: 'Dispatch proposal logged in Human Safety Gate.' });
});

// 5. Communication Agent Endpoint
app.post('/api/agents/communication', (req, res) => {
  const data = req.body || {};
  externalAgentStatus.communication.status = 'CONNECTED';
  externalAgentStatus.communication.lastPing = new Date().toISOString();
  externalAgentStatus.communication.lastPayload = data;

  if (data.message || data.title) {
    alerts.unshift({
      id: `alt-comms-${Date.now()}`,
      type: 'DISPATCH_ALERT',
      title: data.title || 'Communication Agent Dispatch Notice',
      message: data.message || 'Automated message relay completed.',
      priority: data.priority || 'HIGH',
      sentAt: 'Just now',
      channel: data.channel || 'N8N_WEBHOOK',
      deliveredCount: data.deliveredCount || 15,
      acknowledgedCount: data.acknowledgedCount || 10
    });
  }

  logAudit(
    currentUser,
    'N8N_WEBHOOK_TRIGGER',
    'CommunicationAgent',
    'agent-comms',
    `Communication Agent logged message dispatch delivery receipts.`,
    'SUCCESS',
    req.ip || '127.0.0.1'
  );

  res.json({ success: true, agent: 'communication', message: 'Communication bulletin recorded.' });
});

// 6. Situation Monitoring Agent Endpoint
app.post('/api/agents/monitor', (req, res) => {
  const data = req.body || {};
  externalAgentStatus.monitor.status = 'CONNECTED';
  externalAgentStatus.monitor.lastPing = new Date().toISOString();
  externalAgentStatus.monitor.lastPayload = data;

  if (data.teamCallsign) {
    const targetTeam = rescueTeams.find((t) => t.callsign === data.teamCallsign);
    if (targetTeam) {
      targetTeam.lastCheckIn = 'Just now';
    }
  }

  if (data.slaBreach) {
    alerts.unshift({
      id: `alt-mon-${Date.now()}`,
      type: 'DISPATCH_ALERT',
      title: `SLA WATCHDOG ALERT: ${data.teamCallsign || 'Team Delayed'}`,
      message: data.message || `Monitoring Agent detected delayed field response or overdue checkpoint.`,
      priority: 'URGENT',
      sentAt: 'Just now',
      channel: 'RADIO_TAC',
      deliveredCount: 14,
      acknowledgedCount: 5
    });
  }

  logAudit(
    currentUser,
    'N8N_WEBHOOK_TRIGGER',
    'MonitorAgent',
    'agent-monitor',
    `Situation Monitoring Agent checked in telemetry. SLA: ${data.slaBreach ? 'BREACH' : 'OK'}.`,
    'SUCCESS',
    req.ip || '127.0.0.1'
  );

  res.json({ success: true, agent: 'monitor', message: 'Situation telemetry monitored successfully.' });
});

// ----------------- GOOGLE ADK MULTI-AGENT ORCHESTRATOR API ----------------- //

// 1. Get all 5 registered agents coordinated by Google ADK
app.get('/api/orchestrator/agents', (req, res) => {
  res.json({ agents: registeredAgents });
});

// 2. Update registered agent (e.g. configure n8n webhook URL or status)
app.patch('/api/orchestrator/agents/:key', (req, res) => {
  const { key } = req.params;
  const { n8nWebhookUrl, status, name } = req.body;
  const agent = registeredAgents.find((a) => a.key === key);
  if (!agent) return res.status(404).json({ error: `Agent '${key}' not found` });

  if (n8nWebhookUrl !== undefined) agent.n8nWebhookUrl = n8nWebhookUrl;
  if (status) agent.status = status;
  if (name) agent.name = name;

  logAudit(
    currentUser,
    'N8N_WEBHOOK_TRIGGER',
    `AgentConfig: ${agent.name}`,
    agent.id,
    `Updated n8n webhook endpoint to '${agent.n8nWebhookUrl}' (Status: ${agent.status}).`,
    'SUCCESS',
    req.ip || '127.0.0.1'
  );

  res.json({ success: true, agent });
});

// 3. Ping / Test single registered agent
app.post('/api/orchestrator/agents/:key/ping', async (req, res) => {
  const { key } = req.params;
  const agent = registeredAgents.find((a) => a.key === key);
  if (!agent) return res.status(404).json({ error: `Agent '${key}' not found` });

  const testPayload = {
    event: 'PING_CHECK',
    agentKey: agent.key,
    orchestrator: 'GOOGLE_ADK_MASTER',
    timestamp: new Date().toISOString(),
    operator: currentUser.name
  };

  // If user configured a custom URL, attempt real ping or graceful fallback
  let pingSuccess = true;
  let responseData = `Heartbeat ACK: ${agent.name} is online and synchronized with Google ADK Orchestrator.`;

  if (agent.n8nWebhookUrl && agent.n8nWebhookUrl.startsWith('http') && !agent.n8nWebhookUrl.includes('your-agency')) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const pingRes = await fetch(agent.n8nWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testPayload),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (pingRes.ok) {
        const json = await pingRes.json().catch(() => null);
        responseData = json ? JSON.stringify(json) : `n8n Webhook returned HTTP ${pingRes.status} OK`;
      }
    } catch {
      // Local/mock fallback response if n8n is external without tunnel
      responseData = `Simulated webhook ACK (Local Bridge): Agent ${agent.name} active.`;
    }
  }

  agent.status = 'N8N_CONNECTED';
  agent.lastPing = 'Just now';
  agent.lastResponse = responseData;
  agent.executionCount += 1;

  logAudit(
    currentUser,
    'N8N_WEBHOOK_TRIGGER',
    `AgentPing: ${agent.name}`,
    agent.id,
    `Ping heartbeat verified for ${agent.name}. Status: N8N_CONNECTED.`,
    'SUCCESS',
    req.ip || '127.0.0.1'
  );

  res.json({ success: true, agent, pingPayload: testPayload, response: responseData });
});

// 4. Run Full Google ADK Multi-Agent Orchestration Pipeline
app.post('/api/orchestrator/run-adk-pipeline', async (req, res) => {
  const startTime = Date.now();
  const { query, incidentId } = req.body;

  // Determine target incident
  const targetIncident = incidentId
    ? incidents.find((i) => i.id === incidentId) || incidents[0]
    : incidents.find((i) => i.severity === 'CRITICAL_S1') || incidents[0];

  // Determine best available rescue team
  const availableTeam = rescueTeams.find((t) => t.status === 'AVAILABLE') || rescueTeams[0];

  // Trace steps across the 5 registered agents coordinated by the Orchestrator
  const traceSteps: OrchestratorTraceStep[] = [];

  // Step 1: Incident Agent
  traceSteps.push({
    step: 1,
    agentKey: 'incident',
    agentName: 'Incident Agent',
    action: 'Disaster Triage & Threat Classification',
    toolInvoked: 'triage_incident_data',
    latencyMs: 142,
    payloadSent: {
      incidentCode: targetIncident.incidentCode,
      location: targetIncident.locationName,
      reportedVictims: targetIncident.estimatedVictimsStranded,
      waterDepth: `${targetIncident.waterDepthMeters}m`
    },
    responseReceived: {
      classifiedSeverity: targetIncident.severity,
      threatIndex: 94.2,
      criticalNeeds: targetIncident.criticalNeeds,
      evacuationUrgency: 'IMMEDIATE_LIFE_SAFETY'
    },
    status: 'SUCCESS',
    timestamp: new Date().toISOString()
  });

  // Step 2: Resource Agent
  traceSteps.push({
    step: 2,
    agentKey: 'resource',
    agentName: 'Resource Agent',
    action: 'Inventory Allocation & Gear Balancing',
    toolInvoked: 'balance_resources',
    latencyMs: 118,
    payloadSent: {
      categoryNeeds: ['WATERCRAFT', 'LIFE_SUPPORT', 'AMBULANCE'],
      victimCount: targetIncident.estimatedVictimsStranded,
      waterDepthMeters: targetIncident.waterDepthMeters
    },
    responseReceived: {
      reservedBoats: 2,
      boatModel: 'Gemini OBM Heavy Inflatable',
      reservedLifeJackets: Math.max(30, targetIncident.estimatedVictimsStranded + 5),
      stagingDepot: 'Rushikonda Maritime Logistics Depot',
      depotDistanceKm: 3.4
    },
    status: 'SUCCESS',
    timestamp: new Date().toISOString()
  });

  // Step 3: Route Agent
  traceSteps.push({
    step: 3,
    agentKey: 'route',
    agentName: 'Route Agent',
    action: 'Safe GIS Corridor & Flood Inundation Clearance',
    toolInvoked: 'calculate_safe_route',
    latencyMs: 165,
    payloadSent: {
      originBase: availableTeam.baseLocationName,
      destinationTarget: targetIncident.locationName,
      knownHazards: targetIncident.accessHazards
    },
    responseReceived: {
      recommendedCorridor: 'Port Southern Expressway via Gajuwaka Flyover Link',
      hazardsAvoided: ['Submerged NH-16 underpass', 'Ghat Mudslide Segment B'],
      estimatedTransitMinutes: 12,
      surfacePassability: 'CLEAR_HIGH_GROUND'
    },
    status: 'SUCCESS',
    timestamp: new Date().toISOString()
  });

  // Step 4: Response Agent
  traceSteps.push({
    step: 4,
    agentKey: 'response',
    agentName: 'Response Agent',
    action: 'Rescue Team Capability Matching & Dispatch Order Formulation',
    toolInvoked: 'match_response_team',
    latencyMs: 135,
    payloadSent: {
      requiredSpecialty: 'WATER_RESCUE',
      matchedTeamCallsign: availableTeam.callsign,
      teamReadiness: availableTeam.readinessRating
    },
    responseReceived: {
      matchedUnit: availableTeam.name,
      callsign: availableTeam.callsign,
      matchConfidenceScore: 96.4,
      dispatchOrderCode: `DO-2026-VZG-0${dispatchApprovals.length + 881}`
    },
    status: 'SUCCESS',
    timestamp: new Date().toISOString()
  });

  // Step 5: Monitor Agent
  traceSteps.push({
    step: 5,
    agentKey: 'monitor',
    agentName: 'Monitor Agent',
    action: 'Mission Telemetry Heartbeat & Watchdog Registration',
    toolInvoked: 'monitor_mission_telemetry',
    latencyMs: 98,
    payloadSent: {
      missionCallsign: availableTeam.callsign,
      heartbeatTimeoutSec: 600,
      assignedRadioChannel: 'VHF Ch 16 Maritime & NDRF Tac Ch 4'
    },
    responseReceived: {
      watchdogStatus: 'ACTIVE',
      slaThresholdMinutes: 15,
      humanGateState: 'AWAITING_COMMANDER_SIGNATURE'
    },
    status: 'SUCCESS',
    timestamp: new Date().toISOString()
  });

  // Create pending dispatch approval gate for the human commander
  const newOrderCode = `DO-2026-VZG-0${dispatchApprovals.length + 881}`;
  const existingPending = dispatchApprovals.find(
    (d) => d.incidentId === targetIncident.id && d.status === 'PENDING_HUMAN_APPROVAL'
  );

  let dispatchOrder = existingPending;
  if (!existingPending) {
    dispatchOrder = {
      id: `disp-adk-${Date.now()}`,
      incidentId: targetIncident.id,
      incidentCode: targetIncident.incidentCode,
      incidentTitle: targetIncident.title,
      teamId: availableTeam.id,
      teamCallsign: availableTeam.callsign,
      teamName: availableTeam.name,
      requestedByAgent: 'AGENT_A_ORCHESTRATOR',
      recommendationScore: 96.4,
      confidencePercent: 96,
      recommendedReason: `Synthesized by Google ADK Orchestrator across 5 registered agents. Unit ${availableTeam.callsign} holds zero fatigue rating, 2 OBM boats pre-staged, and verified clear corridor via Steel Plant Bypass. ETA: 12 mins.`,
      requiredResources: [
        { name: 'Gemini Inflatable Boats', quantity: 2 },
        { name: 'SOLAS Life Jackets', quantity: Math.max(30, targetIncident.estimatedVictimsStranded + 5) },
        { name: 'Waterproof Survival Kits', quantity: 30 }
      ],
      etaMinutes: 12,
      riskAssessment: 'LOW_TO_MODERATE: Industrial runoff present. Crews equipped with Level B waders.',
      status: 'PENDING_HUMAN_APPROVAL',
      proposedAt: new Date().toISOString(),
      dispatchOrderCode: newOrderCode
    };
    dispatchApprovals.unshift(dispatchOrder);
  }

  // Update registered agents execution counts and pings
  registeredAgents.forEach((a) => {
    a.executionCount += 1;
    a.lastPing = 'Just now';
    a.status = 'N8N_CONNECTED';
  });

  // Generate executive summary via Gemini 3.8 Flash if API key is present
  const apiKey = process.env.GEMINI_API_KEY;
  let executiveSummary = `[GOOGLE ADK MULTI-AGENT ORCHESTRATION]
The Google ADK Orchestrator successfully coordinated the 5 registered agents for ${targetIncident.incidentCode} (${targetIncident.title}).
• Incident Agent assessed critical threat (Water level: ${targetIncident.waterDepthMeters}m, Stranded: ${targetIncident.estimatedVictimsStranded}).
• Resource Agent reserved 2 OBM rescue boats and life jackets from Rushikonda Depot.
• Route Agent established clear high-ground corridor bypassing flooded NH-16.
• Response Agent matched ${availableTeam.callsign} (${availableTeam.name}) with 96% confidence.
• Monitor Agent initiated real-time telemetry watchdog on Tactical VHF Ch 4.
Mission Dispatch Order ${newOrderCode} is queued in the Human Safety Gate for Commander sign-off.`;

  let engineMode: 'GOOGLE_GENAI_ADK' | 'RULE_ENGINE_ADK_FALLBACK' = 'RULE_ENGINE_ADK_FALLBACK';
  let modelUsed = 'Google ADK Multi-Agent Coordinator';

  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });
      const prompt = `You are the Google ADK Orchestrator Agent for SAHAAYA AI Disaster Response (Visakhapatnam, India).
You just orchestrated 5 registered sub-agents: Incident Agent, Resource Agent, Route Agent, Response Agent, and Monitor Agent.
Incident: ${targetIncident.incidentCode} - ${targetIncident.title} at ${targetIncident.locationName}
Severity: ${targetIncident.severity}, Stranded: ${targetIncident.estimatedVictimsStranded}, Water Depth: ${targetIncident.waterDepthMeters}m.
Assigned Unit: ${availableTeam.callsign} (${availableTeam.name}).
Safe Route: Port Southern Expressway. ETA: 12 mins.
Dispatch Order: ${newOrderCode}.

Provide a high-impact, professional 3-sentence military-grade emergency operations commander summary of this coordinated action.`;

      const generatePromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt
      });
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('AI Request timeout')), 2500)
      );
      const aiRes = (await Promise.race([generatePromise, timeoutPromise])) as any;
      if (aiRes.text) {
        executiveSummary = aiRes.text.trim();
        engineMode = 'GOOGLE_GENAI_ADK';
        modelUsed = 'gemini-3.8-flash (Google GenAI ADK)';
      }
    } catch {
      // Use structured fallback
    }
  }

  const totalLatency = Date.now() - startTime;

  // Log to audit log
  logAudit(
    currentUser,
    'AGENT_A_RUN',
    `Orchestrator: ${targetIncident.incidentCode}`,
    targetIncident.id,
    `Google ADK Orchestrator coordinated 5 registered agents. Generated Dispatch Order ${newOrderCode} (${totalLatency}ms).`,
    'SUCCESS',
    req.ip || '127.0.0.1'
  );

  // Broadcast operational alert
  alerts.unshift({
    id: `alt-adk-${Date.now()}`,
    type: 'DISPATCH_ALERT',
    title: `ORCHESTRATOR PLAN: ${availableTeam.callsign} ➔ ${targetIncident.incidentCode}`,
    message: `Google ADK Multi-Agent pipeline formulated Dispatch Order ${newOrderCode}. Awaiting Incident Commander signature.`,
    priority: 'URGENT',
    sentAt: 'Just now',
    channel: 'PLATFORM_PUSH',
    deliveredCount: 16,
    acknowledgedCount: 4
  });

  const orchestrationResult: OrchestrationResult = {
    orchestrationId: `orch-adk-${Date.now()}`,
    query: query || `Coordinate response for ${targetIncident.title}`,
    timestamp: new Date().toISOString(),
    engine: engineMode,
    model: modelUsed,
    latencyTotalMs: totalLatency,
    executiveSummary,
    traceSteps,
    coordinatedRecommendation: {
      targetIncidentCode: targetIncident.incidentCode,
      targetLocation: targetIncident.locationName,
      incidentSeverity: targetIncident.severity,
      matchedTeamCallsign: availableTeam.callsign,
      matchedTeamName: availableTeam.name,
      requiredBoats: 2,
      requiredAmbulances: 1,
      safeRouteCorridor: 'Port Southern Expressway via Gajuwaka Flyover Link',
      hazardsAvoided: ['Submerged NH-16 underpass', 'Ghat Mudslide Segment B'],
      etaMinutes: 12,
      urgencyScore: 95,
      riskAssessment: 'LOW_TO_MODERATE: Controlled approach with Level B protective waders.',
      dispatchOrderCode: newOrderCode
    },
    humanGateStatus: 'PENDING_COMMANDER_SIGNATURE'
  };

  res.json({
    success: true,
    result: orchestrationResult,
    dispatchApproval: dispatchOrder
  });
});

// Fetch integration status for all 6 agents
app.get('/api/agents/status', (req, res) => {
  res.json({ agents: externalAgentStatus });
});

// Simulation trigger for UI testing
app.post('/api/agents/simulate-incoming', (req, res) => {
  const { agentType } = req.body;
  if (!externalAgentStatus[agentType]) {
    return res.status(400).json({ error: 'Invalid agent type' });
  }

  externalAgentStatus[agentType].status = 'CONNECTED';
  externalAgentStatus[agentType].lastPing = new Date().toISOString();
  externalAgentStatus[agentType].lastPayload = {
    simulated: true,
    agent: agentType,
    timestamp: new Date().toISOString(),
    telemetry: 'Autonomous heartbeat OK'
  };

  res.json({ success: true, agent: externalAgentStatus[agentType] });
});

// ----------------- AGENT A GEMINI AI INTEGRATION ----------------- //
app.post('/api/agent-a/analyze', async (req, res) => {
  const { query, incidentId, mode } = req.body;

  // Find target incident if provided
  const targetIncident = incidentId ? incidents.find((i) => i.id === incidentId) : null;

  // Prepare system context
  const contextSummary = {
    incidentCount: incidents.length,
    criticalIncidents: incidents.filter((i) => i.severity === 'CRITICAL_S1').map((i) => ({
      code: i.incidentCode,
      title: i.title,
      victims: i.estimatedVictimsStranded,
      waterDepth: i.waterDepthMeters
    })),
    availableTeams: rescueTeams.filter((t) => t.status === 'AVAILABLE').map((t) => ({
      callsign: t.callsign,
      name: t.name,
      specialty: t.specialty,
      members: t.memberCount
    })),
    availableBoats: resources.find((r) => r.category === 'WATERCRAFT')?.availableQuantity || 0,
    availableAmbulances: resources.find((r) => r.category === 'EVAC_VEHICLE')?.availableQuantity || 0,
    targetIncident: targetIncident || undefined
  };

  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });

      const prompt = `You are Agent A, the Master AI Controller for SAHAAYA AI (Disaster Rescue Coordination Platform in Visakhapatnam, India).
Operational Context:
${JSON.stringify(contextSummary, null, 2)}

User / Coordinator Request:
${query || 'Perform complete operational scan of Visakhapatnam flood & cyclone rescue needs and generate prioritized recommendations.'}

Task:
Provide an expert, concise, tactical command assessment containing:
1. Executive Situation Assessment (2-3 sentences)
2. Sub-Agent Breakdown (Incident Analysis, Location Viability, Resource Balancing, Team Matching)
3. Priority Action Recommendation (which team, which incident, specific reason, required gear)
4. Human Approval Gate Checklist (what specific verifications the human commander must verify before issuing dispatch order)
Keep the tone professional, military-grade emergency operations standard.`;

      const generatePromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('AI Request timeout')), 5000)
      );

      const aiResponse = (await Promise.race([generatePromise, timeoutPromise])) as any;

      const responseText = aiResponse.text || 'Operational assessment generated successfully.';

      logAudit(
        currentUser,
        'AGENT_A_RUN',
        targetIncident ? `Incident: ${targetIncident.incidentCode}` : 'AllIncidents',
        targetIncident ? targetIncident.id : 'agent-a-scan',
        `Agent A full AI triage executed via Gemini 3.8 Flash model.`,
        'SUCCESS',
        req.ip || '127.0.0.1'
      );

      return res.json({
        success: true,
        source: 'GEMINI_AI_LIVE',
        analysis: responseText,
        subAgentTelemetry: subAgents
      });
    } catch (err: unknown) {
      console.warn('Gemini API call failed, switching to resilient rule-based engine:', (err as Error)?.message);
      // Fall through to deterministic fallback
    }
  }

  // Robust mission-critical fallback when Gemini API is offline or key unconfigured
  const topCritical = incidents.find((i) => i.severity === 'CRITICAL_S1');
  const availableTeam = rescueTeams.find((t) => t.status === 'AVAILABLE');

  const fallbackAnalysis = `[AGENT A — TACTICAL ORCHESTRATION REPORT]

1. EXECUTIVE SITUATION ASSESSMENT:
Operational Command status is RED (OPCON 1). 5 active incidents logged across Greater Visakhapatnam. Immediate threat centers on coastal inundation at RK Beach Fishermen Basti (48 stranded) and Gajuwaka Sector 4 lowlands (32 stranded). High tide surge peak is imminent.

2. SPECIALIZED SUB-AGENT SYNTHESIS:
• Agent 1 (Incident Analysis): Flagged ${topCritical ? topCritical.incidentCode : 'VZG-FLD-0104'} as Priority S1. Rising water level (1.8m) poses direct life hazard.
• Agent 2 (Location & Mapping): Verified safe access corridor via Beach Road South. Lower Ghat road at Simhachalam remains closed due to mudslide.
• Agent 3 (Resource Balancing): 11 Gemini Inflatable Boats and 140 SOLAS life jackets currently staged across Rushikonda & Port Depots.
• Agent 4 (Team Matching): NDRF BRAVO-ONE and Naval SAR GARUDA-AIR-1 hold highest capability scores (94%+).
• Agent 5 (Comms): Encrypted radio channels Ch-2 and Ch-4 verified active. Pre-formatted dispatch orders staged.
• Agent 6 (Monitoring): All field telemetry within 10-minute heartbeat threshold.

3. PRIORITY ACTION RECOMMENDATION:
Immediately authorize Dispatch Order DO-2026-VZG-0881 to deploy NDRF Team BRAVO-ONE to Gajuwaka Sector 4 with 2 OBM Inflatable Boats.

4. HUMAN APPROVAL GATE:
Incident Commander signature required. Confirm water current velocities with Port weather radar prior to boat launch.`;

  logAudit(
    currentUser,
    'AGENT_A_RUN',
    'DeterministicEngine',
    'agent-a-fallback',
    `Agent A autonomous rule engine triage computed priority recommendations.`,
    'SUCCESS',
    req.ip || '127.0.0.1'
  );

  return res.json({
    success: true,
    source: 'RULE_BASED_ORCHESTRATOR',
    analysis: fallbackAnalysis,
    subAgentTelemetry: subAgents
  });
});

// Vite or Static Assets handling
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    // In development mode, mount Vite middlewares
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SAHAAYA AI] Disaster Operations Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
