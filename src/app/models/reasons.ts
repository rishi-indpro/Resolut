export class Reasons {
  ReasonGuid: string;
  MainReason: string;
  SubReasons: SubReason[];
}

export class SubReason {
  SubReasonGuid: string;
  SubReason: string;
  ClaimCode: string;
  MessageId: string;
}

export class MessageText {
  MessageId = '';
  Header1 = '';
  Header2 = '';
  Text = '';
}
