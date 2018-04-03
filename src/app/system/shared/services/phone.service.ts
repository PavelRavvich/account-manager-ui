import { Injectable } from "@angular/core";
import { CoreApi } from "../../../shared/core/core-api";
import { HttpClient } from "@angular/common/http";
import { Phone } from "../model/phone.model";
import { Observable } from "rxjs/Observable";

@Injectable()
export class PhoneService extends CoreApi {

    constructor(public http : HttpClient) {
        super(http);
    }

    getPhoneList() : Observable < Phone[] > {
        return this.get(`phone-list`).map((data : Phone[]) => data);
    }

    getPhoneById(id: string): Observable < Phone > {
        return this.get(`phone-list/${id}`)
    }

    addPhone(phone: Phone): Observable < Phone > {
        return this.post('phone-list', phone);
    }

    updatePhone(phone: Phone): Observable < Phone > {
        return this.put(`phone-list/${phone.id}`, phone);
    }

    deletePhone(id: number): Observable < void > {
        return this.delete('phone-list/', id + '');
    }
}