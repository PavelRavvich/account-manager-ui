import {Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Injectable} from '@angular/core';
import {User} from '../model/user.model';

@Injectable()
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  constructor(private router: Router) {
  }

  login(user: User) {
    this.loggedIn.next(true);
    window.localStorage.setItem('user', JSON.stringify(user));
    this.router.navigate(['/']);
  }

  logout() {
    this.loggedIn.next(false);
    window.localStorage.clear();
    this.router.navigate(['/login']);
  }
}
