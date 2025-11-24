/**
 * TASK SERVICE (Phase 2 - Enhanced with Single Task Retrieval)
 * 
 * This service provides HTTP methods for task CRUD operations.
 * 
 * PHASE 2 ADDITIONS:
 * - getTask(id): Fetch single task for detail view (Phase 2.2)
 * 
 * SERVICE PATTERN:
 * - Injectable with 'root' scope (singleton across app)
 * - Returns Observables for async HTTP operations
 * - Base URL configured for FastAPI backend
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Task {
  id: number;
  title: string;
  description?: string;
  done: boolean;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  apiUrl = 'http://localhost:8000/tasks/';

  constructor(private http: HttpClient) {}

  /**
   * GET ALL TASKS
   * Returns: Observable<Task[]>
   */
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  /**
   * GET SINGLE TASK (Phase 2.2 - New Method)
   * Returns: Observable<Task>
   * Used by TaskDetailComponent to load task for editing
   */
  getTask(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}${id}`);
  }

  /**
   * CREATE TASK
   * Returns: Observable<Task>
   */
  addTask(task: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  /**
   * UPDATE TASK
   * Returns: Observable<Task>
   */
  updateTask(task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}${task.id}`, task);
  }

  /**
   * DELETE TASK
   * Returns: Observable<any>
   */
  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}`);
  }
}
