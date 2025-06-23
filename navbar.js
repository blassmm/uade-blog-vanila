// Funcionalidad de la navbar
document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.querySelector(".hamburger");
  const navbarMenu = document.querySelector(".navbar-menu");
  const overlay = document.querySelector(".overlay");
  const navbarLinks = document.querySelectorAll(".navbar-link");
  const navbar = document.querySelector(".navbar");

  // Función para alternar el menú hamburguesa
  function toggleMenu() {
    hamburger.classList.toggle("active");
    navbarMenu.classList.toggle("active");
    overlay.classList.toggle("active");
    document.body.classList.toggle("no-scroll");
  }

  // Evento click para el botón hamburguesa
  if (hamburger) {
    hamburger.addEventListener("click", toggleMenu);
  }

  // Cerrar el menú al hacer click en un enlace
  navbarLinks.forEach((link) => {
    link.addEventListener("click", function () {
      if (navbarMenu.classList.contains("active")) {
        toggleMenu();
      }
    });
  });

  // Cerrar el menú al hacer click en el overlay
  if (overlay) {
    overlay.addEventListener("click", function () {
      if (navbarMenu.classList.contains("active")) {
        toggleMenu();
      }
    });
  }

  // Cambiar estilo de la navbar al hacer scroll
  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });
});
