import type { ChatListEntry } from '@/chat';

let chatListView: any;

export function setChatListView(view: any) {
    chatListView = view;
}

export function setChatList(chats: ChatListEntry[]) {
    chatListView.chatsData = JSON.stringify(chats);
}
