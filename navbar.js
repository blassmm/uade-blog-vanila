document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.querySelector(".hamburger");
  const navbarMenu = document.querySelector(".navbar-menu");
  const overlay = document.querySelector(".overlay");
  const navbarLinks = document.querySelectorAll(".navbar-link");
  const navbar = document.querySelector(".navbar");

  function toggleMenu() {
    hamburger.classList.toggle("active");
    navbarMenu.classList.toggle("active");
    overlay.classList.toggle("active");
    document.body.classList.toggle("no-scroll");
  }

  if (hamburger) {
    hamburger.addEventListener("click", toggleMenu);
  }

  navbarLinks.forEach((link) => {
    link.addEventListener("click", function () {
      if (navbarMenu.classList.contains("active")) {
        toggleMenu();
      }
    });
  });

  if (overlay) {
    overlay.addEventListener("click", function () {
      if (navbarMenu.classList.contains("active")) {
        toggleMenu();
      }
    });
  }

  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });
});
