// DOMが読み込まれた後に実行
document.addEventListener('DOMContentLoaded', function() {
    
    // ======================
    // スムーズスクロール機能
    // ======================
    function smoothScrollTo(element, duration = 800) {
        const targetPosition = element.offsetTop - 80; // ヘッダー分のオフセット
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    }

    // ======================
    // ヘッダーアニメーション
    // ======================
    function initHeaderAnimation() {
        const headerContent = document.querySelector('.header-content');
        const headerElements = headerContent.querySelectorAll('p, h1, h2, .btn-main');
        
        // 初期状態を設定
        headerElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = `opacity 0.8s ease ${index * 0.2}s, transform 0.8s ease ${index * 0.2}s`;
        });

        // アニメーション開始
        setTimeout(() => {
            headerElements.forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            });
        }, 500);
    }

    // ======================
    // スクロールアニメーション（Intersection Observer）
    // ======================
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // アニメーション対象の要素を設定
        const animateElements = document.querySelectorAll('.section');
        animateElements.forEach(el => {
            el.classList.add('animate-element');
            observer.observe(el);
        });

        // CSSスタイルを動的に追加
        const style = document.createElement('style');
        style.textContent = `
            .animate-element {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.8s ease, transform 0.8s ease;
            }
            .animate-element.animate-in {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);
    }

    // ======================
    // FAQアコーディオン機能
    // ======================
    function initFAQAccordion() {
        const faqCards = document.querySelectorAll('.faq-card');
        
        faqCards.forEach(card => {
            const question = card.querySelector('.faq-question');
            const answer = card.querySelector('.faq-answer');
            
            // 初期状態を設定
            answer.style.maxHeight = '0';
            answer.style.overflow = 'hidden';
            answer.style.transition = 'max-height 0.3s ease, padding 0.3s ease';
            answer.style.padding = '0 20px';
            
            question.style.cursor = 'pointer';
            question.style.position = 'relative';
            
            // アイコンを追加
            const icon = document.createElement('span');
            icon.innerHTML = '+';
            icon.style.cssText = `
                position: absolute;
                right: 20px;
                top: 50%;
                transform: translateY(-50%);
                font-size: 24px;
                font-weight: bold;
                transition: transform 0.3s ease;
                color: #d4af37;
            `;
            question.appendChild(icon);
            
            question.addEventListener('click', () => {
                const isOpen = answer.style.maxHeight !== '0px';
                
                if (isOpen) {
                    answer.style.maxHeight = '0';
                    answer.style.padding = '0 20px';
                    icon.style.transform = 'translateY(-50%) rotate(0deg)';
                    icon.innerHTML = '+';
                } else {
                    answer.style.maxHeight = answer.scrollHeight + 40 + 'px';
                    answer.style.padding = '20px';
                    icon.style.transform = 'translateY(-50%) rotate(45deg)';
                    icon.innerHTML = '−';
                }
            });
        });
    }

    // ======================
    // カードホバーエフェクト
    // ======================
    function initCardHoverEffects() {
        const cards = document.querySelectorAll('.problem-card, .consultation-card, .reason-card, .testimonial-card');
        
        cards.forEach(card => {
            card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
            
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
                card.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '';
            });
        });
    }

    // ======================
    // カウントアップアニメーション（相談件数など）
    // ======================
    function initCountUpAnimation() {
        function countUp(element, target, duration = 2000) {
            let start = 0;
            const increment = target / (duration / 16);
            
            function updateCount() {
                start += increment;
                if (start < target) {
                    element.textContent = Math.floor(start);
                    requestAnimationFrame(updateCount);
                } else {
                    element.textContent = target;
                }
            }
            updateCount();
        }

        // 相談件数の数字を見つけてアニメーション
        const consultationText = document.querySelector('.reason-card h3');
        if (consultationText && consultationText.textContent.includes('250件')) {
            const numberSpan = document.createElement('span');
            consultationText.innerHTML = consultationText.innerHTML.replace('250', '<span class="count-number">0</span>');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const numberElement = entry.target.querySelector('.count-number');
                        if (numberElement) {
                            countUp(numberElement, 250);
                            observer.unobserve(entry.target);
                        }
                    }
                });
            });
            
            observer.observe(consultationText);
        }
    }

    // ======================
    // ボタンクリック効果
    // ======================
    function initButtonEffects() {
        const buttons = document.querySelectorAll('.btn-main, .btn-main-footer');
        
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                // リップル効果の作成
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `;
                
                button.style.position = 'relative';
                button.style.overflow = 'hidden';
                button.appendChild(ripple);
                
                // アニメーション終了後にリップルを削除
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });

        // リップルアニメーションのCSSを追加
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // ======================
    // スクロール進捗インジケーター
    // ======================
    function initScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #d4af37, #f4e4bc);
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = scrollPercent + '%';
        });

}
});