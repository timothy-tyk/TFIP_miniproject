import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Friends } from 'src/app/models/friends-model';
import { User } from 'src/app/models/user-model';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css'],
})
export class FriendsComponent implements OnInit {
  @Input() userInfo!: User;
  friendsList!: Friends[];
  friends$: Subscription = new Subscription();
  // Dialog
  dialogVisible: boolean = false;
  dialogInfo!: User;
  constructor(private userSvc: UserService) {}
  ngOnInit(): void {
    this.userSvc
      .getFriendsList(this.userInfo)
      .then((res) => (this.friendsList = res as Friends[]));
    this.friends$ = this.userSvc.friendsSubject.subscribe((result) => {
      console.log('friends');
      this.friendsList = result as Friends[];
    });
  }
  showDialog(email: string) {
    console.log('clicked');
    this.userSvc
      .getUserDetails(email)
      .then((res) => (this.dialogInfo = res as User))
      .then(() => (this.dialogVisible = true));
  }
}
