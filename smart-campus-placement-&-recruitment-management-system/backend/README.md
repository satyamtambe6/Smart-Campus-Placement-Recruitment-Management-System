# Smart Campus Placement & Recruitment Management System
## Spring Boot + PostgreSQL Backend

This directory contains the production-ready Java Spring Boot backend for the Smart Campus Placement & Recruitment Management System.

### Technology Stack
- **Framework:** Java 17, Spring Boot 3.2.0
- **Database:** PostgreSQL 15+
- **Security:** Spring Security 6 with JWT (JSON Web Tokens)
- **Persistence:** Spring Data JPA / Hibernate ORM
- **Build Tool:** Apache Maven

### Project Architecture & Layers
```
backend/
├── pom.xml
├── README.md
└── src/
    └── main/
        ├── java/com/smartcampus/placement/
        │   ├── PlacementApplication.java
        │   ├── model/           # JPA Entities (User, Student, Recruiter, Company, Job, Application)
        │   ├── repository/      # Spring Data Repositories
        │   ├── service/         # Business Logic & Eligibility Engine (EligibilityService)
        │   ├── controller/      # REST API Endpoints
        │   ├── security/        # JWT Authentication Filter, Provider & SecurityConfig
        │   └── dto/             # Data Transfer Objects & Requests
        └── resources/
            ├── application.properties # PostgreSQL & JWT config
            ├── schema.sql             # PostgreSQL DDL
            └── data.sql               # Seed records
```

### How to Run Locally

#### 1. PostgreSQL Database Setup
Create database in PostgreSQL:
```bash
psql -U postgres
CREATE DATABASE campus_placement_db;
\q
```
Execute schema and initial seed data:
```bash
psql -U postgres -d campus_placement_db -f src/main/resources/schema.sql
psql -U postgres -d campus_placement_db -f src/main/resources/data.sql
```

#### 2. Run with Maven
```bash
# Clean and compile
mvn clean install

# Run the Spring Boot application
mvn spring-boot:run
```
The server will start on `http://localhost:8080/api`.

#### 3. Default Demo Credentials
- **Admin:** `placement.cell@campus.edu` / `password123`
- **Student:** `arjun.sharma@campus.edu` / `password123`
- **Recruiter:** `sarah.recruiter@google.com` / `password123`
