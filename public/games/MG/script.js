Math.minmax = (value, limit) => {
  return Math.max(Math.min(value, limit), -limit);
};

const distance2D = (p1, p2) => {
  return Math.sqrt((p2.x - p1.x) **2 + (p2.y - p1.y)** 2);
};

// 两点之间的角度
const getAngle = (p1, p2) => {
  let angle = Math.atan((p2.y - p1.y) / (p2.x - p1.x));
  if (p2.x - p1.x < 0) angle += Math.PI;
  return angle;
};

// 球与墙帽之间的最近距离
const closestItCanBe = (cap, ball) => {
  let angle = getAngle(cap, ball);

  const deltaX = Math.cos(angle) * (wallW / 2 + ballSize / 2);
  const deltaY = Math.sin(angle) * (wallW / 2 + ballSize / 2);

  return { x: cap.x + deltaX, y: cap.y + deltaY };
};

// 让球绕墙帽滚动
const rollAroundCap = (cap, ball) => {
  // 球因墙阻挡而无法继续移动的方向
  let impactAngle = getAngle(ball, cap);

  // 基于球的速度，球想要移动的方向
  let heading = getAngle(
    { x: 0, y: 0 },
    { x: ball.velocityX, y: ball.velocityY }
  );

  // 撞击方向与球期望移动方向之间的角度
  // 角度越小，撞击力越大
  // 越接近90度，滚动越平滑（90度时无碰撞）
  let impactHeadingAngle = impactAngle - heading;

  // 未发生撞击时的速度大小
  const velocityMagnitude = distance2D(
    { x: 0, y: 0 },
    { x: ball.velocityX, y: ball.velocityY }
  );
  // 与撞击方向成对角线的速度分量
  const velocityMagnitudeDiagonalToTheImpact =
    Math.sin(impactHeadingAngle) * velocityMagnitude;

  // 球与墙帽之间应保持的距离
  const closestDistance = wallW / 2 + ballSize / 2;

  const rotationAngle = Math.atan(
    velocityMagnitudeDiagonalToTheImpact / closestDistance
  );

  const deltaFromCap = {
    x: Math.cos(impactAngle + Math.PI - rotationAngle) * closestDistance,
    y: Math.sin(impactAngle + Math.PI - rotationAngle) * closestDistance,
  };

  const x = ball.x;
  const y = ball.y;
  const velocityX = ball.x - (cap.x + deltaFromCap.x);
  const velocityY = ball.y - (cap.y + deltaFromCap.y);
  const nextX = x + velocityX;
  const nextY = y + velocityY;

  return { x, y, velocityX, velocityY, nextX, nextY };
};

// 减小数字的绝对值但保持符号，不小于绝对值0
const slow = (number, difference) => {
  if (Math.abs(number) <= difference) return 0;
  if (number > difference) return number - difference;
  return number + difference;
};

const mazeElement = document.getElementById("maze");
const joystickHeadElement = document.getElementById("joystick-head");
const noteElement = document.getElementById("note"); // 用于显示说明、游戏胜利和失败文本的元素

let hardMode = false;
let previousTimestamp;
let gameInProgress;
let startX; // 统一存储鼠标/触摸起始X
let startY; // 统一存储鼠标/触摸起始Y
let accelerationX;
let accelerationY;
let frictionX;
let frictionY;

const pathW = 25; // 路径宽度
const wallW = 10; // 墙宽度
const ballSize = 10; // 球的宽度和高度
const holeSize = 18;

const debugMode = false;

let balls = [];
let ballElements = [];
let holeElements = [];

// 适配手机端：加大操纵杆触摸区域
joystickHeadElement.style.width = "60px";
joystickHeadElement.style.height = "60px";
joystickHeadElement.style.touchAction = "none"; // 阻止触摸时页面滚动

resetGame();

// 首次绘制球
balls.forEach(({ x, y }) => {
  const ball = document.createElement("div");
  ball.setAttribute("class", "ball");
  ball.style.cssText = `left: ${x}px; top: ${y}px; `;

  mazeElement.appendChild(ball);
  ballElements.push(ball);
});

