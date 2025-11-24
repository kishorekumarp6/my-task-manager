/**
 * CONFIRMATION MODAL COMPONENT
 * 
 * Reusable modal dialog for user confirmations.
 * Replaces browser's native confirm() with styled modal matching app theme.
 * 
 * USAGE:
 * <app-confirmation-modal
 *   [(show)]="showModal"
 *   message="Are you sure you want to delete this task?"
 *   confirmText="Delete"
 *   cancelText="Cancel"
 *   (onConfirm)="handleConfirm()"
 *   (onCancel)="handleCancel()">
 * </app-confirmation-modal>
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" *ngIf="show" (click)="onCancelClick()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>{{ title }}</h3>
        </div>
        <div class="modal-body">
          <p>{{ message }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="onCancelClick()" type="button">
            {{ cancelText }}
          </button>
          <button class="btn btn-danger" (click)="onConfirmClick()" type="button" [autofocus]="true">
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.2s ease-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      max-width: 450px;
      width: 90%;
      animation: slideUp 0.2s ease-out;
    }

    @keyframes slideUp {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .modal-header {
      padding: 1.5rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .modal-header h3 {
      margin: 0;
      color: #1f2937;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .modal-body {
      padding: 1.5rem;
    }

    .modal-body p {
      margin: 0;
      color: #4b5563;
      line-height: 1.6;
    }

    .modal-footer {
      padding: 1rem 1.5rem;
      border-top: 1px solid #e5e7eb;
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
    }

    .btn {
      padding: 0.625rem 1.25rem;
      border-radius: 8px;
      border: none;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-secondary {
      background: #f3f4f6;
      color: #374151;
    }

    .btn-secondary:hover {
      background: #e5e7eb;
    }

    .btn-danger {
      background: #dc2626;
      color: white;
    }

    .btn-danger:hover {
      background: #b91c1c;
    }

    .btn:focus {
      outline: 2px solid #3b82f6;
      outline-offset: 2px;
    }
  `]
})
export class ConfirmationModalComponent {
  @Input() show = false;
  @Input() title = 'Confirm Action';
  @Input() message = 'Are you sure you want to proceed?';
  @Input() confirmText = 'OK';
  @Input() cancelText = 'Cancel';
  
  @Output() showChange = new EventEmitter<boolean>();
  @Output() onConfirm = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  onConfirmClick(): void {
    this.show = false;
    this.showChange.emit(this.show);
    this.onConfirm.emit();
  }

  onCancelClick(): void {
    this.show = false;
    this.showChange.emit(this.show);
    this.onCancel.emit();
  }
}
