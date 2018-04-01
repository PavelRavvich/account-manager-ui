export class SocialAccount {
    constructor(public vdsId: number,
                public socialType: string, 
                public login: string,
                public password: string,
                public notes?: string,
                public phone?: string,
                public regDate?: string,
                public status?: string,
                public id?: number) {}
}