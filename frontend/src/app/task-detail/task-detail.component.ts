/**
 * TASK DETAIL COMPONENT (Phase 2.2 - Component with Route Parameters)
 * 
 * This component demonstrates:
 * 1. Route Parameter Extraction: Reading :id from URL
 * 2. Single Task Fetching: GET /tasks/{id} API call
 * 3. Reactive Forms: FormGroup/FormControl pattern (Phase 2.3)
 * 4. Loading States: Spinner during API calls (Phase 2.5)
 * 5. Error Handling: Display error messages (Phase 2.5)
 * 
 * EDUCATIONAL NOTES:
 * - ActivatedRoute provides access to route parameters
 * - Reactive forms use FormGroup for better validation and control
 * - Loading state prevents duplicate submissions
 * - Router navigates back to list after successful update
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Task, TaskService } from '../task.service';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class TaskDetailComponent implements OnInit {
  /**
   * REACTIVE FORM GROUP (Phase 2.3)
   * FormGroup provides:
   * - Centralized validation
   * - Value change tracking
   * - Easy reset/patch operations
   * - Type-safe value access
   */
  taskForm!: FormGroup;
  
  /**
   * LOADING AND ERROR STATES (Phase 2.5)
   * These properties enable UI feedback during async operations
   */
  isLoading = false;
  errorMessage = '';
  
  taskId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    // Initialize reactive form with validation rules
    this.initializeForm();
    
    // Extract task ID from route parameters (/tasks/:id)
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.taskId = parseInt(id, 10);
      this.loadTask(this.taskId);
    } else {
      this.errorMessage = 'No task ID provided';
    }
  }

  /**
   * INITIALIZE REACTIVE FORM (Phase 2.3)
   * FormBuilder simplifies FormGroup creation
   */
  private initializeForm(): void {
    this.taskForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      done: [false]
    });
  }

  /**
   * LOAD TASK DATA
   * Fetches single task from API and patches form values
   */
  loadTask(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.taskService.getTask(id).subscribe({
      next: (task: Task) => {
        // Patch form with task data (preserves unmodified controls)
        this.taskForm.patchValue({
          title: task.title,
          description: task.description || '',
          done: task.done
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading task:', error);
        this.errorMessage = 'Failed to load task. It may have been deleted.';
        this.isLoading = false;
      }
    });
  }

  /**
   * UPDATE TASK
   * Submits form data to backend API
   */
  onSubmit(): void {
    if (this.taskForm.invalid || !this.taskId) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const updatedTask: Task = {
      id: this.taskId,
      ...this.taskForm.value
    };

    this.taskService.updateTask(updatedTask).subscribe({
      next: () => {
        this.isLoading = false;
        // Navigate back to task list after successful update
        this.router.navigate(['/tasks']);
      },
      error: (error) => {
        console.error('Error updating task:', error);
        this.errorMessage = 'Failed to update task. Please try again.';
        this.isLoading = false;
      }
    });
  }

  /**
   * DELETE TASK
   * Removes task and navigates back to list
   */
  onDelete(): void {
    if (!this.taskId || !confirm('Are you sure you want to delete this task?')) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.taskService.deleteTask(this.taskId).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/tasks']);
      },
      error: (error) => {
        console.error('Error deleting task:', error);
        this.errorMessage = 'Failed to delete task. Please try again.';
        this.isLoading = false;
      }
    });
  }

  /**
   * CANCEL EDIT
   * Navigate back to task list without saving
   */
  onCancel(): void {
    this.router.navigate(['/tasks']);
  }
}
