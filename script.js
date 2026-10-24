// ===== PARTICLES INITIALIZATION =====
particlesJS('particles-js', {
    particles: {
        number: {
            value: 80,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: '#4A90E2'
        },
        shape: {
            type: 'circle'
        },
        opacity: {
            value: 0.5,
            random: false
        },
        size: {
            value: 3,
            random: true
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#4A90E2',
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: {
                enable: true,
                mode: 'repulse'
            },
            onclick: {
                enable: true,
                mode: 'push'
            },
            resize: true
        }
    },
    retina_detect: true
});

// ===== HEADER SCROLL EFFECT =====
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ===== MOBILE NAVIGATION TOGGLE =====
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// ===== SMOOTH SCROLL FOR NAVIGATION =====
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        
        // Close mobile menu
        navMenu.classList.remove('active');
        
        // Update active link
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// ===== GENERATE DUMMY IMAGES FOR GALLERIES =====
const monthDays = {
    jan: 31, feb: 28, mar: 31, apr: 30, may: 31, jun: 30,
    jul: 31, aug: 31, sep: 30, oct: 31, nov: 30, dec: 31
};

const colors = ['4A90E2', '667eea', '764ba2', 'D4AF37', '8B7355', '2E5090'];

// Generate Gospel Toons English Gallery
function generateGallery(galleryId, monthId, year = 2026, useRealImages = false) {
    const gallery = document.getElementById(galleryId);
    const monthButtons = document.querySelectorAll(`#${monthId} .month-btn`);
    
    // Real image for testing (gospel toon sample)
    const sampleGospelImage = 'gospel-toon-sample.jpg';
    
    function loadMonth(month) {
        gallery.innerHTML = '';
        const days = monthDays[month];
        
        for (let day = 1; day <= days; day++) {
            const colorIndex = day % colors.length;
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            
            // Use real image for testing or placeholder
            const imageSrc = useRealImages ? sampleGospelImage : `https://via.placeholder.com/400x500/${colors[colorIndex]}/ffffff?text=Day+${day}`;
            
            galleryItem.innerHTML = `
                <img src="${imageSrc}" 
                     alt="Gospel Toon ${month} ${day}" 
                     loading="lazy"
                     onerror="this.src='https://via.placeholder.com/400x500/${colors[colorIndex]}/ffffff?text=Day+${day}'">
                <div class="gallery-overlay">
                    <div class="gallery-info">
                        <div class="gallery-date">${month.toUpperCase()} ${day}, ${year}</div>
                        <div class="gallery-title">Daily Gospel Illustration</div>
                    </div>
                </div>
            `;
            
            // Add click event for lightbox
            galleryItem.addEventListener('click', () => {
                openLightbox(galleryItem.querySelector('img').src, `${month.toUpperCase()} ${day}, ${year}`);
            });
            
            gallery.appendChild(galleryItem);
        }
    }
    
    // Load first month by default
    loadMonth('jan');
    
    // Month button click handlers
    monthButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            monthButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const month = btn.getAttribute('data-month');
            loadMonth(month);
        });
    });
}

// Initialize both galleries with real images for testing
generateGallery('englishGallery', 'monthTrackEnglish', 2026, true); // true = use real images
generateGallery('tamilGallery', 'monthTrackTamil', 2026, true); // true = use real images

// ===== MONTH NAVIGATION SCROLL =====
document.querySelectorAll('.month-navigation').forEach(nav => {
    const prevBtn = nav.querySelector('.prev');
    const nextBtn = nav.querySelector('.next');
    const track = nav.querySelector('.month-track');
    
    let scrollAmount = 0;
    
    prevBtn.addEventListener('click', () => {
        scrollAmount -= 200;
        if (scrollAmount < 0) scrollAmount = 0;
        track.style.transform = `translateX(-${scrollAmount}px)`;
    });
    
    nextBtn.addEventListener('click', () => {
        const maxScroll = track.scrollWidth - track.parentElement.offsetWidth;
        scrollAmount += 200;
        if (scrollAmount > maxScroll) scrollAmount = maxScroll;
        track.style.transform = `translateX(-${scrollAmount}px)`;
    });
});

// ===== JESUS SECTION - CATEGORY GALLERY =====
const categoryCards = document.querySelectorAll('.category-card');
const categoryGallery = document.getElementById('categoryGallery');
const categoryTitle = categoryGallery.querySelector('.gallery-category-title');
const categoryImagesContainer = categoryGallery.querySelector('.category-images');
const galleryCloseBtn = categoryGallery.querySelector('.gallery-close');

const categoryData = {
    mary: { 
        title: 'Mary - Mother of God', 
        count: 1,
        images: ['eucharist-sample.jpg'] // Replace with actual Mary images
    },
    saints: { 
        title: 'Saints - Holy Witnesses', 
        count: 1,
        images: ['eucharist-sample.jpg'] // Replace with actual Saints images
    },
    eucharist: { 
        title: 'Eucharist - Body of Christ', 
        count: 1,
        images: ['eucharist-sample.jpg'] // Your uploaded Eucharist image
    },
    church: { 
        title: 'Church - House of God', 
        count: 1,
        images: ['eucharist-sample.jpg'] // Replace with actual Church images
    },
    scripture: { 
        title: 'Scripture - Word of God', 
        count: 1,
        images: ['eucharist-sample.jpg'] // Replace with actual Scripture images
    },
    common: { 
        title: 'Common - Shared Faith', 
        count: 1,
        images: ['eucharist-sample.jpg'] // Replace with actual Common images
    }
};

