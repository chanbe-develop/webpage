// ==========================================
// 1. 変数・共通設定
// ==========================================
const track = document.querySelector('.carousel-track');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');

let index = 0;          // 現在のインデックス
let startX = 0;         // タッチ開始位置
let prevTranslate = 0;    // 確定した移動量
let isDragging = false; // ドラッグ中フラグ
let isMoving = false;   // スワイプ移動中フラグ

// ==========================================
// 2. 共通アニメーション関数 (ここを強化)
// ==========================================
function updateCarouselPosition() {
    const cardWidth = document.querySelector('.work-card').offsetWidth + 20;
    const targetTranslate = -index * cardWidth;
    
    track.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
    track.style.transform = `translateX(${targetTranslate}px)`;
    
    // 【重要】アニメーションが終わる位置を常に保存し、次の操作の起点にする
    prevTranslate = targetTranslate;
}

// ==========================================
// 3. カルーセル：クリック操作
// ==========================================
nextBtn.addEventListener('click', () => {
    const visibleCards = window.innerWidth <= 768 ? 1 : 3;
    if (index < track.children.length - visibleCards) {
        index++;
        updateCarouselPosition();
    }
});

prevBtn.addEventListener('click', () => {
    if (index > 0) {
        index--;
        updateCarouselPosition();
    }
});

// ==========================================
// 4. カルーセル：マウスホイール操作
// ==========================================
track.addEventListener('wheel', (e) => {
    // 垂直スクロールを防止してカルーセルを優先
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        const visibleCards = window.innerWidth <= 768 ? 1 : 3;
        if (e.deltaY > 0 && index < track.children.length - visibleCards) index++;
        else if (e.deltaY < 0 && index > 0) index--;
        updateCarouselPosition();
    }
}, { passive: false });

// ==========================================
// 5. カルーセル：リアルタイム・スワイプ (修正版)
// ==========================================
track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
    isMoving = false;
    track.style.transition = 'none';

    // 【重要】タッチした瞬間に、ブラウザが今表示している「生の座標」を取得し直す
    const style = window.getComputedStyle(track);
    const matrix = new WebKitCSSMatrix(style.transform);
    prevTranslate = matrix.m41; // これで02にいてもその座標からスタートできる
}, { passive: true });

track.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;

    if (Math.abs(diff) > 10) isMoving = true;

    // 指の動きに完全に同期させる
    track.style.transform = `translateX(${prevTranslate + diff}px)`;
}, { passive: true });

track.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;

    const cardWidth = document.querySelector('.work-card').offsetWidth + 20;
    const visibleCards = window.innerWidth <= 768 ? 1 : 3;
    const maxIndex = track.children.length - visibleCards; // ここで限界を再計算

    const diff = e.changedTouches[0].clientX - startX;
    const threshold = 50; 

    // 左右判定をシンプルに
    if (diff < -threshold && index < maxIndex) {
        index++; // 次へ
    } else if (diff > threshold && index > 0) {
        index--; // 前へ
    }
    // 端に到達している場合や動きが小さい場合は、updateCarouselPositionで元の位置へ綺麗に戻す

    updateCarouselPosition();
    setTimeout(() => { isMoving = false; }, 100);
});

// スワイプ中にリンクが飛ばないようにガード
track.addEventListener('click', (e) => {
    if (isMoving) {
        e.preventDefault();
        e.stopImmediatePropagation();
    }
}, true);

// ==========================================
// 6. その他の機能 (Observer & スムーススクロール)
// ==========================================
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
    });
});