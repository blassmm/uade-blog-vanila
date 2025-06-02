// Funcionalidad básica para el blog
document.addEventListener("DOMContentLoaded", function () {

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
