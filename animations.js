/**
 * Clasicraft Animations
 * Enhanced animations for product showcase and comparison slider
 * Optimized for performance with debouncing and throttling
 */

document.addEventListener('DOMContentLoaded', function() {
    // Feature detection for better performance
    const hasIntersectionObserver = 'IntersectionObserver' in window;
    const hasTouchScreen = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    
    // Throttle function for performance optimization
    function throttle(callback, delay) {
        let lastCall = 0;
        return function(...args) {
            const now = new Date().getTime();
            if (now - lastCall < delay) {
                return;
            }
            lastCall = now;
            return callback(...args);
        };
    }
    
    // WebGL Particle System for hero background
    const particlesCanvas = document.getElementById('particles-canvas');
    if (particlesCanvas && typeof THREE === 'undefined') {
        initParticleSystem(particlesCanvas);
    }
    
    // Safe initialization of GSAP
    const gsapReady = typeof gsap !== 'undefined' && gsap.registerPlugin && 
                     typeof ScrollTrigger !== 'undefined';
    
    if (gsapReady) {
        gsap.registerPlugin(ScrollTrigger);
        
        // Enhanced ScrollTrigger animations
        const sections = document.querySelectorAll('[data-scroll-section]');
        
        sections.forEach((section, i) => {
            // Create progressive reveal animations for each section
            const elements = section.querySelectorAll('.product-card, .about-title, .about-text, .section-title, .section-subtitle');
            
            if (elements.length) {
                gsap.fromTo(elements, 
                    {
                        y: 50,
                        opacity: 0
                    },
                    {
                        y: 0,
                        opacity: 1,
                        stagger: 0.1,
                        duration: 0.8,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: section,
                            start: "top 80%",
                            end: "top 30%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            }
            
            // Create parallax effect for images
            const images = section.querySelectorAll('img:not(.hero-video)');
            
            images.forEach(img => {
                gsap.fromTo(img,
                    {
                        y: 0
                    },
                    {
                        y: -30,
                        ease: "none",
                        scrollTrigger: {
                            trigger: img,
                            scrub: true,
                            start: "top bottom",
                            end: "bottom top"
                        }
                    }
                );
            });
        });
        
        // Smooth header reveal/hide on scroll
        const header = document.querySelector('.header');
        if (header) {
            let lastScrollTop = 0;
            
            ScrollTrigger.create({
                start: 'top -80',
                end: 99999,
                onUpdate: (self) => {
                    const scrollTop = self.scroller.scrollTop;
                    
                    if (scrollTop > lastScrollTop && scrollTop > 150) {
                        // Scrolling down
                        gsap.to(header, {
                            yPercent: -100,
                            duration: 0.3,
                            ease: "power3.out"
                        });
                    } else {
                        // Scrolling up
                        gsap.to(header, {
                            yPercent: 0,
                            duration: 0.3,
                            ease: "power3.out"
                        });
                        
                        if (scrollTop > 50) {
                            header.classList.add('scrolled');
                        } else {
                            header.classList.remove('scrolled');
                        }
                    }
                    
                    lastScrollTop = scrollTop;
                }
            });
        }
    }
    
    // Enhanced magnetic buttons with performance optimization
    if (!hasTouchScreen) {
        const magneticBtns = document.querySelectorAll('.magnetic-btn');
        
        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', throttle(function(e) {
                try {
                    const rect = this.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    
                    const moveX = (x - centerX) / 10;
                    const moveY = (y - centerY) / 10;
                    
                    // Use CSS custom properties for better performance
                    this.style.setProperty('--tx', `${moveX}px`);
                    this.style.setProperty('--ty', `${moveY}px`);
                    this.style.transform = `translate(${moveX}px, ${moveY}px)`;
                    
                    const content = this.querySelector('.btn-content');
                    if (content) {
                        content.style.transform = `translate(${moveX * 0.5}px, ${moveY * 0.5}px)`;
                    }
                } catch (err) {
                    console.warn('Error in magnetic button effect:', err);
                }
            }, 20));
            
            btn.addEventListener('mouseleave', function() {
                gsap.to(this, {
                    x: 0,
                    y: 0,
                    duration: 0.6,
                    ease: "elastic.out(1, 0.3)"
                });
                
                const content = this.querySelector('.btn-content');
                if (content) {
                    gsap.to(content, {
                        x: 0,
                        y: 0,
                        duration: 0.6,
                        ease: "elastic.out(1, 0.3)"
                    });
                }
            });
        });
    }
    
    // Enhanced 3D product viewer with controls
    const modelContainer = document.getElementById('3d-viewer');
    const fallbackContainer = document.getElementById('3d-viewer-fallback');
    
    if (modelContainer && typeof THREE !== 'undefined') {
        try {
            const cleanup = initEnhancedProduct3DViewer(modelContainer);
            
            // Clean up on page unload to prevent memory leaks
            window.addEventListener('beforeunload', cleanup);
        } catch (err) {
            console.error('Failed to initialize 3D viewer:', err);
            if (fallbackContainer) {
                fallbackContainer.style.display = 'flex';
            }
        }
    } else if (fallbackContainer) {
        fallbackContainer.style.display = 'flex';
    }
    
    // Material selector interaction
    const materialOptions = document.querySelectorAll('.material-option');
    if (materialOptions.length) {
        materialOptions.forEach(option => {
            option.addEventListener('click', function() {
                const material = this.getAttribute('data-material');
                materialOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                
                // Change product images based on material
                document.querySelectorAll('.product-card').forEach(card => {
                    // Add a subtle animation when changing materials
                    gsap.to(card, {
                        y: -10, 
                        opacity: 0.8,
                        duration: 0.3,
                        onComplete: () => {
                            // In a real implementation, you would change the product images here
                            // For this demo, we'll just change a CSS filter
                            const img = card.querySelector('.product-img');
                            if (img) {
                                switch(material) {
                                    case 'walnut':
                                        img.style.filter = 'brightness(0.95) saturate(1.1)';
                                        break;
                                    case 'oak':
                                        img.style.filter = 'brightness(1.1) saturate(0.9)';
                                        break;
                                    case 'maple':
                                        img.style.filter = 'brightness(1.2) saturate(0.85)';
                                        break;
                                }
                            }
                            
                            gsap.to(card, {
                                y: 0,
                                opacity: 1,
                                duration: 0.5,
                                ease: "power2.out"
                            });
                        }
                    });
                });
            });
        });
    }
});

