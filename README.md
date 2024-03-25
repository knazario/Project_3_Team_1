# UC Berkeley Data Analytics Bootcamp Project #3- Team 1
## Analysis and visualizations of EV charging stations in relations to population, as well as visualization of services around charging stations and a breakdown of electric vehicle registration information in Washington State. 

## Why did we choose this topic?
Electric cars have been noticeably on the incline in the last decade. With strong efforts by governments worldwide to go green and the incentivization of regenerative energy sources, our team was interested in the rate of change of the increase of electric cars along with the development of charging stations throughout the state of Washington. 

## Data Sources
We honed in on Washington State as registered car data was more publicly accessible. Sources being used are: 
- EV Charging Station Information: [Alternative Fuels Data Center](https://afdc.energy.gov/stations/states)
- EV Registration Data: [State of Washington Open Data Portal- EV Registrations by County](https://data.wa.gov/Transportation/Electric-Vehicle-Population-Size-History-By-County/3d5d-sdqb/about_data)
- Zip Code Population Data: [US Census Bureau American Community Survey 5-Year Data](https://www.census.gov/data/developers/data-sets/acs-5year.html)

## Libraries & Plugins Used
- [Leaflet Marker Cluster](https://github.com/Leaflet/Leaflet.markercluster)- This plugin allowed us to create clustered groups of markers for the EV stations so that visually you are able to see the number of clusters in an area on the map and declutter the map. When you zoom in on a cluster, you can see and interact with individual EV stations as you would regular markers.
- [Leaflet - Grouped Layer Control](https://github.com/ismyrnow/leaflet-groupedlayercontrol/tree/gh-pages)- This plugin provided a way to group layers in our layer control box so that you can toggle the different years on and off as a unit (i.e. 2018 layers). This makes interacting with the map more intuitive and user-friendly.
- [Leaflet- Sync](https://github.com/jieter/Leaflet.Sync)- This plugin provides a way to sync the movement of 2 or more maps on the same page. For our side-by-side map view of the EV stations, this allowed the maps to zoom and move together so that the user can compare 2018 and 2022 side-by-side.
- [Leaflet Reset-View](https://github.com/drustack/Leaflet.ResetView)- This plugin allows you to create a simple reset button below the zoom buttons that will reset your view to the original view. This makes it easy to reset the map back to the entire state of Washington once you’ve zoomed in.
- [Geoapify API Documentation](https://apidocs.geoapify.com/docs/place-details/#api/)
- [Chart.js](https://www.chartjs.org/)

## Database used to host our project
- [MongoDB Atlas](https://www.mongodb.com/atlas/database)

We plan to use a map with filters that are including but not limited to: 
- Population density - by zipcode
- Charging stations - markers that show each station 
- Restaurants - Amount & relative distance to charging stations
- Entertainment - Amount & relative distance to charging stations

## Ethical Considerations
- We take the ethics of data...
