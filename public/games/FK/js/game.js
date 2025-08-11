// 游戏常量
const GAME_CONSTANTS = {
    COLS: 15,           // 游戏区域宽度（列数）
    ROWS: 30,           // 游戏区域高度（行数）
    BLOCK_SIZE: 15,     // 方块大小（像素）
    COLORS: [
        null,
        getComputedStyle(document.documentElement).getPropertyValue('--tetromino-i-color') || '#00bcd4', // I - 青色
        getComputedStyle(document.documentElement).getPropertyValue('--tetromino-j-color') || '#2196f3', // J - 蓝色
        getComputedStyle(document.documentElement).getPropertyValue('--tetromino-l-color') || '#ff9800', // L - 橙色
        getComputedStyle(document.documentElement).getPropertyValue('--tetromino-o-color') || '#ffeb3b', // O - 黄色
        getComputedStyle(document.documentElement).getPropertyValue('--tetromino-s-color') || '#4caf50', // S - 绿色
        getComputedStyle(document.documentElement).getPropertyValue('--tetromino-t-color') || '#9c27b0', // T - 紫色
        getComputedStyle(document.documentElement).getPropertyValue('--tetromino-z-color') || '#f44336'  // Z - 红色
    ],
    SHAPES: [
        [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]], // I
        [[2, 0, 0], [2, 2, 2], [0, 0, 0]], // J
        [[0, 0, 3], [3, 3, 3], [0, 0, 0]], // L
        [[4, 4], [4, 4]], // O
        [[0, 5, 5], [5, 5, 0], [0, 0, 0]], // S
        [[0, 6, 0], [6, 6, 6], [0, 0, 0]], // T
        [[7, 7, 0], [0, 7, 7], [0, 0, 0]]  // Z
    ]
};

// 方块类
class Piece {
    constructor(shape, x, y) {
        this.shape = JSON.parse(JSON.stringify(shape));
        this.x = x;
        this.y = y;
    }

    rotate() {
        const rows = this.shape.length;
        const cols = this.shape[0].length;
        const rotated = Array.from({ length: cols }, () => Array(rows).fill(0));

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                rotated[x][rows - 1 - y] = this.shape[y][x];
            }
        }

        return rotated;
    }

    clone() {
        return new Piece(this.shape, this.x, this.y);
    }
}

// 游戏板类
class Board {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.grid = this.createGrid();
    }

    createGrid() {
        return Array.from({ length: this.rows }, () => Array(this.cols).fill(0));
    }

    isValidMove(piece, offsetX = 0, offsetY = 0) {
        const shape = piece.shape;
        
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x] !== 0) {
                    const newX = piece.x + x + offsetX;
                    const newY = piece.y + y + offsetY;
                    
                    if (newX < 0 || newX >= this.cols || newY >= this.rows) {
                        return false;
                    }
                    
                    if (newY >= 0 && this.grid[newY][newX] !== 0) {
                        return false;
                    }
                }
            }
        }
        
        return true;
    }

    lockPiece(piece) {
        const shape = piece.shape;
        
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x] !== 0) {
                    if (piece.y + y <= 0) {
                        return false; // 游戏结束
                    }
                    this.grid[piece.y + y][piece.x + x] = shape[y][x];
                }
            }
        }
        
        return true;
    }

    clearLines() {
        let linesCleared = 0;
        
        for (let y = this.rows - 1; y >= 0; y--) {
            if (this.grid[y].every(cell => cell !== 0)) {
                // 移除当前行
                for (let yy = y; yy > 0; yy--) {
                    this.grid[yy] = [...this.grid[yy - 1]];
                }
                
                // 创建新的空行
                this.grid[0] = Array(this.cols).fill(0);
                linesCleared++;
                y++; // 重新检查当前行
            }
        }
        
        return linesCleared;
    }

    reset() {
        this.grid = this.createGrid();
    }
}

// 渲染器类
class Renderer {
    constructor(mainCanvas, nextCanvas, blockSize) {
        this.mainCtx = mainCanvas.getContext('2d');
        this.nextCtx = nextCanvas.getContext('2d');
        this.blockSize = blockSize;
        this.mainCanvas = mainCanvas;
        this.nextCanvas = nextCanvas;
        
        // 保存原始尺寸比例
        this.aspectRatio = GAME_CONSTANTS.COLS / GAME_CONSTANTS.ROWS;
    }
    
