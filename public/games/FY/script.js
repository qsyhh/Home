// 游戏配置常量（降低难度版本）
const GAME_CONFIG = {
  FPS: 40,
  JUMP_VELOCITY: -8.5, // 增强跳跃力度（更易上升）
  MAX_FALL_SPEED: 8, // 降低最大下落速度
  GRAVITY: 0.5, // 减小重力（下落更慢）
  PIPE_SPEED: -1.5, // 减慢管道速度（反应时间更长）
  PIPE_GAP_MIN: 150, // 增大管道最小间隙
  PIPE_GAP_MAX: 250, // 增大管道最大间隙
  PIPE_INTERVAL: 350, // 增大管道间隔（生成更稀疏）
  INITIAL_PIPE_OFFSET: 20, // 初始管道位置偏移
  BIRD_START_X_RATIO: 0.2, // 鸟的初始X位置（相对于画布宽度的比例）
};

// 游戏状态枚举
const GameMode = {
  PRESTART: 'prestart',
  RUNNING: 'running',
  OVER: 'over',
  WIN: 'win'
};

// 工具函数
const utils = {
  // 随机数生成
  getRandomBetween(min, max) {
    return Math.random() * (max - min) + min;
  },
  // 角度转弧度
  toRadians(degrees) {
    return degrees * Math.PI / 180;
  },
  // 计算相对字体大小（根据画布宽度）
  getRelativeFontSize(canvasWidth, ratio = 0.05) {
    return Math.max(12, Math.floor(canvasWidth * ratio));
  }
};

/**
 * 精灵类 - 负责游戏元素的绘制和基础物理运动
 */
class Sprite {
  constructor(image = null) {
    this.x = 0;
    this.y = 0;
    this.visible = true;
    this.velocityX = 0;
    this.velocityY = 0;
    this.image = image;
    this.angle = 0; // 旋转角度(度)
    this.flipVertical = false;
    this.flipHorizontal = false;
    this.isFinishLine = false;
    this.scored = false; // 用于管道计分标记
  }

  /**
   * 获取精灵碰撞边界
   */
  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.image?.width || 0,
      height: this.image?.height || 0
    };
  }

  /**
   * 更新精灵位置
   */
  update() {
    this.x += this.velocityX;
    this.y += this.velocityY;
  }

  /**
   * 绘制精灵到画布
   * @param {CanvasRenderingContext2D} ctx - 画布上下文
   */
  draw(ctx) {
    if (!this.visible || !this.image) return;

    ctx.save();
    // 平移到精灵中心
    ctx.translate(
      this.x + this.image.width / 2,
      this.y + this.image.height / 2
    );
    // 应用旋转
    ctx.rotate(utils.toRadians(this.angle));
    // 应用翻转
    if (this.flipVertical) ctx.scale(1, -1);
    if (this.flipHorizontal) ctx.scale(-1, 1);

    // 绘制图片
    ctx.drawImage(
      this.image,
      -this.image.width / 2,
      -this.image.height / 2
    );

    ctx.restore();
  }
}

/**
 * 游戏主类
 */
class FlappyGame {
  constructor(canvasId) {
    // 初始化画布
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      throw new Error('未找到Canvas元素');
    }
    this.ctx = this.canvas.getContext('2d');
    
    // 初始化自适应尺寸
    this.initCanvasSize();
    window.addEventListener('resize', () => this.initCanvasSize());
    
    // 游戏状态
    this.gameMode = GameMode.PRESTART;
    this.lastRunTime = 0;
    this.score = 0;
    this.pipeSpawnCounter = 0;
    this.bottomBarOffset = 0;
    
    // 游戏元素
    this.bird = null;
    this.pipes = [];
    this.images = {
      bird: new Image(),
      pipe: new Image(),
      bottomBar: new Image(),
      finishLine: new Image()
    };

