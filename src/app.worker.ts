import { sleep } from '@/helpers';
import * as polyfills from '@/threads/worker-polyfills';

Object.assign(globalThis, polyfills);

/**
 * Is invoked on app start
 */
export async function main() {
    console.log('Started worker main function');
    const one = await sleep(10_000, 1);
    console.log('Sleeped 10 seconds. Result:', one);
}
