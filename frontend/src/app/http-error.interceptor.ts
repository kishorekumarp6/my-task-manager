/**
 * HTTP INTERCEPTOR (Phase 2.4 - Critical Frontend Concept)
 * 
 * This interceptor demonstrates:
 * 1. Global Error Handling: Catch HTTP errors in one place
 * 2. Request Transformation: Add headers, tokens, or modify requests
 * 3. Response Processing: Log, transform, or cache responses
 * 4. Observable Operators: catchError, tap for side effects
 * 
 * INTERCEPTOR LIFECYCLE:
 * 1. Intercept: Called before every HTTP request
 * 2. Request Modification: Clone and modify request (immutable)
 * 3. Handle: Pass to next handler in chain
 * 4. Response Processing: Transform or log response
 * 5. Error Handling: Catch and handle errors globally
 * 
 * EDUCATIONAL NOTES:
 * - Interceptors run for ALL HttpClient requests
 * - Requests are immutable (must clone to modify)
 * - Multiple interceptors execute in order of registration
 * - catchError prevents errors from breaking the app
 * 
 * PRODUCTION ENHANCEMENTS:
 * - Add JWT token from localStorage/sessionStorage
 * - Refresh expired tokens automatically
 * - Show loading spinner for all requests
 * - Cache responses for performance
 * - Retry failed requests with exponential backoff
 */

import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  /**
   * INTERCEPT METHOD
   * Called for every HttpClient request in the app
   * 
   * @param req - The outgoing HTTP request
   * @param next - The next handler in the interceptor chain
   * @returns Observable of the HTTP event stream
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log(`[HTTP Interceptor] ${req.method} ${req.url}`);

    /**
     * REQUEST TRANSFORMATION
     * Add JWT token to Authorization header if user is authenticated
     */
    const token = this.authService.getToken();
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('[HTTP Interceptor] Added Authorization header');
    }

    // Pass request to next handler and process response
    return next.handle(req).pipe(
      // Log successful responses (optional)
      tap(event => {
        // Uncomment to log all events:
        // console.log(`[HTTP Interceptor] Response:`, event);
      }),

      /**
       * GLOBAL ERROR HANDLING
       * Catches all HTTP errors and provides consistent error messages
       */
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unknown error occurred';

        if (error.error instanceof ErrorEvent) {
          // CLIENT-SIDE ERROR (network, CORS, etc.)
          console.error('[HTTP Interceptor] Client Error:', error.error.message);
          errorMessage = `Network error: ${error.error.message}`;
        } else {
          // SERVER-SIDE ERROR (4xx, 5xx status codes)
          console.error(
            `[HTTP Interceptor] Server Error:`,
            `Status ${error.status}: ${error.statusText}`,
            error.error
          );

          // Provide user-friendly error messages based on status code
          switch (error.status) {
            case 400:
              errorMessage = 'Bad request. Please check your input.';
              break;
            case 401:
              errorMessage = 'Unauthorized. Please log in.';
              // In production: Redirect to login page
              // this.router.navigate(['/login']);
              break;
            case 403:
              errorMessage = 'Access forbidden.';
              break;
            case 404:
              errorMessage = 'Resource not found.';
              break;
            case 500:
              errorMessage = 'Server error. Please try again later.';
              break;
            case 503:
              errorMessage = 'Service unavailable. Please try again later.';
              break;
            default:
              errorMessage = `Error ${error.status}: ${error.statusText}`;
          }
        }

        // Show error to user (production: use a toast service)
        this.showErrorNotification(errorMessage);

        // Re-throw error so components can handle it if needed
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  /**
   * SHOW ERROR NOTIFICATION
   * Displays error message to user (simple implementation for workshop)
   * 
   * PRODUCTION: Replace with a proper notification service
   */
  private showErrorNotification(message: string): void {
    // Simple console error for workshop
    console.error('[User Notification]', message);

    // Optional: Create a toast notification
    // (Components already have showToaster method, this is global fallback)
  }
}
