import BinanceAPI from "./javascript/btc_CurrentValue.js";
import cambiarTema from "./javascript/javascript.js";
import  ChartManager  from "./javascript/btc_CurrentValue.js";

const dateInterval = document.getElementById("dateInterval");
const btnTemas = document.getElementById("btnTemas");

let chart = null;


window.addEventListener("load", BinanceAPI);

btnTemas.addEventListener("click", cambiarTema);






dateInterval.addEventListener("change", function(event) {
  
    const tickerSelect = document.getElementById("ticker-select");
    let selectedValue = tickerSelect.value;
  
    let interval = event.target.value;
    //chart.destroy();
    
    const chartManager = new ChartManager("myChart", "ticker-select")
    switch (interval) {
      case "1h":
        chartManager.createChart(selectedValue, interval, 24);
        
        
        break;
      case "1d":
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
  