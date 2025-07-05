document.getElementById("contactForm").addEventListener("submit", function(event) {
      event.preventDefault(); // Evita que recargue la página

      // Oculta el form y muestra el mensaje
      document.getElementById("contactForm").style.display = "none";
      document.getElementById("thanksMessage").style.display = "block";

      // Espera 3 segundos y redirige al home
      setTimeout(function() {
        window.location.href = "blog.html"; // Cambialo por tu URL de home si es distinta
      }, 3000);
    });