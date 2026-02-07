// 1. フェードインアニメーション (変更なし)
const observerOptions = { threshold: 0.1 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, observerOptions);
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// 2. カルーセルの実装（スマホ対応版）
const track = document.querySelector('.carousel-track');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
let index = 0;

function moveCarousel() {
    // カード1枚の幅 + gap(20px) を取得
    const cardWidth = document.querySelector('.work-card').offsetWidth + 20;
    track.style.transform = `translateX(-${index * cardWidth}px)`;
}

nextBtn.addEventListener('click', () => {
    // スマホなら1枚表示、PC（768px超）なら3枚表示と判断
    const visibleCards = window.innerWidth <= 768 ? 1 : 3;
    const maxIndex = track.children.length - visibleCards;

    if (index < maxIndex) {
        index++;
        moveCarousel();
    }
});

prevBtn.addEventListener('click', () => {
    if (index > 0) {
        index--;
        moveCarousel();
    }
});

// --- カルーセルのマウスホイール対応 ---
track.addEventListener('wheel', (e) => {
    // デフォルトの垂直スクロールを防止（Worksセクション上のみ）
    e.preventDefault();

    // ホイールの回転方向に応じてインデックスを増減
    // e.deltaY > 0 は下方向へのスクロール
    const visibleCards = window.innerWidth <= 768 ? 1 : 3;
    const maxIndex = track.children.length - visibleCards;

    if (e.deltaY > 0) {
        // 次へ
        if (index < maxIndex) index++;
    } else {
        // 前へ
        if (index > 0) index--;
    }

    moveCarousel();
}, { passive: false }); // preventDefaultを有効にするための設定

// 3. スムーススクロール (変更なし)
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
    });
});

// --- カルーセルのスワイプ対応（ブラッシュアップ版） ---
let touchStartX = 0;

// 指が触れた位置を記録
track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

// 指が離れた時に距離を計算して動かす
track.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const swipeDistance = touchStartX - touchEndX; // 動いた距離
    const swipeThreshold = 25; // 判定を少し甘く（25px）して反応を良くする

    const visibleCards = window.innerWidth <= 768 ? 1 : 3;
    const maxIndex = track.children.length - visibleCards;

    if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0) {
            // 右から左へスワイプ（次へ）
            if (index < maxIndex) index++;
        } else {
            // 左から右へスワイプ（前へ）
            if (index > 0) index--;
        }
        moveCarousel();
    }
}, { passive: true });

