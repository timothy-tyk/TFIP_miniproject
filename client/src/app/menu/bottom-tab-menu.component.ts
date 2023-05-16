import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { MenuItem } from 'primeng/api';
import { TabMenuModule } from 'primeng/tabmenu';
import { User } from '../models/user-model';
import { UserService } from '../services/user/user.service';
import { WebsocketService } from '../services/websocket/websocket.service';

@Component({
  selector: 'app-bottom-tab-menu',
  templateUrl: './bottom-tab-menu.component.html',
  styleUrls: ['./bottom-tab-menu.component.css'],
})
export class BottomTabMenuComponent implements OnInit {
  items!: MenuItem[];
  userInfo!: User;
  constructor(
    private router: Router,
    private webSocketSvc: WebsocketService,
    private auth: AuthService,
    private userSvc: UserService
  ) {}
  ngOnInit() {
    this.webSocketSvc.initializeConnection();
    this.items = [
      {
        label: 'Lobby',
        icon: 'pi pi-fw pi-calendar',
        command: () => this.onLobbyClick(),
      },
      {
        label: 'Rooms',
        icon: 'pi pi-fw pi-pencil',
        command: () => this.onRoomsClick(),
      },
      {
        label: 'Home',
        icon: 'pi pi-fw pi-home',
        command: () => this.onHomeClick(),
      },
    ];

    this.getUserInfoAndLogin();
  }

  onHomeClick() {
    this.router.navigate([`/home`]).then(() => {
      window.location.reload();
    });
  }
  onLobbyClick() {
    this.router.navigate([`/lobby`]).then(() => {
      window.location.reload();
    });
  }
  onRoomsClick() {
    this.router.navigate([`/rooms`]).then(() => {
      window.location.reload();
    });
  }

  getUserInfoAndLogin() {
    this.auth.user$.subscribe(
      // get user data from db
      (user) => {
        console.log(user);
        this.userSvc.getUserDetails(user?.email!).then((res) => {
          this.userInfo = res as User;
          this.onUserLoginLogout('login');
        });
      }
    );
  }

  // @HostListener('window:unload', ['$event'])
  // windowUnloadListener() {
  //   this.webSocketSvc.onUserLoginLogout(this.userInfo, 'logout');
  // }
  // @HostListener('window:beforeunload', ['$event'])
  // beforeUnloadHandler(event) {
  //   // ...
  // }

  onUserLoginLogout(loginLogout: string) {
    this.webSocketSvc.onUserLoginLogout(this.userInfo, loginLogout);
  }
}
