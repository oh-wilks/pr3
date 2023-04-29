# Proyecto 3, Equipo 6

## Dashboard para API
Este proyecto consiste en una página web simple que muestra el valor actual del Bitcoin en dólares estadounidenses, utilizando la API pública de Binance. Además, cuenta con una funcionalidad para cambiar el tema entre oscuro y claro.

## Características

- Muestra el valor actual del Bitcoin en dólares estadounidenses utilizando la API pública de Binance.
- Funcionalidad para cambiar el tema de la página entre oscuro y claro.
- Diseño responsivo, adaptándose a diferentes tamaños de pantalla.
- Implementado en HTML, CSS y JavaScript.

## Codigo 
En el archivo `index.html` se encuentran los elementos HTML que conforman la estructura de la página.

En la carpeta `javascript` se encuentran los archivos `btc_CurrentValue.js` y `javascript.js`, los cuales contienen las funciones `BinanceAPI` y `cambiarTema` respectivamente.

- Se importa dos módulos llamados `BinanceAPI` y `cambiarTema` desde los archivos "./javascript/btc_CurrentValue.js" y "./javascript/javascript.js" respectivamente.

- Luego, se selecciona el botón con id "btnTemas" del HTML y se asigna a la variable "btnTemas".

- A continuación, se añade un `event listener` para el evento `"load"` en la ventana (es decir, cuando se carga la página) que llama a la función `BinanceAPI` que fue importada anteriormente.

-Finalmente, se añade otro event listener para el evento `"click"` en el botón `btnTemas` que llama a la función `cambiarTema` que también fue importada anteriormente. Esta función probablemente cambia el tema de la página (por ejemplo, de claro a oscuro o viceversa).

## Clases

- La clase `BinanceAPI` contiene dos métodos asíncronos para obtener el precio actual de un símbolo (moneda) y un historial de precios para un símbolo en un intervalo de tiempo y límite especificados. Estos métodos utilizan la API pública de Binance para obtener los datos correspondientes.

- La clase `TickerManager` se encarga de actualizar el precio actual de un símbolo en un elemento HTML específico en la página web. Para ello, utiliza la clase `BinanceAPI` para obtener el precio actual del símbolo y actualizar el elemento HTML correspondiente con el nuevo valor. Si ocurre algún error durante la actualización, se muestra un mensaje de error en lugar del precio.

- La clase `ChartManager` se encarga de crear y actualizar una gráfica de precios de un símbolo en un elemento HTML específico en la página web. Para ello, utiliza la clase `BinanceAPI` para obtener un historial de precios para el símbolo en un intervalo de tiempo y límite especificados. Una vez que se obtiene el historial de precios, se crea una gráfica utilizando la librería Chart.js y se muestra en el elemento HTML correspondiente. La clase `ChartManager` también utiliza un elemento HTML para mostrar un spinner mientras se obtienen y procesan los datos correspondientes.

-  El evento `change` en el elemento HTML dateInterval se encarga de actualizar la gráfica de precios según el intervalo de tiempo seleccionado por el usuario en un elemento HTML select. Cuando se cambia el valor del elemento `dateInterval`, se crea una nueva instancia de la clase `ChartManager` y se llama al método `createChart` para actualizar la gráfica de precios con los datos correspondientes.

- La función `populateTickerSelect` se encarga de obtener una lista de símbolos disponibles en Binance utilizando la API pública de la plataforma y agregarlos a un elemento HTML `select`. Esta función se llama al cargar la página web y muestra los símbolos disponibles para que el usuario seleccione el que desea visualizar en la gráfica de precios.

 En resumen, el código proporcionado tiene como objetivo mostrar gráficas de precios de criptomonedas de Binance en una página web, utilizando su API pública y la librería Chart.js. La funcionalidad está organizada en tres clases (`BinanceAPI`, `TickerManager` y `ChartManager`) y una función (`populateTickerSelect`) que se encargan de obtener y procesar los datos correspondientes, y actualizar los elementos HTML correspondientes en la página web.
 
 ## Recursos utilizados
- HTML, CSS y JavaScript para la artitectura del codigo.

- Bootstrap para el diseño responsivo.

- Font Awesome para los íconos utilizados.

- API pública de Binance para obtener el valor del Bitcoin en dólares estadounidenses. https://www.binance.com/en/support/faq/how-to-download-historical-market-data-on-binance-5810ae42176b4770b880ce1f14932262

- CharLine Chart.js https://www.chartjs.org/docs/latest/charts/line.html

