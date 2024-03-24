//  set paths for local data files
const WASHINGTON_2018 = 'data/EV_Stations_Washington/washington_2018.01.31.geojson';
const WASHINGTON_2022 = 'data/EV_Stations_Washington/washington_2022.01.31.geojson';

const ZIP_CODES = 'data/Choropleth_boundaries/washington-zip-codes-_1617.geojson';
const CENSUS_2018_PATH = 'data/census_data/census_2018redo.json';
const CENSUS_2022_PATH = 'data/census_data/census_2022redo.json';

// Use d3.json to make nested promise calls to read in data files
d3.json(WASHINGTON_2018).then(function(data_2018) {
    d3.json(WASHINGTON_2022).then(function(data_2022) {
        d3.json(ZIP_CODES).then(function(zip_data){
            d3.json(CENSUS_2018_PATH).then(function(census_data_2018){
                d3.json(CENSUS_2022_PATH).then(function(census_data_2022){
                    
                //create dictionary of census population data for 2018 and 2022 (zip:pop)
                let pop_dict_2018 = createPop_dict(census_data_2018)
                let pop_dict_2022 = createPop_dict(census_data_2022);
                // loop through zip code geojson and add 2018 and 2022 zip code data to properties for choropleth
                for (i = 0; i < zip_data.features.length; i++){
                    let wash_zip = zip_data.features[i].properties.ZCTA5CE10;
                    let feature = zip_data.features[i].properties;
                    feature.population_2018 = pop_dict_2018[wash_zip]; 
                    feature.population_2022 = pop_dict_2022[wash_zip]; 
                }
                console.log(zip_data.features);
                // send ev sations data (2018 and 2022) and zip_code geometry to createMap function
                createMap(data_2018, data_2022,zip_data);
            });
            });
        });
    });
});

//function used to transform the census data (list of lists) into a dictionary with key:value pair of zip:population
function createPop_dict (census_data){
    let pop_dict = {};
    for (i = 0; i < census_data.data.length; i++){
        let zip = census_data.data[i];
        pop_dict[zip[1]] = zip[2];
    }
    return pop_dict;
}
// Fucntion that takes data files and creates necessary layers and controls in order to display map
function createMap(data_2018, data_2022, zip_data){
    // Create the tile layer (background) for map
    let base = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
    // create additional base layer (dark)
    let dark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    });

    // Create a baseMaps object to hold 2 base layers.
    let baseMaps = {
        "Street Layer": base, 
        "Dark Layer": dark
    };
    // call addStations function for the EV station layers, passing data, marker color and 
    // layergroup type (markers or cluster). addStations returns a Leaflet layergroup
    let markers_2018 = addStations(data_2018, 'red', 'marker');
    let markers_2022 = addStations(data_2022, 'blue', 'marker');
    let cluster_2018 = addStations(data_2018, 'red', 'cluster');
    let cluster_2022 = addStations(data_2022, 'blue', 'cluster');
    
    // craete geoJSON leaflet layer for zipcode choropleth. passing additional parameters to style and on_each_feature
    // in order to pull 2018 vs 2022 population data and label
    let zip_pop_2018 = L.geoJSON(zip_data,{ 
         style: function (feature){
             return style_zip(feature.properties.population_2018)},
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

    // Create an overlayMaps object to hold the EV station layers and zip code choropleths.
    let overlayMaps = {
        "EV Stations 2018": markers_2018,
        "Population by Zip (2018)": zip_pop_2018, 
        "EV Stations 2022": markers_2022,
        "Population by Zip (2022)": zip_pop_2022,
        "EV Stations Cluster (2018)" : cluster_2018,
        "EV Stations Cluster (2022)" : cluster_2022
    };

    // set coordinates for approx. center of washington
    let wash_center = [47.3, -120.8];     // zoom level 7.5
    
    // Create the map object with options. 
    let myMap = L.map("map", {
    center: wash_center,
    zoomSnap: .5,   // allows zoom to increment by .5 levels
    zoom: 7.5,
    maxBounds: L.latLngBounds(L.latLng(44, -128), L.latLng(51, -114)),  // utilized getBounds() to keep pane around washington
    layers: [base, zip_pop_2018, markers_2018]
    });
    
    console.log('Southwest:', myMap.getBounds().getSouthWest().toString()); 
    console.log('Northeast:', myMap.getBounds().getNorthEast().toString());

    // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps).addTo(myMap);

    // create scale and add to map
    L.control.scale({maxWidth: 150}).addTo(myMap); 

    // create a legend control object
    var legend = L.control({position: 'bottomright'});
    // create div for legend and provide values when added to map
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend'),
        population = [0, 2000, 5000, 20000, 30000, 50000, 90000,100000],
            labels = [];
        // add legend title
        div.innerHTML = '<h4> Population</h4>';
        // loop through our population intervals and generate a label with a colored square for each interval
        for (var i = 0; i < population.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(population[i] + 1) + '"></i> ' +
                population[i] + (population[i + 1] ? '&ndash;' + population[i + 1] + '<br>' : '+');
        }

        return div; //returning div to be placed on map
    };

    legend.addTo(myMap);    // add legend to map
}

// // Create a legend providing context for map data
// function createLegend(myMap){    
//     var legend = L.control({position: 'bottomright'});

