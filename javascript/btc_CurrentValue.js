// Definir el endpoint de API y sus parametros de consulta
const apiEndpoint = "https://api.binance.com/api/v3/ticker/price";
const symbol = "BTCUSDT";

// Construccion de la URL de la API
const apiUrl = `${apiEndpoint}?symbol=${symbol}`;

// Hacer Fetch valor de BTC de la API
fetch(apiUrl)
  .then((response) => response.json())
  .then((data) => {
    // Actualizar el HTML con el valor actual
    const btcValueUsd = parseFloat(data.price).toFixed(2);
    document.getElementById("btc-value").textContent = `$${btcValueUsd}`;
  })
  .catch((error) => {
    console.error(error);
    document.getElementById("btc-value").textContent =
      "Error loading BTC value";
  });

// Obtener precios del BCT de la API de Binance 
const api_url =
  "https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=365";
async function getBitcoinPrices() {
  const response = await fetch(api_url);
  const data = await response.json();
  const prices = data.map((d) => parseFloat(d[4])); // Extraer precios de la data
  return prices;
}

// Crear grafico de BTCUSDT
async function createChart() {
  const prices = await getBitcoinPrices();
  const ctx = document.getElementById("myChart").getContext("2d");
  const myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: Array.from(Array(prices.length).keys()), // Usar array como etiquetas 
      datasets: [
        {
          label: "BTCUSDT",
          data: prices,
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          ticks: {
            callback: function (value, index, values) {
              return "$" + value.toLocaleString(); // Agregar signo de $
            },
          },
        },
      },
    },
  });
}

createChart();
