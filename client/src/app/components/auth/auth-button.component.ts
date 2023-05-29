import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import anime from 'animejs/lib/anime.es';

@Component({
  selector: 'app-auth-button',
  templateUrl: './auth-button.component.html',
  styleUrls: ['./auth-button.component.css'],
})
export class AuthButtonComponent implements OnInit {
  isAuth: boolean = false;
  spinEffect!: any;
  constructor(private auth: AuthService, private router: Router) {}
  ngOnInit(): void {
    this.auth.isAuthenticated$.subscribe((p) => {
      if (p) {
        this.router.navigate(['/login']);
      }
    });
    this.spinImage();
  }

  loginWithRedirect() {
    return this.auth.loginWithRedirect();
  }
  logout() {
    return this.auth.logout();
  }

  spinImage() {
    this.spinEffect = anime({
      targets: '.spinning-album',
      rotate: {
        value: '+=1turn',
        duration: 5000,
        easing: 'linear',
      },
      loop: true,
      autoplay: true,
    });
  }
}
