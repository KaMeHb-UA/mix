import { WorkerThread } from '@/threads';

export async function onChatSelected(_roomId: string, roomName: string) {
    let data: string;
    chatView.roomTitle = roomName;
    try {
        data = JSON.stringify(await WorkerThread.loadChatMessages());
    } catch(e) {
        // display error message
        throw e;
    }
    chatView.messagesData = data;
}
