import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Download,
  Trash2,
  Edit,
  ShieldCheck,
  ShieldAlert,
  X,
  Save,
} from 'lucide-react';

export const ManageStudentsView: React.FC = () => {
  const { students, verifyStudent, deleteStudent, updateStudentProfile } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('ALL');
  const [verificationFilter, setVerificationFilter] = useState<'ALL' | 'VERIFIED' | 'PENDING'>('ALL');
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Edit form state
  const [editCgpa, setEditCgpa] = useState<number>(8.0);
  const [editBacklogs, setEditBacklogs] = useState<number>(0);
  const [editBranch, setEditBranch] = useState('');
  const [editFullName, setEditFullName] = useState('');

  const branches = [
    'ALL',
    'Computer Science & Engineering',
    'Information Technology',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Electrical Engineering',
  ];

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesBranch = selectedBranch === 'ALL' || s.branch === selectedBranch;

      const matchesVerif =
        verificationFilter === 'ALL' ||
        (verificationFilter === 'VERIFIED' ? s.isVerified : !s.isVerified);

      return matchesSearch && matchesBranch && matchesVerif;
    });
  }, [students, searchQuery, selectedBranch, verificationFilter]);

  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    setEditCgpa(student.cgpa);
    setEditBacklogs(student.activeBacklogs);
    setEditBranch(student.branch);
    setEditFullName(student.fullName);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    updateStudentProfile(editingStudent.id, {
      fullName: editFullName,
      cgpa: parseFloat(editCgpa.toString()),
      activeBacklogs: parseInt(editBacklogs.toString(), 10),
      branch: editBranch,
    });
    setEditingStudent(null);
  };

  const handleExportCSV = () => {
    const headers = [
      'Roll Number',
      'Full Name',
      'Email',
      'Branch',
      'CGPA',
      'Backlogs',
      'Class 10%',
      'Class 12%',
      'Verified',
      'Placement Status',
      'Placed Company',
      'Package LPA',
    ];

    const rows = filteredStudents.map((s) => [
      `"${s.rollNumber}"`,
      `"${s.fullName}"`,
      `"${s.email}"`,
      `"${s.branch}"`,
      s.cgpa.toFixed(2),
      s.activeBacklogs,
      s.tenthPercentage.toFixed(1),
      s.twelfthPercentage.toFixed(1),
      s.isVerified ? 'VERIFIED' : 'PENDING',
      s.placementStatus,
      `"${s.placedCompany || 'N/A'}"`,
      s.packageLPA || 0,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `campus_placement_students_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Manage Student Academic Records
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verify academic transcripts, validate backlog clearance, and audit student placement profiles.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          Export Student Registry (CSV)
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by roll number, name, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50/50"
          />
        </div>

        <div>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50/50"
          >
            {branches.map((b) => (
              <option key={b} value={b}>
                {b === 'ALL' ? 'All Engineering Departments' : b}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={verificationFilter}
            onChange={(e) => setVerificationFilter(e.target.value as any)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50/50"
          >
            <option value="ALL">All Verification Statuses</option>
            <option value="VERIFIED">Verified Only</option>
            <option value="PENDING">Pending Verification</option>
          </select>
        </div>
      </div>

      {/* Students Data Grid */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Student / Roll No</th>
                <th className="p-3.5">Department</th>
                <th className="p-3.5">CGPA & Backlogs</th>
                <th className="p-3.5">Verification</th>
                <th className="p-3.5">Placement Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No students match the criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{s.fullName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {s.rollNumber} · {s.email}
                      </div>
                    </td>

                    <td className="p-3.5 text-slate-700 font-medium">
                      {s.branch}
                    </td>

                    <td className="p-3.5">
                      <div className="font-mono font-bold text-slate-900">
                        {s.cgpa.toFixed(2)} CGPA
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Backlogs:{' '}
                        <span
                          className={`font-semibold ${
                            s.activeBacklogs === 0 ? 'text-emerald-700' : 'text-rose-700'
                          }`}
                        >
                          {s.activeBacklogs}
                        </span>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <button
                        type="button"
                        onClick={() => verifyStudent(s.id, !s.isVerified)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border cursor-pointer transition-colors ${
                          s.isVerified
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                        }`}
                        title="Click to toggle verification status"
                      >
                        {s.isVerified ? (
                          <>
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            Verified
                          </>
                        ) : (
                          <>
                            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                            Verify Now
                          </>
                        )}
                      </button>
                    </td>

                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          s.placementStatus === 'PLACED'
                            ? 'bg-purple-50 text-purple-800 border-purple-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {s.placementStatus}
                      </span>
                      {s.placedCompany && (
                        <div className="text-[11px] text-slate-600 font-medium mt-0.5">
                          {s.placedCompany} ({s.packageLPA} LPA)
                        </div>
                      )}
                    </td>

                    <td className="p-3.5 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(s)}
                        className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded border border-slate-200 cursor-pointer"
                        title="Edit academic record"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete ${s.fullName}?`)) {
                            deleteStudent(s.id);
                          }
                        }}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded border border-rose-200 cursor-pointer"
                        title="Delete student"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Student Modal */}
      {editingStudent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs"
          onClick={() => setEditingStudent(null)}
        >
          <div
            className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full p-6 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Update Academic Record
                </h3>
                <p className="text-xs text-slate-500 font-mono">Roll No: {editingStudent.rollNumber}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="py-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50/50"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Department / Branch</label>
                <select
                  value={editBranch}
                  onChange={(e) => setEditBranch(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50/50"
                >
                  {branches
                    .filter((b) => b !== 'ALL')
                    .map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">CGPA (0.00 - 10.00)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={editCgpa}
                    onChange={(e) => setEditCgpa(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50/50 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Active Backlogs</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={editBacklogs}
                    onChange={(e) => setEditBacklogs(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50/50 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
