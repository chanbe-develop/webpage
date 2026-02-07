// 1. スクロールに合わせて要素をふわっと出す (Intersection Observer)
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// 2. カルーセルの簡易実装
const track = document.querySelector('.carousel-track');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
let index = 0;

nextBtn.addEventListener('click', () => {
    const cardWidth = document.querySelector('.work-card').offsetWidth + 20;
    const maxIndex = track.children.length - 3; // 3枚表示想定
    if (index < maxIndex) {
        index++;
        track.style.transform = `translateX(-${index * cardWidth}px)`;
    }
});

prevBtn.addEventListener('click', () => {
    const cardWidth = document.querySelector('.work-card').offsetWidth + 20;
    if (index > 0) {
        index--;
        track.style.transform = `translateX(-${index * cardWidth}px)`;
    }
});

// 3. スムーススクロール
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        document.querySelector(targetId).scrollIntoView({
            behavior: 'smooth'
        });
    });
});