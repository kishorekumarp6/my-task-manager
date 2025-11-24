/**
 * ROUTING MODULE (Phase 2.1 - Critical Frontend Concept)
 * 
 * This module defines the navigation structure of the Angular application.
 * 
 * KEY ROUTING CONCEPTS:
 * 1. Routes Array: Maps URL paths to specific components
 * 2. Path Parameters: Dynamic segments in URLs (e.g., :id for task details)
 * 3. Lazy Loading Ready: Can be enhanced to load modules on-demand
 * 4. RouterModule: Provides routing directives (routerLink, router-outlet)
 * 
 * EDUCATIONAL NOTES:
 * - Empty path ('') redirects to /tasks (default route)
 * - /tasks displays the task list (TasksComponent)
 * - /tasks/:id displays task detail (TaskDetailComponent) with route parameter
 * - /login provides authentication UI (LoginComponent)
 * - pathMatch: 'full' ensures exact URL matching for redirects
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TasksComponent } from './tasks/tasks.component';
import { TaskDetailComponent } from './task-detail/task-detail.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';

/**
 * APPLICATION ROUTES
 * 
 * Route Definition Structure:
 * - path: URL segment (without leading slash)
 * - component: Component to render when route matches
 * - pathMatch: Matching strategy ('full' = exact match, 'prefix' = starts with)
 * - canActivate: Array of guards that must pass for route access
 * 
 * AUTHENTICATION FLOW:
 * 1. User visits app -> redirected to /login
 * 2. User logs in -> JWT token stored -> navigate to /tasks
 * 3. Protected routes check AuthGuard -> allow if token exists
 * 4. No token -> redirect back to /login
 */
export const routes: Routes = [
  // Default route: Redirect root URL to /login (authentication required)
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  
  // Login route: Public access (no guard)
  { path: 'login', component: LoginComponent },
  
  // Task list route: Protected by AuthGuard
  { 
    path: 'tasks', 
    component: TasksComponent,
    canActivate: [AuthGuard]
  },
  
  // Task detail route: Protected by AuthGuard
  { 
    path: 'tasks/:id', 
    component: TaskDetailComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
