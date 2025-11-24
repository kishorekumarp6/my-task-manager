"""
TASK MANAGER API - MAIN APPLICATION MODULE

This FastAPI application demonstrates modern Python web development concepts:
- Async/await for high-performance concurrent request handling
- Dependency injection for clean, testable code
- Pydantic validation for automatic request/response validation
- JWT authentication for secure user sessions
- CORS middleware for cross-origin frontend integration
- SQLAlchemy ORM for type-safe database operations

EDUCATIONAL GOALS:
This code is designed for learning full-stack development. Each section
includes detailed comments explaining the "why" behind design decisions,
not just the "what" of the code.
"""

from typing import List
from datetime import timedelta

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from . import models, schemas, crud
from .database import Base, engine, get_db
import sys
sys.path.append('..')
from auth import authenticate_user, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES

app = FastAPI(
    title="Task Manager API",
    description="Educational FastAPI backend demonstrating CRUD, JWT auth, and async patterns",
    version="1.0.0"
)

# ============================================================================
# CORS CONFIGURATION
# ============================================================================
# Cross-Origin Resource Sharing allows our Angular frontend (localhost:4200)
# to make requests to this API (localhost:8000).
# Without CORS, browsers block cross-origin requests for security.
# 
# EDUCATIONAL NOTES:
# - allow_origins: Whitelist of domains that can access this API
# - allow_credentials: Allow cookies/auth headers (needed for JWT)
# - allow_methods: HTTP methods permitted (GET, POST, PUT, DELETE, etc.)
# - allow_headers: Request headers allowed (Authorization, Content-Type, etc.)
# 
# PRODUCTION: Replace with your actual frontend domain (e.g., https://yourdomain.com)
origins = [
    "http://localhost:4200",  # Default Angular dev server port
    "http://localhost:4201",  # Alternative port (when 4200 is busy)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Specific origins for security
    allow_credentials=True,  # Allow cookies/auth headers
    allow_methods=["*"],     # Allow all HTTP methods (GET, POST, PUT, DELETE)
    allow_headers=["*"],     # Allow all headers (Content-Type, Authorization, etc.)
)


@app.on_event("startup")
def on_startup():
    """
    APPLICATION STARTUP EVENT
    
    This function runs once when the server starts, before accepting requests.
    Creates all database tables if they don't exist.
    
    EDUCATIONAL NOTE:
    - SQLAlchemy examines model classes (models.Task) and creates corresponding tables
    - If tables already exist, this is a no-op (safe to run repeatedly)
    - In production, use Alembic migrations for schema changes instead
    """
    Base.metadata.create_all(bind=engine)


# ============================================================================
# AUTHENTICATION ENDPOINTS
# ============================================================================

