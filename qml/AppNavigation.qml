import QtQuick 2.9
import Lomiri.Components 1.3
import "../static/globals.js" as Globals
import "../dist/app.mjs" as MainScript

MainView {
    id: root
    applicationName: "mix.marlock"
    width: units.gu(45)
    height: units.gu(75)
    PageStack {
        id: pageStack
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
