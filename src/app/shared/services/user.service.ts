import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import {CoreApi} from '../core/core-api';
import {User} from '../model/user.model';
import {Injectable} from '@angular/core';

@Injectable()
export class UserService extends CoreApi {

  constructor(public http: HttpClient) {
    super(http);
  }

  login(username: string, password: string): Observable<any> {
    return this.post(`user/login?username=${username}&password=${password}`);
  }

  regisyration(username: string, password: string): Observable<User> {
    return this.post(`user/registration?username=${username}&password=${password}`).map((user: User) => user);
  }
}
