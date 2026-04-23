export function createResolveablePromise<T>() {
    let resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void;
    const promise = new Promise<T>(($, _) => {
        resolve = $;
        reject = _;
    });
    // @ts-expect-error Promises/A+ invokes callbacks on creation so both resolve and reject will be already available here
    return Object.assign(promise, { resolve, reject });
}
