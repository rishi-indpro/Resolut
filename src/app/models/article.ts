export class Article {
  ArticleGuid: string;
  ArticleDescription: string;
  ArticleNumber: string;
  Price: number;
  Unit: string;
  MaxQtyPart: string;
  Stock: number;
  AllowedOrderBy: string;
  ThumbnailPath: string;
  LowresPath: string;
  DetailedPath: string;
  DetailedDescription: string;
  NumOfQuantity: number;
  TotalAmount: number;
  Profile: string;
  ProductFamily: string;
  IsSelected: boolean;
  PlannedDelivaryDate?: Date = null;
  Contract: string;
}

export class Campaigns {
  Campaign: string;
  CampaignDescription: string;
}



