/**
 * MAIN ENTRY POINT (Angular 20 Standalone)
 * 
 * Uses bootstrapApplication for standalone component architecture
 * Providers include:
 * - Routing with AuthGuard protection
 * - HTTP client with interceptor for token injection
 * - Forms modules for reactive and template-driven forms
 */

import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app/app.component';
import { routes } from './app/app-routing.module';
import { HttpErrorInterceptor } from './app/http-error.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule
    ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    }
  ]
}).catch(err => console.error(err));
