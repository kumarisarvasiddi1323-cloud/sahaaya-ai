/**
 * SAHAAYA AI — Core Disaster Response Domain Models & Types
 * Designed for emergency operations in Visakhapatnam (Vizag) and regional disaster zones.
 */

export type UserRole =
  | 'INCIDENT_COMMANDER'   // Full authorization, dispatch approval, escalation
  | 'DISPATCH_OFFICER'     // Prepares dispatch packages, monitors teams
  | 'FIELD_TEAM_LEADER'    // Reports telemetry, on-scene status, casualty counts
  | 'LOGISTICS_CHIEF'      // Resource inventory, replenishment, depot allocations
  | 'AUDIT_OBSERVER';      // Read-only compliance and audit inspector

export interface User {
  id: string;
  name: string;
  email: string;
  badgeNumber: string;
  organizationId: string;
  organizationName: string;
  role: UserRole;
  phone: string;
  avatarUrl?: string;
  status: 'ACTIVE' | 'ON_DUTY' | 'STANDBY' | 'DEACTIVATED';
  lastLoginAt: string;
  verifiedCredentials: boolean;
}

export type OrgType =
  | 'GOVERNMENT_NDRF'
  | 'STATE_SDRF'
  | 'COAST_GUARD'
  | 'EASTERN_NAVAL_COMMAND'
  | 'POLICE_FIRE_EMERGENCY'
  | 'CIVIL_DEFENSE_NGO'
  | 'MEDICAL_PARAMEDIC';

export interface Organization {
  id: string;
  name: string;
  code: string;
  type: OrgType;
  verificationStatus: 'VERIFIED' | 'PENDING_VERIFICATION' | 'REVOKED';
  headquarters: string;
  operationalZone: string;
  activeTeamsCount: number;
  contactPerson: string;
  contactPhone: string;
  emergencyRadioFreq: string;
  authorizedBy: string;
  verificationDate: string;
  capabilities: string[];
}

export type TeamSpecialty =
  | 'WATER_RESCUE'
  | 'MEDICAL_EVAC'
  | 'HAZMAT_SEARCH'
  | 'URBAN_SAR'
  | 'AIR_DROP_COASTAL'
  | 'DEBRIS_EXTRICATION'
  | 'LOGISTICS_COMMUNICATION';

export type TeamStatus =
  | 'AVAILABLE'
  | 'ASSIGNED'
  | 'EN_ROUTE'
  | 'ON_SCENE'
  | 'RESTING'
  | 'OUT_OF_SERVICE';

export interface RescueTeam {
  id: string;
  orgId: string;
  orgName: string;
  name: string;
  callsign: string;
  specialty: TeamSpecialty;
  status: TeamStatus;
  teamLeader: string;
  leaderContact: string;
  memberCount: number;
  currentLat: number;
  currentLng: number;
  baseLocationName: string;
  equipmentSummary: string[];
  activeIncidentId?: string;
  lastCheckIn: string;
  fuelBatteryLevel?: number; // percentage
  readinessRating: number;   // 1 to 10
}

export type DisasterType =
  | 'FLOOD'
  | 'CYCLONE'
  | 'LANDSLIDE'
  | 'BUILDING_COLLAPSE'
  | 'COASTAL_SURGE'
  | 'BOAT_CAPSIZE'
  | 'CHEMICAL_LEAK';

export type IncidentSeverity =
  | 'CRITICAL_S1' // Immediate life hazard, >20 people stranded, rising floodwaters
  | 'HIGH_S2'     // Severe injury risk, structural instability, evacuation urgent
  | 'MEDIUM_S3'   // Medical/rations assistance needed, access compromised
  | 'LOW_S4';     // Monitoring, localized clearing, minor logistics

export type IncidentStatus =
  | 'REPORTED'
  | 'AGENT_ANALYZING'
  | 'DISPATCH_PROPOSED'
  | 'DISPATCHED'
  | 'OPERATIONAL'
  | 'STABILIZED'
  | 'RESOLVED';

export interface Incident {
  id: string;
  incidentCode: string;
  type: DisasterType;
  severity: IncidentSeverity;
  status: IncidentStatus;
  title: string;
  description: string;
  locationName: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  waterDepthMeters?: number;
  estimatedVictimsStranded: number;
  injuredCount: number;
  criticalNeeds: string[];
  reportedAt: string;
  reportedByOrgId: string;
  reportedByOrgName: string;
  verifiedByCommander: boolean;
  assignedTeamIds: string[];
  assignedTeamNames?: string[];
  priorityScore: number; // 0 - 100 calculated by Agent A
  accessHazards: string[];
  notes?: string;
}

export interface IncidentUpdate {
  id: string;
  incidentId: string;
  timestamp: string;
  authorName: string;
  authorRole: UserRole;
  updateText: string;
  statusChange?: IncidentStatus;
  casualtiesEvacuated?: number;
}

export type ResourceCategory =
  | 'WATERCRAFT'
  | 'MEDICAL'
  | 'EVAC_VEHICLE'
  | 'SATELLITE_COMMS'
  | 'LIFE_SUPPORT'
  | 'RELIEF_PACKS'
  | 'HEAVY_GEAR';

