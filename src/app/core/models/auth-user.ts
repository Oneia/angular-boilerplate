export class AuthUser {

  public email: string;
  public permissions: Array<string>;

  constructor(rawAppUser: any, permissions?: string | Array<string>) {
    this.email = rawAppUser.email;

    switch (typeof permissions) {
      case 'undefined':
        // No permissions
        this.permissions = [];
        break;
      case 'string':
        this.permissions = [ permissions as string ];
        break;
      default:
        if (Array.isArray(permissions)) {
          this.permissions = permissions;
        } else {
          // Unsupported permissions type returned by back-end app
          this.permissions = [];
        }
        break;
    }
  }

}
