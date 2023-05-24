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
import { User } from 'src/app/models/user-model';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-user-dialog-info',
  templateUrl: './user-dialog-info.component.html',
  styleUrls: ['./user-dialog-info.component.css'],
})
export class UserDialogInfoComponent implements OnInit, OnChanges {
  @Input() email!: string;
  dialogVisible: boolean = false;
  dialogInfo!: User;
  @Output() closeDialog: Subject<string> = new Subject<string>();
  currentLocation!: string;

  constructor(private userSvc: UserService, private router: Router) {}
  ngOnInit() {
    this.currentLocation = location.pathname.replace('/rooms/', '');
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.showDialog();
  }

  showDialog() {
    if (this.email != null) {
      this.userSvc
        .getUserDetails(this.email)
        .then((res) => (this.dialogInfo = res as User));
      this.dialogVisible = true;
    }
  }
  cancel() {
    this.closeDialog.next('');
  }
  followToRoom(location: string) {
    this.router.navigate([`/rooms/${location}`]);
  }
}