categoryCards.forEach(card => {
    card.addEventListener('click', () => {
        const category = card.getAttribute('data-category');
        const data = categoryData[category];
        
        // Set title
        categoryTitle.textContent = data.title;
        
        // Generate images
        categoryImagesContainer.innerHTML = '';
        
        // Use real images if available, otherwise use placeholders
        if (data.images && data.images.length > 0) {
            data.images.forEach((imgSrc, index) => {
                const item = document.createElement('div');
                item.className = 'gallery-item';
                item.innerHTML = `
                    <img src="${imgSrc}" 
                         alt="${data.title} ${index + 1}" 
                         loading="lazy"
                         onerror="this.src='https://via.placeholder.com/400x500/${colors[index % colors.length]}/ffffff?text=${category.toUpperCase()}+${index + 1}'">
                    <div class="gallery-overlay">
                        <div class="gallery-info">
                            <div class="gallery-date">${category.toUpperCase()} #${index + 1}</div>
                            <div class="gallery-title">${data.title}</div>
                        </div>
                    </div>
                `;
                
                // Add click event for lightbox
                item.addEventListener('click', () => {
                    openLightbox(item.querySelector('img').src, `${data.title} #${index + 1}`);
                });
                
                categoryImagesContainer.appendChild(item);
            });
        } else {
            // Fallback to placeholder images
            for (let i = 1; i <= data.count; i++) {
                const colorIndex = i % colors.length;
                const item = document.createElement('div');
                item.className = 'gallery-item';
                item.innerHTML = `
                    <img src="https://via.placeholder.com/400x500/${colors[colorIndex]}/ffffff?text=${category.toUpperCase()}+${i}" 
                         alt="${data.title} ${i}" 
                         loading="lazy">
                    <div class="gallery-overlay">
                        <div class="gallery-info">
                            <div class="gallery-date">${category.toUpperCase()} #${i}</div>
                            <div class="gallery-title">${data.title}</div>
                        </div>
                    </div>
                `;
                
                // Add click event for lightbox
                item.addEventListener('click', () => {
                    openLightbox(item.querySelector('img').src, `${data.title} #${i}`);
                });
                
                categoryImagesContainer.appendChild(item);
            }
        }
        
        // Show gallery
        categoryGallery.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

// Close category gallery
galleryCloseBtn.addEventListener('click', () => {
    categoryGallery.classList.remove('active');
    document.body.style.overflow = 'auto';
});

// ===== LIGHTBOX =====
const lightbox = document.getElementById('lightbox');
const lightboxImage = lightbox.querySelector('.lightbox-image');
const lightboxCaption = lightbox.querySelector('.lightbox-caption');
const lightboxClose = lightbox.querySelector('.lightbox-close');
const lightboxPrev = lightbox.querySelector('.lightbox-prev');
const lightboxNext = lightbox.querySelector('.lightbox-next');

let currentImages = [];
let currentIndex = 0;

function openLightbox(imageSrc, caption) {
    lightboxImage.src = imageSrc;
    lightboxCaption.textContent = caption;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Get all images in current gallery
    const activeGallery = document.querySelector('.gospel-section:not(.gospel-tamil) .gallery-container');
    currentImages = Array.from(activeGallery.querySelectorAll('.gallery-item img')).map(img => ({
        src: img.src,
        alt: img.alt
    }));
    currentIndex = currentImages.findIndex(img => img.src === imageSrc);
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function showPrevImage() {
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    lightboxImage.src = currentImages[currentIndex].src;
    lightboxCaption.textContent = currentImages[currentIndex].alt;
}

function showNextImage() {
    currentIndex = (currentIndex + 1) % currentImages.length;
    lightboxImage.src = currentImages[currentIndex].src;
    lightboxCaption.textContent = currentImages[currentIndex].alt;
}

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', showPrevImage);
lightboxNext.addEventListener('click', showNextImage);

// Close lightbox on background click
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('active')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrevImage();
        if (e.key === 'ArrowRight') showNextImage();
    }
});

// ===== BACK TO TOP BUTTON =====
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===== SCROLL REVEAL ANIMATIONS =====
const revealElements = document.querySelectorAll('.hero-description p, .gallery-item, .category-card');
revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(el);
});

// ===== UPDATE ACTIVE NAV ON SCROLL =====
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ===== LAZY LOAD IMAGES =====
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== PRELOADER (Optional) =====
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// ===== PERFORMANCE OPTIMIZATION =====
// Debounce scroll events
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

// Apply debounce to scroll events
const debouncedScroll = debounce(() => {
    // Your scroll logic here
}, 10);

window.addEventListener('scroll', debouncedScroll);

// ===== ANIMATE ON SCROLL =====
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.fade-in-up');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

window.addEventListener('scroll', debounce(animateOnScroll, 50));
animateOnScroll(); // Run on load

// ===== ROTATING IMAGE EFFECT (for Jesus section) =====
const categoryIconWrappers = document.querySelectorAll('.category-icon-wrapper');

categoryIconWrappers.forEach(wrapper => {
    wrapper.addEventListener('mouseenter', () => {
        wrapper.style.animation = 'none';
        setTimeout(() => {
            wrapper.style.animation = '';
        }, 10);
    });
});

// ===== CONSOLE MESSAGE =====
console.log('%c🙏 Sathish Paul SDB - Where Scripture Meets Creative Expression', 
    'font-size: 16px; color: #4A90E2; font-weight: bold;');
console.log('%cWebsite designed with faith and creativity', 
    'font-size: 12px; color: #D4AF37;');

