document.addEventListener("DOMContentLoaded", () => {
  const gridDisplay = document.querySelector(".grid");
  const scoreDisplay = document.getElementById("score");
  const resultDisplay = document.getElementById("result");
  let squares = [];
  const width = 4;
  let score = 0;
  
  // 触控相关变量
  let startX, startY, endX, endY;

  // 创建游戏面板
  function createBoard() {
    for (let i = 0; i < width * width; i++) {
      square = document.createElement("div");
      square.innerHTML = 0;
      gridDisplay.appendChild(square);
      squares.push(square);
    }
    generate();
    generate();
  }
  createBoard();

  // 生成新数字
  function generate() {
    randomNumber = Math.floor(Math.random() * squares.length);
    if (squares[randomNumber].innerHTML == 0) {
      // 10%概率生成4，90%概率生成2
      squares[randomNumber].innerHTML = Math.random() < 0.9 ? 2 : 4;
      checkForGameOver();
    } else generate();
  }

  function moveRight() {
    for (let i = 0; i < 16; i++) {
      if (i % 4 === 0) {
        let totalOne = squares[i].innerHTML;
        let totalTwo = squares[i + 1].innerHTML;
        let totalThree = squares[i + 2].innerHTML;
        let totalFour = squares[i + 3].innerHTML;
        let row = [
          parseInt(totalOne),
          parseInt(totalTwo),
          parseInt(totalThree),
          parseInt(totalFour),
        ];

        let filteredRow = row.filter((num) => num);
        let missing = 4 - filteredRow.length;
        let zeros = Array(missing).fill(0);
        let newRow = zeros.concat(filteredRow);

        squares[i].innerHTML = newRow[0];
        squares[i + 1].innerHTML = newRow[1];
        squares[i + 2].innerHTML = newRow[2];
        squares[i + 3].innerHTML = newRow[3];
      }
    }
  }

  function moveLeft() {
    for (let i = 0; i < 16; i++) {
      if (i % 4 === 0) {
        let totalOne = squares[i].innerHTML;
        let totalTwo = squares[i + 1].innerHTML;
        let totalThree = squares[i + 2].innerHTML;
        let totalFour = squares[i + 3].innerHTML;
        let row = [
          parseInt(totalOne),
          parseInt(totalTwo),
          parseInt(totalThree),
          parseInt(totalFour),
        ];

        let filteredRow = row.filter((num) => num);
        let missing = 4 - filteredRow.length;
        let zeros = Array(missing).fill(0);
        let newRow = filteredRow.concat(zeros);

        squares[i].innerHTML = newRow[0];
        squares[i + 1].innerHTML = newRow[1];
        squares[i + 2].innerHTML = newRow[2];
        squares[i + 3].innerHTML = newRow[3];
      }
    }
  }

  function moveUp() {
    for (let i = 0; i < 4; i++) {
      let totalOne = squares[i].innerHTML;
      let totalTwo = squares[i + width].innerHTML;
      let totalThree = squares[i + width * 2].innerHTML;
      let totalFour = squares[i + width * 3].innerHTML;
      let column = [
        parseInt(totalOne),
        parseInt(totalTwo),
        parseInt(totalThree),
        parseInt(totalFour),
      ];

      let filteredColumn = column.filter((num) => num);
      let missing = 4 - filteredColumn.length;
      let zeros = Array(missing).fill(0);
      let newColumn = filteredColumn.concat(zeros);

      squares[i].innerHTML = newColumn[0];
      squares[i + width].innerHTML = newColumn[1];
      squares[i + width * 2].innerHTML = newColumn[2];
      squares[i + width * 3].innerHTML = newColumn[3];
    }
  }

  function moveDown() {
    for (let i = 0; i < 4; i++) {
      let totalOne = squares[i].innerHTML;
      let totalTwo = squares[i + width].innerHTML;
      let totalThree = squares[i + width * 2].innerHTML;
      let totalFour = squares[i + width * 3].innerHTML;
      let column = [
        parseInt(totalOne),
        parseInt(totalTwo),
        parseInt(totalThree),
        parseInt(totalFour),
      ];

      let filteredColumn = column.filter((num) => num);
      let missing = 4 - filteredColumn.length;
      let zeros = Array(missing).fill(0);
      let newColumn = zeros.concat(filteredColumn);

      squares[i].innerHTML = newColumn[0];
      squares[i + width].innerHTML = newColumn[1];
      squares[i + width * 2].innerHTML = newColumn[2];
      squares[i + width * 3].innerHTML = newColumn[3];
    }
  }

  function combineRow() {
    for (let i = 0; i < 15; i++) {
      if (squares[i].innerHTML === squares[i + 1].innerHTML && squares[i].innerHTML != 0) {
        let combinedTotal =
          parseInt(squares[i].innerHTML) + parseInt(squares[i + 1].innerHTML);
        squares[i].innerHTML = combinedTotal;
        squares[i + 1].innerHTML = 0;
        score += combinedTotal;
        scoreDisplay.innerHTML = score;
      }
    }
    checkForWin();
  }

  function combineColumn() {
    for (let i = 0; i < 12; i++) {
      if (squares[i].innerHTML === squares[i + width].innerHTML && squares[i].innerHTML != 0) {
        let combinedTotal =
          parseInt(squares[i].innerHTML) +
          parseInt(squares[i + width].innerHTML);
        squares[i].innerHTML = combinedTotal;
        squares[i + width].innerHTML = 0;
        score += combinedTotal;
        scoreDisplay.innerHTML = score;
      }
    }
    checkForWin();
  }

  // 处理按键控制
  function control(e) {
    // 方向键
    if (e.keyCode === 37) { // 左箭头
      keyLeft();
    } else if (e.keyCode === 38) { // 上箭头
      keyUp();
    } else if (e.keyCode === 39) { // 右箭头
      keyRight();
    } else if (e.keyCode === 40) { // 下箭头
      keyDown();
    } 
    // WASD键
    else if (e.keyCode === 65) { // A键
      keyLeft();
    } else if (e.keyCode === 87) { // W键
      keyUp();
    } else if (e.keyCode === 68) { // D键
      keyRight();
    } else if (e.keyCode === 83) { // S键
      keyDown();
    }
  }
  document.addEventListener("keyup", control);

  // 触控开始
  function handleTouchStart(e) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }

  // 触控结束
  function handleTouchEnd(e) {
    endX = e.changedTouches[0].clientX;
    endY = e.changedTouches[0].clientY;
    handleSwipe();
  }

  // 处理滑动
  function handleSwipe() {
    // 计算滑动距离
    const diffX = endX - startX;
    const diffY = endY - startY;

    // 确定滑动方向（优先处理水平或垂直滑动更明显的方向）
    if (Math.abs(diffX) > Math.abs(diffY)) {
      // 水平滑动
      if (diffX > 50) { // 向右滑动
        keyRight();
      } else if (diffX < -50) { // 向左滑动
        keyLeft();
      }
    } else {
      // 垂直滑动
      if (diffY > 50) { // 向下滑动
        keyDown();
      } else if (diffY < -50) { // 向上滑动
        keyUp();
      }
    }
  }

  // 添加触控事件监听
  document.addEventListener('touchstart', handleTouchStart, false);
  document.addEventListener('touchend', handleTouchEnd, false);

  function keyRight() {
    moveRight();
    combineRow();
    moveRight();
    generate();
  }

  function keyLeft() {
    moveLeft();
    combineRow();
    moveLeft();
    generate();
  }

  function keyUp() {
    moveUp();
    combineColumn();
    moveUp();
    generate();
  }

  function keyDown() {
    moveDown();
    combineColumn();
    moveDown();
    generate();
  }

  // 检查是否获胜（出现2048）
  function checkForWin() {
    for (let i = 0; i < squares.length; i++) {
      if (squares[i].innerHTML == 2048) {
        resultDisplay.innerHTML = "你赢了！";
        document.removeEventListener("keyup", control);
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchend', handleTouchEnd);
        setTimeout(() => clear(), 3000);
      }
    }
  }

  // 检查游戏是否结束（没有空格且无法合并）
  function checkForGameOver() {
    let zeros = 0;
    for (let i = 0; i < squares.length; i++) {
      if (squares[i].innerHTML == 0) {
        zeros++;
      }
    }
    
    // 没有空格时检查是否还能合并
    if (zeros === 0) {
      let canCombine = false;
      
      // 检查水平方向
      for (let i = 0; i < 15; i++) {
        if (i % 4 !== 3 && squares[i].innerHTML === squares[i + 1].innerHTML) {
          canCombine = true;
          break;
        }
      }
      
      // 检查垂直方向
      if (!canCombine) {
        for (let i = 0; i < 12; i++) {
          if (squares[i].innerHTML === squares[i + width].innerHTML) {
            canCombine = true;
            break;
          }
        }
      }
      
      if (!canCombine) {
        resultDisplay.innerHTML = "游戏结束！";
        document.removeEventListener("keyup", control);
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchend', handleTouchEnd);
        setTimeout(() => clear(), 3000);
      }
    }
  }

  // 清除计时器
  function clear() {
    clearInterval(myTimer);
  }

  // 添加颜色
  function addColours() {
    for (let i = 0; i < squares.length; i++) {
      // 重置所有样式
      squares[i].style.color = "";
      
      if (squares[i].innerHTML == 0)
        squares[i].style.backgroundColor = "#afa192";
      else if (squares[i].innerHTML == 2)
        squares[i].style.backgroundColor = "#eee4da";
      else if (squares[i].innerHTML == 4)
        squares[i].style.backgroundColor = "#ede0c8";
      else if (squares[i].innerHTML == 8) {
        squares[i].style.backgroundColor = "#f2b179";
        squares[i].style.color = "#f9f6f2";
      } else if (squares[i].innerHTML == 16) {
        squares[i].style.backgroundColor = "#ffcea4";
        squares[i].style.color = "#f9f6f2";
      } else if (squares[i].innerHTML == 32) {
        squares[i].style.backgroundColor = "#e8c064";
        squares[i].style.color = "#f9f6f2";
      } else if (squares[i].innerHTML == 64) {
        squares[i].style.backgroundColor = "#ffab6e";
        squares[i].style.color = "#f9f6f2";
      } else if (squares[i].innerHTML == 128)
        squares[i].style.backgroundColor = "#fd9982";
      else if (squares[i].innerHTML == 256)
        squares[i].style.backgroundColor = "#ead79c";
      else if (squares[i].innerHTML == 512)
        squares[i].style.backgroundColor = "#76daff";
      else if (squares[i].innerHTML == 1024)
        squares[i].style.backgroundColor = "#beeaa5";
      else if (squares[i].innerHTML == 2048)
        squares[i].style.backgroundColor = "#d7d4f0";
    }
  }
  addColours();

  var myTimer = setInterval(addColours, 50);
});
