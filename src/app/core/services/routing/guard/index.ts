import { LogOutGuardService } from './log-out-guard.service';
import { LoginInGuardService } from './login-in-guard.service';

export { LogOutGuardService } from './log-out-guard.service';
export { LoginInGuardService } from './login-in-guard.service';

export const PermissionServices = [
  LoginInGuardService,
  LogOutGuardService,
];

