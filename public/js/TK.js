document.addEventListener('DOMContentLoaded', function() {
    // 图床图片
    const images = [
        {
            title: "原神截图",
            url: "https://prod-alicdn-community.kurobbs.com/forum/10835dead33a41598657e711d77752e420250814.png",
            category: "YS"
        },
        {
            title: "原神截图",
            url: "https://prod-alicdn-community.kurobbs.com/forum/ba8d6c80fe36408ca026b69fd04a476b20250814.png",
            category: "YS"
        },
        {
            title: "原神截图",
            url: "https://prod-alicdn-community.kurobbs.com/forum/056d32bc567b4569a377b23ffb3310d020250814.png",
            category: "YS"
        },
        {
            title: "原神截图",
            url: "https://prod-alicdn-community.kurobbs.com/forum/c2908353508b484fbf8ffe6acc576e8920250814.png",
            category: "YS"
        },
        {
            title: "风景照",
            url: "https://prod-alicdn-community.kurobbs.com/forum/1cc730feff3048019ec00066fd899c2220250814.png",
            category: "MJ"
        },
        {
            title: "个人照片",
            url: "https://prod-alicdn-community.kurobbs.com/forum/1cc730feff3048019ec00066fd899c2220250814.png",
            category: "GR"
        }
    ];
    
    // DOM元素
    const imageGallery = document.getElementById('imageGallery');
    const emptyState = document.getElementById('emptyState');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const imageViewer = document.getElementById('imageViewer');
    const viewerImage = document.getElementById('viewerImage');
    const viewerCaption = document.getElementById('viewerCaption');
    const closeViewer = document.getElementById('closeViewer');
    
    // 状态
    let currentFilter = 'all';
    
    // 初始化
    initGallery();
    
    // 初始化画廊
    function initGallery() {
        renderGallery();
        checkEmptyState();
        
        // 绑定筛选事件
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                currentFilter = this.getAttribute('data-category');
                renderGallery();
            });
        });
        
        // 关闭查看器事件
        closeViewer.addEventListener('click', function() {
            imageViewer.style.display = 'none';
        });
        
        imageViewer.addEventListener('click', function(e) {
            if (e.target === imageViewer) {
                imageViewer.style.display = 'none';
            }
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && imageViewer.style.display === 'flex') {
                imageViewer.style.display = 'none';
            }
        });
    }
    
    // 渲染画廊
    function renderGallery() {
        imageGallery.innerHTML = '';
        
        const filteredImages = currentFilter === 'all' 
            ? images 
            : images.filter(img => img.category === currentFilter);
        
        filteredImages.forEach((image) => {
            const card = createImageCard(image);
            imageGallery.appendChild(card);
        });
    }
    
    // 创建图片卡片
    function createImageCard(image) {
        const card = document.createElement('div');
        card.className = 'image-card';
        card.setAttribute('data-category', image.category);
        
        const categoryName = getCategoryName(image.category);
        
        card.innerHTML = `
            <div class="image-preview">
                <div class="loading-spinner"></div>
                <img src="${image.url}" alt="${image.title}" 
                     onload="this.parentElement.querySelector('.loading-spinner').style.display='none'"
                     onerror="this.parentElement.innerHTML='<div class=\'image-error\'><i class=\'fas fa-exclamation-triangle\'></i><p>加载失败</p><a href=\'${image.url}\' target=\'_blank\'>点击直接查看</a></div>'">
            </div>
            <div class="image-info">
                <h3 class="image-title">${image.title}</h3>
                <p class="image-path">${truncateUrl(image.url)}</p>
                <span class="image-category">${categoryName}</span>
            </div>
        `;
        
        // 点击查看大图
        card.addEventListener('click', function() {
            openImageViewer(image);
        });
        
        return card;
    }
    
    // 打开图片查看器
    function openImageViewer(image) {
        // 显示加载状态
        viewerImage.src = '';
        viewerCaption.innerHTML = `<div class="loading-spinner"></div><p>加载中...</p>`;
        imageViewer.style.display = 'flex';
        
        // 加载图片
        setTimeout(() => {
            viewerImage.src = image.url;
            const categoryName = getCategoryName(image.category);
            
            viewerImage.onload = function() {
                viewerCaption.textContent = `${image.title} (${categoryName})`;
            };
            
            viewerImage.onerror = function() {
                viewerCaption.innerHTML = `
                    ${image.title} - 图片加载失败<br>
                    <a href="${image.url}" target="_blank" style="color: #3498db; text-decoration: underline;">
                        点击直接查看图片
                    </a>
                `;
            };
        }, 100);
    }
    
    // 辅助函数：截断长URL显示
    function truncateUrl(url, maxLength = 50) {
        if (url.length <= maxLength) return url;
        return url.substring(0, 25) + '...' + url.substring(url.length - 22);
    }
    
    function checkEmptyState() {
        const filteredImages = currentFilter === 'all' 
            ? images 
            : images.filter(img => img.category === currentFilter);
        emptyState.style.display = filteredImages.length === 0 ? 'block' : 'none';
    }
    
    function getCategoryName(categoryValue) {
        const categories = {
            'YS': '原神截图',
            'MJ': '美景',
            'GR': '个人照片',
            'QT': '其他'
        };
        return categories[categoryValue] || categoryValue;
    }
});
