import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive]
})
export class AppComponent {
  title = 'My Task Manager';

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  /**
   * CHECK IF ON LOGIN PAGE
   * Returns true if current route is login page
   */
  isLoginPage(): boolean {
    return this.router.url === '/login' || this.router.url === '/';
  }

  /**
   * LOGOUT
   * Clears authentication and redirects to login
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  /**
   * GET CURRENT USER
   * Returns user info for display
   */
  get currentUser() {
    return this.authService.getCurrentUser();
  }
}
