export type Role = 'ADMIN' | 'STUDENT' | 'RECRUITER';

export interface User {
  id: string;
  username: string;
  email: string;
  role: Role;
  createdAt: string;
  avatarUrl?: string;
}

export type PlacementStatus = 'UNPLACED' | 'PLACED' | 'OPTED_OUT';

export interface Student {
  id: string;
  userId: string;
  rollNumber: string;
  fullName: string;
  email: string;
  branch: string; // e.g. "Computer Science & Engineering", "Information Technology", "Electronics & Communication", "Mechanical Engineering", "Electrical Engineering"
  cgpa: number; // e.g. 8.85
  tenthPercentage: number; // e.g. 92.5
  twelfthPercentage: number; // e.g. 89.0
  activeBacklogs: number; // e.g. 0
  skills: string[]; // e.g. ["Java", "Spring Boot", "React", "PostgreSQL", "Docker"]
  resumeUrl?: string;
  phoneNumber: string;
  isVerified: boolean; // Admin verification
  placementStatus: PlacementStatus;
  placedCompany?: string;
  packageLPA?: number;
  bio?: string;
  githubUrl?: string;
  linkedinUrl?: string;
}

export interface Recruiter {
  id: string;
  userId: string;
  companyId: string;
  fullName: string;
  email: string;
  designation: string;
  phoneNumber: string;
  linkedinProfile?: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  tier: 'Tier 1' | 'Tier 2' | 'Tier 3';
  website: string;
  contactEmail: string;
  location: string;
  logo: string;
  totalHired: number;
  description: string;
  createdAt: string;
}

export type JobStatus = 'OPEN' | 'CLOSED' | 'UPCOMING';
export type JobType = 'FULL_TIME' | 'INTERNSHIP' | 'FULL_TIME_INTERN';

export interface Job {
  id: string;
  companyId: string;
  companyName: string;
  companyLogo?: string;
  recruiterId: string;
  title: string;
  description: string;
  location: string;
  jobType: JobType;
  workMode: 'On-site' | 'Remote' | 'Hybrid';
  ctcLpa: number; // in Lakhs Per Annum, e.g. 18.5
  minCgpa: number; // e.g. 7.5
  eligibleBranches: string[]; // e.g. ["Computer Science & Engineering", "Information Technology"]
  maxBacklogs: number; // e.g. 0
  requiredSkills: string[];
  applicationDeadline: string; // YYYY-MM-DD
  status: JobStatus;
  rounds: string[]; // e.g. ["Online Assessment", "Technical Interview 1", "System Design", "HR Interview"]
  totalApplications?: number;
  createdAt: string;
}

export type ApplicationStatus =
  | 'APPLIED'
  | 'SHORTLISTED'
  | 'TECHNICAL_ROUND'
  | 'HR_ROUND'
  | 'OFFERED'
  | 'REJECTED';

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  companyId: string;
  companyName: string;
  companyLogo?: string;
  studentId: string;
  studentName: string;
  studentRollNumber: string;
  studentBranch: string;
  studentCgpa: number;
  studentEmail: string;
  status: ApplicationStatus;
  appliedAt: string;
  updatedAt: string;
  interviewDate?: string;
  interviewVenueOrLink?: string;
  recruiterNotes?: string;
  offeredCtcLpa?: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'STATUS_UPDATE' | 'INTERVIEW_INVITE' | 'NEW_JOB' | 'SYSTEM';
  isRead: boolean;
  createdAt: string;
  linkTab?: string;
}

export interface EligibilityCriterionCheck {
  criterion: string;
  required: string;
  actual: string;
  passed: boolean;
}

export interface EligibilityResult {
  isEligible: boolean;
  criteriaChecks: EligibilityCriterionCheck[];
  failReasons: string[];
}

export interface PlacementStats {
  totalStudents: number;
  totalPlaced: number;
  placementPercentage: number;
  totalCompanies: number;
  totalOpenings: number;
  totalApplications: number;
  averagePackageLPA: number;
  highestPackageLPA: number;
  branchWiseStats: {
    branch: string;
    total: number;
    placed: number;
    percentage: number;
    avgLPA: number;
  }[];
  salaryDistribution: {
    bracket: string;
    count: number;
    percentage: number;
  }[];
  monthlyHiringTrend: {
    month: string;
    offers: number;
    drives: number;
  }[];
}
