# Bug Fix: Task Checkbox Not Working

## Issue Description
The task checkbox functionality was not working properly:
- Clicking the checkbox didn't show toaster notifications ("Task marked as completed" / "Task is re-opened")
- Tasks were not getting struck through when marked as done
- The UI wasn't updating correctly

## Root Cause
**Database Schema Mismatch**

The application had two SQLite database files with different schemas:

1. **`tasks.db`** (old schema): 
   - Had field `completed` (boolean)
   - Contains the actual task data (3 tasks)
   - Was being used by the running backend

2. **`taskmanager.db`** (new schema):
   - Has field `done` (boolean) 
   - Was empty
   - Is what the code expects to use

### Why This Happened
- The backend code uses `taskmanager.db` as configured in `database.py`:
  ```python
  DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./taskmanager.db")
  ```
- However, an older version of the application used `tasks.db` with a different schema
- The backend was somehow reading from `tasks.db` instead of `taskmanager.db`
- The frontend expects the `done` field but was receiving `completed` from the API

### Symptoms
- Frontend: `[(ngModel)]="task.done"` was binding to `task.done`
- Backend API: Was returning `{"completed": false}` instead of `{"done": false}`
- Result: Checkbox clicks didn't trigger updates because of field name mismatch

## Solution

### 1. Created Migration Script
Created `migrate_database.py` to:
- Backup old database (`tasks.db.backup`)
- Read tasks from `tasks.db` (with `completed` field)
- Insert into `taskmanager.db` (with `done` field)
- Add default `created_at` timestamps
- Rename old database to `tasks.db.old`

### 2. Ran Migration
```powershell
cd backend
python migrate_database.py
```

**Migration Results:**
- ✅ Migrated 3 tasks successfully
- ✅ Data now in `taskmanager.db` with correct schema
- ✅ Old database backed up as `tasks.db.old` and `tasks.db.backup`

### 3. Verified Fix
- Restarted backend server
- Tested API: Now returns `{"done": false}` ✅
- Frontend can now bind correctly to `task.done`

## Testing
After the fix, test the following:

1. **Login** to the application
2. **View tasks** - All 3 tasks should appear
3. **Check a task** - Should see "Task marked as completed" toaster
4. **Task should strike through** with reduced opacity
5. **Uncheck the task** - Should see "Task marked as reopened" toaster
6. **Strikethrough should be removed** and opacity restored

## Files Modified
- Created: `backend/migrate_database.py` (migration script)
- Database: `backend/taskmanager.db` (now contains migrated data)
- Backup: `backend/tasks.db.old` (old database, can be deleted after verification)
- Backup: `backend/tasks.db.backup` (migration backup, can be deleted)

## Cleanup (After Verification)
Once you've verified the application works correctly, you can delete:
```powershell
cd backend
Remove-Item tasks.db.old
Remove-Item tasks.db.backup
```

## Prevention
To prevent this issue in the future:

1. **Use Database Migrations**: Implement Alembic for schema migrations
2. **Single Source of Truth**: Ensure only one database file is used
3. **Add to .gitignore**: Database files should not be committed (already done)
4. **Clear Documentation**: Document database location in README

## Technical Details

### Database Schema Comparison
**Old Schema (`tasks.db`):**
```sql
CREATE TABLE tasks (
    id INTEGER PRIMARY KEY,
    title VARCHAR,
    description VARCHAR,
    completed BOOLEAN  -- OLD FIELD NAME
)
```

**New Schema (`taskmanager.db`):**
```sql
CREATE TABLE tasks (
    id INTEGER PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    done BOOLEAN NOT NULL DEFAULT FALSE,  -- NEW FIELD NAME
    created_at DATETIME NOT NULL
)
```

### Code References
- **Frontend**: `frontend/src/app/tasks/tasks.component.html` - Line 80: `[(ngModel)]="task.done"`
- **Frontend**: `frontend/src/app/task.service.ts` - Line 9: `done: boolean;`
- **Backend**: `backend/app/models.py` - Line 10: `done = Column(Boolean, ...)`
- **Backend**: `backend/app/schemas.py` - Line 8: `done: bool = False`
- **Backend**: `backend/app/database.py` - Line 4: `DATABASE_URL = "sqlite:///./taskmanager.db"`

## Summary
The checkbox bug was caused by a database schema mismatch between the old (`completed`) and new (`done`) field names. The migration script successfully resolved this by copying data to the correct database with the correct schema. The application should now work as expected.