// 墙的元数据
const walls = [
  // 边框
  { column: 0, row: 0, horizontal: true, length: 10 },
  { column: 0, row: 0, horizontal: false, length: 9 },
  { column: 0, row: 9, horizontal: true, length: 10 },
  { column: 10, row: 0, horizontal: false, length: 9 },

  // 从第1列开始的水平线
  { column: 0, row: 6, horizontal: true, length: 1 },
  { column: 0, row: 8, horizontal: true, length: 1 },

  // 从第2列开始的水平线
  { column: 1, row: 1, horizontal: true, length: 2 },
  { column: 1, row: 7, horizontal: true, length: 1 },

  // 从第3列开始的水平线
  { column: 2, row: 2, horizontal: true, length: 2 },
  { column: 2, row: 4, horizontal: true, length: 1 },
  { column: 2, row: 5, horizontal: true, length: 1 },
  { column: 2, row: 6, horizontal: true, length: 1 },

  // 从第4列开始的水平线
  { column: 3, row: 3, horizontal: true, length: 1 },
  { column: 3, row: 8, horizontal: true, length: 3 },

  // 从第5列开始的水平线
  { column: 4, row: 6, horizontal: true, length: 1 },

  // 从第6列开始的水平线
  { column: 5, row: 2, horizontal: true, length: 2 },
  { column: 5, row: 7, horizontal: true, length: 1 },

  // 从第7列开始的水平线
  { column: 6, row: 1, horizontal: true, length: 1 },
  { column: 6, row: 6, horizontal: true, length: 2 },

  // 从第8列开始的水平线
  { column: 7, row: 3, horizontal: true, length: 2 },
  { column: 7, row: 7, horizontal: true, length: 2 },

  // 从第9列开始的水平线
  { column: 8, row: 1, horizontal: true, length: 1 },
  { column: 8, row: 2, horizontal: true, length: 1 },
  { column: 8, row: 3, horizontal: true, length: 1 },
  { column: 8, row: 4, horizontal: true, length: 2 },
  { column: 8, row: 8, horizontal: true, length: 2 },

  // 第1列后的垂直线
  { column: 1, row: 1, horizontal: false, length: 2 },
  { column: 1, row: 4, horizontal: false, length: 2 },

  // 第2列后的垂直线
  { column: 2, row: 2, horizontal: false, length: 2 },
  { column: 2, row: 5, horizontal: false, length: 1 },
  { column: 2, row: 7, horizontal: false, length: 2 },

  // 第3列后的垂直线
  { column: 3, row: 0, horizontal: false, length: 1 },
  { column: 3, row: 4, horizontal: false, length: 1 },
  { column: 3, row: 6, horizontal: false, length: 2 },

  // 第4列后的垂直线
  { column: 4, row: 1, horizontal: false, length: 2 },
  { column: 4, row: 6, horizontal: false, length: 1 },

  // 第5列后的垂直线
  { column: 5, row: 0, horizontal: false, length: 2 },
  { column: 5, row: 6, horizontal: false, length: 1 },
  { column: 5, row: 8, horizontal: false, length: 1 },

  // 第6列后的垂直线
  { column: 6, row: 4, horizontal: false, length: 1 },
  { column: 6, row: 6, horizontal: false, length: 1 },

  // 第7列后的垂直线
  { column: 7, row: 1, horizontal: false, length: 4 },
  { column: 7, row: 7, horizontal: false, length: 2 },

  // 第8列后的垂直线
  { column: 8, row: 2, horizontal: false, length: 1 },
  { column: 8, row: 4, horizontal: false, length: 2 },

  // 第9列后的垂直线
  { column: 9, row: 1, horizontal: false, length: 1 },
  { column: 9, row: 5, horizontal: false, length: 2 },
].map((wall) => ({
  x: wall.column * (pathW + wallW),
  y: wall.row * (pathW + wallW),
  horizontal: wall.horizontal,
  length: wall.length * (pathW + wallW),
}));

// 绘制墙
walls.forEach(({ x, y, horizontal, length }) => {
  const wall = document.createElement("div");
  wall.setAttribute("class", "wall");
  wall.style.cssText = `
        left: ${x}px;
        top: ${y}px;
        width: ${wallW}px;
        height: ${length}px;
        transform: rotate(${horizontal ? -90 : 0}deg);
      `;

  mazeElement.appendChild(wall);
});

const holes = [
  { column: 0, row: 5 },
  { column: 2, row: 0 },
  { column: 2, row: 4 },
  { column: 4, row: 6 },
  { column: 6, row: 2 },
  { column: 6, row: 8 },
  { column: 8, row: 1 },
  { column: 8, row: 2 },
].map((hole) => ({
  x: hole.column * (wallW + pathW) + (wallW / 2 + pathW / 2),
  y: hole.row * (wallW + pathW) + (wallW / 2 + pathW / 2),
}));

// 鼠标按下事件（桌面端）
joystickHeadElement.addEventListener("mousedown", startInteraction);

