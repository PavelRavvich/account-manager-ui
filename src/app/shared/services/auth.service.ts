import {Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Injectable} from '@angular/core';
import {User} from '../model/user.model';

@Injectable()
export class AuthService {

  private loggedIn = false;

  get isLoggedIn() {
    return this.loggedIn;
  }

  constructor(private router: Router) {
  }

  login(user: User) {
    this.loggedIn = true;
    window.localStorage.setItem('user', JSON.stringify(user));
    this.router.navigate(['/vds-list']);
  }

  logout() {
    this.loggedIn = false;
    window.localStorage.clear();
    this.router.navigate(['/login']);
  }
}
