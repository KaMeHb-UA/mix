function qmlTimer(pageStack: any) {
    return Qt.createQmlObject('import QtQuick 2.9; Timer {}', pageStack, 'dynamicTimer');
}

export function createTimers(pageStack: any) {
    const global: any = globalThis;

    global.clearTimeout = function (timer: any) {
        if (timer && typeof timer.destroy === 'function') timer.destroy();
    };

    global.clearInterval = global.clearTimeout;

    global.setTimeout = function (callback: any, delay: number) {
        const timer = qmlTimer(pageStack);
        timer.interval = delay || 1;
        timer.repeat = false;
        timer.triggered.connect(() => { callback(); timer.destroy(); });
        timer.start();
        return timer;
    };

    global.setInterval = function (callback: any, delay: number) {
        const timer = qmlTimer(pageStack);
        timer.interval = delay || 1;
        timer.repeat = true;
        timer.triggered.connect(callback);
        timer.start();
        return timer;
    };
}
