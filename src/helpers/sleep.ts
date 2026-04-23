declare const setTimeout: any;

function sleep(ms: number): Promise<void>;
function sleep<T>(ms: number, value: T): Promise<T>;
function sleep<T>(ms: number, value?: T) {
    return new Promise<T>((r) => setTimeout(() => r(value!), ms));
}

export { sleep }
