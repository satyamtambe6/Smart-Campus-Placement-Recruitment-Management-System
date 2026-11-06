import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Role } from '../../types';
import { X, Lock, Mail, User, GraduationCap, Briefcase, ShieldCheck, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'LOGIN' | 'REGISTER';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'LOGIN' }) => {
  const { login, register, switchRole, companies } = useApp();

  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>(initialMode);
  const [role, setRole] = useState<Role>('STUDENT');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  // Student specific registration fields
  const [fullName, setFullName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [branch, setBranch] = useState('Computer Science & Engineering');
  const [cgpa, setCgpa] = useState('8.50');
  const [backlogs, setBacklogs] = useState('0');
  const [skills, setSkills] = useState('Java, Python, SQL');

  // Recruiter specific
  const [companyId, setCompanyId] = useState(companies[0]?.id || 'comp-1');
  const [designation, setDesignation] = useState('Campus Hiring Partner');

  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'LOGIN') {
      if (!email.trim()) {
        setError('Please enter your registered email address.');
        return;
      }
      login(email.trim(), role);
      onClose();
    } else {
      if (!username.trim() || !email.trim()) {
        setError('Please fill in all required credentials.');
        return;
      }

      const details =
        role === 'STUDENT'
          ? {
              fullName: fullName || username,
              rollNumber,
              branch,
              cgpa,
              activeBacklogs: backlogs,
              skills,
            }
          : {
              fullName: fullName || username,
              companyId,
              designation,
            };

      register({
        username,
        email,
        role,
        details,
      });
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 text-left max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {mode === 'LOGIN' ? 'Sign In to Campus Portal' : 'Register New Account'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Smart Campus Placement & Recruitment Management System
            </p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Segmented Selector */}
        <div className="mt-4 p-1 bg-slate-100 rounded-lg grid grid-cols-3 gap-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setRole('STUDENT')}
            className={`py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              role === 'STUDENT' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            Student
          </button>
          <button
            type="button"
            onClick={() => setRole('RECRUITER')}
            className={`py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              role === 'RECRUITER' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            Recruiter
          </button>
          <button
            type="button"
            onClick={() => setRole('ADMIN')}
            className={`py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              role === 'ADMIN' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Admin
          </button>
        </div>

        {error && (
          <div className="mt-3 p-2.5 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          {mode === 'REGISTER' && (
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Username *</label>
              <input
                type="text"
                placeholder="e.g. arjun_sharma"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50/50"
                required
              />
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
            <input
              type="email"
              placeholder={
                role === 'STUDENT'
                  ? 'arjun.sharma@campus.edu'
                  : role === 'RECRUITER'
                  ? 'sarah.recruiter@google.com'
                  : 'placement.cell@campus.edu'
              }
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50/50"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50/50"
            />
          </div>

          {/* Conditional Registration details */}
          {mode === 'REGISTER' && role === 'STUDENT' && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Roll Number</label>
                  <input
                    type="text"
                    placeholder="2026CSB1042"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50/50"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">CGPA</label>
                  <input
                    type="number"
                    step="0.01"
                    min="5"
                    max="10"
                    value={cgpa}
                    onChange={(e) => setCgpa(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50/50 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Department</label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50/50"
                >
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Technical Skills</label>
                <input
                  type="text"
                  placeholder="Java, Python, React, SQL"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50/50"
                />
              </div>
            </>
          )}

          {mode === 'REGISTER' && role === 'RECRUITER' && (
            <>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hiring Organization</label>
                <select
                  value={companyId}
                  onChange={(e) => setCompanyId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50/50"
                >
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.tier})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official Designation</label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50/50"
                />
              </div>
            </>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs cursor-pointer text-xs"
            >
              {mode === 'LOGIN' ? `Sign In as ${role}` : `Register as ${role}`}
            </button>
          </div>
        </form>

        <div className="mt-4 pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
          {mode === 'LOGIN' ? (
            <p>
              New student or recruiter?{' '}
              <button
                type="button"
                onClick={() => setMode('REGISTER')}
                className="font-bold text-blue-600 hover:underline cursor-pointer"
              >
                Create Account
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => setMode('LOGIN')}
                className="font-bold text-blue-600 hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
