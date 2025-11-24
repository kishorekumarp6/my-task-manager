# Task Manager Starter - Setup Guide

## Prerequisites

- **Python 3.12+** installed
- **Node.js v20.0+ or v22.0+** installed (any v20.x or v22.x will work)
- **Git** (optional, for cloning)

> **Note for Workshop Attendees:** If you have Node.js v20.x or v22.x (even older minor versions like v22.4), the application will work! The Angular CLI shows engine warnings but will run successfully with the provided configuration.

## Quick Start

### 1. Backend Setup (FastAPI + SQLite)

Open a terminal and run the following commands:

```powershell
# Navigate to the backend directory
cd task-manager-starter\backend

# Create a Python virtual environment
python -m venv .venv

# Activate the virtual environment
.\.venv\Scripts\Activate.ps1

# Upgrade pip
python -m pip install --upgrade pip

# Install dependencies
pip install -r requirements.txt

# Start the backend server (note: app.main:app for subdirectory structure)
uvicorn app.main:app --reload --port 8000
```

**Expected Outcome:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

**Backend Features:**
- ✅ Async endpoints for optimal concurrency
- ✅ JWT authentication with test credentials
- ✅ Comprehensive educational comments explaining patterns
- ✅ CRUD operations with separation of concerns

The backend API is now running at **http://localhost:8000**

**API Documentation:** Visit **http://localhost:8000/docs** for interactive API documentation

---

### 2. Frontend Setup (Angular 20)

Open a **new terminal** (keep the backend running) and run:

```powershell
# Navigate to the frontend directory
cd task-manager-starter\frontend

# Install Node.js dependencies
npm install

# Start the Angular development server
npm start
```

**Expected Outcome:**
```
✔ Browser application bundle generation complete.
** Angular Live Development Server is listening on localhost:4200 **
√ Compiled successfully.
```

The frontend app is now running at **http://localhost:4200**

---

### 3. Access the Application

Open your browser and navigate to:

**http://localhost:4200**

**You will see the Login page first.** The application requires authentication to access tasks.

**Test Credentials:**
- Email: `demo@example.com` | Password: `password123`
- Email: `admin@example.com` | Password: `admin123`

**After successful login:**
- You'll be redirected to the task list page
- Navigation appears with your user name (👤 Demo User) and logout button
- You can create, view, edit, and delete tasks

---

## Testing the Application

### 1. Login Flow

**Default Behavior:**
- App opens to **http://localhost:4200/login** by default
- Navigation and task features are hidden until you log in

**Test Login:**
1. Enter credentials:
   - **Email:** `demo@example.com`
   - **Password:** `password123`
2. Click **Sign In**
3. On success: You'll be redirected to `/tasks` and see the task list
4. On failure: Error message appears (e.g., "Incorrect email or password")

**Test Invalid Credentials:**
1. Enter wrong password
2. See error: "Incorrect email or password. Please try again."
3. Backend down? See error: "Cannot connect to backend server. Please ensure it's running."

### 2. Task Management (After Login)

**Add a Task:**
1. Enter a title (e.g., "Complete lab exercise")
2. Enter a description (e.g., "Finish the FastAPI + Angular tutorial")
3. Click **Add Task**
4. Task appears in the list below

**Edit a Task:**
1. Click on any task title → navigates to `/tasks/:id`
2. Edit the title, description, or completion status
3. Click **Save Changes**
4. Navigate back to see updated task

**Delete a Task:**
1. Click **Delete** button on any task
2. Styled confirmation modal appears (not browser alert!)
3. Click **Confirm** to delete or **Cancel** to dismiss

**Mark Complete/Incomplete:**
- Check/uncheck the checkbox next to any task
- Status updates immediately

### 3. Authentication Features

**Navigation:**
- Only visible when logged in
- Shows: 📋 Tasks link, 👤 User name, 🚪 Logout button
- Active route is highlighted

**Logout:**
1. Click the red **🚪 Logout** button
2. Token is cleared from browser storage
3. You're redirected back to `/login`
4. Navigation disappears

**Protected Routes:**
- Try accessing `http://localhost:4200/tasks` without logging in
- You'll be automatically redirected to `/login`
- After login, you'll be taken to `/tasks`

### 4. Backend API Testing

**API Documentation:**
- Open **http://localhost:8000/docs** in a new browser tab
- You'll see the FastAPI auto-generated API documentation (Swagger UI)
- You can test API endpoints directly from this interface

---

## Understanding Authentication

### Frontend Authentication Flow

**1. Login Component (`/login`)**
- Reactive form with validation (email format, password minimum length)
- Submits credentials to backend `POST /token` endpoint
- On success: Stores JWT token in localStorage → redirects to `/tasks`
- On failure: Displays user-friendly error message

