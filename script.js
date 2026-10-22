
// Hamburger Navigation & Full Screen Overlay Toggle
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

// Lightbox functionality
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxTitle = document.getElementById('lightbox-title');
const closeBtn = document.querySelector('.close-btn');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const projectImages = document.querySelectorAll('.project-img');

let currentIndex = 0;

function showImage(index) {
    if (projectImages.length === 0) return;

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
    showImage(index);
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
        showImage(currentIndex + 1);
    });
}

if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showImage(currentIndex - 1);
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
}

document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') {
        closeLightbox();
    } else if (e.key === 'ArrowRight') {
        showImage(currentIndex + 1);
    } else if (e.key === 'ArrowLeft') {
        showImage(currentIndex - 1);
    }
});

// Back to Top Button Functionality
const backToTopBtn = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
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

// Contact Modal Functionality (Updated to lock body scroll when open)
document.addEventListener('DOMContentLoaded', () => {
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
});

// Smooth scrolling for same-page anchors
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
                    const headerHeight = document.querySelector('header').offsetHeight || 0;
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
            const headerHeight = document.querySelector('header').offsetHeight || 0;
            const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - headerHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});