import { formatCurrency } from "./utils.js";

export default class Coin {
	constructor(name, id, symbol, color, cssID) {
		this.name = name;
		this.id = id;
		this.symbol = symbol;
		this.color = color;
		this.cssID = cssID;
		this.titleEl = document.querySelectorAll(`.${this.cssID}-name`);
		this.iconEl = document.querySelector(`#${this.cssID}-icon`);
		this.selectBtn = document.getElementById(`${this.cssID}`);
		this.liveMarketCapEl = document.querySelector(`.current-mc__${this.cssID}-mc`);
		this.livePriceEl = document.querySelector(`.current-price__${this.cssID}-price`);
		this.loadingEl = document.querySelector(".lds-container");
	}

	data = { prices: [], market_caps: [], total_volumes: [] };
	liveData = { usd: 0, usd_market_cap: 0 };

	updateUI = async () => {
		await this.requestData();
		await this.requestLiveData();
		this.titleEl.forEach((title) => (title.textContent = this.name));
		this.iconEl.src = `/icons/${this.symbol}.png`;
		this.iconEl.animate(
			[{ transform: "scale(1.2)" }, { transform: "scale(1.8)" }, { transform: "scale(1)" }],
			{
				duration: 600,
				easing: "ease",
				fill: "forwards",
			}
		);
	};

	init() {
		/* Setup event listeners for coin selection */
		this.selectBtn.addEventListener("click", (e) => {
			this.selectBtn.querySelector(".options").classList.toggle("visible");

			// closes other selections
			document.querySelectorAll(".visible").forEach((element) => {
				if (e.target.querySelector(".options") !== element) {
					element.classList.remove("visible");
				}
			});
		});

		// prepare options
		top50Crypto.forEach((coin) => {
			const coinEl = `<div class="options__coin" data-name="${
				coin.name
			}" data-symbol="${coin.symbol.toLowerCase()}" data-id= "${coin.id}">
								<img class="options__coin-icon" src="/icons/${coin.symbol.toLowerCase()}.png" />
								<div class="options__coin-name">${coin.name}</div>
							</div>`;
			this.selectBtn.querySelector(".options").insertAdjacentHTML("beforeend", coinEl);
		});

		return this;
	}

	requestData = async () => {
		try {
			this.loadingEl.classList.add("lds-container--visible");
			const request = await fetch(
				`https://api.coingecko.com/api/v3/coins/${this.id}/market_chart?vs_currency=usd&days=max&interval=daily`
			);

			this.data = await request.json();
			this.loadingEl.classList.remove("lds-container--visible");
		} catch (error) {
			alert("An error has occured when fetching data");
			console.log(error);
		}
	};

	requestLiveData = async () => {
		const request = await fetch(
			`https://api.coingecko.com/api/v3/simple/price?ids=${this.id}&vs_currencies=usd&include_market_cap=true`
		);
		const data = await request.json();
		this.updateLiveData(data[this.id]);
	};

	updateLiveData(data) {
		this.liveData = data;
		this.livePriceEl.textContent = formatCurrency(this.liveData.usd, "USD", 2);
		this.liveMarketCapEl.textContent = formatCurrency(this.liveData.usd_market_cap, "USD", 0);
	}
}

