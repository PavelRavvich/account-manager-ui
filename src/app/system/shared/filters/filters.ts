import { SocialAccount } from "../model/socilal-account.model";
import { Vds } from "../model/vds.model";
import { Phone } from "../model/phone.model";
import * as moment from 'moment';

export class Filters {

    doEqualFilter(data: any[], by: string, filterData: string | number): any[] {
        return this.isFilterable(data, filterData) ? data.filter((item) => item[by] == filterData) : data
    }

    doIncludeFilter(data: any[], by: string, filterData: string): any[] {
        return this.isFilterable(data, filterData) ? data.filter((item) => (item[by] + '').indexOf(filterData) !== -1) : data;
    }

    doFilterByDate(data: any[], by: string, filterDateFrom: Date | string, filterDateTo: Date | string): any[] {
        if (!filterDateFrom || !filterDateTo) {
            return data;
        }
        const from = moment(filterDateFrom, 'MM-DD-YYYY');
        const to = moment(filterDateTo, 'MM-DD-YYYY');
        return data.filter((item) => {
            const date: Date = new Date(item[by]);
            if (date.getHours() === 0) {
                date.setHours(date.getHours() + 1);
            }
            const target = moment(date, 'YYYY-MM-DD');
            return target.isBetween(from, to, 'days', '[]');
        });
    }

    private isFilterable(data: any[], filterData: string | number): boolean {
        return data.length !== 0 && !!filterData;
    }
}