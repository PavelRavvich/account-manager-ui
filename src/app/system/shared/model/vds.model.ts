export class Vds {
  constructor(public ip: string,
              public login: string,
              public password: string,
              public activatedDate: string,
              public deactivatedDate: string,
              public id?: number) {

  }
}
