import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { User } from 'src/app/models/user-model';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-lobby-main',
  templateUrl: './lobby-main.component.html',
  styleUrls: ['./lobby-main.component.css'],
})
export class LobbyMainComponent implements OnInit {
  userInfo!: User;
  constructor(private auth: AuthService, private userSvc: UserService) {}
  ngOnInit(): void {
    this.getUserDetails();
  }

  getUserDetails() {
    this.auth.appState$.subscribe((q) => console.log(q));
    this.auth.user$.subscribe(
      // get user data from db
      (user) =>
        this.userSvc.getUserDetails(user?.email!).then((res) => {
          this.userInfo = res as User;
          // if userDetails ==null, post user object from auth to backend
          if (res == null) this.userSvc.addUserDetails(user!);
        })
    );
  }
}
