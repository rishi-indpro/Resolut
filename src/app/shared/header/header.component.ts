import { Component, OnInit, HostListener, ElementRef, ViewChild, ViewChildren, QueryList, ContentChild } from '@angular/core';
import { User } from '../../models/user';
import { ArticleService } from '../../services/article.service';
import { Output, EventEmitter } from '@angular/core';
import { Data, LoggedInUserInfo, ArticleListStorage, NumberOnCart } from '../../models/data';
import { Router, NavigationStart } from '@angular/router';
import { UserAuthService } from '../../services/user-auth.service';
import { UserInfoService } from '../../services/user-info.service';
import { ArticlesComponent } from '../../articles/articles.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { NoteTextPart } from '../../models/order';
import { OrdersService } from '../../services/orders.service';
import { environment } from '../../../environments/environment';
import { Article, Campaigns } from '../../models/Article';
declare var $: any;
declare function InitializeControls(): any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [ArticlesComponent]
})

export class HeaderComponent implements OnInit {

  @ContentChild(ArticlesComponent, { static: false }) articlesComponent: ArticlesComponent;
  @Output() initialized = new EventEmitter<boolean>();
  userDetail: User;
  bsModalRef: BsModalRef;
  toggleDropdownMenu = false;
  noteTextPart: NoteTextPart;
  hideCouponMatchbundetMaterial = true;
  couponMatchbundetMaterial: Article[];
  hideCouponNeutralaKuponger = true;
  couponNeutralaKuponger: Article[];
  hideCouponKvittorullar = true;
  couponKvittorullar: Article[];
  compaignDetail: Campaigns[];
  loadArticleHeader = false;
  profileDetail: any;
  productFamilyDetail: any;
  showArticleTblView: string;
  showMobileMenu = false;
  @ViewChild('headerLink', { static: false }) el: ElementRef;
  @ViewChildren('topFilters') topFilters: QueryList<ElementRef>;
  screenHeight: number;
  screenWidth: number;
  searchString: string;
  availableSearchTags: string[];
  availableIdsTags: string[];
  searchText: string;
  showCartButton = true;
  deliveryAddress = '';
  InvoiceToUserName = '';
  DeliverToUserName = '';
  loading: boolean;
  url: string;

  constructor(private userAuthService: UserAuthService, public numOnCart: NumberOnCart,
    private articleListStorage: ArticleListStorage, private articleService: ArticleService,
    private bsModalservice: BsModalService, private ordersService: OrdersService,
    private router: Router, private loggedInUserInfo: LoggedInUserInfo) {

    // router.events.subscribe((e: any) => {
    //   if (e instanceof NavigationStart) {
    //     this.url = e.url;
    //     this.searchText = '';
    //     this.filterArticleByStringParam('');
    //     if (e.url !== '/Article') {
    //       this.loadArticleHeader = false;
    //     } else if (e.url === '/Article') {
    //       this.loadArticleHeader = true;
    //     }

    //     if (e.url === '/Cart') {
    //       this.loadArticleHeader = false;
    //     }
    //   }
    // });
    // this.availableSearchTags = articleListStorage.ArticlesCollection.map(a => a.ArticleNumber + ' ' + a.ArticleDescription);
    // this.availableSearchTags.unshift('');
    // this.availableIdsTags = articleListStorage.ArticlesCollection.map(a => a.ArticleNumber);
  }

  ngOnInit() {
    // const currentUrl = this.router.url;
    // console.log('currentUrl', currentUrl);
    // if (currentUrl === '/Article') {
    //   this.loadArticleHeader = true;
    //   this.url = this.router.url;
    // }

    // InitializeControls();
    // this.getUserDetails();
    // console.log('ArticleListStorage', this.articleListStorage);
    // this.getRollingBannerText();
    // this.getScreenSize();
    // this.articleService.currentArticleTableView.subscribe(x => this.showArticleTblView = x);
    // this.setCouponDetails();
    // this.compaignDetail = this.articleListStorage.compaignDetail;
    // this.profileDetail = this.articleListStorage.profileDetail;
    // this.productFamilyDetail = this.articleListStorage.productFamilyDetail;
    // this.InvoiceToUserName = '';
    // this.DeliverToUserName = '';
    // this.deliveryAddress = '';
    // console.log('this.userDetail', this.userDetail);
    // this.ShowUserDetails(this.userDetail);
  }

