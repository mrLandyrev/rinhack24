import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthorizedUser } from '../types/authorized-user.interface';

export const CURRENT_USER = new InjectionToken<AuthorizedUser>(
  'AuthorizedUser'
);

export class CurrentUserProvider extends Observable<AuthorizedUser> {}
