import { Component, OnInit, ViewChild, TemplateRef, Input, Output, EventEmitter } from '@angular/core';
import { ArticleService } from "../services/article.service";
import { Article } from "../models/article";
import { ActivatedRoute } from '@angular/router';
import { Toast, ToasterService, ToasterConfig } from 'angular2-toaster';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { Data, ArticleListStorage, NumberOnCart } from '../models/data';

@Component({
  selector: 'app-article-detail-modal',
  templateUrl: './article-detail-modal.component.html',
  styleUrls: ['./article-detail-modal.component.css']
})
export class ArticleDetailModalComponent implements OnInit {

  loading: boolean;
  articleDetail: Article;
  @Input() public content: any;
  msgTempConfirmText: string;
  @ViewChild('templateConfirm', {static: false}) private msgTempConfirmRef: TemplateRef<any>;
  private toasterService: ToasterService;
  modalRef: BsModalRef;
  afterClick: boolean = false;
  @Output() returnArticleQuantity: EventEmitter<any> = new EventEmitter();

  constructor(private articleListStorage: ArticleListStorage, private data: Data, private numberOnCart: NumberOnCart, private articleService: ArticleService, private route: ActivatedRoute, toasterService: ToasterService, private modalService: BsModalService, public modalCloseRef: BsModalRef) {
    this.toasterService = toasterService;
  }

  ngOnInit() {
    this.articleDetail = this.content;
  }

  emitArticleQuantity() {
    this.returnArticleQuantity.emit(this.articleDetail);
  }

  public toasterConfig: ToasterConfig = new ToasterConfig({
    positionClass: 'toast-center',
    animation: 'fade'
  });

  get userType(): any {
    return localStorage.getItem('UserType');
  }

  async AddArticleToCart(articleGuid) {
    this.afterClick = true;
    let storageArticle: Article = this.articleListStorage.ArticlesCollection.filter(x => x.ArticleGuid == articleGuid)[0];
    if (this.articleDetail.ArticleGuid == articleGuid) {
      this.articleDetail.NumOfQuantity += 1;

      // Show number of articles added in the cart on cart (VARUKORG) button..
      this.AddNoOfArticlesOnCartButton(this.articleDetail);

      storageArticle.NumOfQuantity = this.articleDetail.NumOfQuantity;
      if (this.userType !== 'Internal') {
        if (this.articleDetail.NumOfQuantity == parseInt(this.articleDetail.MaxQtyPart))
          this.popToastForArticlesMoreThanAvailable();
      }
      else {
        if (this.articleDetail.NumOfQuantity > parseInt(this.articleDetail.MaxQtyPart)) {
          this.msgTempConfirmText = "Du försöker beställa fler än maxantalet " + this.articleDetail.MaxQtyPart + " för denna artikel. Vill du ändå beställa " + this.articleDetail.NumOfQuantity + "?";
          this.openModal(this.msgTempConfirmRef);
        }
      }

      // Reflect immediate change in quantity into the article (parent) page..
      this.emitArticleQuantity();
    }
  }

  async saveArticleInfo(article: Article) {

    if (this.afterClick == true) {
      let art: Article = this.articleDetail;

      // Show number of articles added in the cart on cart (VARUKORG) button..
      this.AddNoOfArticlesOnCartButton(this.articleDetail);

      await this.saveArticlestoCart(art.ArticleGuid, art.NumOfQuantity, art.ArticleNumber);

      console.log("Save Quan: ", this.articleDetail.NumOfQuantity);
      // Reflect immediate change in quantity into the article (parent) page..
      this.emitArticleQuantity();

      this.afterClick = false;
    }
  }

  async DeleteArticleFromCart(articleGuid) {
    this.afterClick = true;
    let storageArticle: Article = this.articleListStorage.ArticlesCollection.filter(x => x.ArticleGuid == articleGuid)[0];
    if (this.articleDetail.ArticleGuid == articleGuid) {
      if (this.articleDetail.NumOfQuantity > 0) {
        this.articleDetail.NumOfQuantity -= 1;
        storageArticle.NumOfQuantity = this.articleDetail.NumOfQuantity;
      }
      // Show number of articles added in the cart on cart (VARUKORG) button..
      this.AddNoOfArticlesOnCartButton(this.articleDetail);

      if (this.articleDetail.NumOfQuantity < 0) {
        this.articleDetail.NumOfQuantity = 0;
        storageArticle.NumOfQuantity = 0;
      }
      console.log("Delete Quan: ", this.articleDetail.NumOfQuantity);
      // Reflect immediate change in quantity into the article (parent) page..
      this.emitArticleQuantity();
    }
  }