//     legend.onAdd = function() {
//         var div = L.DomUtil.create("div", "pop-legend");
//         div.innerHTML += "<h4>Population by Zip Code</h4>";
//         div.innerHTML += '<i style="background: #00FF00"></i><span>0 - 1K</span><br>';
//         div.innerHTML += '<i style="background: #477AC2"></i><span>1K - 5K</span><br>';
//         div.innerHTML += '<i style="background: #87BD7B"></i><span>5K - 25K</span><br>';
//         div.innerHTML += '<i style="background: #00E700"></i><span>25K - 30K</span><br>';
//         div.innerHTML += '<i style="background: #B9BAB9"></i><span>30K - 35K</span><br>';
//         div.innerHTML += '<i style="background: #878987"></i><span>35K - 40K</span><br>';
//         div.innerHTML += '<i style="background: #737373"></i><span>40K - 50K</span><br>';
//         div.innerHTML += '<i style="background: #111111"></i><span>50K+</span><br>';


// // legend.onAdd = function () {
// //     var div = L.DomUtil.create('div', 'pop-legend'),
// //         pops = [0, 1000, 5000, 25000, 30000, 35000, 40000, 50000],
// //         labels = [];

// //     // loop through our population intervals and generate a label with a colored square for each interval
// //     for (var i = 0; i < pops.length; i++) {
// //         div.innerHTML +=
// //             '<i style="background:' + getColor(pops[i] + 1) + '"></i> ' +
// //             pops[i] + (pops[i + 1] ? '&ndash;' + pops[i + 1] + '<br>' : '+');

//         return div;
//     };
//     legend.addTo(myMap);
// }
// createLegend(myMap);

// function receives geojson, marker color and type (marker vs cluster) and creates/returns leaflet overlay layer
function addStations(data, marker_color, marker_type){
    // Using filter to only use current stations (avaialble and unavaiable), removing planned (Future) stations
    // and removing any stations without coordinate data
    let stations= data.features.filter(station => station.properties.status_code !== 'P' && 
    station.geometry.coordinates[0] !== null);

    // create geoJson layer, calling createCircleMarkers to customize marker and on_each_feature to add bind pop up
    let stations_layer = L.geoJSON(stations, {
        pointToLayer: createCircleMarker,
        onEachFeature: on_each_feature
        });
    
    // create circle marker for each geometry 
    function createCircleMarker(feature, latlng) {
    return L.circleMarker(latlng, {
        radius: Math.sqrt(total_ports(feature.properties)) * 4, // size of circle based on total charging ports calculated using total_ports function
        fillColor: marker_color,       // sets color of cirlce 
        color: "#000", 
        weight: .5,
        fillOpacity: .4                 // set opacity to .4 to allow for overlay of colors 
        });
    }
    // Add bind pop up and mouseover features 
    function on_each_feature(feature, layer) {
        let station = feature.properties;
        if (station.ev_pricing == null){            // if pricing is info is not provided, change null to "not provided"
            station.ev_pricing = "Not provided"         
        }
        // add station name, ev network, total ports, number of each type of port (if null, display 0), and pricing info
        layer.bindPopup(`<h3>${station.station_name}</h3><hr>`+
        `<p> EV Network: ${station.ev_network}</p>`+
        `<p> Total Ports: ${total_ports(station)}</p>`+
        `<p> Num. Level 1 Ports: ${station.ev_level1_evse_num == null ? 0 :station.ev_level1_evse_num }</p>`+
        `<p> Num. Level 2 Ports: ${station.ev_level2_evse_num == null ? 0 :station.ev_level2_evse_num}</p>`+
        `<p> Num. DC Fast Ports: ${station.ev_dc_fast_num== null ? 0 :station.ev_dc_fast_num}</p>`+
        `<p> EV Pricing: ${station.ev_pricing}`);
        // add mouseover and mouseout actions 
        layer.on({
            // Adjust opacity and radius (bigger) on mouseover
            mouseover: function(event) {
              layer = event.target;
              layer.setStyle({
                fillOpacity: 0.8,
                radius: (Math.sqrt(total_ports(feature.properties)) * 4) + 3
              });
            },
            // Revert back to default style after mouseover (mouseout)
            mouseout: function(event) {
              layer = event.target;
              layer.setStyle({
                fillOpacity: 0.5, 
                radius: Math.sqrt(total_ports(feature.properties)) * 4
              });
            }
        })
    
    }
    // return the sum of the 3 port types to get total port number for a station 
    function total_ports(station){
    return station.ev_dc_fast_num + station.ev_level1_evse_num + station.ev_level2_evse_num;
    }
    // create a markerCluster group with the EV station layer
    let cluster_layer = L.markerClusterGroup();
    stations_layer.addTo(cluster_layer)

    // returning either marker layer or markerclustergroup layer based on passed parameter (marker_type)
    return marker_type == 'marker' ? stations_layer : cluster_layer;
}
// return color for choropleth baesd on zip code population
function getColor(d) {
    return d > 50000 ? '#111111' :
           d > 40000  ? '#737373' :
           d > 35000  ? '#878987' :
           d > 30000  ? '#B9BAB9' :
           d > 25000  ? '#00E700' :
           d > 5000   ? '#87BD7B' :
           d > 1000   ? '#00CC00' :
                         '#00FF00';
}
// style zip choropleth with population changing color 
function style_zip(feature_pop) {
    return {
        fillColor: getColor(feature_pop),
        weight: .5,
        opacity: 1,
        color: 'black',
        fillOpacity: 0.7
    };
}
// add bindpop up mouseover actions for zip code choropleth layers 
function on_each_feature_zip(feature, layer,feature_pop, year ) {
    // add bindpopup to show zip code and population based on layer year 
    layer.bindPopup(`<h3>Zip Code: ${feature.properties.ZCTA5CE10}<hr>`+
    `<h4>${year} Population: ${feature_pop}</h4>`);
    layer.on({
        // Adjust opacity on mouseover
        mouseover: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.8,
            weight: 1
          });
        },
        // Revert back to default style after mouseover (mouseout)
        mouseout: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.5, 
            weight: .5
          });
        }
    })
}  