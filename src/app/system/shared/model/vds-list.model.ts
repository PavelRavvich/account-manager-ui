import { Vds } from "./vds.model";

export class VdsList {

    constructor(public pageNumber: number,
                public pageSize: number,
                public total: number,
                public data: Vds[]) {}
}