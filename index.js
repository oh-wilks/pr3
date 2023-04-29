import BinanceAPI from "./javascript/btc_CurrentValue.js";
import cambiarTema from "./javascript/javascript.js";
import  ChartManager  from "./javascript/btc_CurrentValue.js";

const dateInterval = document.getElementById("dateInterval");
const btnTemas = document.getElementById("btnTemas");

let chart = null;


window.addEventListener("load", BinanceAPI);

btnTemas.addEventListener("click", cambiarTema);