  async UpdateArticleToCart(articleGuid, quantity, event) {
    this.afterClick = true;
    for (var i = 0; i < this.articleListStorage.ArticlesCollection.length; i++) {
      if (this.articleListStorage.ArticlesCollection[i].ArticleGuid == this.articleDetail.ArticleGuid) {

        if (parseInt(quantity) > parseInt(this.articleDetail.MaxQtyPart)) {
          if (this.userType !== 'Internal') {
            event.target.value = parseInt(this.articleDetail.MaxQtyPart);
            this.articleDetail.NumOfQuantity = parseInt(this.articleDetail.MaxQtyPart);
            this.articleListStorage.ArticlesCollection[i].NumOfQuantity = parseInt(this.articleDetail.MaxQtyPart);
            this.popToastError();
          } else {
            this.articleDetail.NumOfQuantity = parseInt(quantity);
            this.articleListStorage.ArticlesCollection[i].NumOfQuantity = parseInt(quantity);
          }
        } else {
          this.articleDetail.NumOfQuantity = parseInt(quantity);
          this.articleListStorage.ArticlesCollection[i].NumOfQuantity = parseInt(quantity);
        }

        // Show number of articles added in the cart on cart (VARUKORG) button..
        this.AddNoOfArticlesOnCartButton(this.articleDetail);

        console.log("Update Quan: ", this.articleDetail.NumOfQuantity);
        // Reflect immediate change in quantity into the article (parent) page..
        this.emitArticleQuantity();
      }
    }
  }

  async inputFocusOut(event: any, article: Article) {
    if (event.target.value === '') {
      event.target.value = 0;
    } else {
      // Show number of articles added in the cart on cart (VARUKORG) button..
      this.AddNoOfArticlesOnCartButton(article);
      if (parseInt(event.target.value) > parseInt(article.MaxQtyPart)) {
        this.msgTempConfirmText = "Du försöker beställa fler än maxantalet " + article.MaxQtyPart + " för denna artikel. Vill du ändå beställa " + article.NumOfQuantity + "?";
        this.openModal(this.msgTempConfirmRef);
      }
      else {
        this.articleDetail = article;
        this.saveArticleInfo(article);
      }

      console.log("Focus Quan: ", this.articleDetail.NumOfQuantity);
      // Reflect immediate change in quantity into the article (parent) page..
      this.emitArticleQuantity();
    }
  }

  async saveArticlestoCart(articleGuid, numOfQuantity, articleNumber) {
    await this.articleService.saveArticlestoCart(articleGuid, numOfQuantity, articleNumber).subscribe(response => {
    });
  }
  
  popToastError() {
    var toast: Toast = {
      type: 'error',
      body: 'Du försöker beställa fler än maxantalet för denna artikel. Ditt antal har ändrats.',
    };
    this.toasterService.pop(toast);
  }

  popToastForArticlesMoreThanAvailable() {
    var toast: Toast = {
      type: 'error',
      body: 'Nu har du nått max-antalet för denna artikel.'
    };
    this.toasterService.pop(toast);
  }

  AddNoOfArticlesOnCartButton(currentArticle: Article) {
    if (this.numberOnCart.ArticlesListColln.length > 0) {
      let articleNumOnCart: Article = this.numberOnCart.ArticlesListColln.filter(x => x.ArticleNumber == currentArticle.ArticleNumber)[0];
      if (articleNumOnCart !== undefined) {
        // If article is already existing the cart, then no need to add it again..
        // If arleady existing article is having quantity 0, then remove it..
        if (currentArticle.NumOfQuantity === 0) {
          let indexForRemoveArticle: number = this.numberOnCart.ArticlesListColln.findIndex(x => x.ArticleNumber == currentArticle.ArticleNumber);
          this.numberOnCart.ArticlesListColln.splice(indexForRemoveArticle, 1);
        }
      }
      else {
        if (currentArticle.NumOfQuantity > 0) {
          this.numberOnCart.ArticlesListColln.push(currentArticle);
        }
      }
    }
    else {
      if (currentArticle.NumOfQuantity > 0) {
        this.numberOnCart.ArticlesListColln.push(currentArticle);
      }
    }
    this.numberOnCart.articleNumberOnCart = this.numberOnCart.ArticlesListColln.length;
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm smallPopup modal-dialog-centered' });
  }

  confirm(): void {
    // Show number of articles added in the cart on cart (VARUKORG) button..
    this.AddNoOfArticlesOnCartButton(this.articleDetail);

    this.saveArticleInfo(this.articleDetail);

    // Reflect immediate change in quantity into the article (parent) page..
    this.emitArticleQuantity();
    this.modalRef.hide();
  }

  decline(): void {
    for (var i = 0; i < this.articleListStorage.ArticlesCollection.length; i++) {
      if (this.articleListStorage.ArticlesCollection[i].ArticleGuid == this.articleDetail.ArticleGuid) {
        this.articleListStorage.ArticlesCollection[i].NumOfQuantity = parseInt(this.articleListStorage.ArticlesCollection[i].MaxQtyPart);
        this.articleDetail.NumOfQuantity = parseInt(this.articleDetail.MaxQtyPart);

        // Show number of articles added in the cart on cart (VARUKORG) button..
        this.AddNoOfArticlesOnCartButton(this.articleDetail);

        this.saveArticlestoCart(this.articleDetail.ArticleGuid, this.articleDetail.NumOfQuantity, this.articleDetail.ArticleNumber);

        // Reflect immediate change in quantity into the article (parent) page..
        this.emitArticleQuantity();
      }
    }

    this.modalRef.hide();
  }
}
