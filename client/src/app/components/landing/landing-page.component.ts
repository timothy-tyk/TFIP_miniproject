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
  ngOnInit(): void {
    this.getSpotifyLogin();
  }
  // getUserDetails() {
  //   this.auth.appState$.subscribe((q) => console.log(q));
  //   this.auth.user$.subscribe(
  //     // get user data from db
  //     (user) => {
  //       console.log(user);
  //       this.userSvc.getUserDetails(user?.email!).then((res) => {
  //         this.userInfo = res as User;
  //         localStorage.setItem('userInfo', JSON.stringify(this.userInfo));
  //         // if userDetails ==null, post user object from auth to backend
  //         if (res == null) this.userSvc.addUserDetails(user!);
  //         localStorage.setItem('userInfo', JSON.stringify(this.userInfo));
  //       });
  //     }
  //   );
  // }

  getSpotifyLogin() {
    this.spotifyAuth
      .getSpotifyUserLogin()
      .then((res: any) => window.location.replace(res.link))
      .catch((err) => console.log(err));
  }
}