**2. AuthService**
- Manages JWT token storage in browser's localStorage
- Methods: `login()`, `logout()`, `getToken()`, `isAuthenticated()`, `getCurrentUser()`
- Used throughout the app to check authentication status

**3. AuthGuard**
- Protects routes that require authentication
- Applied to `/tasks` and `/tasks/:id` routes
- Checks `authService.isAuthenticated()`
- If not authenticated: Redirects to `/login`
- If authenticated: Allows access

**4. HTTP Interceptor**
- Automatically injects JWT token in all HTTP requests
- Adds header: `Authorization: Bearer <token>`
- Backend receives token and validates it

**5. Conditional Navigation**
- Navigation menu only visible when authenticated
- Shows user name from JWT token payload
- Logout button clears token and redirects to login

### Backend Authentication System

### Backend Authentication System

**JWT Token Generation (`POST /token`):**

1. In the Swagger UI at **http://localhost:8000/docs**, find the `POST /token` endpoint
2. Click **"Try it out"**
3. Enter test credentials:
   - **Username:** `demo@example.com`
   - **Password:** `password123`
4. Click **"Execute"**
5. You'll receive a JWT token in the response:
   ```json
   {
     "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "token_type": "bearer",
     "user": {
       "email": "demo@example.com",
       "full_name": "Demo User"
     }
   }
   ```

**Token Validation (`GET /users/me`):**

1. Click the **"Authorize"** button (🔒 icon) at the top right of the Swagger UI
2. Paste the `access_token` value
3. Click **"Authorize"**, then **"Close"**
4. Find the `GET /users/me` endpoint
5. Click **"Try it out"** → **"Execute"**
6. You should see your user information:
   ```json
   {
     "email": "demo@example.com",
     "full_name": "Demo User"
   }
   ```

**Available Test Users:**

| Email | Password | Full Name |
|-------|----------|-----------|
| `demo@example.com` | `password123` | Demo User |
| `admin@example.com` | `admin123` | Admin User |

**What's Implemented:**
- ✅ JWT token generation with 30-minute expiration
- ✅ Password hashing with bcrypt for security
- ✅ Token validation on protected endpoints
- ✅ Mock user database (no external setup required)
- ✅ Frontend automatic token injection in HTTP requests
- ✅ Route guards protecting task routes
- ✅ Styled confirmation modals (not browser alerts)

**Educational Notes:**
- This is a **simplified authentication system** for workshop/lab purposes
- In production, you would:
  - Store users in a real database (not in-memory)
  - Use environment variables for SECRET_KEY
  - Implement user registration, password reset, email verification
  - Consider OAuth2 providers (Azure AD, Auth0, Okta)
  - Add refresh token mechanism
  - Implement user-specific task filtering (tasks belong to users)

### Testing with cURL or PowerShell

**Get a Token (PowerShell):**
```powershell
$response = Invoke-WebRequest -Uri "http://localhost:8000/token" `
    -Method POST `
    -Body "username=demo@example.com&password=password123" `
    -ContentType "application/x-www-form-urlencoded"

$token = ($response.Content | ConvertFrom-Json).access_token
Write-Host "Token: $token"
```

**Call Protected Endpoint (PowerShell):**
```powershell
$headers = @{Authorization="Bearer $token"}
Invoke-WebRequest -Uri "http://localhost:8000/users/me" `
    -Method GET `
    -Headers $headers
