export interface MessageContent {
  amount: number;
  url: string;
  timestamp: Date;
  address: string;
}
export interface Message {
  content?: MessageContent;
  meta: string;
  room: string;
}