import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import {CoreApi} from '../../../shared/core/core-api';
import {Injectable} from '@angular/core';
import {Vds} from '../model/vds.model';
import { SocialAccount } from '../model/socilal-account.model';

@Injectable()
export class SocialService extends CoreApi {

    constructor(public http : HttpClient) {
        super(http);
    }

    getSocialAccountsById(vdsId: string): Observable < SocialAccount[] > {
        return this.get(`social-accounts?vdsId=${vdsId}`);
    }

    addSocialAccount(account: SocialAccount): Observable < SocialAccount > {
        return this.post(`social-accounts`, account);
    }

    deleteSocialAccount(id: number): Observable < SocialAccount > {
        return this.delete(`social-accounts/`, id.toString());
    }
}