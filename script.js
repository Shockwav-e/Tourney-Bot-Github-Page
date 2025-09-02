// Advanced JavaScript for Tourney Master Website
// Optimized for 120fps performance with modern libraries

// Performance optimization
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
let currentTheme = localStorage.getItem('theme') || 'light';

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
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
    const loadingScreen = document.getElementById('loading-screen');
    
    // Simulate loading time
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        isLoading = false;
        
        // Start main animations after loading
        setTimeout(() => {
            startMainAnimations();
        }, 500);
    }, 2000);
}

// Custom Cursor System
function initializeCursor() {
    cursor = document.getElementById('cursor');
    cursorFollower = document.getElementById('cursor-follower');
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;
    
    // High-performance mouse tracking
    document.addEventListener('mousemove', (e) => {
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
        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        cursorFollower.style.transform = `translate(${followerX}px, ${followerY}px)`;
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Cursor interactions
    const interactiveElements = document.querySelectorAll('a, button, .feature-card, .command-item, .cta-button');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-hover');
        });
        
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-hover');
        });
        
        el.addEventListener('mousedown', () => {
            document.body.classList.add('cursor-click');
        });
        
        el.addEventListener('mouseup', () => {
            document.body.classList.remove('cursor-click');
        });
    });
}

// Advanced Theme System with Animations
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    themeTransition = document.getElementById('theme-transition');
    const html = document.documentElement;
    
    // Set initial theme
    if (currentTheme === 'dark') {
        html.classList.add('dark');
        themeToggle.checked = true;
    }
    
    themeToggle.addEventListener('change', () => {
        const newTheme = themeToggle.checked ? 'dark' : 'light';
        animateThemeTransition(newTheme);
    });
}

function animateThemeTransition(newTheme) {
    const html = document.documentElement;
    const isDark = newTheme === 'dark';
    
    // Position transition element at toggle button
    const toggleRect = document.getElementById('theme-toggle').getBoundingClientRect();
    themeTransition.style.left = `${toggleRect.left + toggleRect.width / 2}px`;
    themeTransition.style.top = `${toggleRect.top + toggleRect.height / 2}px`;
    
    // Animate transition
    themeTransition.classList.add(isDark ? 'moon-burst' : 'sun-burst');
    
    // Change theme at peak of animation
    setTimeout(() => {
        if (isDark) {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }
        localStorage.setItem('theme', newTheme);
        currentTheme = newTheme;
    }, 400);
    
    // Reset transition
    setTimeout(() => {
        themeTransition.classList.remove('moon-burst', 'sun-burst');
    }, 800);
}

// Particles System
function initializeParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: isHighPerformanceDevice() ? 100 : 50,
                    density: { enable: true, value_area: 800 }
                },
                color: { value: '#f59e0b' },
                shape: {
                    type: 'circle',
                    stroke: { width: 0, color: '#000000' }
                },
                opacity: {
                    value: 0.3,
                    random: true,
                    anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: { enable: true, speed: 2, size_min: 0.1, sync: false }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#f59e0b',
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 1,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: { enable: true, mode: 'repulse' },
                    onclick: { enable: true, mode: 'push' },
                    resize: true
                },
                modes: {
                    grab: { distance: 400, line_linked: { opacity: 1 } },
                    bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
                    repulse: { distance: 100, duration: 0.4 },
                    push: { particles_nb: 4 },
                    remove: { particles_nb: 2 }
                }
            },
            retina_detect: true
        });
    }
}

// GSAP Animations
function initializeAnimations() {
    // Set initial states
    gsap.set('.hero-logo img', { scale: 0, rotation: -180 });
    gsap.set('.hero-title', { y: 100, opacity: 0 });
    gsap.set('.hero-subtitle', { y: 50, opacity: 0 });
    gsap.set('.hero-description', { y: 30, opacity: 0 });
    gsap.set('.hero-buttons', { y: 40, opacity: 0 });
    gsap.set('.hero-stats', { y: 60, opacity: 0 });
}

