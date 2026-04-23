import * as MainThread from '@/app.exported';

type Namespace<T> = {
    [x in keyof T]: T[x];
};

export type MainThread = Namespace<typeof MainThread>;
