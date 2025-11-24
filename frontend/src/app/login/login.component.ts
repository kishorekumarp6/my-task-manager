/**
 * LOGIN COMPONENT (Phase 2.2 - Functional JWT Authentication)
 * 
 * Implements user authentication with JWT tokens.
 * 
 * FEATURES:
 * - Reactive form with validation
 * - JWT token authentication
 * - Error handling with user-friendly messages
 * - Token storage in localStorage
 * - Redirect to tasks after successful login
 * 
 * TEST CREDENTIALS:
 * - Email: demo@example.com / Password: password123
 * - Email: admin@example.com / Password: admin123
 */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  isCredentialsExpanded = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  /**
   * TOGGLE CREDENTIALS
   * Toggles the test credentials section visibility
   */
  toggleCredentials(): void {
    this.isCredentialsExpanded = !this.isCredentialsExpanded;
  }

  /**
   * SUBMIT LOGIN FORM
   * Authenticates user with backend and redirects to tasks on success
   */
  onLogin(): void {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please fill in all fields correctly.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (response) => {
        console.log('Login successful:', response.user);
        this.router.navigate(['/tasks']);
      },
      error: (error) => {
        console.error('Login error:', error);
        
        if (error.status === 401) {
          this.errorMessage = 'Incorrect email or password. Please try again.';
        } else if (error.status === 0) {
          this.errorMessage = 'Cannot connect to server. Please check if the backend is running.';
        } else {
          this.errorMessage = 'An error occurred during login. Please try again.';
        }
        
        this.isLoading = false;
      }
    });
  }

  /**
   * SKIP LOGIN
   * Allows users to access tasks without authentication
   */
  skipLogin(): void {
    this.router.navigate(['/tasks']);
  }

  /**
   * DISMISS ERROR
   * Clears error message
   */
  dismissError(): void {
    this.errorMessage = '';
  }
}
