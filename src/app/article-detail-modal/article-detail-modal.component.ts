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

  async AddArticleToCart(articleGuid) {
    this.afterClick = true;
    let storageArticle: Article = this.articleListStorage.ArticlesCollection.filter(x => x.ArticleGuid == articleGuid)[0];
    if (this.articleDetail.ArticleGuid == articleGuid) {
      this.articleDetail.NumOfQuantity += 1;

      // Show number of articles added in the cart on cart (VARUKORG) button..
      this.utilsService.AddNoOfArticlesOnCartButton(this.articleDetail);

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
}
