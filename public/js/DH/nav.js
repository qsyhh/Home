document.addEventListener('DOMContentLoaded', () => {
    const navBtns = document.querySelectorAll('.nav-btn');
    const contentArea = document.getElementById('content-area');
    const loadingMask = document.getElementById('loadingMask');
    let activeTabKey = 'hj';
    // 存储已创建的图片URL，用于后续释放
    let createdImageUrls = [];

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

    // 验证图片格式是否支持
    function isImageFormatSupported(blob) {
        // 常见图片MIME类型列表
        const supportedMimeTypes = [
            'image/jpeg', 
            'image/png', 
            'image/gif', 
            'image/webp',
            'image/jpg',
            'image/svg+xml',
            'image/bmp'
        ];
        return supportedMimeTypes.includes(blob.type);
    }

    // 释放已创建的Object URL，避免内存泄漏
    function revokeCreatedUrls() {
        createdImageUrls.forEach(url => {
            try {
                URL.revokeObjectURL(url);
            } catch (e) {
                console.warn('释放URL失败:', e);
            }
        });
        createdImageUrls = [];
    }

    // 背景图加载 - 
    function loadLocalBgFirstThenApi() {
        const setBg = (url, isLocal = false) => {
            // 释放之前的图片资源
            if (!isLocal) {
                revokeCreatedUrls();
            }
            
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

        // 优先设置本地背景图
        setBg(publicConfig.bgApi.fallback, true);
        console.log('优先显示本地背景图');

        // 加载API图片的通用函数
        const loadApiImage = (url) => {
            return fetch(url)
                .then(res => {
                    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                    return res.blob();
                })
                .then(blob => {
                    // 验证图片格式
                    if (!isImageFormatSupported(blob)) {
                        throw new Error(`不支持的图片格式: ${blob.type}`);
                    }
                    // 创建Object URL并存储
                    const apiImgUrl = URL.createObjectURL(blob);
                    createdImageUrls.push(apiImgUrl);
                    setBg(apiImgUrl);
                    console.log(`API图加载成功(${blob.type})，已替换本地图`);
                });
        };

        // 加载主API图片
        loadApiImage(publicConfig.bgApi.url)
            .catch(error => {
                console.warn('主API图加载失败:', error);
                // 尝试备用API
                return loadApiImage(publicConfig.bgApi.backupUrl)
                    .catch(backupError => {
                        console.warn('备用API图加载失败:', backupError);
                        console.log('API图加载失败，保持本地背景图');
                    });
            });

        // 页面卸载时释放资源
        window.addEventListener('beforeunload', revokeCreatedUrls);
    }
});