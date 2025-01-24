export interface MessageDTO {
  id: number;
  username: string;
  content: string;
}

export interface MessageForm{
  content: string;
  userId: number;
  conversationId: number;
}
