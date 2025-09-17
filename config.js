window.TourneyMasterConfig = {
  // Performance Settings
  performance: {
    targetFPS: 100,
    fallbackFPS: 60,
    enableParticles: true,
    particleCount: {
      high: 100,
      low: 50,
    },
    enableGPUAcceleration: true,
    adaptiveQuality: true,
  },

  // Animation Settings
  animations: {
    enableScrollAnimations: true,
    enableHoverEffects: true,
    enable3DEffects: true,
    animationDuration: {
      fast: 0.3,
      normal: 0.6,
      slow: 1.0,
    },
    easingFunctions: {
      default: "power2.out",
      bounce: "back.out(1.7)",
      smooth: "power3.inOut",
    },
  },

  // Theme Settings
  theme: {
    enableThemeTransition: true,
    transitionDuration: 0.8,
    enableKeyboardShortcuts: true,
    persistTheme: true,
    defaultTheme: "light",
  },

  // Cursor Settings
  cursor: {
    enableCustomCursor: true,
    trailLength: 5,
    hoverScale: 2,
    clickScale: 0.5,
    blendMode: "difference",
  },

  // Content Settings
  content: {
    siteName: "Tourney Master",
    tagline: "The Ultimate Discord Bot for Tournament Management",
    description:
      "Experience the future of tournament management with advanced automation, real-time tracking, and seamless Discord integration.",

    // Social Links
    social: {
      discord: "https://discord.gg/DX46SJBqqX",
      github: "",
      twitter: "",
      youtube: "",
      botInvite:
        "https://discord.com/oauth2/authorize?client_id=1408470636195483840&permissions=8&response_type=code&redirect_uri=https%3A%2F%2Fshockwav-e.github.io%2FTourney-Bot-Github-Page%2F&integration_type=0&scope=bot+applications.commands+guilds.join",
    },

    // Contact Information
    contact: {
      email: "support@tourneymaster.com",
      discord: "https://discord.gg/DX46SJBqqX",
    },

    // Statistics (for counter animation)
    stats: {
      servers: 7,
      users: 5658,
      tournaments: 10,
      uptime: 99,
    },
  },

  // Feature Flags
  features: {
    enableCommandSearch: true,
    enableCategoryFilter: true,
    enableMobileMenu: true,
    enableLoadingScreen: true,
    enablePerformanceMonitoring: true,
    enableErrorHandling: true,
    enableKeyboardShortcuts: true,
  },

  // Color Scheme
  colors: {
    primary: "#f59e0b",
    secondary: "#d97706",
    accent: "#b45309",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#3b82f6",
  },

  // Responsive Breakpoints
  breakpoints: {
    mobile: 768,
    tablet: 1024,
    desktop: 1280,
    large: 1536,
  },

  // SEO Settings
  seo: {
    title: "Tourney Master - Premium Discord Bot",
    description:
      "The ultimate Discord bot for tournament management with advanced automation, real-time tracking, and seamless integration.",
    keywords:
      "discord bot, tournament, gaming, esports, management, automation",
    author: "Tourney Master Team",
    ogImage: "tourney master.png",
  },

  // Development Settings
  development: {
    enableDebugMode: false,
    showPerformanceMetrics: false,
    enableConsoleLogging: false,
    enableTestMode: false,
  },
};

// Apply configuration on load
document.addEventListener("DOMContentLoaded", () => {
  // Apply theme
  if (window.TourneyMasterConfig.theme.defaultTheme === "dark") {
    document.documentElement.classList.add("dark");
  }

  // Apply SEO meta tags
  const config = window.TourneyMasterConfig;
  document.title = config.seo.title;

  // Update meta description
  let metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    metaDescription = document.createElement("meta");
    metaDescription.name = "description";
    document.head.appendChild(metaDescription);
  }
  metaDescription.content = config.seo.description;

  // Update meta keywords
  let metaKeywords = document.querySelector('meta[name="keywords"]');
  if (!metaKeywords) {
    metaKeywords = document.createElement("meta");
    metaKeywords.name = "keywords";
    document.head.appendChild(metaKeywords);
  }
  metaKeywords.content = config.seo.keywords;

  // Update author
  let metaAuthor = document.querySelector('meta[name="author"]');
  if (!metaAuthor) {
    metaAuthor = document.createElement("meta");
    metaAuthor.name = "author";
    document.head.appendChild(metaAuthor);
  }
  metaAuthor.content = config.seo.author;

  console.log("🚀 Tourney Master Website Configuration Loaded");
});
