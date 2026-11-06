import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Job } from '../../types';
import { PostJobModal } from './PostJobModal';
import {
  Briefcase,
  PlusCircle,
  MapPin,
  Calendar,
  Users,
  Building2,
  Trash2,
  Power,
  Edit3,
} from 'lucide-react';

export const RecruiterJobsView: React.FC = () => {
  const { currentRecruiter, companies, jobs, applications, updateJob, deleteJob, setActiveTab } =
    useApp();
  const [postModalOpen, setPostModalOpen] = useState(false);

  const recruiterCompany =
    companies.find((c) => c.id === currentRecruiter?.companyId) || companies[0];

  const myCompanyJobs = jobs.filter((j) => j.companyId === recruiterCompany.id);

  const toggleStatus = (job: Job) => {
    const nextStatus = job.status === 'OPEN' ? 'CLOSED' : 'OPEN';
    updateJob(job.id, { status: nextStatus });
  };

  const handleDelete = (jobId: string) => {
    if (confirm('Are you sure you want to delete this job posting? All attached candidate applications will also be removed.')) {
      deleteJob(jobId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Manage Campus Recruitment Drives
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Published openings for <strong className="text-blue-700">{recruiterCompany.name}</strong>.
            Configure criteria and track active applicant pools.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setPostModalOpen(true)}
          className="px-4 py-2 text-xs font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Create New Opening
        </button>
      </div>

      {/* Jobs Grid */}
      <div className="space-y-4">
        {myCompanyJobs.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
            <Briefcase className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="font-semibold text-slate-700">No campus drives posted yet.</p>
            <p className="text-xs text-slate-500 mt-1">
              Create your first opening to begin receiving verified student applications.
            </p>
            <button
              type="button"
              onClick={() => setPostModalOpen(true)}
              className="mt-4 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 inline-block cursor-pointer"
            >
              Post Job Opening
            </button>
          </div>
        ) : (
          myCompanyJobs.map((job) => {
            const applicants = applications.filter((a) => a.jobId === job.id);
            const isOpen = job.status === 'OPEN';

            return (
              <div
                key={job.id}
                className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all"
              >
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold text-slate-900">{job.title}</h2>
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

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="font-mono font-bold text-slate-900 text-sm">
                          {job.ctcLpa} LPA
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{job.jobType.replace('_', ' ')}</span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {job.location} ({job.workMode})
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          Deadline: {job.applicationDeadline}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() => toggleStatus(job)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border flex items-center gap-1 cursor-pointer transition-colors ${
                          isOpen
                            ? 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                        }`}
                        title={isOpen ? 'Close application window' : 'Re-open drive'}
                      >
                        <Power className="w-3.5 h-3.5" />
                        {isOpen ? 'Close Drive' : 'Re-open'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(job.id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 cursor-pointer"
                        title="Delete opening"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Criteria Box */}
                  <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Academic Cut-off</span>
                      <span className="font-semibold text-slate-800 font-mono">
                        Min CGPA {job.minCgpa.toFixed(1)} · Max {job.maxBacklogs} backlogs
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Eligible Branches</span>
                      <span className="font-semibold text-slate-800 truncate block">
                        {job.eligibleBranches.join(', ')}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Selection Rounds</span>
                      <span className="font-semibold text-slate-800 truncate block">
                        {job.rounds.join(' → ')}
                      </span>
                    </div>
                  </div>

                  {/* Skills tags */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {job.requiredSkills.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 text-[11px] font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Strip */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    Total Applications Received:{' '}
                    <strong className="text-slate-900 font-mono text-sm">
                      {applicants.length}
                    </strong>
                  </span>

                  <button
                    type="button"
                    onClick={() => setActiveTab('recruiter-applications')}
                    className="font-bold text-blue-600 hover:text-blue-800 cursor-pointer flex items-center gap-1"
                  >
                    <Users className="w-3.5 h-3.5" />
                    Review Candidates ({applicants.length})
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <PostJobModal isOpen={postModalOpen} onClose={() => setPostModalOpen(false)} />
    </div>
  );
};
