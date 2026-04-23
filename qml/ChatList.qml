import QtQuick 2.9
import Lomiri.Components 1.3

Page {
    id: chatListPage

    header: PageHeader {
        id: pageHeader
        title: "MIX"
    }

    property string chatsData: "[]"
    signal chatSelected(string roomId, string roomName)

    ListModel { id: internalChatModel }

    onChatsDataChanged: {
        internalChatModel.clear();
        let data = JSON.parse(chatsData);
        for (let i = 0; i < data.length; i++) {
            internalChatModel.append(data[i]);
        }
    }

    ListView {
        id: chatList
        anchors.top: pageHeader.bottom
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.bottom: parent.bottom

        model: internalChatModel

        delegate: ListItem {
            onClicked: chatListPage.chatSelected(model.roomId, model.name)

            ListItemLayout {
                title.text: model.name || "Unknown Room"
                subtitle.text: model.lastMessage || ""
                
                Label {
                    SlotsLayout.position: SlotsLayout.Trailing
                    text: model.unreadCount > 0 ? model.unreadCount : (model.isEncrypted ? "🔒" : "")
                    color: LomiriColors.orange
                    visible: model.unreadCount > 0 || model.isEncrypted
                }
            }
        }
    }
}
