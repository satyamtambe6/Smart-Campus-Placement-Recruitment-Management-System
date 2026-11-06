import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../common/StatCard';
import { StatusBadge } from '../common/StatusBadge';
import { PostJobModal } from './PostJobModal';
import {
  Briefcase,
  Users,
  Award,
  CheckCircle2,
  PlusCircle,
  Building2,
  Calendar,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const RecruiterDashboard: React.FC = () => {
  const { currentRecruiter, companies, jobs, applications, setActiveTab } = useApp();
  const [postModalOpen, setPostModalOpen] = useState(false);

  const recruiterCompany =
    companies.find((c) => c.id === currentRecruiter?.companyId) || companies[0];

  const myCompanyJobs = jobs.filter((j) => j.companyId === recruiterCompany.id);
  const myCompanyApplications = applications.filter((a) => a.companyId === recruiterCompany.id);

  const activeJobsCount = myCompanyJobs.filter((j) => j.status === 'OPEN').length;
  const shortlistedCount = myCompanyApplications.filter(
    (a) => a.status === 'SHORTLISTED' || a.status === 'TECHNICAL_ROUND' || a.status === 'HR_ROUND'
  ).length;
  const offeredCount = myCompanyApplications.filter((a) => a.status === 'OFFERED').length;

  return (
    <div className="space-y-6">
      {/* Recruiter Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden p-2">
            {recruiterCompany.logo ? (
              <img
                src={recruiterCompany.logo}
                alt={recruiterCompany.name}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            ) : (
              <Building2 className="w-8 h-8 text-slate-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>{recruiterCompany.name}</span>
              <span aria-hidden="true">·</span>
              <span>{currentRecruiter?.designation || 'Campus Talent Partner'}</span>
              <span aria-hidden="true">·</span>
              <span className="text-blue-700 font-semibold">{recruiterCompany.tier}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Recruiter Command Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Manage live campus recruitment drives, configure strict academic eligibility thresholds, and advance candidates through interview rounds.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setPostModalOpen(true)}
            className="px-4 py-2 text-xs font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            Post New Job Opening
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Open Positions"
          value={activeJobsCount}
          subtitle={`Across ${myCompanyJobs.length} total postings`}
          icon={Briefcase}
          badge="Live on Portal"
        />
        <StatCard
          title="Total Applications"
          value={myCompanyApplications.length}
          subtitle="Passed eligibility check"
          icon={Users}
        />
        <StatCard
          title="In Interview Pipeline"
          value={shortlistedCount}
          subtitle="Shortlisted & Tech Rounds"
          icon={CheckCircle2}
          trend={{ positive: true, text: 'Active' }}
        />
        <StatCard
          title="Campus Offers Rolled"
          value={offeredCount}
          subtitle="Selected & Hired"
          icon={Award}
          badge="Offers Extended"
        />
      </div>

      {/* Active Postings & Pipeline Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Openings */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Company Job Postings</h2>
              <p className="text-xs text-slate-500">Live campus recruitment drives</p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('recruiter-jobs')}
              className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center cursor-pointer"
            >
              Manage <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {myCompanyJobs.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No job postings created yet. Click "Post New Job Opening" to begin.
              </div>
            ) : (
              myCompanyJobs.map((job) => (
                <div key={job.id} className="py-3 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{job.title}</h3>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span className="font-mono font-semibold text-slate-800">{job.ctcLpa} LPA</span>
                      <span>·</span>
                      <span>Min CGPA: {job.minCgpa.toFixed(1)}</span>
                      <span>·</span>
                      <span>Deadline: {job.applicationDeadline}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 font-mono">
                      {applications.filter((a) => a.jobId === job.id).length} applicants
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Incoming Applicants Queue */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Recent Candidate Submissions</h2>
              <p className="text-xs text-slate-500">Applicants awaiting evaluation</p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('recruiter-applications')}
              className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center cursor-pointer"
            >
              View Pipeline <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {myCompanyApplications.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No candidate applications received yet.
              </div>
            ) : (
              myCompanyApplications.slice(0, 5).map((app) => (
                <div key={app.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-slate-900">{app.studentName}</h3>
                      <span className="text-[10px] text-slate-400 font-mono">
                        ({app.studentRollNumber})
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span>{app.studentBranch}</span>
                      <span>·</span>
                      <span className="font-mono font-semibold text-slate-700">
                        CGPA {app.studentCgpa.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <StatusBadge status={app.status} size="sm" />
                    <button
                      type="button"
                      onClick={() => setActiveTab('recruiter-applications')}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                    >
                      Review
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <PostJobModal isOpen={postModalOpen} onClose={() => setPostModalOpen(false)} />
    </div>
  );
};
