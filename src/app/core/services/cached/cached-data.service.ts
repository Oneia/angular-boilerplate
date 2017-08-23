import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/multicast';

import { AnyObject } from 'typed-object-interfaces';

import { DebugLevel, DebugService } from '../debug.service';

/**
 * The service description ...
 *
 * @example
 *
 *     class ... {
 *       constructor(private cachedData: CachedDataService) {
 *
 *       }
 *     }
 *
 */
@Injectable()
export class CachedDataService {

  /**
    Any MODULE
    */
  public users$: Observable<any[]>;
  public usersSubscribed$ = new Subject<any[]>();

  private _users$ = new BehaviorSubject<any[]>([]);

  private debug: DebugService;

  public constructor(
    debug: DebugService,
  ) {
    this.debug = debug.factory(new.target.name, DebugLevel.All);
  }

  public init() {
    this.users$ = this._users$.multicast(this.usersSubscribed$).refCount();

  }

  public updateSubject(type: string, value: AnyObject[]): void {
    if (this[`_${type}$`].getValue().length === 0) {
      this[`_${type}$`].next(value);
    }
  }

}
