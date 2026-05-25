# Sprint Plan & Progress Tracking

This document outlines the delivery roadmap, sprint schedules, milestone progress tracking, and development action logs for the **Student Details Registry** project.

---

## 🗺️ Sprint Roadmap Overview

The project is structured across five progressive sprints to guide autonomous development from system planning to production Dockerized containerized release.

```
┌────────────────────────────────────────────────────────────────────────────┐
│  Sprint 1: Foundation & Specs                                               │
│  - System Design, SQLAlchemy Models, Pydantic Schemas, Docs Setup          │
│  - STATUS: Completed                                                       │
└─────────────────────────────────────┬──────────────────────────────────────┘
                                      ▼
┌────────────────────────────────────────────────────────────────────────────┐
│  Sprint 2: Backend Development & Storage                                   │
│  - SQLite Setup, FastAPI Routers, Pydantic Validation, Pytest Suites       │
│  - STATUS: Completed                                                       │
└─────────────────────────────────────┬──────────────────────────────────────┘
                                      ▼
┌────────────────────────────────────────────────────────────────────────────┐
│  Sprint 3: Frontend Interface & Caching                                    │
│  - React Components (JSX), Tailwind Layout, Search/Sort UI, Axios proxy    │
│  - STATUS: Completed                                                       │
└─────────────────────────────────────┬──────────────────────────────────────┘
                                      ▼
┌────────────────────────────────────────────────────────────────────────────┐
│  Sprint 4: QA Hardening & CI Pipeline                                      │
│  - Conftest isolated test DB, endpoint Pytest coverage, Vitest service mocks│
│  - STATUS: Completed                                                       │
└─────────────────────────────────────┬──────────────────────────────────────┘
                                      ▼
┌────────────────────────────────────────────────────────────────────────────┐
│  Sprint 5: Containerization, Production Dockerization & Deployment (Current)│
│  - Multi-stage Dockerfiles, Docker Compose integration, Nginx API proxying │
│  - STATUS: Completed (Sprint Review & Delivery)                            │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 🏃 Sprint 1: Project Foundation & Architecture

**Sprint Goal**: Establish the workspace architecture, declare schemas, align team boundaries, and lock REST API specifications.

### Sprint 1 Board Tracker

| Task ID | Description | Assigned To | Priority | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TSK-101** | Create project monorepo structure | Scrum Master | Critical | 🟢 Completed |
| **TSK-102** | Define SQLite DB structure via SQLAlchemy models | Backend Agent | Critical | 🟢 Completed |
| **TSK-103** | Architectural blueprint definition | Doc Writer | High | 🟢 Completed |
| **TSK-104** | Formulate FastAPI query schemas (Pydantic) | Doc Writer | High | 🟢 Completed |
| **TSK-105** | Write multi-agent communication models | Doc Writer | Medium | 🟢 Completed |
| **TSK-106** | Setup baseline React JSX client routing shell | Frontend Agent | Medium | 🟢 Completed |
| **TSK-107** | Configure Python virtual environment configuration | Backend Agent | Low | 🟢 Completed |

---

## 🏃 Sprint 2: Core REST Backend & Validation

**Sprint Goal**: Implement SQLite database configurations, Pydantic validation decorators, FastAPI endpoint routers, and database transaction queries.

### Sprint 2 Board Tracker

| Task ID | Description | Assigned To | Priority | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TSK-201** | Create database tables via auto-initialization | Backend Agent | Critical | 🟢 Completed |
| **TSK-202** | Implement Pydantic v2 schemas constraints | Backend Agent | Critical | 🟢 Completed |
| **TSK-203** | Build FastAPI modular route endpoints | Backend Agent | High | 🟢 Completed |
| **TSK-204** | Formulate Python database seeder script | Backend Agent | Medium | 🟢 Completed |
| **TSK-205** | Setup Pytest framework & SQLAlchemy mock tests | QA Agent | High | 🟢 Completed |

---

## 🏃 Sprint 3: Client Dashboard & State Integration

**Sprint Goal**: Create a responsive UI dashboard, integrate API state caching, build validation-heavy registry forms, and implement keyboard controls in JSX.

### Sprint 3 Board Tracker

| Task ID | Description | Assigned To | Priority | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TSK-301** | Setup Vite client project & routing lines | Frontend Agent | Critical | 🟢 Completed |
| **TSK-302** | UI JSX layout design (Sidebar, Grid, Filter components) | Frontend Agent | High | 🟢 Completed |
| **TSK-303** | Form validation integration (HTML5 + local check hooks) | Frontend Agent | High | 🟢 Completed |
| **TSK-304** | Connect api calls via Axios + parameters pruning | Frontend Agent | High | 🟢 Completed |
| **TSK-305** | Build accessibility checks (Screen readers, focus limits)| QA Agent | Medium | 🟢 Completed |

---

## 🏃 Sprint 4: Integration, QA Testing, and Auditing

**Sprint Goal**: Verify end-to-end user paths, optimize render cycles, complete accessibility passes, and deploy.

### Sprint 4 Board Tracker

| Task ID | Description | Assigned To | Priority | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TSK-401** | Pytest suites and frontend API mockup tests | QA Agent | Critical | 🟢 Completed |
| **TSK-402** | Performance review (INP / LCP optimizations) | QA Agent | High | 🟢 Completed |
| **TSK-403** | Security configuration auditing (CORSMiddleware setup) | Backend Agent | Medium | 🟢 Completed |
| **TSK-404** | GitHub Actions CI workflow config setup | QA Agent | Medium | 🟢 Completed |

---

## 🏃 Sprint 5: Containerization, Production Dockerization & Deployment (Current)

**Sprint Goal**: Implement multi-stage Docker configurations, compose definitions, volume mappings, and a reverse Nginx proxy to deploy the complete containerized stack under Port 80.

### Sprint 5 Board Tracker

| Task ID | Description | Assigned To | Priority | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TSK-501** | Construct backend `Dockerfile` mapping SQLite database volumes | Backend Agent | Critical | 🟢 Completed |
| **TSK-502** | Build multi-stage frontend `Dockerfile` served via Nginx | Frontend Agent | Critical | 🟢 Completed |
| **TSK-503** | Create `nginx.conf` routing SPA history URLs & reverse-proxying API calls | Frontend Agent | High | 🟢 Completed |
| **TSK-504** | Formulate root `docker-compose.yml` linking networks and storage volumes | Scrum Master | Critical | 🟢 Completed |
| **TSK-505** | Audit database persistent storage and verify network handshakes | QA Agent | High | 🟢 Completed |
| **TSK-506** | Finalize project documentation (README and guide manuals) | Doc Writer | Medium | 🟢 Completed |

---

## 📓 Mock Action & Standup Log

### Sprint 1 Standup Logs

- **Day 1 (Project Kickoff)**
  - **Scrum Master**: Created workspace root directory structures. Configured virtual environment setup guidelines.
  - **Backend Developer**: Formulated preliminary SQLAlchemy declarative models and SQLite relationships.
  - **Frontend Developer**: Reviewed design specs for the dashboard layout and Javascript-based `.jsx` component forms.
  - **Documentation Writer**: Initiated the architectural schema specifications.
  - **QA/Testing**: Reviewed code scopes for the Python testing workflow structure.

- **Day 2 (Current Status)**
  - **Scrum Master**: Supervised task progress. Setup workspace boundaries.
  - **Backend Developer**: Formulating database schemas.
  - **Frontend Developer**: Setting up core directories and navigation interfaces.
  - **Documentation Writer**: Completed full architectures, API specifications, and agent operational guide files.
  - **QA/Testing**: Writing Pytest database mock helpers.

- **Day 3 (Sprint 1 Review & Completion)**
  - **Scrum Master**: Audited all sprint deliverables against the Definition of Done. Verified file structures and database model setup. Updated the Sprint Board and resolved tech-stack documentation mismatches.
  - **Backend Developer**: Completed the database configuration and SQLAlchemy model validation. Verified requirements and SQLite connection settings.
  - **Documentation Writer**: Finished documentation alignment across README and five key guide files, incorporating Mermaid UML flowcharts. Verified accuracy with actual implemented Python/FastAPI environment.

### Sprint 2 & 3 Development Logs

- **Day 4 (Backend Services Delivery)**
  - **Scrum Master**: Supervised backend API delivery. Tracked validations, checked errors, verified model structures against database session scopes, and updated task boards.
  - **Backend Developer**: Coded complete FastAPI REST routes with robust 404/409 exception handling. Crafted Pydantic validation constraints for GPA, age limit, enrollment format pattern, and email domains. Constructed complex CRUD queries with pagination, search, sorting, and course/GPA filters.

- **Day 5 (Frontend Interfaces Delivery)**
  - **Scrum Master**: Tracked client dashboard layout execution. Checked off checkboxes in local and docs task lists. Supervised dynamic filters and pagination features mapping frontend states. 
  - **Frontend Developer**: Coded single-page application dashboard featuring responsive Layout sidebar, SearchFilter inputs toolbar, dynamic pagination StudentList data table, validated modal StudentForm dialog, API connection client `api.js` with parameter cleansing, and profile drawer StudentDetail views.

### Sprint 4 & 5 Hardening & Production Release Logs

- **Day 6 (Testing & QA Hardening Complete)**
  - **Scrum Master**: Supervised devops and quality assurance pipelines setup. Spawned QA subagent to verify tests coverage.
  - **QA/Testing & DevOps**: Set up `conftest.py` setting up mock SQLite in-memory sessions and FastAPI `client` fixtures. Authored `test_students.py` testing validations, search filters, dynamic sorting, paginations, conflicts and deletions. Coded frontend unit tests in `api.test.js` checking Axios calculations. Registered `pytest` runners inside GitHub Actions CI workflow config.

- **Day 7 (Docker Compose Deployment Complete)**
  - **Scrum Master**: Directed containerization sprints. Coordinated multi-stage compiler builds, mapped volumes, verified sqlite3 database persistences on restarts, resolved cross-origin proxy paths in Docker Compose networks, and declared Sprint 5 complete.
  - **Backend Developer**: Created backend `Dockerfile` targeting python-slim base image, installed dependencies, configured database volume folders at `/app/data` to ensure storage persistence.
  - **Frontend Developer**: Created `nginx.conf` and multi-stage frontend containerizer, compiling static React assets via Node.js in stage 1, and configuring Nginx in stage 2 to route history files and reverse-proxy API requests to backend hosts on port 8000.
  - **QA/Testing & DevOps**: Tested the complete Dockerized stack. Verified network bridging, container log outputs, and persistent volume read/writes. Assured CI scripts execute cleanly.
  - **Documentation Writer** *(Us)*: Fully finalized all docs guides (`ARCHITECTURE.md`, `API_DOCUMENTATION.md`, `AGENTS.md`, `SPRINT_PLAN.md`, `CONTRIBUTING.md`, and root `README.md`), removing mismatches, establishing clear diagrams, and compiling full specifications.

---

## 🔮 Future Backlog & Product Roadmap

The following enhancements are proposed for future releases post-Sprint 5:
1. **Role-Based Access Control (RBAC)**: Distinguish between Administrator (full editing), Registrar (write student profiles only), and Academic Inspector (read-only view of grades).
2. **Academic Analytics Dashboard**: Visual analytics mapping enrollment counts over time, course distributions, average GPAs, and dropout risk alerts.
3. **Data Export/Import Pipeline**: Fast integration to import student list files from CSV/Excel and export PDF transcripts directly.
4. **Audit Logging Service**: Keep track of every administrative modify/delete record execution event.
