import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Job } from '../../types';
import { EligibilityBadge } from '../common/EligibilityBadge';
import { checkStudentEligibility, calculateSkillsMatch } from '../../utils/eligibility';
import {
  Search,
  Filter,
  Building2,
  MapPin,
  Briefcase,
  Calendar,
  CheckCircle2,
  XCircle,
  Sparkles,
  ExternalLink,
  ChevronDown,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const StudentJobsView: React.FC = () => {
  const { jobs, currentStudent, applications, applyForJob, setActiveTab } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('ALL');
  const [eligibilityFilter, setEligibilityFilter] = useState<'ALL' | 'ELIGIBLE_ONLY'>('ALL');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applyFeedback, setApplyFeedback] = useState<{ message: string; success: boolean } | null>(null);

  const branchesList = [
    'ALL',
    'Computer Science & Engineering',
    'Information Technology',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Electrical Engineering',
  ];

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Search
      const matchesSearch =
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.requiredSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      // Branch filter
      const matchesBranch =
        selectedBranch === 'ALL' ||
        job.eligibleBranches.includes('All Branches') ||
        job.eligibleBranches.some((b) => b.toLowerCase().includes(selectedBranch.toLowerCase()));

      // Eligibility filter
      if (!currentStudent) return matchesSearch && matchesBranch;
      const eligibility = checkStudentEligibility(currentStudent, job);
      const matchesEligibility = eligibilityFilter === 'ALL' || eligibility.isEligible;

      return matchesSearch && matchesBranch && matchesEligibility;
    });
  }, [jobs, searchQuery, selectedBranch, eligibilityFilter, currentStudent]);

  const handleApply = (job: Job) => {
    if (!currentStudent) return;
    const result = applyForJob(job.id, currentStudent.id);
    setApplyFeedback(result);
    setTimeout(() => {
      setApplyFeedback(null);
    }, 4500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Campus Placement Job Opportunities
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated eligibility engine evaluates each position against your verified academic record.
            </p>
          </div>

          {/* Quick Eligibility Toggle */}
          <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg text-xs font-semibold shrink-0">
            <button
              type="button"
              onClick={() => setEligibilityFilter('ALL')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                eligibilityFilter === 'ALL'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Openings ({jobs.length})
            </button>
            <button
              type="button"
              onClick={() => setEligibilityFilter('ELIGIBLE_ONLY')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                eligibilityFilter === 'ELIGIBLE_ONLY'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Eligible For Me
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by role, company, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50/50"
            />
          </div>

          <div>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50/50"
            >
              <option value="ALL">All Engineering Branches</option>
              {branchesList
                .filter((b) => b !== 'ALL')
                .map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 px-2 py-1">
            <span>
              Showing <strong className="text-slate-800">{filteredJobs.length}</strong> matching drives
            </span>
            {(searchQuery || selectedBranch !== 'ALL' || eligibilityFilter !== 'ALL') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedBranch('ALL');
                  setEligibilityFilter('ALL');
                }}
                className="text-blue-600 hover:underline font-semibold cursor-pointer"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Global Application Feedback Toast */}
      {applyFeedback && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs font-semibold ${
            applyFeedback.success
              ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
              : 'bg-rose-50 text-rose-900 border-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {applyFeedback.success ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span>{applyFeedback.message}</span>
          </div>
          {applyFeedback.success && (
            <button
              type="button"
              onClick={() => setActiveTab('applications')}
              className="underline text-emerald-800 hover:text-emerald-950 cursor-pointer shrink-0"
            >
              View In Applications
            </button>
          )}
        </div>
      )}

      {/* Jobs List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredJobs.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
            <Briefcase className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="font-semibold text-slate-700">No job opportunities match your criteria.</p>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search terms or clearing the eligibility filter.
            </p>
          </div>
        ) : (
          filteredJobs.map((job) => {
            const isApplied = applications.some(
              (a) => a.jobId === job.id && a.studentId === currentStudent?.id
            );
            const eligibility = currentStudent
              ? checkStudentEligibility(currentStudent, job)
              : { isEligible: true, criteriaChecks: [], failReasons: [] };

            const skillMatch = currentStudent
              ? calculateSkillsMatch(currentStudent.skills, job.requiredSkills)
              : { matchPercentage: 0, matchedSkills: [], missingSkills: [] };

            return (
              <div
                key={job.id}
                className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all"
              >
                <div>
                  {/* Company & Title Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden p-1.5">
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
                        <h2 className="text-sm font-bold text-slate-900 leading-snug">
                          {job.title}
                        </h2>
                        <p className="text-xs font-semibold text-blue-700 mt-0.5">
                          {job.companyName}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-base font-extrabold text-slate-900 font-mono tabular-nums">
                        {job.ctcLpa} LPA
                      </span>
                      <span className="block text-[10px] text-slate-400 uppercase font-medium">
                        {job.jobType.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Metadata Row */}
                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {job.location} ({job.workMode})
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Deadline: <span className="font-medium text-slate-700">{job.applicationDeadline}</span>
                    </span>
                  </div>

                  {/* Description snippet */}
                  <p className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  {/* Eligibility & Skill Match Strip */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <EligibilityBadge
                        eligibility={eligibility}
                        jobTitle={job.title}
                        companyName={job.companyName}
                      />
                    </div>

                    <div className="text-xs text-slate-500 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      <span>
                        Skills Match:{' '}
                        <strong className="text-slate-800 font-mono">
                          {skillMatch.matchPercentage}%
                        </strong>
                      </span>
                    </div>
                  </div>

                  {/* Criteria Tags */}
                  <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600">
                    <span className="px-2 py-0.5 rounded bg-slate-100 font-medium text-slate-700">
                      Min CGPA: {job.minCgpa.toFixed(1)}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 font-medium text-slate-700">
                      Max Backlogs: {job.maxBacklogs}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 font-medium text-slate-700 truncate max-w-[200px]">
                      Branches: {job.eligibleBranches.join(', ')}
                    </span>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedJob(job)}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer flex items-center gap-1"
                  >
                    View Selection Rounds <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <div>
                    {isApplied ? (
                      <span className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 text-slate-600 border border-slate-200 inline-block">
                        Already Applied
                      </span>
                    ) : eligibility.isEligible ? (
                      <button
                        type="button"
                        onClick={() => handleApply(job)}
                        className="px-4 py-2 text-xs font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                      >
                        Apply Now
                      </button>
                    ) : (
                      <div className="group relative inline-block">
                        <button
                          type="button"
                          disabled
                          className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                        >
                          Ineligible to Apply
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Job Details & Selection Rounds Modal */}
      {selectedJob && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs"
          onClick={() => setSelectedJob(null)}
        >
          <div
            className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-xl w-full p-6 text-left max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedJob.title}</h3>
                <p className="text-xs font-semibold text-blue-700 mt-0.5">{selectedJob.companyName}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Job Description</h4>
                <p className="text-slate-600 leading-relaxed">{selectedJob.description}</p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Selection Rounds</h4>
                <div className="space-y-1.5">
                  {selectedJob.rounds.map((round, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-medium text-slate-800">{round}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Required Skills</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedJob.requiredSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 border border-blue-200 font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-500">Package CTC</span>
                  <p className="font-bold text-slate-900 font-mono text-sm">{selectedJob.ctcLpa} LPA</p>
                </div>
                <div>
                  <span className="text-slate-500">Min CGPA Cut-off</span>
                  <p className="font-bold text-slate-900 font-mono text-sm">{selectedJob.minCgpa.toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-slate-500">Max Active Backlogs</span>
                  <p className="font-bold text-slate-900 text-sm">{selectedJob.maxBacklogs}</p>
                </div>
                <div>
                  <span className="text-slate-500">Application Deadline</span>
                  <p className="font-bold text-slate-900 text-sm">{selectedJob.applicationDeadline}</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
              >
                Close
              </button>
              {currentStudent &&
                !applications.some(
                  (a) => a.jobId === selectedJob.id && a.studentId === currentStudent.id
                ) &&
                checkStudentEligibility(currentStudent, selectedJob).isEligible && (
                  <button
                    type="button"
                    onClick={() => {
                      handleApply(selectedJob);
                      setSelectedJob(null);
                    }}
                    className="px-4 py-2 text-xs font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                  >
                    Confirm & Apply
                  </button>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
