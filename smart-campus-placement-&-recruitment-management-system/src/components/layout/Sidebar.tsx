import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  UserCheck,
  Building2,
  Users,
  CheckCircle,
  BarChart3,
  Code2,
  PlusCircle,
  SlidersHorizontal,
  X,
  ExternalLink,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { activeRole, activeTab, setActiveTab, placementStats, applications, jobs } = useApp();

  const handleNav = (tabId: string) => {
    setActiveTab(tabId);
    onClose();
  };

  // Nav menus based on role
  const getNavItems = () => {
    if (activeRole === 'STUDENT') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'jobs', label: 'Job Opportunities', icon: Briefcase },
        { id: 'applications', label: 'My Applications', icon: FileText },
        { id: 'profile', label: 'Profile & Resume', icon: UserCheck },
        { id: 'backend-code', label: 'Spring Boot & DB Explorer', icon: Code2, isHighlight: true },
      ];
    }
    if (activeRole === 'RECRUITER') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'post-job', label: 'Post Job Opening', icon: PlusCircle },
        { id: 'recruiter-jobs', label: 'Manage Job Postings', icon: Briefcase },
        { id: 'recruiter-applications', label: 'Candidate Applications', icon: FileText },
        { id: 'candidate-pool', label: 'Eligible Student Pool', icon: Users },
        { id: 'backend-code', label: 'Spring Boot & DB Explorer', icon: Code2, isHighlight: true },
      ];
    }
    // ADMIN
    return [
      { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
      { id: 'placement-stats', label: 'Placement Analytics', icon: BarChart3 },
      { id: 'manage-students', label: 'Manage Students', icon: Users },
      { id: 'manage-companies', label: 'Partner Companies', icon: Building2 },
      { id: 'manage-jobs', label: 'Manage Job Openings', icon: Briefcase },
      { id: 'eligibility-tester', label: 'Eligibility Tester', icon: SlidersHorizontal },
      { id: 'backend-code', label: 'Spring Boot & DB Explorer', icon: Code2, isHighlight: true },
    ];
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header inside sidebar */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-extrabold flex items-center justify-center text-xs shadow-xs">
              IIT
            </div>
            <div>
              <p className="text-xs font-bold text-white tracking-wide">CAMPUS RECRUITMENT</p>
              <p className="text-[10px] text-blue-400 font-medium">Placement Management</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Persona Banner */}
        <div className="px-5 py-3 bg-slate-950/60 border-b border-slate-800/80">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Portal Mode:
          </p>
          <p className="text-xs font-bold text-white mt-0.5 flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${
              activeRole === 'ADMIN' ? 'bg-emerald-400' : activeRole === 'RECRUITER' ? 'bg-indigo-400' : 'bg-blue-400'
            }`} />
            {activeRole} DASHBOARD
          </p>
        </div>

        {/* Nav Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <p className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Menu Navigation
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer text-left ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs font-bold'
                    : item.isHighlight
                    ? 'text-blue-300 hover:bg-slate-800/90 hover:text-white bg-slate-800/40 border border-blue-900/50'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : item.isHighlight ? 'text-blue-400' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Placement Summary Footer */}
        <div className="p-4 m-3 rounded-xl bg-slate-800/70 border border-slate-700/60 text-xs">
          <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-700">
            <span>Placed Rate</span>
            <span className="font-bold text-emerald-400 font-mono tabular-nums">
              {placementStats.placementPercentage}%
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-400 pt-2">
            <span>Highest Offer</span>
            <span className="font-bold text-white font-mono tabular-nums">
              {placementStats.highestPackageLPA} LPA
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-400 pt-1.5">
            <span>Active Drives</span>
            <span className="font-bold text-blue-400 font-mono tabular-nums">
              {jobs.filter((j) => j.status === 'OPEN').length} Open
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
