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

  getUserByEmail(email: string): Observable<User> {
    return this.get(`users?email=${email}`).map((data: User[]) => {
      return data.length > 0 ? data[0] : undefined;
    });
  }
}
