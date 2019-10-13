import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToasterModule } from 'angular2-toaster';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalModule, PopoverModule } from 'ngx-bootstrap';
import { AppComponent } from './app.component';
import { UserInfoService } from './services/user-info.service';
import { ArticleService } from './services/article.service';
import { OrdersService } from './services/orders.service';
import { BaseService } from './services/base.service';
import { UserAuthService } from './services/user-auth.service';
import { ShippingService } from './services/shipping.service';
import { ArticlesComponent } from './articles/articles.component';
import { AppRoutingModule } from './app-routing.module';
import { Data, ArticleListStorage, LoggedInUserInfo, NumberOnCart } from './models/data';
import { CacheInterceptor } from './cache-interceptor';
import { HeaderComponent } from './shared/header/header.component';
import { LoaderComponent } from './shared/loader/loader.component';
import { ArticleDetailModalComponent } from './article-detail-modal/article-detail-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    ArticlesComponent,
    HeaderComponent,
    LoaderComponent,
    ArticleDetailModalComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    ModalModule.forRoot(),
    PopoverModule.forRoot(),
    ToasterModule.forRoot(),

    BrowserAnimationsModule,


    ReactiveFormsModule,
  ],
  providers: [
    UserInfoService,
    BaseService,
    ArticleService,
    OrdersService,
    UserAuthService,
    ShippingService,
    ArticleListStorage,
    Data,
    LoggedInUserInfo,
    NumberOnCart,
    { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ArticleDetailModalComponent
  ]
})
export class AppModule { }
