const chart = document.getElementById("lineChart");
const customSelect = document.querySelectorAll(".custom-select");
const ctx = chart.getContext("2d");

const gradient = ctx.createLinearGradient(0, 0, 0, 600);
gradient.addColorStop(0, "rgba(75, 192, 192, 1)");
gradient.addColorStop(1, "rgba(75, 192, 192, 0)");

/*  Populate select crypto with currencies  */

function fillTopList(array) {
	const optionsCoinsEl = document.querySelectorAll(".custom-options--coins");
	array.forEach((coin) => {
		const coinEl = `<div class="custom-options__coin">
							<img class="custom-options__coin-icon" src="/icons/${coin.symbol}.png" />
							<div class="custom-options__coin-name">${coin.name}</div>
						</div>`;
		optionsCoinsEl.forEach((option) => option.insertAdjacentHTML("beforeend", coinEl));
	});
}

fillTopList(top50Crypto);

/*  Event listener for select buttons  */

customSelect.forEach((button) => {
	button.addEventListener("click", (e) => {
		console.log(e.target);
		button.querySelector(".custom-options").classList.toggle("visible");

		// closes other selections
		document.querySelectorAll(".visible").forEach((element) => {
			if (e.target.querySelector(".custom-options") !== element) {
				element.classList.remove("visible");
			}
		});
	});
});

function formatCurrency(value, currency) {
	const formatter = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: currency,
		minimumFractionDigits: 0,
	});
	return formatter.format(value);
}

function getDates(data, data_value) {
	let arr = data[data_value];
	let datesArr = [];
	arr.forEach((item) => {
		let date = new Date(item[0]);
		let formattedDate =
			date.getDate() +
			" " +
			date.toLocaleString("default", { month: "short" }) +
			" " +
			date.getFullYear().toString().substr(2, 2);

		datesArr.push(formattedDate);
	});
	return datesArr;
}

function getPrices(data, data_value) {
	let arr = data[data_value];
	let pricesArr = [];
	arr.forEach((item) => {
		pricesArr.push(item[1]);
	});
	return pricesArr;
}

let lineChart = new Chart(chart, {
	type: "line",
	data: {
		labels: getDates(iotaData, "market_caps"),
		datasets: [
			{
				fillColor: "rgba(75, 192, 192, 1)",
				fill: true,
				label: "IOTA",
				backgroundColor: "rgba(75, 192, 192, 0.5)",
				borderColor: "rgba(75, 192, 192, 1)",
				borderWidth: 3,
				pointRadius: 0,
				lineTension: 1,
				data: getPrices(iotaData, "market_caps"),
			},
			{
				fillColor: "orangered",
				fill: true,
				label: "Monero",
				backgroundColor: "rgba(255,69,0, 0.5)",
				borderColor: "orangered",
				borderWidth: 3,
				pointRadius: 0,
				lineTension: 1,
				data: getPrices(moneroData, "market_caps"),
			},
		],
	},
	options: {
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
					return formatCurrency(parseFloat(toolTipItem.value), "USD");
				},
			},
		},
		scales: {
			yAxes: [
				{
					ticks: {
						callback: function (value, index, values) {
							return formatCurrency(value / 1000000000, "USD") + " bn";
						},
						fontColor: "rgba(189,189,189,0.5)",
						fontSize: 12,
						maxTicksLimit: 8,
						precision: 0,
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
						maxRotation: 0,
						fontStyle: "bold",
					},
					gridLines: {
						display: true,
						color: "rgba(232,232,232,0.5)",
						lineWidth: 1,
						zeroLineWidth: 0,
						tickMarkLength: 0,
					},
				},
			],
		},
	},
});
Chart.defaults.global.defaultFontFamily = "'Noto Sans KR', sans-serif";
