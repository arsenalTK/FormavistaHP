/* ===================================
   FormaVista Consulting - Main JS
   =================================== */

(function () {
  "use strict";

  // --- Header scroll effect ---
  var header = document.getElementById("header");

  function onScroll() {
    if (window.scrollY > 10) {
      header.classList.add("header--scrolled");
    } else {
      header.classList.remove("header--scrolled");
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // --- Mobile menu toggle ---
  var hamburger = document.getElementById("hamburger");
  var nav = document.getElementById("nav");

  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("hamburger--active");
    nav.classList.toggle("nav--open");
  });

  // Close mobile menu on link click
  var navLinks = nav.querySelectorAll("a");
  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      hamburger.classList.remove("hamburger--active");
      nav.classList.remove("nav--open");
    });
  });

  // --- Fade-in on scroll (Intersection Observer) ---
  var fadeElements = document.querySelectorAll(".fade-in");

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in--visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    fadeElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show all elements immediately
    fadeElements.forEach(function (el) {
      el.classList.add("fade-in--visible");
    });
  }

  // --- Contact form handling ---
  var contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var submitBtn = contactForm.querySelector(".form__submit");
      var originalText = submitBtn.textContent;

      submitBtn.textContent = "送信中...";
      submitBtn.disabled = true;

      // Simulate form submission (replace with actual backend integration)
      setTimeout(function () {
        submitBtn.textContent = "送信しました";
        submitBtn.style.background = "#2d8a4e";

        setTimeout(function () {
          contactForm.reset();
          submitBtn.textContent = originalText;
          submitBtn.style.background = "";
          submitBtn.disabled = false;
        }, 2000);
      }, 1000);
    });
  }
})();
