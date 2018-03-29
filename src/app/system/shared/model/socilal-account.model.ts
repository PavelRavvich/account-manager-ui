export class SocialAccount {
    constructor(public vdsId: number,
                public name: string, 
                public login: string,
                public password: string,
                public notes?: string,
                public id?: number) {}
}