```

---

## Phase 2 Features (Critical Frontend Concepts)

The application has been enhanced with critical Angular concepts for a production-ready architecture:

### 1. Authentication & Route Protection

**What's New:**
- ✅ Full JWT authentication flow with login component
- ✅ AuthService managing token storage in localStorage
- ✅ AuthGuard protecting `/tasks` and `/tasks/:id` routes
- ✅ HTTP Interceptor automatically injecting JWT tokens in all requests
- ✅ Conditional navigation (only visible when authenticated)
- ✅ Logout functionality clearing token and redirecting to login
- ✅ Default route changed from `/tasks` to `/login`

**Try It:**
1. App opens to `/login` by default
2. Enter credentials → redirected to `/tasks` on success
3. Try accessing `/tasks` without login → redirected back to `/login`
4. Click logout button → token cleared, back to `/login`

### 2. Angular Routing (Phase 2.1)

**What's New:**
- ✅ Navigation menu with active route highlighting
- ✅ Three routes: `/login` (public), `/tasks` (protected), `/tasks/:id` (protected)
- ✅ Click on task titles to navigate to detail view
- ✅ `<router-outlet>` for dynamic component rendering

**Try It:**
1. After login, click on any task title → navigates to detail view
2. Use the navigation menu (only shows 📋 Tasks when logged in)
3. Notice the URL changes and active route is highlighted

### 3. Styled Confirmation Modal

**What's New:**
- ✅ Custom modal component replacing browser `confirm()`
- ✅ Overlay backdrop with click-to-dismiss
- ✅ Smooth animations (fadeIn, slideUp)
- ✅ Modern design matching application theme
- ✅ Proper button styling (secondary gray, danger red)

**Try It:**
1. Click **Delete** on any task
2. See styled modal (not browser alert!)
3. Click overlay or **Cancel** to dismiss
4. Click **Confirm** to delete task

### 4. Reactive Forms (Phase 2.3)

**What's New:**
- ✅ LoginComponent and TaskDetailComponent use reactive forms
- ✅ Built-in validation with real-time error display (email format, password/title length)
- ✅ `FormBuilder` for cleaner form initialization
- ✅ Type-safe form values and validation states

**Try It:**
1. On login page, enter invalid email → see validation error
2. On login page, enter short password → see "minimum 6 characters" error
3. Go to a task detail page (`/tasks/:id`)
4. Clear the title field → see validation error
5. Enter less than 3 characters → see "minimum length" error
6. Form submission is disabled until validation passes

### 5. HTTP Interceptor (Phase 2.4)

**What's New:**
- ✅ Global error handling for all HTTP requests
- ✅ Automatic JWT token injection in Authorization header
- ✅ User-friendly error messages based on status codes
- ✅ Request/response logging for debugging

**Try It:**
1. Login and check browser console → see "Token added to request" logs
2. Stop the backend server (Ctrl+C)
3. Try to create a task → see network error message
4. Restart backend → everything works again

### 6. Loading & Error States (Phase 2.5)

**What's New:**
- ✅ Loading spinners during API calls
- ✅ Disabled forms/buttons while loading
- ✅ Error banners with dismiss functionality
- ✅ Prevents duplicate submissions

**Try It:**
1. Create a task → see "Adding..." spinner briefly
2. Slow down network (DevTools → Network → Throttling) → see spinner longer
3. Stop backend → see error banner
4. Click × on error banner → dismiss error message

### Phase 2 Architecture Enhancements

```
┌─────────────────────────────────────────┐
│  Angular Frontend (Port 4200)           │
│  ┌─────────────────────────────────┐   │
│  │ Authentication Layer            │   │
│  │  ↓ AuthService (JWT storage)    │   │
│  │  ↓ AuthGuard (route protection) │   │
│  │  ↓ Login required by default    │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ AppRoutingModule                │   │
│  │  ↓ /login (public)              │   │
│  │  ↓ /tasks (protected)           │   │
│  │  ↓ /tasks/:id (protected)       │   │
│  │  ↓ <router-outlet>              │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ HTTP Interceptor                │   │
│  │  ↓ Global error handling         │   │
│  │  ↓ JWT token injection           │   │
│  │  ↓ Request/response logging      │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ Components                       │   │
│  │  - LoginComponent (auth)         │   │
│  │  - TasksComponent (list)         │   │
│  │  - TaskDetailComponent (detail)  │   │
│  │  - ConfirmationModal (dialog)    │   │
│  │  All with loading/error states   │   │
│  └─────────────────────────────────┘   │
└──────────────┬──────────────────────────┘
               │ HTTP (JWT in header)
               ▼
┌─────────────────────────────────────────┐
│  FastAPI Backend (Port 8000)            │
│  - POST /token (authentication)         │
│  - GET /users/me (protected)            │
│  - All endpoints async/await            │
│  - Comprehensive educational comments   │
│  - JWT validation with python-jose      │
└─────────────────────────────────────────┘
```
```

---

## Architecture Overview

```
┌─────────────────────────────────────────┐
│  Angular Frontend (Port 4200)           │
│  - Components: AppComponent,            │
│                TasksComponent,          │
│                TaskDetailComponent,     │
│                LoginComponent           │
│  - Routing: 3 routes with navigation    │
│  - Service: TaskService                 │
│  - HTTP Client with Interceptor         │
│  - Reactive Forms with validation       │
│  - Loading & Error states               │
└──────────────┬──────────────────────────┘
               │
               │ HTTP Requests (intercepted)
               ▼
┌─────────────────────────────────────────┐
│  FastAPI Backend (Port 8000)            │
│  - Endpoints: GET/POST/PUT/DELETE       │
│               /tasks/, /tasks/{id}      │
│  - Authentication: POST /token,         │
│                    GET /users/me        │
│  - All endpoints: async/await pattern   │
│  - SQLAlchemy ORM                       │
│  - Pydantic schemas                     │
│  - Comprehensive educational comments   │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  SQLite Database (tasks.db)             │
│  - Table: tasks                         │
│  - Fields: id, title, description,      │
│            completed                    │
└─────────────────────────────────────────┘
```

