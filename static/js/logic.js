// 
const path = 'data/EV_Stations_All_US/all_stations_2014.01.31.geojson';
const washington_2014 = 'data/EV_Stations_Washington/washington_2014.01.31.geojson';
const washington_2024 = 'data/EV_Stations_Washington/washington_2024.01.31.geojson';
const washington_2018 = 'data/EV_Stations_Washington/washington_2018.01.31.geojson';
const washington_2022 = 'data/EV_Stations_Washington/washington_2022.01.31.geojson';

const counties = 'data/Choropleth_boundaries/washington-state-counties_.geojson';
const zip_codes = 'data/Choropleth_boundaries/washington-zip-codes-_1617.geojson';
const census_data_2018 = 'data/census_data/census_2018redo.json';
const census_data_2022 = 'data/census_data/census_2022redo.json';

const us_center = [38.5, -96.5];        // zoom level 5
const wash_center = [47.3, -120.8];     // zoom level 7.5

console.log("test script");

d3.json(washington_2018).then( function(data_2018) {
    d3.json(washington_2022).then( function(data_2022) {
        d3.json(zip_codes).then( function(zip_data){
            d3.json(census_data_2018).then( function(pop_data_2018){
                d3.json(census_data_2022).then( function(pop_data_2022){
                
                console.log("test");
                console.log(data_2018);

                let pop_dict_2018 = {};
                for (i = 0; i < pop_data_2018.data.length; i++){
                    let zip = pop_data_2018.data[i];
                    pop_dict_2018[zip[1]] = zip[2];
                }

                let pop_dict_2022 = {};
                for (i = 0; i < pop_data_2022.data.length; i++){
                    let zip = pop_data_2022.data[i];
                    pop_dict_2022[zip[1]] = zip[2];
                }

                for (i = 0; i < zip_data.features.length; i++){
                    let wash_zip = zip_data.features[i].properties.ZCTA5CE10;
                    let feature = zip_data.features[i].properties;
                    feature.population_2018 = pop_dict_2018[wash_zip]; 
                    feature.population_2022 = pop_dict_2022[wash_zip]; 
                }
                console.log(zip_data.features);
                createMap(data_2018, data_2022,zip_data);
            });
            });
        });
    });
});

function addStations(data, marker_color, marker_type){
    console.log(data.features.length)
    console.log(data.features[0]);

    // Using filter to only use current stations (avaialble and unavaiable) and any stations without coordinate data
    let subset= data.features.filter(station => station.properties.status_code !== 'P' && station.geometry.coordinates[0] !== null);
    console.log('subset:', subset);

    let stations = L.geoJSON(subset, {
        pointToLayer: createCircleMarker,
        onEachFeature: on_each_feature
        });

    function createCircleMarker(feature, latlng) {
    return L.circleMarker(latlng, {
        //radius: total_ports(feature.properties) * 2,
        radius: Math.sqrt(total_ports(feature.properties)) * 4,
        //radius: 10,
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
        `<p> EV Network: ${station.ev_network}</p>`+
        `<p> Total Ports: ${total_ports(station)}</p>`+
        //`<p> Station Status: ${station.status_code}</p>`+
        `<p> Num. Level 1 Ports: ${station.ev_level1_evse_num}</p>`+
        `<p> Num. Level 2 Ports: ${station.ev_level2_evse_num}</p>`+
        `<p> Num. DC Fast Ports: ${station.ev_dc_fast_num}</p>`+
        `<p> EV Pricing: ${station.ev_pricing}`);
      }
    
    function total_ports(station){
    return station.ev_dc_fast_num + station.ev_level1_evse_num + station.ev_level2_evse_num;
    }

    let cluster = L.markerClusterGroup();
    stations.addTo(cluster)

    // returning either marker layer or markerclustergroup layer based on condition
    return marker_type == 'marker' ? stations : cluster;
}
function createMap(data_2018, data_2022, zip_data){
    // Create the tile layer (background) for map
    let base = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })


    // Create a baseMaps object to hold the lightmap layer.
    let baseMaps = {
        "Gray Scale": base
    };

    let markers_2018 = addStations(data_2018, 'red', 'marker');
    let markers_2022 = addStations(data_2022, 'blue', 'marker');
    let cluster_2018 = addStations(data_2018, 'red', 'cluster');
    let cluster_2022 = addStations(data_2022, 'blue', 'cluster');
    let zip_pop_2018 = L.geoJSON(zip_data,{ 
         style: function (feature){
             return style_zip(feature.properties.population_2018)},
        //style: style_zip2,
        attribution: '&copy; <a href="https://cartographyvectors.com/map/1617-washington-zip-codes">Cartographyvectors</a> contributors',
        onEachFeature: function (feature, layer){
            return on_each_feature_zip(feature, layer, feature.properties.population_2018, '2018')}
        });
    let zip_pop_2022 = L.geoJSON(zip_data,{ 
        style: function (feature){
            return style_zip(feature.properties.population_2022)},
       attribution: '&copy; <a href="https://cartographyvectors.com/map/1617-washington-zip-codes">Cartographyvectors</a> contributors',
       onEachFeature: function (feature, layer){
        return on_each_feature_zip(feature, layer, feature.properties.population_2022, '2022')}
       });

    // Create an overlayMaps object to hold the bikeStations layer.
    let overlayMaps = {
        "EV Stations 2018": markers_2018,
        "Population by Zip (2018)": zip_pop_2018, 
        "EV Stations 2022": markers_2022,
        "Population by Zip (2022)": zip_pop_2022,
        "EV Stations Cluster (2018)" : cluster_2018,
        "EV Stations Cluster (2022)" : cluster_2022
    };

    // Create the map object with options.
    let myMap = L.map("map", {
    center: wash_center,
    zoomSnap: .5,
    zoom: 7.5,
    layers: [base, zip_pop_2018, markers_2018]
    });

    // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(null, overlayMaps).addTo(myMap);

    L.control.scale({maxWidth: 150}).addTo(myMap);

    function on_each_feature_zip(feature, layer,feature_pop, year ) {
        let pop = 
        layer.bindPopup(`<h3>Zip Code: ${feature.properties.ZCTA5CE10}<hr>`+
        `<h4>${year} Population: ${feature_pop}</h4>`);
    }   
}

function getColor(d) {
    return d > 100000 ? '#800026' :
           d > 90000  ? '#BD0026' :
           d > 50000  ? '#E31A1C' :
           d > 30000  ? '#FC4E2A' :
           d > 20000   ? '#FD8D3C' :
           d > 5000   ? '#FEB24C' :
           d > 2000   ? '#FED976' :
                         '#FFEDA0';
}


function style_zip(feature_pop) {
    return {
        fillColor: getColor(feature_pop),
        weight: .5,
        opacity: 1,
        color: 'black',
        //dashArray: '3',
        fillOpacity: 0.7
    };
}

function style_zip2(feature) {
    return {
        fillColor: getColor(feature.properties.population_2018),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}