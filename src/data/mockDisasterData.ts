import {
  User,
  Organization,
  RescueTeam,
  Incident,
  ResourceInventory,
  DispatchApproval,
  AuditLog,
  OperationalAlert,
  SituationReport,
  AgentASubAgentStatus,
  N8NWebhookConfig
} from '../types/disaster';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-001',
    name: 'Commandant R. Srikar Rao',
    email: 'cmd.srikar.rao@ndrf.gov.in',
    badgeNumber: 'NDRF-10-CMD-094',
    organizationId: 'org-ndrf-10',
    organizationName: '10th Battalion NDRF (Vijayawada / Vizag Unit)',
    role: 'INCIDENT_COMMANDER',
    phone: '+91 94401 22340',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'ON_DUTY',
    lastLoginAt: '2026-10-09T08:15:00Z',
    verifiedCredentials: true,
  },
  {
    id: 'usr-002',
    name: 'Dy. SP Priya Nair',
    email: 'priya.nair@ap.sdrf.gov.in',
    badgeNumber: 'APSDRF-VZG-014',
    organizationId: 'org-sdrf-ap',
    organizationName: 'Andhra Pradesh State Disaster Response Force (SDRF)',
    role: 'DISPATCH_OFFICER',
    phone: '+91 98480 77112',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    lastLoginAt: '2026-10-09T08:45:00Z',
    verifiedCredentials: true,
  },
  {
    id: 'usr-003',
    name: 'Lt. Commander Arjun Varma',
    email: 'arjun.varma@navy.mil.in',
    badgeNumber: 'ENC-SAR-441',
    organizationId: 'org-navy-enc',
    organizationName: 'Indian Navy - Eastern Naval Command SAR Unit',
    role: 'FIELD_TEAM_LEADER',
    phone: '+91 91770 44558',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    status: 'ON_DUTY',
    lastLoginAt: '2026-10-09T09:10:00Z',
    verifiedCredentials: true,
  },
  {
    id: 'usr-004',
    name: 'K. Venkateswara Rao',
    email: 'k.venkat@vzg.dmc.gov.in',
    badgeNumber: 'LOG-VMRDA-808',
    organizationId: 'org-dmc-vzg',
    organizationName: 'Visakhapatnam District Disaster Management Authority (DDMA)',
    role: 'LOGISTICS_CHIEF',
    phone: '+91 99890 33419',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    lastLoginAt: '2026-10-09T07:30:00Z',
    verifiedCredentials: true,
  },
  {
    id: 'usr-005',
    name: 'Dr. Sandeep K. Joshi',
    email: 'sandeep.joshi@ndma.gov.in',
    badgeNumber: 'NDMA-AUD-202',
    organizationId: 'org-ndma-hq',
    organizationName: 'National Disaster Management Authority (Auditor Cell)',
    role: 'AUDIT_OBSERVER',
    phone: '+91 98110 55912',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    lastLoginAt: '2026-10-09T09:20:00Z',
    verifiedCredentials: true,
  }
];

export const INITIAL_ORGANIZATIONS: Organization[] = [
  {
    id: 'org-ndrf-10',
    name: '10th Battalion NDRF (Vijayawada / Vizag Detachment)',
    code: 'NDRF-BN10',
    type: 'GOVERNMENT_NDRF',
    verificationStatus: 'VERIFIED',
    headquarters: 'Gannavaram & Vizag Regional Response Centre',
    operationalZone: 'North Coastal Andhra Pradesh (Srikakulam, Vizianagaram, Visakhapatnam)',
    activeTeamsCount: 6,
    contactPerson: 'Commandant R. Srikar Rao',
    contactPhone: '+91 866 288 2341',
    emergencyRadioFreq: '148.650 MHz / CH-4',
    authorizedBy: 'Ministry of Home Affairs (MHA), GoI',
    verificationDate: '2026-01-15',
    capabilities: [
      'Deep Water Rescue & Swift Water Extrication',
      'Collapsed Structure Search & Rescue (CSSR)',
      'Chemical, Biological, Radiological, Nuclear (CBRN)',
      'Flood Inundation Boat Operations',
      'Canine SAR Teams'
    ]
  },
  {
    id: 'org-sdrf-ap',
    name: 'AP State Disaster Response Force (Vizag Battalion)',
    code: 'APSDRF-VZG',
    type: 'STATE_SDRF',
    verificationStatus: 'VERIFIED',
    headquarters: 'Police Reserve Grounds, Kailasagiri Road, Visakhapatnam',
    operationalZone: 'Greater Visakhapatnam Municipal Corporation (GVMC)',
    activeTeamsCount: 4,
    contactPerson: 'Dy. SP Priya Nair',
    contactPhone: '+91 891 256 7890',
    emergencyRadioFreq: '152.125 MHz / CH-2',
    authorizedBy: 'Government of Andhra Pradesh Disaster Management Dept',
    verificationDate: '2026-02-10',
    capabilities: [
      'Inundated Urban Evacuation',
      'Tree Clearing & Road Obstruction Clearing',
      'Emergency First Aid & Trauma Support',
      'Diver Teams for Submerged Vehicles'
    ]
  },
  {
    id: 'org-navy-enc',
    name: 'Indian Navy — Eastern Naval Command (ENC) SAR Task Force',
    code: 'NAVY-ENC',
    type: 'EASTERN_NAVAL_COMMAND',
    verificationStatus: 'VERIFIED',
    headquarters: 'Naval Base, INS Dega / INS Circars, Visakhapatnam',
    operationalZone: 'Bay of Bengal Littoral Zone & Coastal Hinterlands',
    activeTeamsCount: 5,
    contactPerson: 'Lt. Commander Arjun Varma',
    contactPhone: '+91 891 281 2000',
    emergencyRadioFreq: '156.800 MHz (VHF Ch 16) / TAC-ENC',
    authorizedBy: 'Integrated Defence Staff / Eastern Naval Command',
    verificationDate: '2026-01-05',
    capabilities: [
      'Helicopter Air-Drop & Winch Evacuation (Seaking / ALH)',
      'Gemini Inflatable Assault Craft Operations',
      'Combat Diver Underwater Reconnaissance',
      'Mobile Field Hospital Units'
    ]
  },
  {
    id: 'org-cg-dist6',
    name: 'Indian Coast Guard District Headquarters No. 6 (Vizag)',
    code: 'ICG-DHQ6',
    type: 'COAST_GUARD',
    verificationStatus: 'VERIFIED',
    headquarters: 'Coast Guard Jetty, Port Area, Visakhapatnam',
    operationalZone: 'Coastal Waters & Estuaries from Kalingapatnam to Kakinada',
    activeTeamsCount: 3,
    contactPerson: 'Commandant (JG) Anita Sen',
    contactPhone: '+91 891 256 0422',
    emergencyRadioFreq: '156.300 MHz / CG-OPS',
    authorizedBy: 'Coast Guard Region (East), MoD',
    verificationDate: '2026-01-20',
    capabilities: [
      'Offshore High-Seas Fishermen Rescue',
      'Fast Interceptor Boat Operations',
      'Coastline Breaching Reconnaissance',
      'Emergency Fuel & Towing Operations'
    ]
  },
  {
    id: 'org-kgh-med',
    name: 'King George Hospital (KGH) Disaster Rapid Paramedics',
    code: 'KGH-DRP',
    type: 'MEDICAL_PARAMEDIC',
    verificationStatus: 'VERIFIED',
    headquarters: 'KGH Emergency Complex, Maharanipeta, Visakhapatnam',
    operationalZone: 'All GVMC Incident Sites & Triage Field Posts',
    activeTeamsCount: 3,
    contactPerson: 'Dr. C. Madhava Reddy',
    contactPhone: '+91 891 256 4891',
    emergencyRadioFreq: '149.200 MHz / MED-NET',
    authorizedBy: 'Director of Medical Education, AP',
    verificationDate: '2026-02-01',
    capabilities: [
      'Advanced Cardiac & Trauma Life Support (ACLS)',
      'Submersion Hypothermia Triage',
      'Mobile Triage Casualty Clearing Units',
      'Mass Casualty Decontamination'
    ]
  }
];

