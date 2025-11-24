/**
 * AUTH GUARD
 * 
 * Route guard that protects routes requiring authentication.
 * Implements CanActivate interface to control route access.
 * 
 * FUNCTIONALITY:
 * - Checks if user is authenticated (has valid JWT token)
 * - Allows access if authenticated
 * - Redirects to /login if not authenticated
 * 
 * USAGE IN ROUTES:
 * {
 *   path: 'tasks',
 *   component: TasksComponent,
 *   canActivate: [AuthGuard]  // Protects this route
 * }
 */

import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * DETERMINE IF ROUTE CAN BE ACTIVATED
   * Called by Angular router before navigating to protected route
   * 
   * @returns true if user can access route, UrlTree to redirect if not
   */
  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.isAuthenticated()) {
      // User is authenticated, allow access
      return true;
    } else {
      // User is not authenticated, redirect to login
      console.log('[Auth Guard] User not authenticated, redirecting to /login');
      return this.router.createUrlTree(['/login']);
    }
  }
}
