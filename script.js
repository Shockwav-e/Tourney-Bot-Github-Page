const isHighPerformanceDevice = () => {
  return navigator.hardwareConcurrency >= 4 && window.devicePixelRatio <= 2;
};

const FPS_TARGET = isHighPerformanceDevice() ? 120 : 60;

// GSAP Configuration
gsap.registerPlugin(ScrollTrigger, TextPlugin);
gsap.config({ force3D: true });

// Global variables
let cursor, cursorFollower, themeTransition;
let isLoading = true;
let currentTheme = localStorage.getItem("theme") || "light";

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeLoading();
  initializeCursor();
  initializeTheme();
  initializeParticles();
  initializeAnimations();
  initializeNavigation();
  initializeCommands();
  initializeScrollEffects();
  initializeInteractions();
});

// Loading Screen
function initializeLoading() {
  const loadingScreen = document.getElementById("loading-screen");

  // Simulate loading time
  setTimeout(() => {
    loadingScreen.classList.add("hidden");
    isLoading = false;

    // Start main animations after loading
    setTimeout(() => {
      startMainAnimations();
    }, 500);
  }, 2000);
}

// Custom Cursor System
function initializeCursor() {
  cursor = document.getElementById("cursor");
  cursorFollower = document.getElementById("cursor-follower");

  let mouseX = 0,
    mouseY = 0;
  let cursorX = 0,
    cursorY = 0;
  let followerX = 0,
    followerY = 0;

  // High-performance mouse tracking
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth cursor animation loop
  function animateCursor() {
    // Cursor follows mouse immediately
    cursorX = mouseX;
    cursorY = mouseY;

    // Follower has smooth easing
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;

    // Apply transforms
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    cursorFollower.style.left = `${followerX}px`;
    cursorFollower.style.top = `${followerY}px`;

    requestAnimationFrame(animateCursor);
  }

  animateCursor();

  // Cursor interactions
  const interactiveElements = document.querySelectorAll(
    "a, button, .feature-card, .command-item, .cta-button"
  );

  interactiveElements.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      document.body.classList.add("cursor-hover");
    });

    el.addEventListener("mouseleave", () => {
      document.body.classList.remove("cursor-hover");
    });

    el.addEventListener("mousedown", () => {
      document.body.classList.add("cursor-click");
    });

    el.addEventListener("mouseup", () => {
      document.body.classList.remove("cursor-click");
    });
  });
}

// Advanced Theme System with Animations
function initializeTheme() {
  const themeToggle = document.getElementById("theme-toggle");
  themeTransition = document.getElementById("theme-transition");
  const html = document.documentElement;

  // Set initial theme
  if (currentTheme === "dark") {
    html.classList.add("dark");
    themeToggle.checked = true;
  }

  themeToggle.addEventListener("change", () => {
    const newTheme = themeToggle.checked ? "dark" : "light";
    animateThemeTransition(newTheme);
  });
}

function animateThemeTransition(newTheme) {
  const html = document.documentElement;
  const isDark = newTheme === "dark";

  // Position transition element at toggle button
  const toggleRect = document
    .getElementById("theme-toggle")
    .getBoundingClientRect();
  themeTransition.style.left = `${toggleRect.left + toggleRect.width / 2}px`;
  themeTransition.style.top = `${toggleRect.top + toggleRect.height / 2}px`;

  // Animate transition
  themeTransition.classList.add(isDark ? "moon-burst" : "sun-burst");

  // Change theme at peak of animation
  setTimeout(() => {
    if (isDark) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
    localStorage.setItem("theme", newTheme);
    currentTheme = newTheme;
  }, 400);

  // Reset transition
  setTimeout(() => {
    themeTransition.classList.remove("moon-burst", "sun-burst");
  }, 800);
}

