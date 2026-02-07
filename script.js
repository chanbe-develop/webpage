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
    // indexに基づいて正しい位置を再計算
    const targetTranslate = -index * cardWidth;
    
    track.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
    track.style.transform = `translateX(${targetTranslate}px)`;
    
    // 次のスワイプのために確定位置を保存
    prevTranslate = targetTranslate;
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
    isMoving = false;
    track.style.transition = 'none';
    
    // 現在の表示位置を数値として取得して保持
    const style = window.getComputedStyle(track);
    const matrix = new WebKitCSSMatrix(style.transform);
    prevTranslate = matrix.m41; 
}, { passive: true });

rack.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;

    if (Math.abs(diff) > 10) isMoving = true;

    // 指の動きに合わせてリアルタイム移動
    track.style.transform = `translateX(${prevTranslate + diff}px)`;
}, { passive: true });

// --- 重要：スワイプ中のクリックを防止する ---
track.addEventListener('click', (e) => {
    if (isMoving) {
        e.preventDefault(); // スワイプ中ならリンクを飛ばさない
        e.stopImmediatePropagation(); // 他のイベントも止める
    }
}, true); // 「true」にしてイベントを早めにキャッチするのがコツです

// 5. カルーセル：リアルタイム・スワイプ (決定版)
track.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;
    
    const cardWidth = document.querySelector('.work-card').offsetWidth + 20;
    const visibleCards = window.innerWidth <= 768 ? 1 : 3;
    const maxIndex = track.children.length - visibleCards;

    // 指を離した瞬間の位置を確認
    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX; // 動かした距離と方向
    const threshold = 50; // 50px以上で発動

    if (diff < -threshold) {
        // 右から左へ（次へ）
        if (index < maxIndex) index++;
    } else if (diff > threshold) {
        // 左から右へ（前へ）
        if (index > 0) index--;
    }
    // それ以外（微小な動き）なら元の index の位置に戻る

    updateCarouselPosition();
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





