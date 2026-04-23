import QtQuick 2.9
import Ubuntu.Components 1.3

Item {
    anchors.fill: parent
    // Напівпрозорий фон
    Rectangle {
        anchors.fill: parent
        color: Theme.palette.normal.background
        opacity: 0.8
    }

    ActivityIndicator {
        anchors.centerIn: parent
        running: true
    }
}