export interface ResourceInventory {
  id: string;
  category: ResourceCategory;
  name: string;
  totalQuantity: number;
  availableQuantity: number;
  allocatedQuantity: number;
  unit: string;
  storageHub: string;
  hubCoordinates: { lat: number; lng: number };
  condition: 'OPERATIONAL' | 'STANDBY' | 'MAINTENANCE_REQUIRED';
  assignedIncidents: string[];
  lastInspected: string;
}

export interface DispatchApproval {
  id: string;
  incidentId: string;
  incidentCode: string;
  incidentTitle: string;
  teamId: string;
  teamCallsign: string;
  teamName: string;
  requestedByAgent: 'AGENT_A_ORCHESTRATOR';
  recommendationScore: number;
  confidencePercent: number;
  recommendedReason: string;
  requiredResources: { name: string; quantity: number }[];
  etaMinutes: number;
  riskAssessment: string;
  status: 'PENDING_HUMAN_APPROVAL' | 'APPROVED' | 'REJECTED' | 'OVERRIDDEN';
  proposedAt: string;
  approvedByUserId?: string;
  approvedByName?: string;
  approvedAt?: string;
  rejectionReason?: string;
  dispatchOrderCode?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorUserId: string;
  actorName: string;
  actorRole: UserRole;
  actionType:
    | 'USER_LOGIN'
    | 'INCIDENT_TRIAGED'
    | 'AGENT_A_RUN'
    | 'DISPATCH_APPROVED'
    | 'DISPATCH_REJECTED'
    | 'RESOURCE_ALLOCATED'
    | 'STATUS_OVERRIDE'
    | 'ALERT_BROADCAST'
    | 'N8N_WEBHOOK_TRIGGER'
    | 'TEAM_STATUS_UPDATE';
  targetEntity: string;
  targetId: string;
  details: string;
  ipAddress: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
}

export interface OperationalAlert {
  id: string;
  type: 'DISPATCH_ALERT' | 'SITREP_UPDATE' | 'RESOURCE_DEFICIT' | 'WEATHER_WARNING' | 'N8N_OUTBOUND';
  title: string;
  message: string;
  priority: 'URGENT' | 'HIGH' | 'NORMAL';
  sentAt: string;
  channel: 'RADIO_TAC' | 'SMS_PRIORITY' | 'N8N_WEBHOOK' | 'PLATFORM_PUSH';
  deliveredCount: number;
  acknowledgedCount: number;
}

export interface SituationReport {
  id: string;
  reportCode: string;
  title: string;
  reportingPeriod: string;
  summary: string;
  keyMetrics: {
    totalActiveIncidents: number;
    criticalS1Count: number;
    peopleRescued: number;
    peopleStrandedRemaining: number;
    deployedTeamsCount: number;
    boatsDeployed: number;
    ambulancesDeployed: number;
  };
  agentAInsights: string[];
  weatherSynopsis: string;
  recommendedFocusZones: string[];
  generatedAt: string;
  approvedByCommander: string;
}

export interface AgentASubAgentStatus {
  id: string;
  name: string;
  code: string;
  description: string;
  status: 'ACTIVE' | 'PROCESSING' | 'IDLE' | 'ALERT';
  lastExecution: string;
  insightsCount: number;
  recentInsight: string;
}

export interface N8NWebhookConfig {
  id: string;
  name: string;
  endpointUrl: string;
  eventTrigger: 'INCIDENT_CREATED' | 'DISPATCH_APPROVED' | 'SITREP_PUBLISHED' | 'AGENT_A_ALERT';
  active: boolean;
  lastFiredAt?: string;
  lastResponseCode?: number;
}

export interface RegisteredAgent {
  id: string;
  key: 'incident' | 'resource' | 'route' | 'response' | 'monitor';
  name: string;
  role: string;
  adkToolName: string;
  n8nWebhookUrl: string;
  status: 'REGISTERED' | 'N8N_CONNECTED' | 'DISPATCHING';
  capabilities: string[];
  lastPing?: string;
  lastResponse?: string;
  executionCount: number;
  samplePayload: any;
}

export interface OrchestratorTraceStep {
  step: number;
  agentKey: 'incident' | 'resource' | 'route' | 'response' | 'monitor' | 'orchestrator';
  agentName: string;
  action: string;
  toolInvoked: string;
  latencyMs: number;
  payloadSent: any;
  responseReceived: any;
  status: 'SUCCESS' | 'RUNNING' | 'WAITING' | 'ERROR';
  timestamp: string;
}

export interface OrchestrationResult {
  orchestrationId: string;
  query: string;
  timestamp: string;
  engine: 'GOOGLE_GENAI_ADK' | 'RULE_ENGINE_ADK_FALLBACK';
  model: string;
  latencyTotalMs: number;
  executiveSummary: string;
  traceSteps: OrchestratorTraceStep[];
  coordinatedRecommendation: {
    targetIncidentCode: string;
    targetLocation: string;
    incidentSeverity: IncidentSeverity;
    matchedTeamCallsign: string;
    matchedTeamName: string;
    requiredBoats: number;
    requiredAmbulances: number;
    safeRouteCorridor: string;
    hazardsAvoided: string[];
    etaMinutes: number;
    urgencyScore: number;
    riskAssessment: string;
    dispatchOrderCode: string;
  };
  humanGateStatus: 'PENDING_COMMANDER_SIGNATURE' | 'APPROVED';
}

