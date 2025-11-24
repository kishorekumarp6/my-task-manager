# Git Repository Setup - My Task Manager

This guide helps you initialize and push the My Task Manager project to a git repository.

## Pre-Push Checklist ✅

### Files Cleaned Up
- ✅ .gitignore files created (root, backend, frontend)
- ✅ Instructor documentation moved to `instructor-backup/`
- ✅ Duplicate backend files removed (kept only `backend/app/` structure)
- ✅ Internal docs removed from task-manager-starter
- ✅ Database files will be ignored (.db files)
- ✅ node_modules, .venv, __pycache__ will be ignored

### Repository Structure
```
task-manager-starter/
├── .gitignore
├── README.md                    # Updated with "My Task Manager"
├── SETUP.md                     # Comprehensive setup guide
├── LabGuide_TaskManager_FastAPI_Angular.md
├── backend/
│   ├── .gitignore
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── crud.py
│   ├── auth.py
│   ├── requirements.txt
│   ├── test_app.py
│   ├── test_auth.py
│   └── README-backend.md
└── frontend/
    ├── .gitignore
    ├── src/
    ├── angular.json
    ├── package.json
    ├── patch-angular-cli.js
    ├── tsconfig.json
    ├── tsconfig.app.json
    ├── .npmrc
    └── README-frontend.md
```

## Initialize Git Repository

### 1. Navigate to project folder
```powershell
cd task-manager-starter
```

### 2. Initialize git
```powershell
git init
```

### 3. Add all files
```powershell
git add .
```

### 4. Check what will be committed
```powershell
git status
```

**Expected:** Should NOT see:
- `.venv/` or `node_modules/`
- `*.db` files
- `__pycache__/` or `.angular/`
- `dist/` folder

**Should see:**
- All source code files
- README.md, SETUP.md
- requirements.txt, package.json
- .gitignore files

### 5. Create initial commit
```powershell
git commit -m "Initial commit: My Task Manager - Full-stack FastAPI + Angular application"
```

## Push to Remote Repository

### Option A: GitHub (New Repository)

1. **Create repository on GitHub.com**
   - Repository name: `my-task-manager` (or your preferred name)
   - Description: "Full-stack task management app with FastAPI and Angular"
   - Keep it **Public** (for attendees to clone)
   - **DO NOT** initialize with README (we already have one)

2. **Add remote and push:**
```powershell
git remote add origin https://github.com/YOUR-USERNAME/my-task-manager.git
git branch -M main
git push -u origin main
```

### Option B: Azure DevOps

1. **Create new repository in Azure DevOps project**

2. **Add remote and push:**
```powershell
git remote add origin https://dev.azure.com/YOUR-ORG/YOUR-PROJECT/_git/my-task-manager
git push -u origin --all
```

### Option C: GitLab

1. **Create new project on GitLab**

2. **Add remote and push:**
```powershell
git remote add origin https://gitlab.com/YOUR-USERNAME/my-task-manager.git
git push -u origin main
```

## Share with Attendees

Once pushed, share this URL with attendees:

```
https://github.com/YOUR-USERNAME/my-task-manager
```

### Clone Instructions for Attendees

```powershell
# Clone the repository
git clone https://github.com/YOUR-USERNAME/my-task-manager.git

# Navigate to the project
cd my-task-manager

# Follow the SETUP.md guide to:
# 1. Set up Python backend
# 2. Set up Angular frontend
# 3. Run the application
```

## Verify Everything Works

### Before pushing, test one more time:

**Terminal 1 - Backend:**
```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python -m uvicorn app.main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm start
```

**Browser:**
- Open http://localhost:4200
- Login with demo@example.com / password123
- Create, edit, delete tasks
- Test all features

## Post-Push

### Add Repository URL to README
After pushing, you can add the repository URL to the README.md:

```markdown
## Clone This Repository

\```powershell
git clone https://github.com/YOUR-USERNAME/my-task-manager.git
cd my-task-manager
\```

See [SETUP.md](SETUP.md) for complete setup instructions.
```

### Create a Release (Optional)
Tag your initial version:
```powershell
git tag -a v1.0.0 -m "Workshop Release - My Task Manager v1.0"
git push origin v1.0.0
```

## Troubleshooting

### If you accidentally committed node_modules or .venv:
```powershell
# Remove from git (but keep locally)
git rm -r --cached node_modules frontend/node_modules backend/.venv

# Commit the removal
git commit -m "Remove ignored directories from git"

# Push
git push
```

### To see what will be ignored:
```powershell
git status --ignored
```

## Notes

- **Instructor materials** are backed up in `../instructor-backup/`
- **Database files** (.db) will be auto-created when attendees run the app
- **Virtual environments** will be created by attendees during setup
- **node_modules** will be installed when attendees run `npm install`

---

**Ready to push!** 🚀
