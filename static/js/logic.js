// 
const path = 'data/all_stations_2014.01.31.geojson';
const washington_2014 = 'data/washington_2014.01.31.geojson';
const washington_2024 = 'data/washington_2024.01.31.geojson';

const us_center = [38.5, -96.5];        // zoom level 5
const wash_center = [47.4, -120.8];     // zoom level 

jQuery.getJSON(washington_2024, function(data) {
    // Add the GeoJSON layer to the map
    addStations(data);
});

function addStations(data){
    console.log(data.features.length)
    console.log(data.features[0]);

    let evStations = L.geoJSON(data.features);

    let subset = [];
    for (i = 0; i < data.features.length; i++){
        let station = data.features[i];
        if (station.geometry.coordinates[0] !== null ){
            subset.push(station);
        }
    }
    console.log(data.features[2]);
    console.log(subset);
    let stations = L.geoJSON(subset, {
        onEachFeature: on_each_feature
      });

    function on_each_feature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.station_name}</h3><hr>`+
        `<p> Num. Level 2 Ports: ${feature.properties.ev_level2_evse_num}</p>`+
        `<p> EV Pricing: ${feature.properties.ev_pricing}`);
      }

    let cluster = L.markerClusterGroup();
    stations.addTo(cluster)
    createMap(cluster);
    
}
function createMap(markers){
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
    "EV Stations": markers
    };

    // Create the map object with options.
    let myMap = L.map("map", {
    center: wash_center,
    zoom: 7,
    layers: [base, markers]
    });

    // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(null, overlayMaps).addTo(myMap);

}