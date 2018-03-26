import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class CoreApi {
  private baseUrl = 'http://localhost:3000/';

  constructor(public http: HttpClient) {
  }

  public post(url: string, data: any = {}) {
    return this.http.post(this.getUrl(url), data);
  }

  public get(url: string = ''): Observable<any> {
    return this.http.get(this.getUrl(url));
  }

  private getUrl(url: string = ''): string {
    return this.baseUrl + url;
  }
}
