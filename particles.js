/* -------------------------------------------------------------
 * NITHIN GOWDA M S // DYNAMIC CYBER-NET PARTICLES BACKGROUND
 * Performant HTML5 Canvas Particle System with Interactive Nodes
 * Supports instant color transitions upon Theme switches
 * ------------------------------------------------------------- */

(function () {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let particles = [];
  let animationFrameId;

  // Configuration options (Dark mode is default)
  const config = {
    particleCount: 80,
    maxDistance: 110,
    mouseRadius: 150,
    particleColor: "rgba(59, 130, 246, 0.25)",
    lineColor: "rgba(59, 130, 246, 0.03)",
    pulseColor: "rgba(139, 92, 246, 0.25)"
  };

  const mouse = {
    x: null,
    y: null
  };

  // Adjust config parameters based on active theme
  function updateThemeColors() {
    const isLight = document.documentElement.classList.contains("light-theme");
    if (isLight) {
      config.particleColor = "rgba(59, 130, 246, 0.15)";
      config.lineColor = "rgba(59, 130, 246, 0.02)";
      config.pulseColor = "rgba(139, 92, 246, 0.15)";
    } else {
      config.particleColor = "rgba(59, 130, 246, 0.25)";
      config.lineColor = "rgba(59, 130, 246, 0.03)";
      config.pulseColor = "rgba(139, 92, 246, 0.25)";
    }
    
    // Update active particle properties immediately
    particles.forEach(p => {
      p.color = p.isPulseNode ? config.pulseColor : config.particleColor;
    });
  }

  // Adjust count based on viewport for performance
  function updateParticleCount() {
    const width = window.innerWidth;
    if (width < 768) {
      config.particleCount = 35;
      config.maxDistance = 80;
    } else if (width < 1200) {
      config.particleCount = 60;
      config.maxDistance = 100;
    } else {
      config.particleCount = 90;
      config.maxDistance = 120;
    }
  }

  // Handle window resizing
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    updateParticleCount();
    initParticles();
    updateThemeColors();
  }

  // Particle Class Definition
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.baseRadius = Math.random() * 1.5 + 0.8;
      this.radius = this.baseRadius;
      
      this.isPulseNode = Math.random() > 0.85;
      this.color = this.isPulseNode ? config.pulseColor : config.particleColor;
      
      this.pulseDirection = Math.random() > 0.5 ? 1 : -1;
      this.pulseSpeed = Math.random() * 0.015 + 0.005;
    }

    update() {
      // Boundaries check
      if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
      if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

      this.x += this.vx;
      this.y += this.vy;

      // Pulse effect on specific nodes
      if (this.isPulseNode) {
        this.radius += this.pulseDirection * this.pulseSpeed;
        if (this.radius > 2.5 || this.radius < 0.8) {
          this.pulseDirection = -this.pulseDirection;
        }
      }

      // Mouse interactive push/pull
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.hypot(dx, dy);
        
        if (distance < config.mouseRadius) {
          const force = (config.mouseRadius - distance) / config.mouseRadius;
          // Subtly pull nodes toward cursor
          this.x -= dx * force * 0.015;
          this.y -= dy * force * 0.015;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  // Initialize Particles array
  function initParticles() {
    particles = [];
    for (let i = 0; i < config.particleCount; i++) {
      particles.push(new Particle());
    }
  }

  // Draw connections between nearby nodes
  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.hypot(dx, dy);

        if (distance < config.maxDistance) {
          const opacity = (1 - distance / config.maxDistance) * 0.12;
          ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  // Central animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw connections first (layering)
    drawLines();

    // Draw and update particles
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });

    animationFrameId = requestAnimationFrame(animate);
  }

  // Listeners for external triggers
  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("themechanged", updateThemeColors);
  
  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Boot Particles System
  resizeCanvas();
  animate();
})();
