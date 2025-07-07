document.addEventListener("DOMContentLoaded", function () {
  const readMoreButtons = document.querySelectorAll(".read-more-btn");

  readMoreButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const postText = this.parentElement;

      postText.classList.toggle("expanded");

      if (postText.classList.contains("expanded")) {
        this.textContent = "Leer menos";
      } else {
        this.textContent = "Leer más";
      }
    });
  });

  const imageContainers = document.querySelectorAll(".image-container");

  imageContainers.forEach((container) => {
    container.addEventListener("touchstart", function () {
      const postText = this.querySelector(".post-text");
      if (postText) {
        postText.style.transform = "translateY(0)";
      }
    });
  });

  gsap.registerPlugin(ScrollTrigger);

  gsap.from(".blog-title", {
    opacity: 0,
    y: -30,
    duration: 1,
    ease: "power3.out",
  });

  gsap.from(".post", {
    opacity: 0,
    y: 50,
    stagger: 0.2,
    duration: 0.8,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".posts-container",
      start: "top 80%",
    },
  });
});
