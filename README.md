# My Task Manager

A full-stack task management application demonstrating modern web development patterns with FastAPI and Angular.

## Tech Stack

- **Backend:** FastAPI (Python 3.12+) with SQLite
- **Frontend:** Angular 20 standalone components
- **Authentication:** JWT tokens with OAuth2
- **Database:** SQLite (file-based, no setup required)

## Quick Start

### Prerequisites
- Python 3.12+
- Node.js v20.x or v22.x
- npm

### 1. Start Backend (Terminal 1)

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Backend API: `http://localhost:8000`  
API Docs: `http://localhost:8000/docs`

### 2. Start Frontend (Terminal 2)

```powershell
cd frontend
npm install
npm start
```

Frontend App: `http://localhost:4200`

## Features

### ✅ Authentication & Security
- JWT-based authentication
- Protected routes with route guards
- Automatic token injection in HTTP requests
- Test credentials provided (see login page)

### ✅ Task Management
- Create, read, update, and delete tasks
- Mark tasks as complete/incomplete
- Individual task detail views
- Styled confirmation modals

### ✅ Modern Architecture
- **Routing:** Multi-page navigation with Angular Router
- **Forms:** Reactive forms with validation
- **HTTP:** Interceptors for global error handling
- **State:** Loading and error states throughout
- **UI/UX:** Collapsible sections, smooth animations

## Test Credentials

- **User 1:** `demo@example.com` / `password123`
- **User 2:** `admin@example.com` / `admin123`

## Usage

1. Open `http://localhost:4200` in your browser
2. Click to expand "Test Credentials" section on login page
3. Sign in with one of the test accounts
4. Create, edit, and manage your tasks
5. Click on task titles to view/edit details
6. Use logout button to clear session

## Project Structure

```
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app with auth
│   │   ├── database.py      # SQLAlchemy setup
│   │   ├── models.py        # ORM models
│   │   ├── schemas.py       # Pydantic schemas
│   │   └── crud.py          # Database operations
│   ├── auth.py              # JWT authentication
│   └── requirements.txt     # Python dependencies
│
└── frontend/
    └── src/app/
        ├── app.component.*          # Root component
        ├── auth.service.ts          # Authentication service
        ├── auth.guard.ts            # Route protection
        ├── http-error.interceptor.ts # HTTP interceptor
        ├── login/                   # Login component
        ├── tasks/                   # Task list component
        ├── task-detail/             # Task detail component
        └── confirmation-modal/      # Modal component
```

## Key Concepts Demonstrated

- **Async/Await:** All backend endpoints use async patterns for optimal concurrency
- **Dependency Injection:** FastAPI's DI system for database sessions and auth
- **Route Guards:** Protecting routes that require authentication
- **HTTP Interceptors:** Global request/response handling
- **Reactive Forms:** Type-safe form handling with validation
- **Standalone Components:** Modern Angular architecture without NgModules

## Development Notes

- Backend includes comprehensive educational comments explaining patterns
- Frontend demonstrates production-ready Angular architecture
- Authentication is simplified for educational purposes
- For production, implement proper user registration, password reset, and database storage

## API Documentation

Visit `http://localhost:8000/docs` for interactive Swagger UI documentation where you can:
- Test all API endpoints
- View request/response schemas
- Try authentication flow
- Generate access tokens

## Further Details

See `SETUP.md` for detailed setup instructions, troubleshooting, and advanced configuration.

