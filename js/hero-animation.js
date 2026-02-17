/* ===================================
   FormaVista - Hero Canvas Animation
   Particle network with blue-gold theme
   =================================== */

(function () {
  "use strict";

  function init() {
    var canvas = document.getElementById("heroCanvas");
    if (!canvas) return;

    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var particles = [];
    var mouse = { x: -9999, y: -9999 };
    var animId;
    var isVisible = true;

    // Settings
    var CONNECTION_DIST = 140;
    var MOUSE_DIST = 180;
    var COLORS = [
      "rgba(91, 168, 217, ",  // blue-light
      "rgba(43, 122, 181, ",  // blue
      "rgba(220, 192, 96, ",  // gold-light
      "rgba(196, 155, 48, ",  // gold
      "rgba(90, 101, 153, ",  // navy-300
    ];

    function resize() {
      var hero = canvas.parentElement;
      if (!hero) return;
      var w = hero.clientWidth;
      var h = hero.clientHeight;
      if (w === 0 || h === 0) return;
      canvas.width = w;
      canvas.height = h;
    }

    function getParticleCount() {
      var area = canvas.width * canvas.height;
      var count = Math.floor(area / 14000);
      return Math.max(30, Math.min(count, 100));
    }

    function createParticle() {
      var colorIdx = Math.random() < 0.35 ? Math.floor(Math.random() * 2) :
                     Math.random() < 0.6  ? 2 + Math.floor(Math.random() * 2) :
                     4;
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 1,
        color: COLORS[colorIdx],
        alpha: Math.random() * 0.4 + 0.2,
        pulseSpeed: Math.random() * 0.01 + 0.005,
        pulseOffset: Math.random() * Math.PI * 2,
      };
    }

    function initParticles() {
      particles = [];
      if (canvas.width === 0 || canvas.height === 0) return;
      var count = getParticleCount();
      for (var i = 0; i < count; i++) {
        particles.push(createParticle());
      }
    }

    function drawParticle(p, time) {
      var pulse = Math.sin(time * p.pulseSpeed + p.pulseOffset) * 0.15 + 0.85;
      var alpha = p.alpha * pulse;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * pulse, 0, Math.PI * 2);
      ctx.fillStyle = p.color + alpha + ")";
      ctx.fill();
    }

    function drawConnections() {
      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DIST) {
            var alpha = (1 - dist / CONNECTION_DIST) * 0.12;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = "rgba(91, 168, 217, " + alpha + ")";
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
    }

    function drawMouseConnections() {
      if (mouse.x < 0) return;
      for (var i = 0; i < particles.length; i++) {
        var dx = particles[i].x - mouse.x;
        var dy = particles[i].y - mouse.y;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MOUSE_DIST) {
          var alpha = (1 - dist / MOUSE_DIST) * 0.25;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = "rgba(201, 168, 76, " + alpha + ")";
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    function updateParticles() {
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];

        if (mouse.x > 0) {
          var dx = p.x - mouse.x;
          var dy = p.y - mouse.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_DIST && dist > 0) {
            var force = (MOUSE_DIST - dist) / MOUSE_DIST * 0.02;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        p.vx *= 0.995;
        p.vy *= 0.995;

        var speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed < 0.15) {
          p.vx += (Math.random() - 0.5) * 0.1;
          p.vy += (Math.random() - 0.5) * 0.1;
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;
      }
    }

    function animate(time) {
      if (!isVisible) {
        animId = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawConnections();
      drawMouseConnections();

      for (var i = 0; i < particles.length; i++) {
        drawParticle(particles[i], time);
      }

      updateParticles();
      animId = requestAnimationFrame(animate);
    }

    // Event listeners
    var heroSection = canvas.parentElement;

    if (heroSection) {
      heroSection.addEventListener("mousemove", function (e) {
        var rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      }, { passive: true });

      heroSection.addEventListener("mouseleave", function () {
        mouse.x = -9999;
        mouse.y = -9999;
      });

      heroSection.addEventListener("touchmove", function (e) {
        var touch = e.touches[0];
        var rect = canvas.getBoundingClientRect();
        mouse.x = touch.clientX - rect.left;
        mouse.y = touch.clientY - rect.top;
      }, { passive: true });

      heroSection.addEventListener("touchend", function () {
        mouse.x = -9999;
        mouse.y = -9999;
      }, { passive: true });
    }

    window.addEventListener("resize", function () {
      resize();
      initParticles();
    });

    // Visibility optimization
    if (heroSection && "IntersectionObserver" in window) {
      var visObserver = new IntersectionObserver(function (entries) {
        isVisible = entries[0].isIntersecting;
      }, { threshold: 0 });
      visObserver.observe(heroSection);
    }

    // Start
    resize();
    initParticles();

    if (canvas.width > 0 && canvas.height > 0) {
      animId = requestAnimationFrame(animate);
    } else {
      // Retry after layout is ready
      window.addEventListener("load", function () {
        resize();
        initParticles();
        animId = requestAnimationFrame(animate);
      });
    }
  }

  // Run when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
