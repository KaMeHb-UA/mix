import QtQuick 2.9
import Lomiri.Components 1.3

Page {
    id: chatViewPage

    property string roomTitle: "Chat" 
    property string messagesData: "[]"
    property bool canWrite: true

    signal sendMessage(string text)
    signal backRequested()

    header: PageHeader {
        id: chatHeader
        title: chatViewPage.roomTitle
        
        leadingActionBar.actions: [
            Action {
                iconName: "back"
                onTriggered: chatViewPage.backRequested()
            }
        ]
    }

    ListModel { id: msgModel }

    onMessagesDataChanged: {
        msgModel.clear();
        let msgs = JSON.parse(messagesData);
        for (let i = 0; i < msgs.length; i++) {
            msgModel.append(msgs[i]);
        }
    }

    ListView {
        id: messageList
        anchors.top: chatHeader.bottom
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.bottom: inputArea.top

        model: msgModel
        clip: true

        // Скрол донизу при зміні кількості повідомлень
        onCountChanged: {
            Qt.callLater(messageList.positionViewAtEnd)
        }

        delegate: Item {
            width: messageList.width
            height: msgBubble.height + units.gu(2)

            Rectangle {
                id: msgBubble
                width: Math.min(msgText.implicitWidth + units.gu(4), parent.width * 0.8)
                height: msgText.implicitHeight + units.gu(2)
                anchors.right: model.isMine ? parent.right : undefined
                anchors.left: model.isMine ? undefined : parent.left
                anchors.margins: units.gu(1)
                radius: units.gu(1)
                color: model.isMine ? LomiriColors.green : Theme.palette.normal.base

                Label {
                    id: msgText
                    text: model.text
                    wrapMode: Text.Wrap
                    anchors.centerIn: parent
                    width: parent.width - units.gu(2)
                }
            }
        }
    }

    Rectangle {
        id: inputArea
        anchors.bottom: parent.bottom
        anchors.left: parent.left
        anchors.right: parent.right
        height: units.gu(8)
        color: Theme.palette.normal.background

        Row {
            anchors.fill: parent
            anchors.margins: units.gu(1)
            spacing: units.gu(1)

            TextField {
                id: inputField
                width: parent.width - sendBtn.width - units.gu(2)
                placeholderText: "Повідомлення..."
                // Покажемо клавіатуру одразу, як тільки відкриється екран чату
                Component.onCompleted: forceActiveFocus()
            }

            Button {
                id: sendBtn
                text: "Send"
                width: units.gu(10)
                onClicked: {
                    if (inputField.text.trim() !== "") {
                        chatViewPage.sendMessage(inputField.text)
                        inputField.text = ""
                    }
                }
            }
        }
    }
}
