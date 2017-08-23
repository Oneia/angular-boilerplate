import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { AuthUser } from '../../models';

/**
  Authentication service
  */
@Injectable()
export class AuthService {

  /**
    Current user stream
    */
  public currentUser: Observable<AuthUser>;
  /**
    current user static
    */
  public currentUserSnapshot: AuthUser;

  constructor(
      private router: Router
      ) {
    this.currentUser = Observable.of(new AuthUser({}));
    this.currentUserSnapshot = new AuthUser({});

  }

  /**
    Request to logout
    */
  public signInViaEmail(email: string, password: string): void {
    Promise.resolve()
      .then(() => this.router.navigate(['/']));
  }

  /**
    Request to logout
    */
  public signOut(): void {
     Promise.resolve()
      .then(() => this.router.navigate(['/login']));
  }
}
