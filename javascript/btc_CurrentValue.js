const API_ENDPOINT = "https://api.binance.com/api/v3";
const ERROR_TICKER_PRICE = "Failed to get ticker price";
const ERROR_KLINES = "Failed to get klines";

class BinanceAPI {
  constructor() {
    this.apiEndpoint = API_ENDPOINT; // URL base de la API de Binance
  }
  
  async getTickerPrice(symbol) {
    const apiUrl = `${this.apiEndpoint}/ticker/price?symbol=${symbol}`; // URL para obtener el precio del ticker
    const response = await fetch(apiUrl); // Obtener la respuesta de la API
    if (!response.ok) { // Si la respuesta no es "ok" (200)
      throw new Error(ERROR_TICKER_PRICE); // Lanzar una excepción con el mensaje de error correspondiente
    }
    const { price } = await response.json(); // Obtener el precio desde la respuesta de la API
    if (!price) { // Si no se puede obtener el precio
      throw new Error(ERROR_TICKER_PRICE); // Lanzar una excepción con el mensaje de error correspondiente
    }
    return parseFloat(price).toFixed(2);
  }
  
  async getKlines(symbol, interval, limit) {
    const apiUrl = `${this.apiEndpoint}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`; // URL para obtener los datos de las klines
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      const prices = data.map(([timestamp, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored]) => parseFloat(close));
      return prices;
    } catch (error) {
      console.error(error);
      throw new Error(ERROR_KLINES);
    }
  }

}


// Clase TickerManager para manejar el ticker en la página web
class TickerManager {
  constructor(tickerId) {
    this.tickerElement = document.getElementById(tickerId); // Elemento del ticker en la página web
    this.api = new BinanceAPI(); // Instancia de la clase BinanceAPI para interactuar con la API de Binance
  }

  // Método para actualizar el valor del ticker
  async updateTicker(symbol) {
    if (typeof symbol !== "string" || symbol.length === 0) { // Verificar si el símbolo del ticker es válido
      throw new Error("Invalid symbol"); // Lanzar una excepción si el símbolo del ticker no es válido
    }
    try {
      const price = await this.api.getTickerPrice(symbol);
      this.tickerElement.textContent = `$${price}`;
    } catch (error) {
      // Si ocurre algún error durante la obtención del precio, se muestra un mensaje de error en el ticker
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
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      throw new Error(`Invalid canvas ID: ${canvasId}`);
    }
    this.ctx = this.canvas.getContext("2d");
    this.chart = null;
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
    const prices = await this.api.getKlines(symbol, interval, limit);
    if (this.chart) {
      this.chart.destroy();
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
              callback: (value) => "$" + value.toLocaleString(),
            },
          },
        },
      },
    });
  }
}


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
    chartManager.createChart(selectedValue, "1d", 15);
  });
});

dateInterval.addEventListener("change", function(event){
  interval = event.target.value
  createChart.destroy()
  getKlines()

})

const ticker_btcusdt = new TickerManager("btc-value");
ticker_btcusdt.updateTicker("BTCUSDT");

// Ejemplo con ETH
const ticker_ethusdt = new TickerManager("eth-value");
ticker_ethusdt.updateTicker("ETHUSDT");
