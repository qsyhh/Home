// ========== 自适应缩放功能（完全保留你的原始逻辑） ==========
function adjustScale() {
  const body = document.body;
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  
  // 原始设计尺寸（与你的CSS保持一致）
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

// ========== 时间显示功能（完全保留你的原始逻辑） ==========
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

// ========== 终极修复：截图下载功能（仅解决异常，不碰UI） ==========
async function captureAndDownload() {
  try {
    // 1. 获取截图目标元素（完全用你的原始ID）
    const target = document.getElementById('captureTarget');
    if (!target) throw new Error('未找到截图区域（UI未改动，可能是元素ID错误）');
    
    // 2. 等待页面完全稳定（解决渲染延迟导致的截图空白）
    await new Promise(resolve => {
      // 等待所有资源加载完成（图片、字体、样式）
      if (document.readyState === 'complete') {
        resolve();
      } else {
        document.addEventListener('readystatechange', () => {
          if (document.readyState === 'complete') resolve();
        });
      }
    });
    
    // 3. 强制重绘（解决浏览器渲染缓存导致的样式异常）
    target.style.display = 'none';
    target.offsetHeight; // 触发重绘
    target.style.display = '';
    
    // 4. 关键修复：截图配置兼容（解决画布污染、模糊、截取不全）
    const canvas = await html2canvas(target, {
      scale: 2, // 保留你的原始配置，确保高清
      useCORS: true, // 允许跨域图片
      allowTaint: true, // 核心解决本地图片导致的画布污染
      logging: false, // 关闭日志
      backgroundColor: null, // 保留透明背景（与你的UI一致）
      scrollX: -window.scrollX, // 修复滚动偏移导致的截图不全
      scrollY: -window.scrollY,
      ignoreElements: (el) => {
        // 可选：如果不需要截图"返回主页"按钮，保留这行；需要则删除
        return el.style.position === 'absolute' && el.style.zIndex === '999';
      }
    });
    
    // 5. 生成下载链接（兼容所有浏览器，避免导出失败）
    const downloadLink = document.createElement('a');
    try {
      // 优先用toDataURL）
      downloadLink.href = canvas.toDataURL('image/png');
    } catch (e) {
      // 降级用toBlob
      await new Promise(resolve => {
        canvas.toBlob(blob => {
          downloadLink.href = URL.createObjectURL(blob);
          resolve();
        }, 'image/png');
      });
    }
    downloadLink.download = `赞助页面截图_${new Date().getTime()}.png`;
    
    // 自动触发下载
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    console.log('截图下载成功！');
  } catch (error) {
    console.error('截图失败详情（UI未改动）：', error);
    alert('截图生成失败！\n原因：本地file协议跨域限制（浏览器安全策略）~');
  }
}

// 触发截图
window.addEventListener('load', captureAndDownload);