export const INITIAL_RESCUE_TEAMS: RescueTeam[] = [
  {
    id: 'team-ndrf-alpha',
    orgId: 'org-ndrf-10',
    orgName: '10th Battalion NDRF',
    name: 'NDRF Bravo Flood Response Team 1',
    callsign: 'BRAVO-ONE',
    specialty: 'WATER_RESCUE',
    status: 'AVAILABLE',
    teamLeader: 'Inspector Manoj Kumar',
    leaderContact: '+91 94401 22901',
    memberCount: 18,
    currentLat: 17.6868,
    currentLng: 83.2185, // Near Gajuwaka Staging Area
    baseLocationName: 'Gajuwaka Industrial Depot Base',
    equipmentSummary: ['4x OBM Inflatable Boats', '40x Life Jackets', '2x Sonar Depth Finders', 'Satellite Phone Iridium'],
    lastCheckIn: '5 mins ago',
    fuelBatteryLevel: 94,
    readinessRating: 9.8
  },
  {
    id: 'team-ndrf-bravo',
    orgId: 'org-ndrf-10',
    orgName: '10th Battalion NDRF',
    name: 'NDRF Heavy Extrication & SAR Team',
    callsign: 'BRAVO-TWO',
    specialty: 'URBAN_SAR',
    status: 'ASSIGNED',
    teamLeader: 'Sub-Inspector Rajiv Sharma',
    leaderContact: '+91 94401 22902',
    memberCount: 16,
    currentLat: 17.7650,
    currentLng: 83.3320, // Near Madhurawada
    baseLocationName: 'Madhurawada Fire Station',
    equipmentSummary: ['Hydraulic Cutters', 'Search Drones with Thermal Sensors', 'Concrete Saws', 'Victim Location Audio Probes'],
    activeIncidentId: 'inc-vzg-002',
    lastCheckIn: '2 mins ago',
    fuelBatteryLevel: 88,
    readinessRating: 9.5
  },
  {
    id: 'team-sdrf-charlie',
    orgId: 'org-sdrf-ap',
    orgName: 'AP SDRF Vizag',
    name: 'SDRF Rapid Coastal Boat Platoon',
    callsign: 'CHARLIE-STRIKE',
    specialty: 'WATER_RESCUE',
    status: 'ON_SCENE',
    teamLeader: 'Inspector Suresh Babu',
    leaderContact: '+91 98480 77150',
    memberCount: 14,
    currentLat: 17.7126,
    currentLng: 83.3235, // RK Beach Fishing Colony
    baseLocationName: 'Coastal Police Station, Beach Road',
    equipmentSummary: ['3x Fibre Rescue Crafts', 'Heavy Dewatering Submersible Pump', '30x Life Buoys', 'First Aid Trauma Bags'],
    activeIncidentId: 'inc-vzg-001',
    lastCheckIn: '1 min ago',
    fuelBatteryLevel: 76,
    readinessRating: 9.1
  },
  {
    id: 'team-navy-sar',
    orgId: 'org-navy-enc',
    orgName: 'Eastern Naval Command',
    name: 'Naval Command Helo SAR & Diver Unit',
    callsign: 'GARUDA-AIR-1',
    specialty: 'AIR_DROP_COASTAL',
    status: 'AVAILABLE',
    teamLeader: 'Lt. Cdr. Arjun Varma',
    leaderContact: '+91 91770 44558',
    memberCount: 12,
    currentLat: 17.7215,
    currentLng: 83.2245, // INS Dega Air Station
    baseLocationName: 'INS Dega Airfield, Vizag',
    equipmentSummary: ['1x Chetak / ALH Helo Ready', 'Deep Sea Diving Gear', 'Winch Rescue Harnesses', 'High-Drop Emergency Rations'],
    lastCheckIn: '8 mins ago',
    fuelBatteryLevel: 98,
    readinessRating: 9.9
  },
  {
    id: 'team-cg-delta',
    orgId: 'org-cg-dist6',
    orgName: 'Indian Coast Guard Dist 6',
    name: 'Coast Guard Harbour Recon & Interceptor',
    callsign: 'SAGAR-SURAKSHA',
    specialty: 'WATER_RESCUE',
    status: 'AVAILABLE',
    teamLeader: 'Assistant Commandant Deepa Nair',
    leaderContact: '+91 891 256 0488',
    memberCount: 10,
    currentLat: 17.6950,
    currentLng: 83.2980, // Port Area Creek
    baseLocationName: 'Visakhapatnam Inner Harbour Berth 4',
    equipmentSummary: ['2x Interceptor Patrol Boats', 'VHF Marine Repeaters', 'High-Beam Night Searchlights', 'Hypothermia Thermal Blankets'],
    lastCheckIn: '3 mins ago',
    fuelBatteryLevel: 92,
    readinessRating: 9.4
  },
  {
    id: 'team-kgh-medics',
    orgId: 'org-kgh-med',
    orgName: 'KGH Paramedic Wing',
    name: 'KGH Critical Mobile Triage Unit 1',
    callsign: 'MEDIC-ONE',
    specialty: 'MEDICAL_EVAC',
    status: 'AVAILABLE',
    teamLeader: 'Dr. Neeraja Sundaram',
    leaderContact: '+91 891 256 4899',
    memberCount: 8,
    currentLat: 17.7100,
    currentLng: 83.3050, // Maharanipeta Base
    baseLocationName: 'King George Hospital Emergency Annex',
    equipmentSummary: ['3x 4WD Field Ambulances', 'Portable Ventilators', 'Defibrillators', 'IV Saline & Anti-Venom Kits'],
    lastCheckIn: '10 mins ago',
    fuelBatteryLevel: 85,
    readinessRating: 9.6
  }
];

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'inc-vzg-001',
    incidentCode: 'VZG-FLD-0104',
    type: 'FLOOD',
    severity: 'CRITICAL_S1',
    status: 'OPERATIONAL',
    title: 'Severe Storm Surge & Flash Inundation at RK Beach Fishermen Basti',
    description: 'High tide combined with severe cyclone rain breached coastal bund. Over 45 fishermen families trapped in single-story masonry dwellings. Water depth 1.8 meters and rising. 4 senior citizens with limited mobility.',
    locationName: 'RK Beach Fishermen Settlement (Near Submarine Museum)',
    coordinates: {
      lat: 17.7145,
      lng: 83.3280
    },
    waterDepthMeters: 1.8,
    estimatedVictimsStranded: 48,
    injuredCount: 6,
    criticalNeeds: ['Inflatable Motorized Boats', 'Paramedic Hypothermia Triage', 'Life Jackets x60', 'High-Calorie Dry Rations'],
    reportedAt: '2026-10-09T08:10:00Z',
    reportedByOrgId: 'org-sdrf-ap',
    reportedByOrgName: 'AP SDRF Vizag',
    verifiedByCommander: true,
    assignedTeamIds: ['team-sdrf-charlie'],
    assignedTeamNames: ['SDRF Rapid Coastal Boat Platoon'],
    priorityScore: 96,
    accessHazards: ['Submerged electrical cables', 'Strong coastal undertow', 'Debris blocking beach approach road'],
    notes: 'Agent A highlighted rising tide at 10:30 AM IST. Immediate secondary boat reinforcement requested.'
  },
  {
    id: 'inc-vzg-002',
    incidentCode: 'VZG-LND-0105',
    type: 'LANDSLIDE',
    severity: 'HIGH_S2',
    status: 'OPERATIONAL',
    title: 'Hillside Mudslide Blocking Simhachalam Ghat Road Access',
    description: 'Heavy torrential rainfall triggered soil collapse along the lower Ghat road. 3 passenger vehicles trapped between boulder falls. 14 people reported stranded inside vehicles with minor injuries.',
    locationName: 'Simhachalam Lower Ghat Curve - Km 4.2',
    coordinates: {
      lat: 17.7680,
      lng: 83.2505
    },
    waterDepthMeters: 0.3,
    estimatedVictimsStranded: 14,
    injuredCount: 3,
    criticalNeeds: ['Heavy Hydraulic Spreaders', 'Concrete Cutters', 'Search Drones with Thermal Vision', 'Field Ambulances'],
    reportedAt: '2026-10-09T08:35:00Z',
    reportedByOrgId: 'org-ndrf-10',
    reportedByOrgName: '10th Battalion NDRF',
    verifiedByCommander: true,
    assignedTeamIds: ['team-ndrf-bravo'],
    assignedTeamNames: ['NDRF Heavy Extrication & SAR Team'],
    priorityScore: 84,
    accessHazards: ['Secondary mudslide risk', 'Slippery steep incline', 'Restricted vehicle turnaround space'],
    notes: 'Road clearance underway. NDRF Bravo on site clearing debris.'
  },
  {
    id: 'inc-vzg-003',
    incidentCode: 'VZG-FLD-0106',
    type: 'FLOOD',
    severity: 'CRITICAL_S1',
    status: 'DISPATCH_PROPOSED',
    title: 'Industrial Lowland Flash Inundation at Gajuwaka Sector 4',
    description: 'Drainage culvert overflow caused 1.6m water accumulation in low-lying worker colony. 32 people (including 8 children) stranded on tin roofs. Heavy industrial runoff in water.',
    locationName: 'Gajuwaka Industrial Belt, Sector 4 (Near Auto Nagar)',
    coordinates: {
      lat: 17.6890,
      lng: 83.2120
    },
    waterDepthMeters: 1.6,
    estimatedVictimsStranded: 32,
    injuredCount: 2,
    criticalNeeds: ['OBM Rescue Boats x2', 'Life Vests x40', 'Water Purification Kits', 'Pediatric Electrolyte Packs'],
    reportedAt: '2026-10-09T09:05:00Z',
    reportedByOrgId: 'org-dmc-vzg',
    reportedByOrgName: 'Visakhapatnam DDMA Control Room',
    verifiedByCommander: false,
    assignedTeamIds: [],
    priorityScore: 92,
    accessHazards: ['Chemical runoff residue', 'Narrow lane navigation requires low-draft inflatable boats'],
    notes: 'Agent A recommends dispatching NDRF BRAVO-ONE (3.2 km away) and MEDIC-ONE.'
  },
  {
    id: 'inc-vzg-004',
    incidentCode: 'VZG-CAP-0107',
    type: 'BOAT_CAPSIZE',
    severity: 'HIGH_S2',
    status: 'DISPATCH_PROPOSED',
    title: 'Fishing Trawler Adrift & Overturned off Gangavaram Breakwater',
    description: 'Mechanized trawler MV Sagarika lost propulsion during sudden gale winds. 7 crew members cling to capsized hull 800m offshore. Sea state 4 with 2.5m swell.',
    locationName: 'Gangavaram Port Outer Breakwater (800m seaward)',
    coordinates: {
      lat: 17.6250,
      lng: 83.2420
    },
    estimatedVictimsStranded: 7,
    injuredCount: 1,
    criticalNeeds: ['Coast Guard Interceptor Boat', 'Naval Chetak Air-Drop Winch', 'Trauma Resuscitation Medics'],
    reportedAt: '2026-10-09T09:20:00Z',
    reportedByOrgId: 'org-cg-dist6',
    reportedByOrgName: 'Indian Coast Guard Dist 6',
    verifiedByCommander: true,
    assignedTeamIds: [],
    priorityScore: 89,
    accessHazards: ['Rough 2.5m breakers', 'Submerged tetrapods near breakwater'],
    notes: 'Agent A proposed dual deployment: GARUDA-AIR-1 (Naval Helo) + SAGAR-SURAKSHA (Coast Guard).'
  },
  {
    id: 'inc-vzg-005',
    incidentCode: 'VZG-URB-0108',
    type: 'BUILDING_COLLAPSE',
    severity: 'MEDIUM_S3',
    status: 'REPORTED',
    title: 'Partial Roof Collapse of Old Godown in One Town Market',
    description: 'Old tiled and masonry roof gave way due to persistent cyclone dampness. Building unoccupied except 3 night watchmen in adjacent storeroom. No fatalities reported.',
    locationName: 'One Town Commercial Market, Main Road',
    coordinates: {
      lat: 17.6980,
      lng: 83.2990
    },
    estimatedVictimsStranded: 3,
    injuredCount: 1,
    criticalNeeds: ['Debris Shoring Equipment', 'Paramedic Dressing', 'Structural Safety Inspector'],
    reportedAt: '2026-10-09T09:35:00Z',
    reportedByOrgId: 'org-dmc-vzg',
    reportedByOrgName: 'GVMC Emergency Control',
    verifiedByCommander: false,
    assignedTeamIds: [],
    priorityScore: 58,
    accessHazards: ['Crowded market alleys', 'Hanging electric cables'],
    notes: 'Local fire station on route. Status pending Agent A validation.'
  }
];

