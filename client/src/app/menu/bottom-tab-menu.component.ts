import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  activeItem!: MenuItem;
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
        styleClass: 'col-4',
        command: () => {
          this.onLobbyClick();
        },
      },
      {
        label: 'Rooms',
        styleClass: 'col-4',
        command: () => {
          this.onRoomsClick();
        },
      },
      {
        label: 'Home',
        styleClass: 'col-4',
        command: () => {
          this.onHomeClick();
        },
      },
    ];
    this.activatedLocation();
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

  activatedLocation() {
    const currentLocation = location.pathname.replace('/', '');
    console.log(currentLocation);
    for (let item of this.items) {
      if (currentLocation.includes(item.label?.toLowerCase()!)) {
        this.activeItem = item;
      }
    }
  }

  onUserLoginLogout(loginLogout: string) {
    this.webSocketSvc.onUserLoginLogout(this.userInfo, loginLogout);
  }
}
