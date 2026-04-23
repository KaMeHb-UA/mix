import QtQuick 2.9
import Ubuntu.Components 1.3

ListView {
    id: spaceList
    height: units.gu(8)
    orientation: ListView.Horizontal
    
    // React передає JSON, який ми парсимо в модель
    property string spacesData: "[]"
    property string activeSpaceId: ""
    signal spaceSelected(string spaceId)

    onSpacesDataChanged: {
        listModel.clear()
        var data = JSON.parse(spacesData)
        for (var i = 0; i < data.length; i++) {
            listModel.append(data[i])
        }
    }

    model: ListModel { id: listModel }

    delegate: Item {
        width: units.gu(8)
        height: units.gu(8)
        
        // Іконка простору з індикатором активності
        Rectangle {
            anchors.centerIn: parent
            width: units.gu(6); height: units.gu(6)
            radius: width / 2
            color: activeSpaceId === model.id ? Theme.palette.normal.focus : "transparent"
            border.color: Theme.palette.normal.baseText
            border.width: 1
            
            Label {
                anchors.centerIn: parent
                text: model.name.charAt(0) // Заглушка, якщо немає аватара
            }
        }
        
        MouseArea {
            anchors.fill: parent
            onClicked: spaceList.spaceSelected(model.id)
        }
    }
}
