import { createComponent } from './@component';

export interface ChatList {
    //
}

export function ChatList() {
    return createComponent<ChatList>('ChatList.qml');
}
