import React, { useState } from 'react';
import {
  ResourceInventory,
  ResourceCategory,
  User,
  Incident
} from '../types/disaster';
import {
  Boxes,
  ShieldAlert,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Send,
  Plus,
  Compass,
  Layers,
  Activity
} from 'lucide-react';

interface ResourceInventoryProps {
  resources: ResourceInventory[];
  incidents: Incident[];
  currentUser: User;
  onAllocateResource: (resourceId: string, quantity: number, incidentCode: string) => void;
}

export const ResourceInventoryView: React.FC<ResourceInventoryProps> = ({
  resources,
  incidents,
  currentUser,
  onAllocateResource
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [allocatingResource, setAllocatingResource] = useState<ResourceInventory | null>(null);
  const [allocateQty, setAllocateQty] = useState<number>(1);
  const [selectedIncidentCode, setSelectedIncidentCode] = useState<string>(
    incidents[0]?.incidentCode || ''
  );

  const filteredResources = resources.filter((res) => {
    const matchesSearch =
      res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.storageHub.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || res.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleConfirmAllocation = () => {
    if (!allocatingResource || !selectedIncidentCode) return;
    onAllocateResource(allocatingResource.id, allocateQty, selectedIncidentCode);
    setAllocatingResource(null);
    setAllocateQty(1);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto text-slate-100">
      {/* Header */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-emerald-400 font-bold text-xs uppercase tracking-wider">
              VIZAG LOGISTICS GRID
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400">Section 4 (Agent 3 Resource Balancer)</span>
          </div>
          <h2 className="text-2xl font-black text-white">Disaster Equipment & Resource Inventory</h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Monitor real-time inventory of rescue boats, ambulances, satellite phones, life jackets, and relief packs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-center">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Tracked Categories:</div>
            <div className="text-xl font-black text-emerald-400 font-mono">
              7 Staging Depots
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-[#111827]/80 border border-slate-800 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search equipment, depot hub..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-400 text-[11px]">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="WATERCRAFT">Watercraft (Boats)</option>
            <option value="LIFE_SUPPORT">Life Support (Vests)</option>
            <option value="EVAC_VEHICLE">Ambulances</option>
            <option value="SATELLITE_COMMS">Satellite Comms</option>
            <option value="HEAVY_GEAR">Dewatering Pumps</option>
            <option value="RELIEF_PACKS">Relief Rations</option>
            <option value="MEDICAL">Medical Trauma Kits</option>
          </select>
        </div>
      </div>

      {/* Resource Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map((res) => {
          const utilPercent = Math.round((res.allocatedQuantity / res.totalQuantity) * 100);
          const isLowStock = res.availableQuantity / res.totalQuantity <= 0.25;

          return (
            <div
              key={res.id}
              className={`rounded-2xl border p-5 flex flex-col justify-between transition-all bg-[#111827]/90 shadow-xl ${
                isLowStock ? 'border-amber-500/40 bg-gradient-to-b from-amber-950/20 to-[#111827]' : 'border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-800">
                  <span className="font-mono text-emerald-400 text-xs font-bold">{res.category}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    isLowStock
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {res.condition}
                  </span>
                </div>

                <h3 className="font-extrabold text-white text-base mb-1.5">{res.name}</h3>
                <div className="text-[11px] text-slate-300 mb-3 flex items-start gap-1">
                  <span className="text-orange-400">📦</span>
                  <span>Depot: <strong>{res.storageHub}</strong></span>
                </div>

                {/* Stock utilization bar */}
                <div className="bg-slate-900/90 rounded-xl p-3 mb-3 border border-slate-800">
                  <div className="flex justify-between text-xs mb-1 font-mono">
                    <span className="text-slate-400">Availability:</span>
                    <strong className={isLowStock ? 'text-amber-400' : 'text-emerald-400'}>
                      {res.availableQuantity} of {res.totalQuantity} {res.unit}
                    </strong>
                  </div>

                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isLowStock ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${100 - utilPercent}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                    <span>Allocated: {res.allocatedQuantity} {res.unit} ({utilPercent}%)</span>
                    <span>Ready: {res.availableQuantity} {res.unit}</span>
                  </div>
                </div>

                {/* Assigned Incidents */}
                <div className="mb-3">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                    Deployed to Active Incidents:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {res.assignedIncidents.length > 0 ? (
                      res.assignedIncidents.map((code, idx) => (
                        <span key={idx} className="bg-slate-800 text-orange-300 font-mono text-[10px] px-2 py-0.5 rounded border border-slate-700">
                          {code}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-500 text-[10px]">None currently allocated</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-800">
                <button
                  onClick={() => {
                    setAllocatingResource(res);
                    setAllocateQty(1);
                  }}
                  disabled={res.availableQuantity <= 0}
                  className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                    res.availableQuantity > 0
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 active:scale-95'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Allocate to Incident</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Resource Allocation Modal */}
      {allocatingResource && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl text-slate-100">
            <h3 className="font-extrabold text-base text-white mb-1 flex items-center gap-2">
              <Boxes className="w-5 h-5 text-emerald-400" />
              Dispatch Equipment Allocation
            </h3>
            <p className="text-xs text-slate-300 mb-4">
              {allocatingResource.name} (Max available: {allocatingResource.availableQuantity} {allocatingResource.unit})
            </p>

            <div className="space-y-4 mb-5">
              <div>
                <label className="text-slate-400 text-xs block mb-1">Target Disaster Incident:</label>
                <select
                  value={selectedIncidentCode}
                  onChange={(e) => setSelectedIncidentCode(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                >
                  {incidents.map((inc) => (
                    <option key={inc.id} value={inc.incidentCode}>
                      {inc.incidentCode} — {inc.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 text-xs block mb-1">
                  Quantity ({allocatingResource.unit}):
                </label>
                <input
                  type="number"
                  min={1}
                  max={allocatingResource.availableQuantity}
                  value={allocateQty}
                  onChange={(e) => setAllocateQty(parseInt(e.target.value, 10) || 1)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 justify-end">
              <button
                onClick={() => setAllocatingResource(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAllocation}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
              >
                Confirm Allocation & Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
