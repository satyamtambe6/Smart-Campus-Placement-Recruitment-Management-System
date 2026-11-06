import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Student, Job } from '../../types';
import { checkStudentEligibility } from '../../utils/eligibility';
import {
  Users,
  Search,
  Filter,
  Award,
  Send,
  CheckCircle2,
  XCircle,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

export const RecruiterCandidatePoolView: React.FC = () => {
  const { students, jobs, currentRecruiter, companies } = useApp();

  const recruiterCompany =
    companies.find((c) => c.id === currentRecruiter?.companyId) || companies[0];
  const myJobs = jobs.filter((j) => j.companyId === recruiterCompany.id);

  const [selectedJobForCheck, setSelectedJobForCheck] = useState<string>(
    myJobs[0] ? myJobs[0].id : ''
  );
  const [branchFilter, setBranchFilter] = useState('ALL');
  const [minCgpaFilter, setMinCgpaFilter] = useState<number>(7.0);
  const [searchQuery, setSearchQuery] = useState('');
  const [invitedStudentIds, setInvitedStudentIds] = useState<string[]>([]);

  const activeJob = jobs.find((j) => j.id === selectedJobForCheck) || myJobs[0];

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.skills.some((sk) => sk.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesBranch =
        branchFilter === 'ALL' || s.branch.toLowerCase().includes(branchFilter.toLowerCase());

      const matchesCgpa = s.cgpa >= minCgpaFilter;

      return matchesSearch && matchesBranch && matchesCgpa;
    });
  }, [students, searchQuery, branchFilter, minCgpaFilter]);

  const handleInvite = (student: Student) => {
    setInvitedStudentIds((prev) => [...prev, student.id]);
    alert(`Invitation dispatched to ${student.fullName} (${student.email}) for ${activeJob?.title || 'campus drive'}!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              University Talent Pool & Student Search
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Scout verified undergraduate students, evaluate eligibility against active criteria, and send direct drive invitations.
            </p>
          </div>

          {/* Job matcher dropdown */}
          {myJobs.length > 0 && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-semibold whitespace-nowrap">Evaluate against:</span>
              <select
                value={selectedJobForCheck}
                onChange={(e) => setSelectedJobForCheck(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 font-medium"
              >
                {myJobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title} (Cut-off: {j.minCgpa.toFixed(1)})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Filter controls */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search skills, names, roll numbers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50/50"
            />
          </div>

          <div>
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50/50"
            >
              <option value="ALL">All Departments</option>
              <option value="Computer Science">Computer Science & Engineering</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics">Electronics & Communication</option>
              <option value="Mechanical">Mechanical Engineering</option>
              <option value="Electrical">Electrical Engineering</option>
            </select>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <span className="text-slate-600 font-medium whitespace-nowrap">Min CGPA:</span>
            <input
              type="range"
              min="6.0"
              max="9.5"
              step="0.5"
              value={minCgpaFilter}
              onChange={(e) => setMinCgpaFilter(parseFloat(e.target.value))}
              className="flex-1 cursor-pointer"
            />
            <span className="font-mono font-bold text-slate-900">{minCgpaFilter.toFixed(1)}+</span>
          </div>
        </div>
      </div>

      {/* Student Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
            <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="font-semibold text-slate-700">No students match your filter criteria.</p>
          </div>
        ) : (
          filteredStudents.map((stud) => {
            const eligibility = activeJob
              ? checkStudentEligibility(stud, activeJob)
              : { isEligible: true };
            const isInvited = invitedStudentIds.includes(stud.id);

            return (
              <div
                key={stud.id}
                className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all text-xs"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{stud.fullName}</h3>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                        {stud.rollNumber} · {stud.branch}
                      </p>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        stud.placementStatus === 'PLACED'
                          ? 'bg-purple-50 text-purple-800 border-purple-200'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}
                    >
                      {stud.placementStatus}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200/70 text-center font-mono">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">CGPA</span>
                      <strong className="text-slate-900">{stud.cgpa.toFixed(2)}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">Backlogs</span>
                      <strong className={stud.activeBacklogs === 0 ? 'text-emerald-700' : 'text-rose-700'}>
                        {stud.activeBacklogs}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">Class 12</span>
                      <strong className="text-slate-800">{stud.twelfthPercentage}%</strong>
                    </div>
                  </div>

                  {/* Skills tags */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {stud.skills.slice(0, 5).map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {stud.skills.length > 5 && (
                      <span className="text-[10px] text-slate-400 self-center">
                        +{stud.skills.length - 5}
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer with automated eligibility for current selected job */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  {activeJob && (
                    <div className="flex items-center gap-1.5">
                      {eligibility.isEligible ? (
                        <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Eligible
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-amber-700 flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> Ineligible
                        </span>
                      )}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => handleInvite(stud)}
                    disabled={isInvited}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer transition-colors ${
                      isInvited
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    <Send className="w-3 h-3" />
                    {isInvited ? 'Invited' : 'Invite'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
