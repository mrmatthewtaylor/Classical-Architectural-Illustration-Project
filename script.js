// ==========================================
    // 4. LIGHTBOX FUNCTIONALITY (WITH SWIPE ANIMATION)
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

        // Apply slide animation if a direction (-1 or 1) is provided
        if (direction !== 0 && lightboxContent) {
            lightboxContent.style.transform = `translateX(${direction * 50px})`;
            lightboxContent.style.opacity = '0';

            setTimeout(() => {
                updateImageSource(index);
                lightboxContent.style.transform = `translateX(${-direction * 50px})`;
                
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