function startMainAnimations() {
    // Hero animations timeline
    const heroTl = gsap.timeline();
    
    heroTl
        .to('.hero-logo img', {
            scale: 1,
            rotation: 0,
            duration: 1,
            ease: 'back.out(1.7)'
        })
        .to('.hero-title', {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out'
        }, '-=0.5')
        .to('.hero-subtitle', {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out'
        }, '-=0.3')
        .to('.hero-description', {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out'
        }, '-=0.2')
        .to('.hero-buttons', {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out'
        }, '-=0.3')
        .to('.hero-stats', {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power2.out'
        }, '-=0.4');
    
    // Animate stats counters
    setTimeout(() => {
        animateCounters();
    }, 2000);
}

// Counter Animation
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2;
        
        gsap.to(counter, {
            innerHTML: target,
            duration: duration,
            ease: 'power2.out',
            snap: { innerHTML: 1 },
            onUpdate: function() {
                counter.innerHTML = Math.ceil(counter.innerHTML).toLocaleString();
            }
        });
    });
}

// Scroll-triggered animations
function initializeScrollEffects() {
    // Feature cards animation
    gsap.utils.toArray('.feature-card').forEach((card, index) => {
        gsap.fromTo(card, 
            {
                y: 100,
                opacity: 0,
                rotationX: -15
            },
            {
                y: 0,
                opacity: 1,
                rotationX: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                },
                delay: index * 0.1
            }
        );
    });
    
    // Section titles animation
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.fromTo(title,
            {
                y: 50,
                opacity: 0
            },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: title,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });
    
    // Command items animation
    gsap.utils.toArray('.command-item').forEach((item, index) => {
        gsap.fromTo(item,
            {
                x: index % 2 === 0 ? -50 : 50,
                opacity: 0
            },
            {
                x: 0,
                opacity: 1,
                duration: 0.6,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: item,
                    start: 'top 90%',
                    toggleActions: 'play none none reverse'
                },
                delay: (index % 4) * 0.1
            }
        );
    });
    
    // Parallax effects
    gsap.utils.toArray('.hero-logo img').forEach(img => {
        gsap.to(img, {
            y: -50,
            ease: 'none',
            scrollTrigger: {
                trigger: img,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            }
        });
    });
}

// Navigation
function initializeNavigation() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('translate-y-0');
        mobileMenu.classList.toggle('-translate-y-full');
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                gsap.to(window, {
                    duration: 1,
                    scrollTo: {
                        y: target,
                        offsetY: 80
                    },
                    ease: 'power2.inOut'
                });
            }
        });
    });
    
    // Navigation background on scroll
    ScrollTrigger.create({
        start: 'top -80',
        end: 99999,
        toggleClass: {
            className: 'nav-scrolled',
            targets: 'nav'
        }
    });
}

