import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { BaseService } from './base.service';
import { ServiceResponse } from '../models/service-response';
import { map, catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class ArticleService {
  private showtableView = new BehaviorSubject<string>('false');
  currentArticleTableView = this.showtableView.asObservable();
  private filterArticles = new BehaviorSubject<Object>({});
  filterArticlesByParameter = this.filterArticles.asObservable();
  private filterArticlesySearch = new BehaviorSubject<string>('');
  filterArticlesByString = this.filterArticlesySearch.asObservable();
  i = 0;
  constructor(private baseService: BaseService, public http: HttpClient) { }

  getArticles(couponFilter?, campaignFilter?, productFamilyFilter?, profileFilter?, articleName?): Observable<ServiceResponse> {
    let url = '/Articles/GetArticles';
    let data = {
      UserType: localStorage.getItem('UserType'),
      ArticleName: articleName,
      CouponFilter: couponFilter,
      CampaignFilter: campaignFilter,
      ProductFamilyFilter: productFamilyFilter,
      ProfileFilter: profileFilter,
      UserGuid: localStorage.getItem('UserId'),
      BaseCategory: localStorage.getItem('BaseCategory')
    };
    let detail = from(this.baseService.RequestPost<ServiceResponse>(url, data)).
      pipe(map(x => x)).
      pipe(catchError(this.baseService.logError));

    return detail;
  }

  GetTopMenuPartFilterPrt(): Observable<ServiceResponse> {
    const userGroup = localStorage.getItem('UserGroup');
    const url: string = '/Articles/GetTopMenuPartFilterPrt/' + userGroup;
    const detail = from(this.baseService.RequestGet<ServiceResponse>(url)).
      pipe(map(x => x)).
      pipe(catchError(this.baseService.logError));
    return detail;
  }

  getUpdateForSaldo(): Observable<ServiceResponse> {
    const data = {
      UserType: localStorage.getItem('UserType'),
      UserGuid: localStorage.getItem('UserId')
    };
    const url = '/Articles/GetUpdateForSaldo/';
    const detail = from(this.baseService.RequestPost<ServiceResponse>(url, data)).
      pipe(map(x => x)).
      pipe(catchError(this.baseService.logError));

    return detail;
  }

  getDataBaseUpdateTime(): Observable<ServiceResponse> {
    const url = '/Articles/GetDataBaseUpdateTime/';
    const detail = from(this.baseService.RequestGet<ServiceResponse>(url)).
      pipe(map(x => x)).
      pipe(catchError(this.baseService.logError));

    return detail;
  }

  getArticlesBySearch(articleName?): Observable<ServiceResponse> {
    const userId = localStorage.getItem('UserId')
    const userType = localStorage.getItem('UserType');
    const baseCategory = localStorage.getItem('BaseCategory');
    const url: string = '/Articles/GetArticlesBySearch/' + userId + '/'
      + userType + '/' + btoa(unescape(encodeURIComponent(articleName))) + '/' + baseCategory;
    const detail = from(this.baseService.RequestGet<ServiceResponse>(url)).
      pipe(map(x => x)).
      pipe(catchError(this.baseService.logError));

    return detail;
  }

  changeArticleView(doChange) {
    this.showtableView.next(doChange);
  }

  getArticlesByParam(param) {
    console.log('PARAM', param);
    this.filterArticles.next(param);
  }

  getArticlesByStringParam(text) {
    this.filterArticlesySearch.next(text);
  }

  saveArticlestoCart(articleId, quantity, articleNumber): Observable<ServiceResponse> {
    const url = '/ShoppingCart/SaveArticlestoCart';
    const data = {
      UserGuid: localStorage.getItem('UserId'),
      ArticleGuid: articleId,
      Quantity: quantity,
      ArticleNumber: articleNumber
    };

    const detail = from(this.baseService.RequestPost<ServiceResponse>(url, data)).
      pipe(map(x => x)).
      pipe(catchError(this.baseService.logError));

    return detail;
  }
}
