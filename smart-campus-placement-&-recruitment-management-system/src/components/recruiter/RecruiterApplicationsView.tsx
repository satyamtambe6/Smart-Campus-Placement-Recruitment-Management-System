import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Application, ApplicationStatus, Student } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { calculateSkillsMatch } from '../../utils/eligibility';
import {
  Users,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  Video,
  FileText,
  Building2,
  Calendar,
  X,
  ExternalLink,
} from 'lucide-react';

export const RecruiterApplicationsView: React.FC = () => {
  const {
    currentRecruiter,
    companies,
    jobs,
    applications,
    students,
    updateApplicationStatus,
  } = useApp();

  const recruiterCompany =
    companies.find((c) => c.id === currentRecruiter?.companyId) || companies[0];

  const myCompanyJobs = jobs.filter((j) => j.companyId === recruiterCompany.id);
  const myApplications = applications.filter((a) => a.companyId === recruiterCompany.id);

  const [selectedJobId, setSelectedJobId] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [evaluatingApp, setEvaluatingApp] = useState<Application | null>(null);

  // Status transition modal states
  const [actionType, setActionType] = useState<ApplicationStatus | null>(null);
  const [interviewDate, setInterviewDate] = useState('2026-11-18 11:00 AM IST');
  const [interviewLink, setInterviewLink] = useState('https://meet.google.com/xyz-campus-round');
  const [offeredCtc, setOfferedCtc] = useState<number>(24.0);
  const [feedbackNotes, setFeedbackNotes] = useState('');

  const filteredApps = myApplications.filter((app) => {
    const matchesJob = selectedJobId === 'ALL' || app.jobId === selectedJobId;
    const matchesStatus = selectedStatus === 'ALL' || app.status === selectedStatus;
    const matchesSearch =
      app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.studentRollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesJob && matchesStatus && matchesSearch;
  });

  const getStudentDetails = (studentId: string): Student | undefined => {
    return students.find((s) => s.id === studentId);
  };

  const handleExecuteStatusUpdate = (app: Application, targetStatus: ApplicationStatus) => {
    updateApplicationStatus(
      app.id,
      targetStatus,
      feedbackNotes,
      targetStatus.includes('ROUND') ? interviewDate : undefined,
      targetStatus.includes('ROUND') ? interviewLink : undefined,
      targetStatus === 'OFFERED' ? offeredCtc : undefined
    );

    setActionType(null);
    setEvaluatingApp(null);
    setFeedbackNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Candidate Applications Pipeline
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Review verified candidates, schedule technical interviews, and issue campus placement offers.
            </p>
          </div>

          <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 self-start sm:self-auto">
            {filteredApps.length} Candidates
          </span>
        </div>

        {/* Filter Toolbar */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search candidate name or roll no..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50/50"
            />
          </div>

          <div>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50/50"
            >
              <option value="ALL">All Company Openings</option>
              {myCompanyJobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50/50"
            >
              <option value="ALL">All Application Stages</option>
              <option value="APPLIED">Applied</option>
              <option value="SHORTLISTED">Shortlisted</option>
              <option value="TECHNICAL_ROUND">Technical Round</option>
              <option value="HR_ROUND">HR Round</option>
              <option value="OFFERED">Offered / Hired</option>
              <option value="REJECTED">Not Selected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Candidate Details</th>
                <th className="p-3.5">Applied Position</th>
                <th className="p-3.5">Academic Record</th>
                <th className="p-3.5">Current Stage</th>
                <th className="p-3.5">Interview / Notes</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No applications match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => {
                  const student = getStudentDetails(app.studentId);
                  const job = jobs.find((j) => j.id === app.jobId);
                  const skillMatch =
                    student && job
                      ? calculateSkillsMatch(student.skills, job.requiredSkills)
                      : { matchPercentage: 0 };

                  return (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900">{app.studentName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {app.studentRollNumber} · {app.studentBranch}
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div className="font-semibold text-slate-800">{app.jobTitle}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          Applied: {app.appliedAt.split(' ')[0]}
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div className="font-mono font-bold text-slate-900">
                          CGPA: {app.studentCgpa.toFixed(2)}
                        </div>
                        <div className="text-[11px] text-emerald-700 font-medium">
                          Skills Match: {skillMatch.matchPercentage}%
                        </div>
                      </td>

                      <td className="p-3.5">
                        <StatusBadge status={app.status} size="sm" />
                      </td>

                      <td className="p-3.5 max-w-xs">
                        {app.interviewDate ? (
                          <div className="text-[11px] text-slate-700 font-medium">
                            <span className="text-blue-700 font-semibold block">Scheduled:</span>
                            {app.interviewDate}
                          </div>
                        ) : app.recruiterNotes ? (
                          <p className="text-[11px] text-slate-500 truncate italic">
                            "{app.recruiterNotes}"
                          </p>
                        ) : (
                          <span className="text-[11px] text-slate-400">No notes yet</span>
                        )}
                      </td>

                      <td className="p-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setEvaluatingApp(app);
                            if (job) setOfferedCtc(job.ctcLpa);
                          }}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer"
                        >
                          Evaluate & Stage
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Candidate Evaluation & Stage Progression Modal */}
      {evaluatingApp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs"
          onClick={() => {
            setEvaluatingApp(null);
            setActionType(null);
          }}
        >
          <div
            className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 text-left max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-start pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  Candidate Evaluation & Pipeline Transition
                </span>
                <h3 className="text-lg font-bold text-slate-900">{evaluatingApp.studentName}</h3>
                <p className="text-xs text-slate-500">
                  {evaluatingApp.studentBranch} · Roll No: {evaluatingApp.studentRollNumber}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEvaluatingApp(null);
                  setActionType(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Academic & Skills Breakdown */}
            <div className="py-4 space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-center font-mono">
                <div>
                  <span className="text-[11px] text-slate-500 block font-sans">CGPA</span>
                  <strong className="text-base text-slate-900">{evaluatingApp.studentCgpa.toFixed(2)}</strong>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block font-sans">Active Backlogs</span>
                  <strong className="text-base text-emerald-700">0</strong>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block font-sans">Verification</span>
                  <strong className="text-xs text-blue-700 block mt-1">Verified</strong>
                </div>
              </div>

              {/* Student Skills */}
              {(() => {
                const s = getStudentDetails(evaluatingApp.studentId);
                const j = jobs.find((job) => job.id === evaluatingApp.jobId);
                if (!s || !j) return null;
                const match = calculateSkillsMatch(s.skills, j.requiredSkills);

                return (
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="font-semibold text-slate-800">Technical Skills Match:</span>
                      <span className="font-mono font-bold text-blue-700">{match.matchPercentage}%</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {s.skills.map((skill) => {
                        const isRequired = j.requiredSkills.some(
                          (r) => r.toLowerCase() === skill.toLowerCase()
                        );
                        return (
                          <span
                            key={skill}
                            className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                              isRequired
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {skill} {isRequired && '✓'}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* Action Stage Selectors */}
              <div className="pt-2">
                <span className="font-bold text-slate-900 block mb-2 uppercase tracking-wide text-[11px]">
                  Select Action to Perform:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setActionType('SHORTLISTED')}
                    className={`p-2.5 rounded-lg border text-xs font-semibold text-center cursor-pointer transition-colors ${
                      actionType === 'SHORTLISTED'
                        ? 'bg-sky-600 text-white border-sky-600'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Shortlist
                  </button>

                  <button
                    type="button"
                    onClick={() => setActionType('TECHNICAL_ROUND')}
                    className={`p-2.5 rounded-lg border text-xs font-semibold text-center cursor-pointer transition-colors ${
                      actionType === 'TECHNICAL_ROUND'
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Tech Interview
                  </button>

                  <button
                    type="button"
                    onClick={() => setActionType('OFFERED')}
                    className={`p-2.5 rounded-lg border text-xs font-semibold text-center cursor-pointer transition-colors ${
                      actionType === 'OFFERED'
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Roll Out Offer
                  </button>

                  <button
                    type="button"
                    onClick={() => setActionType('REJECTED')}
                    className={`p-2.5 rounded-lg border text-xs font-semibold text-center cursor-pointer transition-colors ${
                      actionType === 'REJECTED'
                        ? 'bg-rose-600 text-white border-rose-600'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Reject
                  </button>
                </div>
              </div>

              {/* Dynamic form based on selected action */}
              {actionType && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="font-bold text-slate-900">
                    {actionType === 'OFFERED'
                      ? 'Extend Official Campus Placement Offer'
                      : actionType.includes('ROUND')
                      ? 'Schedule Interview Round'
                      : `Update Status to ${actionType}`}
                  </h4>

                  {actionType.includes('ROUND') && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Date & Time
                        </label>
                        <input
                          type="text"
                          value={interviewDate}
                          onChange={(e) => setInterviewDate(e.target.value)}
                          className="w-full px-3 py-1.5 border border-slate-200 rounded-lg bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Meeting Link / Venue
                        </label>
                        <input
                          type="text"
                          value={interviewLink}
                          onChange={(e) => setInterviewLink(e.target.value)}
                          className="w-full px-3 py-1.5 border border-slate-200 rounded-lg bg-white"
                        />
                      </div>
                    </div>
                  )}

                  {actionType === 'OFFERED' && (
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Offered Compensation Package (CTC LPA)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={offeredCtc}
                        onChange={(e) => setOfferedCtc(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-lg bg-white font-mono"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Recruiter Feedback & Notes
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Candidate demonstrated exceptional system design abilities..."
                      value={feedbackNotes}
                      onChange={(e) => setFeedbackNotes(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg bg-white"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setEvaluatingApp(null);
                  setActionType(null);
                }}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              {actionType && (
                <button
                  type="button"
                  onClick={() => handleExecuteStatusUpdate(evaluatingApp, actionType)}
                  className="px-4 py-2 text-xs font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-xs cursor-pointer"
                >
                  Confirm & Notify Candidate
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
