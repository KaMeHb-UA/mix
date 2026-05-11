type Promisified<T> = T extends PromiseLike<infer R> ? Promise<R> : Promise<T>;

export type Namespace<T> = {
    [x in keyof T]: T[x] extends (...args: infer A) => any ? (...args: A) => Promisified<ReturnType<T[x]>> : never;
};
