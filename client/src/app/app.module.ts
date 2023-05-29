import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

// Auth0 SDK
import { AuthModule } from '@auth0/auth0-angular';
import { AuthButtonComponent } from './components/auth/auth-button.component';

// Lobby Components
import { LobbyMainComponent } from './components/lobby/lobby-main.component';
import { UserService } from './services/user/user.service';
import { UserInfoComponent } from './components/user/user-info.component';
import { UserEditComponent } from './components/user/user-edit.component';
import { NgxContextModule } from 'ngx-context';

// Firebase
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
// Components
import { ChatComponent } from './components/lobby/chat.component';
import { WebsocketService } from './services/websocket/websocket.service';
import { ChatService } from './services/chat/chat.service';
import { RoomListComponent } from './components/rooms/room-list.component';
import { AddRoomComponent } from './components/rooms/add-room.component';
import { RoomComponent } from './components/rooms/room.component';
import { RoomChatComponent } from './components/rooms/room-chat.component';
import { PlayerComponent } from './components/player/player.component';
import { SpotifyAuthService } from './services/auth/spotify-auth.service';
import { LandingPageComponent } from './components/landing/landing-page.component';
import { SearchAddTrackComponent } from './components/player/search-add-track.component';
import { PlaylistComponent } from './components/playlist/playlist.component';
import { AddRoomSearchTrackComponent } from './components/rooms/add-room-search-track.component';
import { PrimeModule } from './prime.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BottomTabMenuComponent } from './components/menu/bottom-tab-menu.component';
import { HomeMainComponent } from './components/home/home-main.component';
import { FriendsComponent } from './components/lobby/friends.component';
import { PlayControlButtonComponent } from './components/player/play-control-button.component';
import { UserDialogInfoComponent } from './components/user/user-dialog-info.component';
import { SpotifyCodeComponent } from './components/landing/spotify-code.component';
import { InviteComponent } from './components/lobby/invite.component';
import { LogoutComponent } from './components/auth/logout.component';
import { TopMenuComponent } from './components/menu/top-menu.component';
import { SearchComponent } from './components/lobby/search.component';
import { UserPlayerComponent } from './components/user/user-player.component';
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  declarations: [
    AppComponent,
    AuthButtonComponent,
    LobbyMainComponent,
    UserInfoComponent,
    UserEditComponent,
    ChatComponent,
    RoomListComponent,
    AddRoomComponent,
    RoomComponent,
    RoomChatComponent,
    PlayerComponent,
    LandingPageComponent,
    SearchAddTrackComponent,
    PlaylistComponent,
    AddRoomSearchTrackComponent,
    TopMenuComponent,
    BottomTabMenuComponent,
    HomeMainComponent,
    FriendsComponent,
    PlayControlButtonComponent,
    UserDialogInfoComponent,
    SpotifyCodeComponent,
    InviteComponent,
    LogoutComponent,
    SearchComponent,
    UserPlayerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    // Import the module into the application, with configuration
    AuthModule.forRoot({
      domain: 'dev-z246i-mz.us.auth0.com',
      clientId: 'wj3DmLCYTmk5HjAvNQ1c7XG7pM7oyqMg',
      authorizationParams: {
        redirect_uri: window.location.origin,
      },
    }),
    NgxContextModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    PrimeModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [UserService, ChatService, WebsocketService, SpotifyAuthService],
  bootstrap: [AppComponent],
})
export class AppModule {}
