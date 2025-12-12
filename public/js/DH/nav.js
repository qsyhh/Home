document.addEventListener('DOMContentLoaded', () => {
    const navBtns = document.querySelectorAll('.nav-btn');
    const contentArea = document.getElementById('content-area');
    const loadingMask = document.getElementById('loadingMask');
    let activeTabKey = 'hj';

    loadLocalBgFirstThenApi();

    // 快速渲染页面，缩短感知时间
    renderTabContent(activeTabKey);
    setTimeout(() => {
        loadingMask.style.opacity = 0;
        setTimeout(() => loadingMask.style.display = 'none', 200);
    }, 100);

    // 导航点击逻辑
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabKey = btn.dataset.tab;
            if (tabKey === activeTabKey) return;

            activeTabKey = tabKey;
            updateActiveNavBtn();
            
            loadingMask.style.display = 'flex';
            loadingMask.style.opacity = 0.8;

            renderTabContent(tabKey);
            setTimeout(() => {
                loadingMask.style.opacity = 0;
                setTimeout(() => loadingMask.style.display = 'none', 200);
            }, 150);
        });
    });

    // 键盘←→切换
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
        e.preventDefault();

        const tabKeys = ['hj', 'yy', 'yx', 'zy', 'more'];
        const currentIndex = tabKeys.indexOf(activeTabKey);
        const newIndex = e.key === 'ArrowLeft' 
            ? (currentIndex === 0 ? tabKeys.length - 1 : currentIndex - 1) 
            : (currentIndex === tabKeys.length - 1 ? 0 : currentIndex + 1);

        activeTabKey = tabKeys[newIndex];
        updateActiveNavBtn();
        renderTabContent(activeTabKey);
    });

    // 更新导航激活状态
    function updateActiveNavBtn() {
        navBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === activeTabKey));
    }

    // 渲染标签内容 - 核心优化：PE端改为2列布局
    function renderTabContent(tabKey) {
        contentArea.innerHTML = '';
        // 动态添加卡片容器类名，适配不同屏幕
        const cardContainer = document.createElement('div');
        cardContainer.className = 'card-container';
        
        // 根据屏幕宽度设置PE端2列布局（500px以下为手机端）
        if (window.innerWidth <= 500) {
            cardContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
            cardContainer.style.gap = '12px'; // 手机端缩小间距，更紧凑
        }

        contentArea.appendChild(cardContainer);

        switch (tabKey) {
            case 'hj': 
                if (typeof renderHJContent === 'function') {
                    renderHJContent(cardContainer); // 传入容器，让子函数往里面添加卡片
                }
                break;
            case 'yy': 
                if (typeof renderYYContent === 'function') {
                    renderYYContent(cardContainer);
                }
                break;
            case 'yx': 
                if (typeof renderYXContent === 'function') {
                    renderYXContent(cardContainer);
                }
                break;
            case 'zy': 
                if (typeof renderZYContent === 'function') {
                    renderZYContent(cardContainer);
                }
                break;
            case 'more': 
                renderMoreContent(cardContainer);
                break;
            default: 
                renderHJContent(cardContainer);
        }
    }

    // 背景图加载 - 核心优化：减少背景模糊，提升清晰度
    function loadLocalBgFirstThenApi() {
        const setBg = (url, isLocal = false) => {
            document.body.style.backgroundImage = `url(${url})`;
            // 优化背景显示：降低模糊度，提升不透明度，增强清晰度
            document.body.style.backgroundBlendMode = 'overlay'; // 叠加模式，让背景更清晰
            // 本地图添加淡入效果，API图替换时添加平滑过渡
            if (isLocal) {
                document.body.style.transition = 'none'; 
            } else {
                document.body.style.transition = 'background-image 0.8s ease-in-out';
            }
        };

        setBg(publicConfig.bgApi.fallback, true);
        console.log('优先显示本地背景图');

        fetch(publicConfig.bgApi.url)
            .then(res => res.ok ? res.blob() : Promise.reject())
            .then(blob => {
                const apiImgUrl = URL.createObjectURL(blob);
                setBg(apiImgUrl); 
                console.log('API图加载成功，已替换本地图');
            })
            .catch(() => {
                // 首选API失败，尝试备用API
                fetch(publicConfig.bgApi.backupUrl)
                    .then(res => res.ok ? res.blob() : Promise.reject())
                    .then(blob => {
                        const backupImgUrl = URL.createObjectURL(blob);
                        setBg(backupImgUrl); 
                        console.log('备用API图加载成功，已替换本地图');
                    })
                    .catch(() => {
                        console.log('API图加载失败，保持本地背景图');
                    });
            });
    }
});