    // 调整方块大小和画布尺寸
    resize(newBlockSize) {
        this.blockSize = newBlockSize;
        
        // 调整主画布尺寸
        this.mainCanvas.width = GAME_CONSTANTS.COLS * this.blockSize;
        this.mainCanvas.height = GAME_CONSTANTS.ROWS * this.blockSize;
        
        // 调整预览画布尺寸 - 确保足够大以显示任何方块，但不超过一定大小
        const maxPreviewSize = 150; // 预览区域的最大尺寸
        const previewBlockSize = this.blockSize * 0.8;
        const previewSize = Math.min(5 * previewBlockSize, maxPreviewSize);
        
        // 保持预览区域为正方形
        this.nextCanvas.width = previewSize;
        this.nextCanvas.height = previewSize;
        
        // 更新预览区域的样式，确保它在视觉上适应新的尺寸
        this.nextCanvas.style.maxWidth = `${previewSize}px`;
        this.nextCanvas.style.maxHeight = `${previewSize}px`;
    }

    drawBlock(ctx, x, y, colorIndex) {
        const blockX = x * this.blockSize;
        const blockY = y * this.blockSize;
        
        // 绘制方块主体
        ctx.fillStyle = GAME_CONSTANTS.COLORS[colorIndex];
        ctx.fillRect(blockX, blockY, this.blockSize, this.blockSize);
        
        // 绘制边框
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--block-border') || 'rgba(0, 0, 0, 0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(blockX, blockY, this.blockSize, this.blockSize);
        
        // 绘制高光效果
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--block-highlight') || 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(blockX, blockY, this.blockSize, this.blockSize / 4);
        ctx.fillRect(blockX, blockY, this.blockSize / 4, this.blockSize);
    }

    drawBoard(board, currentPiece, isGameOver = false, score = 0) {
        this.mainCtx.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height);
        
        // 绘制网格
        this.drawGrid();
        
        // 绘制已固定的方块
        for (let y = 0; y < board.rows; y++) {
            for (let x = 0; x < board.cols; x++) {
                if (board.grid[y][x] !== 0) {
                    this.drawBlock(this.mainCtx, x, y, board.grid[y][x]);
                }
            }
        }
        
        // 绘制当前方块
        if (currentPiece) {
            this.drawPiece(this.mainCtx, currentPiece);
        }
        
        // 如果游戏结束，绘制游戏结束画面
        if (isGameOver) {
            this.showGameOver(score);
        }
    }

    drawGrid() {
        this.mainCtx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--grid-border') || 'rgba(0, 0, 0, 0.1)';
        this.mainCtx.lineWidth = 0.5;
        
        // 绘制水平线
        for (let i = 0; i <= GAME_CONSTANTS.ROWS; i++) {
            this.mainCtx.beginPath();
            this.mainCtx.moveTo(0, i * this.blockSize);
            this.mainCtx.lineTo(GAME_CONSTANTS.COLS * this.blockSize, i * this.blockSize);
            this.mainCtx.stroke();
        }
        
        // 绘制垂直线
        for (let i = 0; i <= GAME_CONSTANTS.COLS; i++) {
            this.mainCtx.beginPath();
            this.mainCtx.moveTo(i * this.blockSize, 0);
            this.mainCtx.lineTo(i * this.blockSize, GAME_CONSTANTS.ROWS * this.blockSize);
            this.mainCtx.stroke();
        }
    }

