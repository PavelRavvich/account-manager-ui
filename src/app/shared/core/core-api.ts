import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class CoreApi {
  private baseUrl = 'http://localhost:3000/';

  constructor(public http: HttpClient) {
  }
  
  public get(url: string = ''): Observable<any> {
    return this.http.get(this.getUrl(url));
  }

  public post(url: string, data: any = {}): Observable < any > {
    return this.http.post(this.getUrl(url), data);
  }

  public delete(url: string, id: string): Observable < any > {
    return this.http.delete(`${this.getUrl(url) + id}`);
  }

  private getUrl(url: string = ''): string {
    return this.baseUrl + url;
  }
}
