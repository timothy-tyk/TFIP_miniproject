import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { User } from '../../models/user-model';
import { UserService } from '../../services/user/user.service';
import { WebsocketService } from '../../services/websocket/websocket.service';

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
    // private auth: AuthService,
    private userSvc: UserService
  ) {}
  ngOnInit() {
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

  // getUserInfoAndLogin() {
  //   this.auth.user$.subscribe(
  //     // get user data from db
  //     (user) => {
  //       this.userSvc.getUserDetails(user?.email!).then((res) => {
  //         this.userInfo = res as User;
  //         this.onUserLoginLogout('login');
  //       });
  //     }
  //   );
  // }
  getUserInfoAndLogin() {
    this.webSocketSvc.initializeConnection();
    setTimeout(() => {
      this.userInfo = JSON.parse(localStorage.getItem('userInfo')!) as User;

      this.onUserLoginLogout('login');
    }, 1000);
  }

  activatedLocation() {
    const currentLocation = location.pathname.replace('/', '');
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
