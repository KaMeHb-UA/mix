export interface ChatMessage {
    id: string;
    senderId: string;
    senderName: string;
    isMe: boolean;
    body: string;
}