  setCouponDetails() {
    this.couponMatchbundetMaterial = this.articleListStorage.couponDetailMatchbundetMaterial;
    if (this.couponMatchbundetMaterial !== undefined && this.couponMatchbundetMaterial.length > 0) {
      this.hideCouponMatchbundetMaterial = false;
    }
    this.couponNeutralaKuponger = this.articleListStorage.couponDetailNeutralaKuponger;
    if (this.couponNeutralaKuponger !== undefined && this.couponNeutralaKuponger.length > 0) {
      this.hideCouponNeutralaKuponger = false;
    }
    this.couponKvittorullar = this.articleListStorage.CouponDetailKvittorullar;
    if (this.couponKvittorullar !== undefined && this.couponKvittorullar.length > 0) {
      this.hideCouponKvittorullar = false;
    }
  }


  convertToNumber(num: string) {
    return parseInt(num);
  }

  showFilterMenu(event) {
    const currentElement = $(event.target).parent();
    if (currentElement.hasClass('active')) {
      currentElement.children().removeClass('dpblk');
      currentElement.removeClass('active');
    } else {
      (this.topFilters.toArray()).forEach(elm => {
        $(elm.nativeElement).removeClass('active');
        $(elm.nativeElement).children().removeClass('dpblk');
      });
      currentElement.addClass('active');
      currentElement.children().addClass('dpblk');
    }
  }

  AddSearch(val) {
    this.availableSearchTags[0] = val;
    this.elasticSearch();
  }

  elasticSearch() {
    $('#elasticSearchInput').autocomplete({
      autoFocus: true,
      source: this.availableSearchTags,
      select: (event, ui) => {
        this.filterArticleByStringParam(ui.item.value);
      },
    });
  }

  onClickedOutside(e: Event) {
    this.toggleDropdownMenu = false;
  }

  getUserDetails() {
    if (this.userAuthService.Stoarge != null && this.userAuthService.Stoarge !== undefined && this.userAuthService.Stoarge !== '') {
      this.userDetail = this.userAuthService.Stoarge;
    } else {
      this.userDetail = this.loggedInUserInfo.user;
    }
  }

  setMenuFilterHeight(currentObject) {
    if (currentObject !== undefined) {
      const height = (currentObject.length * 34) > (this.screenHeight - 140) ? (this.screenHeight - 140) + 'px' : '';

      return height;
    }
    return 0;
  }

  setMenuFilterOverFlow(currentObject) {
    if (currentObject !== undefined) {
      const overflow = (currentObject.length * 34) > (this.screenHeight - 140) ? 'scroll' : '';
      return overflow;
    }
    return '';
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }

  resetAllSubscribeForArticleFresLoading() {
    this.filterArticleByMenu('', '', '', '', '');
    this.filterArticleByStringParam('');
  }

  filterArticleByMenu(a, b, c, d, e) {
    this.articleService.getArticlesByParam({ a, b, c, d, e });

    (this.topFilters.toArray()).forEach(elm => {
      $(elm.nativeElement).removeClass('active');
      $(elm.nativeElement).children().removeClass('dpblk');
    });
    this.toggleMobileMenu();
  }

  filterArticleByStringParam(text) {
    const firstSpace = text.indexOf(' ');
    let Id = '';
    if (firstSpace !== -1) {
      if (!isNaN(text.slice(0, firstSpace))) {
        Id = text.slice(0, firstSpace);

        const article = this.articleListStorage.ArticlesCollection.filter(a => a.ArticleNumber === Id);
        if (article.length > 0) {
          text = Id;
        }
      }
    }

    $('#elasticSearchInput').autocomplete('close');
    this.articleService.getArticlesByStringParam(text);
  }