export const INITIAL_RESOURCES: ResourceInventory[] = [
  {
    id: 'res-001',
    category: 'WATERCRAFT',
    name: 'Gemini Inflatable Motorized Rescue Boats (OBM 25HP)',
    totalQuantity: 24,
    availableQuantity: 11,
    allocatedQuantity: 13,
    unit: 'Boats',
    storageHub: 'Vizag Port Central Marine Logistics Depo',
    hubCoordinates: { lat: 17.6910, lng: 83.2910 },
    condition: 'OPERATIONAL',
    assignedIncidents: ['VZG-FLD-0104', 'VZG-FLD-0106'],
    lastInspected: '2026-10-08T18:00:00Z'
  },
  {
    id: 'res-002',
    category: 'LIFE_SUPPORT',
    name: 'Type-1 SOLAS Certified Adult & Child Life Jackets',
    totalQuantity: 350,
    availableQuantity: 140,
    allocatedQuantity: 210,
    unit: 'Units',
    storageHub: 'Rushikonda Emergency Staging Base',
    hubCoordinates: { lat: 17.7820, lng: 83.3850 },
    condition: 'OPERATIONAL',
    assignedIncidents: ['VZG-FLD-0104'],
    lastInspected: '2026-10-09T06:00:00Z'
  },
  {
    id: 'res-003',
    category: 'EVAC_VEHICLE',
    name: 'High-Clearance 4x4 Emergency Trauma Ambulances',
    totalQuantity: 16,
    availableQuantity: 7,
    allocatedQuantity: 9,
    unit: 'Vehicles',
    storageHub: 'KGH Emergency Motor Pool, Maharanipeta',
    hubCoordinates: { lat: 17.7100, lng: 83.3050 },
    condition: 'OPERATIONAL',
    assignedIncidents: ['VZG-FLD-0104', 'VZG-LND-0105'],
    lastInspected: '2026-10-09T07:15:00Z'
  },
  {
    id: 'res-004',
    category: 'SATELLITE_COMMS',
    name: 'Iridium Extreme Satellite Handheld Phones with PTT',
    totalQuantity: 20,
    availableQuantity: 12,
    allocatedQuantity: 8,
    unit: 'Sets',
    storageHub: 'Vizag Collectorate EOC Comms Bunker',
    hubCoordinates: { lat: 17.7180, lng: 83.3150 },
    condition: 'OPERATIONAL',
    assignedIncidents: ['VZG-LND-0105'],
    lastInspected: '2026-10-09T05:30:00Z'
  },
  {
    id: 'res-005',
    category: 'HEAVY_GEAR',
    name: 'High-Volume Submersible Dewatering Trash Pumps (500 LPM)',
    totalQuantity: 18,
    availableQuantity: 5,
    allocatedQuantity: 13,
    unit: 'Pumps',
    storageHub: 'Gajuwaka Industrial Depot Base',
    hubCoordinates: { lat: 17.6868, lng: 83.2185 },
    condition: 'OPERATIONAL',
    assignedIncidents: ['VZG-FLD-0104'],
    lastInspected: '2026-10-08T22:00:00Z'
  },
  {
    id: 'res-006',
    category: 'RELIEF_PACKS',
    name: 'Waterproof Humanitarian Survival Kits (Rations + Water Sachets)',
    totalQuantity: 1200,
    availableQuantity: 480,
    allocatedQuantity: 720,
    unit: 'Kits',
    storageHub: 'Andhra University Indoor Stadium Relief Depot',
    hubCoordinates: { lat: 17.7280, lng: 83.3210 },
    condition: 'OPERATIONAL',
    assignedIncidents: ['VZG-FLD-0104', 'VZG-FLD-0106'],
    lastInspected: '2026-10-09T08:00:00Z'
  },
  {
    id: 'res-007',
    category: 'MEDICAL',
    name: 'Advanced Disaster Resuscitation Field Kits',
    totalQuantity: 30,
    availableQuantity: 14,
    allocatedQuantity: 16,
    unit: 'Kits',
    storageHub: 'KGH Emergency Motor Pool, Maharanipeta',
    hubCoordinates: { lat: 17.7100, lng: 83.3050 },
    condition: 'OPERATIONAL',
    assignedIncidents: ['VZG-FLD-0104'],
    lastInspected: '2026-10-09T07:00:00Z'
  }
];

