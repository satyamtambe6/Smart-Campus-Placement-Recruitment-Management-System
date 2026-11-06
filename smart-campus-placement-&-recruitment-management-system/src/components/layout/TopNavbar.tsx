import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Role } from '../../types';
import {
  Bell,
  CheckCheck,
  ChevronDown,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  RefreshCw,
  LogOut,
  ExternalLink,
  Code2,
  Menu,
} from 'lucide-react';

interface TopNavbarProps {
  onToggleSidebar?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onToggleSidebar }) => {
  const {
    currentUser,
    activeRole,
    switchRole,
    notifications,
    unreadNotificationsCount,
    markNotificationRead,
    markAllNotificationsRead,
    resetToSampleData,
    setActiveTab,
  } = useApp();

  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const userNotifications = notifications.filter((n) => !currentUser || n.userId === currentUser.id);

  const roleMeta: Record<Role, { label: string; icon: any; color: string; bg: string }> = {
    STUDENT: {
      label: 'Student Portal',
      icon: GraduationCap,
      color: 'text-blue-700',
      bg: 'bg-blue-50 border-blue-200',
    },
    RECRUITER: {
      label: 'Recruiter Portal',
      icon: Briefcase,
      color: 'text-indigo-700',
      bg: 'bg-indigo-50 border-indigo-200',
    },
    ADMIN: {
      label: 'Admin Command',
      icon: ShieldCheck,
      color: 'text-emerald-700',
      bg: 'bg-emerald-50 border-emerald-200',
    },
  };

  const currentRoleConfig = roleMeta[activeRole] || roleMeta.STUDENT;

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200/90 flex items-center justify-between px-4 lg:px-6 gap-8">
      {/* Zone 1: Single text element wordmark + mobile menu toggle */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            SC
          </div>
          <span className="text-base font-bold text-slate-900 tracking-tight whitespace-nowrap">
            Smart Campus <span className="text-blue-700">Placement</span>
          </span>
        </div>
      </div>

      {/* Zone 2: Contextual Role & Quick Switch Buttons */}
      <div className="hidden md:flex items-center gap-2 text-xs font-medium">
        <span className="text-slate-500 mr-1">Demo Persona:</span>
        <button
          type="button"
          onClick={() => switchRole('STUDENT')}
          className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeRole === 'STUDENT'
              ? 'bg-blue-600 text-white border-blue-600 shadow-xs font-semibold'
              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          Student (Arjun)
        </button>
        <button
          type="button"
          onClick={() => switchRole('RECRUITER')}
          className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeRole === 'RECRUITER'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs font-semibold'
              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          Recruiter (Google)
        </button>
        <button
          type="button"
          onClick={() => switchRole('ADMIN')}
          className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeRole === 'ADMIN'
              ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs font-semibold'
              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          Placement Admin
        </button>
      </div>

      {/* Zone 3: 1 primary action area: Spring Boot Docs button, Notifications bell & Profile dropdown */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Spring Boot Backend & DB Inspector Button */}
        <button
          type="button"
          onClick={() => setActiveTab('backend-code')}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs cursor-pointer whitespace-nowrap"
        >
          <Code2 className="w-3.5 h-3.5 text-blue-300" />
          Spring Boot & DB
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center font-mono">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {notifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden text-left">
              <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">Notifications</span>
                  {unreadNotificationsCount > 0 && (
                    <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                      {unreadNotificationsCount} unread
                    </span>
                  )}
                </div>
                {unreadNotificationsCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllNotificationsRead}
                    className="text-[11px] text-blue-700 hover:text-blue-900 font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCheck className="w-3 h-3" /> Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {userNotifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500">
                    No notifications yet.
                  </div>
                ) : (
                  userNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markNotificationRead(notif.id);
                        if (notif.linkTab) setActiveTab(notif.linkTab);
                        setNotifDropdownOpen(false);
                      }}
                      className={`p-3 text-xs cursor-pointer transition-colors hover:bg-slate-50 ${
                        !notif.isRead ? 'bg-blue-50/40' : 'bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-slate-900">{notif.title}</span>
                        <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                          {notif.createdAt}
                        </span>
                      </div>
                      <p className="text-slate-600 mt-1 line-clamp-2">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Account / Role Badge */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200/60"
          >
            <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center">
              {currentUser?.username.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="text-left hidden lg:block">
              <p className="text-xs font-semibold text-slate-900 leading-none">
                {currentUser?.username || 'User'}
              </p>
              <p className="text-[10px] text-slate-500 font-medium capitalize mt-0.5">
                {activeRole.toLowerCase()}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {roleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 z-50 p-2 text-left">
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <p className="text-xs font-bold text-slate-900">{currentUser?.email}</p>
                <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold rounded ${currentRoleConfig.bg} ${currentRoleConfig.color}`}>
                  {currentRoleConfig.label}
                </span>
              </div>

              <div className="space-y-1">
                <p className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Switch Active Role:
                </p>
                <button
                  type="button"
                  onClick={() => {
                    switchRole('STUDENT');
                    setRoleDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs rounded-lg flex items-center gap-2 cursor-pointer ${
                    activeRole === 'STUDENT' ? 'bg-blue-50 text-blue-800 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  Student Persona
                </button>
                <button
                  type="button"
                  onClick={() => {
                    switchRole('RECRUITER');
                    setRoleDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs rounded-lg flex items-center gap-2 cursor-pointer ${
                    activeRole === 'RECRUITER' ? 'bg-indigo-50 text-indigo-800 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Briefcase className="w-4 h-4 text-indigo-600" />
                  Recruiter Persona
                </button>
                <button
                  type="button"
                  onClick={() => {
                    switchRole('ADMIN');
                    setRoleDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs rounded-lg flex items-center gap-2 cursor-pointer ${
                    activeRole === 'ADMIN' ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Admin Persona
                </button>
              </div>

              <div className="border-t border-slate-100 mt-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    resetToSampleData();
                    setRoleDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 rounded-lg flex items-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset Demo Database
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