    drawPiece(ctx, piece) {
        const shape = piece.shape;
        
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x] !== 0) {
                    this.drawBlock(ctx, piece.x + x, piece.y + y, shape[y][x]);
                }
            }
        }
    }

    drawNextPiece(piece) {
        this.nextCtx.clearRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);
        
        if (!piece) return;
        
        // 使用主游戏区域方块大小的比例作为预览区块大小
        const previewBlockSize = this.blockSize * 0.8;
        const shape = piece.shape;
        const width = shape[0].length;
        const height = shape.length;
        
        // 计算居中位置
        const offsetX = (this.nextCanvas.width - width * previewBlockSize) / 2;
        const offsetY = (this.nextCanvas.height - height * previewBlockSize) / 2;
        
        // 绘制方块
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x] !== 0) {
                    const blockX = offsetX + x * previewBlockSize;
                    const blockY = offsetY + y * previewBlockSize;
                    
                    this.nextCtx.fillStyle = GAME_CONSTANTS.COLORS[shape[y][x]];
                    this.nextCtx.fillRect(blockX, blockY, previewBlockSize, previewBlockSize);
                    
                    this.nextCtx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--block-border');
                    this.nextCtx.lineWidth = 1;
                    this.nextCtx.strokeRect(blockX, blockY, previewBlockSize, previewBlockSize);
                    
                    this.nextCtx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--block-highlight') || 'rgba(255, 255, 255, 0.2)';
                    this.nextCtx.fillRect(blockX, blockY, previewBlockSize, previewBlockSize / 4);
                    this.nextCtx.fillRect(blockX, blockY, previewBlockSize / 4, previewBlockSize);
                }
            }
        }
    }

    showGameOver(score) {
        this.mainCtx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--game-over-overlay') || 'rgba(0, 0, 0, 0.7)';
        this.mainCtx.fillRect(0, 0, this.mainCanvas.width, this.mainCanvas.height);
        
        this.mainCtx.font = 'bold 36px Arial';
        this.mainCtx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--game-over-text') || '#ffffff';
        this.mainCtx.textAlign = 'center';
        this.mainCtx.textBaseline = 'middle';
        this.mainCtx.fillText('游戏结束', this.mainCanvas.width / 2, this.mainCanvas.height / 2 - 30);
        
        this.mainCtx.font = '24px Arial';
        this.mainCtx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--game-over-text') || '#ffffff';
        this.mainCtx.fillText(`最终分数: ${score}`, this.mainCanvas.width / 2, this.mainCanvas.height / 2 + 20);
    }

    showPause() {
        this.mainCtx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--pause-overlay') || 'rgba(0, 0, 0, 0.5)';
        this.mainCtx.fillRect(0, 0, this.mainCanvas.width, this.mainCanvas.height);
        
        this.mainCtx.font = 'bold 36px Arial';
        this.mainCtx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--game-over-text') || '#ffffff';
        this.mainCtx.textAlign = 'center';
        this.mainCtx.textBaseline = 'middle';
        this.mainCtx.fillText('已暂停', this.mainCanvas.width / 2, this.mainCanvas.height / 2);
    }
}

