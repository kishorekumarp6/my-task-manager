/**
 * APP MODULE (Phase 2 - Updated for Routing, Reactive Forms & Interceptor)
 * 
 * PHASE 2 CHANGES:
 * 1. Added AppRoutingModule for navigation (Phase 2.1)
 * 2. Added ReactiveFormsModule for reactive forms (Phase 2.3)
 * 3. Registered new components: TaskDetailComponent, LoginComponent (Phase 2.2)
 * 4. Added HTTP Interceptor for global error handling (Phase 2.4)
 * 5. Kept FormsModule for backward compatibility with existing template-driven forms
 * 
 * HTTP INTERCEPTOR REGISTRATION:
 * - Provide HttpErrorInterceptor using HTTP_INTERCEPTORS token
 * - multi: true allows multiple interceptors (can add more later)
 * - Interceptors execute in the order they are registered
 * 
 * MODULE ORGANIZATION:
 * - declarations: All components used in this module
 * - imports: External modules providing functionality
 * - providers: Services and interceptors
 * - bootstrap: Root component to start application
 */

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TasksComponent } from './tasks/tasks.component';
import { TaskDetailComponent } from './task-detail/task-detail.component';
import { LoginComponent } from './login/login.component';
import { HttpErrorInterceptor } from './http-error.interceptor';

@NgModule({
  declarations: [
    // No declarations needed - all components are standalone in Angular 20
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,           // Template-driven forms (existing functionality)
    ReactiveFormsModule,   // Reactive forms (Phase 2.3)
    AppRoutingModule       // Routing (Phase 2.1)
    // Note: Standalone components are NOT imported in the module
  ],
  providers: [
    // HTTP Interceptor for global error handling (Phase 2.4)
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: []  // Empty - using bootstrapApplication in main.ts for standalone
})
export class AppModule {}
