document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. REUSABLE HEADER INJECTION
    // ==========================================
    const headerContainer = document.getElementById('header-container');
    if (headerContainer) {
        // Check if we are currently inside the gallery directory/page
        const path = window.location.pathname;
        const isGallery = path.includes('gallery') || path.includes('index.html');
        
        const homePath = isGallery ? '../' : '/';
        const galleryPath = isGallery ? '/' : 'gallery/';
        const aboutPath = isGallery ? '../#about' : '#about';

        headerContainer.innerHTML = `
            <header>
                <div class="logo"><a href="${homePath}" class="logo-link">MATTHEW TAYLOR</a></div>
                
                <button class="hamburger-toggle" id="hamburger-btn" aria-label="Toggle navigation">
                    <span class="bar"></span>
                    <span class="bar"></span>
                    <span class="bar"></span>
                </button>

                <nav class="nav-menu" id="nav-menu">
                    <a href="${homePath}" class="${!isGallery ? 'active-link' : ''}">Illustration</a>
                    <a href="${galleryPath}" class="${isGallery ? 'active-link' : ''}">Gallery</a>
                    <a href="${aboutPath}">About</a>
                    <a href="#contact-modal" id="contact-link">Contact</a>
                </nav>
            </header>
        `;
    }

    // ==========================================
    // 2. HAMBURGER NAVIGATION TOGGLE
    // ==========================================
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');

    if (hamburgerBtn && navMenu) {
        function toggleNav() {
            hamburgerBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        }

        function closeNav() {
            hamburgerBtn.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('nav-open');
        }

        hamburgerBtn.addEventListener('click', toggleNav);

        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                closeNav();
            });
        });
    }

    // ==========================================
    // 3. CONTACT MODAL FUNCTIONALITY
    // ==========================================
    const contactModal = document.getElementById('contact-modal');
    const contactLink = document.getElementById('contact-link');
    const footerContactLink = document.getElementById('footer-contact-link');
    const closeContactBtn = document.querySelector('.contact-close-btn');

    function openContactModal(e) {
        if (e) e.preventDefault();
        if (contactModal) {
            contactModal.classList.add('active');
            document.body.classList.add('modal-open');
        }
    }

    function closeContactModal() {
        if (contactModal) {
            contactModal.classList.remove('active');
            document.body.classList.remove('modal-open');
        }
    }

    if (contactLink) {
        contactLink.addEventListener('click', openContactModal);
    }

    if (footerContactLink) {
        footerContactLink.addEventListener('click', openContactModal);
    }

    if (closeContactBtn) {
        closeContactBtn.addEventListener('click', closeContactModal);
    }

    window.addEventListener('click', (e) => {
        if (e.target === contactModal) {
            closeContactModal();
        }
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && contactModal && contactModal.classList.contains('active')) {
            closeContactModal();
        }
    });

    // ==========================================
    // 4. LIGHTBOX FUNCTIONALITY (WITH SWIPE & ANIMATION)
    // ==========================================
    const lightbox = document.getElementById('lightbox');
    const lightboxContent = document.querySelector('.lightbox-content');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const closeBtn = document.querySelector('.close-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const projectImages = document.querySelectorAll('.project-img');

    let currentIndex = 0;

    // Touch swipe coordinates
    let touchStartX = 0;
    let touchEndX = 0;
    const minSwipeDistance = 50; 

    function showImage(index, direction = 0) {
        if (projectImages.length === 0) return;

        if (direction !== 0 && lightboxContent) {
            // FIXED: Added proper parentheses around direction * 50 to compute px correctly
            lightboxContent.style.transform = `translateX(${direction * 50}px)`;
            lightboxContent.style.opacity = '0';

            setTimeout(() => {
                updateImageSource(index);
                lightboxContent.style.transform = `translateX(${-direction * 50}px)`;
                
                // Force reflow
                void lightboxContent.offsetWidth;

                lightboxContent.style.transform = 'translateX(0)';
                lightboxContent.style.opacity = '1';
            }, 150);
        } else {
            updateImageSource(index);
        }
    }

    function updateImageSource(index) {
        if (index < 0) {
            currentIndex = projectImages.length - 1;
        } else if (index >= projectImages.length) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }
        
        const currentImg = projectImages[currentIndex];
        lightboxImg.src = currentImg.src;
        lightboxImg.alt = currentImg.alt;
        
        if (lightboxTitle) {
            lightboxTitle.textContent = currentImg.alt || '';
        }
    }

    function openLightbox(index) {
        if (!lightbox) return;
        lightbox.classList.add('active');
        document.body.classList.add('lightbox-open');
        updateImageSource(index);
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        document.body.classList.remove('lightbox-open');
    }

    projectImages.forEach((img, index) => {
        img.addEventListener('click', () => {
            openLightbox(index);
        });
    });

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showImage(currentIndex + 1, -1); // Slide left
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showImage(currentIndex - 1, 1); // Slide right
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            closeLightbox();
        });
    }

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        lightbox.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].clientX;
        }, { passive: true });

        lightbox.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            handleSwipe();
        }, { passive: true });
    }

    function handleSwipe() {
        const swipeDistance = touchEndX - touchStartX;

        // Swipe Left -> Next Image (Slide left: direction -1)
        if (swipeDistance < -minSwipeDistance) {
            showImage(currentIndex + 1, -1);
        } 
        // Swipe Right -> Previous Image (Slide right: direction 1)
        else if (swipeDistance > minSwipeDistance) {
            showImage(currentIndex - 1, 1);
        }
    }

    document.addEventListener('keydown', (e) => {
        if (!lightbox || !lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            showImage(currentIndex + 1, -1);
        } else if (e.key === 'ArrowLeft') {
            showImage(currentIndex - 1, 1);
        }
    });

    // ==========================================
    // 5. BACK TO TOP BUTTON
    // ==========================================
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            if (backToTopBtn) backToTopBtn.classList.add('show');
        } else {
            if (backToTopBtn) backToTopBtn.classList.remove('show');
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ==========================================
    // 6. SMOOTH SCROLLING FOR ANCHORS
    // ==========================================
    document.querySelectorAll('nav a[href*="#"], footer a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            if (href === '#contact-modal' || href === '#') return;

            if (href.includes('.html#')) {
                const parts = href.split('#');
                const targetPage = parts[0];
                const targetId = '#' + parts[1];
                
                if (window.location.pathname.endsWith(targetPage) || window.location.pathname.endsWith('/' + targetPage)) {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        e.preventDefault();
                        const headerHeight = document.querySelector('header')?.offsetHeight || 0;
                        const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                        const offsetPosition = elementPosition - headerHeight;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
                return;
            }

            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = document.querySelector('header')?.offsetHeight || 0;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

});