export const INITIAL_DISPATCH_APPROVALS: DispatchApproval[] = [
  {
    id: 'disp-001',
    incidentId: 'inc-vzg-003',
    incidentCode: 'VZG-FLD-0106',
    incidentTitle: 'Industrial Lowland Flash Inundation at Gajuwaka Sector 4',
    teamId: 'team-ndrf-alpha',
    teamCallsign: 'BRAVO-ONE',
    teamName: 'NDRF Bravo Flood Response Team 1',
    requestedByAgent: 'AGENT_A_ORCHESTRATOR',
    recommendationScore: 94.6,
    confidencePercent: 96,
    recommendedReason: 'Proximity 3.2 km (ETA 12 mins). Team BRAVO-ONE possesses 4x OBM boats required for 32 stranded victims. Water depth 1.6m matches shallow draft vessel specs. Zero fatigue index.',
    requiredResources: [
      { name: 'Gemini Inflatable Boats', quantity: 2 },
      { name: 'SOLAS Life Jackets', quantity: 35 },
      { name: 'Waterproof Survival Kits', quantity: 35 }
    ],
    etaMinutes: 12,
    riskAssessment: 'LOW_TO_MODERATE: Industrial chemical runoff present. Personnel equipped with Hazmat rubber waders.',
    status: 'PENDING_HUMAN_APPROVAL',
    proposedAt: '2026-10-09T09:12:00Z',
    dispatchOrderCode: 'DO-2026-VZG-0881'
  },
  {
    id: 'disp-002',
    incidentId: 'inc-vzg-004',
    incidentCode: 'VZG-CAP-0107',
    incidentTitle: 'Fishing Trawler Adrift & Overturned off Gangavaram Breakwater',
    teamId: 'team-navy-sar',
    teamCallsign: 'GARUDA-AIR-1',
    teamName: 'Naval Command Helo SAR & Diver Unit',
    requestedByAgent: 'AGENT_A_ORCHESTRATOR',
    recommendationScore: 97.2,
    confidencePercent: 98,
    recommendedReason: 'Sea swell 2.5m prevents conventional small craft approach near tetrapod breakwater. Airborne winch extraction via Chetak / ALH provides only viable zero-risk evacuation within golden hour.',
    requiredResources: [
      { name: 'Chetak Helo SAR Sortie', quantity: 1 },
      { name: 'Diver Winch Harnesses', quantity: 4 },
      { name: 'Hypothermia Trauma Packs', quantity: 7 }
    ],
    etaMinutes: 14,
    riskAssessment: 'MODERATE_TO_HIGH: Strong sea spray and gale gusts up to 48 knots. Pilot in command pre-cleared sortie.',
    status: 'PENDING_HUMAN_APPROVAL',
    proposedAt: '2026-10-09T09:25:00Z',
    dispatchOrderCode: 'DO-2026-VZG-0882'
  },
  {
    id: 'disp-003',
    incidentId: 'inc-vzg-001',
    incidentCode: 'VZG-FLD-0104',
    incidentTitle: 'Severe Storm Surge & Flash Inundation at RK Beach Fishermen Basti',
    teamId: 'team-sdrf-charlie',
    teamCallsign: 'CHARLIE-STRIKE',
    teamName: 'SDRF Rapid Coastal Boat Platoon',
    requestedByAgent: 'AGENT_A_ORCHESTRATOR',
    recommendationScore: 99.0,
    confidencePercent: 99,
    recommendedReason: 'Immediate proximity (1.2 km). Stationed at Beach Road. Fast watercraft deployment completed.',
    requiredResources: [
      { name: 'Fibre Rescue Crafts', quantity: 2 },
      { name: 'Life Jackets', quantity: 50 }
    ],
    etaMinutes: 6,
    riskAssessment: 'MODERATE: Surge breaker surf. Team trained in surf-launch maneuvers.',
    status: 'APPROVED',
    proposedAt: '2026-10-09T08:12:00Z',
    approvedByUserId: 'usr-001',
    approvedByName: 'Commandant R. Srikar Rao',
    approvedAt: '2026-10-09T08:14:00Z',
    dispatchOrderCode: 'DO-2026-VZG-0879'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-001',
    timestamp: '2026-10-09T09:25:12Z',
    actorUserId: 'usr-agent-a',
    actorName: 'Agent A Master Controller',
    actorRole: 'INCIDENT_COMMANDER',
    actionType: 'AGENT_A_RUN',
    targetEntity: 'Incident: VZG-CAP-0107',
    targetId: 'inc-vzg-004',
    details: 'Agent A completed multi-agent orchestration scan. Generated Dispatch Recommendation for GARUDA-AIR-1 (Score: 97.2%). Locked for human commander approval.',
    ipAddress: '10.240.11.4 (Internal Secure Bus)',
    status: 'SUCCESS'
  },
  {
    id: 'aud-002',
    timestamp: '2026-10-09T09:12:30Z',
    actorUserId: 'usr-agent-a',
    actorName: 'Agent A Master Controller',
    actorRole: 'INCIDENT_COMMANDER',
    actionType: 'AGENT_A_RUN',
    targetEntity: 'Incident: VZG-FLD-0106',
    targetId: 'inc-vzg-003',
    details: 'Sub-agent 4 (Team Matching) matched NDRF BRAVO-ONE with Gajuwaka flash flood based on OBM boat capacity and zero fatigue.',
    ipAddress: '10.240.11.4 (Internal Secure Bus)',
    status: 'SUCCESS'
  },
  {
    id: 'aud-003',
    timestamp: '2026-10-09T08:45:00Z',
    actorUserId: 'usr-002',
    actorName: 'Dy. SP Priya Nair',
    actorRole: 'DISPATCH_OFFICER',
    actionType: 'USER_LOGIN',
    targetEntity: 'SessionAuth',
    targetId: 'usr-002',
    details: 'Authenticated via 2FA Token & Government ID certificate from AP Police intranet terminal.',
    ipAddress: '117.211.84.19 (AP GOV VPN)',
    status: 'SUCCESS'
  },
  {
    id: 'aud-004',
    timestamp: '2026-10-09T08:14:22Z',
    actorUserId: 'usr-001',
    actorName: 'Commandant R. Srikar Rao',
    actorRole: 'INCIDENT_COMMANDER',
    actionType: 'DISPATCH_APPROVED',
    targetEntity: 'Dispatch: disp-003',
    targetId: 'disp-003',
    details: 'Commander signed digital approval for SDRF CHARLIE-STRIKE deployment to RK Beach settlement. Dispatch Order DO-2026-VZG-0879 issued.',
    ipAddress: '10.240.11.88 (Command EOC Console)',
    status: 'SUCCESS'
  },
  {
    id: 'aud-005',
    timestamp: '2026-10-09T08:11:05Z',
    actorUserId: 'usr-002',
    actorName: 'Dy. SP Priya Nair',
    actorRole: 'DISPATCH_OFFICER',
    actionType: 'INCIDENT_TRIAGED',
    targetEntity: 'Incident: VZG-FLD-0104',
    targetId: 'inc-vzg-001',
    details: 'Incident verified and escalated to CRITICAL_S1 due to rising floodwaters breaching RK Beach coastal bund.',
    ipAddress: '117.211.84.19 (AP GOV VPN)',
    status: 'SUCCESS'
  }
];

