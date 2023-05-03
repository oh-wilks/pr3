export const API_ENDPOINT = "https://api.binance.com/api/v3";
const ERROR_TICKER_PRICE = "Failed to get ticker price";
const ERROR_KLINES = "Failed to get klines";

let chart = null;

class BinanceAPI {
  async getTickerPrice(symbol) {
    const apiUrl = `${API_ENDPOINT}/ticker/price?symbol=${symbol}`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(ERROR_TICKER_PRICE);
    }
    const { price } = await response.json();
    if (!price) {
      throw new Error(ERROR_TICKER_PRICE);
    }
    return parseFloat(price).toLocaleString(undefined, {
      maximumFractionDigits: 2,
    });
  }

  async getKlines(symbol, interval, limit) {
    const apiUrl = `${API_ENDPOINT}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      const prices = data.map(
        ([
          timestamp,
          open,
          high,
          low,
          close,
          volume,
          closeTime,
          assetVolume,
          trades,
          buyBaseVolume,
          buyAssetVolume,
          ignored,
        ]) => ({
          date: timestamp,
          price: parseFloat(close),
        })
      );
      return prices;
    } catch (error) {
      console.error(error);
      throw new Error(ERROR_KLINES);
    }
  }
  
}

class TickerManager {
  constructor(tickerId) {
    this.tickerElement = document.getElementById(tickerId);
    this.api = new BinanceAPI();
  }

  async updateTicker(symbol) {
    if (typeof symbol !== "string" || symbol.length === 0) {
      throw new Error("Invalid symbol");
    }
    try {
      this.tickerElement.innerHTML = '<div class="spinner"></div>';
      const price = await this.api.getTickerPrice(symbol);
      this.tickerElement.textContent = `$ ${price}`;
    } catch (error) {
      console.error(error);
      this.tickerElement.textContent = "Error loading ticker value";
    }
  }
}

export class ChartManager {
  constructor(canvasId, tickerId) {
    this.tickerElement = document.getElementById(tickerId);
    if (!this.tickerElement) {
      throw new Error(`Invalid ticker ID: ${tickerId}`);
    }
    this.canvas = this.canvas = document.getElementById("myChart");
    if (!this.canvas) {
      throw new Error(`Invalid canvas ID: ${canvasId}`);
    }
    this.ctx = this.canvas.getContext("2d");
    this.api = new BinanceAPI();
  }

  async createChart(symbol, interval, limit) {
    if (
      typeof symbol !== "string" ||
      typeof interval !== "string" ||
      typeof limit !== "number"
    ) {
      throw new Error("Invalid input parameters");
    }
    // spinner
    this.canvas.insertAdjacentHTML("afterend", '<div class="spinner"></div>');
    let prices = await this.api.getKlines(symbol, interval, limit);
    prices = prices.map((item) => item.price);
  
    let date = await this.api.getKlines(symbol, interval, limit);
    date = date.map((item) => item.date);
  
    date = date.map((unixTimestamp) => {
      const date = new Date(unixTimestamp);
      return date.toISOString().slice(0, 10);
    });
  
    let color = "#808080";
    if (prices[0] < prices[prices.length - 1]) {
      color = "#6cc070"; 
    } else if (prices[0] > prices[prices.length - 1]) {
      color = 	"	#ff6633"; 
    }

    const priceChange = (prices[prices.length - 1] - prices[0]).toLocaleString(undefined, {maximumFractionDigits: 2, minimumFractionDigits: 2});
    localStorage.setItem('priceChange', priceChange);
    const percentChange = ((prices[prices.length - 1] - prices[0]) / prices[0] * 100).toFixed(2) + '%';
    localStorage.setItem('percentChange', percentChange);
    // Retrieve the values from local storage
    localStorage.getItem('priceChange');
    localStorage.getItem('percentChange');

    // Display the values in the HTML element
    document.getElementById('priceChange').textContent = ` ${priceChange} | ${percentChange}`;

    if (chart) {
      chart.destroy();
    }
    chart = new Chart(this.ctx, {
      type: "line",
      data: {
        labels: date,
        datasets: [
          {
            label: symbol,
            data: prices,
            fill: false,
            borderColor: color,
            tension: 0.1,
          },
        ],
      },
      options: {
        scales: {
          x: {
            grid: {
              color: "#ede8e8",
            },
          },
          y: {
            ticks: {
              callback: (value) => "$ " + value.toLocaleString(),
            },
            grid: {
              color: "#ede8e8",
            },
          },
        },
      },
    });
    document.querySelector(".spinner").remove();
  }
}
import { populateTickerSelect } from "./tickerDropDown.js";
import { intervalsArr } from "./dateInterval.js";

// inicializacion de grafico,
window.addEventListener("load", async () => {
  const chartManager = new ChartManager("myChart", "eth-value");
  let selectedValue = null;

  populateTickerSelect(value => {
    selectedValue = value;
    chartManager.createChart(selectedValue, "1w", 52);
  });

  intervalsArr.forEach(({ btnId, interval, limit }) => {
    const intervalBtn = document.getElementById(btnId);
    intervalBtn.addEventListener("click", () => {
      chartManager.createChart(selectedValue, interval, limit);
    });
  });
});


const ticker_btcusdt = new TickerManager("btc-value");
ticker_btcusdt.updateTicker("BTCUSDT");

// Ejemplo con ETH
const ticker_ethusdt = new TickerManager("eth-value");
ticker_ethusdt.updateTicker("ETHUSDT");

const ticker_dogeusdt = new TickerManager("doge-value");
ticker_dogeusdt.updateTicker("DOGEUSDT");

const ticker_ltcusdt = new TickerManager("ltc-value");
ticker_ltcusdt.updateTicker("LTCUSDT");

export default { BinanceAPI, ChartManager };
