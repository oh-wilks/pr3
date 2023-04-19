// Definición de variables y constantes
// Definición de variables y constantes
const API_ENDPOINT = "https://api.binance.com/api/v3"; // URL base de la API de Binance
const ERROR_TICKER_PRICE = "Failed to get ticker price"; // Mensaje de error para obtener el precio del ticker
const ERROR_KLINES = "Failed to get klines"; // Mensaje de error para obtener los datos de las klines

// Clase BinanceAPI para interactuar con la API de Binance
class BinanceAPI {
  constructor() {
    this.apiEndpoint = API_ENDPOINT; // URL base de la API de Binance
  }

  // Método para obtener el precio actual de un par de criptomonedas (ticker)
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
    return parseFloat(price).toFixed(2); // Devolver el precio como un número de dos decimales
  }

  // Método para obtener los datos de las klines de un par de criptomonedas
  async getKlines(symbol, interval, limit) {
    const apiUrl = `${this.apiEndpoint}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`; // URL para obtener los datos de las klines
    try {
      const response = await fetch(apiUrl); // Obtener la respuesta de la API
      const data = await response.json(); // Obtener los datos desde la respuesta de la API
      const prices = data.map(([timestamp, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored]) => parseFloat(close)); // Obtener los precios desde los datos
      return prices; // Devolver los precios
    } catch (error) { // Si ocurre un error
      console.error(error); // Mostrar el error en la consola
      throw new Error(ERROR_KLINES); // Lanzar una excepción con el mensaje de error correspondiente
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
      // Se obtiene el precio del símbolo proporcionado
      const price = await this.api.getTickerPrice(symbol);
      // Se actualiza el texto del ticker con el precio obtenido
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
    if (typeof symbol !== "string" || typeof interval !== "string" || typeof limit !== "number") {
      throw new Error("Invalid input parameters");
    }
    // Se obtienen los precios del símbolo en el intervalo y límite dados
const prices = await this.api.getKlines(symbol, interval, limit);

// Si ya existe un gráfico, se destruye para evitar conflictos
if (this.chart) {
  this.chart.destroy();
}

// Se crea el gráfico con la librería Chart.js
this.chart = new Chart(this.ctx, {
  type: "line", // Se indica que es un gráfico de línea
  data: {
    labels: Array.from(Array(prices.length).keys()), // Se crea un array con las etiquetas para cada punto del gráfico
    datasets: [
      {
        label: symbol, // Se indica el símbolo del gráfico
        data: prices, // Se usan los precios obtenidos
        fill: false, // Se indica que no se rellene el área debajo de la línea
        borderColor: "#F0000", // Se indica el color de la línea del gráfico
        tension: 0.1, // Se ajusta la tensión de la línea
      },
    ],
  },
  options: {
    scales: {
      y: {
        ticks: {
          callback: (value) => "$" + value.toLocaleString(), // Se agrega un prefijo "$" y se formatean los valores de los ticks
        },
      },
    },
  },
});
  }
}

// Ejemplo con BTC
const chartManager = new ChartManager("myChart", "btc-value");
chartManager.createChart("BTCUSDT", "1d", 30);

const ticker_btcusdt = new TickerManager("btc-value");
ticker_btcusdt.updateTicker("BTCUSDT");

// Ejemplo con ETH
const ticker_ethusdt = new TickerManager("eth-value");
ticker_ethusdt.updateTicker("ETHUSDT");
