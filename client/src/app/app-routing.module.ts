import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthButtonComponent } from './components/auth/auth-button.component';
import { LobbyMainComponent } from './components/lobby/lobby-main.component';
import { UserEditComponent } from './components/user/user-edit.component';

const routes: Routes = [
  { path: '', component: AuthButtonComponent },
  { path: 'lobby', component: LobbyMainComponent },
  { path: 'user/edit', component: UserEditComponent },
  { path: '**', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
