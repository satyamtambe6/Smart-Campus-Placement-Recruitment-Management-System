import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  User,
  Student,
  Recruiter,
  Company,
  Job,
  Application,
  Notification,
  Role,
  ApplicationStatus,
  PlacementStats,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_STUDENTS,
  INITIAL_COMPANIES,
  INITIAL_RECRUITERS,
  INITIAL_JOBS,
  INITIAL_APPLICATIONS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';
import { checkStudentEligibility } from '../utils/eligibility';

interface AppContextType {
  currentUser: User | null;
  currentStudent: Student | null;
  currentRecruiter: Recruiter | null;
  activeRole: Role;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  users: User[];
  students: Student[];
  recruiters: Recruiter[];
  companies: Company[];
  jobs: Job[];
  applications: Application[];
  notifications: Notification[];
  placementStats: PlacementStats;
  unreadNotificationsCount: number;
  // Auth & Role switching
  switchRole: (role: Role) => void;
  login: (email: string, role: Role) => boolean;
  register: (payload: { username: string; email: string; role: Role; details: any }) => void;
  logout: () => void;
  // Student Actions
  updateStudentProfile: (studentId: string, updates: Partial<Student>) => void;
  applyForJob: (jobId: string, studentId: string) => { success: boolean; message: string };
  // Recruiter & Job Actions
  postJob: (jobData: Omit<Job, 'id' | 'createdAt' | 'totalApplications'>) => void;
  updateJob: (jobId: string, updates: Partial<Job>) => void;
  deleteJob: (jobId: string) => void;
  updateApplicationStatus: (
    applicationId: string,
    status: ApplicationStatus,
    notes?: string,
    interviewDate?: string,
    interviewVenueOrLink?: string,
    offeredCtcLpa?: number
  ) => void;
  // Admin Actions
  verifyStudent: (studentId: string, isVerified: boolean) => void;
  deleteStudent: (studentId: string) => void;
  addCompany: (companyData: Omit<Company, 'id' | 'createdAt' | 'totalHired'>) => void;
  updateCompany: (companyId: string, updates: Partial<Company>) => void;
  deleteCompany: (companyId: string) => void;
  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  resetToSampleData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'smart_campus_users_v1',
  STUDENTS: 'smart_campus_students_v1',
  RECRUITERS: 'smart_campus_recruiters_v1',
  COMPANIES: 'smart_campus_companies_v1',
  JOBS: 'smart_campus_jobs_v1',
  APPLICATIONS: 'smart_campus_applications_v1',
  NOTIFICATIONS: 'smart_campus_notifications_v1',
  CURRENT_USER_ID: 'smart_campus_current_user_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial or local state
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [recruiters, setRecruiters] = useState<Recruiter[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RECRUITERS);
    return saved ? JSON.parse(saved) : INITIAL_RECRUITERS;
  });

  const [companies, setCompanies] = useState<Company[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COMPANIES);
    return saved ? JSON.parse(saved) : INITIAL_COMPANIES;
  });

  const [jobs, setJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.JOBS);
    return saved ? JSON.parse(saved) : INITIAL_JOBS;
  });

  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Current logged in user (Default: Arjun Sharma, Student)
  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    return saved || 'usr-stud-1';
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }, [students]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RECRUITERS, JSON.stringify(recruiters));
  }, [recruiters]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(companies));
  }, [companies]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
  }, [jobs]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
  }, [applications]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
  }, [currentUserId]);

  const currentUser = useMemo(() => {
    return users.find((u) => u.id === currentUserId) || users[0];
  }, [users, currentUserId]);

  const activeRole: Role = currentUser ? currentUser.role : 'STUDENT';

  const currentStudent = useMemo(() => {
    if (!currentUser || currentUser.role !== 'STUDENT') return null;
    return students.find((s) => s.userId === currentUser.id) || students[0];
  }, [currentUser, students]);

  const currentRecruiter = useMemo(() => {
    if (!currentUser || currentUser.role !== 'RECRUITER') return null;
    return recruiters.find((r) => r.userId === currentUser.id) || recruiters[0];
  }, [currentUser, recruiters]);

  // Quick switch role convenience method
  const switchRole = (newRole: Role) => {
    let targetUser: User | undefined;
    if (newRole === 'ADMIN') {
      targetUser = users.find((u) => u.role === 'ADMIN');
    } else if (newRole === 'RECRUITER') {
      targetUser = users.find((u) => u.role === 'RECRUITER');
    } else {
      targetUser = users.find((u) => u.role === 'STUDENT');
    }
    if (targetUser) {
      setCurrentUserId(targetUser.id);
      setActiveTab('dashboard');
    }
  };

  const login = (email: string, role: Role): boolean => {
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setCurrentUserId(existing.id);
      setActiveTab('dashboard');
      return true;
    }
    // If not found, create on the fly
    const newId = `usr-${Date.now()}`;
    const newUser: User = {
      id: newId,
      username: email.split('@')[0],
      email,
      role,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setUsers((prev) => [...prev, newUser]);
    if (role === 'STUDENT') {
      const newStudent: Student = {
        id: `stud-${Date.now()}`,
        userId: newId,
        rollNumber: `2026CSB${Math.floor(1000 + Math.random() * 9000)}`,
        fullName: email.split('@')[0].replace('.', ' '),
        email,
        branch: 'Computer Science & Engineering',
        cgpa: 8.0,
        tenthPercentage: 85.0,
        twelfthPercentage: 82.0,
        activeBacklogs: 0,
        skills: ['Java', 'SQL', 'Web Development'],
        phoneNumber: '+91 98000 00000',
        isVerified: true,
        placementStatus: 'UNPLACED',
      };
      setStudents((prev) => [...prev, newStudent]);
    }
    setCurrentUserId(newId);
    setActiveTab('dashboard');
    return true;
  };

  const register = (payload: { username: string; email: string; role: Role; details: any }) => {
    const newUserId = `usr-${Date.now()}`;
    const newUser: User = {
      id: newUserId,
      username: payload.username,
      email: payload.email,
      role: payload.role,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setUsers((prev) => [...prev, newUser]);

    if (payload.role === 'STUDENT') {
      const newStud: Student = {
        id: `stud-${Date.now()}`,
        userId: newUserId,
        rollNumber: payload.details.rollNumber || `2026${Math.floor(1000 + Math.random() * 9000)}`,
        fullName: payload.details.fullName || payload.username,
        email: payload.email,
        branch: payload.details.branch || 'Computer Science & Engineering',
        cgpa: parseFloat(payload.details.cgpa) || 7.5,
        tenthPercentage: parseFloat(payload.details.tenthPercentage) || 85.0,
        twelfthPercentage: parseFloat(payload.details.twelfthPercentage) || 80.0,
        activeBacklogs: parseInt(payload.details.activeBacklogs, 10) || 0,
        skills: payload.details.skills ? payload.details.skills.split(',').map((s: string) => s.trim()) : ['Java', 'Python'],
        phoneNumber: payload.details.phoneNumber || '+91 99999 99999',
        isVerified: false,
        placementStatus: 'UNPLACED',
      };
      setStudents((prev) => [...prev, newStud]);

      // Trigger notification for admin
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          userId: 'usr-admin-1',
          title: 'New Student Registration',
          message: `${newStud.fullName} (${newStud.rollNumber}) has registered and requires academic verification.`,
          type: 'SYSTEM',
          isRead: false,
          createdAt: new Date().toISOString().split('T')[0],
          linkTab: 'students',
        },
        ...prev,
      ]);
    } else if (payload.role === 'RECRUITER') {
      const newRec: Recruiter = {
        id: `rec-${Date.now()}`,
        userId: newUserId,
        companyId: payload.details.companyId || (companies[0] ? companies[0].id : 'comp-1'),
        fullName: payload.details.fullName || payload.username,
        email: payload.email,
        designation: payload.details.designation || 'Talent Acquisition Partner',
        phoneNumber: payload.details.phoneNumber || '+91 98888 88888',
        linkedinProfile: payload.details.linkedinProfile,
      };
      setRecruiters((prev) => [...prev, newRec]);
    }

    setCurrentUserId(newUserId);
    setActiveTab('dashboard');
  };

  const logout = () => {
    // switch to admin or guest
    switchRole('STUDENT');
  };

  const updateStudentProfile = (studentId: string, updates: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, ...updates } : s))
    );
  };

  const verifyStudent = (studentId: string, isVerified: boolean) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, isVerified } : s))
    );
    const student = students.find((s) => s.id === studentId);
    if (student) {
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          userId: student.userId,
          title: isVerified ? 'Academic Records Verified' : 'Verification Update',
          message: isVerified
            ? 'The Placement Cell has approved and verified your academic credentials. You are now eligible to apply for matching campus drives.'
            : 'Your academic verification was set to pending. Please review your submitted transcripts.',
          type: 'STATUS_UPDATE',
          isRead: false,
          createdAt: new Date().toISOString().split('T')[0],
          linkTab: 'profile',
        },
        ...prev,
      ]);
    }
  };

  const deleteStudent = (studentId: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
    setApplications((prev) => prev.filter((a) => a.studentId !== studentId));
  };

  const addCompany = (companyData: Omit<Company, 'id' | 'createdAt' | 'totalHired'>) => {
    const newComp: Company = {
      ...companyData,
      id: `comp-${Date.now()}`,
      totalHired: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCompanies((prev) => [newComp, ...prev]);
  };

  const updateCompany = (companyId: string, updates: Partial<Company>) => {
    setCompanies((prev) =>
      prev.map((c) => (c.id === companyId ? { ...c, ...updates } : c))
    );
  };

  const deleteCompany = (companyId: string) => {
    setCompanies((prev) => prev.filter((c) => c.id !== companyId));
    setJobs((prev) => prev.filter((j) => j.companyId !== companyId));
  };

  const postJob = (jobData: Omit<Job, 'id' | 'createdAt' | 'totalApplications'>) => {
    const newJob: Job = {
      ...jobData,
      id: `job-${Date.now()}`,
      totalApplications: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setJobs((prev) => [newJob, ...prev]);

    // Broadcast notification to all verified students
    students.forEach((stud) => {
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}-${stud.id}`,
          userId: stud.userId,
          title: `New Drive: ${newJob.companyName}`,
          message: `${newJob.companyName} posted a new position: ${newJob.title} (${newJob.ctcLpa} LPA). Check your eligibility!`,
          type: 'NEW_JOB',
          isRead: false,
          createdAt: new Date().toISOString().split('T')[0],
          linkTab: 'jobs',
        },
        ...prev,
      ]);
    });
  };

  const updateJob = (jobId: string, updates: Partial<Job>) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, ...updates } : j))
    );
  };

  const deleteJob = (jobId: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
    setApplications((prev) => prev.filter((a) => a.jobId !== jobId));
  };

  const applyForJob = (jobId: string, studentId: string): { success: boolean; message: string } => {
    const job = jobs.find((j) => j.id === jobId);
    const student = students.find((s) => s.id === studentId);

    if (!job || !student) {
      return { success: false, message: 'Invalid job or student record.' };
    }

    // Check if already applied
    const alreadyApplied = applications.some((a) => a.jobId === jobId && a.studentId === studentId);
    if (alreadyApplied) {
      return { success: false, message: 'You have already submitted an application for this position.' };
    }

    // Automated Eligibility System Validation
    const eligibility = checkStudentEligibility(student, job);
    if (!eligibility.isEligible) {
      return {
        success: false,
        message: `Eligibility Check Failed: ${eligibility.failReasons.join(' ')}`,
      };
    }

    const newApp: Application = {
      id: `app-${Date.now()}`,
      jobId: job.id,
      jobTitle: job.title,
      companyId: job.companyId,
      companyName: job.companyName,
      companyLogo: job.companyLogo,
      studentId: student.id,
      studentName: student.fullName,
      studentRollNumber: student.rollNumber,
      studentBranch: student.branch,
      studentCgpa: student.cgpa,
      studentEmail: student.email,
      status: 'APPLIED',
      appliedAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString(),
      recruiterNotes: 'Application submitted and passed automated eligibility criteria.',
    };

    setApplications((prev) => [newApp, ...prev]);

    // Update job application counter
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, totalApplications: (j.totalApplications || 0) + 1 } : j))
    );

    // Create confirmation notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        userId: student.userId,
        title: 'Application Successfully Submitted',
        message: `Your application for ${job.title} at ${job.companyName} has been received by the talent team.`,
        type: 'STATUS_UPDATE',
        isRead: false,
        createdAt: new Date().toISOString().split('T')[0],
        linkTab: 'applications',
      },
      ...prev,
    ]);

    return { success: true, message: 'Application submitted successfully! All eligibility criteria met.' };
  };

  const updateApplicationStatus = (
    applicationId: string,
    status: ApplicationStatus,
    notes?: string,
    interviewDate?: string,
    interviewVenueOrLink?: string,
    offeredCtcLpa?: number
  ) => {
    setApplications((prev) =>
      prev.map((a) => {
        if (a.id === applicationId) {
          const updated: Application = {
            ...a,
            status,
            updatedAt: new Date().toLocaleString(),
          };
          if (notes !== undefined) updated.recruiterNotes = notes;
          if (interviewDate !== undefined) updated.interviewDate = interviewDate;
          if (interviewVenueOrLink !== undefined) updated.interviewVenueOrLink = interviewVenueOrLink;
          if (offeredCtcLpa !== undefined) updated.offeredCtcLpa = offeredCtcLpa;

          // If offered, mark student placed and increment company total hired
          if (status === 'OFFERED') {
            setStudents((sPrev) =>
              sPrev.map((s) =>
                s.id === a.studentId
                  ? {
                      ...s,
                      placementStatus: 'PLACED',
                      placedCompany: a.companyName,
                      packageLPA: offeredCtcLpa || 15.0,
                    }
                  : s
              )
            );
            setCompanies((cPrev) =>
              cPrev.map((c) =>
                c.id === a.companyId ? { ...c, totalHired: (c.totalHired || 0) + 1 } : c
              )
            );
          }

          // Send notification to applicant
          const student = students.find((s) => s.id === a.studentId);
          if (student) {
            let notifTitle = `Application Status: ${status.replace('_', ' ')}`;
            let notifMsg = `Your application for ${a.jobTitle} at ${a.companyName} is now ${status.replace('_', ' ')}.`;
            if (status === 'OFFERED') {
              notifTitle = `🎉 Placement Offer: ${a.companyName}`;
              notifMsg = `Congratulations! You have been extended an official placement offer of ${offeredCtcLpa || 15} LPA from ${a.companyName}.`;
            } else if (status === 'TECHNICAL_ROUND' || status === 'HR_ROUND') {
              notifTitle = `Interview Round: ${a.companyName}`;
              notifMsg = `Your interview has been scheduled for ${interviewDate || 'the upcoming week'}. Venue/Link: ${interviewVenueOrLink || 'Online'}.`;
            }

            setNotifications((nPrev) => [
              {
                id: `notif-${Date.now()}`,
                userId: student.userId,
                title: notifTitle,
                message: notifMsg,
                type: status.includes('ROUND') ? 'INTERVIEW_INVITE' : 'STATUS_UPDATE',
                isRead: false,
                createdAt: new Date().toISOString().split('T')[0],
                linkTab: 'applications',
              },
              ...nPrev,
            ]);
          }

          return updated;
        }
        return a;
      })
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    if (!currentUser) return;
    setNotifications((prev) =>
      prev.map((n) => (n.userId === currentUser.id ? { ...n, isRead: true } : n))
    );
  };

  const resetToSampleData = () => {
    localStorage.clear();
    setUsers(INITIAL_USERS);
    setStudents(INITIAL_STUDENTS);
    setRecruiters(INITIAL_RECRUITERS);
    setCompanies(INITIAL_COMPANIES);
    setJobs(INITIAL_JOBS);
    setApplications(INITIAL_APPLICATIONS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setCurrentUserId('usr-stud-1');
    setActiveTab('dashboard');
  };

  // Dynamically computed placement statistics
  const placementStats: PlacementStats = useMemo(() => {
    const totalStudents = students.length;
    const placedStudents = students.filter((s) => s.placementStatus === 'PLACED');
    const totalPlaced = placedStudents.length;
    const placementPercentage = totalStudents > 0 ? Math.round((totalPlaced / totalStudents) * 100) : 0;

    const totalOpenings = jobs.length;
    const totalCompanies = companies.length;
    const totalApplications = applications.length;

    const packages = placedStudents.map((s) => s.packageLPA || 0).filter((p) => p > 0);
    const highestPackageLPA = packages.length > 0 ? Math.max(...packages) : 36.0;
    const averagePackageLPA =
      packages.length > 0 ? parseFloat((packages.reduce((a, b) => a + b, 0) / packages.length).toFixed(2)) : 14.5;

    // Branch-wise breakdown
    const branchMap = new Map<string, { total: number; placed: number; lpas: number[] }>();
    students.forEach((s) => {
      const b = s.branch;
      if (!branchMap.has(b)) {
        branchMap.set(b, { total: 0, placed: 0, lpas: [] });
      }
      const item = branchMap.get(b)!;
      item.total += 1;
      if (s.placementStatus === 'PLACED') {
        item.placed += 1;
        if (s.packageLPA) item.lpas.push(s.packageLPA);
      }
    });

    const branchWiseStats = Array.from(branchMap.entries()).map(([branch, val]) => ({
      branch,
      total: val.total,
      placed: val.placed,
      percentage: val.total > 0 ? Math.round((val.placed / val.total) * 100) : 0,
      avgLPA: val.lpas.length > 0 ? parseFloat((val.lpas.reduce((a, b) => a + b, 0) / val.lpas.length).toFixed(1)) : 0,
    }));

    // Salary distribution
    const salaryBrackets = [
      { bracket: '< 8 LPA', min: 0, max: 8 },
      { bracket: '8 - 15 LPA', min: 8, max: 15 },
      { bracket: '15 - 25 LPA', min: 15, max: 25 },
      { bracket: '25+ LPA', min: 25, max: 100 },
    ];

    const salaryDistribution = salaryBrackets.map((sb) => {
      const count = placedStudents.filter((s) => {
        const p = s.packageLPA || 0;
        return p >= sb.min && (sb.max === 100 ? p >= sb.min : p < sb.max);
      }).length;
      return {
        bracket: sb.bracket,
        count,
        percentage: totalPlaced > 0 ? Math.round((count / totalPlaced) * 100) : 0,
      };
    });

    const monthlyHiringTrend = [
      { month: 'Jul 2026', offers: 3, drives: 4 },
      { month: 'Aug 2026', offers: 12, drives: 8 },
      { month: 'Sep 2026', offers: 28, drives: 14 },
      { month: 'Oct 2026', offers: 42, drives: 19 },
      { month: 'Nov 2026', offers: 35, drives: 11 },
    ];

    return {
      totalStudents,
      totalPlaced,
      placementPercentage,
      totalCompanies,
      totalOpenings,
      totalApplications,
      averagePackageLPA,
      highestPackageLPA,
      branchWiseStats,
      salaryDistribution,
      monthlyHiringTrend,
    };
  }, [students, jobs, companies, applications]);

  const unreadNotificationsCount = useMemo(() => {
    if (!currentUser) return 0;
    return notifications.filter((n) => n.userId === currentUser.id && !n.isRead).length;
  }, [notifications, currentUser]);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentStudent,
        currentRecruiter,
        activeRole,
        activeTab,
        setActiveTab,
        users,
        students,
        recruiters,
        companies,
        jobs,
        applications,
        notifications,
        placementStats,
        unreadNotificationsCount,
        switchRole,
        login,
        register,
        logout,
        updateStudentProfile,
        applyForJob,
        postJob,
        updateJob,
        deleteJob,
        updateApplicationStatus,
        verifyStudent,
        deleteStudent,
        addCompany,
        updateCompany,
        deleteCompany,
        markNotificationRead,
        markAllNotificationsRead,
        resetToSampleData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
