import QtQuick 2.9
import Ubuntu.Components 1.3

Page {
    id: pageRoot
    property string pageTitle: ""
    property bool showBackButton: false
    property string rightActionIcon: ""
    
    signal backRequested()
    signal rightActionClicked()

    header: PageHeader {
        title: pageRoot.pageTitle
        // Нативна кнопка назад
        leadingActionBar.actions: pageRoot.showBackButton ? [
            Action {
                iconName: "go-previous"
                onTriggered: pageRoot.backRequested()
            }
        ] : []
        
        trailingActionBar.actions: pageRoot.rightActionIcon !== "" ? [
            Action {
                iconName: pageRoot.rightActionIcon
                onTriggered: pageRoot.rightActionClicked()
            }
        ] : []
    }
}
