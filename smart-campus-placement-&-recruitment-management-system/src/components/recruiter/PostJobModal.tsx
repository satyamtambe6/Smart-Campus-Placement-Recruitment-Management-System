import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { JobType } from '../../types';
import { X, Plus, Sparkles, Building2 } from 'lucide-react';

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PostJobModal: React.FC<PostJobModalProps> = ({ isOpen, onClose }) => {
  const { currentRecruiter, companies, postJob } = useApp();

  const recruiterCompany =
    companies.find((c) => c.id === currentRecruiter?.companyId) || companies[0];

  const availableBranches = [
    'Computer Science & Engineering',
    'Information Technology',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Electrical Engineering',
  ];

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Bengaluru / Hyderabad');
  const [jobType, setJobType] = useState<JobType>('FULL_TIME');
  const [workMode, setWorkMode] = useState<'On-site' | 'Remote' | 'Hybrid'>('Hybrid');
  const [ctcLpa, setCtcLpa] = useState<number>(24.0);
  const [minCgpa, setMinCgpa] = useState<number>(7.5);
  const [maxBacklogs, setMaxBacklogs] = useState<number>(0);
  const [selectedBranches, setSelectedBranches] = useState<string[]>([
    'Computer Science & Engineering',
    'Information Technology',
  ]);
  const [skillsInput, setSkillsInput] = useState('Java, Spring Boot, PostgreSQL, REST APIs');
  const [deadline, setDeadline] = useState('2026-12-15');
  const [roundsInput, setRoundsInput] = useState(
    'Online Coding Challenge, Technical Round 1, System Architecture, HR Interview'
  );

  if (!isOpen) return null;

  const toggleBranch = (branch: string) => {
    if (selectedBranches.includes(branch)) {
      setSelectedBranches(selectedBranches.filter((b) => b !== branch));
    } else {
      setSelectedBranches([...selectedBranches, branch]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const requiredSkills = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const rounds = roundsInput
      .split(',')
      .map((r) => r.trim())
      .filter(Boolean);

    postJob({
      companyId: recruiterCompany.id,
      companyName: recruiterCompany.name,
      companyLogo: recruiterCompany.logo,
      recruiterId: currentRecruiter ? currentRecruiter.id : 'rec-1',
      title,
      description,
      location,
      jobType,
      workMode,
      ctcLpa: parseFloat(ctcLpa.toString()),
      minCgpa: parseFloat(minCgpa.toString()),
      eligibleBranches: selectedBranches.length > 0 ? selectedBranches : ['All Branches'],
      maxBacklogs: parseInt(maxBacklogs.toString(), 10),
      requiredSkills,
      applicationDeadline: deadline,
      status: 'OPEN',
      rounds,
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 text-left max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Post Campus Recruitment Opportunity
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Hiring Organization: <strong className="text-blue-700">{recruiterCompany.name}</strong>
            </p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-4 space-y-4 text-xs">
          {/* Title & Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Position Title *</label>
              <input
                type="text"
                placeholder="e.g. Associate Software Engineer, Cloud Intern"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50/50"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Job Type</label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value as JobType)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50/50"
              >
                <option value="FULL_TIME">Full-Time Placement</option>
                <option value="INTERNSHIP">6-Month Internship</option>
                <option value="FULL_TIME_INTERN">Internship + PPO Full-Time</option>
              </select>
            </div>
          </div>

          {/* CTC, Location & Work Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Offered CTC (LPA) *</label>
              <input
                type="number"
                step="0.5"
                min="3"
                max="100"
                value={ctcLpa}
                onChange={(e) => setCtcLpa(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50/50 font-mono"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Work Mode</label>
              <select
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50/50"
              >
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site Campus/Office</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Location</label>
              <input
                type="text"
                placeholder="e.g. Bengaluru / Hyderabad"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50/50"
                required
              />
            </div>
          </div>

          {/* CRITICAL ELIGIBILITY CRITERIA SECTION */}
          <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200/80 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-700" />
              <h3 className="font-bold text-slate-900 uppercase tracking-wide text-[11px]">
                Automated Eligibility Criteria Configuration
              </h3>
            </div>
            <p className="text-[11px] text-slate-600">
              The system will automatically filter applicants and prevent ineligible submissions based on these cutoffs.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Minimum CGPA Cut-off (out of 10.0)
                </label>
                <input
                  type="number"
                  step="0.05"
                  min="5.0"
                  max="10.0"
                  value={minCgpa}
                  onChange={(e) => setMinCgpa(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Maximum Allowed Active Backlogs
                </label>
                <select
                  value={maxBacklogs}
                  onChange={(e) => setMaxBacklogs(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value={0}>0 (Strictly No Active Backlogs)</option>
                  <option value={1}>At most 1 Active Backlog</option>
                  <option value={2}>At most 2 Active Backlogs</option>
                </select>
              </div>
            </div>

            {/* Eligible Branches Checkbox Grid */}
            <div>
              <label className="block font-semibold text-slate-800 mb-1.5">
                Eligible Engineering Branches
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {availableBranches.map((branch) => {
                  const checked = selectedBranches.includes(branch);
                  return (
                    <label
                      key={branch}
                      className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                        checked ? 'bg-white border-blue-600 text-blue-900 font-semibold' : 'bg-white/60 border-slate-200 text-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleBranch(branch)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span>{branch}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Required Skills & Rounds */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Required Technical Skills (Comma-separated)
            </label>
            <input
              type="text"
              placeholder="Java, Spring Boot, React, PostgreSQL..."
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Selection Interview Rounds (Comma-separated)
            </label>
            <input
              type="text"
              placeholder="Online Assessment, Technical Interview 1, HR Round"
              value={roundsInput}
              onChange={(e) => setRoundsInput(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Application Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50/50"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Role Description & Responsibilities</label>
            <textarea
              rows={3}
              placeholder="Detail the project scope, engineering culture, and expectations..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50/50"
              required
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Publish Campus Drive
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
