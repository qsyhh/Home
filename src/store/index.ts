import { defineStore } from "pinia";

export const mainStore = defineStore("main", {
  // 这些变量，非有能力的开发者请只操作【开关】项来实现个性化的默认设置，其余变量勿动！
  state: () => ({
    imgLoadStatus: false, // 【状态】壁纸加载状态
    innerWidth: null as number | null, // 【状态】当前窗口宽度
    coverType: 0 as number, // 【开关】壁纸种类
    sBGCount: null as string | null, // 【状态】使用内置壁纸时用于临时指定壁纸的接口
    seasonalEffects: true, // 【开关】季节特效
    siteStartShow: true, // 【开关】建站日期显示
    musicClick: true, // 【开关】音乐链接是否跳转
    musicIsOk: false, // 【状态】音乐是否加载完成
    musicVolume: 0.7 as number, // 【开关】音乐音量
    musicOpenState: false, // 【状态】音乐面板开启状态
    backgroundShow: false, // 【状态】壁纸展示状态
    boxOpenState: false, // 【状态】盒子开启状态
    mobileOpenState: false, // 【状态】移动端开启状态
    mobileFuncState: false, // 【状态】移动端功能区开启状态
    setOpenState: false, // 【状态】设置页面开启状态
    setV: false, // 【状态】开发者模式
    playerState: false, // 【状态】当前播放状态
    playerCanplay: false, // 【状态】当前音乐是否完成加载
    playerTitle: null as string | null, // 【缓存】当前播放歌曲名
    playerArtist: null as string | null, // 【缓存】当前播放歌手名
    playerAlbum: null as string | null, // 【缓存】当前播放专辑名
    playerLrc: [[true, "歌词加载中"]], // 【缓存】当前播放歌词
    playerLrcShow: true, // 【开关】是否显示底栏歌词
    footerBlur: true, // 【开关】底栏模糊
    footerProgressBar: true, // 【开关】是否显示底栏进度条
    playerAutoplay: true, // 【开关】是否自动播放
    playerLoop: "all", // 【开关】循环播放 "all", "one", "none"
    playerOrder: "random", // 【开关】循环顺序 "list", "random"
    webSpeech: true, // 【开关】网页语音交互总开关（包含播报歌名功能）
    playerSpeechName: true, // 【开关】播报歌名
    playerDWRCShow: true, // 【开关】逐字歌词解析总开关
    playerDWRCShowPro: true, // 【开关】逐字效果增强开关
    playerDWRCATDB: true, // 【开关】允许接入 AMLL TTML Database
    playerDWRCATDBF: false, // 【开关】接入 AMLL TTML Database 时使用镜像加速
    playerCurrentTime: null as number | null, // 【缓存】当前歌曲已播放时间
    playerDuration: null as number | null, // 【缓存】当前歌曲总时长
    dwrcIndex: -1 as number | null, // 【缓存】逐字歌词进度存储
    dwrcTemp: [] as any[], // 【缓存】逐字歌词
    dwrcEnable: true, // 【状态】调用逐字歌词
    dwrcLoading: false, // 【状态】逐字歌词加载
    forceShowBarIcon: false, // 【开关】进度图标常驻
    showFirefly: false, // 【状态】萤火虫特效
    showSnowfall: false, // 【状态】雪花特效
    showLantern: false, // 【状态】灯笼特效
  }),
  getters: {
    // 获取歌词
    getPlayerLrc(state) {
      return state.playerLrc;
    },
    // 获取歌曲信息
    getPlayerData(state) {
      return {
        name: state.playerTitle,
        artist: state.playerArtist,
        album: state.playerAlbum,
      };
    },
    // 获取页面宽度
    getInnerWidth(state) {
      return state.innerWidth;
    },
  },
  actions: {
    // 更改当前页面宽度
    setInnerWidth(value) {
      this.innerWidth = value;
      if (value >= 720) {
        this.mobileOpenState = false;
        this.mobileFuncState = false;
      }
    },
    // 更改播放状态
    setPlayerState(value) {
      if (value) {
        this.playerState = false;
      } else {
        this.playerState = true;
      }
    },
    // 更改音乐加载状态
    setPlayerCanplay(value) {
      this.playerCanplay = value;
    },
    // 更改歌词
    setPlayerLrc(value) {
      this.playerLrc = value;
    },
    // 更改歌曲数据
    setPlayerData(title, artist) {
      this.playerTitle = title;
      this.playerArtist = artist;
    },
    // 更改壁纸加载状态
    setImgLoadStatus(value) {
      this.imgLoadStatus = value;
    },
    // 使用内置壁纸时用于临时指定壁纸的接口
    setSBGCount(value) {
      if (this.coverType == 0) {
        this.sBGCount = value;
      } else {
        return 'not use';
      };
    },
  },
  persist: [
    // 未存在这里的变量，刷新页面就会恢复默认值，主要用于状态
    {
      storage: localStorage,
      pick: [
        // 持久性存储，这里的变量永久存储于浏览器，用于存储用户的自定义设置
        'coverType',
        'musicVolume',
        'siteStartShow',
        'musicClick',
        'playerLrcShow',
        'footerBlur',
        'footerProgressBar',
        'playerAutoplay',
        'playerLoop',
        'playerOrder',
        'webSpeech',
        'playerSpeechName',
        'playerDWRCShow',
        'playerDWRCShowPro',
        'playerDWRCATDB',
        'playerDWRCATDBF',
        'seasonalEffects',
      ],
    },
    {
      storage: sessionStorage,
      pick: [
        // 会话性存储，这里的变量在重新打开页面时恢复默认值，多个窗口不互通，用于存储一些特殊的仅本次生效的设置
        'setV',
      ],
    },
  ],
});