export const INITIAL_ALERTS: OperationalAlert[] = [
  {
    id: 'alt-001',
    type: 'DISPATCH_ALERT',
    title: 'NEW DISPATCH ORDER PENDING: Gangavaram Trawler Capsizing',
    message: 'Agent A has recommended Naval Helo SAR unit (GARUDA-AIR-1). 7 fishermen clinging to capsized hull. Immediate commander signature required.',
    priority: 'URGENT',
    sentAt: '2 mins ago',
    channel: 'PLATFORM_PUSH',
    deliveredCount: 8,
    acknowledgedCount: 6
  },
  {
    id: 'alt-002',
    type: 'WEATHER_WARNING',
    title: 'IMD Red Alert: Cyclone Michaung Coastal Surge Approaching Vizag',
    message: 'High tide peak expected at 10:45 AM IST (+2.2m tidal swell). RK Beach, Bheemili, and Gangavaram coastal lowlands under mandatory evacuation watch.',
    priority: 'HIGH',
    sentAt: '25 mins ago',
    channel: 'RADIO_TAC',
    deliveredCount: 24,
    acknowledgedCount: 22
  },
  {
    id: 'alt-003',
    type: 'RESOURCE_DEFICIT',
    title: 'Resource Alert: Dewatering Submersible Pumps at 72% Utilization',
    message: 'Only 5 pumps remaining at Gajuwaka Depot. Logistics Chief advised to request mutual aid from NTPC Simhadri reserves.',
    priority: 'HIGH',
    sentAt: '40 mins ago',
    channel: 'N8N_WEBHOOK',
    deliveredCount: 5,
    acknowledgedCount: 5
  }
];

