import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { checkStudentEligibility, calculateSkillsMatch } from '../../utils/eligibility';
import {
  SlidersHorizontal,
  CheckCircle2,
  XCircle,
  Sparkles,
  Award,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Building2,
} from 'lucide-react';

export const EligibilityCheckerTool: React.FC = () => {
  const { students, jobs } = useApp();

  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    students[0] ? students[0].id : ''
  );
  const [selectedJobId, setSelectedJobId] = useState<string>(jobs[0] ? jobs[0].id : '');

  // Sandbox simulation mode
  const [sandboxMode, setSandboxMode] = useState<boolean>(false);
  const [simCgpa, setSimCgpa] = useState<number>(7.6);
  const [simBranch, setSimBranch] = useState<string>('Information Technology');
  const [simBacklogs, setSimBacklogs] = useState<number>(0);
  const [simVerified, setSimVerified] = useState<boolean>(true);

  const currentStudent = students.find((s) => s.id === selectedStudentId) || students[0];
  const currentJob = jobs.find((j) => j.id === selectedJobId) || jobs[0];

  // Active student evaluated (either real or simulated sandbox)
  const evaluatedStudent = sandboxMode
    ? {
        ...currentStudent,
        fullName: 'Simulated Sandbox Student',
        rollNumber: '2026SIM001',
        branch: simBranch,
        cgpa: simCgpa,
        activeBacklogs: simBacklogs,
        isVerified: simVerified,
      }
    : currentStudent;

  const result = checkStudentEligibility(evaluatedStudent, currentJob);
  const skillMatch = calculateSkillsMatch(evaluatedStudent.skills, currentJob.requiredSkills);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Automated Eligibility Verification Engine
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit rule evaluations for CGPA thresholds, branch restrictions, backlog criteria, and deadline constraints.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setSandboxMode(!sandboxMode)}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 self-start sm:self-auto ${
            sandboxMode
              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
              : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          {sandboxMode ? 'Exit Simulator Sandbox' : 'Open Custom Simulator Sandbox'}
        </button>
      </div>

      {/* Selectors Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            {sandboxMode ? 'Base Student Template' : 'Select Registered Student'}
          </label>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50/50 font-medium"
          >
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.fullName} ({s.rollNumber}) · {s.branch} · CGPA {s.cgpa.toFixed(2)} · Backlogs:{' '}
                {s.activeBacklogs}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Select Company Job Opportunity
          </label>
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50/50 font-medium"
          >
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title} · {j.companyName} (Min CGPA: {j.minCgpa.toFixed(1)}, Max Backlogs:{' '}
                {j.maxBacklogs})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sandbox Controls if enabled */}
      {sandboxMode && (
        <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 text-xs space-y-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-blue-700" />
            <h3 className="font-bold text-blue-900 uppercase tracking-wide">
              Interactive Parameter Sandbox
            </h3>
          </div>
          <p className="text-blue-800">
            Adjust student parameters in real time to observe the eligibility rule engine responses.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1">
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                CGPA: <strong className="font-mono text-blue-800">{simCgpa.toFixed(2)}</strong>
              </label>
              <input
                type="range"
                min="5.0"
                max="10.0"
                step="0.05"
                value={simCgpa}
                onChange={(e) => setSimCgpa(parseFloat(e.target.value))}
                className="w-full cursor-pointer"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">Active Backlogs</label>
              <select
                value={simBacklogs}
                onChange={(e) => setSimBacklogs(parseInt(e.target.value, 10))}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
              >
                <option value={0}>0 Backlogs</option>
                <option value={1}>1 Backlog</option>
                <option value={2}>2 Backlogs</option>
                <option value={3}>3 Backlogs</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">Branch</label>
              <select
                value={simBranch}
                onChange={(e) => setSimBranch(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
              >
                <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics & Communication">Electronics & Communication</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-4">
              <input
                type="checkbox"
                id="simVerif"
                checked={simVerified}
                onChange={(e) => setSimVerified(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="simVerif" className="font-semibold text-slate-800 cursor-pointer">
                Verified by Placement Cell
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Main Audit Diagnostic Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
        {/* Outcome Banner */}
        <div
          className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            result.isEligible
              ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
              : 'bg-rose-50 text-rose-900 border-rose-300'
          }`}
        >
          <div className="flex items-start gap-3">
            {result.isEligible ? (
              <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />
            ) : (
              <XCircle className="w-7 h-7 text-rose-600 shrink-0" />
            )}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider block">
                {result.isEligible ? 'Candidate Passed All Criteria' : 'Candidate Ineligible'}
              </span>
              <h2 className="text-base sm:text-lg font-bold">
                {result.isEligible
                  ? `${evaluatedStudent.fullName} is fully eligible for ${currentJob.title} at ${currentJob.companyName}`
                  : `${evaluatedStudent.fullName} does not meet requirements for ${currentJob.title}`}
              </h2>
              {!result.isEligible && (
                <ul className="list-disc list-inside mt-1.5 space-y-0.5 text-xs text-rose-800 font-medium">
                  {result.failReasons.map((r, idx) => (
                    <li key={idx}>{r}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="shrink-0 self-start sm:self-auto">
            <span
              className={`px-3 py-1.5 text-xs font-black rounded-lg uppercase tracking-wider font-mono ${
                result.isEligible ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
              }`}
            >
              {result.isEligible ? 'STATUS: ELIGIBLE' : 'STATUS: INELIGIBLE'}
            </span>
          </div>
        </div>

        {/* Detailed Criteria Table */}
        <div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-2">
            Automated Rules Matrix Evaluation:
          </h3>
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
            {result.criteriaChecks.map((check, idx) => (
              <div
                key={idx}
                className={`p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                  check.passed ? 'bg-white' : 'bg-rose-50/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {check.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <div>
                    <span className="font-bold text-slate-900">{check.criterion}</span>
                    <span className="text-slate-500 block text-[11px]">
                      Required by Company: <strong className="text-slate-700">{check.required}</strong>
                    </span>
                  </div>
                </div>

                <div className="text-left sm:text-right pl-6 sm:pl-0">
                  <span className="text-[10px] text-slate-400 block uppercase font-mono">
                    Candidate Record
                  </span>
                  <span
                    className={`font-mono font-bold text-xs ${
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

        {/* Skill Match Breakdown */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-bold text-slate-900 uppercase tracking-wide text-[11px]">
              Technical Skills Alignment
            </span>
            <span className="font-mono font-bold text-blue-700">
              {skillMatch.matchPercentage}% Compatibility
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {currentJob.requiredSkills.map((req) => {
              const hasSkill = skillMatch.matchedSkills.includes(req);
              return (
                <span
                  key={req}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium border ${
                    hasSkill
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}
                >
                  {req} {hasSkill ? '✓' : '✗'}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
