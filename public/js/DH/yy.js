const yyConfig = {
    WeChat: {
        name: "微信",
        logo: "https://res.wx.qq.com/a/wx_fed/assets/res/NTI4MWU5.ico",
        introduce: "国民级社交应用，集成即时聊天、移动支付、小程序生态、公众号等核心功能",
        URL: "https://weixin.qq.com/"
    },
    Chrome: {
        name: "Chrome",
        logo: "https://www.google.com/favicon.ico",
        introduce: "谷歌推出的高速浏览器，支持丰富扩展插件、多设备数据同步、隐私保护功能",
        URL: "https://www.google.com/chrome/"
    },
    VSCode: {
        name: "VS Code",
        logo: "https://code.visualstudio.com/favicon.ico",
        introduce: "轻量且强大的代码编辑器，支持语法高亮、断点调试、Git版本控制集成、插件扩展",
        URL: "https://code.visualstudio.com/download"
    },
    WPS: {
        name: "WPS办公",
        logo: "https://www.wps.cn/favicon.ico",
        introduce: "免费全能办公套件，完美兼容Office格式，涵盖文档编辑、表格分析、演示文稿制作",
        URL: "https://www.wps.cn/"
    },
    Thunder: {
        name: "迅雷",
        logo: "https://www.xunlei.com/favicon.ico",
        introduce: "经典高速下载工具，支持磁力链接、种子文件下载、多线程加速、离线下载",
        URL: "https://www.xunlei.com/"
    },
    QQ: {
        name: "QQ",
        logo: "https://static.cdnlogo.com/logos/t/62/tencent-qq.svg",
        introduce: "经典国民社交软件，支持多人聊天、大文件传输、QQ空间、在线支付等功能",
        URL: "https://im.qq.com/"
    },
    Bilibili: {
        name: "哔哩哔哩",
        logo: "https://www.bilibili.com/favicon.ico",
        introduce: "年轻人喜爱的文化社区与视频平台，涵盖番剧、影视、UP主原创内容、直播等",
        URL: "https://www.bilibili.com/"
    },
    TeamViewer: {
        name: "TeamViewer",
        logo: "https://www.teamviewer.com/favicon.ico",
        introduce: "跨平台远程控制工具，支持异地设备远程协助、文件传输、在线会议等功能",
        URL: "https://www.teamviewer.com/zhCN/"
    },
    BBDownload: {
        name: "BBDownload",
        logo: "https://ts1.tc.mm.bing.net/th/id/OIP-C.iUO3IqCqeut4Y8G-8ToYZgAAAA?w=211&h=211&c=8&rs=1&qlt=90&o=6&cb=ucfimg1&dpr=1.3&pid=3.1&rm=2&ucfimg=1",
        introduce: "哔哩哔哩视频下载工具，支持高清视频、弹幕批量下载，保留原始画质",
        URL: "https://github.com/nilaoda/BBDown/releases"
    },
    SakuraCat: {
        name: "SakuraCat",
        logo: "https://sakuracat.com/cat.png",
        introduce: "高速稳定的网络加速服务，支持多节点切换，保障网络连接流畅",
        URL: "https://sakuracat.com/"
    },
    OpenSpeed: {
        name: "OpenSpeed",
        logo: "https://ts1.tc.mm.bing.net/th/id/OIP-C.iUO3IqCqeut4Y8G-8ToYZgAAAA?w=211&h=211&c=8&rs=1&qlt=90&o=6&cb=ucfimg1&dpr=1.3&pid=3.1&rm=2&ucfimg=1",
        introduce: "开源游戏变速器工具，支持游戏运行速度调节，适配多款单机与网络游戏",
        URL: "https://github.com/game1024/Speedy/releases"
    },
    XiangriyaoRemote: {
        name: "向日葵远程控制",
        logo: "https://sunlogin.oray.com/favicon.ico",
        introduce: "国产老牌远程控制工具，支持手机/电脑多设备互控、文件传输、远程开机",
        URL: "https://sunlogin.oray.com/"
    },
    GhostDownloader: {
        name: "Ghost Downloader",
        logo: "https://www.gd3.top/logo.png",
        introduce: "多功能资源下载工具，支持多种协议，适配各类网络资源下载需求",
        URL: "https://github.com/XiaoYouChR/Ghost-Downloader-3/releases"
    },
    AstroBox: {
        name: "AstroBox",
        logo: "https://astrobox.online/_astro/favicon.BT3CnBim_1X3xi2.svg",
        introduce: "小米手环开源第三方工具，支持安装自定义表盘、应用与功能扩展",
        URL: "https://astrobox.online/"
    },
    OBSStudio: {
        name: "OBS Studio",
        logo: "https://obsproject.com/favicon.ico",
        introduce: "开源免费的直播/录屏软件，支持多场景切换、自定义推流、画质参数调节",
        URL: "https://obsproject.com/"
    },
    BaiduNetdisk: {
        name: "百度网盘",
        logo: "https://nd-static.bdstatic.com/m-static/v20-main/home/img/icon-home-new.b4083345.png",
        introduce: "国内常用云存储工具，支持大文件备份、分享、离线下载、多端同步",
        URL: "https://pan.baidu.com/"
    },
    XTerminal: {
        name: "XTerminal",
        logo: "https://docs.xterminal.cn/img/logo.png",
        introduce: "强大的SSH远程连接工具，同时支持本地控制台管理，界面简洁功能丰富",
        URL: "https://www.xterminal.cn/"
    },
    Telegram: {
        name: "Telegram",
        logo: "https://telegram.org/favicon.ico",
        introduce: "跨平台加密即时通讯工具，支持频道订阅、机器人、大文件传输、隐私保护",
        URL: "https://telegram.org/"
    }
};

function renderYYContent() {
    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = '';
    Object.values(yyConfig).forEach(app => contentArea.appendChild(createAppCard(app)));
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.nav-btn.active').dataset.tab === 'yy') {
        renderYYContent();
        setTimeout(() => {
            document.getElementById('loadingMask').style.opacity = 0;
            setTimeout(() => document.getElementById('loadingMask').style.display = 'none', 500);
        }, 300);
    }
});