// Particles System
function initializeParticles() {
  if (typeof particlesJS !== "undefined") {
    particlesJS("particles-js", {
      particles: {
        number: {
          value: isHighPerformanceDevice() ? 100 : 50,
          density: { enable: true, value_area: 800 },
        },
        color: { value: "#f59e0b" },
        shape: {
          type: "circle",
          stroke: { width: 0, color: "#000000" },
        },
        opacity: {
          value: 0.3,
          random: true,
          anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false },
        },
        size: {
          value: 3,
          random: true,
          anim: { enable: true, speed: 2, size_min: 0.1, sync: false },
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#f59e0b",
          opacity: 0.2,
          width: 1,
        },
        move: {
          enable: true,
          speed: 1,
          direction: "none",
          random: false,
          straight: false,
          out_mode: "out",
          bounce: false,
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: true, mode: "repulse" },
          onclick: { enable: true, mode: "push" },
          resize: true,
        },
        modes: {
          grab: { distance: 400, line_linked: { opacity: 1 } },
          bubble: {
            distance: 400,
            size: 40,
            duration: 2,
            opacity: 8,
            speed: 3,
          },
          repulse: { distance: 100, duration: 0.4 },
          push: { particles_nb: 4 },
          remove: { particles_nb: 2 },
        },
      },
      retina_detect: true,
    });
  }
}

// GSAP Animations
function initializeAnimations() {
  // Set initial states
  gsap.set(".hero-logo img", { scale: 0, rotation: -180 });
  gsap.set(".hero-title", { y: 100, opacity: 0 });
  gsap.set(".hero-subtitle", { y: 50, opacity: 0 });
  gsap.set(".hero-description", { y: 30, opacity: 0 });
  gsap.set(".hero-buttons", { y: 40, opacity: 0 });
  gsap.set(".hero-stats", { y: 60, opacity: 0 });
}

function startMainAnimations() {
  // Hero animations timeline
  const heroTl = gsap.timeline();

  heroTl
    .to(".hero-logo img", {
      scale: 1,
      rotation: 0,
      duration: 1,
      ease: "back.out(1.7)",
    })
    .to(
      ".hero-title",
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
      },
      "-=0.5"
    )
    .to(
      ".hero-subtitle",
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
      },
      "-=0.3"
    )
    .to(
      ".hero-description",
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
      },
      "-=0.2"
    )
    .to(
      ".hero-buttons",
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
      },
      "-=0.3"
    )
    .to(
      ".hero-stats",
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
      },
      "-=0.4"
    );

  // Animate stats counters
  setTimeout(() => {
    animateCounters();
  }, 2000);
}

// Counter Animation
function animateCounters() {
  // Load statistics from config if available
  if (window.TourneyMasterConfig && window.TourneyMasterConfig.content.stats) {
    const configStats = window.TourneyMasterConfig.content.stats;

    // Update data-target attributes from config
    const statElements = document.querySelectorAll(
      ".stat-number, .stat-number-large"
    );
    statElements.forEach((element) => {
      const parent = element.closest(".stat-item, .stat-card");
      if (parent) {
        const statIcon = parent.querySelector(
          ".stat-icon i, .stat-icon-large i"
        );
        if (statIcon) {
          if (statIcon.classList.contains("fa-server")) {
            element.setAttribute("data-target", configStats.servers);
          } else if (statIcon.classList.contains("fa-users")) {
            element.setAttribute("data-target", configStats.users);
          } else if (statIcon.classList.contains("fa-trophy")) {
            element.setAttribute("data-target", configStats.tournaments);
          } else if (statIcon.classList.contains("fa-clock")) {
            element.setAttribute("data-target", configStats.uptime);
          }
        }
      }
    });
  }

  const counters = document.querySelectorAll(
    ".stat-number, .stat-number-large"
  );

  counters.forEach((counter) => {
    const target = parseInt(counter.getAttribute("data-target"));
    const duration = 2;

    gsap.to(counter, {
      innerHTML: target,
      duration: duration,
      ease: "power2.out",
      snap: { innerHTML: 1 },
      onUpdate: function () {
        counter.innerHTML = Math.ceil(counter.innerHTML).toLocaleString();
      },
    });
  });
}

