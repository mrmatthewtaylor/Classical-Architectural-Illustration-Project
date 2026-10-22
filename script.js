// Get lightbox elements
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxTitle = document.getElementById('lightbox-title');
const closeBtn = document.querySelector('.close-btn');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const projectImages = document.querySelectorAll('.project-img');

let currentIndex = 0;

// Function to display image and title by index (with looping)
function showImage(index) {
    if (index < 0) {
        currentIndex = projectImages.length - 1; // Jump to last image if at start
    } else if (index >= projectImages.length) {
        currentIndex = 0; // Loop back to first image if at end
    } else {
        currentIndex = index;
    }
    
    const currentImg = projectImages[currentIndex];
    lightboxImg.src = currentImg.src;
    lightboxImg.alt = currentImg.alt;
    
    // Update title text using the image's alt attribute
    if (lightboxTitle) {
        lightboxTitle.textContent = currentImg.alt || '';
    }
}

// Helper function to open lightbox and lock background scrolling
function openLightbox(index) {
    lightbox.classList.add('active');
    document.body.classList.add('lightbox-open');
    showImage(index);
}

// Helper function to close lightbox and restore background scrolling
function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.classList.remove('lightbox-open');
}

// Open lightbox when any project image is clicked
projectImages.forEach((img, index) => {
    img.addEventListener('click', () => {
        openLightbox(index);
    });
});

// Next button click
nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showImage(currentIndex + 1);
});

// Previous button click
prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showImage(currentIndex - 1);
});

// Close lightbox when clicking the 'X' button
closeBtn.addEventListener('click', () => {
    closeLightbox();
});

// Close lightbox when clicking the dark background overlay
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Keyboard navigation (Esc to close, Left/Right arrows to cycle)
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') {
        closeLightbox();
    } else if (e.key === 'ArrowRight') {
        showImage(currentIndex + 1);
    } else if (e.key === 'ArrowLeft') {
        showImage(currentIndex - 1);
    }
});

// Contact Modal Functionality
document.addEventListener('DOMContentLoaded', () => {
    const contactModal = document.getElementById('contact-modal');
    const contactLink = document.getElementById('contact-link');
    const footerContactLink = document.getElementById('footer-contact-link');
    const closeBtn = document.querySelector('.contact-close-btn');

    function openContactModal(e) {
        if (e) e.preventDefault();
        contactModal.classList.add('active');
    }

    function closeContactModal() {
        contactModal.classList.remove('active');
    }

    if (contactLink) {
        contactLink.addEventListener('click', openContactModal);
    }

    if (footerContactLink) {
        footerContactLink.addEventListener('click', openContactModal);
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeContactModal);
    }

    // Close modal when clicking outside the content box
    window.addEventListener('click', (e) => {
        if (e.target === contactModal) {
            closeContactModal();
        }
    });

    // Close modal on 'Escape' key press
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && contactModal.classList.contains('active')) {
            closeContactModal();
        }
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('nav a[href^="#"], footer a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        
        // Skip for modal triggers like #contact-modal
        if (targetId === '#contact-modal' || targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            
            // Get header height to prevent section content from hiding behind sticky/fixed headers
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