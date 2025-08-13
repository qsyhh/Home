document.addEventListener('DOMContentLoaded', function() {
    const CATEGORIES = {
        'YS': '原神截图',
        'MJ': '美景',
        'GR': '个人照片',
        'QT': '其他'
    };
    const FORMATS = ['png', 'jpg', 'jpeg']; // 支持的图片格式
    const MAX_NUMBERS = 50; // 最大尝试编号
    const CHECK_STEP = 1; // 编号递增步长
    
    // DOM元素
    const gallery = document.getElementById('imageGallery');
    const loading = document.getElementById('loading');
    const loadInfo = document.getElementById('loadInfo');
    const empty = document.getElementById('empty');
    const refreshBtn = document.getElementById('refreshBtn');
    const startNumInput = document.getElementById('startNum');
    const categoryBtns = document.querySelectorAll('.category-btn');
    const imageViewer = document.getElementById('imageViewer');
    const viewerImage = document.getElementById('viewerImage');
    const viewerTitle = document.getElementById('viewerTitle');
    const viewerCounter = document.getElementById('viewerCounter');
    const closeViewer = document.getElementById('closeViewer');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    // 图片数据
    let allImages = [];
    let currentIndex = 0;
    let currentCategory = 'all';
    
    // 初始化
    init();
    
    function init() {
        // 绑定事件
        refreshBtn.addEventListener('click', loadAllImages);
        closeViewer.addEventListener('click', closeImageViewer);
        prevBtn.addEventListener('click', showPreviousImage);
        nextBtn.addEventListener('click', showNextImage);
        
        // 分类按钮事件
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                categoryBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentCategory = this.getAttribute('data-category');
                filterImages();
            });
        });
        
        // 键盘导航
        document.addEventListener('keydown', function(e) {
            if (!imageViewer.classList.contains('hidden')) {
                if (e.key === 'Escape') closeImageViewer();
                else if (e.key === 'ArrowLeft') showPreviousImage();
                else if (e.key === 'ArrowRight') showNextImage();
            }
        });
        
        // 点击查看器背景关闭
        imageViewer.addEventListener('click', function(e) {
            if (e.target === imageViewer) {
                closeImageViewer();
            }
        });
        
        // 初始加载
        loadAllImages();
    }
    
    // 加载所有图片
    function loadAllImages() {
        // 重置状态
        allImages = [];
        gallery.innerHTML = '';
        loading.classList.remove('hidden');
        empty.classList.add('hidden');
        
        const startNum = parseInt(startNumInput.value) || 1;
        let checked = 0;
        let found = 0;
        
        // 遍历所有分类
        Object.keys(CATEGORIES).forEach(category => {
            // 遍历可能的编号
            for (let i = 0; i < MAX_NUMBERS; i++) {
                const number = startNum + i * CHECK_STEP;
                const formattedNumber = number.toString().padStart(2, '0');
                
                // 尝试每种格式
                FORMATS.forEach(format => {
                    const path = `Img/${category}/${formattedNumber}.${format}`;
                    checkImageExists(path, category, formattedNumber, format, function(exists) {
                        checked++;
                        
                        // 更新加载信息
                        loadInfo.textContent = `正在检查: ${category}/${formattedNumber}.${format} (找到 ${found} 张)`;
                        
                        if (exists) {
                            found++;
                            // 添加到图片列表
                            const imageInfo = {
                                path: path,
                                category: category,
                                name: `${CATEGORIES[category]} ${formattedNumber}`,
                                filename: `${formattedNumber}.${format}`,
                                index: allImages.length
                            };
                            
                            allImages.push(imageInfo);
                            // 添加到画廊
                            addImageToGallery(imageInfo);
                        }
                        
                        // 全部检查完毕
                        if (checked >= Object.keys(CATEGORIES).length * MAX_NUMBERS * FORMATS.length) {
                            loading.classList.add('hidden');
                            // 没有找到任何图片
                            if (allImages.length === 0) {
                                empty.classList.remove('hidden');
                            } else {
                                filterImages(); // 应用当前分类筛选
                            }
                        }
                    });
                });
            }
        });
    }
    
    // 检查图片是否存在
    function checkImageExists(path, category, number, format, callback) {
        const img = new Image();
        img.src = path;
        
        // 超时处理
        const timeout = setTimeout(() => {
            callback(false);
        }, 2000);
        
        // 加载成功
        img.onload = function() {
            clearTimeout(timeout);
            // 验证图片有效
            if (this.width > 1 && this.height > 1) {
                callback(true);
            } else {
                callback(false);
            }
        };
        
        // 加载失败
        img.onerror = function() {
            clearTimeout(timeout);
            callback(false);
        };
    }
    
    // 添加图片到画廊
    function addImageToGallery(image) {
        const item = document.createElement('div');
        item.className = 'image-item';
        item.setAttribute('data-category', image.category);
        item.setAttribute('data-index', image.index);
        
        item.innerHTML = `
            <div class="image-wrapper">
                <div class="image-placeholder">
                    <i class="fas fa-image"></i>
                </div>
                <img src="${image.path}" alt="${image.name}" class="image-thumbnail" loading="lazy">
            </div>
            <div class="image-info">
                <h3>${image.name}</h3>
                <p>${image.filename}</p>
            </div>
        `;
        
        gallery.appendChild(item);
        
        // 点击查看图片
        item.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            openImageViewer(index);
        });
        
        // 图片加载完成后隐藏占位符
        const imgElement = item.querySelector('.image-thumbnail');
        imgElement.onload = function() {
            item.querySelector('.image-placeholder').style.display = 'none';
        };
    }
    
    // 筛选图片
    function filterImages() {
        const items = document.querySelectorAll('.image-item');
        
        items.forEach(item => {
            if (currentCategory === 'all' || item.getAttribute('data-category') === currentCategory) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    // 打开图片查看器
    function openImageViewer(index) {
        if (!allImages[index]) return;
        
        currentIndex = index;
        const image = allImages[index];
        
        viewerImage.src = image.path;
        viewerTitle.textContent = image.name;
        viewerCounter.textContent = `${index + 1} / ${allImages.length}`;
        
        imageViewer.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
    
    // 关闭图片查看器
    function closeImageViewer() {
        imageViewer.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
    
    // 显示上一张图片
    function showPreviousImage() {
        if (allImages.length === 0) return;
        
        currentIndex = (currentIndex - 1 + allImages.length) % allImages.length;
        openImageViewer(currentIndex);
    }
    
    // 显示下一张图片
    function showNextImage() {
        if (allImages.length === 0) return;
        
        currentIndex = (currentIndex + 1) % allImages.length;
        openImageViewer(currentIndex);
    }
});
    