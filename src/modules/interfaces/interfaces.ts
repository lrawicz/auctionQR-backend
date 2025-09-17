export interface MessageContent {
  amount: number;
  url: string;
  timestamp: Date;
  address: string;
}
export interface Message {
  message?: MessageContent;
  meta: string;
  room: string;
}