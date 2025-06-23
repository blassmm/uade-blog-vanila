document.addEventListener("DOMContentLoaded", function () {
  const sound = document.getElementById("clickSound");

  function playClickSound() {
    sound.currentTime = 0; // Reinicia el sonido por si ya está reproduciéndose
    sound.play();
  }

  // Escuchar todos los clicks de la página
  document.addEventListener("click", function (event) {
    const target = event.target;
    playClickSound();
    // if (
    //   target.tagName === "A" ||
    //   target.tagName === "BUTTON" ||
    //   target.tagName === "DIV" ||
    //   target.tagName === "SPAN"
    // ) {
    //   playClickSound();
    // }
  });
});
