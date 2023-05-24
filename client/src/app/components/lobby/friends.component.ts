import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Friends } from 'src/app/models/friends-model';
import { User } from 'src/app/models/user-model';
import { UserService } from 'src/app/services/user/user.service';
import { WebsocketService } from 'src/app/services/websocket/websocket.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css'],
})
export class FriendsComponent implements OnInit {
  @Input() userInfo!: User;
  friendsList!: Friends[];
  friendsInfo: Map<string, User> = new Map<string, User>();
  friends$: Subscription = new Subscription();
  friendsUpdated$: Subscription = new Subscription();
  // Dialog
  selectedUserEmail!: string;
  inviteDialogVisible!: boolean;

  constructor(
    private userSvc: UserService,
    private webSocketSvc: WebsocketService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.webSocketSvc.initializeConnection();
    this.getFriendsListInfo();
    this.friends$ = this.userSvc.friendsSubject.subscribe((result) => {
      this.friendsList = result as Friends[];
    });

    this.friendsUpdated$ = this.webSocketSvc.updateUserOnlineLocation.subscribe(
      (e: any) => {
        if (this.friendsInfo.has(e)) {
          setTimeout(() => {
            this.getFriendsListInfo();
          }, 500);
        }
      }
    );
  }
  getFriendsListInfo() {
    this.userSvc
      .getFriendsList(this.userInfo)
      .then((res) => (this.friendsList = res as Friends[]))
      .then(() =>
        this.friendsList.forEach((pair) =>
          this.userSvc
            .getUserDetails(
              pair.userEmail == this.userInfo.email
                ? pair.friendEmail
                : pair.userEmail
            )
            .then((user: any) => {
              this.friendsInfo.set(user['email'], user);
            })
        )
      );
  }
  showUserDialog(email: string) {
    this.selectedUserEmail = email;
  }
  closeUserDialog() {
    this.selectedUserEmail = null!;
  }
  followToRoom(location: string) {
    this.router.navigate([`/rooms/${location}`]);
  }
  showInviteDialog() {
    this.inviteDialogVisible = true;
  }
  closeInviteDialog(e: any) {
    console.log(e);
    this.inviteDialogVisible = false;
  }
}
