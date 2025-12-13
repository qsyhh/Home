// ========== 自适应缩放功能 ==========
function adjustScale() {
  const body = document.body;
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  
  // 原始设计尺寸（与CSS保持一致）
  const designWidth = 600;
  const designHeight = 350;
  
  // 计算缩放比例（取最小比例，确保内容完全显示）
  const scaleX = windowWidth / designWidth;
  const scaleY = windowHeight / designHeight;
  const scale = Math.min(scaleX, scaleY);
  
  // 应用缩放
  body.style.transform = `scale(${scale})`;
}

// 初始缩放 + 窗口 resize 时重新缩放
adjustScale();
window.addEventListener('resize', adjustScale);

// ========== 时间显示功能 ==========
function formatNumber(num) {
  // 数字补零（单数前面加0）
  return num.toString().length === 1 ? `0${num}` : num;
}

function updateTime() {
  const timeDisplay = document.getElementById('timeDisplay');
  const currentDate = new Date();
  
  // 格式化时间
  const year = formatNumber(currentDate.getFullYear());
  const month = formatNumber(currentDate.getMonth() + 1);
  const day = formatNumber(currentDate.getDate());
  const hours = formatNumber(currentDate.getHours());
  const minutes = formatNumber(currentDate.getMinutes());
  const seconds = formatNumber(currentDate.getSeconds());
  
  // 显示时间
  timeDisplay.textContent = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 初始化时间 + 每秒更新
updateTime();
setInterval(updateTime, 1000);

// ========== 自动截图下载功能 ==========
async function captureAndDownload() {
  try {
    // 1. 获取截图目标元素
    const target = document.getElementById('captureTarget');
    
    // 2. 等待页面完全渲染（确保图片、字体加载完成）
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 3. 生成高清截图（保持你原来的配置）
    const canvas = await html2canvas(target, {
      scale: 2, // 2倍高清，避免模糊
      useCORS: true, // 允许跨域图片
      logging: false, // 关闭控制台日志
      backgroundColor: null // 保持背景透明
    });
    
    // 4. 生成下载链接
    const downloadLink = document.createElement('a');
    downloadLink.href = canvas.toDataURL('image/png'); // 生成PNG图片
    downloadLink.download = `赞助页面截图_${new Date().getTime()}.png`; // 文件名带时间戳
    
    // 5. 自动触发下载
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    console.log('截图下载成功！');
  } catch (error) {
    console.error('截图失败：', error);
    alert('截图生成失败，请刷新页面重试~');
  }
}

// 页面加载完成后自动执行截图下载
window.addEventListener('load', captureAndDownload);