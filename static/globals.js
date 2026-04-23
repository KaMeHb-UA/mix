var globalThis = this;

function qmlTimer(pageStack) {
    return Qt.createQmlObject('import QtQuick 2.9; Timer {}', pageStack, 'dynamicTimer');
}

function createGlobals(pageStack) {
    globalThis.clearTimeout = function (timer) {
        if (timer && typeof timer.destroy === 'function') timer.destroy();
    };

    globalThis.clearInterval = globalThis.clearTimeout;

    globalThis.setTimeout = function (callback, delay) {
        const timer = qmlTimer(pageStack);
        timer.interval = delay || 1;
        timer.repeat = false;
        timer.triggered.connect(() => { callback(); timer.destroy(); });
        timer.start();
        return timer;
    };

    globalThis.setInterval = function (callback, delay) {
        const timer = qmlTimer(pageStack);
        timer.interval = delay || 1;
        timer.repeat = true;
        timer.triggered.connect(callback);
        timer.start();
        return timer;
    };

    globalThis.crypto = {};
}
