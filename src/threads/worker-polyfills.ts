// @ts-ignore
import getRandomValues from 'polyfill-crypto.getrandomvalues';
import { MainThread } from '@/threads';

const timers: Record<string, () => void> = {};

function createTimerId() {
    while (true) {
        const id = Math.random();
        if (!timers[id]) return id;
    }
}

export function setTimeout(callback: (...args: any[]) => any, delay: number, ...args: any[]) {
    let cancel = false;
    const id = createTimerId();
    const strId = String(id);
    timers[strId] = () => cancel = true;
    MainThread.sleep(delay || 10).then(() => {
        delete timers[strId];
        if (!cancel) callback(...args);
    });
    return id;
}

export function setInterval(callback: (...args: any[]) => any, delay: number, ...args: any[]) {
    let cancel = false;
    const id = createTimerId();
    const strId = String(id);
    timers[strId] = () => cancel = true;
    MainThread.sleep(delay || 10).then(async () => {
        while (true) {
            if (!cancel) callback(...args);
            await MainThread.sleep(delay || 10);
        }
    });
    return id;
}

function clearTimeout(id: number) {
    const strId = String(id);
    if (timers[strId]) {
        delete timers[strId];
        timers[strId]();
    }
}

export const crypto = {
    getRandomValues,
}

export { clearTimeout, clearTimeout as clearInterval }
