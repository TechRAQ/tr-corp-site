(function() {
    if (sessionStorage.getItem('aiPopupShown')) return;

    const excludePages = ['ai_solutions_enablement.html', 'contact.html'];
    const currentPath = window.location.pathname;
    const isExcluded = excludePages.some(page => currentPath.includes(page));
    if (isExcluded) return;

    const style = document.createElement('style');
    style.innerHTML = `
        #ai-exit-popup-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
        }
        #ai-exit-popup-overlay.show {
            opacity: 1;
            visibility: visible;
        }
        .ai-exit-popup {
            background: #fff;
            width: 90%;
            max-width: 550px;
            border-radius: 20px;
            padding: 40px;
            position: relative;
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            transform: translateY(20px);
            transition: transform 0.3s ease;
            font-family: 'Satoshi', sans-serif;
            text-align: center;
            box-sizing: border-box;
        }
        #ai-exit-popup-overlay.show .ai-exit-popup {
            transform: translateY(0);
        }
        .ai-exit-close {
            position: absolute;
            top: 20px;
            right: 20px;
            background: none;
            border: none;
            font-size: 20px;
            color: #64748B;
            cursor: pointer;
            padding: 0;
        }
        .ai-exit-pill {
            display: inline-flex;
            align-items: center;
            background: rgba(0, 180, 241, 0.1);
            color: #0081ad;
            padding: 6px 16px;
            border-radius: 50px;
            font-weight: 600;
            font-size: 14px;
            position: absolute;
            top: 40px;
            left: 40px;
        }
        .ai-exit-pill i {
            margin-right: 8px;
        }
        .ai-exit-content {
            margin-top: 50px;
            text-align: left;
        }
        .ai-exit-title {
            font-family: 'Oswald', sans-serif;
            font-size: 32px;
            font-weight: 700;
            line-height: 1.1;
            color: #1A1D21;
            margin-bottom: 12px;
            text-transform: uppercase;
        }
        .ai-exit-subtitle {
            font-size: 16px;
            color: #64748B;
            margin-bottom: 32px;
        }
        .ai-exit-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 32px;
        }
        .ai-exit-card {
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
            text-align: left;
        }
        .ai-exit-icon-box {
            width: 32px;
            height: 32px;
            background: rgba(0, 180, 241, 0.1);
            color: #0081ad;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 16px;
        }
        .ai-exit-card h4 {
            font-family: 'Oswald', sans-serif;
            font-size: 28px;
            font-weight: 700;
            color: #1A1D21;
            margin-bottom: 4px;
            margin-top: 0;
        }
        .ai-exit-card p {
            font-size: 13px;
            color: #64748B;
            margin: 0;
            line-height: 1.4;
        }
        .ai-exit-footer-text {
            font-weight: 700;
            color: #1A1D21;
            margin-bottom: 16px;
            text-align: center;
            font-size: 16px;
        }
        .ai-exit-actions {
            display: flex;
            gap: 12px;
            margin-bottom: 16px;
        }
        .ai-exit-btn {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #00B4F1 0%, #0081ad 100%);
            color: white !important;
            text-decoration: none;
            padding: 14px 16px;
            border-radius: 50px;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.3s ease;
            box-shadow: 0 10px 20px rgba(0, 180, 241, 0.2);
        }
        .ai-exit-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 30px rgba(0, 180, 241, 0.3);
        }
        .ai-exit-btn i {
            margin-left: 8px;
        }
        .ai-exit-btn-outline {
            background: transparent;
            color: #0081ad !important;
            border: 2px solid #0081ad;
            box-shadow: none;
        }
        .ai-exit-btn-outline:hover {
            background: rgba(0, 180, 241, 0.05);
            box-shadow: none;
        }
        .ai-exit-note {
            font-size: 12px;
            color: #94a3b8;
            text-align: center;
        }
        @media (max-width: 480px) {
            .ai-exit-grid { grid-template-columns: 1fr; }
            .ai-exit-popup { padding: 30px; margin-top: 20px;}
            .ai-exit-pill { top: 20px; left: 20px; position: relative; margin-bottom: 20px;}
            .ai-exit-content { margin-top: 10px; }
            .ai-exit-close { top: 20px; right: 20px; }
            .ai-exit-actions { flex-direction: column; gap: 10px; }
        }
    `;
    document.head.appendChild(style);

    const popupHTML = `
        <div id="ai-exit-popup-overlay">
            <div class="ai-exit-popup">
                <button class="ai-exit-close" id="ai-exit-close-btn"><i class="fa-solid fa-xmark"></i></button>
                <div class="ai-exit-pill"><i class="fa-solid fa-wand-magic-sparkles"></i> Before you go</div>
                
                <div class="ai-exit-content">
                    <h2 class="ai-exit-title">TAKE A LOOK AT WHAT AI CAN DO FOR YOUR BUSINESS</h2>
                    <p class="ai-exit-subtitle">Here's what teams like yours are already seeing.</p>
                    
                    <div class="ai-exit-grid">
                        <div class="ai-exit-card">
                            <div class="ai-exit-icon-box"><i class="fa-solid fa-bolt"></i></div>
                            <h4>40%</h4>
                            <p>reduction in manual operations</p>
                        </div>
                        <div class="ai-exit-card">
                            <div class="ai-exit-icon-box"><i class="fa-regular fa-file-lines"></i></div>
                            <h4>60%</h4>
                            <p>faster document processing</p>
                        </div>
                        <div class="ai-exit-card">
                            <div class="ai-exit-icon-box"><i class="fa-regular fa-comment"></i></div>
                            <h4>30%</h4>
                            <p>faster customer response times</p>
                        </div>
                        <div class="ai-exit-card">
                            <div class="ai-exit-icon-box"><i class="fa-solid fa-arrow-trend-up"></i></div>
                            <h4>25%</h4>
                            <p>productivity improvement</p>
                        </div>
                    </div>
                </div>

                <div class="ai-exit-footer-text">Ready to accelerate your AI journey?</div>
                <div class="ai-exit-actions">
                    <a href="ai_solutions_enablement.html" class="ai-exit-btn">Explore AI capabilities <i class="fa-solid fa-arrow-right"></i></a>
                    <a href="contact.html" class="ai-exit-btn ai-exit-btn-outline">Contact us <i class="fa-solid fa-arrow-right"></i></a>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', popupHTML);

    const overlay = document.getElementById('ai-exit-popup-overlay');
    const closeBtn = document.getElementById('ai-exit-close-btn');

    function showPopup() {
        if (!sessionStorage.getItem('aiPopupShown')) {
            overlay.classList.add('show');
            sessionStorage.setItem('aiPopupShown', 'true');
        }
    }

    closeBtn.addEventListener('click', () => {
        overlay.classList.remove('show');
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('show');
        }
    });

    document.addEventListener('mouseleave', (e) => {
        if (e.clientY < 20) {
            showPopup();
        }
    });
})();
