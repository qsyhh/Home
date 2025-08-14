// 获取DOM元素
const rulesButton = document.getElementById("rules-btn");
const closeButton = document.getElementById("close-btn");
const rules = document.getElementById("rules");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// 获取CSS变量
const color = getComputedStyle(document.documentElement).getPropertyValue("--button-color");
const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue("--sidebar-color");

// 游戏状态变量
let score = 0;
const brickRowCount = 9;
const brickColumnCount = 5;
const aspectRatio = 4 / 3; // 保持4:3的宽高比

// 游戏元素配置
const ball = {
  x: 0,
  y: 0,
  sizeRatio: 0.015,
  speedRatio: 0.005,
  dx: 0,
  dy: 0,
  baseSpeed: 4,
  size: 0,
  speed: 0,
  // 新增：记录上一帧位置，用于精确碰撞检测
  prevX: 0,
  prevY: 0
};

const paddle = {
  x: 0,
  y: 0,
  widthRatio: 0.15,
  heightRatio: 0.015,
  speedRatio: 0.012,
  dx: 0,
  w: 0,
  h: 0,
  speed: 0
};

const brickInfo = {
  widthRatio: 0.0875,
  heightRatio: 0.025,
  paddingRatio: 0.0125,
  offsetXRatio: 0.056,
  offsetYRatio: 0.075,
  visible: true,
  w: 0,
  h: 0,
  padding: 0,
  offsetX: 0,
  offsetY: 0
};

let bricks = [];

// 输入控制变量
let isDragging = false;
let touchStartX = 0;
let paddleStartX = 0;

// 初始化函数
function initCanvas() {
  const touchHint = document.createElement('div');
  touchHint.className = 'touch-hint';
  touchHint.textContent = '按住并拖动控制挡板';
  document.body.insertBefore(touchHint, canvas.nextSibling);
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  setupEventListeners();
}

// 响应式画布调整
function resizeCanvas() {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const padding = 20;
  
  const maxWidth = windowWidth - padding * 2;
  const maxHeight = windowHeight - padding * 2 - 100;
  
  let newWidth, newHeight;
  
  if (maxWidth / maxHeight > aspectRatio) {
    newHeight = maxHeight;
    newWidth = newHeight * aspectRatio;
  } else {
    newWidth = maxWidth;
    newHeight = newWidth / aspectRatio;
  }
  
  canvas.width = newWidth;
  canvas.height = newHeight;
  canvas.style.width = `${newWidth}px`;
  canvas.style.height = `${newHeight}px`;
  
  updateGameElementsSize();
  createBricks();
  
  if (score > 0) {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.prevX = ball.x;
    ball.prevY = ball.y;
  }
}

// 更新游戏元素尺寸
function updateGameElementsSize() {
  // 球的属性更新
  ball.size = canvas.width * ball.sizeRatio;
  ball.speed = canvas.width * ball.speedRatio;
  ball.dx = ball.baseSpeed * (canvas.width / 800);
  ball.dy = -ball.baseSpeed * (canvas.width / 800);
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.prevX = ball.x;
  ball.prevY = ball.y;
  
  // 挡板的属性更新
  paddle.w = canvas.width * paddle.widthRatio;
  paddle.h = canvas.width * paddle.heightRatio;
  paddle.speed = canvas.width * paddle.speedRatio;
  paddle.x = canvas.width / 2 - paddle.w / 2;
  paddle.y = canvas.height - paddle.h * 2;
  
  // 砖块的属性更新
  brickInfo.w = canvas.width * brickInfo.widthRatio;
  brickInfo.h = canvas.width * brickInfo.heightRatio;
  brickInfo.padding = canvas.width * brickInfo.paddingRatio;
  brickInfo.offsetX = canvas.width * brickInfo.offsetXRatio;
  brickInfo.offsetY = canvas.width * brickInfo.offsetYRatio;
}

// 创建砖块
function createBricks() {
  bricks = [];
  for (let i = 0; i < brickRowCount; i++) {
    bricks[i] = [];
    for (let j = 0; j < brickColumnCount; j++) {
      const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
      const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
      bricks[i][j] = { x, y, ...brickInfo };
    }
  }
}