// WebGL Particle System for ambient background effects
function initParticleSystem(canvas) {
    // Only run if canvas exists
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas to full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Particle settings
    const particles = [];
    const particleCount = Math.min(80, window.innerWidth / 20); // Limit particle count for performance
    const colors = ['#9C7C5D', '#D4C8B8', '#F5F1ED'];
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 3 + 1,
            speedX: Math.random() * 0.5 - 0.25,
            speedY: Math.random() * 0.5 - 0.25,
            color: colors[Math.floor(Math.random() * colors.length)],
            opacity: Math.random() * 0.5 + 0.1
        });
    }
    
    // Animation
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            
            p.x += p.speedX;
            p.y += p.speedY;
            
            // Wrap particles around canvas
            if (p.x > canvas.width) p.x = 0;
            if (p.x < 0) p.x = canvas.width;
            if (p.y > canvas.height) p.y = 0;
            if (p.y < 0) p.y = canvas.height;
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color + Math.floor(p.opacity * 255).toString(16).padStart(2, '0');
            ctx.fill();
        }
        
        requestAnimationFrame(animate);
    }
    
    // Start animation
    animate();
    
    // Handle window resize
    window.addEventListener('resize', throttle(() => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }, 200));
    
    // Helper throttle function
    function throttle(callback, delay) {
        let lastCall = 0;
        return function() {
            const now = new Date().getTime();
            if (now - lastCall < delay) {
                return;
            }
            lastCall = now;
            return callback();
        };
    }
}

