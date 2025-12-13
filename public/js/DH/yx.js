const yxConfig = {
    Minecraft: {
        name: "我的世界(网易)",
        logo: "https://webinput.nie.netease.com/img/mc/icon.png",
        introduce: "沙盒建造游戏，支持创意模式自由搭建、生存模式冒险",
        URL: "https://mc.163.com/"
    },
    GenshinImpact: {
        name: "原神",
        logo: "https://img.tapimg.com/market/images/4c441769b5fb3b670c8b59a6124d9ff2.png/appicon?t=1",
        introduce: "开放世界冒险游戏，奇幻世界观+元素反应战斗",
        URL: "https://ys.mihoyo.com/"
    },
    Mingchao: {
        name: "鸣潮",
        logo: "https://img.tapimg.com/market/images/5161672da2d085ca8d9551ae054fad92.png/appicon_m?t=1",
        introduce: "库洛游戏开发的开放世界动作RPG，拥有流畅战斗系统与奇幻世界观",
        URL: "https://mc.kurogames.com/main"
    },
    PCL2: {
        name: "PCL2",
        logo: "https://pcl.ruanmao.net/pcl.webp",
        introduce: "《我的世界》第三方多功能启动器，支持模组管理、版本切换、资源下载",
        URL: "https://github.com/Meloong-Git/PCL/releases"
    },
    Starward: {
        name: "Starward.exe",
        logo: "https://donate.scighost.com/starward.png",
        introduce: "米哈游游戏第三方启动/辅助工具（非官方），支持多账号管理、游戏资源优化",
        URL: "https://github.com/Scighost/Starward/releases"
    },
    BetterGlexe: {
        name: "BetterGI",
        logo: "https://img.alicdn.com/imgextra/i3/2042484851/O1CN01BafDLu1lhoP3xOqGQ_!!2042484851.png",
        introduce: "《原神》第三方辅助工具（非官方），提供游戏数据统计、祈愿记录、角色规划等功能",
        URL: "https://bettergi.com/"
    },
    WattToolkit: {
        name: "Watt Toolkit",
        logo: "https://steampp.net/svg/logo.png",
        introduce: "原「蒸汽动力」，专业游戏平台网络加速工具，支持Steam、Epic等平台连接优化",
        URL: "https://steampp.net/"
    },
    Steam: {
        name: "Steam",
        logo: "https://store.steampowered.com/favicon.ico",
        introduce: "Valve推出的全球知名游戏平台，支持游戏购买、下载、更新、社区互动",
        URL: "https://store.steampowered.com/"
    },
};

function renderYXContent() {
    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = '';
    Object.values(yxConfig).forEach(app => contentArea.appendChild(createAppCard(app)));
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.nav-btn.active').dataset.tab === 'yx') {
        renderYXContent();
        setTimeout(() => {
            document.getElementById('loadingMask').style.opacity = 0;
            setTimeout(() => document.getElementById('loadingMask').style.display = 'none', 500);
        }, 300);
    }
});