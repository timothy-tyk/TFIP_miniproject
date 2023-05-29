import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getDownloadURL } from '@angular/fire/storage';
import { firstValueFrom, Subject } from 'rxjs';
import { Friends } from 'src/app/models/friends-model';
import { InviteEmail } from 'src/app/models/invite-email.model';
import { User } from 'src/app/models/user-model';

const SERVER_URL = '/api';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  friendsList!: Friends[];
  friendsSubject: Subject<Friends[]> = new Subject<Friends[]>();
  constructor(
    private httpClient: HttpClient,
    private storage: AngularFireStorage
  ) {}
  getUserDetails(email: string) {
    // Fetch user details
    const params = new HttpParams().set('email', email);
    return firstValueFrom(
      this.httpClient.get(`${SERVER_URL}/user`, { params }).pipe()
    );
  }
  addUserDetails(user: any) {
    // Add (POST) user details
    return firstValueFrom(
      this.httpClient.post(`${SERVER_URL}/user`, user).pipe()
    );
  }
  updateUserDetails(formData: FormData) {
    // Update User Details..
    return firstValueFrom(
      this.httpClient.put(`${SERVER_URL}/user`, formData).pipe()
    );
  }

  private STORAGE_FOLDER = '/profilepics';
  uploadUpdatedImage(imgFile: File, email: string): Promise<string> {
    const fileName = email.replace('@', '').replace('.', '');
    const filePath = `${this.STORAGE_FOLDER}/${fileName}`;
    const storageRef = this.storage.ref(filePath);
    return this.storage.upload(filePath, imgFile).then((snapshot) => {
      return getDownloadURL(snapshot.ref);
    });
  }

  getFriendsList(user: User) {
    const params = new HttpParams().set('email', user.email);
    return firstValueFrom(
      this.httpClient.get(`${SERVER_URL}/user/friends`, { params }).pipe()
    );
  }

  addFriend(friends: Friends) {
    return firstValueFrom(
      this.httpClient.post(`${SERVER_URL}/user/friends`, friends)
    )
      .then((res) => (this.friendsList = res as Friends[]))
      .then(() => this.friendsSubject.next(this.friendsList));
  }

  saveTrack(trackId: string, email: string) {
    return firstValueFrom(
      this.httpClient.post(
        `${SERVER_URL}/user/tracks?trackId=${trackId}&email=${email}`,
        {}
      )
    );
  }

  // Invite User Service
  sendInviteEmail(email: InviteEmail) {
    return firstValueFrom(
      this.httpClient.post(`${SERVER_URL}/user/invite`, email, {}).pipe()
    );
  }
}
