import * as WorkerThread from '@/app.worker';

type Namespace<T> = {
    [x in keyof T]: T[x];
};

export type WorkerThread = Namespace<typeof WorkerThread>;
