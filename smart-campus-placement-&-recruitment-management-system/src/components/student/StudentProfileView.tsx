import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  GraduationCap,
  Award,
  BookOpen,
  Phone,
  Mail,
  Github,
  Linkedin,
  FileText,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
  Save,
  Eye,
} from 'lucide-react';

export const StudentProfileView: React.FC = () => {
  const { currentStudent, updateStudentProfile } = useApp();

  if (!currentStudent) {
    return <div className="p-8 text-center text-slate-500">No student profile selected.</div>;
  }

  // Edit form state
  const [fullName, setFullName] = useState(currentStudent.fullName);
  const [phoneNumber, setPhoneNumber] = useState(currentStudent.phoneNumber);
  const [bio, setBio] = useState(currentStudent.bio || '');
  const [githubUrl, setGithubUrl] = useState(currentStudent.githubUrl || '');
  const [linkedinUrl, setLinkedinUrl] = useState(currentStudent.linkedinUrl || '');
  const [skills, setSkills] = useState<string[]>(currentStudent.skills);
  const [newSkill, setNewSkill] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    if (!skills.includes(newSkill.trim())) {
      const updated = [...skills, newSkill.trim()];
      setSkills(updated);
      updateStudentProfile(currentStudent.id, { skills: updated });
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updated = skills.filter((s) => s !== skillToRemove);
    setSkills(updated);
    updateStudentProfile(currentStudent.id, { skills: updated });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudentProfile(currentStudent.id, {
      fullName,
      phoneNumber,
      bio,
      githubUrl,
      linkedinUrl,
      skills,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Student Academic Profile</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified academic credentials and technical skills used for automated placement eligibility.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setResumeModalOpen(true)}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Eye className="w-4 h-4" />
          Preview Placement Resume
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          Profile updated successfully in the placement registry!
        </div>
      )}

      {/* Main Grid: Academic Verification Card & Editable Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Verified Academic Registry (Read-only verified by placement cell) */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Academic Transcript
              </span>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                  currentStudent.isVerified
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-amber-50 text-amber-800 border-amber-300'
                }`}
              >
                {currentStudent.isVerified ? 'Cell Verified' : 'Pending Verification'}
              </span>
            </div>

            <div className="mt-4 space-y-3.5 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Enrollment Roll Number</span>
                <span className="font-bold text-slate-900 font-mono text-sm">
                  {currentStudent.rollNumber}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Department / Degree</span>
                <span className="font-semibold text-slate-800">{currentStudent.branch}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">Overall CGPA</span>
                  <span className="text-lg font-black text-slate-900 font-mono">
                    {currentStudent.cgpa.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-slate-400 block">Scale of 10.0</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">Active Backlogs</span>
                  <span
                    className={`text-lg font-black font-mono ${
                      currentStudent.activeBacklogs === 0 ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {currentStudent.activeBacklogs}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    {currentStudent.activeBacklogs === 0 ? 'Clear record' : 'Pending backlog'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">Class 10th %</span>
                  <span className="text-sm font-bold text-slate-800 font-mono">
                    {currentStudent.tenthPercentage.toFixed(1)}%
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">Class 12th %</span>
                  <span className="text-sm font-bold text-slate-800 font-mono">
                    {currentStudent.twelfthPercentage.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-100 text-[11px] text-blue-900">
                <strong className="block mb-0.5">Need academic corrections?</strong>
                CGPA and backlog numbers are locked by the Registrar Office. Contact{' '}
                <a href="mailto:placement.cell@campus.edu" className="underline font-medium">
                  placement.cell@campus.edu
                </a>{' '}
                for re-evaluation.
              </div>
            </div>
          </div>
        </div>

        {/* Right: Editable Contact, Bio & Skills Manager */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Form */}
          <form onSubmit={handleSaveProfile} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide pb-2 border-b border-slate-100">
              Personal Information & Bio
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Campus Email (Primary)</label>
                <input
                  type="email"
                  value={currentStudent.email}
                  disabled
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50/50"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">GitHub Profile</label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50/50"
                  placeholder="https://github.com/username"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">LinkedIn Profile</label>
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50/50"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Professional Summary / Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50/50"
                  placeholder="Summarize your technical interests, notable projects, and career goals..."
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </form>

          {/* Technical Skills Manager */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Verified Technical Skills
                </h2>
                <p className="text-xs text-slate-500">
                  Used by company recruiters to compute automated skill match scores.
                </p>
              </div>
              <span className="text-xs font-mono font-semibold text-slate-500">
                {skills.length} skills
              </span>
            </div>

            {/* Add skill input */}
            <form onSubmit={handleAddSkill} className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Kubernetes, React, Python, C++, AWS..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50/50"
              />
              <button
                type="submit"
                className="px-3 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Skill
              </button>
            </form>

            {/* Skills tag list */}
            <div className="flex flex-wrap gap-2 pt-1">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg bg-blue-50 text-blue-800 border border-blue-200"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-blue-500 hover:text-blue-800 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Printable Placement Resume Modal */}
      {resumeModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs"
          onClick={() => setResumeModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-3xl w-full p-8 text-left max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start pb-4 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                  Standard University Placement Format
                </span>
                <h3 className="text-xl font-bold text-slate-900">{currentStudent.fullName}</h3>
                <p className="text-xs text-slate-600">
                  {currentStudent.branch} · Roll No: {currentStudent.rollNumber}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setResumeModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Resume Content */}
            <div className="py-6 space-y-6 text-xs text-slate-800 font-sans leading-relaxed">
              {/* Contact info bar */}
              <div className="flex flex-wrap gap-4 text-xs text-slate-600 border-b border-slate-100 pb-3">
                <span>Email: {currentStudent.email}</span>
                <span>Phone: {currentStudent.phoneNumber}</span>
                {currentStudent.githubUrl && <span>GitHub: {currentStudent.githubUrl}</span>}
                {currentStudent.linkedinUrl && <span>LinkedIn: {currentStudent.linkedinUrl}</span>}
              </div>

              {/* Summary */}
              {currentStudent.bio && (
                <div>
                  <h4 className="font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                    Professional Summary
                  </h4>
                  <p className="text-slate-600">{currentStudent.bio}</p>
                </div>
              )}

              {/* Education Table */}
              <div>
                <h4 className="font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                  Academic Credentials
                </h4>
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold">
                    <tr>
                      <th className="p-2">Examination / Degree</th>
                      <th className="p-2">Institution / Board</th>
                      <th className="p-2">CGPA / Percentage</th>
                      <th className="p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-2 font-medium">B.Tech in {currentStudent.branch}</td>
                      <td className="p-2">Apex Institute of Technology</td>
                      <td className="p-2 font-mono font-bold">{currentStudent.cgpa.toFixed(2)} / 10.0</td>
                      <td className="p-2 text-emerald-700 font-medium">Pursuing (Class 2026)</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium">Class 12th (Higher Secondary)</td>
                      <td className="p-2">State Board / CBSE</td>
                      <td className="p-2 font-mono font-bold">{currentStudent.twelfthPercentage}%</td>
                      <td className="p-2 text-slate-600">Completed</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium">Class 10th (Secondary School)</td>
                      <td className="p-2">State Board / CBSE</td>
                      <td className="p-2 font-mono font-bold">{currentStudent.tenthPercentage}%</td>
                      <td className="p-2 text-slate-600">Completed</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Skills */}
              <div>
                <h4 className="font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                  Technical Expertise
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {currentStudent.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded font-medium text-[11px]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setResumeModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => alert('Resume print dialog launched.')}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
              >
                Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
