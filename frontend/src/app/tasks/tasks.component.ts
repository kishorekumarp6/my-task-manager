/**
 * TASKS COMPONENT (Phase 2.5 - Enhanced with Loading & Error States)
 * 
 * This component demonstrates:
 * 1. Template-driven forms (original implementation, will keep for backward compatibility)
 * 2. Observable subscriptions for async operations
 * 3. Loading states to prevent duplicate submissions (Phase 2.5)
 * 4. Error state management for better UX (Phase 2.5)
 * 5. Custom toaster notifications
 * 
 * PHASE 2.5 ENHANCEMENTS:
 * - Added isLoading flag to show spinners during API calls
 * - Added errorMessage to display error states
 * - Prevent form submission during loading
 * - Better error handling with user-friendly messages
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Task, TaskService } from '../task.service';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';

@Component({ 
  selector: 'app-tasks', 
  templateUrl: './tasks.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ConfirmationModalComponent]
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  newTask: Partial<Task> = {};
  
  // PHASE 2.5: Loading and error state management
  isLoading = false;
  errorMessage = '';

  // Confirmation modal state
  showDeleteModal = false;
  taskToDelete: number | null = null;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  /**
   * LOAD TASKS
   * Phase 2.5: Added loading state
   */
  loadTasks(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load tasks. Please check if the backend is running.';
        this.showToaster('error', this.errorMessage);
        console.error('Error loading tasks:', error);
        this.isLoading = false;
      }
    });
  }

  /**
   * ADD TASK
   * Phase 2.5: Added loading state to prevent duplicate submissions
   */
  addTask(): void {
    if (!this.newTask.title?.trim()) {
      this.showToaster('warning', 'Please enter a task title.');
      return;
    }

    if (this.isLoading) {
      return; // Prevent duplicate submissions
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.taskService.addTask(this.newTask).subscribe({
      next: (_) => {
        this.showToaster('success', 'Task added successfully!');
        this.newTask = {};
        this.loadTasks();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to add task. Please try again.';
        this.showToaster('error', this.errorMessage);
        console.error('Error adding task:', error);
        this.isLoading = false;
      }
    });
  }

  /**
   * UPDATE TASK
   * Phase 2.5: Better error handling
   */
  updateTask(task: Task): void {
    this.errorMessage = '';
    
    this.taskService.updateTask(task).subscribe({
      next: (_) => {
        const status = task.done ? 'completed' : 'reopened';
        this.showToaster('success', `Task marked as ${status}.`);
        this.loadTasks();
      },
      error: (error) => {
        this.errorMessage = 'Failed to update task. Please try again.';
        this.showToaster('error', this.errorMessage);
        console.error('Error updating task:', error);
        // Revert the checkbox state
        task.done = !task.done;
      }
    });
  }

  /**
   * DELETE TASK
   * Phase 2.5: Better error handling + styled confirmation modal
   */
  deleteTask(id: number): void {
    this.taskToDelete = id;
    this.showDeleteModal = true;
  }

  /**
   * CONFIRM DELETE
   * Called when user confirms deletion in modal
   */
  confirmDelete(): void {
    if (this.taskToDelete === null) return;

    this.errorMessage = '';
    
    this.taskService.deleteTask(this.taskToDelete).subscribe({
      next: (_) => {
        this.showToaster('success', 'Task deleted successfully.');
        this.loadTasks();
      },
      error: (error) => {
        this.errorMessage = 'Failed to delete task. Please try again.';
        this.showToaster('error', this.errorMessage);
        console.error('Error deleting task:', error);
      }
    });

    this.taskToDelete = null;
  }

  /**
   * CANCEL DELETE
   * Called when user cancels deletion
   */
  cancelDelete(): void {
    this.taskToDelete = null;
  }

  private showToaster(type: 'success' | 'error' | 'warning' | 'info', message: string): void {
    const container = this.getOrCreateToasterContainer();
    const toaster = document.createElement('div');
    toaster.className = `toaster ${type}`;
    
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };
    
    toaster.innerHTML = `
      <span class="toaster-icon">${icons[type]}</span>
      <span class="toaster-message">${message}</span>
      <button class="toaster-close" aria-label="Close">×</button>
    `;
    
    container.appendChild(toaster);
    
    const closeBtn = toaster.querySelector('.toaster-close');
    closeBtn?.addEventListener('click', () => this.removeToaster(toaster));
    
    setTimeout(() => this.removeToaster(toaster), 5000);
  }

  private getOrCreateToasterContainer(): HTMLElement {
    let container = document.querySelector('.toaster-container') as HTMLElement;
    if (!container) {
      container = document.createElement('div');
      container.className = 'toaster-container';
      document.body.appendChild(container);
    }
    return container;
  }

  private removeToaster(toaster: HTMLElement): void {
    toaster.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => toaster.remove(), 300);
  }
}
