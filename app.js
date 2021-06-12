import Coin from "./coinClass.js";
import createChart from "./chart.js";

(function initialize() {
	const coin1 = new Coin("bitcoin", "bitcoin", "btc", "#d7385e", "crypto1");
	const coin2 = new Coin("ethereum", "ethereum", "eth", "#edc988", "crypto2");

	async function requestLiveData() {
		const request = await fetch(
			`https://api.coingecko.com/api/v3/simple/price?ids=${coin1.id}%2C${coin2.id}&vs_currencies=usd&include_market_cap=true`
		);
		const data = await request.json();
		coin1.updateLiveData(data[coin1.id]);
		coin2.updateLiveData(data[coin2.id]);
	}

	/* Time Range Selection */
	let range = 0;
	function rangeController() {
		const rangesButtons = document.querySelectorAll(".range");

		rangesButtons.forEach((button) => {
			button.addEventListener("click", (e) => {
				const active = document.querySelector(".range--active");
				range = button.dataset.range;
				console.log(range);
				if (e.target !== active) {
					active.classList.remove("range--active");
					button.classList.add("range--active");
					createChart([coin1, coin2], range);
				}
			});
		});
	}

	function selectionController(coinsArr) {
		coinsArr.forEach((coin) => {
			coin.selectBtn.querySelectorAll(".options__coin").forEach((btn) => {
				btn.addEventListener("click", (e) => {
					const { name, symbol, id } = e.currentTarget.dataset;
					coin.name = name;
					coin.symbol = symbol;
					coin.id = id;
					coin.updateUI().then(() => createChart([coin1, coin2], range));
				});
			});
		});
	}

	/* Initialize */

	(async () => {
		rangeController();
		coin1.init();
		await coin1.updateUI();
		coin2.init();
		await coin2.updateUI();
		selectionController([coin1, coin2]);
		createChart([coin1, coin2], range);
	})().catch((err) => console.log(err));

	setInterval(() => {
		requestLiveData();
	}, 10000);
})();
