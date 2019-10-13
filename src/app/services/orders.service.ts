import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { from, Observable } from 'rxjs';
import { ServiceResponse } from '../models/service-response';
import { map, catchError } from 'rxjs/operators';

@Injectable()

export class OrdersService {

  constructor(private baseService: BaseService) { }

  getAutoOrderDetails(): Observable<ServiceResponse> {
    const url = '/Order/GetAutoOrders/' + localStorage.getItem('UserId');
    const detail = from(this.baseService.RequestGet<ServiceResponse>(url)).
      pipe(map(x => x)).
      pipe(catchError(this.baseService.logError));
    return detail;
  }

  getManualOrderDetails(userId, orderId?): Observable<ServiceResponse> {
    const url: string = '/Order/GetManualOrders/' + userId + '/' + orderId;
    const detail = from(this.baseService.RequestGet<ServiceResponse>(url)).
      pipe(map(x => x)).
      pipe(catchError(this.baseService.logError));
    return detail;
  }

  getReasons(): Observable<ServiceResponse> {
    const url = '/Order/GetReasons';
    const detail = from(this.baseService.RequestGet<ServiceResponse>(url)).
      pipe(map(x => x)).
      pipe(catchError(this.baseService.logError));

    return detail;
  }

  createOrder(order) {
    const url = '/Order/CreateOrder';
    const data = { order };
    const detail = from(this.baseService.RequestPost<ServiceResponse>(url, data)).
      pipe(map(x => x)).
      pipe(catchError(this.baseService.logError));
    return detail;
  }

  deleteOrder(order) {
    const url = '/Order/DeleteOrder';
    const data = { order };
    const detail = from(this.baseService.RequestPost<ServiceResponse>(url, data)).
      pipe(map(x => x)).
      pipe(catchError(this.baseService.logError));

    return detail;
  }

  getMessageText(messageId?): Observable<ServiceResponse> {
    const url: string = '/Order/GetMessageText/' + messageId;
    const detail = from(this.baseService.RequestGet<ServiceResponse>(url)).
      pipe(map(x => x)).
      pipe(catchError(this.baseService.logError));
    return detail;
  }

  getNoteTextByPartNumber(partNumber?): Observable<ServiceResponse> {
    const url: string = '/Order/GetNoteTextByPartNumber/' + partNumber;
    const detail = from(this.baseService.RequestGet<ServiceResponse>(url)).
      pipe(map(x => x)).
      pipe(catchError(this.baseService.logError));

    return detail;
  }

  getShoppingCartDetails(): Observable<ServiceResponse> {
    const userId = localStorage.getItem('UserId');
    const url: string = '/ShoppingCart/GetShoppingCartDetails/' + userId;
    const detail = from(this.baseService.RequestGet<ServiceResponse>(url)).
      pipe(map(x => x)).
      pipe(catchError(this.baseService.logError));
    console.log('ShoppingCartDetails', detail);
    return detail;
  }
}
