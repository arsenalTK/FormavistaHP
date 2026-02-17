/* ===================================
   FormaVista - Hero Canvas Animation
   Particle network with blue-gold theme
   =================================== */

(function () {
  "use strict";

  var canvas = document.getElementById("heroCanvas");
  if (!canvas) return;

  var ctx = canvas.getContext("2d");
  var particles = [];
  var mouse = { x: -9999, y: -9999 };
  var animId;
  var isVisible = true;

  // Settings
  var PARTICLE_COUNT_BASE = 60;
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
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function getParticleCount() {
    var area = canvas.width * canvas.height;
    var count = Math.floor(area / 14000);
    return Math.max(30, Math.min(count, 100));
  }

  function createParticle() {
    var colorIdx = Math.random() < 0.35 ? Math.floor(Math.random() * 2) : // 35% blue
                   Math.random() < 0.6  ? 2 + Math.floor(Math.random() * 2) : // 25% gold
                   4; // 40% navy
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

  function drawConnections(time) {
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

      // Gentle mouse repulsion
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

      // Damping
      p.vx *= 0.995;
      p.vy *= 0.995;

      // Minimum speed
      var speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed < 0.15) {
        p.vx += (Math.random() - 0.5) * 0.1;
        p.vy += (Math.random() - 0.5) * 0.1;
      }

      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges
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

    drawConnections(time);
    drawMouseConnections();

    for (var i = 0; i < particles.length; i++) {
      drawParticle(particles[i], time);
    }

    updateParticles();
    animId = requestAnimationFrame(animate);
  }

  // Event listeners
  function onMouseMove(e) {
    var rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  }

  function onMouseLeave() {
    mouse.x = -9999;
    mouse.y = -9999;
  }

  function onResize() {
    resize();
    initParticles();
  }

  // Visibility optimization
  var heroSection = canvas.closest(".hero");
  if (heroSection && "IntersectionObserver" in window) {
    var visObserver = new IntersectionObserver(function (entries) {
      isVisible = entries[0].isIntersecting;
    }, { threshold: 0 });
    visObserver.observe(heroSection);
  }

  // Touch support
  canvas.addEventListener("touchmove", function (e) {
    var touch = e.touches[0];
    var rect = canvas.getBoundingClientRect();
    mouse.x = touch.clientX - rect.left;
    mouse.y = touch.clientY - rect.top;
  }, { passive: true });

  canvas.addEventListener("touchend", onMouseLeave, { passive: true });

  // Initialize
  canvas.addEventListener("mousemove", onMouseMove, { passive: true });
  canvas.addEventListener("mouseleave", onMouseLeave);
  window.addEventListener("resize", onResize);

  resize();
  initParticles();
  animId = requestAnimationFrame(animate);
})();
