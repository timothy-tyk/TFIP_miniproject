import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { User } from 'src/app/models/user-model';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
})
export class UserEditComponent implements OnInit {
  userInfo!: User;
  userForm!: FormGroup;
  email!: string;

  @ViewChild('file')
  imageFile!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private userSvc: UserService,
    private auth: AuthService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.auth.user$.subscribe((e) => {
      this.email = e?.email!;
      this.getUserDetails(this.email);
    });
  }

  getUserDetails(email: string) {
    this.userSvc
      .getUserDetails(this.email)
      .then((res) => {
        this.userInfo = res as User;
      })
      .then(() => {
        console.log(this.userInfo);
        this.initialiseEditForm();
      });
  }
  initialiseEditForm() {
    this.userForm = this.fb.group({
      name: this.fb.control(`${this.userInfo.name}`, [Validators.minLength(3)]),
      picture: this.fb.control(''),
      bio: this.fb.control(`${this.userInfo.bio}`),
    });
  }
  async updateProfile() {
    const formData = new FormData();
    formData.set('email', this.userInfo.email);
    formData.set('name', this.userForm.get('name')?.value);
    formData.set('bio', this.userForm.get('bio')?.value);

    if (this.userForm.get('picture')?.value != '') {
      console.log(this.imageFile.nativeElement.files[0]);
      const url = await this.userSvc.uploadUpdatedImage(
        this.imageFile.nativeElement.files[0],
        this.userInfo.email
      );
      console.log(url);
      formData.set('picture', url);
      this.userSvc.updateUserDetails(formData).then(() => {
        this.router.navigate(['/']);
      });
    } else {
      formData.set('picture', this.userInfo.picture);
      this.userSvc.updateUserDetails(formData).then(() => {
        this.router.navigate(['/']);
      });
    }
  }
  backToLobby() {
    this.router.navigate(['/lobby']);
  }
}
