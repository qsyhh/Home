const hjConfig = {
    NodeJS: {
        name: "NodeJS",
        logo: "./images/nodejs.png",
        introduce: "基于JavaScript的后端运行环境，非阻塞I/O模型，适合构建高性能网络应用",
        URL: "https://nodejs.org/"
    },
    Python: {
        name: "Python",
        logo: "./images/python.png",
        introduce: "简洁优雅的解释型语言，丰富第三方库，适用于AI、爬虫、数据分析",
        URL: "https://www.python.org/"
    },
    Go: {
        name: "Go语言",
        logo: "https://golang.org/lib/godoc/images/go-logo-blue.svg",
        introduce: "谷歌开发静态强类型语言，兼顾性能与开发效率，适合云原生、微服务",
        URL: "https://golang.org/"
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
    Redis: {
        name: "Redis",
        logo: "https://redis.io/images/redis-logo-red.png",
        introduce: "高性能键值对数据库，支持缓存、消息队列、分布式锁",
        URL: "https://redis.io/download/"
    },
    MongoDB: {
        name: "MongoDB",
        logo: "https://webassets.mongodb.com/_com_assets/cms/mongodb-logo-rgb-j6w271g1xn.jpg",
        introduce: "非关系型文档数据库，灵活存储JSON格式数据，适合大数据",
        URL: "https://www.mongodb.com/try/download/community"
    },
    PostgreSQL: {
        name: "PostgreSQL",
        logo: "https://www.postgresql.org/media/img/favicon.ico",
        introduce: "开源高级关系型数据库，支持复杂查询、JSON存储",
        URL: "https://www.postgresql.org/download/"
    },
    SQLServer: {
        name: "SQL Server",
        logo: "https://www.microsoft.com/favicon.ico",
        introduce: "微软企业级关系型数据库，支持高并发、数据仓库",
        URL: "https://www.microsoft.com/en-us/sql-server/sql-server-downloads"
    },
    SQLite: {
        name: "SQLite",
        logo: "https://www.sqlite.org/favicon.ico",
        introduce: "嵌入式关系型数据库，无需服务端，轻量高效",
        URL: "https://www.sqlite.org/download.html"
    },
    Docker: {
        name: "Docker",
        logo: "https://www.docker.com/sites/default/files/d8/2019-07/Moby-logo.png",
        introduce: "开源应用容器引擎，打包应用和依赖，实现跨平台部署",
        URL: "https://www.docker.com/products/docker-desktop/"
    },
    Nginx: {
        name: "Nginx",
        logo: "https://nginx.org/nginx.png",
        introduce: "高性能HTTP服务器/反向代理，支持负载均衡、动静分离",
        URL: "https://nginx.org/en/download.html"
    },
    Apache: {
        name: "Apache",
        logo: "https://httpd.apache.org/icons/apache_pb2.png",
        introduce: "经典开源HTTP服务器，稳定可靠、配置灵活",
        URL: "https://httpd.apache.org/download.cgi"
    },
    Kubernetes: {
        name: "Kubernetes(K8s)",
        logo: "https://kubernetes.io/images/favicon.png",
        introduce: "容器编排平台，自动化部署、扩展和管理容器化应用",
        URL: "https://kubernetes.io/docs/tasks/tools/"
    },
    Nacos: {
        name: "Nacos",
        logo: "https://nacos.io/img/nacos_logo.png",
        introduce: "阿里巴巴开源的服务发现、配置管理平台",
        URL: "https://nacos.io/zh-cn/docs/quick-start.html"
    },
    Git: {
        name: "Git",
        logo: "https://git-scm.com/images/logo@2x.png",
        introduce: "分布式版本控制系统，团队协作必备工具",
        URL: "https://git-scm.com/"
    },
    VSCode: {
        name: "VS Code",
        logo: "https://code.visualstudio.com/favicon.ico",
        introduce: "轻量强大的代码编辑器，插件生态丰富",
        URL: "https://code.visualstudio.com/download"
    },
    IntelliJIDEA: {
        name: "IntelliJ IDEA",
        logo: "https://www.jetbrains.com/idea/favicon.ico",
        introduce: "JetBrains旗舰IDE，智能提示、重构功能强大",
        URL: "https://www.jetbrains.com/idea/download/"
    },
    Postman: {
        name: "Postman",
        logo: "https://voyager.postman.com/image/upload/v1669541413/postman-website-images/home/logo/postman-logo-icon-orange.svg",
        introduce: "API开发测试工具，支持接口调试、自动化测试",
        URL: "https://www.postman.com/downloads/"
    },
    Insomnia: {
        name: "Insomnia",
        logo: "https://insomnia.rest/images/favicon.ico",
        introduce: "开源API调试工具，界面简洁、支持多环境配置",
        URL: "https://insomnia.rest/download"
    },
    Jenkins: {
        name: "Jenkins",
        logo: "https://www.jenkins.io/images/favicon.ico",
        introduce: "开源持续集成/持续部署（CI/CD）工具",
        URL: "https://www.jenkins.io/download/"
    },
    Maven: {
        name: "Maven",
        logo: "https://maven.apache.org/images/maven-logo-black-on-white.png",
        introduce: "Java项目构建工具，统一依赖管理",
        URL: "https://maven.apache.org/download.cgi"
    },
    Gradle: {
        name: "Gradle",
        logo: "https://gradle.org/favicon.ico",
        introduce: "新一代构建工具，结合Maven和Ant优势",
        URL: "https://gradle.org/install/"
    },
    SonarQube: {
        name: "SonarQube",
        logo: "https://www.sonarqube.org/favicon.ico",
        introduce: "代码质量检测工具，识别漏洞、冗余代码",
        URL: "https://www.sonarqube.org/downloads/"
    },
    JMeter: {
        name: "JMeter",
        logo: "https://jmeter.apache.org/images/jmeter_square.png",
        introduce: "Apache开源性能测试工具，模拟高并发场景",
        URL: "https://jmeter.apache.org/download_jmeter.cgi"
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