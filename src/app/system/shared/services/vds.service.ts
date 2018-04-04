import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import {CoreApi} from '../../../shared/core/core-api';
import {Injectable} from '@angular/core';
import {Vds} from '../model/vds.model';

@Injectable()
export class VdsService extends CoreApi {

    constructor(public http : HttpClient) {
        super(http);
    }

    getVdsList() : Observable < Vds[] > {
        return this.get(`vds-list`).map((data : Vds[]) => data);
    }

    getVdsById(id: string): Observable < Vds > {
        return this.get(`vds-list/${id}`)
    }

    addVds(vds: Vds): Observable < Vds > {
        return this.post(`vds-list`, vds);
    }

    deleteVds(id: number): Observable < Vds > {
        return this.delete('vds-list/', id.toString());
    }
}
