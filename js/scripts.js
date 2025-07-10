var $ = jQuery.noConflict();



// Register plugins once at the top level
if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
    console.log("GSAP plugins registered globally");
}

// IMMEDIATELY hide the page content to prevent flashing
document.documentElement.classList.add('loading-active');

// Main initialization with proper sequence
document.addEventListener("DOMContentLoaded", (event) => {
    // Initialize preloader FIRST - before anything else
    initBrandPreloader();
    
    // All other initializations happen in the preloader's onComplete callback
});




/**
 * Initialize brand preloader with color transitions  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 */

function initBrandPreloader() {

    // Only show preloader if not already shown in this session
/*     if (sessionStorage.getItem('preloaderShown')) {
        // Immediately remove loading class and allow scrolling
        document.documentElement.classList.remove('loading-active');
        document.body.style.overflow = '';
        // Initialize everything else immediately
        const smoother = initSmoothScrolling();
        setTimeout(() => {
            window.smoother = smoother;
            initHeaderMask(smoother);
            initPinnedSections(smoother);
            initScrollMarquee(smoother);
            ScrollTrigger.refresh();
            console.log("All animations initialized (no preloader)");
        }, 300);
        return;
    } */

    //sessionStorage.setItem('preloaderShown', 'true');
    
    // Create preloader elements
    const preloader = document.createElement('div');
    preloader.className = 'site-preloader';
    
    // Add your brand logo - update the src with your actual logo path
    preloader.innerHTML = `
        <div class="preloader-content">
            <img src="/wp-content/uploads/2020/08/national-floorcoverings-logo.png" alt="Logo" class="preloader-logo">
        </div>
    `;
    document.body.appendChild(preloader);
    
    // Prevent scrolling during load
    document.body.style.overflow = 'hidden';
    
    // Set up animation timeline with GSAP
    const tl = gsap.timeline({
        onComplete: () => {
            // After animation completes, remove preloader and initialize site
            preloader.remove();
            document.body.style.overflow = '';
            document.documentElement.classList.remove('loading-active');
            
            // Initialize ScrollSmoother after preloader is gone
            const smoother = initSmoothScrolling();
            
            // Then initialize other animations
            setTimeout(() => {
                // Make smoother globally accessible
                window.smoother = smoother;
                
                // Header mask effect
                initHeaderMask(smoother);
                
                // Pinned sections (if they exist)
                initPinnedSections(smoother);

                // Initialize scrolling marquee
                initScrollMarquee(smoother);
                
                // Force refresh ScrollTrigger after all initializations
                ScrollTrigger.refresh();
                
                console.log("All animations initialized");
            }, 300);
        }
    });
    
    // Animation sequence
    tl

        // Initial state - logo invisible
        .set('.preloader-logo', { 
            opacity: 0, 
            scale: 0.8,
             
        })

        .to('.site-preloader', { 
            backgroundColor: '#1a365d', // First color - navy blue
            duration: 1.4,
            delay: 0.3,
            ease: "power1.inOut"
        })
        
        // Step 1: Fade in logo
        .to('.preloader-logo', { 
            opacity: 1, 
            scale: 1, 
            duration: 1.2, 
            ease: "elastic.out(1,0.3)" 
        })
        
        .to('.site-preloader', { 
            opacity: 0, 
            duration: 1.2, 
            ease: "power2.inOut"
        });

        
    
    return preloader;
}






/**
 * Initialize smooth scrolling with ScrollSmoother  //////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
 * Header Mask Scroll Effect with GSAP (ScrollSmoother Compatible) //////////////////////////////////////////////////////////////////////////////////////////////////////////////
 */

function initHeaderMask() {
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
            z-index: 1;
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
        opacity: 1,
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
 * Scrolling text marquee Animation
 * Creates a horizontal scrolling text effect //////////////////////////////////////////////////////////////////////////////////////////////////////////////
 */
function initScrollMarquee() {
    const marquee = document.querySelector('.scroll-marquee-text');
    const wrap = document.querySelector('.scroll-marquee-wrap');
    if (!marquee || !wrap) return;

    // Duplicate the text for seamless looping if not already duplicated
    if (!marquee.dataset.looped) {
        const original = marquee.innerHTML;
        let repeatCount = 1;
        while (marquee.scrollWidth < wrap.offsetWidth * 6 && repeatCount < 10) {
            marquee.innerHTML += original;
            repeatCount++;
        }
        marquee.dataset.looped = "true";
    }


        // Upward reveal animation
        gsap.to(marquee, {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "elastic.out(1,0.3)"
        });

    // Calculate the width of one set of text
    const textWidth = marquee.scrollWidth / 2;
    const distance = textWidth;

    // Autoplay timeline (seamless loop)
    const autoplay = gsap.to(marquee, {
        x: -distance,
        duration: 40,
        ease: "none",
        repeat: -1,
        modifiers: {
            x: gsap.utils.unitize(x => parseFloat(x) % -distance)
        }
    });

    let isScrolling = false;
    let scrollTimeout = null;

    ScrollTrigger.create({
        trigger: wrap,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        onUpdate: self => {
            if (self.isActive && self.direction !== 0) {
                if (!isScrolling) {
                    isScrolling = true;
                    autoplay.pause();
                }
                // Set the timeline's progress directly based on scroll
                autoplay.progress(self.progress, false);
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    isScrolling = false;
                    autoplay.play();
                }, 200);
            }
        }
    });
}


