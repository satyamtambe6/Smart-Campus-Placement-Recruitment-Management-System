import React, { useState } from 'react';
import { EligibilityResult } from '../../types';
import { CheckCircle2, XCircle, Info, ChevronRight, X } from 'lucide-react';

interface EligibilityBadgeProps {
  eligibility: EligibilityResult;
  showDetailsButton?: boolean;
  jobTitle?: string;
  companyName?: string;
}

export const EligibilityBadge: React.FC<EligibilityBadgeProps> = ({
  eligibility,
  showDetailsButton = true,
  jobTitle,
  companyName,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="inline-flex items-center gap-1.5">
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md border whitespace-nowrap ${
            eligibility.isEligible
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
              : 'bg-amber-50 text-amber-800 border-amber-300'
          }`}
        >
          {eligibility.isEligible ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Eligible
            </>
          ) : (
            <>
              <XCircle className="w-3.5 h-3.5 text-amber-600" />
              Ineligible
            </>
          )}
        </span>

        {showDetailsButton && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setModalOpen(true);
            }}
            className="text-xs text-blue-700 hover:text-blue-900 underline font-medium cursor-pointer flex items-center"
            title="View criteria breakdown"
          >
            Criteria
          </button>
        )}
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full p-6 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900">Automated Eligibility Report</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {jobTitle ? `${jobTitle} at ${companyName}` : 'Criteria Evaluation'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-4">
              <div
                className={`p-3 rounded-lg border text-xs font-medium mb-4 ${
                  eligibility.isEligible
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                    : 'bg-rose-50 text-rose-900 border-rose-200'
                }`}
              >
                {eligibility.isEligible ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Candidate satisfies all CGPA, branch, and backlog criteria.</span>
                  </div>
                ) : (
                  <div className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Candidate does not satisfy eligibility criteria:</p>
                      <ul className="list-disc list-inside mt-1 space-y-0.5 text-rose-800">
                        {eligibility.failReasons.map((reason, idx) => (
                          <li key={idx}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2.5">
                <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                  Detailed Criteria Checks:
                </p>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
                  {eligibility.criteriaChecks.map((check, idx) => (
                    <div
                      key={idx}
                      className={`p-3 flex items-center justify-between text-xs ${
                        check.passed ? 'bg-white' : 'bg-rose-50/50'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="font-medium text-slate-900 flex items-center gap-1.5">
                          {check.passed ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                          )}
                          <span>{check.criterion}</span>
                        </div>
                        <p className="text-slate-500 pl-5">
                          Required: <span className="font-medium text-slate-700">{check.required}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-500 text-[11px] block">Your Record</span>
                        <span
                          className={`font-semibold ${
                            check.passed ? 'text-slate-800' : 'text-rose-700'
                          }`}
                        >
                          {check.actual}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
