const yxConfig = {
    Minecraft: {
        name: "我的世界",
        logo: "https://mc.163.com/favicon.ico",
        introduce: "沙盒建造游戏，支持创意模式自由搭建、生存模式冒险",
        URL: "https://www.minecraft.net/"
    },
    HonorOfKings: {
        name: "王者荣耀",
        logo: "https://pvp.qq.com/favicon.ico",
        introduce: "移动端MOBA游戏，15分钟一局快节奏对战",
        URL: "https://pvp.qq.com/"
    },
    GenshinImpact: {
        name: "原神",
        logo: "https://ys.mihoyo.com/favicon.ico",
        introduce: "开放世界冒险游戏，奇幻世界观+元素反应战斗",
        URL: "https://ys.mihoyo.com/"
    }
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