import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TopNavbar } from './components/layout/TopNavbar';
import { Sidebar } from './components/layout/Sidebar';

// Student Components
import { StudentDashboard } from './components/student/StudentDashboard';
import { StudentJobsView } from './components/student/StudentJobsView';
import { StudentApplicationsView } from './components/student/StudentApplicationsView';
import { StudentProfileView } from './components/student/StudentProfileView';

// Recruiter Components
import { RecruiterDashboard } from './components/recruiter/RecruiterDashboard';
import { RecruiterJobsView } from './components/recruiter/RecruiterJobsView';
import { RecruiterApplicationsView } from './components/recruiter/RecruiterApplicationsView';
import { RecruiterCandidatePoolView } from './components/recruiter/RecruiterCandidatePoolView';
import { PostJobModal } from './components/recruiter/PostJobModal';

// Admin Components
import { AdminDashboard } from './components/admin/AdminDashboard';
import { PlacementStatsCharts } from './components/admin/PlacementStatsCharts';
import { ManageStudentsView } from './components/admin/ManageStudentsView';
import { ManageCompaniesView } from './components/admin/ManageCompaniesView';
import { ManageJobsView } from './components/admin/ManageJobsView';
import { EligibilityCheckerTool } from './components/admin/EligibilityCheckerTool';

// Backend Architecture & Docs
import { BackendExplorerView } from './components/backend-docs/BackendExplorerView';

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [postJobModalOpen, setPostJobModalOpen] = useState(false);
  const { activeRole, activeTab, setActiveTab } = useApp();

  // If user navigates to 'post-job' tab from sidebar, open modal and show recruiter jobs
  React.useEffect(() => {
    if (activeTab === 'post-job') {
      setPostJobModalOpen(true);
      setActiveTab('recruiter-jobs');
    }
  }, [activeTab, setActiveTab]);

  const renderActiveView = () => {
    // 1. Backend source & architecture view is globally accessible
    if (activeTab === 'backend-code') {
      return <BackendExplorerView />;
    }

    // 2. Student Views
    if (activeRole === 'STUDENT') {
      switch (activeTab) {
        case 'jobs':
          return <StudentJobsView />;
        case 'applications':
          return <StudentApplicationsView />;
        case 'profile':
          return <StudentProfileView />;
        case 'dashboard':
        default:
          return <StudentDashboard />;
      }
    }

    // 3. Recruiter Views
    if (activeRole === 'RECRUITER') {
      switch (activeTab) {
        case 'recruiter-jobs':
          return <RecruiterJobsView />;
        case 'recruiter-applications':
          return <RecruiterApplicationsView />;
        case 'candidate-pool':
          return <RecruiterCandidatePoolView />;
        case 'dashboard':
        default:
          return <RecruiterDashboard />;
      }
    }

    // 4. Admin Views
    if (activeRole === 'ADMIN') {
      switch (activeTab) {
        case 'placement-stats':
          return (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  University Placement Statistics & Predictive Insights
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Aggregate hiring patterns, department benchmarks, and package compensation tiers.
                </p>
              </div>
              <PlacementStatsCharts />
            </div>
          );
        case 'manage-students':
          return <ManageStudentsView />;
        case 'manage-companies':
          return <ManageCompaniesView />;
        case 'manage-jobs':
          return <ManageJobsView />;
        case 'eligibility-tester':
          return <EligibilityCheckerTool />;
        case 'dashboard':
        default:
          return <AdminDashboard />;
      }
    }

    return <StudentDashboard />;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Bar Navigation */}
          <TopNavbar onToggleSidebar={() => setSidebarOpen(true)} />

          {/* Active View Container */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            {renderActiveView()}
          </main>

          {/* Clean University Footer */}
          <footer className="mt-auto border-t border-slate-200/90 bg-white py-4 px-6 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700">Apex Institute of Technology</span>
              <span>·</span>
              <span>Smart Campus Placement & Recruitment Management System</span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="font-mono text-slate-600">Spring Boot 3.2 · PostgreSQL 15 · Spring Security JWT</span>
              <button
                type="button"
                onClick={() => setActiveTab('backend-code')}
                className="text-blue-700 hover:underline font-semibold cursor-pointer"
              >
                Inspect Backend Code
              </button>
            </div>
          </footer>
        </div>
      </div>

      {/* Recruiter Post Job Modal */}
      <PostJobModal
        isOpen={postJobModalOpen}
        onClose={() => setPostJobModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
