import QtQuick 2.9
import Lomiri.Components 1.3
import "../static/globals.js" as Globals
import "../dist/app.mjs" as MainScript

MainView {
    id: root
    applicationName: "mix.marlock.ua"
    width: units.gu(45)
    height: units.gu(75)

    KeyboardSpacer {
        id: keyboardSpacer
        anchors {
            left: parent.left
            right: parent.right
            bottom: parent.bottom
        }
    }

    PageStack {
        id: pageStack
        anchors {
            left: parent.left
            right: parent.right
            bottom: keyboardSpacer.top
        }
        Component.onCompleted: {
            Globals.createGlobals(root);
            MainScript.mountApp(pageStack, (message) => mainWorker.sendMessage(message));
        }
    }

    WorkerScript {
        id: mainWorker
        source: "../dist/worker.js"

        onMessage: MainScript.onMessage(messageObject)
    }
}