// Scroll-triggered animations
function initializeScrollEffects() {
  // Feature cards animation
  gsap.utils.toArray(".feature-card").forEach((card, index) => {
    gsap.fromTo(
      card,
      {
        y: 100,
        opacity: 0,
        rotationX: -15,
      },
      {
        y: 0,
        opacity: 1,
        rotationX: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
        delay: index * 0.1,
      }
    );
  });

  // Section titles animation
  gsap.utils.toArray(".section-title").forEach((title) => {
    gsap.fromTo(
      title,
      {
        y: 50,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: title,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });

  // Command items animation
  gsap.utils.toArray(".command-item").forEach((item, index) => {
    gsap.fromTo(
      item,
      {
        x: index % 2 === 0 ? -50 : 50,
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: item,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
        delay: (index % 4) * 0.1,
      }
    );
  });

  // Parallax effects
  gsap.utils.toArray(".hero-logo img").forEach((img) => {
    gsap.to(img, {
      y: -50,
      ease: "none",
      scrollTrigger: {
        trigger: img,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });
  });
}

// Navigation
function initializeNavigation() {
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  mobileMenuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("translate-y-0");
    mobileMenu.classList.toggle("-translate-y-full");
  });

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const target = document.querySelector(targetId);

      if (target) {
        // Close mobile menu if open
        const mobileMenu = document.getElementById("mobile-menu");
        if (mobileMenu && !mobileMenu.classList.contains("-translate-y-full")) {
          mobileMenu.classList.add("-translate-y-full");
          mobileMenu.classList.remove("translate-y-0");
        }

        // Smooth scroll to target
        const targetPosition = target.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // Navigation background on scroll
  ScrollTrigger.create({
    start: "top -80",
    end: 99999,
    toggleClass: {
      className: "nav-scrolled",
      targets: "nav",
    },
  });
}

// Commands System
function initializeCommands() {
  const commands = {
    Bot: [
      {
        name: "about",
        description:
          "Get information about the bot including version, server count, and system stats.",
      },
      {
        name: "help",
        description:
          "Display all available commands with descriptions and usage examples.",
      },
      {
        name: "ping",
        description: "Check the bot's latency and uptime information.",
      },
    ],
    Tournament: [
      {
        name: "auto_room",
        description:
          "Start or manually trigger the automatic room creation process for tournaments.",
      },
      {
        name: "correct_bracket",
        description: "Correct a match score in a Challonge tournament bracket.",
      },
      {
        name: "players_list",
        description: "Get a list of all players registered in the tournament.",
      },
      {
        name: "room_create",
        description: "Create rooms for open matches in a Challonge tournament.",
      },
      {
        name: "show_available_rooms",
        description:
          "Show available rooms that can be created for a tournament.",
      },
      {
        name: "staff",
        description: "Manage tournament staff members and their roles.",
      },
      {
        name: "stop_auto_room",
        description: "Stop automatic room creation for tournaments.",
      },
      {
        name: "team_info",
        description: "Get information about a team or player in a tournament.",
      },
      {
        name: "toggle_auto_room",
        description: "Toggle automatic room creation for a tournament on/off.",
      },
      {
        name: "tour_info",
        description: "Get detailed information about the tournament.",
      },
      {
        name: "transcript",
        description: "Generate a transcript of all messages viewable online.",
      },
      {
        name: "upload_score",
        description: "Update a match score from a Challonge tournament.",
      },
    ],
    Attendance: [
      {
        name: "add_link",
        description: "Add a recording link to an existing attendance record.",
      },
      {
        name: "attendance",
        description: "Mark attendance for the match in this channel.",
      },
      {
        name: "delete_attendance",
        description: "Delete a specific attendance record for a match.",
      },
      {
        name: "get_attendance",
        description:
          "Get attendance records for a user in a specific tournament.",
      },
      {
        name: "get_sheet",
        description:
          "Generate an Excel file of a tournament's attendance and work counts.",
      },
      {
        name: "missing_links",
        description:
          "Show matches missing recording links with detailed information.",
      },
      {
        name: "staff_work",
        description: "Get work count for all staff in a specific tournament.",
      },
      {
        name: "work_done",
        description: "Get work count for a user in a specific tournament.",
      },
    ],
    Moderation: [
      {
        name: "banlist",
        description: "Generate a list of all banned users in the server.",
      },
      {
        name: "categorymonitor",
        description:
          "Manage category monitoring for automatic channel management.",
      },
      {
        name: "clear_category",
        description: "Delete all channels in a specified category.",
      },
      {
        name: "purge",
        description:
          "Delete a specified number of messages from the channel (1-100).",
      },
      {
        name: "purge_all",
        description:
          "Delete all messages in the current channel, including those older than 14 days.",
      },
      {
        name: "purge_word",
        description:
          "Privately delete all messages containing a specific word in the current channel.",
      },
      {
        name: "recurringmessage",
        description: "Manage recurring messages in channels.",
      },
      {
        name: "resetnicks",
        description: "Reset all member nicknames to their usernames.",
      },
      {
        name: "server_info",
        description: "Get detailed information about the server.",
      },
    ],
    Fun: [
      {
        name: "avatar",
        description: "Get the avatar of a user in high resolution.",
      },
      { name: "choose", description: "Choose randomly from provided options." },
      { name: "countdown", description: "Start a countdown timer for events." },
      {
        name: "enlarge",
        description: "Enlarge a provided emoji for better visibility.",
      },
      {
        name: "localtime",
        description: "Convert UTC time to your local timezone.",
      },
      { name: "toss", description: "Toss a coin and get heads or tails." },
      {
        name: "translate",
        description: "Translate text to a specified language.",
      },
      {
        name: "user",
        description: "Get detailed information about a specified user.",
      },
    ],
    Settings: [
      { name: "settings", description: "Manage bot settings for your server." },
      {
        name: "staff_config",
        description: "Configure or view staff roles and channels.",
      },
      {
        name: "tournament",
        description: "Manage tournament configurations and settings.",
      },
    ],
    Schedule: [
      {
        name: "result_delete",
        description:
          "Delete recorded match results and revert to scheduled status.",
      },
      {
        name: "schedule_create",
        description:
          "Schedule a match in this channel with automatic player notifications.",
      },
      {
        name: "schedule_delete",
        description: "Delete the active schedule for this match.",
      },
      {
        name: "schedule_refresh",
        description: "Refresh schedule buttons and get schedule link.",
      },
      {
        name: "schedule_resign",
        description: "Resign from your assigned staff role for this match.",
      },
      {
        name: "schedule_result",
        description:
          "Mark the scheduled match as completed and record results.",
      },
      {
        name: "schedule_show",
        description: "View match schedules and results.",
      },
      {
        name: "schedule_unassigned",
        description: "View all pending matches without staff assignments.",
      },
      {
        name: "schedule_update",
        description: "Update existing match schedules.",
      },
    ],
    User: [
      {
        name: "profile",
        description: "Manage your game profile and tournament statistics.",
      },
      {
        name: "userinfo",
        description: "Get public information about yourself or another user.",
      },
    ],
  };

  const commandsContainer = document.getElementById("commands-container");
  const commandSearch = document.getElementById("command-search");
  const categoryFilters = document.querySelectorAll(".category-filter");

  let currentFilter = "all";

  function renderCommands(searchTerm = "", category = "all") {
    commandsContainer.innerHTML = "";

    Object.entries(commands).forEach(([categoryName, categoryCommands]) => {
      if (category !== "all" && category !== categoryName) return;

      const filteredCommands = categoryCommands.filter(
        (cmd) =>
          cmd.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cmd.description.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (filteredCommands.length === 0) return;

      const categoryDiv = document.createElement("div");
      categoryDiv.className = "command-category";

      const categoryTitle = document.createElement("h3");
      categoryTitle.className = "command-category-title";
      categoryTitle.textContent = categoryName;

      const commandGrid = document.createElement("div");
      commandGrid.className = "command-grid";

      filteredCommands.forEach((cmd, index) => {
        const commandItem = document.createElement("div");
        commandItem.className = "command-item";
        commandItem.innerHTML = `
                    <div class="command-name">/${cmd.name}</div>
                    <div class="command-description">${cmd.description}</div>
                `;

        // Add hover effects
        commandItem.addEventListener("mouseenter", () => {
          gsap.to(commandItem, {
            scale: 1.02,
            y: -8,
            duration: 0.3,
            ease: "power2.out",
          });
        });

        commandItem.addEventListener("mouseleave", () => {
          gsap.to(commandItem, {
            scale: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out",
          });
        });

        commandGrid.appendChild(commandItem);
      });

      categoryDiv.appendChild(categoryTitle);
      categoryDiv.appendChild(commandGrid);
      commandsContainer.appendChild(categoryDiv);
    });

    // Animate new commands
    gsap.fromTo(
      ".command-category",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
    );
  }

  // Search functionality
  commandSearch.addEventListener("input", (e) => {
    renderCommands(e.target.value, currentFilter);
  });

  // Category filtering
  categoryFilters.forEach((filter) => {
    filter.addEventListener("click", () => {
      categoryFilters.forEach((f) => f.classList.remove("active"));
      filter.classList.add("active");
      currentFilter = filter.getAttribute("data-category");
      renderCommands(commandSearch.value, currentFilter);
    });
  });

  // Initial render
  renderCommands();
}

// Interactive Elements
function initializeInteractions() {
  // Button hover effects
  document.querySelectorAll(".cta-button").forEach((button) => {
    button.addEventListener("mouseenter", () => {
      gsap.to(button, {
        scale: 1.05,
        y: -4,
        duration: 0.3,
        ease: "power2.out",
      });
    });

    button.addEventListener("mouseleave", () => {
      gsap.to(button, {
        scale: 1,
        y: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    });
  });

  // Feature card interactions
  document.querySelectorAll(".feature-card").forEach((card) => {
    card.addEventListener("mouseenter", () => {
      gsap.to(card, {
        rotationY: 5,
        rotationX: 5,
        scale: 1.05,
        duration: 0.4,
        ease: "power2.out",
      });
    });

    card.addEventListener("mouseleave", () => {
      gsap.to(card, {
        rotationY: 0,
        rotationX: 0,
        scale: 1,
        duration: 0.4,
        ease: "power2.out",
      });
    });
  });

  // Floating animation for hero logo
  gsap.to(".hero-logo img", {
    y: -20,
    duration: 3,
    ease: "power1.inOut",
    yoyo: true,
    repeat: -1,
  });

  // Continuous animations
  startContinuousAnimations();
}

function startContinuousAnimations() {
  // Gradient animations
  gsap.to(".hero-title", {
    backgroundPosition: "200% 0",
    duration: 3,
    ease: "none",
    repeat: -1,
  });

  // Floating particles effect
  if (isHighPerformanceDevice()) {
    createFloatingElements();
  }
}

function createFloatingElements() {
  const heroSection = document.getElementById("hero");
  const numElements = 20;

  for (let i = 0; i < numElements; i++) {
    const element = document.createElement("div");
    element.className = "floating-element";
    element.style.cssText = `
            position: absolute;
            width: ${Math.random() * 6 + 2}px;
            height: ${Math.random() * 6 + 2}px;
            background: rgba(245, 158, 11, ${Math.random() * 0.5 + 0.2});
            border-radius: 50%;
            pointer-events: none;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
        `;

    heroSection.appendChild(element);

    // Animate floating elements
    gsap.to(element, {
      y: -100,
      x: Math.random() * 200 - 100,
      opacity: 0,
      duration: Math.random() * 10 + 5,
      ease: "none",
      repeat: -1,
      delay: Math.random() * 5,
    });
  }
}

// Performance monitoring
function monitorPerformance() {
  let frameCount = 0;
  let lastTime = performance.now();

  function countFrames() {
    frameCount++;
    const currentTime = performance.now();

    if (currentTime - lastTime >= 1000) {
      const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));

      // Adjust animations based on performance
      if (fps < 30) {
        document.body.classList.add("low-performance");
        // Reduce particle count
        if (typeof pJSDom !== "undefined" && pJSDom[0]) {
          pJSDom[0].pJS.particles.number.value = 25;
        }
      }

      frameCount = 0;
      lastTime = currentTime;
    }

    requestAnimationFrame(countFrames);
  }

  countFrames();
}

// Start performance monitoring
monitorPerformance();

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
  // Toggle theme with Ctrl/Cmd + D
  if ((e.ctrlKey || e.metaKey) && e.key === "d") {
    e.preventDefault();
    document.getElementById("theme-toggle").click();
  }

  // Focus search with Ctrl/Cmd + K
  if ((e.ctrlKey || e.metaKey) && e.key === "k") {
    e.preventDefault();
    document.getElementById("command-search").focus();
  }
});

// Intersection Observer for lazy loading
const observerOptions = {
  root: null,
  rootMargin: "50px",
  threshold: 0.1,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all animatable elements
document
  .querySelectorAll(".feature-card, .command-item, .stat-item")
  .forEach((el) => {
    observer.observe(el);
  });

// Error handling
window.addEventListener("error", (e) => {
  console.error("JavaScript error:", e.error);
  // Fallback for critical functionality
  if (
    e.error.message.includes("gsap") ||
    e.error.message.includes("ScrollTrigger")
  ) {
    // Fallback to CSS animations
    document.body.classList.add("fallback-animations");
  }
});

// Cleanup on page unload
window.addEventListener("beforeunload", () => {
  // Clean up GSAP animations
  gsap.killTweensOf("*");
  ScrollTrigger.killAll();
});

// Export for debugging
window.TourneyMasterWebsite = {
  animateThemeTransition,
  renderCommands: () => initializeCommands(),
  performance: {
    fps: FPS_TARGET,
    isHighPerformance: isHighPerformanceDevice(),
  },
};
