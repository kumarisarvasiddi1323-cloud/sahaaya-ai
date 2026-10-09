import React, { useState } from 'react';
import { Organization, OrgType, User } from '../types/disaster';
import {
  Building2,
  ShieldCheck,
  Phone,
  Radio,
  Plus,
  Users,
  Compass,
  FileCheck,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface OrganizationManagementProps {
  organizations: Organization[];
  currentUser: User;
}

export const OrganizationManagement: React.FC<OrganizationManagementProps> = ({
  organizations,
  currentUser
}) => {
  const [showOnboardModal, setShowOnboardModal] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgType, setNewOrgType] = useState<OrgType>('CIVIL_DEFENSE_NGO');
  const [newOrgZone, setNewOrgZone] = useState('');
  const [newOrgContact, setNewOrgContact] = useState('');
  const [newOrgPhone, setNewOrgPhone] = useState('');
  const [onboardedList, setOnboardedList] = useState<Organization[]>(organizations);

  const handleOnboardOrg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName || !newOrgContact) return;

    const newOrg: Organization = {
      id: `org-custom-${Date.now()}`,
      name: newOrgName,
      code: newOrgName.substring(0, 4).toUpperCase() + '-UNIT',
      type: newOrgType,
      verificationStatus: 'PENDING_VERIFICATION',
      headquarters: 'Visakhapatnam District Operational Post',
      operationalZone: newOrgZone || 'Greater Visakhapatnam Municipal Corporation (GVMC)',
      activeTeamsCount: 1,
      contactPerson: newOrgContact,
      contactPhone: newOrgPhone || '+91 891 000 0000',
      emergencyRadioFreq: '146.500 MHz / AUX-NET',
      authorizedBy: 'Pending District Collector Verification',
      verificationDate: new Date().toISOString().split('T')[0],
      capabilities: ['Field Evacuation Assistance', 'First Aid Trauma Support']
    };

    setOnboardedList([newOrg, ...onboardedList]);
    setShowOnboardModal(false);
    setNewOrgName('');
    setNewOrgContact('');
    setNewOrgPhone('');
    setNewOrgZone('');
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto text-slate-100">
      {/* Header */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-purple-400 font-bold text-xs uppercase tracking-wider">
              AUTHORITY NETWORK
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400">Section 5 Organization Registry</span>
          </div>
          <h2 className="text-2xl font-black text-white">Verified Rescue Organization Network</h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Credentialed disaster response authorities, civil defence units, and naval/military task forces in Visakhapatnam.
          </p>
        </div>

        <button
          onClick={() => setShowOnboardModal(true)}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-600/30 border border-purple-400/40"
        >
          <Plus className="w-4 h-4" />
          <span>Onboard Rescue Agency</span>
        </button>
      </div>

      {/* Demo Data Disclaimer Badge */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-400 flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-orange-400 flex-shrink-0" />
        <span>
          <strong>Simulated Regional Data:</strong> Organizations are demonstrated for the Visakhapatnam (Vizag) emergency zone. Real external rescue organizations are required to undergo digital certificate verification prior to receiving operational dispatch clearance.
        </span>
      </div>

      {/* Organizations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {onboardedList.map((org) => {
          const isVerified = org.verificationStatus === 'VERIFIED';

          return (
            <div
              key={org.id}
              className="bg-[#111827]/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between text-xs"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-800">
                  <span className="font-mono font-bold text-purple-400 text-xs">{org.code}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                    isVerified
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    <ShieldCheck className="w-3 h-3" /> {org.verificationStatus}
                  </span>
                </div>

                <h3 className="font-extrabold text-white text-base mb-1">{org.name}</h3>
                <div className="text-slate-400 text-[11px] mb-3">HQ: {org.headquarters}</div>

                {/* Details box */}
                <div className="bg-slate-900/90 rounded-xl p-3 mb-3 space-y-2 border border-slate-800 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Jurisdiction:</span>
                    <span className="text-white text-right font-medium max-w-[220px]">{org.operationalZone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Active Units:</span>
                    <strong className="text-blue-400 font-mono">{org.activeTeamsCount} Teams</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Radio Mesh:</span>
                    <strong className="text-cyan-400 font-mono">{org.emergencyRadioFreq}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Authorized By:</span>
                    <span className="text-slate-300">{org.authorizedBy}</span>
                  </div>
                </div>

                {/* Contact */}
                <div className="space-y-1 text-[11px] text-slate-300 mb-3">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>Authorized Liaison: <strong>{org.contactPerson}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono">{org.contactPhone}</span>
                  </div>
                </div>

                {/* Capabilities */}
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold mb-1">
                    Certified Capabilities:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {org.capabilities.map((cap, i) => (
                      <span key={i} className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded border border-slate-700">
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-4 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>Verified: {org.verificationDate}</span>
                <span>SEC-REG-{org.code}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Onboard Modal */}
      {showOnboardModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleOnboardOrg}
            className="bg-[#111827] border border-slate-700 rounded-2xl p-6 max-w-lg w-full shadow-2xl text-slate-100 space-y-4 text-xs"
          >
            <h3 className="font-extrabold text-base text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-purple-400" />
              Onboard Verified Disaster Response Organization
            </h3>
            <p className="text-slate-400 text-xs">
              Register a new accredited rescue agency or NGO task force for operational duty.
            </p>

            <div>
              <label className="text-slate-400 block mb-1">Organization Official Title:</label>
              <input
                type="text"
                required
                placeholder="e.g. Visakhapatnam Marine Coastal Patrol Unit"
                value={newOrgName}
                onChange={(e) => setNewOrgName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-purple-500 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Organization Type:</label>
                <select
                  value={newOrgType}
                  onChange={(e) => setNewOrgType(e.target.value as OrgType)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none text-xs"
                >
                  <option value="STATE_SDRF">State SDRF</option>
                  <option value="CIVIL_DEFENSE_NGO">Civil Defence / Volunteer</option>
                  <option value="MEDICAL_PARAMEDIC">Medical & Paramedic</option>
                  <option value="POLICE_FIRE_EMERGENCY">Police & Fire Service</option>
                  <option value="COAST_GUARD">Coast Guard Auxiliary</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Operational Zone:</label>
                <input
                  type="text"
                  placeholder="e.g. North Coastal Vizag Sub-division"
                  value={newOrgZone}
                  onChange={(e) => setNewOrgZone(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Designated Liaison Person:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inspector R. Prasad"
                  value={newOrgContact}
                  onChange={(e) => setNewOrgContact(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none text-xs"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Direct Secure Phone:</label>
                <input
                  type="text"
                  placeholder="+91 94400 00000"
                  value={newOrgPhone}
                  onChange={(e) => setNewOrgPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none text-xs"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowOnboardModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold"
              >
                Register & Audit
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