  hasWhiteSpace(s) {
    return s.indexOf(' ') >= 0;
  }

  ShowUserDetails(userDetails) {
    console.log('ShowUserDetails', userDetails);
    if (userDetails != null && userDetails !== undefined) {
      this.deliveryAddress += (userDetails.AccountAddress != null && userDetails.AccountAddress
        !== undefined) ? userDetails.AccountAddress + ', ' : '';
      this.deliveryAddress += (userDetails.AccountZipCode != null && userDetails.AccountZipCode
        !== undefined) ? userDetails.AccountZipCode + ' ' : '';
      this.deliveryAddress += (userDetails.AccountCity != null && userDetails.AccountCity !== undefined) ? userDetails.AccountCity : '';

      // Display user details according to InvoiceToCustomerID (CustomerNoPay) and DeliverToCustomerID (CustomerNo)
      // ----------------------------------------------------------------------------------------------------------
      // In both the below cases (if part), InvoiceToCustomerID will be same as DeliverToCustomerID
      if (this.userDetail.InvoiceToCustomerID === this.userDetail.DeliverToCustomerID) {
        // If Internal user is ordering for self, then he will only get the Invoice and delivery
        if (this.userDetail.InvoiceToCustomerID === this.userDetail.AccountNumber
          && this.userDetail.DeliverToCustomerID === this.userDetail.AccountNumber) {
          this.InvoiceToUserName = this.userDetail.UserName;
          this.DeliverToUserName = this.userDetail.UserName;
          console.log('Internal user is ordering for self', 'InvoiceTo: ' +
            this.InvoiceToUserName + ' and DeliverTo: ' + this.DeliverToUserName);
        } else {
          this.InvoiceToUserName = '';
          this.DeliverToUserName = '';
          this.deliveryAddress = '';
          console.log('Internal user is ordering for external user with himself getting Invoice',
            'InvoiceTo: ' + this.InvoiceToUserName + ' and DeliverTo: ' + this.DeliverToUserName);
        }
      } else if (this.userDetail.InvoiceToCustomerID !== this.userDetail.DeliverToCustomerID) {
        if (this.userDetail.InvoiceToCustomerID === this.userDetail.AccountNumber) {
          this.InvoiceToUserName = this.userDetail.UserName;
        }

        if (this.userDetail.DeliverToCustomerID === this.userDetail.AccountNumber) {
          this.DeliverToUserName = this.userDetail.UserName;
        } else {
          this.DeliverToUserName = '';
          this.deliveryAddress = '';
        }
        console.log('Internal user is ordering for external user with external user getting Invoice',
          'InvoiceTo: ' + this.InvoiceToUserName + ' and DeliverTo: ' + this.DeliverToUserName);
      }
      // ----------------------------------------------------------------------------------------------------------
    }
  }

  get userType(): any {
    return localStorage.getItem('UserType');
  }

  ShowMoreInfoTextPopup() {
    // this.bsModalRef = this.bsModalservice.show(MoreInformationModalComponent);
    this.toggleMobileMenu();
  }

  changeArticleListView(tableView: string) {
    this.articleService.changeArticleView(tableView);
  }

  toggleMenu() {
    this.toggleDropdownMenu = !this.toggleDropdownMenu;
  }

  gotToManualOrder() {
    this.router.navigate(['/ManualOrder']);
    this.toggleMobileMenu();
  }

  gotToAutoOrder() {
    this.router.navigate(['/AutoOrder']);
    this.toggleMobileMenu();
  }

  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }

  async getRollingBannerText() {
    await this.ordersService.getNoteTextByPartNumber(environment.RolBannerPart).subscribe(response => {
      this.noteTextPart = response.IsSuccess === true ? response.ResponseData : undefined;
      console.log('NoteTextPart', this.noteTextPart);
    });
  }

  goToCart() {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      this.router.navigate(['/Cart']);
    }, 2000);
  }

  goToArticlePage() {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      this.router.navigate(['/Article']);
    }, 2000);
  }
}