// 游戏控制器类
class GameController {
    constructor(game) {
        this.game = game;
        this.moveDelay = 100; // 移动间隔时间（毫秒）
        this.initialDelay = 200; // 首次移动前的延迟（毫秒）
        
        // 为每个方向创建单独的定时器和超时器
        this.moveIntervals = {
            left: null,
            right: null,
            down: null
        };
        
        this.moveTimeouts = {
            left: null,
            right: null,
            down: null
        };
        
        this.keyStates = {
            left: false,
            right: false,
            down: false
        };
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        // 键盘按下和释放事件
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));
        
        const playPauseBtn = document.getElementById('play-pause-btn');
        const resetBtn = document.getElementById('reset-btn');
        const difficultySelect = document.getElementById('difficulty-select');
        
        // 基本控制按钮
        playPauseBtn.addEventListener('click', () => this.game.togglePlayPause());
        resetBtn.addEventListener('click', () => this.game.reset());
        
        difficultySelect.addEventListener('change', () => {
            this.game.setSpeed(parseInt(difficultySelect.value));
        });

        // D-pad 方向键
        const upBtn = document.getElementById('up-btn');
        const leftBtn = document.getElementById('left-btn');
        const rightBtn = document.getElementById('right-btn');
        const downBtn = document.getElementById('down-btn');
        
        // 动作按钮
        const rotateBtn = document.getElementById('rotate-btn');
        const dropBtn = document.getElementById('drop-btn');

        // 添加单次触发按钮事件（旋转和硬降）
        this.addButtonEvents(upBtn, () => this.game.rotatePiece());
        this.addButtonEvents(rotateBtn, () => this.game.rotatePiece());
        this.addButtonEvents(dropBtn, () => this.game.hardDrop());
        
        // 添加支持长按的按钮事件（左、右、下）
        this.addLongPressButtonEvents(leftBtn, 'left');
        this.addLongPressButtonEvents(rightBtn, 'right');
        this.addLongPressButtonEvents(downBtn, 'down');

        // 防止长按时触发浏览器的默认行为
        document.querySelectorAll('.dpad-btn, .action-btn').forEach(button => {
            button.addEventListener('touchstart', (e) => e.preventDefault());
            button.addEventListener('contextmenu', (e) => e.preventDefault());
        });
    }
    
    // 普通按钮事件（单次触发）
    addButtonEvents(button, action) {
        if (!button) return;
        
        // 移动设备触摸事件
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            button.classList.add('active');
            action();
        });
        
        button.addEventListener('touchend', (e) => {
            e.preventDefault();
            button.classList.remove('active');
        });
        
        // 桌面点击事件
        button.addEventListener('mousedown', (e) => {
            button.classList.add('active');
            action();
        });
        
        button.addEventListener('mouseup', () => {
            button.classList.remove('active');
        });
        
        button.addEventListener('mouseleave', () => {
            button.classList.remove('active');
        });
    }
    
    // 停止指定方向的移动
    stopMovement(direction) {
        if (this.moveTimeouts[direction]) {
            clearTimeout(this.moveTimeouts[direction]);
            this.moveTimeouts[direction] = null;
        }
        
        if (this.moveIntervals[direction]) {
            clearInterval(this.moveIntervals[direction]);
            this.moveIntervals[direction] = null;
        }
        
        this.keyStates[direction] = false;
    }
    
    // 停止所有方向的移动
    stopAllMovement() {
        ['left', 'right', 'down'].forEach(dir => {
            this.stopMovement(dir);
        });
    }
    
    // 支持长按的按钮事件
    addLongPressButtonEvents(button, direction) {
        if (!button) return;
        
        const startMoving = () => {
            button.classList.add('active');
            
            // 停止其他方向的移动
            this.stopAllMovement();
            
            // 立即执行一次动作
            this.performDirectionAction(direction);
            
            // 设置延迟后的持续移动
            this.keyStates[direction] = true;
            this.moveTimeouts[direction] = setTimeout(() => {
                if (this.keyStates[direction]) {
                    this.moveIntervals[direction] = setInterval(() => {
                        this.performDirectionAction(direction);
                    }, this.moveDelay);
                }
            }, this.initialDelay);
        };
        
        const stopMoving = () => {
            button.classList.remove('active');
            this.stopMovement(direction);
        };
        
        // 移动设备触摸事件
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            startMoving();
        });
        
        button.addEventListener('touchend', (e) => {
            e.preventDefault();
            stopMoving();
        });
        
        button.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            stopMoving();
        });
        
        // 桌面点击事件
        button.addEventListener('mousedown', () => {
            startMoving();
        });
        
        button.addEventListener('mouseup', () => {
            stopMoving();
        });
        
        button.addEventListener('mouseleave', () => {
            stopMoving();
        });
    }
    
    // 执行方向动作
    performDirectionAction(direction) {
        if (this.game.isPaused || this.game.isGameOver || !this.game.isGameStarted) return;
        
        switch (direction) {
            case 'left':
                this.game.moveLeft();
                break;
            case 'right':
                this.game.moveRight();
                break;
            case 'down':
                this.game.moveDown();
                break;
        }
    }

handleKeyDown(event) {
    if (this.game.isGameOver) return;
    
    switch (event.keyCode) {
        case 65: // A键 - 左移
            if (!this.keyStates.left) {
                // 停止其他方向的移动
                this.stopAllMovement();
                
                // 立即执行一次左移
                this.game.moveLeft();
                
                // 设置延迟后的持续移动
                this.keyStates.left = true;
                this.moveTimeouts.left = setTimeout(() => {
                    if (this.keyStates.left) {
                        this.moveIntervals.left = setInterval(() => {
                            this.game.moveLeft();
                        }, this.moveDelay);
                    }
                }, this.initialDelay);
            }
            break;
            
        case 68: // D键 - 右移
            if (!this.keyStates.right) {
                // 停止其他方向的移动
                this.stopAllMovement();
                
                // 立即执行一次右移
                this.game.moveRight();
                
                // 设置延迟后的持续移动
                this.keyStates.right = true;
                this.moveTimeouts.right = setTimeout(() => {
                    if (this.keyStates.right) {
                        this.moveIntervals.right = setInterval(() => {
                            this.game.moveRight();
                        }, this.moveDelay);
                    }
                }, this.initialDelay);
            }
            break;
            
        case 40: // 下箭头 - 下移
            if (!this.keyStates.down) {
                // 停止其他方向的移动
                this.stopAllMovement();
                
                // 立即执行一次下移
                this.game.moveDown();
                
                // 设置延迟后的持续移动
                this.keyStates.down = true;
                this.moveTimeouts.down = setTimeout(() => {
                    if (this.keyStates.down) {
                        this.moveIntervals.down = setInterval(() => {
                            this.game.moveDown();
                        }, this.moveDelay);
                    }
                }, this.initialDelay);
            }
            break;
            
        case 87: // W键 - 旋转
            this.game.rotatePiece();
            break;
            
        case 83: // S键 - 快速落下
            this.game.hardDrop();
            break;
            
        case 32: // 空格键 - 快速落下（保留，作为备选）
            this.game.hardDrop();
            break;
            
        case 81: // Q键 - 暂停/继续
            this.game.togglePlayPause();
            break;
        case 69: // E键 - 重置
            this.game.reset();
            break;
    }
    
    // 防止方向键和空格、A、D、W、S键触发页面滚动
    if ([32, 37, 38, 39, 40, 65, 68, 87, 83].includes(event.keyCode)) {
        event.preventDefault();
    }
}

