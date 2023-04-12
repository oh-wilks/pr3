class BinanceAPI {
    constructor() {
      this.apiEndpoint = "https://api.binance.com/api/v3";
    }
  
    async getTickerPrice(symbol) {
      const apiUrl = `${this.apiEndpoint}/ticker/price?symbol=${symbol}`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data && data.price) {
        return parseFloat(data.price).toFixed(2);
      } else {
        throw new Error("Failed to get ticker price");
      }
    }
  
    async getKlines(symbol, interval, limit) {
      const apiUrl = `${this.apiEndpoint}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      const prices = data.map((d) => parseFloat(d[4]));
      return prices;
    }
  }
  class TickerManager {
    constructor(tickerId) {
        this.tickerElement = document.getElementById(tickerId);
        this.api = new BinanceAPI();
    }

    async updateTicker(symbol) {
        try {
          const price = await this.api.getTickerPrice(symbol);
          this.tickerElement.textContent = `$${price}`;
        } catch (error) {
          console.error(error);
          this.tickerElement.textContent = "Error loading ticker value";
        }
      }
  }

  class ChartManager {
    constructor(canvasId, tickerId) {
      this.tickerElement = document.getElementById(tickerId);
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas.getContext("2d");
      this.chart = null;
      this.api = new BinanceAPI();
    }
  
    async createChart(symbol, interval, limit) {
      const prices = await this.api.getKlines(symbol, interval, limit);
      if (this.chart) {
        this.chart.destroy(); // eliminar grafico
      }
      this.chart = new Chart(this.ctx, {
        type: "line",
        data: {
          labels: Array.from(Array(prices.length).keys()),
          datasets: [
            {
              label: symbol,
              data: prices,
              fill: false,
              borderColor: "#F0000",
              tension: 0.1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              ticks: {
                callback: function (value, index, values) {
                  return "$" + value.toLocaleString();
                },
              },
            },
          },
        },
      });
      this.updateTicker(symbol);
    }
  }
  
  // Ejemplo con BTC
  const chartManager = new ChartManager("myChart", "btc-value");
  chartManager.createChart("BTCUSDT", "1d", 30);

  const ticker_btcusdt = new TickerManager("btc-value")
  ticker_btcusdt.updateTicker("BTCUSDT")


  // Ejemplo con ETH

  const ticker_ethusdt = new TickerManager("eth-value")
  ticker_ethusdt.updateTicker("ETHUSDT")


  
  