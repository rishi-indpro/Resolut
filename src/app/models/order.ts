import { Article } from './article';

export class Order {
  OrderId: string;
  OrderName: string;
  OrderDate: string;
  OrderStatus: string;
  OrderStatusTranslate: string;
  OrderAuthorizeCode: string;
  OrderRemark: string;
  OrderShipViaDescription: string;
  OrderPackageNumber: string;
  IsMultiplePackageNumber: boolean;
  ClaimOrder: string;
  Articles: Article[];
}

export class NoteTextPart {
  PartNumber: string;
  Cotract: string;
  NoteText: string;
}
