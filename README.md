# UC Berkeley Data Analytics Bootcamp Project #3- Team 1
## Analysis and visualizations of EV charging stations in relation to population, as well as visualization of services around charging stations and a breakdown of electric vehicle registration information in Washington State.

## [Slide Deck Presentation](https://docs.google.com/presentation/d/1rJnLBgEE1-EYBnG3U2ecyzHRxKky46Z0LkpK-uAAsp0/edit?usp=sharing)

## Why did we choose this topic?
Electric cars have been noticeably on the incline in the last decade. With strong efforts by governments worldwide to go green and the incentivization of regenerative energy sources, our team was interested in the rate of change of the increase of electric cars along with the development of charging stations throughout the state of Washington. 

## Data Sources
We honed in on Washington State as registered car data was more publicly accessible. Sources being used are: 
- EV Charging Station Information: [Alternative Fuels Data Center](https://afdc.energy.gov/stations/states)
- EV Registration Data: [State of Washington Open Data Portal- EV Registrations by County](https://data.wa.gov/Transportation/Electric-Vehicle-Population-Size-History-By-County/3d5d-sdqb/about_data)
- Zip Code Population Data: [US Census Bureau American Community Survey 5-Year Data](https://www.census.gov/data/developers/data-sets/acs-5year.html)
- Vector Map of Washington State Zip Codes: [Cartography Vectors](https://cartographyvectors.com/map/1617-washington-zip-codes)

## Libraries & Plugins Used
- [d3](https://d3js.org/)
- [Leaflet](https://leafletjs.com/)
- [Leaflet Marker Cluster](https://github.com/Leaflet/Leaflet.markercluster)- This plugin allowed us to create clustered groups of markers for the EV stations so that visually you are able to see the number of clusters in an area on the map and declutter the map. When you zoom in on a cluster, you can see and interact with individual EV stations as you would regular markers.
- [Leaflet - Grouped Layer Control](https://github.com/ismyrnow/leaflet-groupedlayercontrol/tree/gh-pages)- This plugin provided a way to group layers in our layer control box so that you can toggle the different years on and off as a unit (i.e. 2018 layers). This makes interacting with the map more intuitive and user-friendly.
- [Leaflet- Sync](https://github.com/jieter/Leaflet.Sync)- This plugin provides a way to sync the movement of 2 or more maps on the same page. For our side-by-side map view of the EV stations, this allowed the maps to zoom and move together so that the user can compare 2018 and 2022 side-by-side.
- [Leaflet Reset-View](https://github.com/drustack/Leaflet.ResetView)- This plugin allows you to create a simple reset button below the zoom buttons that will reset your view to the original view. This makes it easy to reset the map back to the entire state of Washington once you’ve zoomed in.
- [Geoapify API Documentation](https://apidocs.geoapify.com/docs/place-details/#api/)
- [Chart.js](https://www.chartjs.org/)
- [Folium](https://python-visualization.github.io/folium/latest/) - Allows for integration of Python and Leaflet
- [Plotly Express](https://plotly.com/python/plotly-express/)
- [Geopandas](https://geopandas.org/en/stable/about.html)

## Database used to host our project
- [MongoDB Atlas](https://www.mongodb.com/atlas/database)
- Screenshots for our hosted database on MongoDB Atlas (using Compass) can be found in the repository under [MongoDB_Screenshots](https://github.com/knazario/Project_3_Team_1/tree/main/MongoDB_Screenshots).
- The screenshots include a summary screenshot showing all the collections in the Project 3 databae. Additionally, there is a more detailed view screenshot for each type of collection (EV Station, Census, Registration...etc.).

## Project Overview
This project invovled created several interactive charts and maps related to EV Charging Stations and EV Vehichle Acquisition/Ownersihp. Visuals created include: 
- Interactive map with a choropleth of zip code boundaries showing population density along with the locations of EV charging stations in 2018 and 2022
- Side-by-side view of the interactive map to better visualize changes over time (2018 map and 2022 map) 
- Charts showing changes from 2018-2022 related to EV car acquisition (through car registation data)
- Interactive map showing nearby coffee shops to a subset of charging stations (Tesla network)

Note: For all maps, information about the layers and markers will pop-up when clicked on. 

## Instructions
Click [this link](https://knazario.github.io/Project_3_Team_1/) to be redirected to our project page. Here, the user can see our map of Washington State, broken down by zip code with red markers identifying the location of EV charging stations (2018 data). The color-fill for each zip code is dependent on the population in that zip code. Filter options located in the upper-right corner of the map allow the user to select which year (2018 or 2022) they would like to see EV station markers, as well as population information for each zip code. Users can also choose to dispaly individual markers for the year and/or add a marker cluser layer to clusters of stations across the state. 

On the left side of the page, we created a sidebar where the user can navigate to:
- A side-by-side view of our maps, which gives an alternative view to compare the changes in both EV charger locations as well as population changes by zip code from 2018 to 2022
- Two graphical representations of EV registration data over 5 years:
    - A bar chart showing the difference between EV and Non-EV registartions
    - A line chart showing the growth trend of EVs
- An interactive map highlighting several Tesla charging stations around the sate, as well as information on coffee shops and services nearby those charging stations

## Analysis
- Based off the information we gathered, there does seem to be an ever-growing increase of EV registrations, as well as an increase of EV charging stations around the State of Washington. This indicates to us that electric vehicles are indeed becoming more and more popular, and we believe that with the improvements and higher number of charging stations (as well as facilities, services, and food options around those charging stations), the adoption rate of electric vehicles will continue to grow into the future. Right now, the highest concentrations of charging stations and EV registrations seems to be in more dense urban areas, however the trend is consistent across even the more rural areas where charging stations are becoming more and more accessible.

## Code Sources
- [Leaflet Documentation](https://leafletjs.com/reference.html): Documentation directly in leaflet provided samples and code snippets that were very useful in our project, including but not limited to: leaflet plugins utilized, scale control, legend control, zoom levels
- [Leaflet Basemaps](https://github.com/leaflet-extras/leaflet-providers): Provided resource for additional base layer maps for potential use
- [Set Max Bounds](https://gis.stackexchange.com/questions/179630/setting-bounds-and-making-map-bounce-back-if-moved-away): Provided sample/guide for setting map maxBounds option
- [Additional parameters to onEachFeature & Style for GeoJSON layers](https://stackoverflow.com/questions/46580213/pass-a-parameter-to-oneachfeature-leaflet): Example provided inspiration for creating a function within a function to pass additional parameters to style and bind relevant info for the zipcode layers of the EV stations map
- [Geographic Information Systems Stack Exchange](https://gis.stackexchange.com/questions/179630/setting-bounds-and-making-map-bounce-back-if-moved-away)
- [Stack Overflow](https://stackoverflow.com/questions/46580213/pass-a-parameter-to-oneachfeature-leaflet)


## Ethical Considerations
- We took the ethical handling of our data very seriously for this project. We made sure to only use publicly-available data, sourced from open-source government websites. Privacy is one of our top priorities, and none of the data used contains personally identifiable information or anything that could potentially identify any individuals or groups. We have repurposed this data for instructional and educational purposes only, and will never use it for any monetization or commercial purposes. The preparation of our data was done simply to filter and extract the most relevant information for our project (narrowing our data only to the State of Washington), and none of the data was altered in any way that would compromise the accuracy or anonymity of the source data.
