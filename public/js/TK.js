document.addEventListener('DOMContentLoaded', function() {
    // 图床图片
    const images = [
        {
            title: "ys (1)",
            url: "https://prod-alicdn-community.kurobbs.com/forum/e0b75082bd62472badfb0b8cc98280a620250821.png",
            category: "YS"
        },
        {
            title: "ys (10)",
            url: "https://prod-alicdn-community.kurobbs.com/forum/bb0625fd67fa48b6805382733b05298e20250821.png",
            category: "YS"
        },
        {
            title: "ys (11)",
            url: "https://prod-alicdn-community.kurobbs.com/forum/d8751278023f4cd4a4919a550bc655e820250821.png",
            category: "YS"
        },
        {
            title: "ys (12)",
            url: "https://prod-alicdn-community.kurobbs.com/forum/59daab91fa2e4c21b223404bb2948bec20250821.png",
            category: "YS"
        },
        {
            title: "ys (13)",
            url: "https://prod-alicdn-community.kurobbs.com/forum/f61af00ff9f842ce9b8c40bd21a444ca20250821.png",
            category: "YS"
        },
        {
            title: "ys (14)",
            url: "https://prod-alicdn-community.kurobbs.com/forum/d8d3ae65507a4b0eb2f5b5877fdb426f20250821.png",
            category: "YS"
        },
        {
            title: "ys (15)",
            url: "https://prod-alicdn-community.kurobbs.com/forum/c3936996e47a49189f6df131becce9f620250821.png",
            category: "YS"
        },
        {
            title: "ys (16)",
            url: "https://prod-alicdn-community.kurobbs.com/forum/68ebb5c8ff7b4334af75509e49ffc05020250821.png",
            category: "YS"
        },
        {
            title: "ys (2)",
            url: "https://prod-alicdn-community.kurobbs.com/forum/f84a6a85186347b3946a1792e353eb6720250821.png",
            category: "YS"
        },
        {
            title: "ys (3)",
            url: "https://prod-alicdn-community.kurobbs.com/forum/b644e1c2e2d547209ed4771acf48cb6920250821.png",
            category: "YS"
        },
        {
            title: "ys (4)",
            url: "https://prod-alicdn-community.kurobbs.com/forum/4bebf94103b847fe98652249edf66f7d20250821.png",
            category: "YS"
        },
        {
            title: "ys (5)",
            url: "https://prod-alicdn-community.kurobbs.com/forum/1a4ae0e2d7ac4f7b8db985d0afbb813e20250821.png",
            category: "YS"
        },
        {
            title: "ys (6)",
            url: "https://prod-alicdn-community.kurobbs.com/forum/067fdaa074f24f2ba763c4bd0703e14320250821.png",
            category: "YS"
        },
        {
            title: "ys (7)",
            url: "https://prod-alicdn-community.kurobbs.com/forum/c616e23f70db4554b08899cc09148dbe20250821.png",
            category: "YS"
        },
        {
            title: "ys (8)",
            url: "https://prod-alicdn-community.kurobbs.com/forum/8c1fbfe0efbc4eeb8e48cd4240ad520920250821.png",
            category: "YS"
        },
        {
            title: "ys (9)",
            url: "https://prod-alicdn-community.kurobbs.com/forum/7c24ca212461437c981c33941df54ee120250821.png",
            category: "YS"
        },
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
    let isZoomed = false; 

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