// Commands System
function initializeCommands() {
    const commands = {
        "Bot": [
            { name: "about", description: "Get comprehensive information about Tourney Master, including version, features, and statistics." },
            { name: "help", description: "Display all available commands with detailed descriptions and usage examples." },
            { name: "ping", description: "Check the bot's latency, uptime, and connection status with Discord servers." },
            { name: "invite", description: "Get the bot invitation link with proper permissions for your server." }
        ],
        "Tournament": [
            { name: "create", description: "Create a new tournament with customizable settings, brackets, and participant limits." },
            { name: "join", description: "Join an active tournament in your server with automatic role assignment." },
            { name: "leave", description: "Leave a tournament you've joined, with automatic bracket updates." },
            { name: "bracket", description: "View the current tournament bracket with live match results and upcoming games." },
            { name: "schedule", description: "Display tournament schedule with match times and participant notifications." },
            { name: "results", description: "View detailed tournament results, statistics, and winner announcements." },
            { name: "auto_room", description: "Enable automatic room creation for tournament matches with smart scheduling." },
            { name: "room_create", description: "Manually create tournament rooms with proper permissions and settings." },
            { name: "upload_score", description: "Update match scores directly from Discord with validation and logging." }
        ],
        "Moderation": [
            { name: "purge", description: "Delete multiple messages at once with advanced filtering options and safety checks." },
            { name: "ban", description: "Ban users from the server with optional reason and duration settings." },
            { name: "kick", description: "Remove users from the server with logging and notification features." },
            { name: "mute", description: "Temporarily restrict user's ability to send messages with automatic unmute." },
            { name: "warn", description: "Issue warnings to users with automatic escalation and tracking system." },
            { name: "role", description: "Manage user roles with bulk operations and permission validation." },
            { name: "lock", description: "Lock channels to prevent message sending during tournaments or events." },
            { name: "unlock", description: "Unlock previously locked channels with proper permission restoration." }
        ],
        "Fun": [
            { name: "avatar", description: "Display user avatars in high resolution with download links and customization." },
            { name: "choose", description: "Make random choices from provided options with weighted probability support." },
            { name: "countdown", description: "Create interactive countdown timers for tournaments and events." },
            { name: "dice", description: "Roll virtual dice with customizable sides and multiple dice support." },
            { name: "8ball", description: "Ask the magic 8-ball questions and receive mystical answers." },
            { name: "quote", description: "Get inspirational quotes from famous personalities and gaming legends." },
            { name: "meme", description: "Generate random memes from popular gaming and internet culture." },
            { name: "joke", description: "Share random jokes to lighten the mood in your server." }
        ],
        "Settings": [
            { name: "config", description: "Configure bot settings for your server with interactive setup wizard." },
            { name: "prefix", description: "Change the bot's command prefix with validation and conflict checking." },
            { name: "language", description: "Set the bot's language for your server from supported localizations." },
            { name: "timezone", description: "Configure server timezone for accurate tournament scheduling." },
            { name: "permissions", description: "Manage bot permissions and role-based access control." },
            { name: "channels", description: "Set up dedicated channels for tournaments, logs, and announcements." },
            { name: "notifications", description: "Configure notification settings for various bot events and updates." },
            { name: "backup", description: "Create and restore server configuration backups for disaster recovery." }
        ],
        "Schedule": [
            { name: "schedule_create", description: "Create detailed match schedules with participant notifications and reminders." },
            { name: "schedule_edit", description: "Modify existing schedules with automatic participant notification." },
            { name: "schedule_delete", description: "Remove schedules with proper cleanup and participant notification." },
            { name: "schedule_list", description: "View all upcoming and past schedules with filtering options." },
            { name: "remind", description: "Set up custom reminders for tournaments and important events." },
            { name: "calendar", description: "Display server calendar with all scheduled tournaments and events." },
            { name: "availability", description: "Check participant availability for optimal match scheduling." },
            { name: "reschedule", description: "Reschedule matches with conflict detection and participant approval." }
        ]
    };
    
    const commandsContainer = document.getElementById('commands-container');
    const commandSearch = document.getElementById('command-search');
    const categoryFilters = document.querySelectorAll('.category-filter');
    
    let currentFilter = 'all';
    
    function renderCommands(searchTerm = '', category = 'all') {
        commandsContainer.innerHTML = '';
        
        Object.entries(commands).forEach(([categoryName, categoryCommands]) => {
            if (category !== 'all' && category !== categoryName) return;
            
            const filteredCommands = categoryCommands.filter(cmd =>
                cmd.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cmd.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
            
            if (filteredCommands.length === 0) return;
            
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'command-category';
            
            const categoryTitle = document.createElement('h3');
            categoryTitle.className = 'command-category-title';
            categoryTitle.textContent = categoryName;
            
            const commandGrid = document.createElement('div');
            commandGrid.className = 'command-grid';
            
            filteredCommands.forEach((cmd, index) => {
                const commandItem = document.createElement('div');
                commandItem.className = 'command-item';
                commandItem.innerHTML = `
                    <div class="command-name">/${cmd.name}</div>
                    <div class="command-description">${cmd.description}</div>
                `;
                
                // Add hover effects
                commandItem.addEventListener('mouseenter', () => {
                    gsap.to(commandItem, {
                        scale: 1.02,
                        y: -8,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                });
                
                commandItem.addEventListener('mouseleave', () => {
                    gsap.to(commandItem, {
                        scale: 1,
                        y: 0,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                });
                
                commandGrid.appendChild(commandItem);
            });
            
            categoryDiv.appendChild(categoryTitle);
            categoryDiv.appendChild(commandGrid);
            commandsContainer.appendChild(categoryDiv);
        });
        
        // Animate new commands
        gsap.fromTo('.command-category', 
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
        );
    }
    
    // Search functionality
    commandSearch.addEventListener('input', (e) => {
        renderCommands(e.target.value, currentFilter);
    });
    
    // Category filtering
    categoryFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            categoryFilters.forEach(f => f.classList.remove('active'));
            filter.classList.add('active');
            currentFilter = filter.getAttribute('data-category');
            renderCommands(commandSearch.value, currentFilter);
        });
    });
    
    // Initial render
    renderCommands();
}

// Interactive Elements
function initializeInteractions() {
    // Button hover effects
    document.querySelectorAll('.cta-button').forEach(button => {
        button.addEventListener('mouseenter', () => {
            gsap.to(button, {
                scale: 1.05,
                y: -4,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                scale: 1,
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
    
    // Feature card interactions
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                rotationY: 5,
                rotationX: 5,
                scale: 1.05,
                duration: 0.4,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotationY: 0,
                rotationX: 0,
                scale: 1,
                duration: 0.4,
                ease: 'power2.out'
            });
        });
    });
    
    // Floating animation for hero logo
    gsap.to('.hero-logo img', {
        y: -20,
        duration: 3,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1
    });
    
    // Continuous animations
    startContinuousAnimations();
}

function startContinuousAnimations() {
    // Gradient animations
    gsap.to('.hero-title', {
        backgroundPosition: '200% 0',
        duration: 3,
        ease: 'none',
        repeat: -1
    });
    
    // Floating particles effect
    if (isHighPerformanceDevice()) {
        createFloatingElements();
    }
}

function createFloatingElements() {
    const heroSection = document.getElementById('hero');
    const numElements = 20;
    
    for (let i = 0; i < numElements; i++) {
        const element = document.createElement('div');
        element.className = 'floating-element';
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
            ease: 'none',
            repeat: -1,
            delay: Math.random() * 5
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
                document.body.classList.add('low-performance');
                // Reduce particle count
                if (typeof pJSDom !== 'undefined' && pJSDom[0]) {
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
document.addEventListener('keydown', (e) => {
    // Toggle theme with Ctrl/Cmd + D
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        document.getElementById('theme-toggle').click();
    }
    
    // Focus search with Ctrl/Cmd + K
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('command-search').focus();
    }
});

// Intersection Observer for lazy loading
const observerOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all animatable elements
document.querySelectorAll('.feature-card, .command-item, .stat-item').forEach(el => {
    observer.observe(el);
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    // Fallback for critical functionality
    if (e.error.message.includes('gsap') || e.error.message.includes('ScrollTrigger')) {
        // Fallback to CSS animations
        document.body.classList.add('fallback-animations');
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    // Clean up GSAP animations
    gsap.killTweensOf('*');
    ScrollTrigger.killAll();
});

// Export for debugging
window.TourneyMasterWebsite = {
    animateThemeTransition,
    renderCommands: () => initializeCommands(),
    performance: {
        fps: FPS_TARGET,
        isHighPerformance: isHighPerformanceDevice()
    }
};