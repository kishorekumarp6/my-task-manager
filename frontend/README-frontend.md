# Frontend - Angular 20 SPA

This is the Angular Single Page Application for the Task Manager starter.

## Quick start

```bash
cd frontend
bash start-frontend.sh
```

The app will be available at `http://localhost:4200`.

### Features

- Displays list of tasks from the FastAPI backend.
- Add new task with title and description.
- Toggle completion state.
- Delete tasks.

### Troubleshooting

- **Node not installed**: Install from <https://nodejs.org/> (LTS recommended).
- **Angular CLI not installed**: `npm install -g @angular/cli`.
- **Port 4200 already in use**: Stop other dev servers or change the port in `start-frontend.sh`.
- **CORS issues**: Ensure backend is running on `http://localhost:8000` and CORS is enabled in `backend/app/main.py`.