@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    OAuth2-compatible JWT token authentication endpoint.
    
    AUTHENTICATION FLOW:
    1. Frontend sends username/password via form data (not JSON!)
    2. Backend validates credentials against mock user database
    3. If valid, creates JWT token with user identifier
    4. Returns token to frontend for storage (localStorage)
    5. Frontend includes token in Authorization header for subsequent requests
    
    ASYNC PATTERN BENEFIT:
    This endpoint uses 'async def' which allows FastAPI to suspend execution
    during I/O operations (like password hashing verification). While waiting,
    the server can process other incoming requests. This is crucial for login
    endpoints which often experience traffic spikes.
    
    OAuth2PasswordRequestForm EXPLANATION:
    - Uses form data (Content-Type: application/x-www-form-urlencoded)
    - NOT JSON! This is OAuth2 spec requirement
    - Angular's FormData() automatically sets correct Content-Type
    - form_data.username and form_data.password are the field names
    
    JWT TOKEN STRUCTURE:
    - Header: Algorithm (HS256) and token type
    - Payload: User identifier (sub claim) and expiration
    - Signature: Cryptographic signature to prevent tampering
    
    TEST CREDENTIALS (for workshop/demo purposes):
    - Email: demo@example.com / Password: password123
    - Email: admin@example.com / Password: admin123
    
    PRODUCTION SECURITY NOTES:
    - Replace mock users with database-backed user table
    - Use bcrypt/argon2 for password hashing
    - Consider refresh tokens for long-lived sessions
    - Implement rate limiting to prevent brute force attacks
    - Use HTTPS to encrypt credentials in transit
    """
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"]},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "email": user["email"],
            "full_name": user["full_name"]
        }
    }


# ============================================================================
# TASK MANAGEMENT ENDPOINTS (CRUD Operations)
# ============================================================================
# These endpoints demonstrate the core Create-Read-Update-Delete operations.
# All endpoints use async def for optimal concurrency under high load.
#
# ASYNC/AWAIT EDUCATIONAL NOTE:
# While our CRUD functions are synchronous (SQLAlchemy sync API), FastAPI
# automatically runs them in a thread pool when called from async endpoints.
# This prevents blocking the event loop during database I/O.
#
# PRODUCTION ENHANCEMENT:
# For maximum performance, use SQLAlchemy's async engine with asyncpg/aiomysql
# and convert all CRUD operations to true async/await.
# ============================================================================

@app.get("/tasks", response_model=List[schemas.TaskRead])
async def list_tasks(db: Session = Depends(get_db)):
    """
    Retrieve all tasks (READ operation).
    
    REQUEST LIFECYCLE DEMONSTRATION:
    1. **Routing**: FastAPI matches GET /tasks to this function
    2. **Dependency Injection**: get_db() is called, provides database session
    3. **Async Execution**: Function runs as coroutine, can be suspended during I/O
    4. **Business Logic**: Calls crud.get_tasks() which queries database
    5. **Response Serialization**: List[Task] objects → JSON array automatically
    6. **Cleanup**: Database session closed by get_db() finally block
    
    PYDANTIC VALIDATION (response_model):
    - FastAPI validates output matches List[schemas.TaskRead]
    - Ensures consistent API contract (type safety)
    - Automatically generates OpenAPI documentation
    - Filters fields: only TaskRead fields are included in response
    
    ASYNC CONCURRENCY BENEFIT:
    If 10 clients request /tasks simultaneously:
    - Sync (Django/Flask): Needs 10 threads/processes
    - Async (FastAPI): 1 thread handles all via event loop
    
    While database query runs, event loop processes other requests.
    When query completes, event loop resumes this request.
    Result: Higher throughput with fewer resources.
    
    CURRENTLY: No authentication required (for demo simplicity)
    PRODUCTION: Add current_user: str = Depends(get_current_user)
                Filter tasks by user_id to ensure data isolation
    """
    return crud.get_tasks(db)


@app.post("/tasks", response_model=schemas.TaskRead, status_code=status.HTTP_201_CREATED)
async def create_task(task_in: schemas.TaskCreate, db: Session = Depends(get_db)):
    """
    Create a new task (CREATE operation).
    
    PYDANTIC REQUEST VALIDATION:
    - 'task_in: schemas.TaskCreate' triggers automatic validation
    - FastAPI parses JSON request body
    - Pydantic checks: required fields exist, types match, constraints satisfied
    - If validation fails: Returns 422 Unprocessable Entity with error details
    - Only validated data reaches this function (guaranteed data quality!)
    
    STATUS CODE EXPLANATION:
    - 201 Created: RESTful convention for successful resource creation
    - Default would be 200 OK, but 201 is more semantically correct
    - Helps clients distinguish between "created" vs "updated" vs "fetched"
    
    DEPENDENCY INJECTION PATTERN:
    - db: Session = Depends(get_db) is FastAPI's dependency system
    - get_db() is called automatically before this function
    - Provides database session without tight coupling
    - Makes testing easy: can inject mock database session
    - Ensures resource cleanup (session closed in finally block)
    
    ASYNC PATTERN HERE:
    - 'async def' allows FastAPI to handle multiple create requests concurrently
    - If 100 clients POST /tasks simultaneously, one thread handles all
    - Event loop suspends during db.commit(), processes other requests
    - More efficient than spawning 100 threads/processes
    
    WHAT HAPPENS UNDER THE HOOD:
    1. Client sends: POST /tasks with JSON body {"title": "Buy milk", ...}
    2. FastAPI deserializes JSON → Python dict
    3. Pydantic validates dict → TaskCreate object (or 422 error)
    4. FastAPI resolves dependencies → calls get_db()
    5. This function runs → calls crud.create_task()
    6. CRUD function: Creates Task model → db.commit() → returns Task
    7. FastAPI serializes Task → JSON using TaskRead schema
    8. Response sent: 201 Created with JSON body
    9. Cleanup: get_db() finally block closes session
    """
    return crud.create_task(db, task_in)


@app.get("/tasks/{task_id}", response_model=schemas.TaskRead)
async def get_task(task_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a specific task by ID (READ operation).
    
    PATH PARAMETER EXTRACTION:
    - {task_id} in route becomes 'task_id: int' parameter
    - FastAPI automatically extracts from URL: /tasks/123 → task_id=123
    - Type conversion: String "123" → integer 123
    - Validation: If not a valid int (e.g., /tasks/abc), returns 422 error
    
    ERROR HANDLING PATTERN:
    - If task doesn't exist, crud.get_task() returns None
    - We raise HTTPException(404) for "Not Found"
    - FastAPI catches exception, returns JSON error response
    - Client receives: {"detail": "Task not found"} with status 404
    
    WHY NOT HANDLE IN CRUD FUNCTION?
    - CRUD layer focuses on data operations (single responsibility)
    - API layer handles HTTP concerns (status codes, error responses)
    - Separation makes code testable and reusable
    
    ASYNC BENEFIT:
    - Multiple /tasks/{id} requests can be processed concurrently
    - While one request waits for database query, others execute
    - Particularly useful when some queries are slow (complex joins, etc.)
    
    RESPONSE MODEL:
    - response_model=schemas.TaskRead ensures output validation
    - Only fields defined in TaskRead are included
    - Prevents accidental exposure of sensitive fields
    - Example: If Task had 'user_password', TaskRead filters it out
    """
    task = crud.get_task(db, task_id)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return task


