import { API_ENDPOINT } from "./btc_CurrentValue.js";

// dropdown
export async function populateTickerSelect(callback) {
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

  
