const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const rulesBtn = document.getElementById('rules-btn');
const closeBtn = document.getElementById('close-btn');
const rules = document.getElementById('rules');
const popup = document.getElementById('popup');
const finalScore = document.getElementById('finalScore');
const hello = document.getElementById("hello");
const formCont = document.getElementById("formCont");
const levelBtns = Array.from(document.getElementsByClassName('level-btn'));
const popupHeader = document.querySelector('.pop-up-header')
// Sound Effects
const bgSnd = new Audio("./soundEffects/bgSnd.mp3");
const hitSnd = new Audio("./soundEffects/pop.mp3");

// globals
let score = 0;
let playerLife = 3;
let countRemainingBricks = 45;
// startMenu, gameWaiting, gameRunning, gameDone
let stage = 'startMenu';

//levels
levelBtns.forEach((levelBtn, index) => {
    levelBtn.addEventListener('click', e => {
        // add toggle to all buttons
        levelBtns.forEach(lvlBtn => lvlBtn.classList.add('toggle'))
        // remove toggle from the clicked button
        e.target.classList.remove('toggle');
        e.preventDefault();
        // increase speed based on index: [easy, medium, hard]
        ball.speed = 4 * (index + 1);
    })
});

// Rules and close event handlers
rulesBtn.addEventListener('click', () => rules.classList.add('show'));
closeBtn.addEventListener('click', () => rules.classList.remove('show'));

const paddle = new Paddle({
    x: canvas.width / 2 - 40,
    y: canvas.height - 20,
    w: 120,
    h: 10,
    // right:1, left:-1, stop:0
    dx: 0,
    speed: 4
});

// Create ball props
const ball = new Ball({
    // position at the middle of the paddle
    x: paddle.x + paddle.w / 2,
    y: paddle.y - paddle.h,
    size: 6,
    speed: 4,
    // right:1, left:-1, stop:0
    dx: 0,
    dy: 0
});

// Create brick props
const bricks = new Bricks(9, 5, {
    w: 70,
    h: 20,
    padding: 10,
    offsetX: 45,
    offsetY: 60,
    crashed: 2,
    hasBonus: false,
    breakable:true,
    visible: true
});

// Create ball props
const bonusCoin = new BonuseLife({
    // position at the middle of the paddle
    x: canvas.width/2,
    y: canvas.height / 8,
    size: 14,
    speed: 4,
    dy: 1,
    visible: true
});

// Keyboard event handlers
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
document.addEventListener('mousemove', (e) => paddle.moveMouse(e, stage));
document.addEventListener('mousedown', mouseClicked);

// Draw score oon canvas
function drawScore() {
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
    ctx.font = '20px Arial';
    ctx.fillText(`Your Life: ${playerLife}`, canvas.width - 760, 30);
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function drawBg() {
    for (i = 0; i < 50; i++) {
        // arc
        let x = Math.random() * window.innerWidth;
        let y = Math.random() * window.innerHeight;
        let size = getRandomInt(4);
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2, false);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.shadowColor = "white";
        ctx.shadowBlur = 15;
        ctx.stroke();
    }
}

//localStorage
function saveToLocalStorage(data) {
    let arr;
    if (localStorage.getItem('MyScore') === null) {
        arr = 0;
    } else {
        arr = JSON.parse(localStorage.getItem('MyScore'))
    }
    arr++;
    localStorage.setItem('MyScore', JSON.stringify(arr));
}

// Increase score
function increaseScore() {
    score++;
    saveToLocalStorage(score)
    if (score % (bricks.rowCount * bricks.rowCount) === 0) {
        bricks.showAll();
    }
}

