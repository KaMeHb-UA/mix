import { QML_PATH } from '@/constants';

export function createComponent<T extends Record<string, any>>(file: string): Record<string, any> & T {
    return Qt.createComponent(Qt.resolvedUrl(QML_PATH + file));
}