export const INITIAL_SUB_AGENTS: AgentASubAgentStatus[] = [
  {
    id: 'sub-1',
    code: 'AGENT_1_ANALYSIS',
    name: 'Agent 1: Incident Analysis Agent',
    description: 'Triages disaster severity (S1-S4), identifies conflicting field reports, and calculates casualty impact scores.',
    status: 'ACTIVE',
    lastExecution: '1 min ago',
    insightsCount: 38,
    recentInsight: 'Identified 2 conflicting reports regarding water depth at Gajuwaka Sec 4; normalized to 1.6m based on culvert gauge telemetry.'
  },
  {
    id: 'sub-2',
    code: 'AGENT_2_MAPPING',
    name: 'Agent 2: Location & Mapping Agent',
    description: 'Computes road access viability, terrain slope hazards, and safe staging zones across Visakhapatnam.',
    status: 'ACTIVE',
    lastExecution: 'Just now',
    insightsCount: 42,
    recentInsight: 'Flagged Simhachalam Lower Ghat Rd as impassable for heavy trailers; routed NDRF Bravo via Pendurthi Bypass.'
  },
  {
    id: 'sub-3',
    code: 'AGENT_3_RESOURCES',
    name: 'Agent 3: Resource Management Agent',
    description: 'Monitors real-time stock levels of boats, ambulances, fuel, and medical kits across 5 staging depots.',
    status: 'ACTIVE',
    lastExecution: '3 mins ago',
    insightsCount: 29,
    recentInsight: 'Reserve stock of SOLAS Life Jackets at Rushikonda Base sufficient for 140 additional evacuees.'
  },
  {
    id: 'sub-4',
    code: 'AGENT_4_MATCHING',
    name: 'Agent 4: Rescue Team Matching Agent',
    description: 'Matches specialized disaster capabilities (swift water, diving, structural extrication) to incident demands.',
    status: 'ACTIVE',
    lastExecution: 'Just now',
    insightsCount: 51,
    recentInsight: 'Ranked GARUDA-AIR-1 as #1 match (97.2%) for Gangavaram offshore rescue due to high sea swell.'
  },
  {
    id: 'sub-5',
    code: 'AGENT_5_COMMS',
    name: 'Agent 5: Communication Agent',
    description: 'Dispatches cryptographically verified mission task orders via encrypted radio, SMS, and n8n webhook web bus.',
    status: 'ACTIVE',
    lastExecution: '2 mins ago',
    insightsCount: 64,
    recentInsight: 'Pre-drafted Dispatch Order DO-2026-VZG-0881 and prepared JSON webhook payload for n8n relay.'
  },
  {
    id: 'sub-6',
    code: 'AGENT_6_MONITORING',
    name: 'Agent 6: Situation Monitoring Agent',
    description: 'Tracks SLA timeouts, delayed check-ins (>15 mins), and changes in water level or casualty conditions.',
    status: 'ACTIVE',
    lastExecution: '30 secs ago',
    insightsCount: 19,
    recentInsight: 'All 6 deployed teams have checked in within the last 10 minutes. Operational readiness is stable.'
  }
];

