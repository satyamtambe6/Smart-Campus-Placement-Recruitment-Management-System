import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../common/StatCard';
import { StatusBadge } from '../common/StatusBadge';
import { EligibilityBadge } from '../common/EligibilityBadge';
import { checkStudentEligibility } from '../../utils/eligibility';
import {
  Briefcase,
  CheckCircle2,
  Clock,
  Award,
  ChevronRight,
  AlertCircle,
  FileText,
  Building2,
  Sparkles,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { currentStudent, jobs, applications, setActiveTab } = useApp();

  if (!currentStudent) {
    return (
      <div className="p-8 text-center text-slate-500">
        No student profile linked. Please switch persona or log in as a student.
      </div>
    );
  }

  // Student specific calculations
  const myApplications = applications.filter((a) => a.studentId === currentStudent.id);
  const eligibleJobs = jobs.filter((j) => {
    const res = checkStudentEligibility(currentStudent, j);
    return res.isEligible;
  });

  const offeredApp = myApplications.find((a) => a.status === 'OFFERED');

  return (
    <div className="space-y-6">
      {/* Student Welcome Hero Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Roll No: {currentStudent.rollNumber}</span>
            <span aria-hidden="true">·</span>
            <span>{currentStudent.branch}</span>
            <span aria-hidden="true">·</span>
            <span className={currentStudent.isVerified ? 'text-emerald-700 font-medium' : 'text-amber-700 font-medium'}>
              {currentStudent.isVerified ? 'Verified by Placement Cell' : 'Verification Pending'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Welcome back, {currentStudent.fullName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            {currentStudent.placementStatus === 'PLACED'
              ? `🎉 Congratulations! You have secured a campus placement with ${currentStudent.placedCompany} at ${currentStudent.packageLPA} LPA.`
              : 'Track active placement drives, automated eligibility for campus openings, and interview rounds.'}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('jobs')}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <Briefcase className="w-4 h-4" />
            Browse Open Drives ({jobs.filter((j) => j.status === 'OPEN').length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Offers Spotlight if Placed */}
      {offeredApp && (
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                Campus Offer Received
              </span>
              <h2 className="text-base font-bold text-slate-900 mt-0.5">
                {offeredApp.jobTitle} - {offeredApp.companyName}
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Offered CTC:{' '}
                <span className="font-bold text-slate-900 font-mono">
                  {offeredApp.offeredCtcLpa || currentStudent.packageLPA} LPA
                </span>{' '}
                · Placement Status: Placed
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('applications')}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition-colors cursor-pointer shrink-0"
          >
            View Offer Details
          </button>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Current CGPA"
          value={currentStudent.cgpa.toFixed(2)}
          subtitle="Out of 10.0 scale"
          icon={Award}
          badge="Verified"
        />
        <StatCard
          title="Active Backlogs"
          value={currentStudent.activeBacklogs}
          subtitle={currentStudent.activeBacklogs === 0 ? 'Clear Academic Record' : 'Requires Clearance'}
          icon={CheckCircle2}
        />
        <StatCard
          title="Eligible Job Drives"
          value={eligibleJobs.length}
          subtitle={`Out of ${jobs.length} total openings`}
          icon={Briefcase}
          trend={{ positive: true, text: 'Auto-Verified' }}
        />
        <StatCard
          title="Applications Active"
          value={myApplications.length}
          subtitle={
            myApplications.some((a) => a.status === 'TECHNICAL_ROUND' || a.status === 'HR_ROUND')
              ? 'Interviews in progress'
              : 'All stages tracked'
          }
          icon={FileText}
        />
      </div>

      {/* Split Section: Top Eligible Jobs & Active Application Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Matching Drives */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Recommended Job Drives</h2>
              <p className="text-xs text-slate-500">Based on your CGPA and branch eligibility</p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('jobs')}
              className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center cursor-pointer"
            >
              View All <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {jobs.slice(0, 4).map((job) => {
              const eligibility = checkStudentEligibility(currentStudent, job);
              const alreadyApplied = myApplications.some((a) => a.jobId === job.id);

              return (
                <div key={job.id} className="py-3.5 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden p-1">
                      {job.companyLogo ? (
                        <img
                          src={job.companyLogo}
                          alt={job.companyName}
                          className="w-full h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <Building2 className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 hover:text-blue-700 transition-colors">
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span className="font-medium text-slate-700">{job.companyName}</span>
                        <span>·</span>
                        <span className="font-mono font-semibold text-slate-800">{job.ctcLpa} LPA</span>
                        <span>·</span>
                        <span>{job.location}</span>
                      </div>
                      <div className="mt-1.5 flex items-center gap-2">
                        <EligibilityBadge
                          eligibility={eligibility}
                          jobTitle={job.title}
                          companyName={job.companyName}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 pt-1">
                    {alreadyApplied ? (
                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                        Applied
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setActiveTab('jobs')}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                      >
                        Details
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* My Applications Status Tracker */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">My Application Pipeline</h2>
              <p className="text-xs text-slate-500">Live recruitment stage and interview updates</p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('applications')}
              className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center cursor-pointer"
            >
              Manage <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>

          <div className="mt-2 space-y-3">
            {myApplications.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                You haven't submitted any campus drive applications yet.
                <button
                  type="button"
                  onClick={() => setActiveTab('jobs')}
                  className="block mx-auto mt-2 text-blue-600 font-semibold underline"
                >
                  Explore matching jobs
                </button>
              </div>
            ) : (
              myApplications.map((app) => (
                <div
                  key={app.id}
                  className="p-3.5 rounded-lg border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">{app.jobTitle}</h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">{app.companyName}</p>
                    </div>
                    <StatusBadge status={app.status} size="sm" />
                  </div>

                  {app.interviewDate && (
                    <div className="mt-2 text-xs bg-white p-2 rounded border border-slate-200 flex items-center gap-2 text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="font-medium">Interview: {app.interviewDate}</span>
                    </div>
                  )}

                  {app.recruiterNotes && (
                    <p className="mt-2 text-[11px] text-slate-600 italic border-l-2 border-slate-300 pl-2">
                      "{app.recruiterNotes}"
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
