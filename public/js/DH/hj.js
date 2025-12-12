const hjConfig = {
    NodeJS: {
        name: "NodeJS",
        logo: "https://nodejs.cn/favicon.ico",
        introduce: "基于JavaScript的后端运行环境，非阻塞I/O模型，适合构建高性能网络应用",
        URL: "https://nodejs.cn/download/"
    },
    Python: {
        name: "Python",
        logo: "https://www.python.org/favicon.ico",
        introduce: "简洁优雅的解释型语言，丰富第三方库，适用于AI、爬虫、数据分析",
        URL: "https://www.python.org/"
    },
    Go: {
        name: "Go语言",
        logo: "https://golang.google.cn/favicon.ico",
        introduce: "谷歌开发静态强类型语言，兼顾性能与开发效率，适合云原生、微服务",
        URL: "https://golang.google.cn/"
    },
    Java: {
        name: "Java",
        logo: "https://www.java.com/favicon.ico",
        introduce: "跨平台面向对象语言，企业级应用首选，适用于大数据、安卓开发",
        URL: "https://www.oracle.com/java/technologies/downloads/"
    },
    CSharp: {
        name: "C#",
        logo: "https://dotnet.microsoft.com/favicon.ico",
        introduce: "微软开发的面向对象语言，搭配.NET框架，适用于Windows应用、游戏开发",
        URL: "https://dotnet.microsoft.com/download/dotnet"
    },
    TypeScript: {
        name: "TypeScript",
        logo: "https://www.typescriptlang.org/favicon-32x32.png",
        introduce: "JavaScript的超集，添加静态类型，提升大型项目可维护性",
        URL: "https://www.typescriptlang.org/"
    },
    MySQL: {
        name: "MySQL",
        logo: "https://www.mysql.com/common/logos/logo-mysql-170x115.png",
        introduce: "开源关系型数据库，性能稳定、轻量易用，广泛应用于Web开发",
        URL: "https://www.mysql.com/downloads/"
    },
    FFmpeg: {
        name: "FFmpeg",
        logo: "https://ffmpeg.org/favicon.ico", 
        introduce: "开源跨平台音视频处理工具，支持格式转换、编解码、剪辑合并等功能",
        URL: "https://ffmpeg.org/download.html" 
    }
};

// 环境模块渲染
function renderHJContent() {
    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = '';
    
    Object.values(hjConfig).forEach(app => {
        const card = createAppCard(app);
        contentArea.appendChild(card);
    });
}

// 公共卡片创建函数（Logo兜底）
function createAppCard(appData) {
    const card = document.createElement('div');
    card.className = 'app-card';
    
    const logoContainer = document.createElement('div');
    logoContainer.className = 'app-logo-container';
    logoContainer.style.backgroundImage = `url('${appData.logo}')`;
    
    // Logo加载失败兜底
    const img = new Image();
    img.src = appData.logo;
    img.onload = () => logoContainer.classList.remove('no-logo');
    img.onerror = () => {
        logoContainer.style.backgroundImage = `url('${publicConfig.fallbackLogo}')`;
        const fallbackImg = new Image();
        fallbackImg.src = publicConfig.fallbackLogo;
        fallbackImg.onerror = () => logoContainer.classList.add('no-logo');
    };

    card.innerHTML = `
        ${logoContainer.outerHTML}
        <div class="app-name">${appData.name}</div>
        <div class="app-desc">${appData.introduce}</div>
        <button class="visit-btn"><i class="fa fa-external-link"></i> 访问官网/下载</button>
    `;

    card.querySelector('.visit-btn').addEventListener('click', () => {
        window.open(appData.URL, '_blank');
    });

    return card;
}

// 初始化渲染
document.addEventListener('DOMContentLoaded', () => {
    const activeTab = document.querySelector('.nav-btn.active').dataset.tab;
    if (activeTab === 'hj') {
        renderHJContent();
        setTimeout(() => {
            document.getElementById('loadingMask').style.opacity = 0;
            setTimeout(() => document.getElementById('loadingMask').style.display = 'none', 500);
        }, 300);
    }
});