// Enhanced 3D product viewer with improved interaction
function initEnhancedProduct3DViewer(container) {
    if (!container || typeof THREE === 'undefined') {
        throw new Error('Container not found or THREE.js not loaded');
    }
    
    try {
        // Create scene with enhanced settings
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf7f3ef);
        
        // Add fog for depth effect
        scene.fog = new THREE.FogExp2(0xf7f3ef, 0.035);
        
        // Create camera with proper aspect ratio
        const camera = new THREE.PerspectiveCamera(
            45, 
            container.clientWidth / container.clientHeight, 
            0.1, 
            1000
        );
        camera.position.z = 5;
        camera.position.y = 1;
        
        // Create renderer with enhanced settings
        const renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            powerPreference: 'high-performance',
            alpha: true
        });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(renderer.domElement);
        
        // Add enhanced controls with elastic easing
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.08;
        controls.rotateSpeed = 0.5;
        controls.enableZoom = true;
        controls.zoomSpeed = 0.5;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.75;
        controls.enablePan = false; // Disable panning for simplicity
        
        // Add environment lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        scene.add(directionalLight);
        
        // Add secondary light for better look
        const backLight = new THREE.DirectionalLight(0xf5f1ed, 0.4);
        backLight.position.set(-5, -2, -5);
        scene.add(backLight);
        
        // Create a wooden table with enhanced materials
        const tableGeometry = new THREE.BoxGeometry(4, 0.2, 2);
        const tableMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x9c7c5d,
            roughness: 0.8,
            metalness: 0.2,
            envMapIntensity: 1.0
        });
        const table = new THREE.Mesh(tableGeometry, tableMaterial);
        table.castShadow = true;
        table.receiveShadow = true;
        scene.add(table);
        
        // Add table legs
        const legGeometry = new THREE.BoxGeometry(0.2, 1.5, 0.2);
        const legMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x8a6c4d,
            roughness: 0.7,
            metalness: 0.1
        });
        
        const positions = [
            [-1.8, -0.85, 0.8],  // front left
            [1.8, -0.85, 0.8],   // front right
            [-1.8, -0.85, -0.8], // back left
            [1.8, -0.85, -0.8]   // back right
        ];
        
        const legs = positions.map(pos => {
            const leg = new THREE.Mesh(legGeometry, legMaterial);
            leg.position.set(...pos);
            leg.castShadow = true;
            leg.receiveShadow = true;
            scene.add(leg);
            return leg;
        });
        
        // Add a decorative object on the table
        const vaseGeometry = new THREE.CylinderGeometry(0.3, 0.2, 0.8, 16);
        const vaseMaterial = new THREE.MeshStandardMaterial({
            color: 0xd4c8b8,
            roughness: 0.5,
            metalness: 0.3
        });
        const vase = new THREE.Mesh(vaseGeometry, vaseMaterial);
        vase.position.set(-1, 0.5, 0);
        vase.castShadow = true;
        vase.receiveShadow = true;
        scene.add(vase);
        
        // Add a small wood block as another decorative item
        const blockGeometry = new THREE.BoxGeometry(0.7, 0.4, 0.7);
        const blockMaterial = new THREE.MeshStandardMaterial({
            color: 0xbf9780,
            roughness: 0.9,
            metalness: 0.1
        });
        const block = new THREE.Mesh(blockGeometry, blockMaterial);
        block.position.set(1, 0.3, 0);
        block.rotation.y = Math.PI / 4;
        block.castShadow = true;
        block.receiveShadow = true;
        scene.add(block);
        
        // Add ground plane
        const groundGeometry = new THREE.PlaneGeometry(20, 20);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0xf5f1ed,
            roughness: 0.9,
            metalness: 0.0
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -1.6;
        ground.receiveShadow = true;
        scene.add(ground);
        
        // Viewer controls
        const controlBtns = container.querySelectorAll('.control-btn');
        if (controlBtns) {
            controlBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    if (btn.classList.contains('rotate-left')) {
                        gsap.to(table.rotation, { y: table.rotation.y - Math.PI/4, duration: 1, ease: "power2.out" });
                        legs.forEach(leg => {
                            gsap.to(leg.rotation, { y: leg.rotation.y - Math.PI/4, duration: 1, ease: "power2.out" });
                        });
                        gsap.to(vase.rotation, { y: vase.rotation.y - Math.PI/4, duration: 1, ease: "power2.out" });
                        gsap.to(block.rotation, { y: block.rotation.y - Math.PI/4, duration: 1, ease: "power2.out" });
                    } else if (btn.classList.contains('rotate-right')) {
                        gsap.to(table.rotation, { y: table.rotation.y + Math.PI/4, duration: 1, ease: "power2.out" });
                        legs.forEach(leg => {
                            gsap.to(leg.rotation, { y: leg.rotation.y + Math.PI/4, duration: 1, ease: "power2.out" });
                        });
                        gsap.to(vase.rotation, { y: vase.rotation.y + Math.PI/4, duration: 1, ease: "power2.out" });
                        gsap.to(block.rotation, { y: block.rotation.y + Math.PI/4, duration: 1, ease: "power2.out" });
                    } else if (btn.classList.contains('zoom-in')) {
                        gsap.to(camera.position, { z: camera.position.z - 0.5, duration: 0.5, ease: "power2.inOut" });
                    } else if (btn.classList.contains('zoom-out')) {
                        gsap.to(camera.position, { z: camera.position.z + 0.5, duration: 0.5, ease: "power2.inOut" });
                    }
                });
            });
        }
        
        // Handle responsive layout
        const resizeHandler = function() {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        };
        
        // Throttle resize event for performance
        window.addEventListener('resize', throttle(resizeHandler, 200));
        
        // Create animation loop with efficiency
        let frameId;
        function animate() {
            frameId = requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        }
        
        animate();
        
        // Clean up function for memory management
        return function cleanup() {
            cancelAnimationFrame(frameId);
            renderer.dispose();
            tableGeometry.dispose();
            tableMaterial.dispose();
            legGeometry.dispose();
            legMaterial.dispose();
            vaseGeometry.dispose();
            vaseMaterial.dispose();
            blockGeometry.dispose();
            blockMaterial.dispose();
            groundGeometry.dispose();
            groundMaterial.dispose();
            controls.dispose();
            
            container.removeChild(renderer.domElement);
        };
    } catch (error) {
        console.error('Error in 3D viewer initialization:', error);
        throw error;
    }
    
    // Helper throttle function
    function throttle(callback, delay) {
        let lastCall = 0;
        return function(...args) {
            const now = new Date().getTime();
            if (now - lastCall < delay) {
                return;
            }
            lastCall = now;
            return callback(...args);
        };
    }
}
