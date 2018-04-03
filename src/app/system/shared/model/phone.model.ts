export class Phone {
    constructor(public isActive: string,
                public num: string,
                public operatorType: string,
                public operatorUrl: string,
                public regDate: string,
                public socialAccountIds?: string[],
                public operatorAccLogin?: string,
                public operatorAccPass?: string,
                public id?: number) {}
}