function handleCollision() {
    // Wall collision (right/left)
    if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
        ball.dx *= -1; // ball.dx = ball.dx * -1
    }

    // Wall collision (top/bottom)
    if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
        ball.dy *= -1;
    }

    // Paddle collision
    if (
        ball.x + ball.size > paddle.x &&
        ball.x < paddle.x + paddle.w / 3 &&
        ball.y + ball.size > paddle.y
    ) {
        ball.dy = -1;
        ball.dx = -1;
    } else if (
        ball.x + ball.size > paddle.x + paddle.w / 1.5 &&
        ball.x < paddle.x + paddle.w &&
        ball.y + ball.size > paddle.y
    ) {
        ball.dy = -1;
        ball.dx = +1;
    } else if (
        ball.x + ball.size > paddle.x &&
        ball.x < paddle.x + paddle.w &&
        ball.y + ball.size > paddle.y
    ) {
        ball.dy = -1;
    }

    // Bounse paddle collision 
    if (
        bonusCoin.x + bonusCoin.size > paddle.x &&
        bonusCoin.x < paddle.x + paddle.w &&
        bonusCoin.y + bonusCoin.size > paddle.y
    ) {
        playerLife++;
        bonusCoin.visible = false;
        bonusCoin.dy = -1;
        bonusCoin.dx = +1;
       
        
    }

    // brick.bricks[1][2].breakable= false;
      
    
    
    // Brick collision
    bricks.bricks.forEach(column => {
        column.forEach(brick => {
            


            if (brick.visible && brick.breakable == true) {
                
                if (
                    ball.x + ball.size > brick.x && // left brick side check
                    ball.x < brick.x + brick.w && // right brick side check
                    ball.y + ball.size > brick.y && // top brick side check
                    ball.y < brick.y + brick.h &&  // bottom brick side check
                    ball.y < brick.y + brick.w && // top of ball and right of brick
                    ball.y + ball.size < brick.y + brick.w && // bottom of ball and right of brick
                    ball.y > brick.y && // top of ball and left of brick
                    ball.y + ball.size > brick.y  // bottom of ball and left of brick
                ) {

                    // if(brick.breakable == false){
                    //     brick.visible = ture;
                    //     ball.dy *= -1;
                    //     brick.crashed = 2;
                    // }
                    // if(
                    //     ball.x + ball.size > brick.x && // left brick side check
                    //     ball.x < brick.x + brick.w  // right brick side check
                    // ){
                    //     ball.dx *= -1;
                    // }else{
                            
                    // }
                     ball.dy *= -1;

                    
                    

                    hitSnd.play()
                    hitSnd.play()
                 
                  
                   
                    brick.crashed--;

                    var randBrick = getRandomInt(45);

                    if(randBrick == 2){
                        brick.hasBonus = true;
                        bonusCoin.x = brick.x;
                        bonusCoin.y = brick.y;
                        console.log(randBrick)
                        console.log(brick.hasBonus)

                    }
                    // if(randBrick == 3){
                    //    brick.breakable = false;

                    // }
                    if (brick.crashed < 1) {
                        increaseScore();
                        brick.visible = false;
                        countRemainingBricks --;
    
                    }
                    if(countRemainingBricks == 0){
                        popupHeader.textContent = 'Congrats for winning';
                        finalScore.innerText = `Your Score: ${score}`;
                        popup.classList.add("open-popup");   
                    }
                }
            }
        });
    });



    bricks.bricks.forEach(column => {
        column.forEach(brick => {
            
                 if (brick.breakable == false) {

                // ctx.fillStyle = "#ffff";
                if (
                    ball.x + ball.size > brick.x && // left brick side check
                    ball.x < brick.x + brick.w && // right brick side check
                    ball.y + ball.size > brick.y && // top brick side check
                    ball.y < brick.y + brick.h &&  // bottom brick side check
                    ball.y < brick.y + brick.w && // top of ball and right of brick
                    ball.y + ball.size < brick.y + brick.w && // bottom of ball and right of brick
                    ball.y > brick.y && // top of ball and left of brick
                    ball.y + ball.size > brick.y  // bottom of ball and left of brick
                ) {

                     ball.dy *= -1;
                     ball.dx *= -1;
                    hitSnd.play()
                    hitSnd.play()
}
            }
        });
    });




    // Bounse collision


    // Hit bottom wall - Lose
    if (ball.y + ball.size > canvas.height) {
        // stop ball and paddle movement
        stage = 'gameWaiting';
        // reset ball and paddle positions
        paddle.x = canvas.width / 2 - 40;
        paddle.y = canvas.height - 20;
        ball.x = paddle.x + paddle.w / 2;
        ball.y = paddle.y - paddle.h;

        playerLife--;
        if (playerLife == 0) {
            gameOver();
        }
        localStorage.clear();
    }
}

// GAME OVER
function gameOver() {
    bgSnd.pause();
    finalScore.innerText = `Your Score: ${score}`
    popup.classList.add("open-popup");
    ball.dx = 0;
    ball.dy = 0;
    stage = 'gameDone';
}

function repeatGame() {
    document.location.reload();
    popup.classList.remove("open-popup");
}

function mouseClicked() {
    if (stage === 'gameWaiting') {
        console.log('detected click. changing game state!!');
        stage = 'gameRunning';
        // give ball initial direction to start moving
        ball.dx = 1;
        ball.dy = -1;
    }
}

// Keydown event to move paddle and start game
function keyDown(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        paddle.dx = 1;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        paddle.dx = -1;
    }
    // if space key is pressed, start moving the ball
    if ((e.key === ' ' || e.key === 'Space') && stage === 'gameWaiting') {
        console.log('detected space button. changing game state!!');
        stage = 'gameRunning';
        // give ball initial direction to start moving
        ball.dx = 1;
        ball.dy = -1;
    }
}

// Keyup event to stop paddle
function keyUp(e) {
    let keys = ['Right', 'ArrowRight', 'Left', 'ArrowLeft'];
    if (keys.includes(e.key)) paddle.dx = 0;
}

// Draw everything
function draw() {
    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    paddle.draw();
    drawScore();
    drawBg();
    bricks.draw();
    ball.draw();
}


// Update canvas drawing and animation
start.onclick = () => {
    hello.style.display = "block";
    canvas.style.display = "block";
    formCont.style.zIndex = -55555;

    let name = document.getElementById("name").value || 'User';
    hello.innerText = 'Hi, ' + name;

    // update game stage to wait for space before starting
    stage = 'gameWaiting';
    bgSnd.play()
    drawAnimation();
}

/**
 * TODO: investigate weird behavior: need to click anywhere in the document
 * after the start menu for the space mouse to be detected and start moving paddle
 */
function drawAnimation() {
    if (['gameWaiting', 'gameRunning'].includes(stage)) {
        draw();
        if (stage == 'gameRunning') {
            paddle.move();
            ball.move();
            handleCollision();
        }
        window.requestAnimationFrame(drawAnimation);
    }
}
