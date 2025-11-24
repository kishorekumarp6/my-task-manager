import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Task {
  id: number;
  title: string;
  description?: string | null;
  done: boolean;
  created_at: string;
}

export interface TaskCreate {
  title: string;
  description?: string | null;
  done?: boolean;
}

export interface TaskUpdate {
  title?: string;
  description?: string | null;
  done?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private readonly baseUrl = 'http://localhost:8000/tasks';

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.baseUrl);
  }

  createTask(task: TaskCreate): Observable<Task> {
    return this.http.post<Task>(this.baseUrl, task);
  }

  updateTask(id: number, updates: TaskUpdate): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/${id}`, updates);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
