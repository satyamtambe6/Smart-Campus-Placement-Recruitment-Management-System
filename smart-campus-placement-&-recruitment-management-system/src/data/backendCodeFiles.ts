export interface BackendFile {
  path: string;
  name: string;
  category: 'Configuration' | 'Database' | 'Model' | 'Repository' | 'Service' | 'Controller' | 'Security';
  language: 'xml' | 'properties' | 'sql' | 'java';
  description: string;
  code: string;
}

export const BACKEND_FILES: BackendFile[] = [
  {
    path: 'pom.xml',
    name: 'pom.xml',
    category: 'Configuration',
    language: 'xml',
    description: 'Maven Project Object Model with Spring Boot 3.2, Spring Security, JWT, PostgreSQL Driver, and Validation.',
    code: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" 
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
        <relativePath/>
    </parent>
    <groupId>com.smartcampus</groupId>
    <artifactId>placement-management-system</artifactId>
    <version>1.0.0</version>
    <name>Smart Campus Placement Management System</name>
    <description>Enterprise Recruitment & Campus Placement Backend in Spring Boot & PostgreSQL</description>

    <properties>
        <java.version>17</java.version>
        <jjwt.version>0.12.3</jjwt.version>
    </properties>

    <dependencies>
        <!-- Spring Boot Web Starter for RESTful APIs -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- Spring Data JPA for Object-Relational Mapping -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>

        <!-- Spring Security for Role-Based Access Control (RBAC) -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>

        <!-- Hibernate Validation for DTO Validation Constraints -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>

        <!-- PostgreSQL JDBC Driver -->
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- JSON Web Token (JJWT) Library -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>\${jjwt.version}</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>\${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>\${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>

        <!-- Project Lombok for Boilerplate Reduction -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- Spring Boot Starter Test -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>`,
  },
  {
    path: 'src/main/resources/application.properties',
    name: 'application.properties',
    category: 'Configuration',
    language: 'properties',
    description: 'PostgreSQL connection pool, Hibernate dialect, JWT secret key, and server port configuration.',
    code: `# Server Configuration
server.port=8080
server.servlet.context-path=/api

# PostgreSQL Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/campus_placement_db
spring.datasource.username=postgres
spring.datasource.password=postgres_secret_password
spring.datasource.driver-class-name=org.postgresql.Driver

# HikariCP Connection Pool Settings
spring.datasource.hikari.maximum-pool-size=15
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.idle-timeout=300000
spring.datasource.hikari.connection-timeout=20000

# Hibernate JPA Settings
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# JWT Token Configuration
app.jwt.secret=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
app.jwt.expiration-milliseconds=86400000

# File Upload Multipart Limit (for resumes and offer letters)
spring.servlet.multipart.max-file-size=5MB
spring.servlet.multipart.max-request-size=10MB`,
  },
  {
    path: 'src/main/resources/schema.sql',
    name: 'schema.sql',
    category: 'Database',
    language: 'sql',
    description: 'Complete PostgreSQL DDL with proper primary keys, foreign keys, cascade constraints, and indexing.',
    code: `-- ========================================================
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

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

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
    skills TEXT[], -- PostgreSQL Array of Skills
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

CREATE INDEX idx_students_roll_number ON students(roll_number);
CREATE INDEX idx_students_branch ON students(branch);
CREATE INDEX idx_students_cgpa ON students(cgpa);
CREATE INDEX idx_students_placement_status ON students(placement_status);

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
    eligible_branches TEXT[] NOT NULL, -- e.g. ARRAY['Computer Science & Engineering', 'Information Technology']
    max_backlogs INT DEFAULT 0 CHECK (max_backlogs >= 0),
    required_skills TEXT[] NOT NULL,
    application_deadline DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'CLOSED', 'UPCOMING')),
    selection_rounds TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_jobs_company ON jobs(company_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_deadline ON jobs(application_deadline);

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

CREATE INDEX idx_applications_job ON applications(job_id);
CREATE INDEX idx_applications_student ON applications(student_id);
CREATE INDEX idx_applications_status ON applications(status);

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

CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);`,
  },
  {
    path: 'src/main/resources/data.sql',
    name: 'data.sql',
    category: 'Database',
    language: 'sql',
    description: 'PostgreSQL sample dataset initializing default Admin, Students, Recruiters, and Job Openings.',
    code: `-- Seed Users (BCrypt hashed password for 'password123': $2a$10$7R9gq... sample)
INSERT INTO users (id, username, email, password_hash, role) VALUES
(1, 'admin', 'placement.cell@campus.edu', '$2a$10$w8T9E3EaZ0h2x2O3i/cEme2c3mJ9V1lE2J1/8z41kZ3Qz9E6eB9qS', 'ADMIN'),
(2, 'arjun_sharma', 'arjun.sharma@campus.edu', '$2a$10$w8T9E3EaZ0h2x2O3i/cEme2c3mJ9V1lE2J1/8z41kZ3Qz9E6eB9qS', 'STUDENT'),
(3, 'priya_patel', 'priya.patel@campus.edu', '$2a$10$w8T9E3EaZ0h2x2O3i/cEme2c3mJ9V1lE2J1/8z41kZ3Qz9E6eB9qS', 'STUDENT'),
(4, 'sarah_recruiter', 'sarah.recruiter@google.com', '$2a$10$w8T9E3EaZ0h2x2O3i/cEme2c3mJ9V1lE2J1/8z41kZ3Qz9E6eB9qS', 'RECRUITER')
ON CONFLICT (id) DO NOTHING;

-- Seed Companies
INSERT INTO companies (id, name, industry, tier, website, contact_email, location, description) VALUES
(1, 'Google LLC', 'Technology & Cloud', 'Tier 1', 'https://careers.google.com', 'campus-apac@google.com', 'Bengaluru / Hyderabad', 'Global leader in search, cloud systems, and AI.'),
(2, 'Microsoft India', 'Enterprise Software', 'Tier 1', 'https://careers.microsoft.com', 'india_university@microsoft.com', 'Hyderabad / Noida', 'Empowering every organization to achieve more via Azure cloud.'),
(3, 'Deloitte Consulting', 'Management & IT', 'Tier 2', 'https://deloitte.com', 'campusrecruitment@deloitte.com', 'Mumbai / Pune', 'Global leader in enterprise business modernization.')
ON CONFLICT (id) DO NOTHING;

-- Seed Students
INSERT INTO students (id, user_id, roll_number, full_name, branch, cgpa, tenth_percentage, twelfth_percentage, active_backlogs, skills, is_verified, placement_status) VALUES
(1, 2, '2023CSB1042', 'Arjun Sharma', 'Computer Science & Engineering', 8.85, 94.20, 91.50, 0, ARRAY['Java', 'Spring Boot', 'React', 'PostgreSQL', 'Docker'], TRUE, 'UNPLACED'),
(2, 3, '2023CSB1088', 'Priya Patel', 'Computer Science & Engineering', 9.35, 96.00, 94.80, 0, ARRAY['Python', 'Machine Learning', 'PyTorch', 'FastAPI'], TRUE, 'PLACED')
ON CONFLICT (id) DO NOTHING;

-- Seed Recruiters
INSERT INTO recruiters (id, user_id, company_id, full_name, designation, phone_number) VALUES
(1, 4, 1, 'Sarah Jenkins', 'Staff University Talent Partner', '+91 98765 43210')
ON CONFLICT (id) DO NOTHING;

-- Seed Jobs
INSERT INTO jobs (id, company_id, recruiter_id, title, description, location, job_type, ctc_lpa, min_cgpa, eligible_branches, max_backlogs, required_skills, application_deadline, status) VALUES
(1, 1, 1, 'Associate Software Engineer (Core Infrastructure)', 'Build distributed backend services and high-scale cloud platforms.', 'Bengaluru', 'FULL_TIME', 36.00, 8.00, ARRAY['Computer Science & Engineering', 'Information Technology'], 0, ARRAY['Java', 'Distributed Systems', 'PostgreSQL'], '2026-12-15', 'OPEN')
ON CONFLICT (id) DO NOTHING;`,
  },
  {
    path: 'src/main/java/com/smartcampus/placement/model/Student.java',
    name: 'Student.java',
    category: 'Model',
    language: 'java',
    description: 'JPA entity mapping student academic credentials, backlogs, branch, skills, and placement status.',
    code: `package com.smartcampus.placement.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "students")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    @NotBlank
    @Column(name = "roll_number", unique = true, nullable = false, length = 30)
    private String rollNumber;

    @NotBlank
    @Column(name = "full_name", nullable = false, length = 120)
    private String fullName;

    @NotBlank
    @Column(name = "branch", nullable = false, length = 100)
    private String branch;

    @NotNull
    @DecimalMin("0.00")
    @DecimalMax("10.00")
    @Column(name = "cgpa", nullable = false, precision = 4, scale = 2)
    private BigDecimal cgpa;

    @NotNull
    @DecimalMin("0.00")
    @DecimalMax("100.00")
    @Column(name = "tenth_percentage", nullable = false, precision = 5, scale = 2)
    private BigDecimal tenthPercentage;

    @NotNull
    @DecimalMin("0.00")
    @DecimalMax("100.00")
    @Column(name = "twelfth_percentage", nullable = false, precision = 5, scale = 2)
    private BigDecimal twelfthPercentage;

    @Min(0)
    @Column(name = "active_backlogs", nullable = false)
    private Integer activeBacklogs = 0;

    @ElementCollection
    @CollectionTable(name = "student_skills", joinColumns = @JoinColumn(name = "student_id"))
    @Column(name = "skill")
    private List<String> skills;

    @Column(name = "resume_url", columnDefinition = "TEXT")
    private String resumeUrl;

    @Column(name = "phone_number", length = 20)
    private String phoneNumber;

    @Column(name = "bio", columnDefinition = "TEXT")
    private String bio;

    @Column(name = "github_url")
    private String githubUrl;

    @Column(name = "linkedin_url")
    private String linkedinUrl;

    @Column(name = "is_verified", nullable = false)
    private Boolean isVerified = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "placement_status", nullable = false, length = 20)
    private PlacementStatus placementStatus = PlacementStatus.UNPLACED;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "placed_company_id")
    private Company placedCompany;

    @Column(name = "package_lpa", precision = 6, scale = 2)
    private BigDecimal packageLpa;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public enum PlacementStatus {
        UNPLACED, PLACED, OPTED_OUT
    }
}`,
  },
  {
    path: 'src/main/java/com/smartcampus/placement/model/Job.java',
    name: 'Job.java',
    category: 'Model',
    language: 'java',
    description: 'JPA entity specifying placement job openings, minimum CGPA, eligible branches, and backlog constraints.',
    code: `package com.smartcampus.placement.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "jobs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recruiter_id")
    private Recruiter recruiter;

    @NotBlank
    @Column(name = "title", nullable = false, length = 150)
    private String title;

    @NotBlank
    @Column(name = "description", columnDefinition = "TEXT", nullable = false)
    private String description;

    @NotBlank
    @Column(name = "location", nullable = false, length = 150)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(name = "job_type", nullable = false)
    private JobType jobType = JobType.FULL_TIME;

    @Column(name = "work_mode", length = 30)
    private String workMode = "Hybrid";

    @NotNull
    @DecimalMin("0.00")
    @Column(name = "ctc_lpa", nullable = false, precision = 6, scale = 2)
    private BigDecimal ctcLpa;

    @NotNull
    @DecimalMin("0.00")
    @DecimalMax("10.00")
    @Column(name = "min_cgpa", nullable = false, precision = 4, scale = 2)
    private BigDecimal minCgpa = BigDecimal.valueOf(6.00);

    @ElementCollection
    @CollectionTable(name = "job_eligible_branches", joinColumns = @JoinColumn(name = "job_id"))
    @Column(name = "branch")
    private List<String> eligibleBranches;

    @Min(0)
    @Column(name = "max_backlogs", nullable = false)
    private Integer maxBacklogs = 0;

    @ElementCollection
    @CollectionTable(name = "job_required_skills", joinColumns = @JoinColumn(name = "job_id"))
    @Column(name = "skill")
    private List<String> requiredSkills;

    @NotNull
    @Column(name = "application_deadline", nullable = false)
    private LocalDate applicationDeadline;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private JobStatus status = JobStatus.OPEN;

    @ElementCollection
    @CollectionTable(name = "job_selection_rounds", joinColumns = @JoinColumn(name = "job_id"))
    @Column(name = "round_name")
    private List<String> selectionRounds;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum JobType {
        FULL_TIME, INTERNSHIP, FULL_TIME_INTERN
    }

    public enum JobStatus {
        OPEN, CLOSED, UPCOMING
    }
}`,
  },
  {
    path: 'src/main/java/com/smartcampus/placement/service/EligibilityService.java',
    name: 'EligibilityService.java',
    category: 'Service',
    language: 'java',
    description: 'Automated eligibility verification engine validating CGPA, eligible branches, backlogs, and deadlines.',
    code: `package com.smartcampus.placement.service;