handleKeyUp(event) {
    switch (event.keyCode) {
        case 65: // A键 - 左移
            this.stopMovement('left');
            break;
            
        case 68: // D键 - 右移
            this.stopMovement('right');
            break;
            
        case 40: // 下箭头 - 下移
            this.stopMovement('down');
            break;
            }
        }
}

// 主游戏类
class TetrisGame {
    constructor() {
        this.board = new Board(GAME_CONSTANTS.ROWS, GAME_CONSTANTS.COLS);
        this.renderer = new Renderer(
            document.getElementById('tetris-canvas'),
            document.getElementById('next-piece-canvas'),
            GAME_CONSTANTS.BLOCK_SIZE
        );

        this.score = 0;
        this.highScore = this.loadHighScore();
        this.level = 1;
        this.lines = 0;
        this.gameSpeed = 1000;
        this.gameInterval = null;
        this.isGameOver = false;
        this.isPaused = false;
        this.isGameStarted = false;
        
        this.currentPiece = null;
        this.nextPiece = null;
        
        this.scoreElement = document.getElementById('score');
        this.highScoreElement = document.getElementById('high-score');
        this.levelElement = document.getElementById('level');
        this.playPauseBtn = document.getElementById('play-pause-btn');
        
        // 显示最高分
        if (this.highScoreElement) {
            this.highScoreElement.textContent = this.highScore;
        }
        
        // 初始化游戏控制器
        this.controller = new GameController(this);
        
        // 调整游戏大小以适应窗口
        this.resizeGame();
        
        // 添加窗口大小变化事件监听器
        window.addEventListener('resize', () => {
            this.resizeGame();
            // 重新绘制游戏
            this.renderer.drawBoard(this.board, this.currentPiece, this.isGameOver, this.score);
            this.renderer.drawNextPiece(this.nextPiece);
        });
        
        // 初始化游戏
        this.init();
    }
    
    // 调整游戏大小以适应窗口
    resizeGame() {
        // 防抖处理
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
        
        this.resizeTimeout = setTimeout(() => {
            // 获取游戏容器和其他UI元素
            const gameContainer = document.querySelector('.game-container');
            const controlsContainer = document.querySelector('.controls-container');
            const containerStyle = window.getComputedStyle(gameContainer);
            
            // 计算容器的内边距
            const paddingVertical = parseFloat(containerStyle.paddingTop) + parseFloat(containerStyle.paddingBottom);
            const paddingHorizontal = parseFloat(containerStyle.paddingLeft) + parseFloat(containerStyle.paddingRight);
            
            // 计算控制区域的高度
            const controlsHeight = controlsContainer ? controlsContainer.offsetHeight : 150;
            
            // 计算可用空间
            const minWidth = 280; // 最小游戏区域宽度
            const maxWidth = 500; // 最大游戏区域宽度
            const availableHeight = window.innerHeight - paddingVertical - controlsHeight - 20; // 额外留出20px的间距
            const availableWidth = Math.min(Math.max(window.innerWidth - paddingHorizontal, minWidth), maxWidth);
            
            // 计算基于宽高比的方块大小
            const heightBasedSize = Math.floor(availableHeight / GAME_CONSTANTS.ROWS);
            const widthBasedSize = Math.floor(availableWidth / GAME_CONSTANTS.COLS);
            
            // 选择较小的尺寸以确保完全适应
            let newBlockSize = Math.min(heightBasedSize, widthBasedSize);
            
            // 根据设备类型设置不同的大小限制
            const isMobile = window.innerWidth <= 768;
            const minBlockSize = isMobile ? 12 : 15;
            const maxBlockSize = isMobile ? 30 : 40;
            
            // 应用大小限制
            newBlockSize = Math.max(minBlockSize, Math.min(newBlockSize, maxBlockSize));
            
            // 调整渲染器的方块大小和画布尺寸
            this.renderer.resize(newBlockSize);
            
            // 重新绘制游戏画面
            if (this.board && this.currentPiece) {
                this.renderer.drawBoard(this.board, this.currentPiece);
                if (this.nextPiece) {
                    this.renderer.drawNextPiece(this.nextPiece);
                }
            }
        }, 150); // 150ms的防抖延迟
    }

