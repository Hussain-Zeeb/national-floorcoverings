/**
 * Main GSAP Animations for Yugmnhuydf Theme
 * Includes smooth scrolling, header mask, and pinned sections
 */

var $ = jQuery.noConflict();

// Register plugins once at the top level
if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
    console.log("GSAP plugins registered globally");
}

// Main initialization with proper sequence
document.addEventListener("DOMContentLoaded", (event) => {
    // First initialize smooth scrolling (must be before any animations)
    const smoother = initSmoothScrolling();
    
    // Then initialize all other animations with proper timing
    setTimeout(() => {
        // Make smoother globally accessible
        window.smoother = smoother;
        
        // Header mask effect
        initHeaderMask(smoother);
        
        // Pinned sections (if they exist)
        initPinnedSections();
        
        // Force refresh ScrollTrigger after all initializations
        ScrollTrigger.refresh();
        
        console.log("All animations initialized");
    }, 500);
});

/**
 * Initialize smooth scrolling with ScrollSmoother
 */
function initSmoothScrolling() {
    if (typeof ScrollSmoother === 'undefined') {
        console.log('ScrollSmoother not loaded');
        return null;
    }
    
    const smoother = ScrollSmoother.create({
        smooth: 1.5,         // Smoothness factor (1-2 is good)
        effects: true,       // Enables special effects
        normalizeScroll: true // Prevents jumps
    });
    
    console.log("ScrollSmoother initialized");
    return smoother;
}

/**
 * Header Mask Scroll Effect with GSAP (ScrollSmoother Compatible)
 */
