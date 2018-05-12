import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import {CoreApi} from '../../../shared/core/core-api';
import {Injectable} from '@angular/core';
import {Vds} from '../model/vds.model';
import { VdsList } from '../model/vds-list.model';
import { VdsFilter } from '../model/vds-filter.model';

@Injectable()
export class VdsService extends CoreApi {

    constructor(public http : HttpClient) {
        super(http);
    }

    getVdsList(filter: VdsFilter) : Observable < VdsList > {
        let url = `vds/list?pageNumber=${filter.pageNumber}`;
        Object.keys(filter).forEach((key, index) => url = !!filter[key] ? url.concat(`&${key}=${filter[key]}`) : url);
        return this.get(url).map((data : VdsList) => data);
    }

    getVdsById(id: string): Observable < Vds > {
        return this.get(`vds/get?id=${+id}`)
    }

    addVds(vds: Vds): Observable < Vds > {
        return this.post(`vds-list`, vds);
    }

    updateVds(vds: Vds): Observable < Vds > {
        return this.put(`vds-list/${vds.id}`, vds);
    }

    deleteVds(id: number): Observable < Vds > {
        return this.delete('vds-list/', id.toString());
    }
}