    init() {
        // 获取当前选中的难度
        const difficultySelect = document.getElementById('difficulty-select');
        this.gameSpeed = parseInt(difficultySelect.value);
        
        // 重置游戏状态
        this.reset();
    }

    generateRandomPiece() {
        const shapeIndex = Math.floor(Math.random() * GAME_CONSTANTS.SHAPES.length);
        const shape = GAME_CONSTANTS.SHAPES[shapeIndex];
        const x = Math.floor(GAME_CONSTANTS.COLS / 2) - Math.floor(shape[0].length / 2);
        
        return new Piece(shape, x, 0);
    }

    spawnPiece() {
        // 使用下一个方块作为当前方块
        this.currentPiece = this.nextPiece || this.generateRandomPiece();
        
        // 生成新的下一个方块
        this.nextPiece = this.generateRandomPiece();
        
        // 绘制下一个方块预览
        this.renderer.drawNextPiece(this.nextPiece);
        
        // 检查新生成的方块是否立即碰撞（游戏结束条件）
        if (!this.board.isValidMove(this.currentPiece)) {
            this.gameOver();
            return false;
        }
        
        return true;
    }

    moveLeft() {
        if (this.isPaused || this.isGameOver || !this.isGameStarted) return;
        
        if (this.board.isValidMove(this.currentPiece, -1, 0)) {
            this.currentPiece.x--;
            this.renderer.drawBoard(this.board, this.currentPiece, this.isGameOver, this.score);
        }
    }

    moveRight() {
        if (this.isPaused || this.isGameOver || !this.isGameStarted) return;
        
        if (this.board.isValidMove(this.currentPiece, 1, 0)) {
            this.currentPiece.x++;
            this.renderer.drawBoard(this.board, this.currentPiece, this.isGameOver, this.score);
        }
    }

    moveDown() {
        if (this.isPaused || this.isGameOver || !this.isGameStarted) return;
        
        if (this.board.isValidMove(this.currentPiece, 0, 1)) {
            this.currentPiece.y++;
            this.renderer.drawBoard(this.board, this.currentPiece, this.isGameOver, this.score);
            return true;
        }
        
        // 如果发生碰撞，固定当前方块
        const result = this.board.lockPiece(this.currentPiece);
        
        // 检查是否游戏结束
        if (!result) {
            this.gameOver();
            return false;
        }
        
        // 检查并清除已完成的行
        this.clearLines();
        
        // 生成新方块
        this.spawnPiece();
        
        return false;
    }

    rotatePiece() {
        if (this.isPaused || this.isGameOver || !this.isGameStarted) return;
        
        const originalPiece = this.currentPiece.clone();
        this.currentPiece.shape = this.currentPiece.rotate();
        
        // 检查旋转后是否发生碰撞，如果是则恢复原始形状
        if (!this.board.isValidMove(this.currentPiece)) {
            this.currentPiece = originalPiece;
        }
        
        this.renderer.drawBoard(this.board, this.currentPiece, this.isGameOver, this.score);
    }

    hardDrop() {
        if (this.isPaused || this.isGameOver || !this.isGameStarted) return;
        
        let dropDistance = 0;
        
        // 计算可以下落的最大距离
        while (this.board.isValidMove(this.currentPiece, 0, dropDistance + 1)) {
            dropDistance++;
        }
        
        // 应用下落
        this.currentPiece.y += dropDistance;
        
        // 更新分数（每个格子2分）
        this.updateScore(dropDistance * 2);
        
        // 固定方块并检查游戏是否结束
        if (!this.lockPiece()) {
            // 游戏结束，不再继续执行
            this.renderer.drawBoard(this.board, this.currentPiece, this.isGameOver, this.score);
            return;
        }
        
        // 清除完成的行并生成新方块
        this.clearLines();
        this.spawnPiece();
        
        this.renderer.drawBoard(this.board, this.currentPiece, this.isGameOver, this.score);
    }

