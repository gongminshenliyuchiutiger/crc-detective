document.addEventListener('DOMContentLoaded', () => {
    // 1. 定義找碴熱點 (x, y 為相對於圖片寬高的百分比)
    // 因圖片隨機生成，故在此提供五個分布於畫面各處的示意熱點
    const hotspotsData = [
        {
            id: 1,
            x: 33, y: 68, 
            title: "大人強迫小孩超時工作！",
            article: "兒童權利公約 第32條：免於剝削的權利",
            description: "兒童有權免受經濟剝削，且不從事任何可能危害其健康或妨礙其教育的工作。",
            icon: "fa-solid fa-person-digging"
        },
        {
            id: 2,
            x: 20, y: 25, 
            title: "大人偷看別人的日記！",
            article: "兒童權利公約 第16條：隱私權",
            description: "每個孩子都有保有隱私的權利，任何人（包含父母）都不應該隨意侵犯兒童的私人生活、家庭、住家或通信。",
            icon: "fa-solid fa-user-lock"
        },
        {
            id: 3,
            x: 70, y: 88, 
            title: "遊樂場沒有無障礙設施！",
            article: "兒童權利公約 第23條：身心障礙兒童的權利",
            description: "身心障礙的兒童有權享有特別照顧，並且應該擁有與其他孩子一樣參與遊戲和休閒活動的平等機會。",
            icon: "fa-solid fa-wheelchair"
        },
        {
            id: 4,
            x: 62, y: 55, 
            title: "大人不讓小孩表達意見！",
            article: "兒童權利公約 第12條：表意權",
            description: "兒童有權利對影響他們的所有事物自由表達意見，而且大眾應根據兒童的年齡和成熟度，給予他們的意見適當的重視。",
            icon: "fa-solid fa-comment-slash"
        },
        {
            id: 5,
            x: 48, y: 38, 
            title: "禁止兒童玩耍！",
            article: "兒童權利公約 第31條：遊戲與休閒的權利",
            description: "每個兒童都有休息、休閒以及參與遊戲和娛樂活動的權利。",
            icon: "fa-solid fa-ban"
        }
    ];

    let score = 0;
    const maxScore = hotspotsData.length;

    const imageWrapper = document.getElementById('imageWrapper');
    const scoreDisplay = document.getElementById('score');

    // 對話框元素
    const modalOverlay = document.getElementById('modalOverlay');
    const successModal = document.getElementById('successModal');
    const closeModalBtn = document.getElementById('closeModal');
    const confirmBtn = document.getElementById('confirmBtn');
    const restartBtn = document.getElementById('restartBtn');

    const modalIcon = document.getElementById('modalIcon');
    const modalTitle = document.getElementById('modalTitle');
    const modalArticle = document.getElementById('modalArticle');
    const modalDescription = document.getElementById('modalDescription');

    // 初始化熱點
    function initHotspots() {
        // 清除舊熱點
        document.querySelectorAll('.hotspot').forEach(el => el.remove());
        score = 0;
        scoreDisplay.textContent = score;

        hotspotsData.forEach(data => {
            const hotspot = document.createElement('div');
            hotspot.className = 'hotspot';
            hotspot.style.left = `${data.x}%`;
            hotspot.style.top = `${data.y}%`;
            hotspot.dataset.id = data.id;

            hotspot.addEventListener('click', () => {
                if (hotspot.classList.contains('found')) return;
                
                hotspot.classList.add('found');
                score++;
                scoreDisplay.textContent = score;

                showModal(data);
            });

            imageWrapper.appendChild(hotspot);
        });
    }

    // 顯示資訊對話框
    function showModal(data) {
        modalIcon.className = `fa-3x ${data.icon}`;
        modalTitle.textContent = data.title;
        modalArticle.textContent = data.article;
        modalDescription.textContent = data.description;
        
        modalOverlay.classList.add('active');
    }

    // 隱藏對話框並檢查是否通關
    function hideModal() {
        modalOverlay.classList.remove('active');
        if (score >= maxScore) {
            setTimeout(() => {
                successModal.classList.add('active');
            }, 500);
        }
    }

    closeModalBtn.addEventListener('click', hideModal);
    confirmBtn.addEventListener('click', hideModal);
    
    restartBtn.addEventListener('click', () => {
        successModal.classList.remove('active');
        initHotspots();
    });

    // 遊戲初始化
    initHotspots();

    // 2. 吉祥物拖曳邏輯
    const mascot = document.getElementById('mascot');
    let isDragging = false;
    let currentX = 0;
    let currentY = 0;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    // 同時支援滑鼠與觸控事件
    mascot.addEventListener('mousedown', dragStart);
    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('mousemove', drag);

    mascot.addEventListener('touchstart', dragStart, { passive: false });
    document.addEventListener('touchend', dragEnd);
    document.addEventListener('touchmove', drag, { passive: false });

    function dragStart(e) {
        if (e.type === 'touchstart') {
            initialX = e.touches[0].clientX - xOffset;
            initialY = e.touches[0].clientY - yOffset;
        } else {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
        }

        if (e.target === mascot || e.target.parentNode === mascot) {
            isDragging = true;
            mascot.style.transition = 'none'; // 拖曳時取消過渡動畫
            mascot.classList.add('is-dragging');
        }
    }

    function dragEnd(e) {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
        mascot.classList.remove('is-dragging');
        mascot.style.transition = 'filter 0.3s ease'; // 恢復濾鏡過渡
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault(); // 防止滾動畫面

            if (e.type === 'touchmove') {
                currentX = e.touches[0].clientX - initialX;
                currentY = e.touches[0].clientY - initialY;
            } else {
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
            }

            xOffset = currentX;
            yOffset = currentY;

            setTranslate(currentX, currentY, mascot);
        }
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    }

    // 3. 知識寶典邏輯
    const knowledgeBtn = document.getElementById('knowledgeBtn');
    const knowledgeModalOverlay = document.getElementById('knowledgeModalOverlay');
    const closeKnowledgeModal = document.getElementById('closeKnowledgeModal');
    const knowledgeList = document.getElementById('knowledgeList');

    // 渲染知識寶典清單
    function renderKnowledgeList() {
        if (!knowledgeList) return;
        knowledgeList.innerHTML = '';
        hotspotsData.forEach(data => {
            const item = document.createElement('div');
            item.className = 'knowledge-item';
            item.innerHTML = `
                <div class="k-icon"><i class="${data.icon}"></i></div>
                <div class="k-text">
                    <h4>${data.article}</h4>
                    <p>${data.description}</p>
                </div>
            `;
            knowledgeList.appendChild(item);
        });
    }
    renderKnowledgeList();

    // 知識寶典按鈕點擊開啟邏輯
    if (knowledgeBtn) {
        knowledgeBtn.addEventListener('click', () => {
            knowledgeModalOverlay.classList.add('active');
        });
    }

    // 關閉知識寶典
    if (closeKnowledgeModal) {
        closeKnowledgeModal.addEventListener('click', () => {
            knowledgeModalOverlay.classList.remove('active');
        });
    }
});