// 绘制函数
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = secondaryColor;
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.closePath();
}

function drawScore() {
  const fontSize = Math.max(16, canvas.width * 0.025);
  ctx.font = `${fontSize}px "Balsamiq Sans"`;
  ctx.fillStyle = secondaryColor;
  ctx.fillText(`Score: ${score}`, canvas.width - canvas.width * 0.15, canvas.height * 0.05);
}

function drawBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => {
      if (brick.visible) {
        ctx.beginPath();
        ctx.rect(brick.x, brick.y, brick.w, brick.h);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.closePath();
      }
    });
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();
  drawScore();
  drawBricks();
}

// 移动函数
function movePaddle() {
  paddle.x += paddle.dx;
  // 边界检查
  if (paddle.x + paddle.w > canvas.width) paddle.x = canvas.width - paddle.w;
  if (paddle.x < 0) paddle.x = 0;
}

function moveBall() {
  // 记录当前位置作为下一帧的"上一位置"
  ball.prevX = ball.x;
  ball.prevY = ball.y;
  
  // 移动球
  ball.x += ball.dx;
  ball.y += ball.dy;
  
  // 左右墙壁碰撞
  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1;
    // 修正位置，防止卡在墙边
    if (ball.x + ball.size > canvas.width) ball.x = canvas.width - ball.size;
    if (ball.x - ball.size < 0) ball.x = ball.size;
  }
  
  // 上墙壁碰撞
  if (ball.y - ball.size < 0) {
    ball.dy *= -1;
    ball.y = ball.size; // 修正位置
  }
  
  // 下墙壁（游戏结束）
  if (ball.y + ball.size > canvas.height) {
    showAllBricks();
    score = 0;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.prevX = ball.x;
    ball.prevY = ball.y;
    ball.dx = ball.baseSpeed * (canvas.width / 800) * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = -ball.baseSpeed * (canvas.width / 800);
  }
  
  // 挡板碰撞检测
  if (
    ball.y + ball.size > paddle.y &&
    ball.y - ball.size < paddle.y + paddle.h &&
    ball.x > paddle.x - ball.size &&
    ball.x < paddle.x + paddle.w + ball.size
  ) {
    const hitPosition = (ball.x - paddle.x) / paddle.w;
    const angle = (hitPosition - 0.5) * 2 * 0.7;
    const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
    ball.dx = speed * angle;
    ball.dy = -Math.sqrt(speed * speed - ball.dx * ball.dx);
    if (ball.dy > 0) ball.dy *= -1;
    
    // 修正位置，防止卡在挡板中
    ball.y = paddle.y - ball.size;
  }
  
  // 砖块碰撞检测（优化版本）
  bricks.forEach((column) => {
    column.forEach((brick) => {
      if (brick.visible) {
        // 检查球是否与砖块碰撞（使用上一帧位置和当前位置判断轨迹）
        const collided = checkBrickCollision(brick);
        
        if (collided) {
          brick.visible = false;
          increaseScore();
        }
      }
    });
  });
}

