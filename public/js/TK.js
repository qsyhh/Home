    document.addEventListener('DOMContentLoaded', function() {
    const images = window.galleryImages || [];
    const imageGallery = document.getElementById('imageGallery');
    const emptyState = document.getElementById('emptyState');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const imageViewer = document.getElementById('imageViewer');
    const viewerImage = document.getElementById('viewerImage');
    const viewerCaption = document.getElementById('viewerCaption');
    const closeViewer = document.getElementById('closeViewer');
    let currentFilter = 'all';
    let isZoomed = false; 

    initGallery();
    
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
            isZoomed = false;
            viewerImage.style.transform = 'scale(1)';
        });
        
        imageViewer.addEventListener('click', function(e) {
            if (e.target === imageViewer) {
                imageViewer.style.display = 'none';
                isZoomed = false;
                viewerImage.style.transform = 'scale(1)';
            }
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && imageViewer.style.display === 'flex') {
                imageViewer.style.display = 'none';
                isZoomed = false;
                viewerImage.style.transform = 'scale(1)';
            }
        });

        // 图片点击放大事件
        viewerImage.addEventListener('click', function() {
            if (isZoomed) {
                viewerImage.style.transform = 'scale(1)';
                isZoomed = false;
            } else {
                viewerImage.style.transform = 'scale(1.5)'; 
                isZoomed = true;
            }
        });
    }
    
    // 渲染画廊
    function renderGallery() {
        imageGallery.innerHTML = '';
        
        const filteredImages = currentFilter === 'all' 
            ? images 
            : images.filter(img => img.category === currentFilter);
        
        if (filteredImages.length === 0) {
            emptyState.style.display = 'block';
            return;
        } else {
            emptyState.style.display = 'none';
        }
        
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
        viewerCaption.textContent = ''; 
        imageViewer.style.display = 'flex';
        isZoomed = false;
        viewerImage.style.transform = 'scale(1)';
        
        // 加载图片
        const img = new Image();
        img.src = image.url;
        img.onload = function() {
            viewerImage.src = image.url;
            const categoryName = getCategoryName(image.category);
            viewerCaption.textContent = `${image.title} (${categoryName})`;
        };
        img.onerror = function() {
            viewerCaption.innerHTML = `
                ${image.title} - 图片加载失败<br>
                <a href="${image.url}" target="_blank" style="color: #3498db; text-decoration: underline;">
                    点击直接查看图片
                </a>
            `;
        };
    }
    
    // 检查空状态
    function checkEmptyState() {
        const filteredImages = currentFilter === 'all' 
            ? images 
            : images.filter(img => img.category === currentFilter);
        emptyState.style.display = filteredImages.length === 0 ? 'block' : 'none';
    }
    
    // 获取分类名称
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