/**
 * AUTH SERVICE
 * 
 * Manages JWT authentication state and token storage.
 * Provides centralized authentication logic for the application.
 * 
 * RESPONSIBILITIES:
 * - Store/retrieve JWT tokens from localStorage
 * - Provide authentication status
 * - Handle login/logout operations
 * - Supply tokens to HTTP interceptor
 * 
 * USAGE:
 * constructor(private authService: AuthService) {}
 * 
 * // Login
 * this.authService.login(email, password).subscribe({
 *   next: (response) => console.log('Logged in!'),
 *   error: (err) => console.error('Login failed', err)
 * });
 * 
 * // Check if authenticated
 * if (this.authService.isAuthenticated()) {
 *   // User is logged in
 * }
 * 
 * // Logout
 * this.authService.logout();
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: {
    email: string;
    full_name: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';
  private readonly API_URL = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  /**
   * LOGIN
   * Authenticates user with backend and stores JWT token
   */
  login(username: string, password: string): Observable<LoginResponse> {
    // FastAPI OAuth2PasswordRequestForm expects form data, not JSON
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    return this.http.post<LoginResponse>(`${this.API_URL}/token`, formData).pipe(
      tap(response => {
        // Store token and user info in localStorage
        localStorage.setItem(this.TOKEN_KEY, response.access_token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
      })
    );
  }

  /**
   * LOGOUT
   * Clears stored token and user data
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  /**
   * GET TOKEN
   * Returns stored JWT token or null if not authenticated
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * IS AUTHENTICATED
   * Returns true if user has a valid token
   * Note: This only checks if token exists, not if it's expired
   */
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  /**
   * GET CURRENT USER
   * Returns stored user information or null
   */
  getCurrentUser(): { email: string; full_name: string } | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
}
