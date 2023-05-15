import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthButtonComponent } from './components/auth/auth-button.component';
import { LandingPageComponent } from './components/landing/landing-page.component';
import { LobbyMainComponent } from './components/lobby/lobby-main.component';
import { AddRoomComponent } from './components/rooms/add-room.component';
import { RoomListComponent } from './components/rooms/room-list.component';
import { RoomComponent } from './components/rooms/room.component';
import { UserEditComponent } from './components/user/user-edit.component';
import { HomeMainComponent } from './components/home/home-main.component';

const routes: Routes = [
  { path: '', component: AuthButtonComponent },
  { path: 'login', component: LandingPageComponent },
  { path: 'lobby', component: LobbyMainComponent },
  { path: 'home', component: HomeMainComponent },
  { path: 'user/edit', component: UserEditComponent },
  { path: 'rooms', component: RoomListComponent },
  { path: 'rooms/add', component: AddRoomComponent },
  { path: 'rooms/:id', component: RoomComponent },
  // { path: '**', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
