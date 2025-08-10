const rulesButton = document.getElementById("rules-btn");
const closeButton = document.getElementById("close-btn");
const rules = document.getElementById("rules");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const color = getComputedStyle(document.documentElement).getPropertyValue(
  "--button-color"
);
const secondaryColor = getComputedStyle(
  document.documentElement
).getPropertyValue("--sidebar-color");
let score = 0;
const brickRowCount = 9;
const brickColumnCount = 5;

// 保持4:3的宽高比，适合大多数屏幕
const aspectRatio = 4 / 3;

// 元素
const ball = {
  x: 0, // 将在resizeCanvas中设置
  y: 0, // 将在resizeCanvas中设置
  sizeRatio: 0.0125, // 相对于画布宽度的比例
  speedRatio: 0.005, // 相对于画布宽度的比例
  dx: 0, // 将在resizeCanvas中设置
  dy: 0, // 将在resizeCanvas中设置
  baseSpeed: 4 // 基础速度，用于比例计算
};

const paddle = {
  x: 0, // 将在resizeCanvas中设置
  y: 0, // 将在resizeCanvas中设置
  widthRatio: 0.1, // 相对于画布宽度的比例
  heightRatio: 0.0125, // 相对于画布宽度的比例
  speedRatio: 0.01, // 相对于画布宽度的比例
  dx: 0
};

const brickInfo = {
  widthRatio: 0.0875, // 相对于画布宽度的比例
  heightRatio: 0.025, // 相对于画布宽度的比例
  paddingRatio: 0.0125, // 相对于画布宽度的比例
  offsetXRatio: 0.056, // 相对于画布宽度的比例
  offsetYRatio: 0.075, // 相对于画布宽度的比例
  visible: true,
  w: 0, // 将在resizeCanvas中设置
  h: 0, // 将在resizeCanvas中设置
  padding: 0, // 将在resizeCanvas中设置
  offsetX: 0, // 将在resizeCanvas中设置
  offsetY: 0 // 将在resizeCanvas中设置
};

let bricks = [];

// 初始化画布尺寸并添加窗口大小改变监听
function initCanvas() {
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
}

// 调整画布尺寸以适应屏幕
function resizeCanvas() {
  // 获取可用空间的尺寸（考虑窗口大小）
  const maxWidth = window.innerWidth * 0.95; // 最大宽度为窗口的95%
  const maxHeight = window.innerHeight * 0.9; // 最大高度为窗口的90%
  
  // 根据宽高比计算最佳尺寸
  let newWidth, newHeight;
  
  if (maxWidth / maxHeight > aspectRatio) {
    // 受高度限制
    newHeight = maxHeight;
    newWidth = newHeight * aspectRatio;
  } else {
    // 受宽度限制
    newWidth = maxWidth;
    newHeight = newWidth / aspectRatio;
  }
  
  // 设置画布的实际尺寸（像素）
  canvas.width = newWidth;
  canvas.height = newHeight;
  
  // 设置画布的CSS尺寸（确保显示正确）
  canvas.style.width = `${newWidth}px`;
  canvas.style.height = `${newHeight}px`;
  
  // 更新游戏元素尺寸（基于新的画布尺寸）
  updateGameElementsSize();
  
  // 重新创建砖块
  createBricks();
  
  // 如果游戏已经开始，重新定位球和 paddle
  if (score > 0) {
    // 保持球相对于画布的位置
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
  }
}

// 更新游戏元素的尺寸和位置
function updateGameElementsSize() {
  // 更新球的属性
  ball.size = canvas.width * ball.sizeRatio;
  ball.speed = canvas.width * ball.speedRatio;
  ball.dx = ball.baseSpeed * (canvas.width / 800); // 基于原始800宽度的比例调整
  ball.dy = -ball.baseSpeed * (canvas.width / 800);
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  
  // 更新 paddle 的属性
  paddle.w = canvas.width * paddle.widthRatio;
  paddle.h = canvas.width * paddle.heightRatio;
  paddle.speed = canvas.width * paddle.speedRatio;
  paddle.x = canvas.width / 2 - paddle.w / 2;
  paddle.y = canvas.height - paddle.h * 2;
  
  // 更新砖块信息
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

// 绘制元素
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
  ctx.closePath();
}

function drawScore() {
  // 字体大小基于画布宽度的比例
  const fontSize = Math.max(16, canvas.width * 0.025);
  ctx.font = `${fontSize}px "Balsamiq Sans"`;
  ctx.fillText(`Score: ${score}`, canvas.width - canvas.width * 0.15, canvas.height * 0.05);
}

function drawBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      ctx.fillStyle = brick.visible ? color : "transparent";
      ctx.fill();
      ctx.closePath();
    });
  });
}

