import { sleep } from '@/helpers';
import * as polyfills from '@/threads/worker-polyfills';
import { MainThread } from '@/threads';
import { AuthState } from '@/constants';
import type { ChatListEntry, ChatMessage } from '@/chat';

Object.assign(globalThis, polyfills);

export async function loadChats(): Promise<ChatListEntry[]> {
    await sleep(3_000);
    return [
        {
            roomId: '!room1',
            name: 'Ubuntu Touch UA',
            lastMessage: 'Та просувається по-трохи',
            lastMessageId: '2',
            lastSender: 'Я',
            isEncrypted: false,
            unreadCount: 5,
        },
        {
            roomId: '!room2',
            name: 'Matrix Dev',
            lastMessage: 'Та просувається по-трохи',
            lastMessageId: '2',
            lastSender: 'Я',
            isEncrypted: true,
            unreadCount: 0,
        },
    ];
}

export async function loadChatMessages(): Promise<ChatMessage[]> {
    await sleep(500);
    return [
        { id: '1', senderId: 'none', senderName: 'Хтось', isMe: false, body: 'Ну шо, як воно?' },
        { id: '2', senderId: 'none', senderName: 'Я', isMe: true, body: 'Та просувається по-трохи' },
    ];
}

/**
 * Is invoked on app start
 */
export async function main() {
    await sleep(3_000);
    await MainThread.authStateChanged(AuthState.AUTHENTICATED);
}
