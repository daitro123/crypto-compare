const chart = document.getElementById("lineChart");
const customSelect = document.querySelectorAll(".custom-select");
let coinsArr = [
	{
		name: "bitcoin",
		id: "bitcoin",
		symbol: "btc",
		color: "#d7385e",
		data: {
			prices: [],
			market_caps: [],
			total_volumes: [],
		},
		liveData: {
			usd: 0,
			usd_market_cap: 0,
		},
		updateID() {
			this.id = findCryptoID(this.symbol);
		},
	},
	{
		name: "ethereum",
		id: "ethereum",
		symbol: "eth",
		color: "#edc988",
		data: {
			prices: [],
			market_caps: [],
			total_volumes: [],
		},
		liveData: {
			usd: 0,
			usd_market_cap: 0,
		},
		updateID() {
			this.id = findCryptoID(this.symbol);
		},
	},
];
let lineChart;
let range = 0;

/*  Populate select crypto with currencies  */

function fillTopList(array) {
	const optionsCoinsEl = document.querySelectorAll(".custom-options--coins");
	array.forEach((coin) => {
		const coinEl = `<div class="custom-options__coin" data-name="${coin.name.toLowerCase()}" data-symbol="${coin.symbol.toLowerCase()}" >
							<img class="custom-options__coin-icon" src="/icons/${coin.symbol.toLowerCase()}.png" />
							<div class="custom-options__coin-name">${coin.name}</div>
						</div>`;
		optionsCoinsEl.forEach((option) => option.insertAdjacentHTML("beforeend", coinEl));
	});
}

fillTopList(top50Crypto);

/*  Event listener for select buttons  */

customSelect.forEach((button) => {
	button.addEventListener("click", (e) => {
		button.querySelector(".custom-options").classList.toggle("visible");

		// closes other selections
		document.querySelectorAll(".visible").forEach((element) => {
			if (e.target.querySelector(".custom-options") !== element) {
				element.classList.remove("visible");
			}
		});
	});
});

/*  Event listeners for cryptocurrencies main and secondary  */

const titles1 = document.querySelectorAll(".crypto1-name");
const titles2 = document.querySelectorAll(".crypto2-name");
const icon1 = document.getElementById("crypto1-icon");
const icon2 = document.getElementById("crypto2-icon");
const coinButtons = document.querySelectorAll(".custom-options__coin");

function updateUI(elementArr, name, icon, symbol) {
	elementArr.forEach((element) => (element.textContent = name));
	icon.src = `/icons/${symbol}.png`;
	icon.animate(
		[{ transform: "scale(1.2)" }, { transform: "scale(1.8)" }, { transform: "scale(1)" }],
		{
			duration: 600,
			easing: "ease",
			fill: "forwards",
		}
	);
}

function findCryptoID(symbol) {
	const obj = cryptoIDs[cryptoIDs.findIndex((coin) => coin.symbol === symbol.toLowerCase())];
	return obj.id;
}

coinButtons.forEach((button) => {
	button.addEventListener("click", (e) => {
		const coinSymbol = e.currentTarget.dataset.symbol;
		const coinName = e.currentTarget.dataset.name;
		if (e.currentTarget.parentNode.id === "crypto1") {
			coinsArr[0].symbol = coinSymbol;
			coinsArr[0].name = coinName;
			coinsArr[0].updateID();
			requestData(0);
			updateUI(titles1, coinName, icon1, coinSymbol);
		} else {
			coinsArr[1].symbol = coinSymbol;
			coinsArr[1].name = coinName;
			coinsArr[1].updateID();
			requestData(1);
			updateUI(titles2, coinName, icon2, coinSymbol);
		}
		requestLiveData();
	});
});

/*  Format currency to USD  */

function formatCurrency(value, currency, digits) {
	const formatter = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: currency,
		minimumFractionDigits: digits,
	});
	return formatter.format(value);
}

/*  Create array from API data  */

function getDates(data, data_value) {
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

/* CHART Prep functions */

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

function createChart(datasetArr) {
	lineChart = new Chart(chart, {
		type: "line",
		data: {
			labels: getDates(coinsArr[0].data, "market_caps"),
			datasets: [...datasetArr],
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
								// millisecond: "DD MMM YY",
								// second: "DD MMM YY",
								// minute: "DD MMM YY",
								hour: "DD MMM YY",
								day: "DD MMM YY",
								// week: "DD MMM YY",
								// month: "DD MMM YY",
								// quarter: "DD MMM YY",
								// year: "DD MMM YY",
							},
						},
					},
				],
			},
		},
	});
	Chart.defaults.global.defaultFontFamily = "'Noto Sans KR', sans-serif";
}

/* QUERY API data for one line on chart */

function toggleLoadingBar() {
	const loadingEl = document.querySelector(".lds-container");
	loadingEl.classList.toggle("lds-container--visible");
}

async function requestData(order) {
	try {
		toggleLoadingBar();

		const request = await fetch(
			`https://api.coingecko.com/api/v3/coins/${coinsArr[order].id}/market_chart?vs_currency=usd&days=max&interval=daily`
		);

		const data = await request.json();

		coinsArr[order].data = data;

		createChart(prepareChartDataset(coinsArr));

		toggleLoadingBar();
	} catch (error) {
		alert("An error has occured when fetching data");
		console.log(error);
	}
}

/* QUERY API live */

async function requestLiveData() {
	const request = await fetch(
		`https://api.coingecko.com/api/v3/simple/price?ids=${coinsArr[0].id}%2C${coinsArr[1].id}&vs_currencies=usd&include_market_cap=true`
	);
	const data = await request.json();
	coinsArr[0].liveData = data[coinsArr[0].id];
	coinsArr[1].liveData = data[coinsArr[1].id];
	updateLiveData();
}

/* Update live data */

const mc1 = document.querySelector(".current-mc__crypto1-mc");
const price1 = document.querySelector(".current-price__crypto1-price");
const mc2 = document.querySelector(".current-mc__crypto2-mc");
const price2 = document.querySelector(".current-price__crypto2-price");

function updateLiveData() {
	price1.textContent = formatCurrency(coinsArr[0].liveData.usd, "USD", 2);
	mc1.textContent = formatCurrency(coinsArr[0].liveData.usd_market_cap, "USD", 0);
	price2.textContent = formatCurrency(coinsArr[1].liveData.usd, "USD", 2);
	mc2.textContent = formatCurrency(coinsArr[1].liveData.usd_market_cap, "USD", 0);
}

/* Time Range Selection */

const rangesButtons = document.querySelectorAll(".range");

rangesButtons.forEach((button) => {
	button.addEventListener("click", (e) => {
		const active = document.querySelector(".range--active");
		range = button.dataset.range;
		if (e.target !== active) {
			active.classList.remove("range--active");
			button.classList.add("range--active");
			createChart(prepareChartDataset(coinsArr));
		}
	});
});

/* Initialize */

requestData(0);
requestData(1);
requestLiveData();

setInterval(() => {
	requestLiveData();
}, 30000);
