const zyConfig = {
    Bilibili: {
        name: "哔哩哔哩",
        logo: "https://www.bilibili.com/favicon.ico",
        introduce: "年轻人的文化社区，涵盖动画、游戏、知识、生活等多元内容",
        URL: "https://www.bilibili.com/"
    },
    BaiduNetDisk: {
        name: "百度网盘",
        logo: "	https://nd-static.bdstatic.com/m-static/v20-main/home/img/icon-home-new.b4083345.png",
        introduce: "国内领先的云存储服务，支持大文件备份、分享、离线下载",
        URL: "https://pan.baidu.com/"
    },
    Zhihu: {
        name: "知乎",
        logo: "https://static.zhihu.com/heifetz/favicon.ico",
        introduce: "高质量问答社区，汇聚行业专家，提供专业、深度的知识分享",
        URL: "https://www.zhihu.com/"
    },
    Douban: {
        name: "豆瓣",
        logo: "https://www.douban.com/favicon.ico",
        introduce: "文艺青年聚集地，电影书籍评分、小组讨论、同城活动",
        URL: "https://www.douban.com/"
    },
    GitHub: {
        name: "GitHub",
        logo: "https://github.githubassets.com/favicon.ico",
        introduce: "全球最大的代码托管平台，开源项目聚集地",
        URL: "https://github.com/"
    },
    NetEaseCloudMusic: {
        name: "网易云音乐",
        logo: "https://music.163.com/favicon.ico",
        introduce: "音乐分享平台，精准算法推荐+乐评文化，发现小众好音乐",
        URL: "https://music.163.com/"
    }
};

function renderZYContent() {
    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = '';
    Object.values(zyConfig).forEach(app => contentArea.appendChild(createAppCard(app)));
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.nav-btn.active').dataset.tab === 'zy') {
        renderZYContent();
        setTimeout(() => {
            document.getElementById('loadingMask').style.opacity = 0;
            setTimeout(() => document.getElementById('loadingMask').style.display = 'none', 500);
        }, 300);
    }
});