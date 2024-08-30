// Initialize and add the map
let map;

async function initMap() {
    // The location of library
    const position = { lat: 59.34796369554033, lng: 18.072846848429233 };
    // Request needed libraries.
    //@ts-ignore
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    // The map, centered at KTH library
    map = new Map(document.getElementById("map"), {
        zoom: 13,
        center: position,
        mapId: "DEMO_MAP_ID",
    });

    let metroline = map.data.loadGeoJson(
        "data.geojson"
    );

    map.data.setStyle(function (feature) {
        let color = feature.getProperty('color');
        console.log(color)
        return {
            strokeColor: color
        };
    })



    // The marker, positioned at KTH library
    const marker = new AdvancedMarkerElement({
        map: map,
        position: position,
        title: "KTH Library",
    });
    // Add a click event listener to the marker
    marker.addListener("click", () => {
        // When the marker is clicked, center the map on the marker's position and reset zoom
        map.setCenter(marker.position);
        map.setZoom(16);
    });
}

initMap();