import type { ChatMessage } from '@/chat';

let chatView: any;

export function setChatView(view: any) {
    chatView = view;
}

export function setMessages(messages: ChatMessage[]) {
    chatView.messagesData = JSON.stringify(messages);
}
