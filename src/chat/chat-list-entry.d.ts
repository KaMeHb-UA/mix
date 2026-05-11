export interface ChatListEntry {
    roomId: string;
    name: string;
    lastMessage: string;
    lastMessageId: string;
    lastSender: string;
    isEncrypted: boolean;
    unreadCount: number;
}
