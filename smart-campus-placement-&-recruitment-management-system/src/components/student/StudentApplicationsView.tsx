import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Application, ApplicationStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import {
  FileText,
  Clock,
  Video,
  Award,
  CheckCircle,
  Building2,
  Calendar,
  ExternalLink,
  Download,
  AlertCircle,
  X,
} from 'lucide-react';

export const StudentApplicationsView: React.FC = () => {
  const { applications, currentStudent, setActiveTab } = useApp();
  const [selectedOfferApp, setSelectedOfferApp] = useState<Application | null>(null);

  const myApplications = applications.filter((a) => a.studentId === currentStudent?.id);

  const STAGES: { status: ApplicationStatus; label: string }[] = [
    { status: 'APPLIED', label: 'Applied' },
    { status: 'SHORTLISTED', label: 'Shortlisted' },
    { status: 'TECHNICAL_ROUND', label: 'Technical Round' },
    { status: 'HR_ROUND', label: 'HR Round' },
    { status: 'OFFERED', label: 'Offered' },
  ];

  const getStageIndex = (status: ApplicationStatus) => {
    if (status === 'REJECTED') return -1;
    return STAGES.findIndex((s) => s.status === status);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            My Application History & Interview Tracking
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor recruitment stages, schedule interviews, and accept official campus offer letters.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('jobs')}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs cursor-pointer self-start sm:self-auto"
        >
          Explore More Drives
        </button>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {myApplications.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
            <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="font-semibold text-slate-700">No applications on record.</p>
            <p className="text-xs text-slate-500 mt-1">
              Browse available campus placement drives and apply with a single click.
            </p>
            <button
              type="button"
              onClick={() => setActiveTab('jobs')}
              className="mt-4 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 inline-block cursor-pointer"
            >
              Browse Openings
            </button>
          </div>
        ) : (
          myApplications.map((app) => {
            const currentStageIdx = getStageIndex(app.status);
            const isRejected = app.status === 'REJECTED';
            const isOffered = app.status === 'OFFERED';

            return (
              <div
                key={app.id}
                className={`bg-white rounded-xl border p-5 shadow-xs transition-all ${
                  isOffered
                    ? 'border-emerald-300 ring-1 ring-emerald-200/50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden p-2">
                      {app.companyLogo ? (
                        <img
                          src={app.companyLogo}
                          alt={app.companyName}
                          className="w-full h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <Building2 className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                        {app.jobTitle}
                      </h2>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span className="font-semibold text-blue-700">{app.companyName}</span>
                        <span>·</span>
                        <span>Applied on: {app.appliedAt}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <StatusBadge status={app.status} size="md" />
                    {isOffered && (
                      <button
                        type="button"
                        onClick={() => setSelectedOfferApp(app)}
                        className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                      >
                        <Award className="w-3.5 h-3.5" />
                        Offer Letter
                      </button>
                    )}
                  </div>
                </div>

                {/* Stepper Progress Pipeline (only if not rejected) */}
                {!isRejected && (
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <div className="grid grid-cols-5 gap-2 relative">
                      {STAGES.map((stage, idx) => {
                        const isDone = currentStageIdx >= idx;
                        const isCurrent = currentStageIdx === idx;

                        return (
                          <div key={stage.status} className="text-center relative">
                            {/* Circle */}
                            <div
                              className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                isDone
                                  ? 'bg-blue-600 text-white shadow-xs'
                                  : 'bg-slate-100 text-slate-400 border border-slate-200'
                              } ${isCurrent ? 'ring-4 ring-blue-100 font-extrabold' : ''}`}
                            >
                              {isDone ? '✓' : idx + 1}
                            </div>
                            {/* Label */}
                            <span
                              className={`mt-2 block text-[11px] font-medium leading-tight ${
                                isCurrent
                                  ? 'text-blue-700 font-bold'
                                  : isDone
                                  ? 'text-slate-800'
                                  : 'text-slate-400'
                              }`}
                            >
                              {stage.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Interview Date & Venue Card */}
                {app.interviewDate && (
                  <div className="mt-4 p-3.5 rounded-lg bg-blue-50/70 border border-blue-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 font-bold text-blue-900">
                        <Calendar className="w-4 h-4 text-blue-700" />
                        <span>Interview Scheduled: {app.interviewDate}</span>
                      </div>
                      {app.interviewVenueOrLink && (
                        <p className="text-blue-800 pl-6 flex items-center gap-1">
                          <Video className="w-3.5 h-3.5 text-blue-600" />
                          <span>Venue / Link: {app.interviewVenueOrLink}</span>
                        </p>
                      )}
                    </div>
                    {app.interviewVenueOrLink?.startsWith('http') && (
                      <a
                        href={app.interviewVenueOrLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 text-xs font-semibold rounded bg-blue-700 text-white hover:bg-blue-800 shrink-0 text-center"
                      >
                        Join Meeting
                      </a>
                    )}
                  </div>
                )}

                {/* Recruiter Notes */}
                {app.recruiterNotes && (
                  <div className="mt-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200/80 text-slate-700">
                    <strong className="text-slate-900 block mb-0.5">Talent Partner Feedback:</strong>
                    <p className="italic">{app.recruiterNotes}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Official Offer Letter Modal */}
      {selectedOfferApp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs"
          onClick={() => setSelectedOfferApp(null)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full p-8 text-left max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Certificate Style Header */}
            <div className="text-center pb-6 border-b-2 border-slate-800">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[11px] font-mono text-slate-400">REF: PLACEMENT-2026-{selectedOfferApp.id.toUpperCase()}</span>
                <button
                  type="button"
                  onClick={() => setSelectedOfferApp(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight uppercase">
                Smart Campus Placement Cell
              </h2>
              <p className="text-xs text-slate-500 font-medium">Apex Institute of Technology · Directorate of Career Services</p>
              <div className="inline-block mt-3 px-4 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                Official Letter of Intent / Campus Offer
              </div>
            </div>

            {/* Letter Body */}
            <div className="py-6 space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <p>
                <strong>Date:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <p>
                Dear <strong>{currentStudent?.fullName}</strong> (Roll No:{' '}
                <span className="font-mono">{currentStudent?.rollNumber}</span>),
              </p>
              <p>
                On behalf of <strong>{selectedOfferApp.companyName}</strong> and the University Placement Cell,
                we are delighted to confirm that you have been selected for the position of:
              </p>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Designation:</span>
                  <span className="font-bold text-slate-900">{selectedOfferApp.jobTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Organization:</span>
                  <span className="font-bold text-slate-900">{selectedOfferApp.companyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Offered Compensation (CTC):</span>
                  <span className="font-extrabold text-emerald-700 font-mono text-base">
                    {selectedOfferApp.offeredCtcLpa || currentStudent?.packageLPA || 20.0} Lakhs Per Annum (LPA)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Joining Batch:</span>
                  <span className="font-medium text-slate-900">Graduating Class of 2026</span>
                </div>
              </div>

              <p>
                This offer is contingent upon successful completion of your undergraduate degree in{' '}
                <strong>{currentStudent?.branch}</strong> maintaining a minimum CGPA of 7.5 with zero active backlogs
                at the time of graduation.
              </p>

              <div className="pt-6 grid grid-cols-2 gap-8 text-center text-xs">
                <div>
                  <div className="h-10 border-b border-slate-400 flex items-end justify-center pb-1">
                    <span className="font-serif italic font-bold text-slate-800 text-sm">Dr. R. K. Singhal</span>
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-1">Head, University Placement Cell</span>
                </div>
                <div>
                  <div className="h-10 border-b border-slate-400 flex items-end justify-center pb-1">
                    <span className="font-serif italic font-bold text-slate-800 text-sm">Talent Acquisition Lead</span>
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-1">{selectedOfferApp.companyName}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
              <span className="text-xs text-slate-400 font-mono">Digitally Verified Document</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => alert('Offer letter downloaded as PDF to your downloads folder.')}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOfferApp(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
