import { formatCurrency } from "./utils.js";

const ctx = document.getElementById("lineChart");

function getDates(data, data_value, range) {
	let arr = data[data_value];

	if (range !== 0) {
		arr = arr.slice(-range);
	}

	let datesArr = [];
	arr.forEach((item) => {
		let date = new Date(item[0]);
		datesArr.push(date);
	});
	return datesArr;
}

function prepareXYData(data) {
	let XYarray = [];

	data.forEach((dataPoint) => {
		let XY = {
			t: dataPoint[0], // t as time instead of x
			y: dataPoint[1],
		};
		XYarray.push(XY);
	});
	return XYarray;
}

let lineChart;

function createChart(coinsArr, range) {
	function prepareChartDataset(coinsArr) {
		let datasetArr = [];
		if (lineChart) lineChart.destroy(); // removes previous chart data

		//copy of data
		const marketCapsArr = [coinsArr[0].data.market_caps, coinsArr[1].data.market_caps];
		if (range !== 0) {
			marketCapsArr[0] = marketCapsArr[0].slice(-range);
			marketCapsArr[1] = marketCapsArr[1].slice(-range);
		}

		for (let i = 0; i < coinsArr.length; i++) {
			datasetArr[i] = {
				fillColor: `${coinsArr[i].color}`,
				fill: false,
				label: `${coinsArr[i].name.toUpperCase()}`,
				backgroundColor: `${coinsArr[i].color}`,
				borderColor: `${coinsArr[i].color}`,
				borderWidth: 3,
				pointRadius: 0,
				lineTension: 0,
				data: prepareXYData(marketCapsArr[i]),
			};
		}
		return datasetArr;
	}

	lineChart = new Chart(ctx, {
		type: "line",
		data: {
			labels: getDates(coinsArr[0].data, "market_caps", range),
			datasets: [...prepareChartDataset(coinsArr)],
		},
		options: {
			onResize: () => {
				if (window.innerWidth < 700) {
					lineChart.options.scales.xAxes[0].ticks.maxRotation = 90;
				} else {
					lineChart.options.scales.xAxes[0].ticks.maxRotation = 0;
				}
			},

			maintainAspectRatio: false,
			legend: {
				position: "bottom",
				labels: {
					fontColor: "rgba(189,189,189,1)",
					padding: 25,
					boxWidth: 30,
					fontSize: 14,
					fontStyle: "bold",
				},
			},
			tooltips: {
				callbacks: {
					label: function (toolTipItem) {
						return formatCurrency(parseFloat(toolTipItem.value), "USD", 0);
					},
				},
			},
			scales: {
				yAxes: [
					{
						ticks: {
							callback: function (value, index, values) {
								return formatCurrency(value / 1000000000, "USD", 0) + " bn";
							},
							fontColor: "rgba(189,189,189,0.5)",
							fontSize: 12,
							maxTicksLimit: 8,
							padding: 15,
							fontStyle: "bold",
						},
						gridLines: {
							display: true,
							color: "rgba(232,232,232,0.5)",
							lineWidth: 1,
							zeroLineWidth: 0,
							zeroLineColor: "rgba(232,232,232,0.5)",
							tickMarkLength: 0,
						},
					},
				],
				xAxes: [
					{
						ticks: {
							maxTicksLimit: 8,
							fontSize: 12,
							fontColor: "rgba(189,189,189,0.5)",
							padding: 15,
							minRotation: 0,
							maxRotation: window.innerWidth < 700 ? 75 : 0,
							fontStyle: "bold",
						},
						gridLines: {
							display: true,
							color: "rgba(232,232,232,0.5)",
							lineWidth: 1,
							zeroLineWidth: 0,
							tickMarkLength: 0,
						},
						type: "time",
						time: {
							displayFormats: {
								hour: "DD MMM YY",
								day: "DD MMM YY",
							},
						},
					},
				],
			},
		},
	});
	Chart.defaults.global.defaultFontFamily = "'Noto Sans KR', sans-serif";
}

export default createChart;
