// @ts-ignore
import getRandomValues from 'polyfill-crypto.getrandomvalues';

declare var crypto: any;

export function assignGlobals() {
    crypto.getRandomValues = getRandomValues;
}
