document.getElementById("contactForm").addEventListener("submit", function(event) {
      event.preventDefault();

      document.getElementById("contactForm").style.display = "none";
      document.getElementById("thanksMessage").style.display = "block";

      setTimeout(function() {
        window.location.href = "blog.html";
      }, 3000);
    });