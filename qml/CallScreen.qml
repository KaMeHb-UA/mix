import QtQuick 2.9
import Ubuntu.Components 1.3
import QtMultimedia 5.9 // Для роботи з медіа

Page {
    property string peerName: "Unknown"
    property bool isVideo: false
    property bool isMuted: false
    
    signal hangup()
    signal toggleMute()
    signal toggleVideo()

    // Темний фон для екрана дзвінка
    Rectangle { anchors.fill: parent; color: "#111111" }

    Label {
        anchors.top: parent.top
        anchors.topMargin: units.gu(5)
        anchors.horizontalCenter: parent.horizontalCenter
        text: peerName
        color: "white"
        fontSize: "x-large"
    }

    // Тут мав би бути VideoOutput для відображення потоку

    Row {
        anchors.bottom: parent.bottom
        anchors.bottomMargin: units.gu(5)
        anchors.horizontalCenter: parent.horizontalCenter
        spacing: units.gu(4)

        Button {
            text: isMuted ? "Unmute" : "Mute"
            onClicked: toggleMute()
        }
        
        Button {
            text: "Завершити"
            color: UbuntuColors.red
            onClicked: hangup()
        }
    }
}
