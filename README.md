# 🏆 Tourney Master - Premium Discord Bot Website

A modern, high-performance website for the Tourney Master Discord bot featuring cutting-edge animations, custom cursor effects, and premium design elements optimized for 120fps performance.

## ✨ Features

### 🎨 **Premium Design**
- Modern gradient backgrounds with animated transitions
- Glass-morphism effects with backdrop blur
- Custom typography using Inter and JetBrains Mono fonts
- Responsive design optimized for all devices
- Dark/Light theme with animated sun/moon burst transitions

### 🖱️ **Custom Cursor System**
- Advanced custom cursor with smooth trailing effects
- Interactive hover states with scale and glow effects
- Blend mode effects for premium feel
- Performance-optimized with 120fps support

### 🎭 **Advanced Animations**
- GSAP-powered animations with ScrollTrigger
- Particle system background with interactive effects
- Typewriter effect for hero title
- Smooth scroll animations and parallax effects
- Counter animations with easing
- 3D transform effects on hover

### 🌓 **Theme System**
- Smooth theme transitions with burst animations
- Sun/Moon animation effects during theme change
- Persistent theme storage
- Keyboard shortcut support (Ctrl/Cmd + D)

### 🚀 **Performance Optimized**
- 120fps animations on high-performance devices
- Automatic fallback to 60fps on lower-end devices
- GPU-accelerated animations
- Lazy loading with Intersection Observer
- Performance monitoring and adaptive quality

### 📱 **Responsive Design**
- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly interactions
- Optimized for both desktop and mobile

### 🎯 **Interactive Elements**
- Hover effects with 3D transforms
- Command search with real-time filtering
- Category-based command filtering
- Smooth scrolling navigation
- Mobile hamburger menu

## 🛠️ Technologies Used

### **Core Technologies**
- HTML5 with semantic markup
- CSS3 with modern features (Grid, Flexbox, Custom Properties)
- Vanilla JavaScript (ES6+)
- TailwindCSS for utility-first styling

### **Animation Libraries**
- **GSAP 3.12.2** - Professional animation library
- **ScrollTrigger** - Scroll-based animations
- **TextPlugin** - Text animations
- **Particles.js** - Interactive particle system

### **Additional Libraries**
- **Font Awesome 6.5.0** - Icon library
- **Google Fonts** - Inter & JetBrains Mono
- **Three.js** - 3D graphics (ready for future enhancements)
- **Lottie** - Vector animations (ready for future enhancements)

## 📁 File Structure

```
web/
├── index.html          # Main HTML file
├── style.css           # Advanced CSS with animations
├── script.js           # JavaScript with GSAP animations
├── test.html           # Testing suite
├── README.md           # This file
├── tourney master.png  # Logo/favicon
└── .git/              # Git repository
```

## 🚀 Quick Start

1. **Clone or download** the repository
2. **Open `index.html`** in a modern web browser
3. **Enjoy** the premium experience!

### For Development:
```bash
# Open in default browser
start index.html

# Or use a local server (recommended)
python -m http.server 8000
# Then visit http://localhost:8000
```

## 🧪 Testing

Open `test.html` to run the comprehensive test suite that checks:
- File accessibility
- External dependency loading
- Browser compatibility
- Performance metrics
- Visual element functionality
- Responsive design

## ⚡ Performance Features

### **120fps Optimization**
- Hardware detection for optimal frame rates
- GPU-accelerated transforms
- Efficient animation loops
- Memory management

### **Adaptive Quality**
- Automatic performance detection
- Reduced particle count on low-end devices
- Fallback animations for compatibility
- Performance monitoring

### **Loading Optimization**
- Lazy loading for images and animations
- Efficient DOM manipulation
- Minimal reflows and repaints
- Optimized asset loading

## 🎨 Customization

### **Colors**
The website uses a consistent color palette:
- Primary: `#f59e0b` (Amber 500)
- Secondary: `#d97706` (Amber 600)
- Accent: `#b45309` (Amber 700)
- Background: Dynamic based on theme

### **Animations**
All animations can be customized in `script.js`:
- Duration and easing functions
- Trigger points and delays
- Performance thresholds
- Effect intensities

### **Theme**
Easy theme customization:
- CSS custom properties for colors
- TailwindCSS utility classes
- Dark/light mode variants
- Transition animations

## 🔧 Configuration

### **Performance Settings**
```javascript
// In script.js
const FPS_TARGET = isHighPerformanceDevice() ? 120 : 60;
```

### **Particle System**
```javascript
// Particle count based on device performance
number: {
    value: isHighPerformanceDevice() ? 100 : 50
}
```

### **Animation Settings**
```javascript
// GSAP configuration
gsap.config({ force3D: true });
```

## 📱 Browser Support

### **Fully Supported**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### **Partially Supported**
- Chrome 70-89 (reduced animations)
- Firefox 70-87 (reduced animations)
- Safari 12-13 (reduced animations)

### **Required Features**
- CSS Grid and Flexbox
- CSS Custom Properties
- Intersection Observer API
- RequestAnimationFrame
- Local Storage

## 🎯 Features Breakdown

### **Navigation**
- Fixed header with blur background
- Smooth scroll to sections
- Mobile hamburger menu
- Active section highlighting

### **Hero Section**
- Animated logo with floating effect
- Typewriter text animation
- Gradient text effects
- Interactive statistics counters
- Particle background system

### **Features Section**
- 3D card hover effects
- Staggered animations
- Icon animations
- Responsive grid layout

### **Commands Section**
- Real-time search functionality
- Category filtering
- Hover animations
- Comprehensive command database

### **About Section**
- Parallax effects
- Image glow animations
- Feature highlights
- Responsive layout

### **Contact Section**
- Interactive contact cards
- Call-to-action buttons
- Social media links
- Gradient backgrounds

## 🔍 SEO & Accessibility

### **SEO Optimized**
- Semantic HTML structure
- Meta tags and descriptions
- Proper heading hierarchy
- Alt text for images

### **Accessibility**
- Keyboard navigation support
- Screen reader friendly
- High contrast ratios
- Reduced motion support

## 🚀 Deployment

### **Static Hosting**
Perfect for deployment on:
- GitHub Pages
- Netlify
- Vercel
- AWS S3
- Any static hosting service

### **CDN Integration**
All external resources are loaded from CDNs:
- TailwindCSS
- Font Awesome
- Google Fonts
- GSAP
- Particles.js

## 🐛 Troubleshooting

### **Common Issues**

1. **Animations not working**
   - Check browser compatibility
   - Ensure JavaScript is enabled
   - Check console for errors

2. **Performance issues**
   - The site automatically adapts to device performance
   - Lower-end devices get reduced animations
   - Check `test.html` for performance metrics

3. **Theme not switching**
   - Check local storage permissions
   - Ensure JavaScript is enabled
   - Try keyboard shortcut (Ctrl/Cmd + D)

### **Debug Mode**
Open browser console and use:
```javascript
// Access debug utilities
window.TourneyMasterWebsite.performance
```

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## 📞 Support

For support and questions:
- Open an issue on GitHub
- Contact through Discord server
- Email: support@tourneymaster.com

---

**Made with ❤️ for the gaming community**

*Optimized for 120fps • Mobile-first • Accessibility-focused • Performance-driven*