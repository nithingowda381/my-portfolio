/* -------------------------------------------------------------
 * NITHIN GOWDA M S // INTERACTIVE ENGINE (GSAP PROFESSIONAL)
 * Orchestrates loading introductions, scroll decks, theme toggles, and UI links.
 * ------------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize theme first to avoid flash of dark mode
  initThemeSystem();

  // DOM Elements
  const splashScreen = document.getElementById("splash-screen");
  const body = document.body;

  // Set contact form dynamic return URL to the current page location
  const redirectInput = document.getElementById("form-redirect-next");
  if (redirectInput) {
    redirectInput.value = window.location.href;
  }

  // Always play splash screen for dynamic entry experience on refreshes
  runProfessionalSplash();

  function runProfessionalSplash() {
    body.style.overflow = "hidden"; // Prevent scrolling

    // GSAP Introduction sequence
    const splashTL = gsap.timeline({
      onComplete: () => {
        splashScreen.style.display = "none";
        body.style.overflow = "auto";
        initPortfolioAnimations();
      }
    });

    splashTL.fromTo(".splash-logo", 
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    )
    .fromTo(".splash-subtitle", 
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      "-=0.5"
    )
    .fromTo(".splash-container .loader-bar", 
      { opacity: 0 },
      { opacity: 1, duration: 0.3 },
      "-=0.4"
    )
    .fromTo(".splash-container .loader-fill", 
      { width: "0%" },
      { width: "100%", duration: 1.6, ease: "power2.inOut" }
    )
    .to(splashScreen, {
      opacity: 0,
      duration: 0.6,
      ease: "power2.inOut"
    }, "+=0.2");
  }

  // -------------------------------------------------------------
  // THEME SWITCH SYSTEM
  // -------------------------------------------------------------
  function initThemeSystem() {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    
    // Apply initial theme class
    if (savedTheme === "light" || (!savedTheme && systemPrefersLight)) {
      document.documentElement.classList.add("light-theme");
    } else {
      document.documentElement.classList.remove("light-theme");
    }
    
    updateThemeIcons();

    // Bind Toggle Button click listeners
    const toggleBtn = document.getElementById("theme-toggle");
    const toggleBtnMobile = document.getElementById("theme-toggle-m");

    if (toggleBtn) {
      toggleBtn.addEventListener("click", toggleTheme);
    }
    if (toggleBtnMobile) {
      toggleBtnMobile.addEventListener("click", toggleTheme);
    }

    function toggleTheme() {
      const isLight = document.documentElement.classList.toggle("light-theme");
      localStorage.setItem("theme", isLight ? "light" : "dark");
      
      updateThemeIcons();
      
      // Dispatch custom event to notify particles.js canvas of theme changes
      window.dispatchEvent(new CustomEvent("themechanged"));
    }

    function updateThemeIcons() {
      const isLight = document.documentElement.classList.contains("light-theme");
      const sunIcons = document.querySelectorAll(".sun-icon");
      const moonIcons = document.querySelectorAll(".moon-icon");
      const mobileToggleLabel = document.querySelector(".theme-m-text");

      if (isLight) {
        sunIcons.forEach(i => i.style.display = "none");
        moonIcons.forEach(i => i.style.display = "block");
        if (mobileToggleLabel) mobileToggleLabel.textContent = "Switch to Dark Mode";
      } else {
        sunIcons.forEach(i => i.style.display = "block");
        moonIcons.forEach(i => i.style.display = "none");
        if (mobileToggleLabel) mobileToggleLabel.textContent = "Switch to Light Mode";
      }
    }
  }

  // -------------------------------------------------------------
  // GSAP SCROLL STORY & NAVIGATION CONTROLS
  // -------------------------------------------------------------
  function initPortfolioAnimations() {
    // Register scroll plugin
    gsap.registerPlugin(ScrollTrigger);

    // 1. HUD Navigation indicator tracking
    const sections = document.querySelectorAll(".story-section");
    const hudLinks = document.querySelectorAll(".hud-link");
    const hudIndicator = document.querySelector(".hud-indicator");

    sections.forEach((section, i) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top 40%",
        end: "bottom 40%",
        onEnter: () => activateHud(i),
        onEnterBack: () => activateHud(i)
      });
    });

    function activateHud(index) {
      hudLinks.forEach(link => link.classList.remove("active"));
      hudLinks[index].classList.add("active");
      
      const itemHeight = 31.6; // Approximates HUD item height and padding gaps
      gsap.to(hudIndicator, {
        y: index * itemHeight,
        duration: 0.3,
        ease: "power2.out"
      });
    }

    // 2. Reveal animations for section headers
    sections.forEach((section) => {
      const tag = section.querySelector(".decor-tag");
      const line = section.querySelector(".decor-line");
      
      if (tag && line) {
        gsap.fromTo(tag, 
          { opacity: 0, x: -20 },
          { 
            opacity: 1, 
            x: 0, 
            duration: 0.8, 
            scrollTrigger: {
              trigger: section,
              start: "top 80%"
            }
          }
        );
        gsap.fromTo(line,
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1,
            duration: 1,
            scrollTrigger: {
              trigger: section,
              start: "top 80%"
            }
          }
        );
      }
    });

    // 3. Experience vertical timeline loading animations
    const timelineProgress = document.querySelector(".timeline-progress");
    if (timelineProgress) {
      gsap.to(timelineProgress, {
        height: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: ".timeline-wrapper",
          start: "top 25%",
          end: "bottom 80%",
          scrub: true
        }
      });
    }

    // Reveal individual timeline experience cards
    const timelineItems = document.querySelectorAll(".timeline-item");
    timelineItems.forEach((item) => {
      const content = item.querySelector(".timeline-content");
      const badge = item.querySelector(".timeline-badge");
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: item,
          start: "top 75%",
          toggleActions: "play none none reverse"
        }
      });

      tl.fromTo(badge, 
        { scale: 0 },
        { scale: 1, duration: 0.4, ease: "back.out(1.5)" }
      )
      .fromTo(content,
        { 
          opacity: 0, 
          x: item.classList.contains("left") ? -40 : 40,
          rotationY: item.classList.contains("left") ? 10 : -10
        },
        { 
          opacity: 1, 
          x: 0, 
          rotationY: 0,
          duration: 0.7, 
          ease: "power2.out" 
        }, 
        "-=0.2"
      )
      .call(() => item.classList.add("active"), null, "-=0.2");
    });

    // 4. Projects Stacking Deck Animation
    const projectCards = gsap.utils.toArray(".projects-deck .deck-card");
    projectCards.forEach((card, index) => {
      // Set slight alternate rotation for premium physical deck look
      const tiltAngle = (index % 2 === 0 ? 1 : -1) * 1.2;
      gsap.set(card, { rotation: tiltAngle });

      if (index < projectCards.length - 1) {
        const nextCard = projectCards[index + 1];
        const cardsToTop = projectCards.length - 1 - index;
        
        // Advanced capped stack parameters (prevents card shrinking too much)
        const targetScale = 0.95 - Math.min(cardsToTop, 3) * 0.02;
        const targetOpacity = 0.6 - Math.min(cardsToTop, 3) * 0.1;
        const targetY = -15 * Math.min(cardsToTop, 3);

        gsap.to(card, {
          scale: targetScale,
          opacity: targetOpacity,
          y: targetY,
          scrollTrigger: {
            trigger: nextCard,
            start: "top 85%",
            end: "top 30%",
            scrub: true
          }
        });
      }
    });

    // 5. Stacking Certificates Deck Animation (Matches Projects layout)
    const certCards = gsap.utils.toArray(".certs-deck .deck-card");
    certCards.forEach((card, index) => {
      const tiltAngle = (index % 2 === 0 ? 1 : -1) * 0.8;
      gsap.set(card, { rotation: tiltAngle });

      if (index < certCards.length - 1) {
        const nextCard = certCards[index + 1];
        const cardsToTop = certCards.length - 1 - index;
        
        // Advanced capped stack parameters (handles 20 cards gracefully)
        const targetScale = 0.95 - Math.min(cardsToTop, 3) * 0.02;
        const targetOpacity = 0.6 - Math.min(cardsToTop, 3) * 0.1;
        const targetY = -15 * Math.min(cardsToTop, 3);

        gsap.to(card, {
          scale: targetScale,
          opacity: targetOpacity,
          y: targetY,
          scrollTrigger: {
            trigger: nextCard,
            start: "top 85%",
            end: "top 30%",
            scrub: true
          }
        });
      }
    });

    // 6. Credentials loop clone (Marquee seamless horizontal wrap)
    const marqueeTrack = document.querySelector(".marquee-track");
    if (marqueeTrack) {
      const badgeItems = marqueeTrack.innerHTML;
      marqueeTrack.innerHTML = badgeItems + badgeItems; // Double up list
      
      const scrollLoop = gsap.to(marqueeTrack, {
        xPercent: -50,
        duration: 22,
        ease: "none",
        repeat: -1
      });

      // Adjust loop speed based on user scroll velocity
      ScrollTrigger.create({
        trigger: ".badges-marquee-container",
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const velocity = Math.abs(self.getVelocity() / 150);
          const targetScale = Math.min(Math.max(velocity, 1), 6);
          
          gsap.to(scrollLoop, { 
            timeScale: targetScale, 
            duration: 0.3 
          });
          
          gsap.to(scrollLoop, { 
            timeScale: 1, 
            duration: 1.2, 
            delay: 0.1 
          });
        }
      });
    }

    // 7. Interactive 3D Perspective Tilt on Skills and Timeline cards
    const tiltCards = document.querySelectorAll(".skill-card, .timeline-content");
    tiltCards.forEach(card => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const xPercent = (x / rect.width - 0.5) * 8; // 8 deg max tilt
        const yPercent = (y / rect.height - 0.5) * -8;
        
        gsap.to(card, {
          transform: `perspective(1000px) rotateX(${yPercent}deg) rotateY(${xPercent}deg)`,
          duration: 0.2,
          ease: "power1.out"
        });
      });
      
      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)",
          duration: 0.4,
          ease: "power2.out"
        });
      });
    });

    // Refresh triggers after page assets/images are fully parsed
    window.addEventListener("load", () => {
      ScrollTrigger.refresh();
    });
  }

  // Mobile navigation drawer toggle
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");
  const mobileLinks = document.querySelectorAll(".mobile-nav-item");

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", toggleMenu);

    mobileLinks.forEach(link => {
      link.addEventListener("click", toggleMenu);
    });

    function toggleMenu() {
      menuToggle.classList.toggle("open");
      mobileMenu.classList.toggle("open");
      
      if (mobileMenu.classList.contains("open")) {
        body.style.overflow = "hidden";
        gsap.fromTo(".mobile-nav-item",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, stagger: 0.1, duration: 0.4, delay: 0.2, ease: "power2.out" }
        );
      } else {
        body.style.overflow = "auto";
      }
    }
  }
});
