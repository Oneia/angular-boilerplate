import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainContentComponent } from './core/components/main-content.component';
import { SignInComponent } from './core/components/sign-in/sign-in.component';
import { NotFoundComponent } from './core/components/not-found/not-found.component';
import { LogOutGuardService } from './core/services/routing/guard';
import { LoginInGuardService } from './core/services/routing/guard';
import { PermissionServices } from './core/services/routing/guard';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full',
  },
  {
    path: 'main',
    component: MainContentComponent,
    canActivate: [LoginInGuardService],
  },
  {
    path: 'login',
    component: SignInComponent,
    canActivate: [LogOutGuardService]
  },
  {
    path: '**',
    redirectTo: 'not-found'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes
    ),
  ],
  exports: [
    RouterModule,
  ],
  providers: [
    ...PermissionServices,
  ]
})
export class AppRoutingModule {}