    // 绑定事件处理（全画布可点击）
    this.bindEvents();
  }

  /**
   * 初始化画布尺寸（自适应屏幕，保持4:3比例）
   */
  initCanvasSize() {
    const maxWidth = window.innerWidth * 0.95; // 最大宽度为屏幕95%
    const maxHeight = window.innerHeight * 0.9; // 最大高度为屏幕90%
    const aspectRatio = 4 / 3; // 宽高比4:3

    // 根据屏幕尺寸计算合适的画布大小
    let width = maxWidth;
    let height = width / aspectRatio;

    // 如果高度超过最大允许高度，按高度重新计算
    if (height > maxHeight) {
      height = maxHeight;
      width = height * aspectRatio;
    }

    this.canvas.width = width;
    this.canvas.height = height;

    // 设置canvas样式尺寸（确保显示正确）
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
  }

  /**
   * 绑定用户输入事件（适配触摸和鼠标）
   */
  bindEvents() {
    const handleAction = (event) => {
      switch (this.gameMode) {
        case GameMode.PRESTART:
          this.gameMode = GameMode.RUNNING;
          break;
        case GameMode.RUNNING:
          this.bird.velocityY = GAME_CONFIG.JUMP_VELOCITY;
          break;
        case GameMode.OVER:
        case GameMode.WIN:
          if (Date.now() - this.lastRunTime > 1000) {
            this.resetGame();
          }
          break;
      }
      event.preventDefault();
    };

    // 触摸事件（全画布可触摸）
    this.canvas.addEventListener('touchstart', handleAction);
    // 鼠标事件（全画布可点击）
    this.canvas.addEventListener('mousedown', handleAction);
    // 键盘事件
    document.addEventListener('keydown', (e) => {
      if ([' ', 'ArrowUp', 'Enter'].includes(e.key)) {
        handleAction(e);
      }
    });
  }

  /**
   * 加载游戏资源
   * @returns {Promise} 加载完成Promise
   */
  loadResources() {
    return new Promise((resolve, reject) => {
      const imageSources = {
        bird: 'img/2.png',
        pipe: 'img/3.png',
        bottomBar: 'img/1.png',
        finishLine: 'img/4.png'
      };

      let loadedCount = 0;
      const totalImages = Object.keys(this.images).length;

      const onLoad = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          resolve();
        }
      };

      const onError = (src) => {
        reject(new Error(`图片加载失败: ${src}`));
      };

      // 设置图片源并绑定事件
      Object.entries(imageSources).forEach(([key, src]) => {
        const img = this.images[key];
        img.src = src;
        img.onload = onLoad;
        img.onerror = () => onError(src);
      });
    });
  }

  /**
   * 初始化游戏
   */
  init() {
    // 创建鸟精灵（位置按画布比例计算）
    this.bird = new Sprite(this.images.bird);
    this.bird.x = this.canvas.width * GAME_CONFIG.BIRD_START_X_RATIO;
    this.bird.y = this.canvas.height / 2;

    // 初始化管道
    this.initPipes();

    // 开始游戏循环
    this.gameLoop();
  }

  /**
   * 初始化管道和终点线
   */
  initPipes() {
    this.pipes = [];
    // 生成初始管道（位置按画布比例计算）
    let currentX = this.canvas.width + GAME_CONFIG.INITIAL_PIPE_OFFSET;
    
    // 生成随机管道（数量减少，降低难度）
    for (let i = 0; i < 8; i++) {
      const gapHeight = utils.getRandomBetween(
        GAME_CONFIG.PIPE_GAP_MIN,
        GAME_CONFIG.PIPE_GAP_MAX
      );
      // 管道间隙位置更居中，避免极端位置
      const gapTop = utils.getRandomBetween(
        this.canvas.height * 0.15, // 顶部边界（画布15%高度）
        this.canvas.height - gapHeight - this.canvas.height * 0.25 // 底部边界（画布25%高度）
      );
      
      this.addPipePair(currentX, gapTop, gapHeight);
      currentX += utils.getRandomBetween(
        GAME_CONFIG.PIPE_INTERVAL - 50,
        GAME_CONFIG.PIPE_INTERVAL + 100
      );
    }
    
    // 添加终点线
    this.addFinishLine(currentX + 300);
  }

  /**
   * 添加一对管道
   * @param {number} xPos - X位置
   * @param {number} gapTop - 管道间隙顶部Y坐标
   * @param {number} gapHeight - 管道间隙高度
   */
  addPipePair(xPos, gapTop, gapHeight) {
    // 上管道
    const topPipe = new Sprite(this.images.pipe);
    topPipe.x = xPos;
    topPipe.y = gapTop - this.images.pipe.height;
    topPipe.velocityX = GAME_CONFIG.PIPE_SPEED;
    this.pipes.push(topPipe);

    // 下管道
    const bottomPipe = new Sprite(this.images.pipe);
    bottomPipe.flipVertical = true;
    bottomPipe.x = xPos;
    bottomPipe.y = gapTop + gapHeight;
    bottomPipe.velocityX = GAME_CONFIG.PIPE_SPEED;
    this.pipes.push(bottomPipe);
  }

  /**
   * 添加终点线
   * @param {number} xPos - X位置
   */
  addFinishLine(xPos) {
    const finishLine = new Sprite(this.images.finishLine);
    finishLine.x = xPos;
    finishLine.y = this.canvas.height / 2 - this.images.finishLine.height / 2;
    finishLine.velocityX = GAME_CONFIG.PIPE_SPEED;
    finishLine.isFinishLine = true;
    this.pipes.push(finishLine);
  }

  /**
   * 检测碰撞
   * @param {Sprite} a - 精灵A
   * @param {Sprite} b - 精灵B
   * @returns {boolean} 是否碰撞
   */
  checkCollision(a, b) {
    if (!a.visible || !b.visible || !a.image || !b.image) return false;

    const boundsA = a.getBounds();
    const boundsB = b.getBounds();

    return !(
      boundsA.x + boundsA.width < boundsB.x ||
      boundsA.x > boundsB.x + boundsB.width ||
      boundsA.y + boundsA.height < boundsB.y ||
      boundsA.y > boundsB.y + boundsB.height
    );
  }

  /**
   * 更新鸟的物理状态
   */
  updateBirdPhysics() {
    // 应用重力（降低难度：下落更慢）
    if (this.bird.velocityY < GAME_CONFIG.MAX_FALL_SPEED) {
      this.bird.velocityY += GAME_CONFIG.GRAVITY;
    }

    // 更新鸟的旋转角度
    this.updateBirdTilt();

    // 边界检测（增加底部缓冲：允许稍微超出底部再判定失败）
    const birdBounds = this.bird.getBounds();
    if (birdBounds.y + birdBounds.height > this.canvas.height + 20 || birdBounds.y < -birdBounds.height) {
      this.gameMode = GameMode.OVER;
    }
  }

  /**
   * 更新鸟的倾斜角度
   */
  updateBirdTilt() {
    if (this.bird.velocityY < 0) {
      // 上升时向上倾斜（角度减小，更平缓）
      this.bird.angle = -10;
    } else if (this.bird.angle < 50) {
      // 下落时逐渐向下倾斜（角度减小，更平缓）
      this.bird.angle += 3;
    }
  }

  /**
   * 更新管道状态
   */
  updatePipes() {
    // 更新所有管道位置
    this.pipes.forEach(pipe => pipe.update());
    
    // 移除超出屏幕的管道
    this.pipes = this.pipes.filter(pipe => 
      pipe.x + pipe.image.width > 0
    );

    // 检测得分
    this.checkScoring();
  }

  /**
   * 检测得分情况
   */
  checkScoring() {
    this.pipes.forEach(pipe => {
      if (
        !pipe.isFinishLine && 
        !pipe.scored && 
        pipe.x + pipe.image.width < this.bird.x
      ) {
        this.score++;
        pipe.scored = true; // 标记为已计分
      }
    });
  }

  /**
   * 检测游戏状态（胜利/失败）
   */
  checkGameStatus() {
    for (const pipe of this.pipes) {
      if (this.checkCollision(this.bird, pipe)) {
        this.gameMode = pipe.isFinishLine ? GameMode.WIN : GameMode.OVER;
        this.lastRunTime = Date.now();
        return;
      }
    }
  }

  /**
   * 绘制底部滚动条（自适应画布尺寸）
   */
  drawBottomBar() {
    const bar = this.images.bottomBar;
    if (!bar.complete) return;

    // 滚动逻辑
    this.bottomBarOffset += GAME_CONFIG.PIPE_SPEED;
    if (this.bottomBarOffset < -bar.width) {
      this.bottomBarOffset = 0;
    }

    // 绘制底部条（无缝滚动，适配画布高度）
    const barHeight = Math.min(bar.height, this.canvas.height * 0.15); // 底部条高度不超过画布15%
    this.ctx.drawImage(
      bar, 
      this.bottomBarOffset, 
      this.canvas.height - barHeight,
      bar.width,
      barHeight
    );
    this.ctx.drawImage(
      bar, 
      this.bottomBarOffset + bar.width, 
      this.canvas.height - barHeight,
      bar.width,
      barHeight
    );
  }

  /**
   * 绘制开始界面（自适应文本）
   */
  drawStartScreen() {
    const titleSize = utils.getRelativeFontSize(this.canvas.width, 0.06);
    const subSize = utils.getRelativeFontSize(this.canvas.width, 0.04);
    
    this.ctx.font = `${titleSize}px Arial`;
    this.ctx.fillStyle = 'red';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(
      '点击/触摸开始',
      this.canvas.width / 2,
      this.canvas.height / 3
    );

    this.ctx.font = `${subSize}px Arial`;
    this.ctx.fillText(
      '按空格/上箭头跳跃',
      this.canvas.width / 2,
      this.canvas.height / 2
    );
  }

  /**
   * 绘制游戏结束界面（自适应文本）
   */
  drawGameOver() {
    const titleSize = utils.getRelativeFontSize(this.canvas.width, 0.06);
    const subSize = utils.getRelativeFontSize(this.canvas.width, 0.04);
    
    this.ctx.font = `${titleSize}px Arial`;
    this.ctx.fillStyle = 'red';
    this.ctx.textAlign = 'center';
    
    if (this.gameMode === GameMode.OVER) {
      this.ctx.fillText('游戏结束', this.canvas.width / 2, this.canvas.height / 3);
    } else {
      this.ctx.fillText('恭喜胜利！', this.canvas.width / 2, this.canvas.height / 3);
    }
    
    this.ctx.fillText(`得分: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2);
    
    this.ctx.font = `${subSize}px Arial`;
    this.ctx.fillText(
      '点击/触摸重新开始',
      this.canvas.width / 2,
      this.canvas.height * 0.7
    );
  }

  /**
   * 重置游戏
   */
  resetGame() {
    this.gameMode = GameMode.RUNNING;
    this.score = 0;
    this.bottomBarOffset = 0;
    this.lastRunTime = 0;
    
    // 重置鸟的状态（位置按画布比例）
    this.bird.y = this.canvas.height / 2;
    this.bird.velocityY = 0;
    this.bird.angle = 0;
    
    // 重新初始化管道
    this.initPipes();
  }

  /**
   * 游戏主循环
   */
  gameLoop() {
    // 清除画布
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 绘制鸟
    this.bird.draw(this.ctx);
    this.bird.update();

    // 绘制底部滚动条
    this.drawBottomBar();

    // 根据游戏状态执行不同逻辑
    switch (this.gameMode) {
      case GameMode.PRESTART:
        this.drawStartScreen();
        break;

      case GameMode.RUNNING:
        this.updateBirdPhysics();
        this.updatePipes();
        this.checkGameStatus();
        
        // 绘制所有管道
        this.pipes.forEach(pipe => pipe.draw(this.ctx));
        
        // 显示得分（自适应字体）
        const scoreSize = utils.getRelativeFontSize(this.canvas.width, 0.05);
        this.ctx.font = `${scoreSize}px Arial`;
        this.ctx.fillStyle = 'black';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`得分: ${this.score}`, 10, scoreSize + 5);
        break;

      case GameMode.OVER:
      case GameMode.WIN:
        this.updateBirdPhysics();
        this.pipes.forEach(pipe => pipe.draw(this.ctx));
        this.drawGameOver();
        break;
    }

    // 继续循环
    requestAnimationFrame(() => this.gameLoop());
  }

  /**
   * 启动游戏
   */
  start() {
    this.loadResources()
      .then(() => this.init())
      .catch(error => {
        console.error('游戏初始化失败:', error);
        const errSize = utils.getRelativeFontSize(this.canvas.width, 0.04);
        this.ctx.font = `${errSize}px Arial`;
        this.ctx.fillStyle = 'red';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(
          `资源加载失败: ${error.message}`,
          this.canvas.width / 2,
          this.canvas.height / 2
        );
      });
  }
}

// DOM加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
  try {
    const game = new FlappyGame('myCanvas');
    game.start();
  } catch (error) {
    console.error('创建游戏实例失败:', error);
  }
});