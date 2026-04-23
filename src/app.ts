import { createClient } from 'matrix-js-sdk';
import { ChatList, ChatView } from '@/components';
import { createTimers } from '@/polyfills';

type AppState = {
    currentRoomId: null | string;
    chats: any[];
    currentRoomMessages: any[];
};

export function mountApp(pageStack: any) {
    createTimers(pageStack);

    const appState: AppState = {
        currentRoomId: null,
        chats: [] as any[],
        currentRoomMessages: [] as any[],
    };

    const chatListComponent = ChatList();
    const chatViewComponent = ChatView();

    if (chatListComponent.status !== 1) {
        console.error('ChatList failed:', chatListComponent.errorString());
        return;
    }

    const chatListView = chatListComponent.createObject(pageStack);
    const chatView = chatViewComponent.createObject(pageStack);

    pageStack.push(chatListView);

    function updateChatsList() {
        appState.chats = [
            { roomId: "!room1", name: "Ubuntu Touch UA", lastMessage: "Працює нативно!", unreadCount: 5 },
            { roomId: "!room2", name: "Matrix Dev", lastMessage: "Lomiri QML", isEncrypted: true }
        ];
        chatListView.chatsData = JSON.stringify(appState.chats);
    }

    chatListView.chatSelected.connect((roomId: string, roomName: string) => {
        appState.currentRoomId = roomId;

        chatView.roomTitle = roomName;

        appState.currentRoomMessages = [
            { id: "msg1", text: "Привіт, як воно?", isMine: false },
            { id: "msg2", text: "Нормально, дебажу QML...", isMine: true }
        ];
        chatView.messagesData = JSON.stringify(appState.currentRoomMessages);
        
        pageStack.push(chatView);
    });

    chatView.backRequested.connect(() => {
        appState.currentRoomId = null;
        pageStack.pop();
    });

    chatView.sendMessage.connect((text: string) => {
        if (!appState.currentRoomId) return;
        const newMsg = { id: Date.now().toString(), text: text, isMine: true };
        appState.currentRoomMessages.push(newMsg);
        chatView.messagesData = JSON.stringify(appState.currentRoomMessages);
    });

    updateChatsList();
}
