import { DebugService } from './debug.service';
import { CachedDataService } from './cached/cached-data.service';
import { CachedSetterService } from './cached/cached-setter.service';
import { AuthService } from './auth/auth.service';

import { BaseApiService } from './base-api.service';


export * from './debug.service';

export const CoreServices = [
  DebugService,
  CachedSetterService,
  CachedDataService,
  AuthService,
  BaseApiService,
];