// 触摸开始事件（手机端）
joystickHeadElement.addEventListener("touchstart", (e) => {
  e.preventDefault(); // 阻止触摸时页面滚动
  startInteraction(e.touches[0]); // 用第一个触摸点模拟鼠标事件
});

// 统一处理交互开始（鼠标/触摸）
function startInteraction(event) {
  if (!gameInProgress) {
    startX = event.clientX;
    startY = event.clientY;
    gameInProgress = true;
    window.requestAnimationFrame(main);
    noteElement.style.opacity = 0;
    joystickHeadElement.style.cssText = `
          animation: none;
          cursor: grabbing;
          -webkit-tap-highlight-color: transparent; /* 移除手机端点击高亮 */
        `;
  }
}

// 鼠标移动事件（桌面端）
window.addEventListener("mousemove", handleMove);

// 触摸移动事件（手机端）
window.addEventListener("touchmove", (e) => {
  e.preventDefault(); // 阻止触摸滑动时页面滚动
  if (gameInProgress) {
    handleMove(e.touches[0]); // 用第一个触摸点模拟鼠标移动
  }
});

// 统一处理移动逻辑（鼠标/触摸）
function handleMove(event) {
  if (gameInProgress) {
    const deltaX = -Math.minmax(startX - event.clientX, 15);
    const deltaY = -Math.minmax(startY - event.clientY, 15);

    joystickHeadElement.style.cssText = `
          left: ${deltaX}px;
          top: ${deltaY}px;
          animation: none;
          cursor: grabbing;
        `;

    const rotationY = deltaX * 0.8; // 最大旋转角度 = 12
    const rotationX = deltaY * 0.8;

    mazeElement.style.cssText = `
          transform: rotateY(${rotationY}deg) rotateX(${-rotationX}deg)
        `;

    const gravity = 2;
    const friction = 0.01; // 摩擦系数

    accelerationX = gravity * Math.sin((rotationY / 180) * Math.PI);
    accelerationY = gravity * Math.sin((rotationX / 180) * Math.PI);
    frictionX = gravity * Math.cos((rotationY / 180) * Math.PI) * friction;
    frictionY = gravity * Math.cos((rotationX / 180) * Math.PI) * friction;
  }
}

// 鼠标松开事件（结束交互）
window.addEventListener("mouseup", endInteraction);

// 触摸结束事件（手机端结束交互）
window.addEventListener("touchend", endInteraction);

// 统一处理交互结束
function endInteraction() {
  // 保持游戏继续（松手后球因惯性继续移动）
  // 若需要松手后停止，可在此处设置 gameInProgress = false
}

window.addEventListener("keydown", function (event) {
  // 如果按下的不是箭头键、空格或H，则返回
  if (![" ", "H", "h", "E", "e"].includes(event.key)) return;

  // 如果按下的是箭头键，首先阻止默认行为
  event.preventDefault();

  // 如果按下的是空格，重新开始游戏
  if (event.key == " ") {
    resetGame();
    return;
  }

  // 设置困难模式
  if (event.key == "H" || event.key == "h") {
    hardMode = true;
    resetGame();
    return;
  }

  // 设置简单模式
  if (event.key == "E" || event.key == "e") {
    hardMode = false;
    resetGame();
    return;
  }
});

function resetGame() {
  previousTimestamp = undefined;
  gameInProgress = false;
  startX = undefined;
  startY = undefined;
  accelerationX = undefined;
  accelerationY = undefined;
  frictionX = undefined;
  frictionY = undefined;

  mazeElement.style.cssText = `
        transform: rotateY(0deg) rotateX(0deg)
      `;

  joystickHeadElement.style.cssText = `
        left: 0;
        top: 0;
        width: 60px;
        height: 60px;
        animation: glow;
        cursor: grab;
      `;

  if (hardMode) {
    noteElement.innerHTML = `点击或触摸操纵杆开始游戏！
          <p>困难模式，避开黑洞。返回简单模式？按E</p>`;
  } else {
    noteElement.innerHTML = `点击或触摸操纵杆开始游戏！
          <p>将所有球移到中心。准备好挑战困难模式了吗？按H</p>`;
  }
  noteElement.style.opacity = 1;

  balls = [
    { column: 0, row: 0 },
    { column: 9, row: 0 },
    { column: 0, row: 8 },
    { column: 9, row: 8 },
  ].map((ball) => ({
    x: ball.column * (wallW + pathW) + (wallW / 2 + pathW / 2),
    y: ball.row * (wallW + pathW) + (wallW / 2 + pathW / 2),
    velocityX: 0,
    velocityY: 0,
  }));

  if (ballElements.length) {
    balls.forEach(({ x, y }, index) => {
      ballElements[index].style.cssText = `left: ${x}px; top: ${y}px; `;
    });
  }

  // 移除之前的黑洞元素
  holeElements.forEach((holeElement) => {
    mazeElement.removeChild(holeElement);
  });
  holeElements = [];

  // 如果是困难模式，重置黑洞元素
  if (hardMode) {
    holes.forEach(({ x, y }) => {
      const ball = document.createElement("div");
      ball.setAttribute("class", "black-hole");
      ball.style.cssText = `left: ${x}px; top: ${y}px; `;

      mazeElement.appendChild(ball);
      holeElements.push(ball);
    });
  }
}

