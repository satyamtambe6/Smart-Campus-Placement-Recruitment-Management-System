import { Student, Job, EligibilityResult, EligibilityCriterionCheck } from '../types';

/**
 * Evaluates whether a student satisfies all eligibility constraints for a specific job opening.
 * Mirrors the logic executed by the Spring Boot backend EligibilityService.
 */
export function checkStudentEligibility(student: Student, job: Job): EligibilityResult {
  const criteriaChecks: EligibilityCriterionCheck[] = [];
  const failReasons: string[] = [];

  // 1. Placement Cell Verification Check
  const verificationPassed = student.isVerified;
  criteriaChecks.push({
    criterion: 'Placement Cell Verification',
    required: 'Verified Account',
    actual: student.isVerified ? 'Verified' : 'Pending Verification',
    passed: verificationPassed,
  });
  if (!verificationPassed) {
    failReasons.push('Student academic records are not yet verified by the Placement Cell.');
  }

  // 2. Minimum CGPA Check
  const cgpaPassed = student.cgpa >= job.minCgpa;
  criteriaChecks.push({
    criterion: 'Minimum CGPA',
    required: `>= ${job.minCgpa.toFixed(2)}`,
    actual: student.cgpa.toFixed(2),
    passed: cgpaPassed,
  });
  if (!cgpaPassed) {
    failReasons.push(`CGPA is ${student.cgpa.toFixed(2)}, below the minimum required ${job.minCgpa.toFixed(2)}.`);
  }

  // 3. Eligible Branches Check
  const isBranchEligible =
    job.eligibleBranches.length === 0 ||
    job.eligibleBranches.includes('All Branches') ||
    job.eligibleBranches.some(
      (b) =>
        b.toLowerCase() === student.branch.toLowerCase() ||
        student.branch.toLowerCase().includes(b.toLowerCase()) ||
        b.toLowerCase().includes(student.branch.toLowerCase())
    );

  criteriaChecks.push({
    criterion: 'Eligible Branch / Degree',
    required: job.eligibleBranches.length > 0 ? job.eligibleBranches.join(', ') : 'All Branches',
    actual: student.branch,
    passed: isBranchEligible,
  });
  if (!isBranchEligible) {
    failReasons.push(`Branch '${student.branch}' is not among the eligible departments (${job.eligibleBranches.join(', ')}).`);
  }

  // 4. Maximum Active Backlogs Check
  const backlogPassed = student.activeBacklogs <= job.maxBacklogs;
  criteriaChecks.push({
    criterion: 'Maximum Active Backlogs',
    required: `<= ${job.maxBacklogs} backlogs`,
    actual: `${student.activeBacklogs} active`,
    passed: backlogPassed,
  });
  if (!backlogPassed) {
    failReasons.push(`Active backlogs (${student.activeBacklogs}) exceed the allowed maximum (${job.maxBacklogs}).`);
  }

  // 5. Job Status & Deadline Check
  const isDeadlinePassed = new Date(job.applicationDeadline).getTime() < new Date().setHours(0, 0, 0, 0);
  const statusPassed = job.status === 'OPEN' && !isDeadlinePassed;
  criteriaChecks.push({
    criterion: 'Job Status & Application Deadline',
    required: `OPEN before ${job.applicationDeadline}`,
    actual: isDeadlinePassed ? 'Deadline Passed' : job.status,
    passed: statusPassed,
  });
  if (!statusPassed) {
    failReasons.push(isDeadlinePassed ? 'The application deadline has expired.' : `Job posting is currently ${job.status}.`);
  }

  const isEligible = criteriaChecks.every((c) => c.passed);

  return {
    isEligible,
    criteriaChecks,
    failReasons,
  };
}

/**
 * Calculates skill match percentage between student skills and job required skills.
 */
export function calculateSkillsMatch(studentSkills: string[], requiredSkills: string[]): {
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
} {
  if (!requiredSkills || requiredSkills.length === 0) {
    return { matchPercentage: 100, matchedSkills: [], missingSkills: [] };
  }

  const normalizedStudent = studentSkills.map((s) => s.trim().toLowerCase());
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  requiredSkills.forEach((req) => {
    const isMatched = normalizedStudent.some(
      (s) => s === req.trim().toLowerCase() || s.includes(req.trim().toLowerCase()) || req.trim().toLowerCase().includes(s)
    );
    if (isMatched) {
      matchedSkills.push(req);
    } else {
      missingSkills.push(req);
    }
  });

  const matchPercentage = Math.round((matchedSkills.length / requiredSkills.length) * 100);

  return {
    matchPercentage,
    matchedSkills,
    missingSkills,
  };
}
