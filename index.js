import BinanceAPI from "./javascript/btc_CurrentValue.js";
window.addEventListener("load", BinanceAPI);

import cambiarTema from "./javascript/javascript.js";
const btnTemas = document.getElementById("btnTemas");
btnTemas.addEventListener("click", cambiarTema);
