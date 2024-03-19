// 
const path = 'data/EV_Stations_All_US/all_stations_2014.01.31.geojson';
const washington_2014 = 'data/EV_Stations_Washington/washington_2014.01.31.geojson';
const washington_2024 = 'data/EV_Stations_Washington/washington_2024.01.31.geojson';
const washington_2018 = 'data/EV_Stations_Washington/washington_2018.01.31.geojson';
const washington_2022 = 'data/EV_Stations_Washington/washington_2022.01.31.geojson';

const counties = 'data/Choropleth_boundaries/washington-state-counties_.geojson';
const zip_codes = 'data/Choropleth_boundaries/washington-zip-codes-_1617.geojson';

const us_center = [38.5, -96.5];        // zoom level 5
const wash_center = [47.4, -120.8];     // zoom level 

jQuery.getJSON(washington_2018, function(data_2018) {
    jQuery.getJSON(washington_2022, function(data_2022) {
        jQuery.getJSON(counties, function(county_data){
            jQuery.getJSON(zip_codes, function(zip_data){
                console.log(county_data.features);
                for (i = 0; i < county_data.features.length; i++){
                    let county = county_data.features[i].properties;
                    county.pop = Math.floor(Math.random() * 100);
                }
                console.log(county_data.features);
                createMap(data_2018, data_2022,county_data,zip_data);
            });
        });
    });
});

function addStations(data, marker_color){
    console.log(data.features.length)
    console.log(data.features[0]);

    let evStations = L.geoJSON(data.features);

    let subset = [];
    let available = [], planned= [], unavailable = [];
    let codes = {'E': 'available', 
                'P': 'planned',
                'T': 'unavailable'}
    console.log('Test'+codes['E']);
    for (i = 0; i < data.features.length; i++){
        let station = data.features[i];
        if (station.geometry.coordinates[0] !== null ){
            subset.push(station);
            available.push(station.properties.status_code);
        }
    }
    
    console.log(available);

    let statuses = subset.map(x=> x.properties.status_code);
    let status_count = {};
    statuses.forEach(ele => {
        if (status_count[ele]) {
            status_count[ele] += 1;
        } else {
            status_count[ele] = 1;
        }
    });
    console.log('status' + status_count);
    // Testing a way to get a unique list of properties of the EV stations 
    //https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates
    console.log(subset.length);
    let networks = subset.map(x => x.properties.ev_network);
    let unique = [...new Set (networks)];
    console.log(unique);

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
        `<p> EV Network: ${station.ev_network}</p>`+
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
function createMap(data_2018, data_2022, county_data, zip_data){
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
    "EV Stations 2022": markers_2022,
    "County Lines": L.geoJSON(county_data, {style: style}),
    "Zip Code Lines": L.geoJSON(zip_data,{
        attribution: '&copy; <a href="https://cartographyvectors.com/map/1617-washington-zip-codes">Cartographyvectors</a> contributors'})
    };

    // Create the map object with options.
    let myMap = L.map("map", {
    center: wash_center,
    zoomSnap: .5,
    zoom: 7,
    layers: [base, markers_2018]
    });

    // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(null, overlayMaps).addTo(myMap);

//     myMap.on('click', function() { 
//         alert(myMap.getBounds().getNorthWest());
//    });
    console.log(myMap.getBounds().getNorthWest());

}

function getColor(d) {
    return d > 90 ? '#800026' :
           d > 80  ? '#BD0026' :
           d > 70  ? '#E31A1C' :
           d > 50  ? '#FC4E2A' :
           d > 30   ? '#FD8D3C' :
           d > 20   ? '#FEB24C' :
           d > 10   ? '#FED976' :
                      '#FFEDA0';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.pop),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}