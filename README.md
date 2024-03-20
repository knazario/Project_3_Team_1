# Project_3_Team_1

Electric cars have been noticeably on the incline in the last decade. With strong efforts by governments worldwide to go green and the incentivization of regenerative energy sources, our team was interested in the rate of change of the increase of electric cars along with the development of charging stations throughout the country. 

We honed in on Washington as registered car data was more publicly accessible in Washington. Sources being used are: 
- [Alternative Fuels Data Center](https://afdc.energy.gov/data)
- [Geoapify API Documentation](https://apidocs.geoapify.com/docs/place-details/#api/)
- [Washington State Government Data](https://data.wa.gov/api/views/3d5d-sdqb/rows.json?accessType=DOWNLOAD)

We plan to use a map with filters that are including but not limited to: 
- Population density - by zipcode
- Charging stations - markers that show each station 
- Electric Vehicles - number of electric vehicles registered in each county 
- Restaurants - Amount & relative distance to charging stations
- Entertainment - Amount & relative distance to charging stations

Some of the actual visualizations could be: 
- Chloropleth that can show population density by county, number of EVs by county, and ratios of each variable by county. 
- Heatmap by county/zipcode population. 
- EV charging stations that will be individual pins when zoomed in -> clusters when zoomed out. 
    - Will have specific information per station

These will all be displayed on Leaflet using basic filterable players that users can tick through to see specific information.
