import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { Subject } from 'rxjs';
import { User } from 'src/app/models/user-model';
import { SpotifyService } from 'src/app/services/spotify/spotify.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-home-main',
  templateUrl: './home-main.component.html',
  styleUrls: ['./home-main.component.css'],
})
export class HomeMainComponent implements OnInit {
  userInfo!: User;
  constructor(
    private auth: AuthService,
    private userSvc: UserService,
    private router: Router,
    private spotifySvc: SpotifyService
  ) {}
  ngOnInit(): void {
    this.getUserDetails();
    // this.getSpotifyLogin();
  }

  getUserDetails() {
    this.auth.appState$.subscribe((q) => console.log(q));
    this.auth.user$.subscribe(
      // get user data from db
      (user) => {
        console.log(user);
        this.userSvc.getUserDetails(user?.email!).then((res) => {
          this.userInfo = res as User;
          localStorage.setItem('userInfo', JSON.stringify(this.userInfo));
          // if userDetails ==null, post user object from auth to backend
          if (res == null) this.userSvc.addUserDetails(user!);
          localStorage.setItem('userInfo', JSON.stringify(this.userInfo));
        });
      }
    );
  }

  editProfile() {
    this.router.navigate(['/user/edit']);
  }
}