    lockPiece() {
        const result = this.board.lockPiece(this.currentPiece);
        if (!result) {
            this.gameOver();
            return false;
        }
        return true;
    }

    clearLines() {
        const linesCleared = this.board.clearLines();
        
        if (linesCleared > 0) {
            // 更新已清除的行数
            this.lines += linesCleared;
            
            // 根据清除的行数计算分数
            // 1行=100分，2行=300分，3行=500分，4行=800分
            const points = [0, 100, 300, 500, 800][linesCleared];
            this.updateScore(points * this.level);
            
            // 每清除10行提升一个等级
            if (this.lines >= this.level * 10) {
                this.levelUp();
            }
            
        }
    }

    updateScore(points) {
        this.score += points;
        this.scoreElement.textContent = this.score;
        
        // 更新最高分
        if (this.score > this.highScore) {
            this.highScore = this.score;
            if (this.highScoreElement) {
                this.highScoreElement.textContent = this.highScore;
            }
            this.saveHighScore();
        }
    }
    
    // 加载最高分
    loadHighScore() {
        return GameStorage.loadHighScore();
    }
    
    // 保存最高分
    saveHighScore() {
        GameStorage.saveHighScore(this.highScore);
    }
    
    // 保存游戏进度
    saveGameProgress() {
        try {
            if (!GameStorage || typeof GameStorage.saveGameProgress !== 'function') {
                console.error('GameStorage对象或saveGameProgress方法不存在');
                return false;
            }
            
            // 创建游戏状态对象
            const gameState = {
                board: this.board.grid,
                score: this.score,
                level: this.level,
                lines: this.lines,
                gameSpeed: this.gameSpeed,
                currentPiece: this.currentPiece ? {
                    shape: this.currentPiece.shape,
                    x: this.currentPiece.x,
                    y: this.currentPiece.y
                } : null,
                nextPiece: this.nextPiece ? {
                    shape: this.nextPiece.shape,
                    x: this.nextPiece.x,
                    y: this.nextPiece.y
                } : null
            };
            
            // 保存游戏状态
            const result = GameStorage.saveGameProgress(gameState);
            if (!result) {
                console.warn('保存游戏进度失败');
            }
            return result;
        } catch (error) {
            console.error('保存游戏进度时出错:', error);
            return false;
        }
    }
    
    // 加载游戏进度
    loadGameProgress() {
        const gameState = GameStorage.loadGameProgress();
        if (!gameState) return false;
        
        try {
            // 恢复游戏板状态
            this.board.grid = gameState.board;
            
            // 恢复游戏状态
            this.score = gameState.score;
            this.level = gameState.level;
            this.lines = gameState.lines;
            this.gameSpeed = gameState.gameSpeed;
            
            // 恢复当前方块
            if (gameState.currentPiece) {
                this.currentPiece = new Piece(
                    gameState.currentPiece.shape,
                    gameState.currentPiece.x,
                    gameState.currentPiece.y
                );
            }
            
            // 恢复下一个方块
            if (gameState.nextPiece) {
                this.nextPiece = new Piece(
                    gameState.nextPiece.shape,
                    gameState.nextPiece.x,
                    gameState.nextPiece.y
                );
            }
            
            // 更新UI
            this.updateScore(0);
            this.levelElement.textContent = this.level;
            
            // 重新绘制游戏
            this.renderer.drawBoard(this.board, this.currentPiece, this.isGameOver, this.score);
            this.renderer.drawNextPiece(this.nextPiece);
            
            return true;
        } catch (error) {
            console.error('恢复游戏进度失败:', error);
            return false;
        }
    }

    levelUp() {
        this.level++;
        this.levelElement.textContent = this.level;
        
        // 提高游戏速度
        this.gameSpeed = Math.max(100, 1000 - (this.level - 1) * 100);
        
        // 更新游戏循环
        if (this.isGameStarted && !this.isPaused) {
            clearInterval(this.gameInterval);
            this.gameInterval = setInterval(() => this.moveDown(), this.gameSpeed);
        }
    }

