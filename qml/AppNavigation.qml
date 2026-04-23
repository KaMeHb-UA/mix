import QtQuick 2.9
import Ubuntu.Components 1.3
import "../dist/index.js" as AppLogic

MainView {
    id: root
    applicationName: "mix.marlock"
    width: units.gu(45)
    height: units.gu(75)
    PageStack {
        id: pageStack
        Component.onCompleted: {
            console.log('completed event');
            AppLogic.mountApp(pageStack)
        }
    }
}
