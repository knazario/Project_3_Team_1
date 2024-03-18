// 
const path = 'data/EV_Stations_All_US/all_stations_2014.01.31.geojson';
const washington_2014 = 'data/EV_Stations_Washington/washington_2014.01.31.geojson';
const washington_2024 = 'data/EV_Stations_Washington/washington_2024.01.31.geojson';
const washington_2018 = 'data/EV_Stations_Washington/washington_2018.01.31.geojson';
const washington_2022 = 'data/EV_Stations_Washington/washington_2022.01.31.geojson';

const us_center = [38.5, -96.5];        // zoom level 5
const wash_center = [47.4, -120.8];     // zoom level 

jQuery.getJSON(washington_2018, function(data_2018) {
    jQuery.getJSON(washington_2022, function(data_2022) {

        createMap(data_2018, data_2022);
    });
});

function addStations(data, marker_color){
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
    console.log(subset.length);
    let stations = L.geoJSON(subset, {
        pointToLayer: createCircleMarker,
        onEachFeature: on_each_feature
        });

    function createCircleMarker(feature, latlng) {
    return L.circleMarker(latlng, {
        //radius: total_ports(feature.properties) * 2,
        radius: 10,
        fillColor: marker_color,
        color: "#000", 
        weight: .5,
        fillOpacity: .4
        });
    }

    function on_each_feature(feature, layer) {
        let station = feature.properties;
        //let ports = station.ev_dc_fast_num + station.ev_level1_evse_num + station.ev_level2_evse_num;
        layer.bindPopup(`<h3>${station.station_name}</h3><hr>`+
        `<p> Station Status: ${station.status_code}</p>`+
        `<p> Num. Level 1 Ports: ${station.ev_level1_evse_num}</p>`+
        `<p> Num. Level 2 Ports: ${station.ev_level2_evse_num}</p>`+
        `<p> Num. DC Fast Ports: ${station.ev_dc_fast_num}</p>`+
        `<p> Total Ports: ${total_ports(station)}</p>`+
        `<p> EV Network: ${station.ev}</p>`+
        `<p> EV Pricing: ${station.ev_pricing}`);
      }
    
    function total_ports(station){
    return station.ev_dc_fast_num + station.ev_level1_evse_num + station.ev_level2_evse_num;
    }

    let cluster = L.markerClusterGroup();
    stations.addTo(cluster)
    //createMap(cluster);
    return stations;
}
function createMap(data_2018, data_2022){
    // Create the tile layer (background) for map
    let base = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })


    // Create a baseMaps object to hold the lightmap layer.
    let baseMaps = {
    "Gray Scale": base
    };

    markers_2018 = addStations(data_2018, 'red');
    markers_2022 = addStations(data_2022, 'blue');
    // Create an overlayMaps object to hold the bikeStations layer.
    let overlayMaps = {
    "EV Stations 2018": markers_2018,
    "EV Stations 2022": markers_2022
    };

    // Create the map object with options.
    let myMap = L.map("map", {
    center: wash_center,
    zoom: 7,
    layers: [base, markers_2018]
    });

    // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(null, overlayMaps).addTo(myMap);

}