const IMAGE_API_URL = "https://t.alcy.cc/pc";

// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
  // 确保数据已加载
  if (!window.sponsorsData) {
    console.error('赞助者数据未加载，请检查LB2.js是否正确引入');
    return;
  }
  
  // 初始化图片背景
  initImageBackground();
  
  // 渲染赞助者列表（使用LB2.js中的数据）
  renderSponsors(window.sponsorsData);
  
  // 更新统计数据
  updateStats(window.sponsorsData);
  
  // 设置当前年份
  document.getElementById('current-year').textContent = new Date().getFullYear();
  
  // 初始化筛选按钮
  initFilterButtons();
});

// 初始化图片背景（使用图片API）
function initImageBackground() {
  const backgroundContainer = document.getElementById('image-background');
  const loadingIndicator = document.querySelector('.image-loading');
  
  // 创建图片对象预加载
  const img = new Image();
  img.src = IMAGE_API_URL; // 使用配置的图片API地址
  
  // 图片加载完成后显示
  img.onload = function() {
    // 设置背景图
    backgroundContainer.style.backgroundImage = `url('${IMAGE_API_URL}')`;
    // 隐藏加载状态
    loadingIndicator.style.display = 'none';
  };
  
  // 图片加载失败处理
  img.onerror = function() {
    loadingIndicator.innerHTML = '<i class="fas fa-exclamation-triangle"></i><p>图片加载失败</p>';
    //  fallback - 使用默认背景色
    backgroundContainer.style.backgroundColor = '#f0f0f0';
  };
}

// 渲染赞助者列表
function renderSponsors(sponsorList) {
  const listContainer = document.getElementById('sponsor-list');
  listContainer.innerHTML = ''; // 清空列表
  
  // 如果没有数据
  if (sponsorList.length === 0) {
    listContainer.innerHTML = '<p class="no-data">没有找到符合条件的赞助记录</p>';
    return;
  }
  
  // 按日期排序（最新的在前）
  const sortedList = [...sponsorList].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // 生成赞助项
  sortedList.forEach(sponsor => {
    const sponsorItem = document.createElement('div');
    sponsorItem.className = 'sponsor-item';
    sponsorItem.setAttribute('data-date', sponsor.date);
    
    sponsorItem.innerHTML = `
      <div class="sponsor-name">${sponsor.name}</div>
      <div class="sponsor-amount">¥${sponsor.amount}</div>
      <div class="sponsor-date">${formatDate(sponsor.date)}</div>
    `;
    
    listContainer.appendChild(sponsorItem);
  });
}

// 更新统计数据
function updateStats(sponsorList) {
  // 计算总金额
  const totalAmount = sponsorList.reduce((sum, sponsor) => sum + sponsor.amount, 0);
  // 计算总人数
  const totalPeople = sponsorList.length;
  // 获取最近更新日期
  const sortedDates = [...sponsorList].sort((a, b) => new Date(b.date) - new Date(a.date));
  const recentUpdate = sortedDates.length > 0 ? formatDate(sortedDates[0].date) : '--';
  
  // 更新DOM
  document.getElementById('total-amount').textContent = `¥${totalAmount}`;
  document.getElementById('total-people').textContent = totalPeople;
  document.getElementById('recent-update').textContent = recentUpdate;
}

// 初始化筛选按钮
function initFilterButtons() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // 更新按钮状态
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      const filter = this.getAttribute('data-filter');
      let filteredSponsors = [...window.sponsorsData];
      
      // 根据筛选条件过滤
      switch(filter) {
        case 'month':
          const currentMonth = new Date().getMonth();
          const currentYear = new Date().getFullYear();
          filteredSponsors = window.sponsorsData.filter(sponsor => {
            const date = new Date(sponsor.date);
            return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
          });
          break;
        case 'year':
          const year = new Date().getFullYear();
          filteredSponsors = window.sponsorsData.filter(sponsor => {
            const date = new Date(sponsor.date);
            return date.getFullYear() === year;
          });
          break;
        default:
          filteredSponsors = [...window.sponsorsData];
      }
      
      // 重新渲染列表
      renderSponsors(filteredSponsors);
    });
  });
}

// 日期格式化工具
function formatDate(dateString) {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}
