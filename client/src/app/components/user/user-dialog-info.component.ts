import {
  Component,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Friends } from 'src/app/models/friends-model';
import { User } from 'src/app/models/user-model';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-user-dialog-info',
  templateUrl: './user-dialog-info.component.html',
  styleUrls: ['./user-dialog-info.component.css'],
})
export class UserDialogInfoComponent implements OnInit, OnChanges {
  userInfo!: User;
  friendsList!: Friends[];
  selectedUserIsFriend: boolean = false;

  @Input() email!: string;
  dialogVisible: boolean = false;
  dialogInfo!: User;
  @Output() closeDialog: Subject<string> = new Subject<string>();
  currentLocation!: string;

  constructor(private userSvc: UserService, private router: Router) {}
  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo')!) as User;
    this.getFriendsListInfo();
    this.currentLocation = location.pathname.replace('/rooms/', '');
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.showDialog();
  }

  getFriendsListInfo() {
    this.userSvc
      .getFriendsList(this.userInfo)
      .then((res) => (this.friendsList = res as Friends[]));
  }

  showDialog() {
    if (this.email != null) {
      this.userSvc
        .getUserDetails(this.email)
        .then((res) => (this.dialogInfo = res as User));
      this.friendsList.forEach((pair) => {
        if (pair.userEmail == this.email || pair.friendEmail == this.email) {
          this.selectedUserIsFriend = true;
          return;
        }
      });
      this.dialogVisible = true;
    }
  }
  cancel() {
    this.closeDialog.next('');
    this.selectedUserIsFriend = false;
  }
  followToRoom(location: string) {
    this.router
      .navigate([`/rooms/${location}`])
      .then(() => window.location.reload());
  }
  addFriend(email: string) {
    const friends: Friends = {
      id: null,
      userEmail: this.userInfo.email,
      friendEmail: email,
    };
    this.userSvc.addFriend(friends);
    this.getFriendsListInfo();
  }
}
