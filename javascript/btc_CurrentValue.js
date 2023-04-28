const API_ENDPOINT = "https://api.binance.com/api/v3";
const ERROR_TICKER_PRICE = "Failed to get ticker price";
const ERROR_KLINES = "Failed to get klines";
const dateInterval = document.getElementById("dateInterval");
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
    return parseFloat(price).toLocaleString(undefined, { maximumFractionDigits: 2 });
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
      console.log(data);
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

class ChartManager {
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
    prices = prices.map(item => item.price);

    let date = await this.api.getKlines(symbol, interval, limit);
    date = date.map(item => item.date);

     date = date.map((unixTimestamp) => {
      const date = new Date(unixTimestamp);
      return date.toISOString().slice(0, 10);
    });
    
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
            borderColor: "#808080",
            tension: 0.1,
            

          },
        ],
      },
      options: {
        scales: {
          x: {
            grid:{
              color:"#ede8e8"}
          },
          y: {
            ticks: {
              callback: (value) => "$ " + value.toLocaleString()

            },
            grid:{
              color:"#ede8e8"},
          },
        },
      },
    });
    document.querySelector(".spinner").remove();
  }
}


dateInterval.addEventListener("change", function(event) {
  
  const tickerSelect = document.getElementById("ticker-select");
  selectedValue = tickerSelect.value;

  interval = event.target.value;
  chart.destroy();
  
  const chartManager = new ChartManager("myChart", "ticker-select")
  switch (interval) {
    case "1h":
      chartManager.createChart(selectedValue, interval, 24);
      
      
      break;
    case "3d":
      chartManager.createChart(selectedValue, "1h", 72);
        
        
      break;
    case "1w":
      chartManager.createChart(selectedValue, "1d", 7);
        
        
      break;  
    case "1mo":
      chartManager.createChart(selectedValue, "1d", 30);
        
        
      break;
    
  }

  
  
})


// dropdown
async function populateTickerSelect(callback) {
  const apiUrl = `${API_ENDPOINT}/exchangeInfo`;
  const response = await fetch(apiUrl);
  const { symbols } = await response.json();

  const tickerSelect = document.getElementById("ticker-select");

  // ordenar alfabeticamente
  symbols.sort((a, b) => a.symbol.localeCompare(b.symbol));

  // agregar tickers al dropdown
  symbols.forEach(symbol => {
    const option = document.createElement("option");
    option.value = symbol.symbol;
    option.textContent = symbol.symbol;
    tickerSelect.appendChild(option);
  });

  tickerSelect.addEventListener("change", () => {
    const selectedValue = tickerSelect.value;
    callback(selectedValue);
  });
  // valor default
  const defaultValue = "BTCUSDT";
  callback(defaultValue);
}


// inicializacion de grafico, 
window.addEventListener("load", async () => {
  const chartManager = new ChartManager("myChart", "btc-value");
  populateTickerSelect(selectedValue => {
    chartManager.createChart(selectedValue, "1d", 30);
  });
});


const ticker_btcusdt = new TickerManager("btc-value");
ticker_btcusdt.updateTicker("BTCUSDT");

// Ejemplo con ETH
const ticker_ethusdt = new TickerManager("eth-value");
ticker_ethusdt.updateTicker("ETHUSDT");

export default BinanceAPI;
