import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Friends } from 'src/app/models/friends-model';
import { User } from 'src/app/models/user-model';
import { SpotifyAuthService } from 'src/app/services/auth/spotify-auth.service';
import { UserService } from 'src/app/services/user/user.service';
import { updateUserInfo } from 'src/app/user-state-store/user.actions';

@Component({
  selector: 'app-lobby-main',
  templateUrl: './lobby-main.component.html',
  styleUrls: ['./lobby-main.component.css'],
})
export class LobbyMainComponent implements OnInit {
  userInfo!: User;
  urlSub$!: Subscription;

  constructor(
    private auth: AuthService,
    private userSvc: UserService
  ) // private store: Store
  {}
  ngOnInit(): void {
    this.getUserDetails();
  }

  getUserDetails() {
    this.auth.appState$.subscribe((q) => console.log(q));
    this.auth.user$.subscribe(
      // get user data from db
      (user) => {
        console.log(user);
        this.userSvc.getUserDetails(user?.email!).then((res) => {
          this.userInfo = res as User;
          // Add User Details to NgRx Store
          // this.store.dispatch(updateUserInfo(this.userInfo));
          localStorage.setItem('userInfo', JSON.stringify(this.userInfo));
          // if userDetails ==null, post user object from auth to backend
          if (res == null) this.userSvc.addUserDetails(user!);
          localStorage.setItem('userInfo', JSON.stringify(this.userInfo));
        });
      }
    );
  }
}
