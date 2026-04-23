import { v4 as uuid } from 'uuid';
import { createResolveablePromise } from '@/helpers';
import * as app from '@/app.exported';
import { type WorkerThread as ThreadNamespace } from './worker-thread';

const workerThreadCalls: Record<string, Promise<any> & {
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
}> = {};

let sendMessage: any;

export function saveMessageSendingFunction(messageSendingFunction: any) {
    sendMessage = messageSendingFunction;
}

function callWorkerThread(method: string, args: any[]) {
    const id = uuid();
    workerThreadCalls[id] = createResolveablePromise();
    sendMessage({ id, method, args });
    return (async () => await workerThreadCalls[id])();
}

export const WorkerThread: ThreadNamespace = new Proxy({} as any, {
    get: (_, method: string) => (...args: any[]) => callWorkerThread(method, args),
});

export async function onMessageToMainThread({ id, method, args, result, error }: any) {
    if (!id) {
        console.log(`Can't process incoming message without id`);
        return;
    }
    if (method) {
        if (typeof (app as any)[method] !== 'function') {
            console.log(`Can't find exported function "${method}" in worker`);
            return;
        }
        if (!args || !Array.isArray(args)) {
            console.log(`Can't invoke worker function "${method}" with invalid args: ${JSON.stringify(args)}`);
            return;
        }
        try {
            sendMessage({ id, result: await (app as any)[method](...args) });
        } catch(error) {
            sendMessage({ id, error });
        }
    } else if (error) {
        const promise = workerThreadCalls[id];
        if (!promise) return;
        delete workerThreadCalls[id];
        promise.reject(error);
    } else {
        const promise = workerThreadCalls[id];
        if (!promise) return;
        delete workerThreadCalls[id];
        promise.resolve(result);
    }
}
