// ========== 自适应缩放功能（完全保留原逻辑） ==========
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

// ========== 时间显示功能（完全保留原逻辑） ==========
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

// ========== 修复截图下载功能（不改变UI，仅解决异常） ==========
async function captureAndDownload() {
  try {
    // 1. 获取截图目标元素（保留原ID）
    const target = document.getElementById('captureTarget');
    if (!target) throw new Error('未找到截图区域');
    
    // 2. 等待关键资源加载完成（解决图片未加载就截图的问题）
    // 等待二维码图片加载
    const qrcodeImg = document.querySelector('.box4 img');
    if (qrcodeImg && !qrcodeImg.complete) {
      await new Promise(resolve => {
        qrcodeImg.onload = resolve;
        qrcodeImg.onerror = () => resolve(); // 图片加载失败也继续（避免阻塞）
      });
    }
    
    // 等待自定义字体加载（避免文字未渲染）
    await new Promise(resolve => {
      const font = new FontFace('bbh', 'url("../font/荆南波波黑.ttf")');
      font.load().then(resolve).catch(resolve); // 字体加载失败不影响截图
    });
    
    // 3. 优化截图配置（解决画布污染、模糊、截取不全问题）
    const canvas = await html2canvas(target, {
      scale: window.devicePixelRatio || 2, // 自适应设备像素比，保持高清
      useCORS: true, // 允许跨域图片
      allowTaint: true, // 解决本地/跨域图片导致的画布污染
      logging: false, // 关闭控制台日志
      backgroundColor: null, // 保持背景透明（与原UI一致）
      scrollX: 0, // 固定截图位置，避免偏移
      scrollY: 0,
      windowWidth: target.offsetWidth, // 明确截图宽度（匹配UI容器）
      windowHeight: target.offsetHeight, // 明确截图高度（匹配UI容器）
      ignoreElements: (el) => {
        // 忽略返回主页按钮（如果不需要截图该按钮，可保留；需要则删除这行）
        return el.style.position === 'absolute' && el.style.zIndex === '999';
      }
    });
    
    // 4. 生成下载链接（优化大图片处理，避免导出失败）
    const downloadLink = document.createElement('a');
    // 改用toBlob避免dataURL过长导致的异常
    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = `赞助页面截图_${new Date().getTime()}.png`;
      
      // 自动触发下载
      document.body.appendChild(downloadLink);
      downloadLink.click();
      
      // 清理资源，避免内存占用
      setTimeout(() => {
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(url);
      }, 100);
      
      console.log('截图下载成功！');
    }, 'image/png', 0.9); // PNG格式，0.9质量（平衡清晰度和文件大小）

  } catch (error) {
    console.error('截图失败详情：', error);
    alert('截图生成失败！\nfile协议有跨域限制）\n或刷新页面重试~');
  }
}

// 优化截图触发时机（确保页面完全加载，不影响UI）
if (document.readyState === 'complete') {
  captureAndDownload();
} else {
  window.addEventListener('load', captureAndDownload);
}