/**
 * Clasicraft Animations
 * Enhanced animations for product showcase and comparison slider
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    // Hero section animations
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroBtn = document.querySelector('.hero .btn');
    
    if (heroTitle && heroSubtitle && heroBtn) {
        const heroTl = gsap.timeline();
        
        heroTl.from(heroTitle, {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        }).from(heroSubtitle, {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out"
        }, "-=0.6").from(heroBtn, {
            y: 20,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out"
        }, "-=0.4");
    }
    
    // Magnetic buttons
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const moveX = (x - centerX) / 10;
            const moveY = (y - centerY) / 10;
            
            gsap.to(this, {
                x: moveX,
                y: moveY,
                duration: 0.3,
                ease: "power3.out"
            });
            
            const content = this.querySelector('.btn-content');
            if (content) {
                gsap.to(content, {
                    x: moveX * 0.5,
                    y: moveY * 0.5,
                    duration: 0.3,
                    ease: "power3.out"
                });
            }
        });
        
        btn.addEventListener('mouseleave', function() {
            gsap.to(this, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: "elastic.out(1, 0.3)"
            });
            
            const content = this.querySelector('.btn-content');
            if (content) {
                gsap.to(content, {
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: "elastic.out(1, 0.3)"
                });
            }
        });
    });
    
    // Parallax effect for images
    const parallaxImages = document.querySelectorAll('.img-parallax');
    
    if (parallaxImages.length && typeof simpleParallax !== 'undefined') {
        parallaxImages.forEach(img => {
            new simpleParallax(img, {
                scale: 1.15,
                delay: 0.6,
                transition: 'cubic-bezier(0.25, 0.1, 0.25, 1)'
            });
        });
    }
    
    // Staggered grid animations
    const staggeredGrids = document.querySelectorAll('.staggered-grid');
    
    staggeredGrids.forEach(grid => {
        const items = grid.children;
        
        ScrollTrigger.create({
            trigger: grid,
            start: "top 80%",
            onEnter: () => {
                gsap.to(items, {
                    opacity: 1,
                    y: 0,
                    stagger: 0.1,
                    duration: 0.8,
                    ease: "power3.out",
                    clearProps: "all"
                });
            },
            once: true
        });
    });
    
    // Hover effect for product cards
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const img = this.querySelector('.product-img');
            const actionBtns = this.querySelectorAll('.product-action-btn');
            
            if (img) {
                gsap.to(img, {
                    scale: 1.05,
                    duration: 0.4,
                    ease: "power2.out"
                });
            }
            
            if (actionBtns.length) {
                gsap.to(actionBtns, {
                    y: 0,
                    opacity: 1,
                    duration: 0.3,
                    stagger: 0.1,
                    ease: "back.out(1.7)"
                });
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const img = this.querySelector('.product-img');
            const actionBtns = this.querySelectorAll('.product-action-btn');
            
            if (img) {
                gsap.to(img, {
                    scale: 1,
                    duration: 0.4,
                    ease: "power2.out"
                });
            }
            
            if (actionBtns.length) {
                gsap.to(actionBtns, {
                    y: 20,
                    opacity: 0,
                    duration: 0.3,
                    stagger: 0.05,
                    ease: "power2.in"
                });
            }
        });
    });
    
    // Staggered section animations
    gsap.utils.toArray('.showcase-grid.staggered .product-card').forEach((card, i) => {
        gsap.from(card, {
            y: 100,
            opacity: 0,
            duration: 1,
            delay: 0.2 * i,
            ease: "power3.out",
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none none"
            }
        });
    });
    
    // Animate sections on scroll
    const sections = document.querySelectorAll('.section');
    
    sections.forEach(section => {
        ScrollTrigger.create({
            trigger: section,
            start: "top 75%",
            onEnter: () => {
                section.classList.add('in-view');
            }
        });
    });
    
    // Initialize 3D product viewer if exists
    const modelContainer = document.getElementById('3d-model-container');
    
    if (modelContainer && typeof THREE !== 'undefined') {
        initProduct3DViewer(modelContainer);
    }
    
    // Comparison slider functionality
    const slider = document.querySelector('.comparison-slider');
    
    if (slider) {
        const before = slider.querySelector('.comparison-before');
        const after = slider.querySelector('.comparison-after');
        const handle = slider.querySelector('.comparison-handle');
        
        if (before && after && handle) {
            slider.addEventListener('mousemove', function(e) {
                if (!slider.classList.contains('active')) {
                    const percentage = (e.offsetX / slider.offsetWidth) * 100;
                    animateSliderTo(percentage);
                }
            });
            
            // Animate slider to position
            function animateSliderTo(percentage) {
                percentage = Math.max(0, Math.min(100, percentage));
                
                // For smoother animation, use GSAP if available
                if (typeof gsap !== 'undefined') {
                    gsap.to(after, {
                        width: percentage + '%',
                        duration: 0.3,
                        ease: "power2.out"
                    });
                    
                    gsap.to(handle, {
                        left: percentage + '%',
                        duration: 0.3,
                        ease: "power2.out"
                    });
                } else {
                    after.style.width = percentage + '%';
                    handle.style.left = percentage + '%';
                }
            }
            
            // Initial animation
            setTimeout(() => {
                animateSliderTo(50);
            }, 500);
        }
    }
    
    // Comparison slider handle animation
    const handle = document.querySelector('.comparison-handle');
    if (handle) {
        gsap.to(handle, {
            rotation: 360,
            duration: 5,
            ease: "none",
            repeat: -1
        });
    }
});

// Initialize 3D product viewer
function initProduct3DViewer(container) {
    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf7f3ef);
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
        45, 
        container.clientWidth / container.clientHeight, 
        0.1, 
        1000
    );
    camera.position.z = 5;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    // Add controls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Add light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Create a simple cube as placeholder
    // In a real implementation, you would load a furniture model
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshStandardMaterial({ 
        color: 0x9c7c5d,
        roughness: 0.8,
        metalness: 0.2
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        cube.rotation.y += 0.005;
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Material updating function with error handling
    return function updateMaterial(materialName) {
        if (!cube || !cube.material) {
            console.error('3D model not properly initialized');
            return;
        }
        
        let color;
        
        switch(materialName) {
            case 'walnut':
                color = 0x9c7c5d;
                break;
            case 'oak':
                color = 0xd4bc8c;
                break;
            case 'mahogany':
                color = 0x3c2b1a;
                break;
            default:
                color = 0x9c7c5d;
        }
        
        try {
            cube.material.color.set(color);
            console.log(`Material updated to ${materialName}`);
        } catch (error) {
            console.error('Error updating material:', error);
        }
    };
}
