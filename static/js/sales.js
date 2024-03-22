async function getData() {
    try {
        const response = await fetch('./data/EV_Sales_data/sales.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('There was a problem with your fetch operation:', error);
        return null;
    }
}

function setupChartJs(jsonData) {
    var startDate = new Date('2018-01-31')
    var endDate = new Date('2022-12-31')

    var aggreateByDate = jsonData.reduce((acc, item) => {
        var itemDate = new Date(item.Date)
        if (itemDate >= startDate && itemDate <= endDate) {
            if (!acc[item.Date]) {
                acc[item.Date] = {evTotal: 0, nonEvTotal:0}
            }
            acc[item.Date].evTotal += item["Electric Vehicle (EV) Total"]
            acc[item.Date].nonEvTotal += item["Non-Electric Vehicle Total"]
        }
        return acc;
    }, {});

    var labels = Object.keys(aggreateByDate).sort();
    var evData = labels.map(label => aggreateByDate[label].evTotal)
    var nonEvData = labels.map(label => aggreateByDate[label].nonEvTotal)


    var ctx = document.getElementById('sales-chart');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Electric Vehicles",
                    data: evData,
                    backgroundColor: 'rgb(59,180,64)',
                    borderColor: 'transparent',
                    borderWidth: 1
                },
                {
                    label: "Non-Electric Vehicles",
                    data: nonEvData,
                    backgroundColor: 'rgba(234,59,59,0.72)',
                    borderColor: 'transparent',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                x: {
                    stacked: true,
                    ticks: {
                        color: 'rgb(0,40,5)',
                    }
                },
                y: {
                    stacked: true,
                    type: 'logarithmic',
                    ticks: {
                        callback: function(value, index) {
                            if (value === 10 || value === 100 || value === 1000 || value === 10000 || value === 100000 || value === 1000000) {
                                return value.toLocaleString();
                            }
                        },
                        color: 'rgb(0,40,5)',
                    },
                },
            },
            legend: {display: false},
            title: {
                display: true,
                text: 'Predicted world population (millions) in 2050'
            }
        }
    });

    var ctx2 = document.getElementById('sales-charts');

    new Chart(ctx2, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Electric Vehicles",
                    data: evData,
                    backgroundColor: 'rgb(103,180,59)',
                    borderColor: 'rgb(20,56,3)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                x: {
                    stacked: true,
                    ticks: {
                        color: 'rgb(0,40,5)',
                    }
                },
                y: {
                    stacked: true,
                    ticks: {
                        color: 'rgb(0,40,5)',
                    }
                },
            },
            legend: {display: false},
            title: {
                display: true,
                text: 'Predicted world population (millions) in 2050'
            }
        }
    });
}

(async function start() {
    var data = await getData()
    setupChartJs(data)
})()




