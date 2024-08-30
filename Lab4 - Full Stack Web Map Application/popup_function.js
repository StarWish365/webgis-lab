function open_popup(e) {
    var popupLocation = new L.LatLng(e.latlng.lat,
        e.latlng.lng);
    var popupContent =
        "<div id= 'report'> " +
        "<h1 class= 'report-title'> " + "Data Form" + "</h1 >" +
        "<p id= 'report-field-lat'> " +
        "<span class= 'report-field-label'> Lat: </span> " +
        "<span class= 'report-field-value'> " + e.latlng.lat + "</span > " +
        "</p>" +
        " <p id= 'report-field-lon'> " +
        " <span class= 'report-field-label'> Lng: </span> " +
        " <span class= 'report-field-value'> " + e.latlng.lng + "</span>" +
        " </p > " +
        " <p id= 'report-field-3'> " +
        " <span class= 'report-field-label'> Name: </span> " +
        " <input id= 'marker_name'> " +
        " </p>" +
        " <div class= 'report-btns'> " +
        " <button id= 'save-button '> save </button> " +
        "</div >" +
        "</div >";
    popup = new L.Popup();
    popup.setLatLng(popupLocation);
    popup.setContent(popupContent);
    popup.openOn(map);
}