// 精确的砖块碰撞检测
function checkBrickCollision(brick) {
  // 球的边界
  const ballLeft = ball.x - ball.size;
  const ballRight = ball.x + ball.size;
  const ballTop = ball.y - ball.size;
  const ballBottom = ball.y + ball.size;
  
  // 砖块边界
  const brickLeft = brick.x;
  const brickRight = brick.x + brick.w;
  const brickTop = brick.y;
  const brickBottom = brick.y + brick.h;
  
  // 简单碰撞检测
  if (
    ballRight > brickLeft &&
    ballLeft < brickRight &&
    ballBottom > brickTop &&
    ballTop < brickBottom
  ) {
    // 确定碰撞方向（使用上一帧位置判断是从哪个方向撞来的）
    const prevBallLeft = ball.prevX - ball.size;
    const prevBallRight = ball.prevX + ball.size;
    const prevBallTop = ball.prevY - ball.size;
    const prevBallBottom = ball.prevY + ball.size;
    
    // 从上方或下方碰撞
    if (
      (prevBallTop >= brickBottom && ballTop < brickBottom) ||
      (prevBallBottom <= brickTop && ballBottom > brickTop)
    ) {
      ball.dy *= -1;
      // 修正位置，防止穿透
      if (prevBallTop >= brickBottom) ball.y = brickBottom + ball.size;
      else ball.y = brickTop - ball.size;
    }
    // 从左侧或右侧碰撞
    else if (
      (prevBallLeft >= brickRight && ballLeft < brickRight) ||
      (prevBallRight <= brickLeft && ballRight > brickLeft)
    ) {
      ball.dx *= -1;
      // 修正位置，防止穿透
      if (prevBallLeft >= brickRight) ball.x = brickRight + ball.size;
      else ball.x = brickLeft - ball.size;
    }
    
    return true;
  }
  
  return false;
}

// 分数和游戏状态管理
function increaseScore() {
  score++;
  if (score % (brickRowCount * brickColumnCount) === 0) {
    showAllBricks();
    ball.baseSpeed *= 1.1; // 提升难度
    updateGameElementsSize();
  }
}

function showAllBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => (brick.visible = true));
  });
}

// 输入处理
function keyDown(e) {
  if (e.key === "Right" || e.key === "ArrowRight" || e.key.toLowerCase() === "d") {
    paddle.dx = paddle.speed;
  } else if (e.key === "Left" || e.key === "ArrowLeft" || e.key.toLowerCase() === "a") {
    paddle.dx = -paddle.speed;
  }
}

function keyUp(e) {
  if (["Right", "ArrowRight", "Left", "ArrowLeft", "a", "A", "d", "D"].includes(e.key)) {
    paddle.dx = 0;
  }
}

function getRelativeX(e) {
  const rect = canvas.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  return (clientX - rect.left) * (canvas.width / rect.width);
}

function handlePointerStart(e) {
  e.preventDefault();
  isDragging = true;
  touchStartX = getRelativeX(e);
  paddleStartX = paddle.x;
  if (e.touches) {
    canvas.style.opacity = "0.95";
  }
}

function handlePointerMove(e) {
  if (!isDragging) return;
  e.preventDefault();
  
  const currentX = getRelativeX(e);
  const diffX = currentX - touchStartX;
  let newX = paddleStartX + diffX;
  
  // 边界限制
  if (newX < 0) {
    newX = 0;
  } else if (newX + paddle.w > canvas.width) {
    newX = canvas.width - paddle.w;
  }
  
  paddle.x = newX;
}

function pointerUpHandler(e) {
  isDragging = false;
  
  // 阻止触摸默认行为
  if (e.type === "touchend") {
    e.preventDefault();
  }
  
  // 重置挡板速度
  paddle.dx = 0;
  
  // 恢复视觉状态
  canvas.style.opacity = "1";
}

// 事件监听设置
function setupEventListeners() {
  // 键盘事件
  document.addEventListener("keydown", keyDown);
  document.addEventListener("keyup", keyUp);
  
  // 规则按钮事件
  rulesButton.addEventListener("click", () => rules.classList.add("show"));
  closeButton.addEventListener("click", () => rules.classList.remove("show"));
  
  // 鼠标事件
  canvas.addEventListener("mousedown", handlePointerStart);
  canvas.addEventListener("mouseup", pointerUpHandler);
  canvas.addEventListener("mousemove", handlePointerMove);
  canvas.addEventListener("mouseleave", pointerUpHandler);
  
  // 触摸事件
  canvas.addEventListener("touchstart", handlePointerStart, { passive: false });
  canvas.addEventListener("touchend", pointerUpHandler, { passive: false });
  canvas.addEventListener("touchmove", handlePointerMove, { passive: false });
}

// 游戏主循环
function update() {
  movePaddle();
  moveBall();
  draw();
  requestAnimationFrame(update);
}

// 启动游戏
initCanvas();
update();