const top50Crypto = [
	{
		rank: 1,
		name: "Bitcoin",
		symbol: "BTC",
		id: "bitcoin",
	},
	{
		rank: 2,
		name: "Ethereum",
		symbol: "ETH",
		id: "ethereum",
	},
	{
		rank: 3,
		name: "Tether",
		symbol: "USDT",
		id: "tether",
	},
	{
		rank: 4,
		name: "Cardano",
		symbol: "ADA",
		id: "cardano",
	},
	{
		rank: 5,
		name: "Polkadot",
		symbol: "DOT",
		id: "polkadot",
	},
	{
		rank: 6,
		name: "XRP",
		symbol: "XRP",
		id: "ripple",
	},
	{
		rank: 7,
		name: "Binance Coin",
		symbol: "BNB",
		id: "binancecoin",
	},
	{
		rank: 8,
		name: "Litecoin",
		symbol: "LTC",
		id: "litecoin",
	},
	{
		rank: 9,
		name: "Chainlink",
		symbol: "LINK",
		id: "chainlink",
	},
	{
		rank: 10,
		name: "Stellar",
		symbol: "XLM",
		id: "stellar",
	},
	{
		rank: 11,
		name: "Bitcoin Cash",
		symbol: "BCH",
		id: "bitcoin-cash",
	},
	{
		rank: 12,
		name: "Dogecoin",
		symbol: "DOGE",
		id: "dogecoin",
	},
	{
		rank: 13,
		name: "USD Coin",
		symbol: "USDC",
		id: "usd-coin",
	},
	{
		rank: 14,
		name: "Uniswap",
		symbol: "UNI",
		id: "unicorn-token",
	},
	{
		rank: 15,
		name: "Aave",
		symbol: "AAVE",
		id: "aave",
	},
	{
		rank: 16,
		name: "Wrapped Bitcoin",
		symbol: "WBTC",
		id: "wrapped-bitcoin",
	},
	{
		rank: 17,
		name: "Cosmos",
		symbol: "ATOM",
		id: "cosmos",
	},
	{
		rank: 18,
		name: "EOS",
		symbol: "EOS",
		id: "eos",
	},
	{
		rank: 19,
		name: "Bitcoin SV",
		symbol: "BSV",
		id: "bitcoin-cash-sv",
	},
	{
		rank: 20,
		name: "TRON",
		symbol: "TRX",
		id: "tron",
	},
	{
		rank: 21,
		name: "Synthetix Network Token",
		symbol: "SNX",
		id: "havven",
	},
	{
		rank: 22,
		name: "Avalanche",
		symbol: "AVAX",
		id: "avalanche-2",
	},
	{
		rank: 23,
		name: "NEM",
		symbol: "XEM",
		id: "nem",
	},
	{
		rank: 24,
		name: "Monero",
		symbol: "XMR",
		id: "monero",
	},
	{
		rank: 25,
		name: "Tezos",
		symbol: "XTZ",
		id: "tezos",
	},
	{
		rank: 26,
		name: "The Graph",
		symbol: "GRT",
		id: "golden-ratio-token",
	},
	{
		rank: 27,
		name: "IOTA",
		symbol: "MIOTA",
		id: "iota",
	},
	{
		rank: 28,
		name: "VeChain",
		symbol: "VET",
		id: "vechain",
	},
	{
		rank: 29,
		name: "Theta Network",
		symbol: "THETA",
		id: "theta-token",
	},
	{
		rank: 30,
		name: "Elrond",
		symbol: "EGLD",
		id: "elrond-erd-2",
	},
	{
		rank: 31,
		name: "Terra",
		symbol: "LUNA",
		id: "terra-luna",
	},
	{
		rank: 32,
		name: "NEO",
		symbol: "NEO",
		id: "neo",
	},
	{
		rank: 33,
		name: "Huobi Token",
		symbol: "HT",
		id: "huobi-token",
	},
	{
		rank: 34,
		name: "Solana",
		symbol: "SOL",
		id: "solana",
	},
	{
		rank: 35,
		name: "OKB",
		symbol: "OKB",
		id: "okb",
	},
	{
		rank: 36,
		name: "Compound",
		symbol: "COMP",
		id: "compound-coin",
	},
	{
		rank: 37,
		name: "Maker",
		symbol: "MKR",
		id: "maker",
	},
	{
		rank: 38,
		name: "cETH",
		symbol: "CETH",
		id: "compound-ether",
	},
	{
		rank: 39,
		name: "Celsius Network",
		symbol: "CEL",
		id: "celsius-degree-token",
	},
	{
		rank: 40,
		name: "Filecoin",
		symbol: "FIL",
		id: "filecoin",
	},
	{
		rank: 41,
		name: "Sushi",
		symbol: "SUSHI",
		id: "sushi",
	},
	{
		rank: 42,
		name: "Dai",
		symbol: "DAI",
		id: "dai",
	},
	{
		rank: 43,
		name: "Crypto.com Coin",
		symbol: "CRO",
		id: "crypto-com-chain",
	},
	{
		rank: 44,
		name: "FTX Token",
		symbol: "FTT",
		id: "freetip",
	},
	{
		rank: 45,
		name: "cDAI",
		symbol: "CDAI",
		id: "cdai",
	},
	{
		rank: 46,
		name: "Binance USD",
		symbol: "BUSD",
		id: "binance-usd",
	},
	{
		rank: 47,
		name: "UMA",
		symbol: "UMA",
		id: "uma",
	},
	{
		rank: 48,
		name: "Dash",
		symbol: "DASH",
		id: "dash",
	},
	{
		rank: 49,
		name: "Zcash",
		symbol: "ZEC",
		id: "zcash",
	},
	{
		rank: 50,
		name: "yearn.finance",
		symbol: "YFI",
		id: "yearn-finance",
	},
];
