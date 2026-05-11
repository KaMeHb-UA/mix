import { AuthState } from '@/constants';
import { sleep as sleepMT } from '@/helpers';
import { WorkerThread } from '@/threads';
import { setChatList } from '@/ui';

export async function sleep(ms: number) {
    return await sleepMT(ms);
}

export async function authStateChanged(state: AuthState) {
    if (state === AuthState.AUTHENTICATED) {
        setChatList(await WorkerThread.loadChats());
    }
}
