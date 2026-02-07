// ==========================================
// 1. 変数・共通設定
// ==========================================
const track = document.querySelector('.carousel-track');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');

let index = 0;          // 現在表示しているカードの番号
let startX = 0;         // タッチ開始位置
let currentTranslate = 0; // 現在の移動量（px）
let prevTranslate = 0;    // 前回の確定移動量（px）
let isDragging = false; // ドラッグ中フラグ

// ==========================================
// 2. 共通アニメーション関数
// ==========================================

// カルーセルを特定の位置まで動かす
function updateCarouselPosition() {
    const cardWidth = document.querySelector('.work-card').offsetWidth + 20;
    prevTranslate = -index * cardWidth;
    track.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    track.style.transform = `translateX(${prevTranslate}px)`;
}

// ==========================================
// 3. カルーセル：クリック操作
// ==========================================
nextBtn.addEventListener('click', () => {
    const visibleCards = window.innerWidth <= 768 ? 1 : 3;
    const maxIndex = track.children.length - visibleCards;
    if (index < maxIndex) index++;
    updateCarouselPosition();
});

prevBtn.addEventListener('click', () => {
    if (index > 0) index--;
    updateCarouselPosition();
});

// ==========================================
// 4. カルーセル：マウスホイール操作
// ==========================================
track.addEventListener('wheel', (e) => {
    e.preventDefault();
    const visibleCards = window.innerWidth <= 768 ? 1 : 3;
    const maxIndex = track.children.length - visibleCards;

    if (e.deltaY > 0) {
        if (index < maxIndex) index++;
    } else {
        if (index > 0) index--;
    }
    updateCarouselPosition();
}, { passive: false });

// ==========================================
// 5. カルーセル：リアルタイム・スワイプ
// ==========================================
track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
    track.style.transition = 'none'; // 指で動かしている間はアニメをオフ
}, { passive: true });

track.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    track.style.transform = `translateX(${prevTranslate + diff}px)`;
}, { passive: true });

track.addEventListener('touchend', () => {
    isDragging = false;
    const cardWidth = document.querySelector('.work-card').offsetWidth + 20;
    const visibleCards = window.innerWidth <= 768 ? 1 : 3;
    const maxIndex = track.children.length - visibleCards;

    // 現在の位置から一番近いカードを計算
    const movedBy = parseFloat(track.style.transform.replace('translateX(', '').replace('px)', ''));
    index = Math.round(-movedBy / cardWidth);

    // 範囲外ガード
    if (index < 0) index = 0;
    if (index > maxIndex) index = maxIndex;

    updateCarouselPosition();
});

// ==========================================
// 6. スクロールフェードイン (Intersection Observer)
// ==========================================
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ==========================================
// 7. スムーススクロール
// ==========================================
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
