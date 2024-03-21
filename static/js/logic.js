// 
const path = 'data/EV_Stations_All_US/all_stations_2014.01.31.geojson';
const washington_2014 = 'data/EV_Stations_Washington/washington_2014.01.31.geojson';
const washington_2024 = 'data/EV_Stations_Washington/washington_2024.01.31.geojson';
const washington_2018 = 'data/EV_Stations_Washington/washington_2018.01.31.geojson';
const washington_2022 = 'data/EV_Stations_Washington/washington_2022.01.31.geojson';

const counties = 'data/Choropleth_boundaries/washington-state-counties_.geojson';
const zip_codes = 'data/Choropleth_boundaries/washington-zip-codes-_1617.geojson';
const census_data_2021 = 'data/census_data/census_2021redo.json'

const us_center = [38.5, -96.5];        // zoom level 5
const wash_center = [47.4, -120.8];     // zoom level 

jQuery.getJSON(washington_2018, function(data_2018) {
    jQuery.getJSON(washington_2022, function(data_2022) {
        jQuery.getJSON(counties, function(county_data){
            jQuery.getJSON(zip_codes, function(zip_data){
                jQuery.getJSON(census_data_2021, function(pop_data){
                    console.log('census',pop_data.data);

                    let pop_dict = {};
                    for (i = 0; i < pop_data.data.length; i++){
                        let zip = pop_data.data[i];
                        pop_dict[zip[1]] = zip[2];
                    }
                    console.log('98822 population: ', pop_dict['98822']);

                    for (i = 0; i < zip_data.features.length; i++){
                        let wash_zip = zip_data.features[i].properties.ZCTA5CE10;
                        let feature = zip_data.features[i].properties;
                        feature.population_2021 = pop_dict[wash_zip]; 
                    }
                    console.log(zip_data.features);
                    console.log('population', 
                    zip_data.features[0].properties.ZCTA5CE10,
                    zip_data.features[0].properties.population_2021);
                    console.log(getColor(zip_data.features[0].properties.population_2021))

                    for (i = 0; i < county_data.features.length; i++){
                        let county = county_data.features[i].properties;
                        county.pop = Math.floor(Math.random() * 100);
                    }

                    createMap(data_2018, data_2022,county_data,zip_data);
                });
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
    let codes = {'E': available, 
                'P': planned,
                'T': unavailable}
    for (i = 0; i < data.features.length; i++){
        let station = data.features[i];
        if (station.geometry.coordinates[0] !== null ){
            subset.push(station);
            let station_code = station.properties.status_code
            codes[station_code].push(station);
        }
    }
    // Using filter to only use current stations (avaialble and unavaiable) and any stations without coordinate data
    let subset2= data.features.filter(station => station.properties.status_code !== 'P' && station.geometry.coordinates[0] !== null);
    console.log('subset2:', subset2);

    
    console.log('Available: '+ available.length);
    console.log('Planned: '+ planned.length);
    console.log('Unavailable: '+ unavailable.length);

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
    return cluster;
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
        "County Lines": L.geoJSON(county_data, {style: style_county}),
        "Zip Code Lines": L.geoJSON(zip_data,{ 
            style: style_zip,
            attribution: '&copy; <a href="https://cartographyvectors.com/map/1617-washington-zip-codes">Cartographyvectors</a> contributors',
            onEachFeature: on_each_feature_zip
        })
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

    function on_each_feature_zip(feature, layer) {
        layer.bindPopup(`<h4>${feature.properties.population_2021}</h4>`)
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

function style_county(feature) {
    return {
        fillColor: getColor(feature.properties.pop),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

function style_zip(feature_zip) {
    return {
        fillColor: getColor(feature_zip.properties.population_2021),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}