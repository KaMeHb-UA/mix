import * as WorkerThread from '@/app.worker';
import type { Namespace } from './namespace';

export type WorkerThread = Namespace<typeof WorkerThread>;
