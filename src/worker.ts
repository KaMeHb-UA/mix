import * as app from '@/app.worker';
import { mainThreadCalls } from '@/threads/messaging/main-thread-calls';

declare const WorkerScript: any;

WorkerScript.onMessage = async ({ id, method, args, result, error }: any) => {
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
            WorkerScript.sendMessage({ id, result: await (app as any)[method](...args) });
        } catch(error) {
            WorkerScript.sendMessage({ id, error });
        }
    } else if (error) {
        const promise = mainThreadCalls[id];
        if (!promise) return;
        delete mainThreadCalls[id];
        promise.reject(error);
    } else {
        const promise = mainThreadCalls[id];
        if (!promise) return;
        delete mainThreadCalls[id];
        promise.resolve(result);
    }
}
