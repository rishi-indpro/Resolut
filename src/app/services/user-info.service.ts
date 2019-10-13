import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { BaseService } from './base.service';
import { ServiceResponse } from '../models/service-response';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class UserInfoService {

  constructor(private baseService: BaseService, public http: HttpClient) { }

  getUser(): Observable<ServiceResponse> {
    const getUserApiUrl = '/WebShop/GetUserDetails';

    const userDetail = from(this.baseService.RequestGet<ServiceResponse>(getUserApiUrl)).
      pipe(map(x => x)).
      pipe(catchError(this.baseService.logError));
    console.log('YYYY', userDetail);
    return userDetail;
  }
}
