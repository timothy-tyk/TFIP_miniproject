import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '@auth0/auth0-angular';
import { SpotifyAuthService } from 'src/app/services/auth/spotify-auth.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
})
export class LandingPageComponent implements OnInit {
  userInfo!: User;
  constructor(
    private auth: AuthService,
    private userSvc: UserService,
    private spotifyAuth: SpotifyAuthService
  ) {}
  ngOnInit() {
    this.spotifyAuth.redirectToSpotifyAuthorizeEndpoint();
  }
}
