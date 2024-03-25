let data = fetch('./data/EV_Sales_data/sales.json')
    .then(response => response.json())
    .then(data => {
        console.log(data)
        const date = data.map(element => element.Date)
        console.log(date)
        function removeDuplicates(arr) {
            return arr.filter((item,
                index) => arr.indexOf(item) === index);
        }
        // console.log(removeDuplicates(date));

        let uniqueDates = removeDuplicates(date)
        uniqueDates.sort((a, b) => {
            return new Date(a) - new Date(b)
          })
        //   console.log(uniqueDates)
        let totalVehiclesArray = []

        let totalEVArray = []

        uniqueDates.forEach((date) => {
            let filteredObjects = data.filter(x => x.Date == date)
            // console.log(filteredObjects)
            let totalVehicles = 0
            let totalEV = 0
            for (let i = 0; i < filteredObjects.length; i++) {
                totalVehicles += filteredObjects[i]['Total Vehicles'];
                totalEV += filteredObjects[i]['Electric Vehicle (EV) Total'];
              }
            //   console.log(date, totalVehicles)
              totalVehiclesArray.push(totalVehicles)
              totalEVArray.push(totalEV)
        })
       
        var trace1 = {
            x: uniqueDates,
            y: totalVehiclesArray,
            name: 'Total Vehicles',
            type: 'bar'
          };
          
          var trace2 = {
            x: uniqueDates,
            y: totalEVArray,
            name: 'Total EVs',
            type: 'bar'
          };
          
          var bardata = [trace1, trace2];
          
          var barlayout = {barmode: 'stack'};
          
          Plotly.newPlot('plot', bardata, barlayout);
          
          var bardata2 = [
            {
              x: uniqueDates,
              y: totalEVArray,
              type: 'bar'
            }
          ];
          
          Plotly.newPlot('plot2', bardata2);
          
        
        const county = data.map(element => element.County)
        const bev = data.map(element => element["Battery Electric Vehicles (BEVs)"])
        const ev = data.map(element => element["Electric Vehicle (EV) Total"])
        const nonEv = data.map(element => element["Non-Electric Vehicle Total"])
        const percentEV = data.map(element => element["Percent Electric Vehicles"])
        const phev = data.map(element => element["Plug-In Hybrid Electric Vehicles (PHEVs)"])
        const total = data.map(element => element["Total Vehicles"])

        var monthlyTotalEV = {};
        var monthlyTotalBEV ={};
        var monthlyTotalPHEV = {};
        var monthlyTotalNonEV = {};
        var monthlyTotalAll = {};

        data.forEach((element) => {
        if (monthlyTotalEV[date]) {
            monthlyTotalEV[date] += ev;
        } else {
            monthlyTotalEV[date] = ev;
            }
        // console.log(monthlyTotalEV)
        });  
    
        // const layout = {
        //     title: 'Percentage of EVs Registered Through Washington State DMV',
        //     xaxis: {title: 'Month'},
        //     yaxis: {title: 'Percentage'}
        // };

        // var config = {responsive : true}

        // var trace = {
        
        // };

        // Plotly.newPlot("plot", [trace], layout, config);
    
    })


    // Create hover texbox with breakdown for each bar

    // Create dropdown to filter data by County