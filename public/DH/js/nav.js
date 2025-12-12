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

    // 渲染标签内容
    function renderTabContent(tabKey) {
        contentArea.innerHTML = '';
        switch (tabKey) {
            case 'hj': typeof renderHJContent === 'function' && renderHJContent(); break;
            case 'yy': typeof renderYYContent === 'function' && renderYYContent(); break;
            case 'yx': typeof renderYXContent === 'function' && renderYXContent(); break;
            case 'zy': typeof renderZYContent === 'function' && renderZYContent(); break;
            case 'more': renderMoreContent(); break;
            default: renderHJContent();
        }
    }

    function loadLocalBgFirstThenApi() {
        const setBg = (url, isLocal = false) => {
            document.body.style.backgroundImage = `url(${url})`;
            // 本地图添加淡入效果，API图替换时添加平滑过渡
            if (isLocal) {
                document.body.style.transition = 'none'; 
            } else {
                document.body.style.transition = 'background-image 0.8s ease-in-out'; // API图替换平滑过渡
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

    // 更多模块
    function renderMoreContent() {
        contentArea.innerHTML = `
            <div class="more-container">
                <h3 style="text-align:center; color:#2c3e50; margin-bottom:30px; font-size:24px;">
                    <i class="fa fa-star"></i> 更多功能开发中
                </h3>
                <div style="text-align:center; color:#7f8c8d; font-size:16px; line-height:1.8;">
                    <p>• 咕咕咕...</p>
                </div>
            </div>
        `;
    }
});