/**
 * pinnedSections.js
 * Creates a pinned scrolling effect for sections //////////////////////////////////////////////////////////////////////////////////////////////////////////////
 */

function initPinnedSections() {
    const container = document.querySelector('.pinned-sections-container');
    if (!container) return;

    const sections = container.querySelectorAll('.pinned-section');
    if (sections.length === 0) return;

    console.log(`Found ${sections.length} pinned sections`);

    // Initial styling - NO z-index at all
    sections.forEach((section, index) => {
        gsap.set(section, {
            position: 'relative',
            width: '100%',
            minHeight: '100vh',
            display: 'flex',
            opacity: 1,
            visibility: 'visible',
            transformOrigin: 'bottom center'
        });

        const contentPanel = section.querySelector('.content-panel');
        const imagePanel = section.querySelector('.image-panel');

        if (contentPanel) {
            gsap.set(contentPanel, { opacity: 1, visibility: 'visible' });
        }
        if (imagePanel) {
            gsap.set(imagePanel, { opacity: 1, visibility: 'visible' });
        }
    });

    sections.forEach((section, index) => {
        const contentPanel = section.querySelector('.content-panel');
        const imagePanel = section.querySelector('.image-panel');
        const scrollContent = section.querySelector('.scroll-content');

        if (!contentPanel || !imagePanel || !scrollContent) return;

        const contentHeight = scrollContent.scrollHeight;
        const viewportHeight = window.innerHeight;
        const scrollDistance = Math.max(contentHeight - viewportHeight, 0);

        // Use a single timeline for everything - no conflicts
        const masterTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top top',
                end: `+=${scrollDistance + 800}`, // Extra time for smooth transition
                scrub: 1,
                pin: true,
                pinSpacing: false,
                anticipatePin: 1,
                markers: true,
                invalidateOnRefresh: true,
                onEnter: () => console.log(`Entering section ${index + 1}`),
                onLeave: () => console.log(`Leaving section ${index + 1}`)
            }
        });


        // Phase 0: Scale up as section enters
        if (index !== 0) {
            masterTimeline.fromTo(section, {
                scale: 0.95
            }, {
                scale: 1,
                ease: 'power2.out',
                duration: 0.5
            }, 0);
        }

        // Phase 1: Brief pause to let section settle
        masterTimeline.to({}, { duration: 0.2 });

        // Phase 2: Scroll content (takes 60% of timeline)
        masterTimeline.fromTo(scrollContent, {
            y: 0
        }, {
            y: -scrollDistance,
            ease: 'none',
            duration: 1
        });


        // Phase 3: Scale down and move up
        if (index !== sections.length - 1) {
        
            const overlay = section.querySelector('.section-overlay');

            masterTimeline.fromTo(section, {
                scale: 1,
            }, {
                scale: 0.9,
                ease: 'power2.inOut',
                duration: 1
            });

            // Animate overlay opacity to darken as it scales
            if (overlay) {
                masterTimeline.fromTo(overlay, {
                    opacity: 0, // Or your desired value, e.g. 0.3
                }, {
                    opacity: 1,
                    ease: 'power2.inOut',
                    duration: 1
                }, "-=1"); // Sync with scale animation
            }

        }





    });
}



// Text Pop-in Animations //////////////////////////////////////////////////////////////////////////////////////////////////////////////

gsap.from(".text-pop-top", {
    scrollTrigger: {
        trigger: ".text-pop-top",
        start: "top 80%", // Adjust as needed
    },
    y: 60,
    opacity: 0,
    //scale: 0.8,
    duration: 1.2,
    ease: "elastic.out(1, 0.5)"
});


gsap.from(".text-pop-bottom", {
    scrollTrigger: {
        trigger: ".text-pop-bottom",
        start: "top 80%", // Adjust as needed
    },
    y: -60,
    opacity: 0,
    //scale: 0.8,
    duration: 1.2,
    delay: 0.5,
    ease: "elastic.out(1, 0.5)"
});


// Fade up in animation for elements with class "fade-up-in" //////////////////////////////////////////////////////////////////////////////////////////////////////////////

gsap.from(".fade-up-in", {
    scrollTrigger: {
        trigger: ".fade-up-in", // or a parent container
        start: "top 80%",
        toggleActions: "play pause resume reverse"
    },
    y: 40,
    opacity: 0,
    duration: 1,
    ease: "power2.out",
    stagger: 0.2
});





// Header Scroll Effect - Hide on scroll down, show on scroll up //////////////////////////////////////////////////////////////////////////////////////////////////////////////

let lastScroll = 0;
const header = document.querySelector('.site-header');

if (header) {
    window.addEventListener('scroll', function () {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        if (currentScroll <= 0) {
            gsap.to(header, { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" });
            header.classList.remove('header-fixed', 'header-show');
            return;
        }
        if (currentScroll > lastScroll) {
            // Scrolling down - hide header
            gsap.to(header, { y: -100, opacity: 0, duration: 0.3, ease: "power2.in" });
            header.classList.remove('header-show');
            header.classList.add('header-fixed');
        } else {
            // Scrolling up - show header
            gsap.to(header, { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" });
            header.classList.add('header-fixed', 'header-show');
        }
        lastScroll = currentScroll;
    });
}




/**
 * jQuery Ready (for other functionality) //////////////////////////////////////////////////////////////////////////////////////////////////////////////
 */

$(document).ready(function ($) {
    // Any jQuery specific code goes here
});