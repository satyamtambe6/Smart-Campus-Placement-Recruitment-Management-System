-- PostgreSQL Initial Seed Data

-- 1. Insert Users
INSERT INTO users (id, username, email, password_hash, role) VALUES
(1, 'admin', 'placement.cell@campus.edu', '$2a$10$w8T9E3EaZ0h2x2O3i/cEme2c3mJ9V1lE2J1/8z41kZ3Qz9E6eB9qS', 'ADMIN'),
(2, 'arjun_sharma', 'arjun.sharma@campus.edu', '$2a$10$w8T9E3EaZ0h2x2O3i/cEme2c3mJ9V1lE2J1/8z41kZ3Qz9E6eB9qS', 'STUDENT'),
(3, 'priya_patel', 'priya.patel@campus.edu', '$2a$10$w8T9E3EaZ0h2x2O3i/cEme2c3mJ9V1lE2J1/8z41kZ3Qz9E6eB9qS', 'STUDENT'),
(4, 'sarah_recruiter', 'sarah.recruiter@google.com', '$2a$10$w8T9E3EaZ0h2x2O3i/cEme2c3mJ9V1lE2J1/8z41kZ3Qz9E6eB9qS', 'RECRUITER')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Companies
INSERT INTO companies (id, name, industry, tier, website, contact_email, location, description) VALUES
(1, 'Google LLC', 'Technology & Cloud', 'Tier 1', 'https://careers.google.com', 'campus-apac@google.com', 'Bengaluru / Hyderabad', 'Global leader in search, cloud computing, and AI systems.'),
(2, 'Microsoft India', 'Enterprise Software', 'Tier 1', 'https://careers.microsoft.com', 'india_university@microsoft.com', 'Hyderabad / Noida', 'Empowering every organization to achieve more via Azure cloud.'),
(3, 'Deloitte Consulting', 'Management & IT', 'Tier 2', 'https://deloitte.com', 'campusrecruitment@deloitte.com', 'Mumbai / Pune', 'Global leader in enterprise business modernization and consulting.')
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Students
INSERT INTO students (id, user_id, roll_number, full_name, branch, cgpa, tenth_percentage, twelfth_percentage, active_backlogs, skills, is_verified, placement_status) VALUES
(1, 2, '2023CSB1042', 'Arjun Sharma', 'Computer Science & Engineering', 8.85, 94.20, 91.50, 0, ARRAY['Java', 'Spring Boot', 'React', 'PostgreSQL', 'Docker'], TRUE, 'UNPLACED'),
(2, 3, '2023CSB1088', 'Priya Patel', 'Computer Science & Engineering', 9.35, 96.00, 94.80, 0, ARRAY['Python', 'Machine Learning', 'PyTorch', 'FastAPI'], TRUE, 'PLACED')
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Recruiters
INSERT INTO recruiters (id, user_id, company_id, full_name, designation, phone_number) VALUES
(1, 4, 1, 'Sarah Jenkins', 'Staff University Talent Partner', '+91 98765 43210')
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Jobs
INSERT INTO jobs (id, company_id, recruiter_id, title, description, location, job_type, ctc_lpa, min_cgpa, eligible_branches, max_backlogs, required_skills, application_deadline, status) VALUES
(1, 1, 1, 'Associate Software Engineer (Core Infrastructure)', 'Build distributed backend services and high-scale cloud platforms.', 'Bengaluru', 'FULL_TIME', 36.00, 8.00, ARRAY['Computer Science & Engineering', 'Information Technology'], 0, ARRAY['Java', 'Distributed Systems', 'PostgreSQL'], '2026-12-15', 'OPEN')
ON CONFLICT (id) DO NOTHING;
