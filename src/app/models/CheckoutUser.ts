import { OrderRequestAddress } from './OrderRequestAddress';
import { OrderLineRequest } from './OrderLineRequest';

export class CheckoutUser {
  CustomerNo: string;
  CustomerPoNo = '';
  CustomerNoPay = '';
  OrderId = 'TO';
  Status = '';
  Error = '';
  WantedDelivaryDate: Date = new Date();
  ClaimCode = '';
  ClaimOrder = '';
  AuthorizeCode = 'WEB';
  ShipVia: string;
  IsAlternateAddress = false;
  IsNewOrder = false;
  OrderRequestAddress: OrderRequestAddress;
  OrderLineRequests: OrderLineRequest[];
}
