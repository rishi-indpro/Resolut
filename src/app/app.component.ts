import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { UserAuthService } from './services/user-auth.service';
import { UserInfoService } from './services/user-info.service';
import { User, RoleMetaName, RoleMetaNames } from './models/user';
import { UsersEnum } from './models/UserDefinedEnums';
import { Event, Router, NavigationStart, NavigationEnd, NavigationError, NavigationCancel } from '@angular/router';
import { environment } from '../environments/environment';
import { ArticleService } from './services/article.service';
import { ArticleListStorage, LoggedInUserInfo, NumberOnCart } from './models/data';
import { OrdersService } from './services/orders.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { Article } from './models/article';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  UserHasLoggedIn = false;
  loading: boolean;
  userDetail: User;
  roleMetaNames: RoleMetaName[];
  allRoleMetaNames: RoleMetaNames[];
  modalRef: BsModalRef;
  @ViewChild('templateArticleInKart', { static: false }) private msgTempConfirmRef: TemplateRef<any>;

  constructor(private ordersService: OrdersService, private numberOnCart: NumberOnCart,
    private modalService: BsModalService, private router: Router, private articleService: ArticleService,
    private userAuthService: UserAuthService, private userService: UserInfoService, private userInfoService: UserInfoService,
    private loggedInUserInfo: LoggedInUserInfo, private articleListStorage: ArticleListStorage) {
    this.loading = true;
    this.router.events.subscribe((event: Event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          break;
        }
        case event instanceof NavigationEnd:
        case event instanceof NavigationError:
        case event instanceof NavigationCancel: {
        }
        default: {
          break;
        }
      }
    });
  }

  ngOnInit() {
    this.getUserDetails();
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm smallPopup modal-dialog-centered', ignoreBackdropClick: true });
  }

  async getUserDetails() {
    localStorage.clear();
    await this.userInfoService.getUser().subscribe(response => {
      console.log('response', response);
      if (response.IsSuccess) {

        this.userDetail = response.IsSuccess === true ? response.ResponseData : '';

        this.loggedInUserInfo.user = this.userDetail;
        this.loggedInUserInfo.user.UserGroup = this.userDetail.RoleMetaNameList.charAt(0);
        this.loggedInUserInfo.user.UserId = this.userDetail.UserGUID;
        this.loggedInUserInfo.user.UserType = (UsersEnum as any)[this.loggedInUserInfo.user.UserGroup];

        console.log('this.loggedInUserInfo', this.loggedInUserInfo.user);

        this.userAuthService.Stoarge = this.userDetail;
        localStorage.setItem('UserGroup', this.userDetail.RoleMetaNameList.charAt(0));
        localStorage.setItem('UserId', this.userDetail.UserGUID);
        localStorage.setItem('UserType', (UsersEnum as any)[this.loggedInUserInfo.user.UserGroup]);
        localStorage.setItem('BaseCategory', this.userDetail.BaseCategory);

        this.getArticleDetails();
      } else {
        window.open(environment.loginUrl, '_self');
      }
    });
  }

  async getArticleDetails() {
    await this.articleService.getArticles().subscribe(response => {
      if (response.IsSuccess) {
        this.articleListStorage.ArticlesCollection = response.IsSuccess === true ? response.ResponseData : [];
        this.getCouponDetails();
        this.GetTopMenuPartFilterPrt();
      }
    });
  }

  async getCouponDetails() {
    this.getCouponMatchbundetMaterial();
    this.getCouponNeutralaKuponger();
    this.getCouponKvittorullar();
  }

  async getCouponMatchbundetMaterial() {
    const couponDetail: Article[] = this.articleListStorage.ArticlesCollection
      .filter(x => (x.ArticleNumber.startsWith('00') && x.Contract === 'MTD'));

    if (couponDetail !== undefined && couponDetail.length > 0) {
      this.articleListStorage.couponDetailMatchbundetMaterial = couponDetail;
    }
  }

  async getCouponNeutralaKuponger() {
    const couponDetail: Article[] = this.articleListStorage.ArticlesCollection
      .filter(x => (x.ArticleNumber.startsWith('00') && x.Contract === 'SBG'));

    if (couponDetail !== undefined && couponDetail.length > 0) {
      this.articleListStorage.couponDetailNeutralaKuponger = couponDetail;
    }
  }

  async getCouponKvittorullar() {
    const couponDetail: Article[] = this.articleListStorage.ArticlesCollection
      .filter(x => (x.ArticleNumber.startsWith('0') && !x.ArticleNumber.startsWith('00') && x.Contract === 'SBG'));

    if (couponDetail !== undefined && couponDetail.length > 0) {
      this.articleListStorage.CouponDetailKvittorullar = couponDetail;
    }
  }

  async GetTopMenuPartFilterPrt() {
    await this.articleService.GetTopMenuPartFilterPrt().subscribe(response => {
      console.log('GetTopMenuPartFilterPrt Response', response);
      this.articleListStorage.compaignDetail = JSON.parse(response.ResponseData[0]);
      this.articleListStorage.profileDetail = response.ResponseData[1];
      this.articleListStorage.productFamilyDetail = response.ResponseData[2];
      this.UserHasLoggedIn = true;
      this.loading = false;

      this.getShoppingCartDetails();
    });
  }

  async getShoppingCartDetails() {
    await this.ordersService.getShoppingCartDetails().subscribe(response => {
      console.log('Cart details', response.ResponseData);
      if (response.ResponseData.length > 0) {
        this.openModal(this.msgTempConfirmRef);
        this.numberOnCart.articleNumberOnCart = response.ResponseData.length;
        this.numberOnCart.ArticlesListColln = response.ResponseData;
      }
    });
  }
}
