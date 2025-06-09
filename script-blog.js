// Funcionalidad básica para el blog
document.addEventListener("DOMContentLoaded", function () {
  // NUEVA NAVBAR - Adaptada de React a JavaScript Vanilla
  const navToggle = document.getElementById("navToggle");
  const nav = document.querySelector(".nav");
  const circleNav = document.querySelector(".circle_nav");
  const titleNav = document.querySelector(".titleNav_mobile");
  const listMobile = document.querySelectorAll(".list_mobile");
  let isActive = false;

  // Configurar GSAP
  gsap.registerPlugin(ScrollTrigger);

  navToggle.addEventListener("click", function () {
    isActive = !isActive;

    // Actualizar clases del menú
    if (isActive) {
      nav.classList.add("nav_active_mobile");
      nav.classList.remove("nav");
      navToggle.classList.add("toggle_active");
      navToggle.classList.remove("toggle");
      titleNav.classList.add("titleNav_mobile-active");
      titleNav.classList.remove("titleNav_mobile");

      // Añadir clases a las líneas del menú hamburguesa
      navToggle.querySelectorAll(".line").forEach((line, index) => {
        line.classList.add("lineActive");
        line.classList.remove("line");
        if (index === 0) line.classList.add("line1_active");
        if (index === 1) line.classList.add("line2_active");
        if (index === 2) line.classList.add("line3_active");
      });

      // Mostrar lista de navegación
      const listNav = document.querySelector("ul");
      listNav.classList.remove("list_nav_diss");
      listNav.classList.add("list_nav_mobile");

      // Animación de círculo expandiéndose
      gsap.to(circleNav, {
        scale: 34,
        duration: 0.6,
        ease: "power4.inOut",
      });

      // Animación de la lista
      gsap.from(listMobile, {
        opacity: 0,
        duration: 1,
        y: 10,
        ease: "power4.inOut",
      });
    } else {
      nav.classList.remove("nav_active_mobile");
      nav.classList.add("nav");
      navToggle.classList.remove("toggle_active");
      navToggle.classList.add("toggle");
      titleNav.classList.remove("titleNav_mobile-active");
      titleNav.classList.add("titleNav_mobile");

      // Restaurar las líneas del menú hamburguesa
      navToggle.querySelectorAll(".lineActive").forEach((line, index) => {
        line.classList.remove("lineActive");
        line.classList.add("line");
        if (index === 0) {
          line.classList.remove("line1_active");
          line.classList.add("line1");
        }
        if (index === 1) {
          line.classList.remove("line2_active");
          line.classList.add("line2");
        }
        if (index === 2) {
          line.classList.remove("line3_active");
          line.classList.add("line3");
        }
      });

      // Ocultar lista de navegación
      const listNav = document.querySelector("ul");
      listNav.classList.add("list_nav_diss");
      listNav.classList.remove("list_nav_mobile");

      // Animación de círculo contrayéndose
      gsap.to(circleNav, {
        scale: 1,
        duration: 0.6,
        ease: "power4.inOut",
      });

      // Animación de líneas al hacer scroll
      gsap.to(".lineActive", {
        duration: 0.1,
        color: "black",
        scrollTrigger: {
          trigger: ".panel",
          start: "top top",
          scrub: 2,
        },
      });
    }
  });

  // Añadir evento a los enlaces para cerrar el menú al hacer clic
  document.querySelectorAll(".list_link_nav").forEach((link) => {
    link.addEventListener("click", () => {
      if (isActive) {
        navToggle.click(); // Cierra el menú
      }
    });
  });

  // FUNCIONALIDAD ORIGINAL DEL BLOG

  // Seleccionar todos los botones "Leer más"
  const readMoreButtons = document.querySelectorAll(".read-more-btn");

  // Añadir evento de clic a cada botón
  readMoreButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Obtener el contenedor de texto padre
      const postText = this.parentElement;

      // Alternar la clase 'expanded'
      postText.classList.toggle("expanded");

      // Cambiar el texto del botón según el estado
      if (postText.classList.contains("expanded")) {
        this.textContent = "Leer menos";
      } else {
        this.textContent = "Leer más";
      }
    });
  });

  // Asegurar que el texto se muestre correctamente al hacer hover en móviles
  const imageContainers = document.querySelectorAll(".image-container");

  imageContainers.forEach((container) => {
    container.addEventListener("touchstart", function () {
      // Prevenir efecto hover en móviles para permitir el clic en el botón
      const postText = this.querySelector(".post-text");
      if (postText) {
        postText.style.transform = "translateY(0)";
      }
    });
  });
});
