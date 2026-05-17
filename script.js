// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 Sentraq Website Loaded!");
    
    // Initialize all features
    initializeWebsite();
});

function initializeWebsite() {
    // Set current year in footer
    setCurrentYear();

    // Initialize mobile menu
    initMobileMenu();

    // Initialize sliders
    initProductSliders();

    // Initialize cursor glow
    initCursorGlow();

    // Initialize smooth scrolling
    initSmoothScrolling();

    // Initialize animations
    initAnimations();

    // Initialize navbar scroll effect
    initNavbarScroll();

    // Initialize like buttons
    initLikeButtons();

    // Initialize lazy loading for future images
    initLazyLoading();

    // Initialize cart
    initCart();
}

// ===== UTILITY FUNCTIONS =====

function setCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// ===== MOBILE MENU =====

function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navActions = document.querySelector('.nav-actions');
    
    if (mobileMenuBtn && navActions) {
        mobileMenuBtn.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            navActions.classList.toggle('active');
            
            // Toggle body scroll
            document.body.style.overflow = isExpanded ? '' : 'hidden';
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenuBtn.contains(event.target) && !navActions.contains(event.target)) {
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                navActions.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                navActions.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when clicking a link
        navActions.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                navActions.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
}

// ===== PRODUCT SLIDERS =====

function initProductSliders() {
    console.log("🔄 Initializing product sliders...");
    
    const productCards = document.querySelectorAll('.product-card');
    
    if (productCards.length === 0) {
        console.warn("No product cards found!");
        return;
    }
    
    productCards.forEach((card, cardIndex) => {
        const sliderTrack = card.querySelector('.slider-track');
        const slides = card.querySelectorAll('.slide');
        const prevBtn = card.querySelector('.prev-btn');
        const nextBtn = card.querySelector('.next-btn');
        const dots = card.querySelectorAll('.dot');
        
        let currentSlide = 0;
        const totalSlides = slides.length;
        
        if (totalSlides === 0) {
            console.warn(`No slides found in card ${cardIndex + 1}`);
            return;
        }
        
        console.log(`Setting up slider for card ${cardIndex + 1} with ${totalSlides} slides`);
        
        // Initialize slider
        function updateSlider() {
            // Update transform
            const translateX = -currentSlide * 100;
            sliderTrack.style.transform = `translateX(${translateX}%)`;
            
            // Update dots
            dots.forEach((dot, index) => {
                const isActive = index === currentSlide;
                dot.classList.toggle('active', isActive);
                dot.setAttribute('aria-label', `Slide ${index + 1} of ${totalSlides}`);
                
                // Update buttons state
                if (prevBtn) prevBtn.disabled = currentSlide === 0;
                if (nextBtn) nextBtn.disabled = currentSlide === totalSlides - 1;
            });
            
            // Update slide visibility for screen readers
            slides.forEach((slide, index) => {
                slide.setAttribute('aria-hidden', index !== currentSlide);
                slide.setAttribute('tabindex', index === currentSlide ? '0' : '-1');
            });
        }
        
        // Navigation functions
        function goNext() {
            if (currentSlide < totalSlides - 1) {
                currentSlide++;
                updateSlider();
            }
        }
        
        function goPrev() {
            if (currentSlide > 0) {
                currentSlide--;
                updateSlider();
            }
        }
        
        function goToSlide(index) {
            if (index >= 0 && index < totalSlides) {
                currentSlide = index;
                updateSlider();
            }
        }
        
        // Event Listeners for buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                goPrev();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                goNext();
            });
        }
        
        // Event Listeners for dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                goToSlide(index);
            });
        });
        
        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        const sliderArea = card.querySelector('.product-slider');
        const minSwipeDistance = 50;
        
        if (sliderArea) {
            // Touch events
            sliderArea.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
            }, { passive: true });
            
            sliderArea.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].clientX;
                handleSwipe();
            }, { passive: true });
            
            // Mouse drag support
            let mouseDownX = 0;
            let mouseUpX = 0;
            let isDragging = false;
            
            sliderArea.addEventListener('mousedown', (e) => {
                mouseDownX = e.clientX;
                isDragging = true;
                sliderArea.style.cursor = 'grabbing';
            });
            
            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                e.preventDefault();
            });
            
            document.addEventListener('mouseup', (e) => {
                if (!isDragging) return;
                mouseUpX = e.clientX;
                handleSwipe();
                isDragging = false;
                sliderArea.style.cursor = '';
            });
            
            function handleSwipe() {
                const distance = Math.abs(touchStartX - touchEndX) || Math.abs(mouseDownX - mouseUpX);
                
                if (distance > minSwipeDistance) {
                    if (touchStartX > touchEndX || mouseDownX > mouseUpX) {
                        // Swipe left = next
                        goNext();
                    } else {
                        // Swipe right = previous
                        goPrev();
                    }
                }
                
                // Reset values
                touchStartX = 0;
                touchEndX = 0;
                mouseDownX = 0;
                mouseUpX = 0;
            }
            
            // Keyboard navigation
            sliderArea.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    goPrev();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    goNext();
                } else if (e.key >= '1' && e.key <= '9') {
                    const slideNum = parseInt(e.key) - 1;
                    if (slideNum < totalSlides) {
                        e.preventDefault();
                        goToSlide(slideNum);
                    }
                }
            });
        }
        
        // Auto-slide (optional - uncomment if needed)
        /*
        let autoSlideInterval;
        
        function startAutoSlide() {
            autoSlideInterval = setInterval(goNext, 5000);
        }
        
        function stopAutoSlide() {
            clearInterval(autoSlideInterval);
        }
        
        card.addEventListener('mouseenter', stopAutoSlide);
        card.addEventListener('mouseleave', startAutoSlide);
        card.addEventListener('touchstart', stopAutoSlide);
        card.addEventListener('focusin', stopAutoSlide);
        card.addEventListener('focusout', startAutoSlide);
        
        // Start auto-slide
        startAutoSlide();
        */
        
        // Initialize
        updateSlider();
        
        // Make slider focusable
        sliderTrack.setAttribute('tabindex', '0');
        sliderTrack.setAttribute('role', 'region');
        sliderTrack.setAttribute('aria-label', 'Product image carousel');
    });
    
    console.log(`✅ ${productCards.length} sliders initialized successfully!`);
}

