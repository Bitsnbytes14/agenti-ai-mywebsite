/**
 * Mohammad Ahmad - Portfolio Interactive Engine
 * Core Vanilla JavaScript logic for premium features, theme management,
 * canvas animation, and custom UI micro-interactions.
 */

document.addEventListener("DOMContentLoaded", () => {
    // --- Theme & Configuration Constants ---
    const THEME_STORAGE_KEY = "mahmad_portfolio_theme";
    const TYPED_STRINGS = [
        "Backend & Distributed Systems Engineer",
        "Cloud Infrastructure Enthusiast",
        "AI-Powered Application Developer"
    ];

    // --- State Variables ---
    let activeTheme = "dark";

    // --- DOM Elements Cache ---
    const htmlElement = document.documentElement;
    const themeToggleBtn = document.getElementById("theme-toggle");
    const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
    const navMenu = document.getElementById("nav-menu");
    const navLinksList = document.querySelectorAll(".nav-item");
    const scrollProgressBar = document.getElementById("scroll-progress");
    const cursorGlow = document.getElementById("cursor-glow");
    const typedTextSpan = document.querySelector(".typed-text");
    const skillBadges = document.querySelectorAll(".badge");
    const skillDetailPanel = document.getElementById("skill-detail-panel");
    const copyEmailBtn = document.getElementById("copy-email-btn");
    const contactForm = document.getElementById("contact-form");
    const toastElement = document.getElementById("toast");
    const toastMessage = document.getElementById("toast-message");

    /* ==========================================================================
       1. Theme Persistence and Selection
       ========================================================================== */
    const initializeTheme = () => {
        const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
        if (storedTheme) {
            activeTheme = storedTheme;
        } else {
            // Fallback to system preference
            const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
            activeTheme = prefersLight ? "light" : "dark";
        }
        setTheme(activeTheme);
    };

    const setTheme = (theme) => {
        htmlElement.setAttribute("data-theme", theme);
        localStorage.setItem(THEME_STORAGE_KEY, theme);
        activeTheme = theme;
    };

    themeToggleBtn.addEventListener("click", () => {
        const targetTheme = activeTheme === "dark" ? "light" : "dark";
        setTheme(targetTheme);
    });

    initializeTheme();

    /* ==========================================================================
       2. Sticky Navbar & Scroll Progress Tracking
       ========================================================================== */
    const handleScrollEffects = () => {
        const scrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // Progress bar percentage calculation
        const scrollPercent = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
        scrollProgressBar.style.width = `${scrollPercent}%`;

        // Sticky nav transition class addition
        const navbar = document.getElementById("navbar");
        if (scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    };

    window.addEventListener("scroll", handleScrollEffects, { passive: true });

    /* ==========================================================================
       3. Mobile Navigation Menu Toggle (Drawer)
       ========================================================================== */
    const toggleMobileMenu = () => {
        const isExpanded = mobileMenuToggle.getAttribute("aria-expanded") === "true";
        mobileMenuToggle.setAttribute("aria-expanded", !isExpanded);
        mobileMenuToggle.classList.toggle("active");
        navMenu.classList.toggle("show");
    };

    const closeMobileMenu = () => {
        mobileMenuToggle.setAttribute("aria-expanded", "false");
        mobileMenuToggle.classList.remove("active");
        navMenu.classList.remove("show");
    };

    mobileMenuToggle.addEventListener("click", toggleMobileMenu);

    // Close mobile menu drawer on link clicks
    navLinksList.forEach(link => {
        link.addEventListener("click", closeMobileMenu);
    });

    // Close mobile menu if clicked outside
    document.addEventListener("click", (e) => {
        if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target) && navMenu.classList.contains("show")) {
            closeMobileMenu();
        }
    });

    /* ==========================================================================
       4. ScrollSpy Navigation Highlighting
       ========================================================================== */
    const spySections = document.querySelectorAll("section[id]");
    const scrollSpyOptions = {
        root: null, // viewport
        rootMargin: "-25% 0px -55% 0px", // Trigger when section occupies core viewport center
        threshold: 0
    };

    const scrollSpyCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute("id");
                
                navLinksList.forEach(link => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === `#${id}`) {
                        link.classList.add("active");
                    }
                });
            }
        });
    };

    const observer = new IntersectionObserver(scrollSpyCallback, scrollSpyOptions);
    spySections.forEach(section => observer.observe(section));

    /* ==========================================================================
       5. Mouse Glow Movement Effect (Desktop Only)
       ========================================================================== */
    const updateCursorGlow = (e) => {
        // Use translate3d to leverage GPU composite layers for 60fps rendering
        cursorGlow.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
    };

    // Filter touch screen devices to prevent hover stickiness
    const supportsPointerHover = window.matchMedia("(pointer: fine)").matches;
    if (supportsPointerHover && cursorGlow) {
        document.addEventListener("mousemove", updateCursorGlow, { passive: true });
    } else if (cursorGlow) {
        cursorGlow.style.display = "none";
    }

    /* ==========================================================================
       6. Intersection Reveal Animations (Fade/Slide Up)
       ========================================================================== */
    const revealElements = document.querySelectorAll(".reveal");
    const revealOptions = {
        root: null,
        rootMargin: "0px 0px -100px 0px", // Trigger slightly before element enters view
        threshold: 0.1
    };

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target); // Stop tracking once animated
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
    revealElements.forEach(elem => revealObserver.observe(elem));

    /* ==========================================================================
       7. Multi-Line Auto Typing / Deleting Loop
       ========================================================================== */
    let stringIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 70;

    const runTypeAnimation = () => {
        const currentString = TYPED_STRINGS[stringIndex];
        
        if (isDeleting) {
            typedTextSpan.textContent = currentString.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 35; // Deleting is twice as fast
        } else {
            typedTextSpan.textContent = currentString.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 75; // Typing speed
        }

        if (!isDeleting && charIndex === currentString.length) {
            isDeleting = true;
            typingSpeed = 2200; // Pause at full string
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            stringIndex = (stringIndex + 1) % TYPED_STRINGS.length;
            typingSpeed = 500; // Brief pause before typing next
        }

        setTimeout(runTypeAnimation, typingSpeed);
    };

    if (typedTextSpan) {
        setTimeout(runTypeAnimation, 1000);
    }

    /* ==========================================================================
       8. Categorized Skill interactive Details
       ========================================================================== */
    const handleSkillSelection = (badge) => {
        // Remove active class from all badges in this section
        skillBadges.forEach(b => b.classList.remove("active"));
        badge.classList.add("active");

        const skillName = badge.textContent;
        const skillDesc = badge.getAttribute("data-desc");

        // Inject content
        skillDetailPanel.innerHTML = `
            <span class="panel-title">${skillName}:</span>
            <span>${skillDesc}</span>
        `;
        skillDetailPanel.style.borderLeft = "4px solid var(--color-primary)";
    };

    skillBadges.forEach(badge => {
        badge.addEventListener("mouseenter", () => handleSkillSelection(badge));
        badge.addEventListener("click", () => handleSkillSelection(badge));
    });

    /* ==========================================================================
       9. Toast Notification Handler
       ========================================================================== */
    const showToast = (message, type = "success") => {
        toastMessage.textContent = message;
        toastElement.className = `toast show ${type}`;
        toastElement.setAttribute("aria-hidden", "false");

        setTimeout(() => {
            toastElement.classList.remove("show");
            toastElement.setAttribute("aria-hidden", "true");
        }, 4000);
    };

    /* ==========================================================================
       10. Email Copy Utility
       ========================================================================== */
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener("click", () => {
            const emailAddress = "mahmad091323@gmail.com";
            navigator.clipboard.writeText(emailAddress)
                .then(() => {
                    showToast("Email address copied to clipboard!", "success");
                    copyEmailBtn.textContent = "Address Copied!";
                    setTimeout(() => {
                        copyEmailBtn.textContent = "Copy Address";
                    }, 2500);
                })
                .catch(() => {
                    showToast("Copy failed. Please copy manually.", "error");
                });
        });
    }

    /* ==========================================================================
       11. Contact Form Client-Side Validation & Mock Submission
       ========================================================================== */
    const validateEmail = (email) => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase());
    };

    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();

            // Clear active error states
            const formInputs = contactForm.querySelectorAll("input, textarea");
            formInputs.forEach(input => input.classList.remove("invalid"));

            let isFormValid = true;

            const nameInput = document.getElementById("form-name");
            const emailInput = document.getElementById("form-email");
            const subjectInput = document.getElementById("form-subject");
            const messageInput = document.getElementById("form-message");

            // Name verification
            if (nameInput.value.trim() === "") {
                nameInput.classList.add("invalid");
                isFormValid = false;
            }

            // Email verification
            if (!validateEmail(emailInput.value.trim())) {
                emailInput.classList.add("invalid");
                isFormValid = false;
            }

            // Subject verification
            if (subjectInput.value.trim() === "") {
                subjectInput.classList.add("invalid");
                isFormValid = false;
            }

            // Message verification
            if (messageInput.value.trim() === "") {
                messageInput.classList.add("invalid");
                isFormValid = false;
            }

            if (isFormValid) {
                const submitBtn = contactForm.querySelector(".btn-submit");
                const originalText = submitBtn.innerHTML;

                // Loading visual states
                submitBtn.classList.add("loading");
                submitBtn.disabled = true;
                submitBtn.innerHTML = `
                    Transmitting Packet...
                    <svg class="btn-icon spinning" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" opacity="0.25"/>
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
                    </svg>
                `;

                // Simulate secure API server submission (1.5 seconds)
                setTimeout(() => {
                    showToast("Message transmitted successfully! I will reply shortly.", "success");
                    contactForm.reset();
                    
                    submitBtn.classList.remove("loading");
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }, 1600);
            } else {
                showToast("Please resolve the validation errors before transmission.", "error");
            }
        });
    }

    /* ==========================================================================
       12. Distributed Network Nodes Animation (Canvas)
       ========================================================================== */
    const canvas = document.getElementById("nodes-canvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        let particlesList = [];
        let mouseX = null;
        let mouseY = null;
        let animationFrameId = null;

        // Custom config metrics
        const maxConnectionDistance = 140;
        const mouseReactDistance = 180;
        let particleDensityScale = 0.00008; // Particles per square pixel

        const setCanvasDimensions = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            generateParticles();
        };

        class SystemNode {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.vx = (Math.random() - 0.5) * 0.45; // Subtle float speed
                this.vy = (Math.random() - 0.5) * 0.45;
                this.radius = Math.random() * 2 + 1.5;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = activeTheme === "dark" ? "rgba(139, 92, 246, 0.4)" : "rgba(37, 99, 235, 0.35)";
                ctx.fill();
            }

            update() {
                // Bounce on boundaries
                if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
                if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

                // Move node
                this.x += this.vx;
                this.y += this.vy;

                // Subtle cursor attraction / repulsion
                if (mouseX !== null && mouseY !== null) {
                    const dx = this.x - mouseX;
                    const dy = this.y - mouseY;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < mouseReactDistance) {
                        // Soft attraction pull
                        const force = (mouseReactDistance - dist) / mouseReactDistance;
                        this.x -= (dx / dist) * force * 0.3;
                        this.y -= (dy / dist) * force * 0.3;
                    }
                }
            }
        }

        const generateParticles = () => {
            particlesList = [];
            const area = canvas.width * canvas.height;
            const particleCount = Math.floor(area * particleDensityScale);
            // Clamp count limits
            const clampedCount = Math.max(25, Math.min(particleCount, 120));

            for (let i = 0; i < clampedCount; i++) {
                const rx = Math.random() * canvas.width;
                const ry = Math.random() * canvas.height;
                particlesList.push(new SystemNode(rx, ry));
            }
        };

        const renderSystemAnimation = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update & Draw Nodes
            particlesList.forEach(node => {
                node.update();
                node.draw();
            });

            // Draw Connection Links
            for (let i = 0; i < particlesList.length; i++) {
                const nodeA = particlesList[i];
                for (let j = i + 1; j < particlesList.length; j++) {
                    const nodeB = particlesList[j];
                    const dx = nodeA.x - nodeB.x;
                    const dy = nodeA.y - nodeB.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < maxConnectionDistance) {
                        const alpha = (maxConnectionDistance - distance) / maxConnectionDistance;
                        ctx.beginPath();
                        ctx.moveTo(nodeA.x, nodeA.y);
                        ctx.lineTo(nodeB.x, nodeB.y);
                        
                        // Line colors correspond to dark/light themes
                        if (activeTheme === "dark") {
                            ctx.strokeStyle = `rgba(96, 165, 250, ${alpha * 0.12})`;
                        } else {
                            ctx.strokeStyle = `rgba(37, 99, 235, ${alpha * 0.08})`;
                        }
                        
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }

            // Draw cursor interaction links
            if (mouseX !== null && mouseY !== null && supportsPointerHover) {
                particlesList.forEach(node => {
                    const dx = node.x - mouseX;
                    const dy = node.y - mouseY;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < maxConnectionDistance) {
                        const alpha = (maxConnectionDistance - distance) / maxConnectionDistance;
                        ctx.beginPath();
                        ctx.moveTo(node.x, node.y);
                        ctx.lineTo(mouseX, mouseY);
                        ctx.strokeStyle = activeTheme === "dark" 
                            ? `rgba(139, 92, 246, ${alpha * 0.15})` 
                            : `rgba(124, 58, 237, ${alpha * 0.1})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                });
            }

            animationFrameId = requestAnimationFrame(renderSystemAnimation);
        };

        // Resize debouncer
        let resizeTimer;
        window.addEventListener("resize", () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                setCanvasDimensions();
            }, 250);
        });

        // Mouse listeners
        if (supportsPointerHover) {
            window.addEventListener("mousemove", (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
            }, { passive: true });

            window.addEventListener("mouseleave", () => {
                mouseX = null;
                mouseY = null;
            });
        }

        // Initialize Canvas
        setCanvasDimensions();
        renderSystemAnimation();
    }
});
