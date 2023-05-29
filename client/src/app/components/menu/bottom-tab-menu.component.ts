import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { User } from '../../models/user-model';
import { WebsocketService } from '../../services/websocket/websocket.service';
import { ChangeDetectionStrategy } from '@angular/core';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-bottom-tab-menu',
  templateUrl: './bottom-tab-menu.component.html',
  styleUrls: ['./bottom-tab-menu.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomTabMenuComponent implements OnInit, OnDestroy {
  items!: MenuItem[];
  userInfo!: User;
  activeItem!: MenuItem;
  route$!: Subscription;

  constructor(private router: Router, private webSocketSvc: WebsocketService) {}
  ngOnInit() {
    this.route$ = this.router.events
      .pipe(filter((e: any) => e instanceof NavigationEnd))
      .subscribe((e) => {
        this.activatedLocation(e.url);
      });
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
    this.getUserInfoAndLogin();
  }

  onHomeClick() {
    this.router.navigate([`/home`]).then(() => {
      window.location.reload();
    });
  }
  onLobbyClick() {
    this.router.navigate([`/lobby`]).then(() => {});
  }
  onRoomsClick() {
    this.router.navigate([`/rooms`]).then(() => {});
  }

  getUserInfoAndLogin() {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo')!) as User;
    this.webSocketSvc.initializeConnection().subscribe((connected) => {
      if (connected) {
        this.onUserLoginLogout('login');
      }
    });
  }

  activatedLocation(url: string) {
    const currentLocation = url;
    for (let item of this.items) {
      if (currentLocation.includes(item.label?.toLowerCase()!)) {
        this.activeItem = item;
      }
    }
  }

  onUserLoginLogout(loginLogout: string) {
    this.webSocketSvc.onUserLoginLogout(this.userInfo, loginLogout);
  }

  ngOnDestroy(): void {
    this.onUserLoginLogout('logout');
    this.route$.unsubscribe();
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadHander(event: any) {
    this.onUserLoginLogout('logout');
    return true;
  }
}
