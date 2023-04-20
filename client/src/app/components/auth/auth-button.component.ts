import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-auth-button',
  templateUrl: './auth-button.component.html',
  styleUrls: ['./auth-button.component.css'],
})
export class AuthButtonComponent implements OnInit {
  constructor(private auth: AuthService, private router: Router) {}
  isAuth: boolean = false;
  ngOnInit(): void {
    this.auth.isAuthenticated$.subscribe((p) => {
      if (p) {
        this.router.navigate(['/login']);
      }
    });
  }

  loginWithRedirect() {
    return this.auth.loginWithRedirect();
  }
  logout() {
    return this.auth.logout();
  }
}