// ===== CURSOR GLOW =====

function initCursorGlow() {
    const cursor = document.querySelector('.cursor-glow');
    
    // Only enable on desktop
    if (!cursor || window.innerWidth <= 768) {
        if (cursor) cursor.style.display = 'none';
        return;
    }
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Smooth animation loop
    function animateCursor() {
        // Smooth follow
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        // Scale on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .product-card, .slider-btn, .action-btn');
        let isHovering = false;
        
        interactiveElements.forEach(el => {
            if (el.matches(':hover')) {
                isHovering = true;
            }
        });
        
        if (isHovering) {
            cursor.style.width = '60px';
            cursor.style.height = '60px';
            cursor.style.background = 'rgba(64, 224, 208, 0.2)';
            cursor.style.boxShadow = '0 0 30px rgba(64, 224, 208, 0.7)';
        } else {
            cursor.style.width = '20px';
            cursor.style.height = '20px';
            cursor.style.background = 'rgba(64, 224, 208, 0.1)';
            cursor.style.boxShadow = '0 0 20px rgba(64, 224, 208, 0.3)';
        }
        
        requestAnimationFrame(animateCursor);
    }
    
    // Start animation
    animateCursor();
}

// ===== SMOOTH SCROLLING =====

function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Skip if it's just #
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Calculate offset (navbar height + some padding)
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const offset = navbarHeight + 20;
                
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without page jump
                history.pushState(null, null, targetId);
                
                // Focus the target for accessibility
                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus();
                targetElement.removeAttribute('tabindex');
            }
        });
    });
}

// ===== NAVBAR SCROLL EFFECT =====

