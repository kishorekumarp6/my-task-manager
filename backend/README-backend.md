# Backend - FastAPI + SQLite

This is the backend API for the Task Manager starter. It uses FastAPI, SQLAlchemy, and SQLite.

## Quick start

```bash
cd backend
bash start-backend.sh
```

Backend will start on `http://localhost:8000`.

### API endpoints

- `GET /tasks` – list all tasks
- `POST /tasks` – create a new task
- `GET /tasks/{task_id}` – get a single task
- `PUT /tasks/{task_id}` – update a task
- `DELETE /tasks/{task_id}` – delete a task

### Database

- Uses SQLite with a local file `taskmanager.db` in the `backend/` directory.
- Tables are created automatically on application startup.

### Troubleshooting

- **Virtualenv issues**: If `pip` or `uvicorn` are not found, make sure the virtual environment is activated:
  - POSIX / Git Bash: `source .venv/bin/activate`
  - Windows PowerShell: `.venv\Scripts\Activate.ps1`
- **Port 8000 already in use**: Stop other processes using `8000` or change the port in `start-backend.sh`.
- **Database locked**: Close any other processes using `taskmanager.db` and restart the backend.