function draw() {
  // 清除画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // 绘制元素
  drawBall();
  drawPaddle();
  drawScore();
  drawBricks();
}

// 移动元素
function movePaddle() {
  paddle.x += paddle.dx;
  // 边界检查
  if (paddle.x + paddle.w > canvas.width) paddle.x = canvas.width - paddle.w;
  if (paddle.x < 0) paddle.x = 0;
}

function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;
  // 墙壁碰撞检测
  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    // 左右墙壁
    ball.dx *= -1;
  }
  if (ball.y - ball.size < 0) {
    // 上墙壁
    ball.dy *= -1;
  }
  // 下墙壁（游戏结束）
  if (ball.y + ball.size > canvas.height) {
    showAllBricks();
    score = 0;
    // 重置球位置
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
  }
  //  paddle 碰撞检测
  if (
    ball.x - ball.size > paddle.x &&
    ball.x + ball.size < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y
  ) {
    ball.dy = -ball.speed;
  }
  // 砖块碰撞检测
  bricks.forEach((column) => {
    column.forEach((brick) => {
      if (brick.visible) {
        if (
          ball.x - ball.size > brick.x && // 左边界检查
          ball.x + ball.size < brick.x + brick.w && // 右边界检查
          ball.y + ball.size > brick.y && // 上边界检查
          ball.y - ball.size < brick.y + brick.h // 下边界检查
        ) {
          ball.dy *= -1;
          brick.visible = false;
          increaseScore();
        }
      }
    });
  });
}

function increaseScore() {
  score++;
  // 当所有砖块被清除后重新生成
  if (score % (brickRowCount * brickColumnCount) === 0) {
    showAllBricks();
  }
}

function showAllBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => (brick.visible = true));
  });
}

// 键盘事件处理
function keyDown(e) {
  // 方向键控制
  if (e.key === "Right" || e.key === "ArrowRight") paddle.dx = paddle.speed;
  else if (e.key === "Left" || e.key === "ArrowLeft") paddle.dx = -paddle.speed;
  // A / D 键控制
  else if (e.key.toLowerCase() === "d") paddle.dx = paddle.speed;
  else if (e.key.toLowerCase() === "a") paddle.dx = -paddle.speed;
}

function keyUp(e) {
  // 松开方向键或 A / D 键时停止移动
  if (
    ["Right", "ArrowRight", "Left", "ArrowLeft", "a", "A", "d", "D"].includes(
      e.key
    )
  ) {
    paddle.dx = 0;
  }
}

// 触摸和鼠标控制
let pointerDown = false;

function getPointerX(e) {
  // 同时支持鼠标与触摸
  const pointer = e.touches ? e.touches[0] : e;
  const rect = canvas.getBoundingClientRect();
  // 将坐标从CSS像素转换为实际画布像素
  return (pointer.clientX - rect.left) * (canvas.width / rect.width);
}

function pointerDownHandler(e) {
  pointerDown = true;
  updatePaddleByPointer(e);
  // 阻止触摸事件的默认行为，防止页面滚动
  if (e.type === 'touchstart') e.preventDefault();
}

function pointerUpHandler(e) {
  pointerDown = false;
  // 阻止触摸事件的默认行为
  if (e.type === 'touchend') e.preventDefault();
}

function pointerMoveHandler(e) {
  if (pointerDown) {
    updatePaddleByPointer(e);
    // 阻止触摸事件的默认行为
    if (e.type === 'touchmove') e.preventDefault();
  }
}

function updatePaddleByPointer(e) {
  const x = getPointerX(e);
  paddle.x = x - paddle.w / 2; // 让手指/鼠标位于 paddle 中心
  // 边界限制
  if (paddle.x < 0) paddle.x = 0;
  if (paddle.x + paddle.w > canvas.width) paddle.x = canvas.width - paddle.w;
}

// 游戏更新循环
function update() {
  movePaddle();
  moveBall();
  draw();
  requestAnimationFrame(update);
}

// 事件监听器
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);
rulesButton.addEventListener("click", () => rules.classList.add("show"));
closeButton.addEventListener("click", () => rules.classList.remove("show"));

// 鼠标事件
canvas.addEventListener("mousedown", pointerDownHandler);
canvas.addEventListener("mouseup", pointerUpHandler);
canvas.addEventListener("mousemove", pointerMoveHandler);
canvas.addEventListener("mouseleave", pointerUpHandler);

// 触摸事件
canvas.addEventListener("touchstart", pointerDownHandler, { passive: false });
canvas.addEventListener("touchend", pointerUpHandler, { passive: false });
canvas.addEventListener("touchmove", pointerMoveHandler, { passive: false });

// 初始化
initCanvas();
update();
