import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Company } from '../../types';
import {
  Building2,
  PlusCircle,
  Search,
  ExternalLink,
  Edit,
  Trash2,
  X,
  Mail,
  MapPin,
  Save,
} from 'lucide-react';

export const ManageCompaniesView: React.FC = () => {
  const { companies, addCompany, updateCompany, deleteCompany } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [modalMode, setModalMode] = useState<'ADD' | 'EDIT' | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [tier, setTier] = useState<'Tier 1' | 'Tier 2' | 'Tier 3'>('Tier 1');
  const [website, setWebsite] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState('');

  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAdd = () => {
    setName('');
    setIndustry('Technology & Cloud');
    setTier('Tier 1');
    setWebsite('https://');
    setContactEmail('campus@company.com');
    setLocation('Bengaluru / Hyderabad');
    setDescription('Global technology and digital solutions leader.');
    setLogo('');
    setModalMode('ADD');
  };

  const handleOpenEdit = (c: Company) => {
    setSelectedCompany(c);
    setName(c.name);
    setIndustry(c.industry);
    setTier(c.tier);
    setWebsite(c.website);
    setContactEmail(c.contactEmail);
    setLocation(c.location);
    setDescription(c.description);
    setLogo(c.logo);
    setModalMode('EDIT');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (modalMode === 'ADD') {
      addCompany({
        name,
        industry,
        tier,
        website,
        contactEmail,
        location,
        description,
        logo: logo || 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
      });
    } else if (modalMode === 'EDIT' && selectedCompany) {
      updateCompany(selectedCompany.id, {
        name,
        industry,
        tier,
        website,
        contactEmail,
        location,
        description,
        logo: logo || selectedCompany.logo,
      });
    }
    setModalMode(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Corporate Placement Partners & Companies
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage corporate recruiters, corporate tiers, and industry recruitment tie-ups.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-4 py-2 text-xs font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Add Recruiting Partner
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs text-xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search company name, industry, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50/50"
          />
        </div>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCompanies.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all text-xs"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center p-1.5 overflow-hidden shrink-0">
                    {c.logo ? (
                      <img
                        src={c.logo}
                        alt={c.name}
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <Building2 className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{c.name}</h3>
                    <span className="text-[11px] font-semibold text-blue-700">{c.industry}</span>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    c.tier === 'Tier 1'
                      ? 'bg-purple-50 text-purple-800 border-purple-200'
                      : c.tier === 'Tier 2'
                      ? 'bg-blue-50 text-blue-800 border-blue-200'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {c.tier}
                </span>
              </div>

              <p className="mt-3 text-slate-600 line-clamp-2 leading-relaxed">
                {c.description}
              </p>

              <div className="mt-3 space-y-1 text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{c.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{c.contactEmail}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-slate-400 text-[10px] block">Students Hired</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {c.totalHired} Offers
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(c)}
                  className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded border border-slate-200 cursor-pointer"
                  title="Edit company"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Delete ${c.name} and remove attached job openings?`)) {
                      deleteCompany(c.id);
                    }
                  }}
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded border border-rose-200 cursor-pointer"
                  title="Delete company"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Company Modal */}
      {modalMode && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs"
          onClick={() => setModalMode(null)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 text-left max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">
                {modalMode === 'ADD' ? 'Register New Corporate Partner' : 'Edit Company Details'}
              </h3>
              <button
                type="button"
                onClick={() => setModalMode(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="py-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Company Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50/50"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Industry Sector</label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50/50"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Company Tier</label>
                  <select
                    value={tier}
                    onChange={(e) => setTier(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50/50"
                  >
                    <option value="Tier 1">Tier 1 (Dream Package)</option>
                    <option value="Tier 2">Tier 2 (Core Corporate)</option>
                    <option value="Tier 3">Tier 3 (Mass Recruiter)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Campus HR Email</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50/50"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">HQ / Work Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50/50"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Careers / Company Website</label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Logo URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50/50"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="px-4 py-2 font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  Save Company
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
