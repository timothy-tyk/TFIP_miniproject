import { NgModule } from '@angular/core';
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
import { ChatComponent } from './components/lobby/chat.component';
import { WebsocketService } from './services/websocket/websocket.service';
import { ChatService } from './services/chat/chat.service';

@NgModule({
  declarations: [
    AppComponent,
    AuthButtonComponent,
    LobbyMainComponent,
    UserInfoComponent,
    UserEditComponent,
    ChatComponent,
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
  ],
  providers: [UserService, ChatService, WebsocketService],
  bootstrap: [AppComponent],
})
export class AppModule {}