export const INITIAL_SITREP: SituationReport = {
  id: 'sitrep-2026-vzg-04',
  reportCode: 'SITREP-AP-VZG-2026/04',
  title: 'Visakhapatnam Cyclone Flood Emergency Operational SITREP #04',
  reportingPeriod: '09-OCT-2026 06:00 IST to 09-OCT-2026 10:00 IST',
  summary: 'Cyclone Michaung peripheral rainbands generated 142mm localized downpour across Greater Visakhapatnam in 4 hours. Combined with peak astronomical high tide at RK Beach, coastal settlements experienced sudden sea surge. Multi-agency EOC activated under NDRF and SDRF unified command. Agent A autonomous triage active with human commander approval gate.',
  keyMetrics: {
    totalActiveIncidents: 5,
    criticalS1Count: 2,
    peopleRescued: 74,
    peopleStrandedRemaining: 104,
    deployedTeamsCount: 4,
    boatsDeployed: 13,
    ambulancesDeployed: 9
  },
  agentAInsights: [
    'Peak astronomical high tide (2.2m) occurring at 10:45 AM IST will increase flood water depth along RK Beach and Gangavaram by approx 35cm.',
    'Urgent priority: Dispatch of NDRF BRAVO-ONE to Gajuwaka Sec 4 to evacuate 32 factory colony families before industrial runoff spreads.',
    'Naval SAR helicopter sortie recommended for Gangavaram capsize; waterborne rescue vessels cannot safely breach 2.5m shore break.',
    'Simhachalam Ghat debris clearance 60% complete; traffic expected to resume by 11:30 AM IST.'
  ],
  weatherSynopsis: 'Wind speeds sustained at 45-55 km/h, gusting to 70 km/h. Sea State 4 (Rough). Heavy rainfall warning maintained till 18:00 IST.',
  recommendedFocusZones: [
    'Zone 1: RK Beach coastal settlement perimeter',
    'Zone 2: Gajuwaka Industrial Lowlands Sector 4',
    'Zone 3: Gangavaram Port outer breakwater marine perimeter'
  ],
  generatedAt: '2026-10-09T09:40:00Z',
  approvedByCommander: 'Commandant R. Srikar Rao (10th Bn NDRF)'
};

export const INITIAL_N8N_CONFIGS: N8NWebhookConfig[] = [
  {
    id: 'n8n-wh-01',
    name: 'n8n Agent Dispatch Pipeline (WhatsApp & Telegram Alert)',
    endpointUrl: 'https://n8n.your-agency-domain.org/webhook/sahaaya-dispatch-alert',
    eventTrigger: 'DISPATCH_APPROVED',
    active: true,
    lastFiredAt: '2026-10-09T08:14:25Z',
    lastResponseCode: 200
  },
  {
    id: 'n8n-wh-02',
    name: 'n8n Incident Intake & Geocoding Workflow',
    endpointUrl: 'https://n8n.your-agency-domain.org/webhook/sahaaya-incident-intake',
    eventTrigger: 'INCIDENT_CREATED',
    active: true,
    lastFiredAt: '2026-10-09T09:05:15Z',
    lastResponseCode: 200
  },
  {
    id: 'n8n-wh-03',
    name: 'n8n Automated SITREP Publisher (NDMA / SDMA Relay)',
    endpointUrl: 'https://n8n.your-agency-domain.org/webhook/sahaaya-sitrep-publish',
    eventTrigger: 'SITREP_PUBLISHED',
    active: false
  }
];

