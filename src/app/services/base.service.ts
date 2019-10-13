import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class BaseService {

  constructor(public http: HttpClient) { }
  private webShopApiBaseUrl = environment.WebShopApiBaseUrl;

  public async RequestGet<T>(url): Promise<T> {
    const data = await this.http.get<T>(this.webShopApiBaseUrl + url, { withCredentials: true }).toPromise();
    return data;
  }

  public async RequestPost<T>(url, dataToPost): Promise<T> {
    const data = await this.http.post<T>(this.webShopApiBaseUrl + url, dataToPost, { withCredentials: true }).toPromise();
    return data;
  }

  logError(error: any) {
    console.log(error);
    return Observable.throw(error);
  }
}