function main(timestamp) {
  // 可能在游戏中途重置，这种情况下循环应该停止
  if (!gameInProgress) return;

  if (previousTimestamp === undefined) {
    previousTimestamp = timestamp;
    window.requestAnimationFrame(main);
    return;
  }

  const maxVelocity = 1.5;

  // 自上一周期以来经过的时间除以16
  // 此函数平均每16毫秒调用一次，因此除以16的结果为1
  const timeElapsed = (timestamp - previousTimestamp) / 16;

  try {
    // 如果未移动，则不执行任何操作
    if (accelerationX != undefined && accelerationY != undefined) {
      const velocityChangeX = accelerationX * timeElapsed;
      const velocityChangeY = accelerationY * timeElapsed;
      const frictionDeltaX = frictionX * timeElapsed;
      const frictionDeltaY = frictionY * timeElapsed;

      balls.forEach((ball) => {
        if (velocityChangeX == 0) {
          // 无旋转，平面是平的
          // 在平面上，摩擦力只能减慢速度，不能反转运动
          ball.velocityX = slow(ball.velocityX, frictionDeltaX);
        } else {
          ball.velocityX = ball.velocityX + velocityChangeX;
          ball.velocityX = Math.max(Math.min(ball.velocityX, 1.5), -1.5);
          ball.velocityX =
            ball.velocityX - Math.sign(velocityChangeX) * frictionDeltaX;
          ball.velocityX = Math.minmax(ball.velocityX, maxVelocity);
        }

        if (velocityChangeY == 0) {
          // 无旋转，平面是平的
          // 在平面上，摩擦力只能减慢速度，不能反转运动
          ball.velocityY = slow(ball.velocityY, frictionDeltaY);
        } else {
          ball.velocityY = ball.velocityY + velocityChangeY;
          ball.velocityY =
            ball.velocityY - Math.sign(velocityChangeY) * frictionDeltaY;
          ball.velocityY = Math.minmax(ball.velocityY, maxVelocity);
        }

        // 初步的下一个球位置，仅在没有碰撞发生时有效
        ball.nextX = ball.x + ball.velocityX;
        ball.nextY = ball.y + ball.velocityY;

        if (debugMode) console.log("滴答", ball);

        walls.forEach((wall, wi) => {
          if (wall.horizontal) {
            // 水平墙
            if (
              ball.nextY + ballSize / 2 >= wall.y - wallW / 2 &&
              ball.nextY - ballSize / 2 <= wall.y + wallW / 2
            ) {
              const wallStart = { x: wall.x, y: wall.y };
              const wallEnd = { x: wall.x + wall.length, y: wall.y };

              if (
                ball.nextX + ballSize / 2 >= wallStart.x - wallW / 2 &&
                ball.nextX < wallStart.x
              ) {
                const distance = distance2D(wallStart, { x: ball.nextX, y: ball.nextY });
                if (distance < ballSize / 2 + wallW / 2) {
                  if (debugMode && wi > 4)
                    console.warn("离水平墙头部太近", distance, ball);
                  const closest = closestItCanBe(wallStart, { x: ball.nextX, y: ball.nextY });
                  const rolled = rollAroundCap(wallStart, { ...closest, velocityX: ball.velocityX, velocityY: ball.velocityY });
                  Object.assign(ball, rolled);
                }
              }

              if (
                ball.nextX - ballSize / 2 <= wallEnd.x + wallW / 2 &&
                ball.nextX > wallEnd.x
              ) {
                const distance = distance2D(wallEnd, { x: ball.nextX, y: ball.nextY });
                if (distance < ballSize / 2 + wallW / 2) {
                  if (debugMode && wi > 4)
                    console.warn("离水平墙尾部太近", distance, ball);
                  const closest = closestItCanBe(wallEnd, { x: ball.nextX, y: ball.nextY });
                  const rolled = rollAroundCap(wallEnd, { ...closest, velocityX: ball.velocityX, velocityY: ball.velocityY });
                  Object.assign(ball, rolled);
                }
              }

              if (ball.nextX >= wallStart.x && ball.nextX <= wallEnd.x) {
                ball.nextY = ball.nextY < wall.y 
                  ? wall.y - wallW / 2 - ballSize / 2 
                  : wall.y + wallW / 2 + ballSize / 2;
                ball.y = ball.nextY;
                ball.velocityY = -ball.velocityY / 3;
                if (debugMode && wi > 4)
                  console.error("穿过水平线，发生碰撞", ball);
              }
            }
          } else {
            // 垂直墙
            if (
              ball.nextX + ballSize / 2 >= wall.x - wallW / 2 &&
              ball.nextX - ballSize / 2 <= wall.x + wallW / 2
            ) {
              const wallStart = { x: wall.x, y: wall.y };
              const wallEnd = { x: wall.x, y: wall.y + wall.length };

              if (
                ball.nextY + ballSize / 2 >= wallStart.y - wallW / 2 &&
                ball.nextY < wallStart.y
              ) {
                const distance = distance2D(wallStart, { x: ball.nextX, y: ball.nextY });
                if (distance < ballSize / 2 + wallW / 2) {
                  if (debugMode && wi > 4)
                    console.warn("离垂直墙头部太近", distance, ball);
                  const closest = closestItCanBe(wallStart, { x: ball.nextX, y: ball.nextY });
                  const rolled = rollAroundCap(wallStart, { ...closest, velocityX: ball.velocityX, velocityY: ball.velocityY });
                  Object.assign(ball, rolled);
                }
              }

              if (
                ball.nextY - ballSize / 2 <= wallEnd.y + wallW / 2 &&
                ball.nextY > wallEnd.y
              ) {
                const distance = distance2D(wallEnd, { x: ball.nextX, y: ball.nextY });
                if (distance < ballSize / 2 + wallW / 2) {
                  if (debugMode && wi > 4)
                    console.warn("离垂直墙尾部太近", distance, ball);
                  const closest = closestItCanBe(wallEnd, { x: ball.nextX, y: ball.nextY });
                  const rolled = rollAroundCap(wallEnd, { ...closest, velocityX: ball.velocityX, velocityY: ball.velocityY });
                  Object.assign(ball, rolled);
                }
              }

              if (ball.nextY >= wallStart.y && ball.nextY <= wallEnd.y) {
                ball.nextX = ball.nextX < wall.x 
                  ? wall.x - wallW / 2 - ballSize / 2 
                  : wall.x + wallW / 2 + ballSize / 2;
                ball.x = ball.nextX;
                ball.velocityX = -ball.velocityX / 3;
                if (debugMode && wi > 4)
                  console.error("穿过垂直线，发生碰撞", ball);
              }
            }
          }
        });

        // 检测球是否落入黑洞
        if (hardMode) {
          holes.forEach((hole, hi) => {
            const distance = distance2D(hole, { x: ball.nextX, y: ball.nextY });
            if (distance <= holeSize / 2) {
              holeElements[hi].style.backgroundColor = "red";
              throw Error("球落入了黑洞");
            }
          });
        }

        // 调整球的位置
        ball.x = ball.x + ball.velocityX;
        ball.y = ball.y + ball.velocityY;
      });

      // 更新UI位置
      balls.forEach(({ x, y }, index) => {
        ballElements[index].style.cssText = `left: ${x}px; top: ${y}px; `;
      });
    }

    // 胜利检测
    if (
      balls.every(
        (ball) => distance2D(ball, { x: 350 / 2, y: 315 / 2 }) < 65 / 2
      )
    ) {
      noteElement.innerHTML = `恭喜，你成功了！
          ${!hardMode ? "<p>按H进入困难模式</p>" : ""}`;
      noteElement.style.opacity = 1;
      gameInProgress = false;
    } else {
      previousTimestamp = timestamp;
      window.requestAnimationFrame(main);
    }
  } catch (error) {
    if (error.message == "球落入了黑洞") {
      noteElement.innerHTML = `有一个球落入了黑洞！按空格键重置游戏。
          <p>返回简单模式？按E</p>`;
      noteElement.style.opacity = 1;
      gameInProgress = false;
    } else throw error;
  }
}