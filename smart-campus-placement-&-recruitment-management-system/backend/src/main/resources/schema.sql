-- ========================================================
-- Smart Campus Placement & Recruitment Management System
-- PostgreSQL Relational Database Schema
-- ========================================================

-- Enable UUID extension if preferred
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE (Core Authentication & RBAC)
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'STUDENT', 'RECRUITER')),
    is_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 2. COMPANIES TABLE
CREATE TABLE IF NOT EXISTS companies (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) UNIQUE NOT NULL,
    industry VARCHAR(100) NOT NULL,
    tier VARCHAR(20) DEFAULT 'Tier 2' CHECK (tier IN ('Tier 1', 'Tier 2', 'Tier 3')),
    website VARCHAR(255),
    contact_email VARCHAR(100) NOT NULL,
    location VARCHAR(150),
    logo_url TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. STUDENTS TABLE
CREATE TABLE IF NOT EXISTS students (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    roll_number VARCHAR(30) UNIQUE NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    branch VARCHAR(100) NOT NULL,
    cgpa NUMERIC(4, 2) NOT NULL CHECK (cgpa >= 0.00 AND cgpa <= 10.00),
    tenth_percentage NUMERIC(5, 2) NOT NULL CHECK (tenth_percentage >= 0 AND tenth_percentage <= 100),
    twelfth_percentage NUMERIC(5, 2) NOT NULL CHECK (twelfth_percentage >= 0 AND twelfth_percentage <= 100),
    active_backlogs INT DEFAULT 0 CHECK (active_backlogs >= 0),
    skills TEXT[],
    resume_url TEXT,
    phone_number VARCHAR(20),
    bio TEXT,
    github_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    placement_status VARCHAR(20) DEFAULT 'UNPLACED' CHECK (placement_status IN ('UNPLACED', 'PLACED', 'OPTED_OUT')),
    placed_company_id BIGINT REFERENCES companies(id) ON DELETE SET NULL,
    package_lpa NUMERIC(6, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_students_roll_number ON students(roll_number);
CREATE INDEX IF NOT EXISTS idx_students_branch ON students(branch);
CREATE INDEX IF NOT EXISTS idx_students_cgpa ON students(cgpa);
CREATE INDEX IF NOT EXISTS idx_students_placement_status ON students(placement_status);

-- 4. RECRUITERS TABLE
CREATE TABLE IF NOT EXISTS recruiters (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_id BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    full_name VARCHAR(120) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    linkedin_profile VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. JOBS TABLE
CREATE TABLE IF NOT EXISTS jobs (
    id BIGSERIAL PRIMARY KEY,
    company_id BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    recruiter_id BIGINT REFERENCES recruiters(id) ON DELETE SET NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(150) NOT NULL,
    job_type VARCHAR(30) DEFAULT 'FULL_TIME' CHECK (job_type IN ('FULL_TIME', 'INTERNSHIP', 'FULL_TIME_INTERN')),
    work_mode VARCHAR(30) DEFAULT 'Hybrid' CHECK (work_mode IN ('On-site', 'Remote', 'Hybrid')),
    ctc_lpa NUMERIC(6, 2) NOT NULL CHECK (ctc_lpa > 0),
    min_cgpa NUMERIC(4, 2) DEFAULT 6.00 CHECK (min_cgpa >= 0.00 AND min_cgpa <= 10.00),
    eligible_branches TEXT[] NOT NULL,
    max_backlogs INT DEFAULT 0 CHECK (max_backlogs >= 0),
    required_skills TEXT[] NOT NULL,
    application_deadline DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'CLOSED', 'UPCOMING')),
    selection_rounds TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_jobs_company ON jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_deadline ON jobs(application_deadline);

-- 6. APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS applications (
    id BIGSERIAL PRIMARY KEY,
    job_id BIGINT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    status VARCHAR(30) DEFAULT 'APPLIED' CHECK (status IN ('APPLIED', 'SHORTLISTED', 'TECHNICAL_ROUND', 'HR_ROUND', 'OFFERED', 'REJECTED')),
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    interview_date VARCHAR(100),
    interview_venue_or_link TEXT,
    recruiter_notes TEXT,
    offered_ctc_lpa NUMERIC(6, 2),
    CONSTRAINT uq_student_job_application UNIQUE(job_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_applications_job ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_student ON applications(student_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);

-- 7. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(30) DEFAULT 'SYSTEM' CHECK (type IN ('STATUS_UPDATE', 'INTERVIEW_INVITE', 'NEW_JOB', 'SYSTEM')),
    is_read BOOLEAN DEFAULT FALSE,
    link_tab VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);
