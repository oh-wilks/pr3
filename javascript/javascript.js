const temaClaro = () => {
  document.documentElement.setAttribute("data-bs-theme", "light");
  document.querySelector("#dl-icon").setAttribute("class", "bi bi-moon-fill");
  document.querySelector("#nav").setAttribute("class", "navbar navbar-dark bg-dark shadow-lg ");
  document.querySelector("footer").setAttribute("class", "bg-light");
    
};
const temaOscuro = () => {
  document.documentElement.setAttribute("data-bs-theme", "dark");
  document.querySelector("footer").setAttribute("class", "bg-dark");
  document.querySelector("#dl-icon").setAttribute("class", "bi bi-sun-fill");
  document
    .querySelector("#nav")
    .setAttribute("class", "navbar bg-primary shadow-lg ");
};

const cambiarTema = () => {
  const temaActual = document.documentElement.getAttribute("data-bs-theme");
  if (temaActual === "dark") {
    temaClaro();
  } else {
    temaOscuro();
  }
};

export default cambiarTema;
