// 
const path = 'data/all_stations_2014.01.31.geojson';
 
jQuery.getJSON(path, function(data) {
    // Add the GeoJSON layer to the map
    addStations(data);
});

function addStations(data){
    console.log(data.features[0]);

    let evStations = L.geoJSON(data.features);

    let subset = [];
    for (i = 0; i < 200; i++){
        let station = data.features[i];
        if (station.geometry.coordinates[0] !== null){
            subset.push(station);
        }
    }
    console.log(data.features[2]);
    console.log(subset);
    createMap(L.geoJSON(subset));
}
function createMap(evStations){
    // Create the tile layer (background) for map
    let base = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })


    // Create a baseMaps object to hold the lightmap layer.
    let baseMaps = {
    "Gray Scale": base
    };


    // Create an overlayMaps object to hold the bikeStations layer.
    let overlayMaps = {
    "EV Stations": evStations
    };

    // Create the map object with options.
    let myMap = L.map("map", {
    center: [38.5, -96.5],
    zoom: 5,
    layers: [base, evStations]
    });

    // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps).addTo(myMap);

}