function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show on scroll
        if (currentScroll > lastScroll && currentScroll > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });
}

// ===== LIKE BUTTONS =====

function initLikeButtons() {
    const likeButtons = document.querySelectorAll('.action-btn');
    
    likeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const icon = this.querySelector('i');
            
            if (icon.classList.contains('far')) {
                // Like
                icon.classList.remove('far');
                icon.classList.add('fas');
                this.classList.add('liked');
            } else {
                // Unlike
                icon.classList.remove('fas');
                icon.classList.add('far');
                this.classList.remove('liked');
            }
        });
    });
}

// ===== ANIMATIONS =====

function initAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements
    const animatedElements = document.querySelectorAll('.product-card, .contact-card, .hero-content');
    animatedElements.forEach(el => observer.observe(el));
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        .product-card, .contact-card, .hero-content {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .product-card.animate-in, 
        .contact-card.animate-in,
        .hero-content.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .product-card:nth-child(1) { transition-delay: 0.1s; }
        .product-card:nth-child(2) { transition-delay: 0.2s; }
        .product-card:nth-child(3) { transition-delay: 0.3s; }
        .product-card:nth-child(4) { transition-delay: 0.4s; }
        .product-card:nth-child(5) { transition-delay: 0.5s; }
    `;
    document.head.appendChild(style);
}

// ===== LAZY LOADING (for future images) =====

function initLazyLoading() {
    // This will be useful when you add real images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Load image
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    
                    // Load background image
                    if (img.dataset.bg) {
                        img.style.backgroundImage = `url('${img.dataset.bg}')`;
                        img.removeAttribute('data-bg');
                    }
                    
                    imageObserver.unobserve(img);
                }
            });
        });
        
        // Observe images with data-src attribute
        document.querySelectorAll('img[data-src], .slide-img[data-bg]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ===== ERROR HANDLING =====

window.addEventListener('error', function(e) {
    console.error('Website error:', e.error);
    
    // You can add error reporting here
    // Example: send error to your analytics
});

// ===== PERFORMANCE OPTIMIZATION =====

// Debounce function for scroll/resize events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for mousemove events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== LOADING STATES =====

function showLoading(element) {
    element.classList.add('loading');
}

function hideLoading(element) {
    element.classList.remove('loading');
}

// Export functions if needed (for module systems)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeWebsite,
        initProductSliders,
        initMobileMenu,
    };
}

// ===== CART =====

let cart = [];

function initCart() {
    const cartBtn = document.getElementById('cart-btn');
    const cartClose = document.getElementById('cart-close');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartCheckoutBtn = document.getElementById('cart-checkout-btn');

    if (cartBtn) cartBtn.addEventListener('click', openCart);
    if (cartClose) cartClose.addEventListener('click', closeCart);

    if (cartOverlay) {
        cartOverlay.addEventListener('click', function(e) {
            if (e.target === cartOverlay) closeCart();
        });
    }

    if (cartCheckoutBtn) cartCheckoutBtn.addEventListener('click', checkoutViaWhatsApp);

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const overlay = document.getElementById('cart-overlay');
            if (overlay && overlay.classList.contains('active')) closeCart();
        }
    });

    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const card = this.closest('.product-card');
            if (!card) return;
            addToCart({
                id: card.dataset.productId,
                name: card.dataset.productName,
                price: parseInt(card.dataset.productPrice, 10),
                stock: parseInt(card.dataset.productStock, 10),
            });
        });
    });

    renderCart();
}

function openCart() {
    const overlay = document.getElementById('cart-overlay');
    if (!overlay) return;
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const closeBtn = document.getElementById('cart-close');
    if (closeBtn) closeBtn.focus();
}

function closeCart() {
    const overlay = document.getElementById('cart-overlay');
    if (!overlay) return;
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    const cartBtn = document.getElementById('cart-btn');
    if (cartBtn) cartBtn.focus();
}

function addToCart(product) {
    if (cart.find(item => item.id === product.id)) return;
    cart.push(product);
    renderCart();
    setProductBtnState(product.id, true);
    setStockDisplay(product.id, 0);

    const cartBtn = document.getElementById('cart-btn');
    if (cartBtn) {
        cartBtn.classList.remove('bounce');
        void cartBtn.offsetWidth;
        cartBtn.classList.add('bounce');
        setTimeout(() => cartBtn.classList.remove('bounce'), 300);
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    renderCart();
    setProductBtnState(id, false);

    const card = document.querySelector(`.product-card[data-product-id="${id}"]`);
    if (card) {
        setStockDisplay(id, parseInt(card.dataset.productStock, 10));
    }
}

function setProductBtnState(id, inCart) {
    const card = document.querySelector(`.product-card[data-product-id="${id}"]`);
    if (!card) return;
    const btn = card.querySelector('.add-to-cart-btn');
    if (!btn) return;

    btn.disabled = inCart;
    btn.classList.toggle('in-cart', inCart);
    btn.innerHTML = inCart
        ? '<i class="fas fa-check" aria-hidden="true"></i><span>Di Keranjang</span>'
        : '<i class="fas fa-cart-plus" aria-hidden="true"></i><span>Add to Cart</span>';
}

function setStockDisplay(id, count) {
    const card = document.querySelector(`.product-card[data-product-id="${id}"]`);
    if (!card) return;
    const el = card.querySelector('.stock-count');
    if (!el) return;
    el.textContent = count;
    el.classList.toggle('out-of-stock', count === 0);
}

function renderCart() {
    const cartCount = document.getElementById('cart-count');
    const cartEmpty = document.getElementById('cart-empty');
    const cartItemsList = document.getElementById('cart-items-list');
    const cartFooter = document.getElementById('cart-footer');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const cartCheckoutBtn = document.getElementById('cart-checkout-btn');
    const cartItemsCountText = document.getElementById('cart-items-count-text');

    const count = cart.length;
    const total = cart.reduce((sum, item) => sum + item.price, 0);

    if (cartCount) {
        cartCount.textContent = count;
        cartCount.classList.toggle('visible', count > 0);
    }

    if (cartEmpty) cartEmpty.style.display = count === 0 ? 'flex' : 'none';

    if (cartItemsList) {
        cartItemsList.style.display = count === 0 ? 'none' : 'flex';
        cartItemsList.innerHTML = cart.map(item => `
            <li class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name" title="${escapeHtml(item.name)}">${escapeHtml(item.name)}</div>
                    <div class="cart-item-price">${formatPrice(item.price)}</div>
                </div>
                <button class="cart-item-remove"
                    onclick="removeFromCart('${escapeHtml(item.id)}')"
                    aria-label="Hapus ${escapeHtml(item.name)} dari keranjang">
                    <i class="fas fa-trash-alt" aria-hidden="true"></i>
                </button>
            </li>
        `).join('');
    }

    if (cartFooter) cartFooter.style.display = count === 0 ? 'none' : 'block';
    if (cartTotalPrice) cartTotalPrice.textContent = formatPrice(total);
    if (cartItemsCountText) cartItemsCountText.textContent = `${count} item dipilih`;
    if (cartCheckoutBtn) cartCheckoutBtn.disabled = count === 0;
}

function formatPrice(amount) {
    return 'Rp ' + amount.toLocaleString('id-ID');
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function checkoutViaWhatsApp() {
    if (cart.length === 0) return;

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    let message = 'Halo Sentraq! 👋 Saya ingin memesan:\n\n';

    cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name}\n`;
        message += `   Harga: ${formatPrice(item.price)}\n\n`;
    });

    message += '━━━━━━━━━━━\n';
    message += `💰 Total: ${formatPrice(total)}\n\n`;
    message += 'Mohon konfirmasi ketersediaan. Terima kasih! 🙏';

    const waUrl = 'https://wa.me/6285716577307?text=' + encodeURIComponent(message);
    window.open(waUrl, '_blank', 'noopener,noreferrer');
}