function initHeaderMask(smoother) {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.log('GSAP or ScrollTrigger not loaded yet');
        return;
    }
    
    const header = document.querySelector('.header-with-mask');
    
    if (!header) {
        console.log('Header container (.header-with-mask) not found');
        return;
    }
    
    console.log('Header container found!');
    
    // Create the mask overlay automatically
    let headerMask = document.querySelector('.header-mask-overlay');
    if (!headerMask) {
        console.log('Creating header mask overlay...');
        headerMask = document.createElement('div');
        headerMask.className = 'header-mask-overlay brand-mask';
        headerMask.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10;
            opacity: 0;
            pointer-events: none;
            transform: translateY(100vh); /* Start below viewport */
        `;
        header.appendChild(headerMask);
        console.log('Header mask overlay created');
    }
    
    // Find header content
    const headerContent = header.querySelector('.e-con-inner, .elementor-widget-container, .header-content');
    
    // Create animation with smoother awareness
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: header,
            start: "top top",
            end: "60% top",
            scrub: 1,
            markers: false,
            invalidateOnRefresh: true
        }
    });
    
    // Create the bottom-to-top animation
    tl.fromTo(headerMask, {
        opacity: 0,
        y: '100vh' // Start below viewport
    }, {
        opacity: 0.9,
        y: 0,
        ease: "power2.out"
    });
    
    // Fade out content
    if (headerContent) {
        tl.to(headerContent, {
            opacity: 0,
            y: -50,
            ease: "power1.in"
        }, "<");
    }
    
    console.log('Header mask animation created (ScrollSmoother compatible)');
}

/**
 * Pinned Sections Animation
 * Creates scroll-triggered vertical pinned sections with smooth animations
 */
function initPinnedSections() {
    // Check if we have pinned sections
    const container = document.querySelector('.pinned-sections-container');
    if (!container) return;
    
    const sections = container.querySelectorAll('.pinned-section');
    if (sections.length === 0) return;
    
    console.log(`Found ${sections.length} pinned sections`);
    
    // Set initial visibility and positioning
    sections.forEach((section, index) => {
        // Make sure sections are visible initially
        gsap.set(section, {
            position: 'relative',
            width: '100%',
            minHeight: '100vh',
            display: 'flex',
            opacity: 1,
            visibility: 'visible'
        });
        
        // Set up content and image panels
        const contentPanel = section.querySelector('.content-panel');
        const imagePanel = section.querySelector('.image-panel');
        
        if (contentPanel) {
            gsap.set(contentPanel, {
                opacity: 1,
                visibility: 'visible'
            });
        }
        
        if (imagePanel) {
            gsap.set(imagePanel, {
                opacity: 1,
                visibility: 'visible'
            });
        }
    });
    
    // Create pinned scroll effect for each section
    sections.forEach((section, index) => {
        const contentPanel = section.querySelector('.content-panel');
        const imagePanel = section.querySelector('.image-panel');
        const scrollContent = section.querySelector('.scroll-content');
        
        if (!contentPanel || !imagePanel || !scrollContent) return;
        
        // Calculate scroll distance based on content height
        const contentHeight = scrollContent.scrollHeight;
        const viewportHeight = window.innerHeight;
        const scrollDistance = Math.max(contentHeight - viewportHeight + 200, 200);
        
        // Create ScrollTrigger for this section
        ScrollTrigger.create({
            trigger: section,
            start: 'top top',
            end: `+=${scrollDistance}`,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onEnter: () => {
                console.log(`Entering section ${index + 1}`);
            },
            onLeave: () => {
                console.log(`Leaving section ${index + 1}`);
            }
        });
        
        // Animate content scrolling within the pinned section
        if (scrollContent.scrollHeight > viewportHeight) {
            gsap.fromTo(scrollContent, {
                y: 0
            }, {
                y: -(scrollContent.scrollHeight - viewportHeight + 100),
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top top',
                    end: `+=${scrollDistance}`,
                    scrub: 1,
                    invalidateOnRefresh: true
                }
            });
        }
        
        // Parallax effect for background images
        const parallaxBg = section.querySelector('.parallax-bg');
        if (parallaxBg) {
            gsap.fromTo(parallaxBg, {
                y: '-20%'
            }, {
                y: '20%',
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true,
                    invalidateOnRefresh: true
                }
            });
        }
        
        // Entrance animations for content elements
        const title = section.querySelector('.section-title');
        const description = section.querySelector('.section-description');
        const sectionNumber = section.querySelector('.section-number');
        
        if (title || description || sectionNumber) {
            const elementsToAnimate = [title, description, sectionNumber].filter(Boolean);
            
            gsap.fromTo(elementsToAnimate, {
                opacity: 0,
                y: 50
            }, {
                opacity: 1,
                y: 0,
                duration: 1,
                stagger: 0.2,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    end: 'top 20%',
                    toggleActions: 'play none none reverse'
                }
            });
        }
        
        // Image reveal animation
        if (imagePanel) {
            gsap.fromTo(imagePanel, {
                opacity: 0,
                scale: 0.9
            }, {
                opacity: 1,
                scale: 1,
                duration: 1.2,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: section,
                    start: 'top 70%',
                    end: 'top 30%',
                    toggleActions: 'play none none reverse'
                }
            });
        }
    });
    
    // Progress indicator
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.innerHTML = '<div class="progress-fill"></div>';
    document.body.appendChild(progressBar);
    
    gsap.set(progressBar, {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '4px',
        backgroundColor: 'rgba(0,0,0,0.1)',
        zIndex: 1000
    });
    
    const progressFill = progressBar.querySelector('.progress-fill');
    gsap.set(progressFill, {
        height: '100%',
        backgroundColor: '#007cba',
        transformOrigin: 'left',
        scaleX: 0
    });
    
    // Update progress bar based on overall scroll
    ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
            gsap.to(progressFill, {
                scaleX: self.progress,
                duration: 0.1,
                ease: 'none'
            });
        }
    });
    
    // Responsive handling
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            ScrollTrigger.refresh(true);
        }, 250);
    });
    
    console.log(`Initialized ${sections.length} vertical pinned sections with GSAP`);
    
    // Add debug styles to make sure content is visible
    if (window.location.search.includes('debug=sections')) {
        sections.forEach((section, index) => {
            section.style.border = '2px solid red';
            section.style.backgroundColor = `rgba(${index * 50}, 100, 200, 0.1)`;
        });
        
        ScrollTrigger.addEventListener('refresh', () => {
            console.log('ScrollTrigger refreshed');
        });
    }
}

/**
 * jQuery Ready (for other functionality)
 */
$(document).ready(function ($) {
    // Any jQuery specific code goes here
});