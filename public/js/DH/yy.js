const yyConfig = {
    WeChat: {
        name: "微信",
        logo: "https://res.wx.qq.com/a/wx_fed/assets/res/NTI4MWU5.ico",
        introduce: "国民级社交应用，集成聊天、支付、小程序、公众号",
        URL: "https://weixin.qq.com/"
    },
    Chrome: {
        name: "Chrome",
        logo: "https://www.google.com/favicon.ico",
        introduce: "谷歌推出的高速浏览器，支持扩展插件、同步功能",
        URL: "https://www.google.com/chrome/"
    },
    VSCode: {
        name: "VS Code",
        logo: "https://code.visualstudio.com/favicon.ico",
        introduce: "轻量强大的代码编辑器，支持语法高亮、调试、Git集成",
        URL: "https://code.visualstudio.com/download"
    },
    WPS: {
        name: "WPS办公",
        logo: "https://www.wps.cn/favicon.ico",
        introduce: "免费办公套件，兼容Office格式，支持文档、表格、演示",
        URL: "https://www.wps.cn/"
    },
    Thunder: {
        name: "迅雷",
        logo: "https://www.xunlei.com/favicon.ico",
        introduce: "高速下载工具，支持磁力链接、种子下载、多线程加速",
        URL: "https://www.xunlei.com/"
    },
    QQ: {
        name: "QQ",
        logo: "https://static.cdnlogo.com/logos/t/62/tencent-qq.svg",
        introduce: "经典社交软件，支持多人聊天、文件传输、QQ空间",
        URL: "https://im.qq.com/"
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