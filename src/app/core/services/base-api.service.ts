import { Injectable } from '@angular/core';
import { Http, URLSearchParams, RequestOptions } from '@angular/http';
import { AnyObject } from 'typed-object-interfaces';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class BaseApiService {

  constructor(
    private http: Http,
  ) { }

  public methodGet(url: string, params?: AnyObject): Observable<AnyObject> {
    const search = new URLSearchParams();
    search.append('results', '10');
    const options = new RequestOptions({search});

    return this.http.get(url, options);
  }

  // public methodPost(url: string, params?: AnyObject): Observable<AnyObject> {
  //   const search = new URLSearchParams();
  //   search.append('results', '10');
  //   const options = new RequestOptions({search});
  //
  //   return this.http.post(url, options);
  // }
  //
  // public methodDelete(url: string, params?: AnyObject): Observable<AnyObject> {
  //   const search = new URLSearchParams();
  //   search.append('results', '10');
  //   const options = new RequestOptions({search});
  //
  //   return this.http.delete(url, options);
  // }
  //
  // public methodPut(url: string, params?: AnyObject): Observable<AnyObject> {
  //   const search = new URLSearchParams();
  //   search.append('results', '10');
  //   const options = new RequestOptions({search});
  //
  //   return this.http.put(url, options);
  // }
}
