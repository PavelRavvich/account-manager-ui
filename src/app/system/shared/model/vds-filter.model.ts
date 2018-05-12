export class VdsFilter {
    constructor(public pageSize: number = 15,
                public pageNumber: number = 0,
                public ip?: string,
                public id?: string,
                public note?: string,
                public login?: string,
                public password?: string,
                public isActivatedDate?: boolean,
                public from?: number,
                public to?: number) {}
}