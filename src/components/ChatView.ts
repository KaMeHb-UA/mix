import { createComponent } from './@component';

export interface ChatView {
    //
}

export function ChatView() {
    return createComponent<ChatView>('ChatView.qml');
}
