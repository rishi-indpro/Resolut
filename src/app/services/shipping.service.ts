import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { from, Observable } from 'rxjs';
import { ServiceResponse } from '../models/service-response';
import { map, catchError } from 'rxjs/operators';

@Injectable()

export class ShippingService {

  constructor(private baseService: BaseService) { }

  getAllShippingMethods(): Observable<ServiceResponse> {
    const url = '/ShipViaMethods/GetAllShippingMethods';
    const shippingMethods = from(this.baseService.RequestGet<ServiceResponse>(url)).
      pipe(map(x => x)).
      pipe(catchError(this.baseService.logError));

    return shippingMethods;
  }
}
