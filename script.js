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
let isMoving = false; // スワイプ中かどうかを判定するフラグ

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
    isMoving = false; // 最初は動いていない
    track.style.transition = 'none';
}, { passive: true });

track.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;

    // 10px以上動いたら「スワイプ中」とみなす
    if (Math.abs(diff) > 10) {
        isMoving = true; 
    }

    track.style.transform = `translateX(${prevTranslate + diff}px)`;
}, { passive: true });

// --- 重要：スワイプ中のクリックを防止する ---
track.addEventListener('click', (e) => {
    if (isMoving) {
        e.preventDefault(); // スワイプ中ならリンクを飛ばさない
        e.stopImmediatePropagation(); // 他のイベントも止める
    }
}, true); // 「true」にしてイベントを早めにキャッチするのがコツです

track.addEventListener('touchend', () => {
    isDragging = false;
    // ...（中略：これまでのtouchendの処理はそのまま）...
    updateCarouselPosition();
    
    // 少し遅らせてから移動フラグをリセット（クリック判定との競合防止）
    setTimeout(() => { isMoving = false; }, 100);
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

