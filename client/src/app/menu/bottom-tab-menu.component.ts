import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { TabMenuModule } from 'primeng/tabmenu';

@Component({
  selector: 'app-bottom-tab-menu',
  templateUrl: './bottom-tab-menu.component.html',
  styleUrls: ['./bottom-tab-menu.component.css'],
})
export class BottomTabMenuComponent implements OnInit {
  items!: MenuItem[];
  constructor(private router: Router) {}
  ngOnInit() {
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
}