import com.smartcampus.placement.dto.EligibilityResultDto;
import com.smartcampus.placement.model.Job;
import com.smartcampus.placement.model.Student;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class EligibilityService {

    /**
     * Checks whether a student is eligible for a specific job posting.
     * Evaluates: Verification status, CGPA cut-off, Branch suitability, and Backlog threshold.
     */
    public EligibilityResultDto evaluateEligibility(Student student, Job job) {
        List<EligibilityResultDto.CriterionCheck> checks = new ArrayList<>();
        List<String> failReasons = new ArrayList<>();

        // 1. Placement Cell Verification Check
        boolean isVerified = Boolean.TRUE.equals(student.getIsVerified());
        checks.add(new EligibilityResultDto.CriterionCheck(
                "Placement Cell Verification",
                "Verified Account",
                isVerified ? "Verified" : "Pending Verification",
                isVerified
        ));
        if (!isVerified) {
            failReasons.add("Student profile is awaiting Placement Cell verification.");
        }

        // 2. Minimum CGPA Cut-off Check
        boolean cgpaPassed = student.getCgpa().compareTo(job.getMinCgpa()) >= 0;
        checks.add(new EligibilityResultDto.CriterionCheck(
                "Minimum CGPA",
                ">= " + job.getMinCgpa(),
                student.getCgpa().toString(),
                cgpaPassed
        ));
        if (!cgpaPassed) {
            failReasons.add(String.format("Student CGPA (%.2f) does not meet minimum cut-off (%.2f).", 
                    student.getCgpa(), job.getMinCgpa()));
        }

        // 3. Department / Branch Eligibility Check
        boolean branchPassed = job.getEligibleBranches() == null 
                || job.getEligibleBranches().isEmpty() 
                || job.getEligibleBranches().contains("All Branches")
                || job.getEligibleBranches().stream()
                       .anyMatch(b -> b.equalsIgnoreCase(student.getBranch()));
        
        checks.add(new EligibilityResultDto.CriterionCheck(
                "Eligible Department / Branch",
                job.getEligibleBranches() != null ? String.join(", ", job.getEligibleBranches()) : "All Branches",
                student.getBranch(),
                branchPassed
        ));
        if (!branchPassed) {
            failReasons.add(String.format("Branch '%s' is not listed among eligible branches.", student.getBranch()));
        }

        // 4. Backlogs Check
        boolean backlogPassed = student.getActiveBacklogs() <= job.getMaxBacklogs();
        checks.add(new EligibilityResultDto.CriterionCheck(
                "Active Backlogs",
                "<= " + job.getMaxBacklogs(),
                student.getActiveBacklogs() + " active",
                backlogPassed
        ));
        if (!backlogPassed) {
            failReasons.add(String.format("Active backlogs (%d) exceed maximum allowed (%d).", 
                    student.getActiveBacklogs(), job.getMaxBacklogs()));
        }

        // 5. Job Status & Application Deadline Check
        boolean deadlinePassed = !job.getApplicationDeadline().isBefore(LocalDate.now());
        boolean isOpen = job.getStatus() == Job.JobStatus.OPEN && deadlinePassed;
        checks.add(new EligibilityResultDto.CriterionCheck(
                "Application Window",
                "OPEN on or before " + job.getApplicationDeadline(),
                isOpen ? "Active Open Window" : "Closed / Expired",
                isOpen
        ));
        if (!isOpen) {
            failReasons.add("Job application deadline has passed or drive is closed.");
        }

        boolean isOverallEligible = checks.stream().allMatch(EligibilityResultDto.CriterionCheck::isPassed);

        return EligibilityResultDto.builder()
                .studentId(student.getId())
                .jobId(job.getId())
                .isEligible(isOverallEligible)
                .checks(checks)
                .failureReasons(failReasons)
                .build();
    }
}`,
  },
  {
    path: 'src/main/java/com/smartcampus/placement/security/SecurityConfig.java',
    name: 'SecurityConfig.java',
    category: 'Security',
    language: 'java',
    description: 'Spring Security 6 configuration with stateless JWT filter chain, BCrypt, and CORS settings.',
    code: `package com.smartcampus.placement.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final JwtAuthEntryPoint authEntryPoint;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .exceptionHandling(ex -> ex.authenticationEntryPoint(authEntryPoint))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public authentication & health endpoints
                .requestMatchers("/api/auth/**", "/api/public/**", "/actuator/health").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/jobs/**", "/api/companies/**").permitAll()
                
                // Role-Specific Secured Endpoints
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/recruiters/**").hasAnyRole("RECRUITER", "ADMIN")
                .requestMatchers("/api/students/**").hasAnyRole("STUDENT", "ADMIN")
                
                // All other requests require valid JWT
                .anyRequest().authenticated()
            );

        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}`,
  },
  {
    path: 'src/main/java/com/smartcampus/placement/security/JwtTokenProvider.java',
    name: 'JwtTokenProvider.java',
    category: 'Security',
    language: 'java',
    description: 'JWT issuance and verification service utilizing HMAC-SHA256 signing and expiration checks.',
    code: `package com.smartcampus.placement.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.stream.Collectors;

@Component
public class JwtTokenProvider {

    @Value("\${app.jwt.secret}")
    private String jwtSecret;

    @Value("\${app.jwt.expiration-milliseconds}")
    private long jwtExpirationDate;

    public String generateToken(Authentication authentication) {
        String username = authentication.getName();
        Date currentDate = new Date();
        Date expireDate = new Date(currentDate.getTime() + jwtExpirationDate);

        String roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        return Jwts.builder()
                .subject(username)
                .claim("roles", roles)
                .issuedAt(currentDate)
                .expiration(expireDate)
                .signWith(key(), Jwts.SIG.HS256)
                .compact();
    }

    private SecretKey key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }

    public String getUsername(String token) {
        return Jwts.parser()
                .verifyWith(key())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().verifyWith(key()).build().parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}`,
  },
  {
    path: 'src/main/java/com/smartcampus/placement/controller/JobController.java',
    name: 'JobController.java',
    category: 'Controller',
    language: 'java',
    description: 'REST Controller managing job listings, eligibility evaluation endpoint, and candidate filtering.',
    code: `package com.smartcampus.placement.controller;

import com.smartcampus.placement.dto.EligibilityResultDto;
import com.smartcampus.placement.dto.JobDto;
import com.smartcampus.placement.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @GetMapping
    public ResponseEntity<List<JobDto>> getAllJobs(
            @RequestParam(required = false) String branch,
            @RequestParam(required = false) Double maxCgpaCutoff,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(jobService.getFilteredJobs(branch, maxCgpaCutoff, status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobDto> getJobById(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public ResponseEntity<JobDto> createJob(@Valid @RequestBody JobDto jobDto) {
        return new ResponseEntity<>(jobService.createJob(jobDto), HttpStatus.CREATED);
    }

    @GetMapping("/{jobId}/check-eligibility/{studentId}")
    public ResponseEntity<EligibilityResultDto> checkEligibility(
            @PathVariable Long jobId, 
            @PathVariable Long studentId) {
        return ResponseEntity.ok(jobService.checkStudentEligibility(studentId, jobId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public ResponseEntity<JobDto> updateJob(@PathVariable Long id, @Valid @RequestBody JobDto jobDto) {
        return ResponseEntity.ok(jobService.updateJob(id, jobDto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
        return ResponseEntity.noContent().build();
    }
}`,
  },
  {
    path: 'src/main/java/com/smartcampus/placement/controller/ApplicationController.java',
    name: 'ApplicationController.java',
    category: 'Controller',
    language: 'java',
    description: 'REST Controller managing application submissions, status updates, interview schedules, and offers.',
    code: `package com.smartcampus.placement.controller;

import com.smartcampus.placement.dto.ApplicationDto;
import com.smartcampus.placement.dto.UpdateApplicationStatusRequest;
import com.smartcampus.placement.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping("/apply")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApplicationDto> applyForJob(@RequestParam Long jobId, @RequestParam Long studentId) {
        return new ResponseEntity<>(applicationService.submitApplication(jobId, studentId), HttpStatus.CREATED);
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<List<ApplicationDto>> getApplicationsByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(applicationService.getStudentApplications(studentId));
    }

    @GetMapping("/job/{jobId}")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public ResponseEntity<List<ApplicationDto>> getApplicationsByJob(@PathVariable Long jobId) {
        return ResponseEntity.ok(applicationService.getJobApplications(jobId));
    }

    @PatchMapping("/{applicationId}/status")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public ResponseEntity<ApplicationDto> updateStatus(
            @PathVariable Long applicationId,
            @Valid @RequestBody UpdateApplicationStatusRequest request) {
        return ResponseEntity.ok(applicationService.updateApplicationStatus(applicationId, request));
    }
}`,
  },
  {
    path: 'src/main/java/com/smartcampus/placement/controller/AdminController.java',
    name: 'AdminController.java',
    category: 'Controller',
    language: 'java',
    description: 'REST Controller for Admin placement statistics, company CRUD, student verification, and reporting.',
    code: `package com.smartcampus.placement.controller;

import com.smartcampus.placement.dto.CompanyDto;
import com.smartcampus.placement.dto.PlacementStatsDto;
import com.smartcampus.placement.dto.StudentDto;
import com.smartcampus.placement.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/stats")
    public ResponseEntity<PlacementStatsDto> getPlacementStatistics() {
        return ResponseEntity.ok(adminService.getAggregatedPlacementStatistics());
    }

    @PatchMapping("/students/{studentId}/verify")
    public ResponseEntity<StudentDto> verifyStudentAcademicRecord(
            @PathVariable Long studentId,
            @RequestParam boolean verified) {
        return ResponseEntity.ok(adminService.verifyStudent(studentId, verified));
    }

    @PostMapping("/companies")
    public ResponseEntity<CompanyDto> addCompany(@Valid @RequestBody CompanyDto companyDto) {
        return new ResponseEntity<>(adminService.addCompany(companyDto), HttpStatus.CREATED);
    }

    @PutMapping("/companies/{companyId}")
    public ResponseEntity<CompanyDto> updateCompany(
            @PathVariable Long companyId,
            @Valid @RequestBody CompanyDto companyDto) {
        return ResponseEntity.ok(adminService.updateCompany(companyId, companyDto));
    }

    @DeleteMapping("/companies/{companyId}")
    public ResponseEntity<Void> deleteCompany(@PathVariable Long companyId) {
        adminService.deleteCompany(companyId);
        return ResponseEntity.noContent().build();
    }
}`,
  },
];
