// Get lightbox elements
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.querySelector('.close-btn');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const projectImages = document.querySelectorAll('.project-img');

let currentIndex = 0;

// Function to display image by index (with looping)
function showImage(index) {
    if (index < 0) {
        currentIndex = projectImages.length - 1; // Jump to last image if at start
    } else if (index >= projectImages.length) {
        currentIndex = 0; // Loop back to first image if at end
    } else {
        currentIndex = index;
    }
    lightboxImg.src = projectImages[currentIndex].src;
}

// Open lightbox when any project image is clicked
projectImages.forEach((img, index) => {
    img.addEventListener('click', () => {
        lightbox.classList.add('active');
        showImage(index);
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
    lightbox.classList.remove('active');
});

// Close lightbox when clicking the dark background overlay
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        lightbox.classList.remove('active');
    }
});

// Keyboard navigation (Esc to close, Left/Right arrows to cycle)
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') {
        lightbox.classList.remove('active');
    } else if (e.key === 'ArrowRight') {
        showImage(currentIndex + 1);
    } else if (e.key === 'ArrowLeft') {
        showImage(currentIndex - 1);
    }
});