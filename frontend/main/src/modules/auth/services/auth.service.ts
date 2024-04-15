import {Injectable} from '@angular/core';

import {AuthorizedUser} from '../types/authorized-user.interface';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly currentUser?: AuthorizedUser;

    getUserInfo$() {}
}
