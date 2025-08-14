// Global State Management
class WebsiteState {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.currentLang = localStorage.getItem('language') || 'en';
        this.init();
    }

    init() {
        this.applyTheme();
        this.applyLanguage();
        this.setupEventListeners();
        // this.initAnimations();
        this.initScrollEffects();
        this.initVideoBackground();
    }

    // Theme Management
    applyTheme() {
        document.body.className = document.body.className.replace(/\b(light|dark)-theme\b/g, '').trim();
        document.body.classList.add(`${this.currentTheme}-theme`);
        localStorage.setItem('theme', this.currentTheme);
        
        // Force immediate header color update
        const header = document.querySelector('.header');
        if (header) {
            const scrollY = window.scrollY;
            if (scrollY > 100) {
                header.style.background = this.currentTheme === 'light' 
                    ? 'rgba(255, 255, 255, 1)' 
                    : 'rgba(26, 26, 26, 1)';
            } else {
                header.style.background = this.currentTheme === 'light' 
                    ? 'rgba(255, 255, 255, 0.98)' 
                    : 'rgba(26, 26, 26, 0.98)';
            }
        }
    }

    toggleTheme() {
        // Debounce theme toggle to prevent rapid switching
        if (this.themeToggleTimeout) return;
        
        this.themeToggleTimeout = setTimeout(() => {
            this.themeToggleTimeout = null;
        }, 400);
        
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        
        // Optimized theme transition
        document.documentElement.style.setProperty('--transition-duration', '0.3s');
        setTimeout(() => {
            document.documentElement.style.removeProperty('--transition-duration');
        }, 300);
    }

    // Language Management
    applyLanguage() {
        document.body.setAttribute('data-lang', this.currentLang);
        localStorage.setItem('language', this.currentLang);
        
        // Update all text elements
        const elements = document.querySelectorAll('[data-de][data-en]');
        elements.forEach(element => {
            const text = element.getAttribute(`data-${this.currentLang}`);
            if (text) {
                element.textContent = text;
            }
        });

        // Update language toggle
        const langOptions = document.querySelectorAll('.lang-option');
        langOptions.forEach(option => {
            option.classList.remove('active');
            if (option.textContent.toLowerCase() === this.currentLang) {
                option.classList.add('active');
            }
        });
    }

    toggleLanguage() {
        this.currentLang = this.currentLang === 'de' ? 'en' : 'de';
        this.applyLanguage();
    }

    // Event Listeners Setup
    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Language toggle
        const langToggle = document.getElementById('langToggle');
        if (langToggle) {
            langToggle.addEventListener('click', () => this.toggleLanguage());
        }

        // Smooth scrolling for navigation
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // CTA buttons
        const ctaPrimary = document.querySelector('.cta-primary');
        if (ctaPrimary) {
            ctaPrimary.addEventListener('click', () => {
                document.querySelector('#journey').scrollIntoView({
                    behavior: 'smooth'
                });
            });
        }

        const ctaSecondary = document.querySelector('.cta-secondary');
        if (ctaSecondary) {
            ctaSecondary.addEventListener('click', () => {
                document.querySelector('#contact').scrollIntoView({
                    behavior: 'smooth'
                });
            });
        }

        // Mobile menu toggle
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const mobileMenu = document.querySelector('.mobile-menu');
        if (mobileToggle && mobileMenu) {
            mobileToggle.addEventListener('click', () => {
                mobileToggle.classList.toggle('active');
                mobileMenu.classList.toggle('active');
                document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
            });
        }

        // Mobile menu links
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    // Close mobile menu
                    mobileToggle.classList.remove('active');
                    mobileMenu.classList.remove('active');
                    document.body.style.overflow = '';
                    
                    // Scroll to section
                    setTimeout(() => {
                        targetSection.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }, 300);
                }
            });
        });

        // Mobile theme toggle
        const mobileThemeToggle = document.getElementById('mobileThemeToggle');
        if (mobileThemeToggle) {
            mobileThemeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Mobile language toggle
        const mobileLangToggle = document.getElementById('mobileLangToggle');
        if (mobileLangToggle) {
            mobileLangToggle.addEventListener('click', () => this.toggleLanguage());
        }

        // Window resize handler
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Scroll event for header background
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });
    }

    // Scroll Effects
    initScrollEffects() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe all sections
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            observer.observe(section);
        });

        // Observe timeline content directly
        const timelineContent = document.querySelectorAll('.timeline-content');
        timelineContent.forEach(content => {
            observer.observe(content);
        });

        // Observe cards
        const cards = document.querySelectorAll('.moment-card, .why-card');
        cards.forEach(card => {
            observer.observe(card);
        });
    }

    handleScroll() {
        const header = document.querySelector('.header');
        const scrollY = window.scrollY;

        if (scrollY > 100) {
            header.style.background = this.currentTheme === 'light' 
                ? 'rgba(255, 255, 255, 1)' 
                : 'rgba(26, 26, 26, 1)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = this.currentTheme === 'light' 
                ? 'rgba(255, 255, 255, 0.98)' 
                : 'rgba(26, 26, 26, 0.98)';
            header.style.boxShadow = 'none';
        }
    }

    handleResize() {
        // Handle responsive changes for video background
        const video = document.querySelector('.hero-video');
        if (video) {
            // Video automatically handles resizing via CSS
        }
    }

    // Animation Initialization
