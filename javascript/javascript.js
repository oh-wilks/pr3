const temaClaro =  () => {
    document.documentElement.setAttribute('data-bs-theme','light')
    document.querySelector("#dl-icon").setAttribute("class","bi bi-moon-fill");
    document.querySelector("#nav").setAttribute("class","navbar navbar-dark bg-dark shadow-lg rounded");
    
};
const temaOscuro =  () => {
    document.documentElement.setAttribute('data-bs-theme','dark');
    
    document.querySelector("#dl-icon").setAttribute("class","bi bi-sun-fill");
    document.querySelector("#nav").setAttribute("class","navbar bg-primary shadow-lg rounded");
};

const cambiarTema = () => {
    const temaActual = document.documentElement.getAttribute('data-bs-theme');
    if (temaActual === 'dark') {
      temaClaro();
    } else {
      temaOscuro();
    }
  }
