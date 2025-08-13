document.addEventListener('DOMContentLoaded', function () {
  const categoryBtns = document.querySelectorAll('.category-btn');
  const imageGallery = document.getElementById('imageGallery');
  const loadingIndicator = document.getElementById('loadingIndicator');
  const emptyState = document.getElementById('emptyState');
  const addImageBtn = document.getElementById('addImageBtn');
  const addImageModal = document.getElementById('addImageModal');
  const closeModal = document.querySelector('.close-modal');
  const cancelAdd = document.getElementById('cancelAdd');
  const addImageForm = document.getElementById('addImageForm');
  const imageViewer = document.getElementById('imageViewer');
  const viewerImage = document.getElementById('viewerImage');
  const closeViewer = document.querySelector('.close-viewer');
  const defaultImage = 'default.jpg'; // 默认图片路径

  // 分类对应的文件夹名称
  const categoryFolders = {
    'YS': 'YS',
    'MJ': 'MJ',
    'GR': 'GR',
    'QT': 'QT'
  };

  // 存储已加载的图片
  let loadedImages = [];
  let currentCategory = 'all';

  // 初始化加载图片
  loadImages();

  // 分类筛选
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      categoryBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentCategory = this.getAttribute('data-category');
      filterImages();
    });
  });

  // 打开添加图片模态框
  addImageBtn.addEventListener('click', function () {
    addImageModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  });

  // 关闭添加图片模态框
  function closeAddModal() {
    addImageModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    addImageForm.reset();
  }

  closeModal.addEventListener('click', closeAddModal);
  cancelAdd.addEventListener('click', closeAddModal);

  addImageModal.addEventListener('click', function (e) {
    if (e.target === addImageModal) {
      closeAddModal();
    }
  });

  // 提交添加图片表单
  addImageForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const fileInput = document.getElementById('imageFile');
    const nameInput = document.getElementById('imageName');
    const categorySelect = document.getElementById('imageCategory');

    if (!fileInput.files.length) {
      alert('请选择一张图片');
      return;
    }

    if (!nameInput.value.trim()) {
      alert('请输入图片名称');
      return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      const date = new Date();
      const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

      const newImageItem = document.createElement('div');
      newImageItem.className = 'image-item';
      newImageItem.setAttribute('data-category', categorySelect.value);

      newImageItem.innerHTML = `
        <img src="${e.target.result}" alt="${nameInput.value}" onerror="this.src='${defaultImage}';">
        <h3>${nameInput.value}</h3>
        <p>${formattedDate}</p>
      `;

      imageGallery.prepend(newImageItem);

      newImageItem.addEventListener('click', function () {
        viewerImage.src = e.target.result;
        viewerImage.alt = nameInput.value;
        imageViewer.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      });

      closeAddModal();
      alert('图片添加成功！');
    };

    reader.readAsDataURL(file);
  });

  // 为已有图片添加点击查看事件
  function addImageClickEvents() {
    const imageItems = document.querySelectorAll('.image-item');
    imageItems.forEach(item => {
      item.addEventListener('click', function () {
        const img = this.querySelector('img');
        viewerImage.src = img.src;
        viewerImage.alt = img.alt;
        imageViewer.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      });
    });
  }

  // 关闭图片查看器
  function closeImageViewer() {
    imageViewer.style.display = 'none';
    document.body.style.overflow = 'auto';
  }

  closeViewer.addEventListener('click', closeImageViewer);

  imageViewer.addEventListener('click', function (e) {
    if (e.target === imageViewer) {
      closeImageViewer();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (addImageModal.style.display === 'block') {
        closeAddModal();
      }
      if (imageViewer.style.display === 'flex') {
        closeImageViewer();
      }
    }
  });

  // 加载图片
  function loadImages() {
    loadingIndicator.classList.remove('hidden');
    imageGallery.innerHTML = '';
    loadedImages = [];

    // 要加载的分类
    const categories = currentCategory === 'all' ? Object.keys(categoryFolders) : [currentCategory];

    let loadedCount = 0;
    const totalCategories = categories.length;

    categories.forEach(category => {
      const folder = categoryFolders[category];
      // 假设图片命名为 01.png, 02.png, ..., 10.png 等，这里尝试加载前 10 张
      for (let i = 1; i <= 10; i++) {
        const imageName = i.toString().padStart(2, '0') + '.png';
        const imagePath = `Img/${folder}/${imageName}`;

        const img = new Image();
        img.src = imagePath;
        img.alt = `${category} ${imageName}`;
        img.onerror = function () {
          this.src = defaultImage;
        };

        img.onload = function () {
          const imageItem = document.createElement('div');
          imageItem.className = 'image-item';
          imageItem.setAttribute('data-category', category);

          imageItem.innerHTML = `
            <img src="${imagePath}" alt="${this.alt}" onerror="this.src='${defaultImage}';">
            <h3>${this.alt.split('.')[0]}</h3>
            <p>${imageName}</p>
          `;

          imageGallery.appendChild(imageItem);
          loadedImages.push({
            category: category,
            path: imagePath,
            alt: this.alt
          });

          // 检查是否所有图片都加载完毕
          loadedCount++;
          if (loadedCount === categories.length * 10) {
            loadingIndicator.classList.add('hidden');
            if (loadedImages.length === 0) {
              emptyState.classList.remove('hidden');
            } else {
              emptyState.classList.add('hidden');
              filterImages();
              addImageClickEvents();
            }
          }
        };
      }
    });
  }

  // 筛选图片
  function filterImages() {
    const imageItems = document.querySelectorAll('.image-item');
    let visibleCount = 0;

    imageItems.forEach(item => {
      if (currentCategory === 'all' || item.getAttribute('data-category') === currentCategory) {
        item.style.display = 'block';
        visibleCount++;
      } else {
        item.style.display = 'none';
      }
    });

    emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
  }
});