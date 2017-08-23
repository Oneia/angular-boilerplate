import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { AuthService } from '../../auth/auth.service';
import { AuthUser } from '../../../models/auth-user';

/**
  Guard check can user open any main page
  */
@Injectable()
export class LoginInGuardService implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router,
  ) { }

  canActivate(): Observable<boolean> {
    return this.auth.currentUser
      .map((user: AuthUser) => {
        if (!user) {
          this.router.navigateByUrl('/login');
        }

        return !!user;
      });
  }

}
