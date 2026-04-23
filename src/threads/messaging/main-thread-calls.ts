import { v4 as uuid } from 'uuid';
import { createResolveablePromise } from '@/helpers';
import { type MainThread as ThreadNamespace } from './main-thread';

declare const WorkerScript: any;

export const mainThreadCalls: Record<string, Promise<any> & {
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
}> = {};

function callMainThread(method: string, args: any[]) {
    const id = uuid();
    mainThreadCalls[id] = createResolveablePromise();
    WorkerScript.sendMessage({ id, method, args });
    return (async () => await mainThreadCalls[id])();
}

export const MainThread: ThreadNamespace = new Proxy({} as any, {
    get: (_, method: string) => (...args: any[]) => callMainThread(method, args),
});
