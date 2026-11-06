import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Job } from '../../types';
import {
  Briefcase,
  Search,
  Power,
  Trash2,
  Calendar,
  Building2,
  Users,
  MapPin,
  CheckCircle2,
} from 'lucide-react';

export const ManageJobsView: React.FC = () => {
  const { jobs, applications, updateJob, deleteJob } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'OPEN' | 'CLOSED'>('ALL');

  const filteredJobs = jobs.filter((j) => {
    const matchesSearch =
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.companyName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || j.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleStatus = (job: Job) => {
    const nextStatus = job.status === 'OPEN' ? 'CLOSED' : 'OPEN';
    updateJob(job.id, { status: nextStatus });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Campus Placement Drives & Job Postings
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Oversee active corporate openings, regulate application deadlines, and monitor student engagement.
          </p>
        </div>

        <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 self-start sm:self-auto">
          {filteredJobs.length} Drives Registered
        </span>
      </div>

      {/* Filter toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search drive title or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50/50"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50/50"
          >
            <option value="ALL">All Drive Statuses</option>
            <option value="OPEN">Open Only</option>
            <option value="CLOSED">Closed Only</option>
          </select>
        </div>
      </div>

      {/* Drives Grid */}
      <div className="space-y-3.5">
        {filteredJobs.map((job) => {
          const driveApplicants = applications.filter((a) => a.jobId === job.id);
          const isOpen = job.status === 'OPEN';

          return (
            <div
              key={job.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs hover:border-slate-300 transition-all"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
                  {job.companyLogo ? (
                    <img
                      src={job.companyLogo}
                      alt={job.companyName}
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <Building2 className="w-6 h-6 text-slate-400" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{job.title}</h3>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded border ${
                        isOpen
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-slate-100 text-slate-600 border-slate-300'
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-slate-500 mt-1">
                    <span className="font-semibold text-blue-700">{job.companyName}</span>
                    <span>·</span>
                    <span className="font-mono font-bold text-slate-800">{job.ctcLpa} LPA</span>
                    <span>·</span>
                    <span>Min CGPA: {job.minCgpa.toFixed(1)}</span>
                    <span>·</span>
                    <span>Max Backlogs: {job.maxBacklogs}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      Deadline: {job.applicationDeadline}
                    </span>
                  </div>

                  <div className="mt-2 text-[11px] text-slate-600">
                    Branches: <span className="font-medium">{job.eligibleBranches.join(', ')}</span>
                  </div>
                </div>
              </div>

              {/* Stats & Actions */}
              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-sans">Applications</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {driveApplicants.length} Candidates
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => toggleStatus(job)}
                  className={`p-2 rounded-lg border cursor-pointer transition-colors ${
                    isOpen
                      ? 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                  }`}
                  title={isOpen ? 'Close Drive' : 'Re-open Drive'}
                >
                  <Power className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Delete ${job.title} and all candidate applications?`)) {
                      deleteJob(job.id);
                    }
                  }}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 cursor-pointer"
                  title="Delete Drive"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
