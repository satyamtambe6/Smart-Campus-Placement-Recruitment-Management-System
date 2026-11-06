import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../common/StatCard';
import { PlacementStatsCharts } from './PlacementStatsCharts';
import {
  Users,
  Building2,
  Briefcase,
  Award,
  CheckCircle2,
  AlertCircle,
  FileText,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { placementStats, students, companies, jobs, applications, verifyStudent, setActiveTab } =
    useApp();

  const pendingVerificationStudents = students.filter((s) => !s.isVerified);

  return (
    <div className="space-y-6">
      {/* Admin Command Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Placement Cell Central Console
            </span>
            <span>·</span>
            <span>Academic Year 2026-2027</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Directorate of Career Services & Placement Administration
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
            Real-time tracking of university placement drives, company corporate tie-ups, student verification statuses, and automated eligibility enforcement.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('manage-students')}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
          >
            Manage Students
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('manage-companies')}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Partner Companies
          </button>
        </div>
      </div>

      {/* Main KPI Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Registered Students"
          value={placementStats.totalStudents}
          subtitle={`${placementStats.totalPlaced} placed (${placementStats.placementPercentage}%)`}
          icon={Users}
          badge={`${placementStats.placementPercentage}% Placed`}
        />
        <StatCard
          title="Average CTC Offered"
          value={`${placementStats.averagePackageLPA} LPA`}
          subtitle={`Highest Package: ${placementStats.highestPackageLPA} LPA`}
          icon={Award}
          trend={{ positive: true, text: 'Top Tier' }}
        />
        <StatCard
          title="Corporate Partner Companies"
          value={placementStats.totalCompanies}
          subtitle="Google, Microsoft, TI, etc."
          icon={Building2}
        />
        <StatCard
          title="Total Placement Drives"
          value={placementStats.totalOpenings}
          subtitle={`${applications.length} submitted applications`}
          icon={Briefcase}
        />
      </div>

      {/* Pending Verifications Notice Bar */}
      {pendingVerificationStudents.length > 0 && (
        <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
            <div>
              <p className="font-bold text-amber-900">
                {pendingVerificationStudents.length} Student Profile(s) Awaiting Academic Verification
              </p>
              <p className="text-amber-800 mt-0.5">
                Students cannot apply for campus drives until transcripts and backlogs are verified.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('manage-students')}
            className="px-3.5 py-1.5 font-bold rounded-lg bg-amber-700 text-white hover:bg-amber-800 transition-colors shrink-0 cursor-pointer"
          >
            Review Transcripts
          </button>
        </div>
      )}

      {/* Interactive Charts Section */}
      <PlacementStatsCharts />

      {/* Split Section: Recent Partner Companies & Recent Drives */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Companies Overview */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Top Recruiting Partners</h2>
              <p className="text-xs text-slate-500">Corporate recruiters registered with the placement cell</p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('manage-companies')}
              className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center cursor-pointer"
            >
              View All <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {companies.slice(0, 4).map((c) => (
              <div key={c.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center p-1 overflow-hidden shrink-0">
                    {c.logo ? (
                      <img
                        src={c.logo}
                        alt={c.name}
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <Building2 className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{c.name}</h3>
                    <p className="text-[11px] text-slate-500">{c.industry} · {c.location}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-slate-800 block">
                    {c.totalHired} Hired
                  </span>
                  <span className="text-[10px] text-blue-700 font-semibold">{c.tier}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Drives Overview */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Current Placement Drives</h2>
              <p className="text-xs text-slate-500">Active positions with criteria cutoffs</p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('manage-jobs')}
              className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center cursor-pointer"
            >
              View All <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {jobs.slice(0, 4).map((job) => (
              <div key={job.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div>
                  <h3 className="font-bold text-slate-900">{job.title}</h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                    <span className="text-blue-700 font-medium">{job.companyName}</span>
                    <span>·</span>
                    <span className="font-mono font-semibold text-slate-800">{job.ctcLpa} LPA</span>
                    <span>·</span>
                    <span>Min CGPA: {job.minCgpa.toFixed(1)}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                    {job.status}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Deadline: {job.applicationDeadline}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
