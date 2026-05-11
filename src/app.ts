import { ChatList, ChatView, setChatListView, setChatView } from '@/ui';
import { WorkerThread, saveMessageSendingFunction } from '@/threads';
import { assignGlobals } from '@/threads/main-polyfills';
import { onChatSelected } from '@/chat';

type AppState = {
    currentRoomId: null | string;
    chats: any[];
    currentRoomMessages: any[];
};

export function mountApp(pageStack: any, sendMessage: (message: any) => void) {
    assignGlobals();
    saveMessageSendingFunction(sendMessage);

    const appState: AppState = {
        currentRoomId: null,
        chats: [] as any[],
        currentRoomMessages: [] as any[],
    };

    const chatListComponent = ChatList();
    const chatViewComponent = ChatView();

    const chatListView = chatListComponent.createObject(pageStack);
    const chatView = chatViewComponent.createObject(pageStack);

    pageStack.push(chatListView);

    setChatListView(chatListView);
    setChatView(chatView);

    chatListView.chatSelected.connect(async (roomId: string, roomName: string) => {
        try {
            await onChatSelected(roomId, roomName);
            pageStack.push(chatView);
        } catch(e) {}
    });

    chatView.backRequested.connect(() => pageStack.pop());

    chatView.sendMessage.connect((text: string) => {
        if (!appState.currentRoomId) return;
        const newMsg = { id: Date.now().toString(), text: text, isMine: true };
        appState.currentRoomMessages.push(newMsg);
        chatView.messagesData = JSON.stringify(appState.currentRoomMessages);
    });

    // Launch main function in a separate thread
    WorkerThread.main();
}

export { onMessageToMainThread as onMessage } from '@/threads';
