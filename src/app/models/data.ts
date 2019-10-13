import { Article, Campaigns } from './article';
import { User } from './user';

export class Data {
  public Storage: any;
  public headerLoaded: boolean;
  public PrevPage: any;
  public ReturnArticleStorage: any;
  public ReturnArticleTableView: boolean;
}

export class ArticleListStorage {
  public ArticlesCollection: Article[];
  public couponDetailMatchbundetMaterial: Article[];
  public couponDetailNeutralaKuponger: Article[];
  public CouponDetailKvittorullar: Article[];
  public compaignDetail: Campaigns[];
  public profileDetail: any;
  public productFamilyDetail: any;
}

export class LoggedInUserInfo {
  public user: User;
}

export class NumberOnCart {
  public ArticlesListColln: Article[] = [];
  public articleNumberOnCart: any;
}