@app.put("/tasks/{task_id}", response_model=schemas.TaskRead)
async def update_task(task_id: int, task_in: schemas.TaskUpdate, db: Session = Depends(get_db)):
    """
    Update an existing task (UPDATE operation).
    
    HTTP METHOD CHOICE:
    - PUT: Replace entire resource (RESTful convention)
    - Our implementation: Partial update (only provided fields)
    - Alternative: PATCH for partial updates (more semantically correct)
    - Many APIs use PUT for simplicity, accepting partial data
    
    PARTIAL UPDATE PATTERN:
    - schemas.TaskUpdate has all fields as Optional[type]
    - Client can send only changed fields: {"done": true}
    - CRUD function updates only non-None fields
    - Allows efficient updates without fetching full object first
    
    DUAL PARAMETER SOURCES:
    - task_id: from URL path /tasks/123
    - task_in: from JSON request body {"title": "New title"}
    - FastAPI automatically extracts from correct location
    
    UPDATE FLOW:
    1. Client: PUT /tasks/5 with body {"done": true}
    2. FastAPI: Extracts task_id=5, parses JSON → TaskUpdate
    3. Validation: TaskUpdate schema validates fields
    4. Handler: Calls crud.update_task(db, 5, task_update_obj)
    5. CRUD: Fetches task, updates done=True, commits
    6. Response: Updated task serialized to JSON
    
    ERROR HANDLING:
    - If task doesn't exist: crud returns None → 404 response
    - If validation fails: Pydantic raises → 422 response
    - If database error: SQLAlchemy raises → 500 response
    
    ASYNC CONCURRENCY:
    - Multiple update requests can be processed simultaneously
    - Important for UI with auto-save: many small updates
    - Event loop suspends during db.commit(), handles other requests
    
    PRODUCTION CONSIDERATIONS:
    - Add optimistic locking (version field) to prevent lost updates
    - Add current_user dependency to ensure users update only their tasks
    - Consider audit trail (who updated, when, old values)
    """
    task = crud.update_task(db, task_id, task_in)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return task


@app.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(task_id: int, db: Session = Depends(get_db)):
    """
    Delete a task by ID (DELETE operation).
    
    STATUS CODE 204 NO CONTENT:
    - RESTful convention for successful deletion
    - 204 means: "Request succeeded, but no response body"
    - Alternative: 200 OK with {"message": "Deleted"}
    - We prefer 204 as it's more semantically correct
    
    RETURN VALUE:
    - We return None (no response body)
    - FastAPI sends empty response with 204 status
    - Client knows: 204 = success, 404 = not found
    
    IDEMPOTENCY CONSIDERATION:
    - DELETE should be idempotent: calling twice has same effect
    - Current implementation: 2nd delete returns 404
    - Alternative: Return 204 even if already deleted
    - Both approaches are valid, depends on API design philosophy
    
    SOFT DELETE VS HARD DELETE:
    - Current: Hard delete (row removed from database)
    - Production: Often use soft delete (set deleted_at timestamp)
    - Soft delete benefits: Audit trail, undo functionality, data recovery
    - Soft delete drawback: Need to filter deleted records in queries
    
    CASCADING DELETES:
    - If Task had related records (comments, attachments):
      - Option 1: Database CASCADE (deletes related records automatically)
      - Option 2: Application logic (delete related records explicitly)
      - Option 3: Block deletion if related records exist
    - Current model has no relations, so not applicable here
    
    ASYNC PATTERN:
    - Multiple delete requests can be processed concurrently
    - While one delete commits, others can execute
    - Important for bulk operations or batch cleanup
    
    AUTHORIZATION (missing, for demo simplicity):
    - Production: Verify user owns the task before deleting
    - Add: current_user: str = Depends(get_current_user)
    - Check: if task.user_id != current_user_id: raise 403 Forbidden
    """
    success = crud.delete_task(db, task_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return None
