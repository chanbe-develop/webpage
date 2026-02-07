const track = document.querySelector('.carousel-track');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');

let index = 0;
let startX = 0;
let prevTranslate = 0;
let isDragging = false;
let isMoving = false;

function updateCarouselPosition() {
    const cardWidth = document.querySelector('.work-card').offsetWidth + 20;
    const targetTranslate = -index * cardWidth;
    track.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
    track.style.transform = `translateX(${targetTranslate}px)`;
    prevTranslate = targetTranslate;
}

// 1. Click Controls
nextBtn.addEventListener('click', () => {
    const visibleCards = window.innerWidth <= 768 ? 1 : 3;
    if (index < track.children.length - visibleCards) index++;
    updateCarouselPosition();
});

prevBtn.addEventListener('click', () => {
    if (index > 0) index--;
    updateCarouselPosition();
});

// 2. Wheel Controls
track.addEventListener('wheel', (e) => {
    e.preventDefault();
    const visibleCards = window.innerWidth <= 768 ? 1 : 3;
    if (e.deltaY > 0 && index < track.children.length - visibleCards) index++;
    else if (e.deltaY < 0 && index > 0) index--;
    updateCarouselPosition();
}, { passive: false });

// 3. Smooth Swipe Controls
track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
    isMoving = false;
    track.style.transition = 'none';
    const style = window.getComputedStyle(track);
    const matrix = new WebKitCSSMatrix(style.transform);
    prevTranslate = matrix.m41;
}, { passive: true });

track.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    if (Math.abs(diff) > 10) isMoving = true;
    track.style.transform = `translateX(${prevTranslate + diff}px)`;
}, { passive: true });

track.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;
    const diff = e.changedTouches[0].clientX - startX;
    const threshold = 50;
    const visibleCards = window.innerWidth <= 768 ? 1 : 3;

    if (diff < -threshold && index < track.children.length - visibleCards) index++;
    else if (diff > threshold && index > 0) index--;

    updateCarouselPosition();
    setTimeout(() => { isMoving = false; }, 100);
});

// Prevent link click during swipe
track.addEventListener('click', (e) => { if (isMoving) e.preventDefault(); }, true);

// 4. Other Features
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});