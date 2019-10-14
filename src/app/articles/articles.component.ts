import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { ArticleService } from '../services/article.service';
import { Article, Campaigns } from '../models/Article';
import { Data, ArticleListStorage, NumberOnCart } from '../models/data';
import { ToasterService, ToasterConfig, Toast } from 'angular2-toaster';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import 'rxjs/add/operator/pairwise';
import { Router, NavigationStart } from '@angular/router';
import {ArticleDetailModalComponent} from '../article-detail-modal/article-detail-modal.component';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css'],
  outputs: ['headerLoaded:change']
})
export class ArticlesComponent implements OnInit {

  constructor(private numberOnCart: NumberOnCart, private data: Data, private cdRef: ChangeDetectorRef,
    private articleListStorage: ArticleListStorage, private router: Router, private articleService: ArticleService,
    toasterService: ToasterService, private modalService: BsModalService) {
    this.toasterService = toasterService;
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationStart) {
        this.loading = true;

        if (e.url === '/Article') {
          this.initialiseInvites(e);
        }
      }
    });
    this.articleService.getArticlesByParam({});
  }

  get userType(): any {
    return localStorage.getItem('UserType');
  }

  currentArticleRefGuid: any;
  articleDetail: Article[];
  originalArticleList: Article[];
  nextArticlesList: Article[];
  compaignDetail: Campaigns[];
  profileDetail: any;
  productFamilyDetail: any;
  loading: boolean;
  showArticleTblView: string;
  navigationSubscription;
  filterArticlesByParameter;
  filterArticlesByString;
  currentPage: '/Article';
  prevPage: any;
  direction = '';
  modalRef: BsModalRef;
  private toasterService: ToasterService;
  @ViewChild('templateConfirm', { static: false }) private msgTempConfirmRef: TemplateRef<any>;
  msgTempConfirmText: string;
  afterClick = false;
  @Output() returnArticleQuantity: EventEmitter<any> = new EventEmitter();
  viewMoreCount = 50;
  pageLoadArticlesCount = 50;
  showViewMoreButton = false;

  public toasterConfig: ToasterConfig = new ToasterConfig({
    positionClass: 'toast-center',
    animation: 'fade'
  });

  trackByFunction(index, article: Article) {
    return article.ArticleNumber;
  }

  //Opens modal popup for article detail on article image click
  openArticleDetailModal(article: Article) {
    this.modalRef = this.modalService.show(ArticleDetailModalComponent, {
      initialState: {
        content: article
      },
      // class: 'modal-lg articlePopup',
      backdrop: 'static',
      keyboard: false
    });
    this.returnArticleQuantity = this.modalRef.content.returnArticleQuantity.subscribe(result => {
      this.originalArticleList.filter(x => x.ArticleNumber === result.ArticleNumber)[0].NumOfQuantity = parseInt(result.NumOfQuantity);
      this.getArticleDetails();
      this.cdRef.detectChanges();
    });
  }

  ngOnInit() {
    this.articleDetail = [];
    this.loading = true;
    this.originalArticleList = this.articleListStorage.ArticlesCollection;
    this.getArticleDetails();
    this.getDataBaseUpdateTime();
    this.articleService.currentArticleTableView.subscribe(x => { this.showArticleTblView = x; });

    // Red dropdown filters
    this.filterArticlesByParameter = this.articleService.filterArticlesByParameter.subscribe(x => {
      if (!(Object.keys(x).length === 0 && x.constructor === Object)) {
         this.ShowArticles(x['couponFilter'], x['campaignFilter'], x['productFamilyFilter'], x['profileFilter'], x['searchArticle']);
      }
    });

    // Search filter
    this.filterArticlesByString = this.articleService.filterArticlesByString.subscribe(x => {
      if (x !== '') {
        this.getArticlesBySearch(x);
      }
    });
  }

  initialiseInvites(e) {
    this.articleDetail = [];
    this.originalArticleList = this.articleListStorage.ArticlesCollection;

    if (e.url === '/Article') {
      this.getArticleDetails();
    }
     this.getUpdateForSaldo();
  }

  ngOnDestroy() {
    this.filterArticlesByParameter.unsubscribe();
    this.filterArticlesByString.unsubscribe();
    this.returnArticleQuantity.unsubscribe();

    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  async getDataBaseUpdateTime() {
    await this.articleService.getDataBaseUpdateTime().subscribe(response => {
      console.log('getDataBaseUpdateTime', response.ResponseData);
      if (parseInt(response.ResponseData) >= 10) {
        this.getUpdateForSaldo();
      }
    });
  }

  async getUpdateForSaldo() {

    await this.articleService.getUpdateForSaldo().subscribe(response => {

      if (response.IsSuccess) {
        this.loading = false;
        const updateArticles: Article[] = response.ResponseData;
        if (updateArticles.length > 0) {
          for (let i = 0; i < this.articleListStorage.ArticlesCollection.length; i++) {
            for (let j = 0; j < updateArticles.length; j++) {
              if (this.articleListStorage.ArticlesCollection[i].ArticleNumber === updateArticles[j].ArticleNumber) {
                this.articleListStorage.ArticlesCollection[i].Stock = updateArticles[j].Stock;
              }
            }
            if (i === this.articleListStorage.ArticlesCollection.length) {
              this.getArticleDetails();
              this.loading = false;
            }
          }
        }
      } else {
        console.log('Error for update');
      }
    }, error => {
      console.log('Error for update', error);
    });
  }

  getArticleDetails() {
    console.log('OriginalArticleList', this.originalArticleList);

    var endIndex = 0;
    if (this.originalArticleList.length > 50) {
      this.showViewMoreButton = true;
      endIndex = this.pageLoadArticlesCount;
    }
    else if(this.viewMoreCount >= this.originalArticleList.length || this.originalArticleList.length <= 50) {
      this.showViewMoreButton = false;
      endIndex = this.originalArticleList.length;
    }

    let articleList = this.originalArticleList.map(x => Object.assign({}, x));

    this.articleDetail = articleList.splice(0, endIndex);

    console.log("LoadArticlesForTheFirstTime", this.articleDetail);

    this.loading = false;
  }

  // It should be an aws elastic search
  async getArticlesBySearch(searchArticle: string) {
    this.loading = true;
    this.articleDetail = [];
    if (!isNaN(parseInt(searchArticle))) {
      this.originalArticleList = this.articleListStorage.ArticlesCollection.filter(x => x.ArticleNumber === searchArticle);
    } else {
      this.originalArticleList = this.articleListStorage.ArticlesCollection.filter(x =>
        x.ArticleDescription.toLowerCase().includes(searchArticle.toLowerCase()));
    }
    this.getArticleDetails();
  }

  async ShowArticles(couponFilter?, campaignFilter?, productFamilyFilter?, profileFilter?, searchArticle?) {
    this.loading = true;
    await this.articleService.getArticles(couponFilter, campaignFilter, productFamilyFilter,
      profileFilter, searchArticle).subscribe(response => {
        this.loading = false;
        this.articleDetail = [];
        this.originalArticleList = response.IsSuccess === true ? response.ResponseData : '';
        this.getArticleDetails();
      });
  }

  async saveArticlestoCart(articleGuid, numOfQuantity, articleNumber) {
    await this.articleService.saveArticlestoCart(articleGuid, numOfQuantity, articleNumber).subscribe(response => {

    });
  }

  AddArticleToCart(articleGuid) {
    this.afterClick = true;
    const storageArticle: Article = this.articleListStorage.ArticlesCollection.filter(x => x.ArticleGuid === articleGuid)[0];
    const currentArticle: Article = this.articleDetail.filter(x => x.ArticleGuid === articleGuid)[0];
    currentArticle.NumOfQuantity += 1;

    storageArticle.NumOfQuantity = currentArticle.NumOfQuantity;
    if (this.userType !== 'Internal') {
      if (currentArticle.NumOfQuantity === parseInt(currentArticle.MaxQtyPart)) {
        this.popToastForArticlesMoreThanAvailable();
      }

      this.saveArticleInfo(articleGuid);
    } else {
      if (currentArticle.NumOfQuantity > parseInt(currentArticle.MaxQtyPart)) {
        this.msgTempConfirmText = 'Du försöker beställa fler än maxantalet ' + currentArticle.MaxQtyPart + ' för denna artikel. Vill du ändå beställa ' + currentArticle.NumOfQuantity + '?';
        this.currentArticleRefGuid = articleGuid;
        this.openModal(this.msgTempConfirmRef);
      }
    }
  }

  async saveArticleInfo(articleGuid) {
    if (this.afterClick === true) {
      const currentArticle: Article = this.articleDetail.filter(x => x.ArticleGuid === articleGuid)[0];

      // Show number of articles added in the cart on cart (VARUKORG) button..
      this.AddNoOfArticlesOnCartButton(currentArticle);

      await this.saveArticlestoCart(articleGuid, currentArticle.NumOfQuantity, currentArticle.ArticleNumber);
      this.afterClick = false;
    }
  }

  AddNoOfArticlesOnCartButton(currentArticle: Article) {
    if (this.numberOnCart.ArticlesListColln.length > 0) {
      const articleNumOnCart: Article = this.numberOnCart.ArticlesListColln.filter(x => x.ArticleNumber === currentArticle.ArticleNumber)[0];
      if (articleNumOnCart !== undefined) {
        // If article already exists in the cart, then no need to add it again..
        // If arleady existing article is having quantity 0, then remove it..
        if (currentArticle.NumOfQuantity === 0) {
          const indexForRemoveArticle: number = this.numberOnCart.ArticlesListColln.findIndex(x => x.ArticleNumber === currentArticle.ArticleNumber);
          this.numberOnCart.ArticlesListColln.splice(indexForRemoveArticle, 1);
        }
      } else {
        if (currentArticle.NumOfQuantity > 0) {
          this.numberOnCart.ArticlesListColln.push(currentArticle);
        }
      }
    } else {
      if (currentArticle.NumOfQuantity > 0) {
        this.numberOnCart.ArticlesListColln.push(currentArticle);
      }
    }
    this.numberOnCart.articleNumberOnCart = this.numberOnCart.ArticlesListColln.length;
  }

  DeleteArticleFromCart(articleGuid) {
    this.afterClick = true;
    const storageArticle: Article = this.articleListStorage.ArticlesCollection.filter(x => x.ArticleGuid === articleGuid)[0];
    const currentArticle: Article = this.articleDetail.filter(x => x.ArticleGuid === articleGuid)[0];
    currentArticle.NumOfQuantity -= 1;

    // Show number of articles added in the cart on cart (VARUKORG) button..
    this.AddNoOfArticlesOnCartButton(currentArticle);

    storageArticle.NumOfQuantity = currentArticle.NumOfQuantity;
    if (currentArticle.NumOfQuantity <= 0) {
      storageArticle.NumOfQuantity = 0;
      currentArticle.NumOfQuantity = 0;
      this.saveArticleInfo(articleGuid);
    }
  }

  async inputFocusOut(event: any, article: Article) {
    console.log('event.target.value', event.target.value);
    if (event.target.value === '') {
      event.target.value = 0;
    } else {
      // Show number of articles added in the cart on cart (VARUKORG) button..
      this.AddNoOfArticlesOnCartButton(article);
      if (parseInt(event.target.value) > parseInt(article.MaxQtyPart)) {
        this.msgTempConfirmText = 'Du försöker beställa fler än maxantalet ' + article.MaxQtyPart + ' för denna artikel. Vill du ändå beställa ' + article.NumOfQuantity + '?';
        this.openModal(this.msgTempConfirmRef);
      } else {
        this.saveArticleInfo(article.ArticleGuid);
      }
    }
  }

  async UpdateArticleToCart(articleGuid, quantity, event) {
    this.afterClick = true;
    this.currentArticleRefGuid = articleGuid;
    for (let i = 0; i < this.articleDetail.length; i++) {
      if (this.articleDetail[i].ArticleGuid === articleGuid) {
        if (parseInt(quantity) > parseInt(this.articleDetail[i].MaxQtyPart)) {
          if (this.userType !== 'Internal') {
            event.target.value = parseInt(this.articleDetail[i].MaxQtyPart);
            this.articleDetail[i].NumOfQuantity = parseInt(this.articleDetail[i].MaxQtyPart);
            this.articleListStorage.ArticlesCollection.filter(x => x.ArticleNumber === this.articleDetail[i].ArticleNumber)[0].NumOfQuantity = parseInt(this.articleDetail[i].MaxQtyPart);
            this.popToastError();
          } else {
            this.articleDetail[i].NumOfQuantity = parseInt(quantity);
            this.articleListStorage.ArticlesCollection.filter(x => x.ArticleNumber === this.articleDetail[i].ArticleNumber)[0].NumOfQuantity = parseInt(quantity);
          }
        } else {
          this.articleDetail[i].NumOfQuantity = parseInt(quantity);
          this.articleListStorage.ArticlesCollection.filter(x => x.ArticleNumber === this.articleDetail[i].ArticleNumber)[0].NumOfQuantity = parseInt(quantity);
        }

        // Show number of articles added in the cart on cart (VARUKORG) button..
        this.AddNoOfArticlesOnCartButton(this.articleDetail[i]);
      }
    }
  }

  popToastError() {
    const toast: Toast = {
      type: 'error',
      body: 'Du försöker beställa fler än maxantalet för denna artikel. Ditt antal har ändrats.',
    };
    this.toasterService.pop(toast);
  }

  popToastForArticlesMoreThanAvailable() {
    const toast: Toast = {
      type: 'error',
      body: 'Nu har du nått max-antalet för denna artikel.'
    };
    this.toasterService.pop(toast);
  }

  openModal(template: TemplateRef<any>) {
    console.log("Welcome text", this.msgTempConfirmText);
    this.modalRef = this.modalService.show(template, { class: 'modal-sm smallPopup modal-dialog-centered' });
  }

  confirm(): void {
    const currentArticle: Article = this.articleDetail.filter(x => x.ArticleGuid === this.currentArticleRefGuid)[0];
    // Show number of articles added in the cart on cart (VARUKORG) button..
    this.AddNoOfArticlesOnCartButton(currentArticle);

    this.saveArticleInfo(currentArticle.ArticleGuid);
    this.modalRef.hide();
  }

  async decline() {
    const storageArticle: Article = this.articleListStorage.ArticlesCollection.filter(x => x.ArticleGuid === this.currentArticleRefGuid)[0];
    const currentArticle: Article = this.articleDetail.filter(x => x.ArticleGuid === this.currentArticleRefGuid)[0];
    currentArticle.NumOfQuantity = parseInt(currentArticle.MaxQtyPart);
    storageArticle.NumOfQuantity = currentArticle.NumOfQuantity;

    // Show number of articles added in the cart on cart (VARUKORG) button..
    this.AddNoOfArticlesOnCartButton(currentArticle);

    await this.saveArticlestoCart(this.currentArticleRefGuid, currentArticle.NumOfQuantity, currentArticle.ArticleNumber);
    this.modalRef.hide();
  }

  ViewMoreArticles() {
    this.articleDetail = this.articleDetail.concat(this.articleListStorage.ArticlesCollection.slice(this.viewMoreCount, this.viewMoreCount + 50));
    this.viewMoreCount += 50;
    this.cdRef.detach();
    this.cdRef.detectChanges();
    this.cdRef.reattach();

    if (this.viewMoreCount >= this.articleListStorage.ArticlesCollection.length)
      this.showViewMoreButton = false;
    else 
      this.showViewMoreButton = true;
  }
}