    setSpeed(speed) {
        this.gameSpeed = speed;
        
        if (this.isGameStarted && !this.isPaused) {
            clearInterval(this.gameInterval);
            this.gameInterval = setInterval(() => this.moveDown(), this.gameSpeed);
        }
    }

    async togglePlayPause() {
        // 如果游戏结束，重置并开始新游戏
        if (this.isGameOver) {
            this.reset();
            await this.startGame();
            return;
        }
        
        // 如果游戏尚未开始，开始游戏
        if (!this.isGameStarted) {
            await this.startGame();
            return;
        }
        
        // 如果游戏已经开始，则切换暂停/继续状态
        this.isPaused = !this.isPaused;
        
        if (this.isPaused) {
            // 暂停游戏
            clearInterval(this.gameInterval);
            this.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            
            // 显示暂停消息
            this.renderer.showPause();
            
            // 保存游戏进度
            this.saveGameProgress();
            this.showNotification('游戏已暂停并保存进度', 2000);
        } else {
            // 继续游戏
            this.gameInterval = setInterval(() => this.moveDown(), this.gameSpeed);
            this.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            this.renderer.drawBoard(this.board, this.currentPiece, this.isGameOver, this.score);
            
            this.showNotification('游戏继续', 1500);
        }
    }
    
    async startGame() {
        try {
            // 检查是否有保存的游戏进度
            let hasProgress = false;
            try {
                hasProgress = !this.isGameStarted && GameStorage && GameStorage.hasGameProgress && GameStorage.hasGameProgress();
            } catch (e) {
                console.error('检查游戏进度时出错:', e);
                hasProgress = false;
            }
            
            if (hasProgress) {
                // 使用await等待用户确认
                const shouldRestore = await Dialog.confirm('检测到保存的游戏进度，是否恢复？');
                
                if (shouldRestore) {
                    if (this.loadGameProgress()) {
                        this.isGameStarted = true;
                        this.isPaused = false;
                        this.isGameOver = false;
                    
                        this.gameInterval = setInterval(() => this.moveDown(), this.gameSpeed);
                        this.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                    
                        this.showNotification('游戏进度已恢复', 2000);
                        return;
                    }
                } else {
                    // 如果用户选择不恢复，则清除保存的游戏进度
                    try {
                        GameStorage.clearGameProgress();
                    } catch (e) {
                        console.error('清除游戏进度时出错:', e);
                    }
                }
            }
        
            // 开始游戏循环
            this.isGameStarted = true;
            this.gameInterval = setInterval(() => this.moveDown(), this.gameSpeed);
        
            // 更新按钮状态
            this.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        
            // 显示通知
            this.showNotification('游戏开始！', 1500);
        } catch (error) {
            console.error('启动游戏时出错:', error);
            // 确保游戏至少能启动
            this.isGameStarted = true;
            this.gameInterval = setInterval(() => this.moveDown(), this.gameSpeed);
            this.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }
    }

    gameOver() {
        this.isGameOver = true;
        clearInterval(this.gameInterval);
        
        // 更新按钮状态
        this.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        
        // 显示游戏结束消息
        this.renderer.drawBoard(this.board, this.currentPiece, true, this.score);
        
        // 删除暂存的游戏
        GameStorage.clearGameProgress();
        this.showNotification('游戏结束，已清除暂存游戏', 2000);
    }

    reset() {
        // 重置游戏状态
        this.board.reset();
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.isGameOver = false;
        this.isPaused = false;
        this.isGameStarted = false;
        
        // 更新显示
        this.scoreElement.textContent = this.score;
        this.levelElement.textContent = this.level;
        
        // 重置按钮状态
        this.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        
        // 清除游戏循环
        clearInterval(this.gameInterval);
        
        // 生成初始方块
        this.nextPiece = this.generateRandomPiece();
        this.currentPiece = this.generateRandomPiece();
        
        // 绘制游戏板和下一个方块
        this.renderer.drawBoard(this.board, this.currentPiece, this.isGameOver, this.score);
        this.renderer.drawNextPiece(this.nextPiece);
    }

    showNotification(message, duration = 2000) {
        Toast.info(message, duration);
    }
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    // 创建游戏实例
    const game = new TetrisGame();
    
    // 主题切换功能
    document.getElementById('theme-button').addEventListener('click', () => {
        game.renderer.drawBoard(game.board, game.currentPiece);
        game.renderer.drawNextPiece(game.nextPiece);
    });
});