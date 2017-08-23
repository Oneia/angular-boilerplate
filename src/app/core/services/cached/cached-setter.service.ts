import { Injectable } from '@angular/core';

import 'rxjs/add/operator/first';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';


import { DebugLevel, DebugService } from '../debug.service';
import { CachedDataService } from './cached-data.service';
import { Observable } from 'rxjs/Observable';

/**
 * The service description ...
 *
 * @example
 *
 *     class ... {
 *       constructor(private cachedSetter: CachedSetterService) {
 *
 *       }
 *     }
 *
 */
@Injectable()
export class CachedSetterService {

  private debug: DebugService;

  public constructor(
    private cacheData: CachedDataService,
    debug: DebugService,
    ) {
    this.debug = debug.factory(new.target.name, DebugLevel.All);
  }

  public init() {
    this.initUsers();
  }

  private initUsers(): void {
    this
      .cacheData
      .usersSubscribed$
      .first()
      .switchMap(() => Observable.of('hee'))
      .do((res: any) => this.cacheData.updateSubject('users', res))
      .subscribe();
  }
}
