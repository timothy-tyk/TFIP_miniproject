import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user-model';
import { UserService } from 'src/app/services/user/user.service';

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
    private userSvc: UserService // private store: Store
  ) {}
  ngOnInit(): void {
    this.getUserDetails();
  }

  getUserDetails() {
    this.auth.appState$.subscribe((q) => console.log(q));
    this.auth.user$.subscribe(
      // get user data from db
      (user) => {
        console.log('auth0' + user);
        this.userSvc
          .getUserDetails(user?.email!)
          .then((res) => {
            console.log(res);
            this.userInfo = res as User;
            localStorage.setItem('userInfo', JSON.stringify(this.userInfo));
            // if userDetails ==null, post user object from auth to backend
            if (res == null) {
              console.log('adding user');
              this.userSvc.addUserDetails(user!);
            }
            localStorage.setItem('userInfo', JSON.stringify(this.userInfo));
          })
          .catch((e: any) => {
            if (e.status == 404) {
              console.log('adding user');
              this.userSvc.addUserDetails(user!);
            }
          });
      }
    );
  }
}