export const INITIAL_REGISTERED_AGENTS = [
  {
    id: 'agent-reg-1',
    key: 'incident' as const,
    name: 'Incident Agent',
    role: 'Triage, Severity Scoring & Threat Impact Assessment',
    adkToolName: 'triage_incident_data',
    n8nWebhookUrl: 'https://n8n.your-agency.org/webhook/incident-agent',
    status: 'N8N_CONNECTED' as const,
    capabilities: [
      'Disaster classification (Flood, Cyclone, Surge)',
      'Severity triage S1 through S4 calculation',
      'Casualty & stranded count extraction',
      'Water level & hazard identification'
    ],
    lastPing: '2 mins ago',
    lastResponse: 'Classified VZG-FLD-0106 as CRITICAL_S1. 32 stranded with 1.6m water depth.',
    executionCount: 42,
    samplePayload: {
      action: 'triage_incident',
      incidentCode: 'VZG-FLD-0106',
      location: 'Gajuwaka Industrial Lowlands',
      reportedCasualties: 32,
      hazard: 'Rising flood waters (1.6m) with industrial chemical runoff'
    }
  },
  {
    id: 'agent-reg-2',
    key: 'resource' as const,
    name: 'Resource Agent',
    role: 'Real-Time Inventory Allocation & Equipment Balancing',
    adkToolName: 'balance_resources',
    n8nWebhookUrl: 'https://n8n.your-agency.org/webhook/resource-agent',
    status: 'N8N_CONNECTED' as const,
    capabilities: [
      'Watercraft & OBM inflatable boat tracking',
      'Life support & SOLAS life jacket reserves',
      'Ambulance & 4x4 high-water evac vehicles',
      'Dewatering pumps & survival kit checks'
    ],
    lastPing: '1 min ago',
    lastResponse: 'Allocated 2x Gemini Boats & 35x SOLAS Life Jackets from Rushikonda Depot.',
    executionCount: 38,
    samplePayload: {
      action: 'allocate_resources',
      requiredCategory: 'WATERCRAFT',
      neededBoats: 2,
      neededLifeJackets: 35,
      depot: 'Rushikonda Maritime Logistics Depot'
    }
  },
  {
    id: 'agent-reg-3',
    key: 'route' as const,
    name: 'Route Agent',
    role: 'Safe Corridor GIS Analysis & Hazard Avoidance',
    adkToolName: 'calculate_safe_route',
    n8nWebhookUrl: 'https://n8n.your-agency.org/webhook/route-agent',
    status: 'N8N_CONNECTED' as const,
    capabilities: [
      'GIS flood inundation road blockage mapping',
      'Ghat road debris avoidance routing',
      'Optimal ingress/egress corridor calculation',
      'ETA computation based on waterlogged terrain'
    ],
    lastPing: '3 mins ago',
    lastResponse: 'Corridor established via Steel Plant Bypass Road. Avoided submerged Highway 16.',
    executionCount: 45,
    samplePayload: {
      action: 'compute_route',
      originCoordinates: { lat: 17.7005, lng: 83.2104 },
      destinationCoordinates: { lat: 17.6912, lng: 83.2045 },
      roadHazardsToAvoid: ['NH-16 submerged underpass', 'Old Gajuwaka culvert']
    }
  },
  {
    id: 'agent-reg-4',
    key: 'response' as const,
    name: 'Response Agent',
    role: 'Team Matching, Readiness Scoring & Dispatch Proposal',
    adkToolName: 'match_response_team',
    n8nWebhookUrl: 'https://n8n.your-agency.org/webhook/response-agent',
    status: 'N8N_CONNECTED' as const,
    capabilities: [
      'NDRF / SDRF / Coast Guard capability matching',
      'Crew fatigue rating & certification validation',
      'Formal Dispatch Order generation',
      'Human Commander Safety Gate submission'
    ],
    lastPing: 'Just now',
    lastResponse: 'Recommended NDRF BRAVO-ONE (96% readiness score). Dispatch Order DO-0881 queued.',
    executionCount: 31,
    samplePayload: {
      action: 'generate_dispatch_order',
      incidentCode: 'VZG-FLD-0106',
      recommendedTeamCallsign: 'BRAVO-ONE',
      organization: 'NDRF 10th Battalion',
      confidencePercent: 96
    }
  },
  {
    id: 'agent-reg-5',
    key: 'monitor' as const,
    name: 'Monitor Agent',
    role: 'Real-Time Telemetry Watchdog, SLA Tracking & Heartbeats',
    adkToolName: 'monitor_mission_telemetry',
    n8nWebhookUrl: 'https://n8n.your-agency.org/webhook/monitor-agent',
    status: 'N8N_CONNECTED' as const,
    capabilities: [
      'Field crew GPS heartbeat tracking (<10m SLA)',
      'Rising water level trend monitoring',
      'Delayed acknowledgement escalation',
      'Autonomous alert broadcast triggering'
    ],
    lastPing: 'Just now',
    lastResponse: 'Heartbeat healthy across all 4 deployed units. Water rise rate steady at +2cm/hr.',
    executionCount: 64,
    samplePayload: {
      action: 'telemetry_heartbeat',
      activeDeployments: 4,
      slaStatus: 'OPTIMAL',
      heartbeatThresholdSec: 600
    }
  }
];

