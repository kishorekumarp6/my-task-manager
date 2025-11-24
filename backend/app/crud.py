"""
CRUD OPERATIONS MODULE

This module contains all database operations for the Task Manager application.
Separating database logic from API endpoints follows the "Separation of Concerns" principle.

DESIGN PATTERN BENEFITS:
- Reusability: These functions can be called from multiple endpoints or background tasks
- Testability: Can unit test database logic without spinning up the web server
- Maintainability: Database changes only require updating this file
- Clarity: API endpoints focus on HTTP concerns, CRUD focuses on data operations

ASYNC PATTERN NOTE:
While these functions are synchronous (using SQLAlchemy's sync API), FastAPI
automatically runs them in a thread pool when called from async endpoints.
This prevents blocking the event loop during database I/O.

For true async database operations, use SQLAlchemy's async engine with asyncpg/aiomysql.
"""

from typing import List, Optional

from sqlalchemy.orm import Session

from . import models, schemas


def create_task(db: Session, task_in: schemas.TaskCreate) -> models.Task:
    """
    Create a new task in the database.
    
    PROCESS:
    1. Instantiate Task model with validated data from Pydantic schema
    2. Add to session (stages for commit)
    3. Commit transaction (persists to database)
    4. Refresh object (loads generated fields like id, created_at)
    
    NOTE: db.commit() triggers the actual SQL INSERT statement
    """
    task = models.Task(
        title=task_in.title,
        description=task_in.description,
        done=task_in.done,
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


def get_tasks(db: Session) -> List[models.Task]:
    """
    Retrieve all tasks, ordered by creation date (newest first).
    
    SQLALCHEMY QUERY PATTERN:
    - db.query(Model): Start a SELECT query
    - .order_by(field.desc()): Sort descending
    - .all(): Execute query and return list of objects
    
    Returns empty list [] if no tasks exist.
    """
    return db.query(models.Task).order_by(models.Task.created_at.desc()).all()


def get_task(db: Session, task_id: int) -> Optional[models.Task]:
    """
    Retrieve a single task by ID.
    
    SQLALCHEMY QUERY PATTERN:
    - .filter(condition): Add WHERE clause
    - .first(): Execute query, return first result or None
    
    Returns None if task doesn't exist (endpoint handles 404).
    """
    return db.query(models.Task).filter(models.Task.id == task_id).first()


def update_task(db: Session, task_id: int, task_in: schemas.TaskUpdate) -> Optional[models.Task]:
    """
    Update an existing task with partial data.
    
    PARTIAL UPDATE PATTERN:
    - Only update fields that are provided (not None)
    - Allows PATCH-style updates where client sends only changed fields
    - TaskUpdate schema has all fields as Optional for this reason
    
    PROCESS:
    1. Fetch existing task
    2. Update only provided fields
    3. Add to session (marks as dirty)
    4. Commit (triggers SQL UPDATE)
    5. Refresh to get updated timestamp
    
    Returns None if task doesn't exist (endpoint handles 404).
    """
    task = get_task(db, task_id)
    if not task:
        return None

    if task_in.title is not None:
        task.title = task_in.title
    if task_in.description is not None:
        task.description = task_in.description
    if task_in.done is not None:
        task.done = task_in.done

    db.add(task)
    db.commit()
    db.refresh(task)
    return task


def delete_task(db: Session, task_id: int) -> bool:
    """
    Delete a task by ID.
    
    PROCESS:
    1. Fetch existing task
    2. Call db.delete() to stage deletion
    3. Commit to execute SQL DELETE
    
    Returns:
    - True if task was deleted
    - False if task doesn't exist (endpoint handles 404)
    """
    task = get_task(db, task_id)
    if not task:
        return False
    db.delete(task)
    db.commit()
    return True
