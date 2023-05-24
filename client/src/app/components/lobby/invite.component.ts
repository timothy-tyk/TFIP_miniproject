import { Component, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { InviteEmail } from 'src/app/models/invite-email.model';
import { User } from 'src/app/models/user-model';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.css'],
})
export class InviteComponent implements OnInit {
  @Input() userInfo!: User;
  @Input() dialogVisible!: boolean;
  @Output() onDialogClose: Subject<string> = new Subject<string>();
  inviteForm!: FormGroup;
  constructor(private fb: FormBuilder, private userSvc: UserService) {}
  ngOnInit(): void {
    this.createInviteForm();
  }

  createInviteForm() {
    this.inviteForm = this.fb.group({
      name: this.fb.control('', [Validators.required, Validators.minLength(3)]),
      email: this.fb.control('', [Validators.required, Validators.email]),
      message: this.fb.control(''),
    });
  }
  submitInviteForm() {
    const details: InviteEmail = {
      senderName: this.userInfo.name,
      name: this.inviteForm.get('name')?.value,
      recipientEmail: this.inviteForm.get('email')?.value,
      message: this.inviteForm.get('message')?.value,
    };
    console.log(details);
    this.userSvc.sendInviteEmail(details).then((res) => console.log(res));
    this.cancel();
  }

  cancel() {
    this.createInviteForm();
    this.onDialogClose.next('');
  }
}
