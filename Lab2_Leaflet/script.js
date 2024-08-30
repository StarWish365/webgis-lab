var map = L.map('mapid').setView([59.324608, 18.06736], 12);
osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }).addTo(map);
//set marker
/*
L.marker([59.324608, 18.06736]).addTo(map).bindPopup("<b> Welcome to Stockholm!</b><br />I am a popup.").openPopup();
L.circle([59.346155, 18.049538], 500, { color: ' red ', fillColor: '# f03 ', fillOpacity: 0.5 }).addTo(map).bindPopup(" I am a circle. ");
L.polygon([[59.312686, 18.016798], [59.330388, 18.023071], [59.317601, 18.041611]]).addTo(map).bindPopup(" I am a polygon. ");
*/
//load metroline
function onEachFeature(feature, layer) {
    var popupContent = " <p> This is Line " +
        feature.properties.number + " ! </p > ";
    layer.bindPopup(popupContent);
}
var metroline;
$.ajax({
    type: 'GET',
    url: 'public/data.geojson',
    dataType: 'json',
    async: true,
    success: function (data) {
        metroline = L.geoJSON(data, {
            style: function (feature) {
                let color = feature.properties.color;
                return { color: color, weight: 3 };
            },
            onEachFeature: onEachFeature
        }).addTo(map);
    }
});

//click function to show lat and lng
var popup = L.popup();
function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent(" You clicked the map at " + e.latlng.toString())
        .openOn(map);
}
map.on('click', onMapClick);
// highlight when mouse on
function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 6,
    });
    layer.bringToFront();
    info.update(layer.feature.properties);
}
// reset when mouse out
function resetHighlight(e) {
    metroline.resetStyle(e.target);
    info.update();
}
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight
    });
}

//show information box
var info = L.control({ position: 'bottomright' });

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};
info.update = function (props) {
    this._div.innerHTML = props ?
        '<h4>Line number</h4>' + props.number + '<br>'
        + '<h4>Line color</h4>' + props.color : '<h4>Hover over a state</h4>';
}

info.addTo(map)