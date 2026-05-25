# Developer Contribution Guide

Thank you for contributing to the **Student Details Registry**! This document provides instructions for setting up the local environment, writing code conforming to design standards, managing git branches, and submitting pull requests.

---

## 💻 Local Workspace Installation

Follow these steps to configure your local development workspace. We highly recommend using the Docker orchestration framework for a seamless development experience, but you can also install the services locally.

> [!IMPORTANT]
> When opening the repository in your IDE, recommend setting the directory `/Users/durgaprasadponukumati/.gemini/antigravity/scratch/student-details-registry` as your active workspace.

### Option A: Running via Docker Compose

To compile the entire stack, mount the persistent SQLite database, and network the services together on Port 80 immediately:

```bash
# Build and spin up containers in the background
docker-compose up --build -d

# View live container logs
docker-compose logs -f

# Inspect SQLite database directly inside the running backend container
docker-compose exec backend sqlite3 /app/data/student_registry.db ".tables"
docker-compose exec backend sqlite3 /app/data/student_registry.db "SELECT * FROM students;"

# Tear down the environment and clear volumes
docker-compose down -v
```

---

### Option B: Direct Local Setup

#### 1. Backend Setup (Python / FastAPI)

Navigate to the `backend/` folder, create and activate a virtual environment, and install dependencies:

```bash
cd backend

# Create and activate Python virtual environment
python3 -m venv venv
source venv/bin/activate

# Install backend dependencies
pip install -r requirements.txt
```

Database tables are automatically created on server boot via SQLAlchemy (`Base.metadata.create_all` in `app/main.py`). The repository includes a pre-seeded SQLite database `student_registry.db`.

To run the backend development server locally:
```bash
uvicorn app.main:app --reload --port 8000
```
The server will run on **[http://127.0.0.1:8000](http://127.0.0.1:8000)**.

#### 2. Frontend Setup (React / Vite)

Navigate to the `frontend/` folder and install NPM packages:

```bash
cd ../frontend

# Install frontend packages
npm install
```

The frontend uses Vite's proxy server to intercept `/api` requests and forward them directly to the local FastAPI server (`http://127.0.0.1:8000`).

To run the React development server locally:
```bash
npm run dev
```
The Vite development server will run on **[http://localhost:5173](http://localhost:5173)**.

---

## 🌿 Git Branching & Workflow

We employ a structured workflow mirroring the **Git Flow** paradigm. All changes must be made via pull requests to the main branches.

### Branch Naming Conventions
- **Feature Branches**: `feature/short-description` (e.g., `feature/student-search-debounce`)
- **Bug Fix Branches**: `bugfix/short-description` (e.g., `bugfix/gpa-boundary-422`)
- **Hotfix Branches**: `hotfix/short-description` (e.g., `hotfix/cors-origin-failure`)
- **Documentation Branches**: `docs/short-description` (e.g., `docs/api-guide-fix`)

### Conventional Commits Format
Commit messages must adhere strictly to the **Conventional Commits** specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

#### Supported Types:
- `feat`: A new user-facing feature.
- `fix`: A software bug correction.
- `docs`: Documentation edits.
- `style`: Changes that do not affect code logic (whitespace, formatting, missing semi-colons).
- `refactor`: Structural code edits that do not alter features or fix bugs.
- `test`: Adding missing tests or correcting existing tests.
- `chore`: Modifying build processes, helper tools, or dependency upgrades.

#### Examples:
- `feat(api): add range validation to GPA parameter in read_students`
- `fix(frontend): solve screen flickering on student record submit success`
- `docs(api): update example response payloads in api documentation`

---

## 🧼 Code Quality & Style Standards

To ensure code maintainability, all files must pass lint and format constraints prior to check-in.

### 1. Python Code Quality Rules (PEP 8)
- All Python code must strictly follow **PEP 8** style guidelines.
- **Code Linting**: Checked using `flake8` or `ruff`. Run `flake8 app/` to audit compliance.
- **Code Formatting**: Auto-formatted using `black`. Run `black app/` before checking in code.
- Always include descriptive docstrings for modules, classes, and router functions following the Google Python Style Guide format.
- Ensure proper type-hinting of variables and return types across all functions.

### 2. Frontend JS/JSX Style Rules
- Standard ES6+ modular practices apply.
- Use reusable components; split logic into helper modules or custom hooks when possible.
- **Frontend Formatting**: Styled via Prettier. Run `npx prettier --write src/`.
- **Frontend Linting**: Checked via ESLint. Run `npm run lint`.

### 3. UI Accessibility (WAI-ARIA)
- All interactive components (modals, slide-in drawers, buttons) must be fully keyboard accessible (navigable via `Tab`, selectable via `Enter`/`Space`).
- Every form field must be associated with an explicit `<label>` element.
- Avoid using empty icon actions; include `aria-label` tags for screen readers on buttons that render only SVG icons.

---

## 🧪 Testing Guidelines

No code will be merged without adequate test coverage.

- **Unit/Integration Testing (Backend)**: Driven using **Pytest**. Database operations should be verified using an in-memory SQLite connection (`sqlite:///:memory:`) using isolated session mocks. All route handler and CRUD functions must achieve minimum **85% code coverage**.
- **Component Testing (Frontend)**: Driven using **Vitest** to mock API configurations (e.g. mocking Axios client calls) and verify service parameters mapping.

Run testing suites using:
```bash
# Execute Python backend testing (with coverage reports)
cd backend
pytest --cov=app -v

# Execute Frontend Vitest unit testing
cd frontend
npx vitest run
```

---

## 📝 Pull Request Checklist

Before submitting a Pull Request (PR), verify that you have completed the following:

1. [ ] The backend (`uvicorn`) and frontend (`npm run dev`) compile cleanly without warnings or errors.
2. [ ] All backend (`pytest`) and frontend (`vitest`) tests pass locally.
3. [ ] Code coverage requirements are satisfied.
4. [ ] Python files are formatted using `black` and pass `flake8` audits.
5. [ ] Accessibility checks are reviewed.
6. [ ] The branch is rebased onto the target upstream branch to ensure clean commit history.
7. [ ] Corresponding documentation has been updated to reflect the changes (e.g., `docs/API_DOCUMENTATION.md` or `docs/ARCHITECTURE.md`).
