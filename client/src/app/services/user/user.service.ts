import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getDownloadURL } from '@angular/fire/storage';
import { firstValueFrom } from 'rxjs';
import { User } from 'src/app/models/user-model';

const SERVER_URL = '/api';

@Injectable({
  providedIn: 'root',
})
export class UserService {
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
}