---

## Troubleshooting

### Backend Connection Error

If the frontend shows errors connecting to the backend:
1. Verify the backend is running on port 8000
2. Check the browser console for CORS errors
3. Ensure `http://localhost:8000/tasks/` is accessible

### Angular CLI Version Warnings

If you see "Unsupported engine" warnings during `npm install`:
- **These are just warnings, not errors!** The application will work fine.
- Automatic compatibility patches are applied after installation
- Simply proceed with `npm start` - it will work with any Node.js v20.x or v22.x

**What happens during `npm install`:**
1. Dependencies are installed (you'll see engine warnings - this is normal)
2. Post-install patch automatically runs
3. Angular CLI version check is disabled
4. yargs ESM compatibility is fixed
5. Ready to run with `npm start`!

### Python Virtual Environment Not Activating

On Windows PowerShell, you may need to enable script execution:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## Stopping the Servers

**Backend:**
- Press `CTRL+C` in the terminal running uvicorn

**Frontend:**
- Press `CTRL+C` in the terminal running ng serve

---

## Next Steps

**Explore Phase 1 Features (Backend):**
- Review `backend/main.py` to see async/await pattern and educational comments
- Understand request lifecycle: routing → validation → dependency injection → handler
- Test the authentication flow using the `/docs` interface
- Review `backend/auth.py` to understand JWT implementation

**Explore Phase 2 Features (Frontend):**
- Test the authentication flow: login → tasks → logout
- Navigate between routes and see routing in action
- Examine `frontend/src/app/auth.service.ts` for JWT token management
- Review `frontend/src/app/auth.guard.ts` for route protection logic
- Examine `frontend/src/app/app-routing.module.ts` for route configuration with guards
- Try reactive forms in `LoginComponent` and `TaskDetailComponent` with validation
- Review `frontend/src/app/http-error.interceptor.ts` for token injection and error handling
- Check browser console to see interceptor logs
- Watch loading spinners and error states in action
- Test the styled confirmation modal when deleting tasks

**Advanced Experiments:**
- Add user-specific task filtering (tasks belong to specific users)
- Store user_id with each task on creation
- Filter tasks by current user's ID
- Add more routes (e.g., `/about`, `/profile`)
- Implement token refresh mechanism (before 30-minute expiry)
- Add more form validations (e.g., max length, custom validators)
- Create a shared notification service to replace inline error messages
- Add animations for route transitions and modal appearance
- Implement "Remember Me" functionality with longer token expiry
- Add user registration endpoint and component

---

## File Structure

```
task-manager-starter/
├── backend/
│   ├── .venv/                  # Python virtual environment
│   ├── main.py                 # FastAPI app (async endpoints + comments)
│   ├── database.py             # SQLAlchemy setup
│   ├── models.py               # Task ORM model
│   ├── schemas.py              # Pydantic schemas
│   ├── crud.py                 # Database operations
│   ├── auth.py                 # JWT authentication (mock)
│   ├── requirements.txt        # Python dependencies
│   ├── tasks.db                # SQLite database
│   ├── test_auth.py            # Authentication tests
│   └── test_app.py             # Application tests
│
└── frontend/
    ├── node_modules/           # Node.js dependencies
    ├── src/
    │   ├── app/
    │   │   ├── app.component.*         # Root component (standalone)
    │   │   ├── app.module.ts           # Main module (providers only)
    │   │   ├── app-routing.module.ts   # Routing config with guards
    │   │   ├── auth.service.ts         # JWT token management
    │   │   ├── auth.guard.ts           # Route protection
    │   │   ├── http-error.interceptor.ts # Token injection & error handling
    │   │   ├── task.service.ts         # HTTP service
    │   │   ├── tasks/                  # Task list component
    │   │   ├── task-detail/            # Task detail component
    │   │   ├── login/                  # Login component (functional)
    │   │   └── confirmation-modal/     # Styled modal component
    │   ├── index.html          # Main HTML
    │   ├── main.ts             # Bootstrap (standalone)
    │   └── styles.css          # Global styles
    ├── angular.json            # Angular CLI config (Angular 20)
    ├── package.json            # Dependencies
    ├── patch-angular-cli.js    # Node.js compatibility patch
    └── tsconfig.json           # TypeScript config
```
