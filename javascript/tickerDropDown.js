import { API_ENDPOINT } from "./btc_CurrentValue.js";

export async function populateTickerSelect(callback) {
  try {
    const apiUrl = `${API_ENDPOINT}/exchangeInfo`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const { symbols } = await response.json();
    const tickerSelect = document.getElementById("ticker-select");
    symbols.sort((a, b) => a.symbol.localeCompare(b.symbol));

    const symbolObjects = symbols.map((symbol) => ({
      baseAsset: symbol.baseAsset,
      quoteAsset: symbol.quoteAsset,
    }));
    // iterando el objecto symbol para mostrar los tickers
    symbols.forEach((symbol) => {
      const option = document.createElement("option");
      option.value = symbol.symbol;
      option.textContent = `${symbol.baseAsset} - ${symbol.quoteAsset}`;
      tickerSelect.appendChild(option);
    });

    // valor default primer carga, despues se guarda en local storage
    let defaultValue = localStorage.getItem("selectedTicker") || symbols[0].symbol;
    document.getElementById('selectedTicker').textContent = `${defaultValue}` || symbols[0].symbol;

    // mostrar valor en resumen
    callback(defaultValue);

    tickerSelect.addEventListener("change", () => {
      const selectedValue = tickerSelect.value;
      localStorage.setItem("selectedTicker", selectedValue);
      document.getElementById('selectedTicker').textContent = `${selectedValue}`;
      callback(selectedValue);
    });
  } catch (error) {
    console.error("Error", error);
  }
}
