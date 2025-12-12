document.addEventListener("DOMContentLoaded", () => {
    candyCrushGame();
});

function candyCrushGame() {
    const grid = document.querySelector(".grid");
    const scoreDisplay = document.getElementById("score");
    const timerDisplay = document.getElementById("timer");
    const modeSelection = document.getElementById("modeSelection");
    const endlessButton = document.getElementById("endlessMode");
    const timedButton = document.getElementById("timedMode");
    const changeModeButton = document.getElementById("changeMode");

    const width = 8;
    const squares = [];
    let score = 0;
    let currentMode = null;
    let timeLeft = 0;
    let gameInterval = null;
    let timerInterval = null;
    
    // 触控相关变量
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartId = null;
    const swipeThreshold = 50; // 滑动判定阈值

    const candyColors = [
        "url(img/1.png)",
        "url(img/2.png)",
        "url(img/3.png)",
        "url(img/4.png)",
        "url(img/5.png)",
        "url(img/6.png)",
    ];

    function createBoard() {
        grid.innerHTML = "";
        squares.length = 0;
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement("div");
            square.setAttribute("draggable", true);
            square.setAttribute("id", i);
            // 添加触控样式反馈
            square.style.transition = "transform 0.1s ease";
            let randomColor = Math.floor(Math.random() * candyColors.length);
            square.style.backgroundImage = candyColors[randomColor];
            square.style.backgroundSize = "contain";
            square.style.backgroundRepeat = "no-repeat";
            square.style.backgroundPosition = "center";
            grid.appendChild(square);
            squares.push(square);
        }
        
        // 桌面拖拽事件
        squares.forEach(square => {
            square.addEventListener("dragstart", dragStart);
            square.addEventListener("dragend", dragEnd);
            square.addEventListener("dragover", dragOver);
            square.addEventListener("dragenter", dragEnter);
            square.addEventListener("dragleave", dragLeave);
            square.addEventListener("drop", dragDrop);
            
            // 移动端触控事件
            square.addEventListener("touchstart", touchStart);
            square.addEventListener("touchmove", touchMove);
            square.addEventListener("touchend", touchEnd);
        });
    }

    let colorBeingDragged, colorBeingReplaced, squareIdBeingDragged, squareIdBeingReplaced;

    // 桌面拖拽事件处理
    function dragStart() {
        colorBeingDragged = this.style.backgroundImage;
        squareIdBeingDragged = parseInt(this.id);
        this.classList.add("dragging");
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function dragEnter(e) {
        e.preventDefault();
        this.classList.add("hover");
    }

    function dragLeave() {
        this.classList.remove("hover");
    }

    function dragDrop() {
        this.classList.remove("hover");
        colorBeingReplaced = this.style.backgroundImage;
        squareIdBeingReplaced = parseInt(this.id);
        this.style.backgroundImage = colorBeingDragged;
        squares[squareIdBeingDragged].style.backgroundImage = colorBeingReplaced;
    }

    function dragEnd() {
        this.classList.remove("dragging");
        validateMove();
    }

    // 移动端触控事件处理
    function touchStart(e) {
        // 防止触摸时页面滚动
        e.preventDefault();
        
        // 记录触摸起始位置和方块ID
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchStartId = parseInt(this.id);
        
        // 添加触摸反馈
        this.style.transform = "scale(0.95)";
    }

    function touchMove(e) {
        // 防止触摸移动时页面滚动
        e.preventDefault();
    }

    function touchEnd(e) {
        // 恢复触摸反馈样式
        squares[touchStartId].style.transform = "scale(1)";
        
        // 计算触摸结束位置
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        
        // 计算滑动距离
        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;
        
        // 确定滑动方向（优先处理更明显的方向）
        if (Math.abs(diffX) > Math.abs(diffY)) {
            // 水平滑动
            if (Math.abs(diffX) > swipeThreshold) {
                if (diffX > 0) {
                    // 向右滑动 - 与右侧方块交换
                    squareIdBeingReplaced = touchStartId + 1;
                } else {
                    // 向左滑动 - 与左侧方块交换
                    squareIdBeingReplaced = touchStartId - 1;
                }
            }
        } else {
            // 垂直滑动
            if (Math.abs(diffY) > swipeThreshold) {
                if (diffY > 0) {
                    // 向下滑动 - 与下方方块交换
                    squareIdBeingReplaced = touchStartId + width;
                } else {
                    // 向上滑动 - 与上方方块交换
                    squareIdBeingReplaced = touchStartId - width;
                }
            }
        }
        
        // 如果有有效的交换目标，执行交换
        if (squareIdBeingReplaced !== null && squareIdBeingReplaced >= 0 && squareIdBeingReplaced < squares.length) {
            squareIdBeingDragged = touchStartId;
            colorBeingDragged = squares[squareIdBeingDragged].style.backgroundImage;
            colorBeingReplaced = squares[squareIdBeingReplaced].style.backgroundImage;
            
            // 执行交换
            squares[squareIdBeingDragged].style.backgroundImage = colorBeingReplaced;
            squares[squareIdBeingReplaced].style.backgroundImage = colorBeingDragged;
            
            // 验证移动是否有效
            validateMove();
        }
        
        // 重置变量
        squareIdBeingReplaced = null;
        touchStartId = null;
    }

    // 验证移动是否有效（共享函数，同时用于桌面和移动）
    function validateMove() {
        let validMoves = [
            squareIdBeingDragged - 1,      // 左
            squareIdBeingDragged - width,  // 上
            squareIdBeingDragged + 1,      // 右
            squareIdBeingDragged + width   // 下
        ];
        let validMove = validMoves.includes(squareIdBeingReplaced);

        if (squareIdBeingReplaced && validMove) {
            squareIdBeingReplaced = null;
        } else if (squareIdBeingReplaced && !validMove) {
            // 无效移动，恢复原状
            squares[squareIdBeingReplaced].style.backgroundImage = colorBeingReplaced;
            squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
        } else {
            squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
        }
    }

    function moveIntoSquareBelow() {
        // 顶部填充新糖果
        for (let i = 0; i < width; i++) {
            if (squares[i].style.backgroundImage === "") {
                let randomColor = Math.floor(Math.random() * candyColors.length);
                squares[i].style.backgroundImage = candyColors[randomColor];
            }
        }
        
        // 下落逻辑
        for (let i = 0; i < width * (width - 1); i++) {
            if (squares[i + width].style.backgroundImage === "") {
                squares[i + width].style.backgroundImage = squares[i].style.backgroundImage;
                squares[i].style.backgroundImage = "";
            }
        }
    }

    function checkRowForFour() {
        for (let i = 0; i < 60; i++) {
            if (i % width >= width - 3) continue;
            let rowOfFour = [i, i + 1, i + 2, i + 3];
            let decidedColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === "";
            if (rowOfFour.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                score += 4;
                scoreDisplay.innerHTML = score;
                rowOfFour.forEach(index => {
                    squares[index].style.backgroundImage = "";
                    // 添加消除动画效果
                    squares[index].classList.add("matched");
                    setTimeout(() => squares[index].classList.remove("matched"), 300);
                });
            }
        }
    }

    function checkColumnForFour() {
        for (let i = 0; i < 40; i++) {
            let columnOfFour = [i, i + width, i + 2 * width, i + 3 * width];
            let decidedColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === "";
            if (columnOfFour.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                score += 4;
                scoreDisplay.innerHTML = score;
                columnOfFour.forEach(index => {
                    squares[index].style.backgroundImage = "";
                    squares[index].classList.add("matched");
                    setTimeout(() => squares[index].classList.remove("matched"), 300);
                });
            }
        }
    }

    function checkRowForThree() {
        for (let i = 0; i < 62; i++) {
            if (i % width >= width - 2) continue;
            let rowOfThree = [i, i + 1, i + 2];
            let decidedColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === "";
            if (rowOfThree.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                score += 3;
                scoreDisplay.innerHTML = score;
                rowOfThree.forEach(index => {
                    squares[index].style.backgroundImage = "";
                    squares[index].classList.add("matched");
                    setTimeout(() => squares[index].classList.remove("matched"), 300);
                });
            }
        }
    }

    function checkColumnForThree() {
        for (let i = 0; i < 48; i++) {
            let columnOfThree = [i, i + width, i + 2 * width];
            let decidedColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === "";
            if (columnOfThree.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                score += 3;
                scoreDisplay.innerHTML = score;
                columnOfThree.forEach(index => {
                    squares[index].style.backgroundImage = "";
                    squares[index].classList.add("matched");
                    setTimeout(() => squares[index].classList.remove("matched"), 300);
                });
            }
        }
    }

    function gameLoop() {
        checkRowForFour();
        checkColumnForFour();
        checkRowForThree();
        checkColumnForThree();
        moveIntoSquareBelow();
    }

    function startGame(mode) {
        currentMode = mode;
        modeSelection.style.display = "none";
        grid.style.display = "flex";
        scoreDisplay.parentElement.style.display = "flex";
        createBoard();
        score = 0;
        scoreDisplay.innerHTML = score;
        gameInterval = setInterval(gameLoop, 100);

        if (mode === "timed") {
            timeLeft = 120;
            updateTimerDisplay();
            timerDisplay.style.display = "block";
            timerInterval = setInterval(() => {
                timeLeft--;
                updateTimerDisplay();
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    endGame();
                }
            }, 1000);
        } else {
            timerDisplay.style.display = "none";
        }
    }

    function updateTimerDisplay() {
        if (currentMode === "timed") {
            let minutes = Math.floor(timeLeft / 60);
            let seconds = timeLeft % 60;
            timerDisplay.innerHTML = `剩余时间: ${minutes}:${seconds.toString().padStart(2, "0")}`;
            
            // 时间少于10秒时添加警告样式
            if (timeLeft < 10) {
                timerDisplay.classList.add("warning");
            } else {
                timerDisplay.classList.remove("warning");
            }
        }
    }

    function endGame() {
        clearInterval(gameInterval);
        squares.forEach(square => square.setAttribute("draggable", false));
        // 使用更适合移动设备的对话框
        if (confirm(`时间到！你的分数是 ${score}\n再玩一次？`)) {
            startGame(currentMode);
        } else {
            changeMode();
        }
    }

    function changeMode() {
        clearInterval(gameInterval);
        if (currentMode === "timed") {
            clearInterval(timerInterval);
        }
        grid.style.display = "none";
        scoreDisplay.parentElement.style.display = "none";
        timerDisplay.style.display = "none";
        modeSelection.style.display = "flex";
    }

    // 添加响应式调整
    function adjustForMobile() {
        const isMobile = window.innerWidth < 768;
        if (isMobile) {
            grid.style.maxWidth = "90vw";
            grid.style.maxHeight = "90vw";
        } else {
            grid.style.maxWidth = "600px";
            grid.style.maxHeight = "600px";
        }
    }

    // 初始化时调整一次
    adjustForMobile();
    // 窗口大小变化时重新调整
    window.addEventListener('resize', adjustForMobile);

    endlessButton.addEventListener("click", () => startGame("endless"));
    timedButton.addEventListener("click", () => startGame("timed"));
    changeModeButton.addEventListener("click", changeMode);
}
