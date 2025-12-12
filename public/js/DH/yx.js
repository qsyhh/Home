const yxConfig = {
    LeagueOfLegends: {
        name: "英雄联盟",
        logo: "https://lol.qq.com/favicon.ico",
        introduce: "全球顶级MOBA竞技游戏，5V5对战模式，丰富英雄池",
        URL: "https://lol.qq.com/"
    },
    Minecraft: {
        name: "我的世界",
        logo: "./images/minecraft.png",
        introduce: "沙盒建造游戏，支持创意模式自由搭建、生存模式冒险",
        URL: "https://www.minecraft.net/"
    },
    HonorOfKings: {
        name: "王者荣耀",
        logo: "https://pvp.qq.com/favicon.ico",
        introduce: "移动端MOBA游戏，15分钟一局快节奏对战",
        URL: "https://pvp.qq.com/"
    },
    StardewValley: {
        name: "星露谷物语",
        logo: "https://www.stardewvalley.net/favicon.ico",
        introduce: "治愈系农场模拟游戏，种植作物、养殖动物、结交村民",
        URL: "https://www.stardewvalley.net/"
    },
    CS2: {
        name: "CS2",
        logo: "https://store.steampowered.com/favicon.ico",
        introduce: "经典射击竞技游戏续作，高清画质+精准弹道",
        URL: "https://store.steampowered.com/app/730/CounterStrike_2/"
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