/*    initAnimations() {
        // Add CSS classes for scroll animations
        const style = document.createElement('style');
        style.textContent = `
            .animate-in {
                animation: slideInUp 0.6s ease-out forwards;
            }
            
            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .timeline-content.animate-in {
                transition: all 0.6s ease-out;
                opacity: 1 !important;
                transform: translateX(0) !important;
            }
            
            @keyframes slideInLeft {
                from {
                    opacity: 0;
                    transform: translateX(-50px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(50px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            .moment-card.animate-in,
            .why-card.animate-in {
                animation: scaleIn 0.6s ease-out forwards;
            }
            
            @keyframes scaleIn {
                from {
                    opacity: 0;
                    transform: scale(0.8);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }
        `;
        document.head.appendChild(style);
    } */

    // Video Background Management
    initVideoBackground() {
        const video = document.querySelector('.hero-video');
        if (!video) return;

        // Ensure video starts from beginning
        video.currentTime = 0;

        // Handle video loading and errors
        video.addEventListener('loadeddata', () => {
            console.log('Video loaded successfully');
        });

        video.addEventListener('error', (e) => {
            console.log('Video failed to load, showing fallback');
            const fallback = document.querySelector('.video-fallback');
            if (fallback) {
                fallback.style.display = 'block';
            }
        });

        // Ensure video plays (handle autoplay restrictions)
        const playVideo = () => {
            video.play().catch((error) => {
                console.log('Autoplay was prevented:', error);
                // Show fallback if autoplay fails
                const fallback = document.querySelector('.video-fallback');
                if (fallback) {
                    fallback.style.display = 'block';
                }
            });
        };

        // Try to play video when ready
        if (video.readyState >= 3) {
            playVideo();
        } else {
            video.addEventListener('canplaythrough', playVideo, { once: true });
        }

        // Pause video when not visible (performance optimization)
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    playVideo();
                } else {
                    video.pause();
                }
            });
        }, { threshold: 0.1 });

        observer.observe(video);
    }
}

// 3D Shape Interactions
class Shape3DInteractions {
    constructor() {
        this.init();
    }

    init() {
        this.setupHoverEffects();
        this.setupMouseTracking();
    }

    setupHoverEffects() {
        // Add hover effects to 3D shapes
        const shapes3D = document.querySelectorAll('.icon-3d, .moment-3d, .shape, .contact-shape');
        
        shapes3D.forEach(shape => {
            shape.addEventListener('mouseenter', (e) => {
                e.target.style.transform += ' scale(1.1)';
                e.target.style.transition = 'transform 0.3s ease';
            });
            
            shape.addEventListener('mouseleave', (e) => {
                e.target.style.transform = e.target.style.transform.replace(' scale(1.1)', '');
            });
        });
    }

    setupMouseTracking() {
        // Mouse parallax effect for floating shapes
        const floatingShapes = document.querySelectorAll('.floating-shapes .shape');
        
        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            floatingShapes.forEach((shape, index) => {
                const speed = (index + 1) * 0.02;
                const x = (mouseX - 0.5) * 50 * speed;
                const y = (mouseY - 0.5) * 50 * speed;
                
                shape.style.transform += ` translate(${x}px, ${y}px)`;
            });
        });
    }
}

// Smooth Scrolling with Easing
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        // Custom smooth scrolling with easing
        const navLinks = document.querySelectorAll('a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    this.scrollToElement(targetElement);
                }
            });
        });
    }

    scrollToElement(element) {
        const targetPosition = element.offsetTop - 80; // Account for fixed header
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 1000;
        let start = null;

        const animation = (currentTime) => {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const run = this.easeInOutQuad(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);
    }

    easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
}

// Performance Optimization
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.lazyLoadImages();
        this.optimizeAnimations();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    optimizeAnimations() {
        // Reduce animations on low-performance devices
        if (navigator.hardwareConcurrency < 4) {
            document.body.classList.add('reduce-animations');
            
            const style = document.createElement('style');
            style.textContent = `
                .reduce-animations * {
                    animation-duration: 0.01ms !important;
                    animation-delay: 0.01ms !important;
                    transition-duration: 0.01ms !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Accessibility Enhancements
class AccessibilityEnhancer {
    constructor() {
        this.init();
    }

    init() {
        this.setupKeyboardNavigation();
        this.setupScreenReaderSupport();
        this.setupFocusManagement();
    }

    setupKeyboardNavigation() {
        // Add keyboard support for custom interactive elements
        const interactiveElements = document.querySelectorAll('.theme-toggle, .lang-toggle, .cta-primary, .cta-secondary');
        
        interactiveElements.forEach(element => {
            element.setAttribute('tabindex', '0');
            
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    element.click();
                }
            });
        });
    }

    setupScreenReaderSupport() {
        // Add ARIA labels and descriptions
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.setAttribute('aria-label', 'Toggle dark/light theme');
        }

        const langToggle = document.getElementById('langToggle');
        if (langToggle) {
            langToggle.setAttribute('aria-label', 'Switch language between German and English');
        }
    }

    setupFocusManagement() {
        // Ensure focus is visible
        const style = document.createElement('style');
        style.textContent = `
            *:focus {
                outline: 2px solid var(--highlight-color);
                outline-offset: 2px;
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main website functionality
    const websiteState = new WebsiteState();
    const shape3DInteractions = new Shape3DInteractions();
    const smoothScroll = new SmoothScroll();
    const performanceOptimizer = new PerformanceOptimizer();
    const accessibilityEnhancer = new AccessibilityEnhancer();

    // Add loading animation completion
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);

    // Add initial loading styles
    const loadingStyle = document.createElement('style');
    loadingStyle.textContent = `
        body:not(.loaded) {
            overflow: hidden;
        }
        
        body:not(.loaded) .hero-text,
        body:not(.loaded) .hero-visual {
            opacity: 0;
            transform: translateY(30px);
        }
        
        body.loaded .hero-text,
        body.loaded .hero-visual {
            opacity: 1;
            transform: translateY(0);
            transition: all 1s ease-out;
        }
    `;
    document.head.appendChild(loadingStyle);

    console.log('Website initialized successfully!');


});

