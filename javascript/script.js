const rulesBtn = document.getElementById('rules-btn');
const closeBtn = document.getElementById('close-btn');
const rules = document.getElementById('rules');
const canvas = document.getElementById('canvas');
const easyBtn = document.querySelector('.easy-btn');
const medBtn = document.querySelector('.med-btn');
const hardBtn = document.querySelector('.hard-btn');
const htmlBody = document.querySelector("body");
const ctx = canvas.getContext('2d');
const popup = document.getElementById('popup');
const finalScore = document.getElementById('finalScore');
const hello = document.getElementById("hello");
const formCont = document.getElementById("formCont");

// Sound Effects
const bgSnd = new Audio("./soundEffects/bgSnd.mp3");
const hitSnd = new Audio("./soundEffects/pop.mp3");

// play bgsnd
let score = 0;
let playerLife = 3;
let lost = 0;
const brickRowCount = 9;
const brickColumnCount = 5;

//levels
easyBtn.addEventListener('click', function (e) {
    easyBtn.classList.remove('toggle');
    medBtn.classList.add('toggle');
    hardBtn.classList.add('toggle');
    e.preventDefault();
    ball.dx = 4;
});
medBtn.addEventListener('click', function (e) {
    medBtn.classList.remove('toggle');
    easyBtn.classList.add('toggle');
    hardBtn.classList.add('toggle');
    e.preventDefault();
    ball.dx = 12;
});
hardBtn.addEventListener('click', function (e) {
    hardBtn.classList.remove('toggle');
    easyBtn.classList.add('toggle');
    medBtn.classList.add('toggle');
    e.preventDefault();
    ball.dx = 20;
})

// Keyboard event handlers
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
htmlBody.addEventListener('mousemove', animtionBoard);

// Rules and close event handlers
rulesBtn.addEventListener('click', () => rules.classList.add('show'));
closeBtn.addEventListener('click', () => rules.classList.remove('show'));

// Create ball props
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 6,
    speed: 4,
    dx: 2,
    dy: -2
};

// Create paddle props
const paddle = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 20,
    w: 120,
    h: 10,
    speed: 8,
    dx: 0
};

// Draw animated bg

// Create brick props
const brickInfo = {
    w: 70,
    h: 20,
    padding: 10,
    offsetX: 45,
    offsetY: 60,
    crashed: 2,
    visible: true
};

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

// Create bricks
const bricks = [];
for (let i = 0; i < brickRowCount; i++) {

    bricks[i] = [];
    for (let j = 0; j < brickColumnCount; j++) {
        const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
        const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
        bricks[i][j] = { x, y, ...brickInfo };
    }
}

// Draw ball on canvas
function drawBall() {
  
  ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    var grd2 = ctx.createLinearGradient(0, 0, 50, 0);
    grd2.addColorStop(0, "#1279C6");
    grd2.addColorStop(1, "#179CFF");
  
  ctx.fillStyle = grd2;
    ctx.fill();
    ctx.closePath();
}

// Draw paddle on canvas
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
    // Create gradient
    var grd = ctx.createLinearGradient(0, 0, 500, 0);
    grd.addColorStop(0, "#8E68E6");
    grd.addColorStop(1, "#690F8A");
  ctx.fillStyle = grd;
  ctx.fill();
  ctx.closePath();
}

// Draw score oon canvas
function drawScore() {
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
    ctx.font = '20px Arial';
    ctx.fillText(`Your Life: ${playerLife}`, canvas.width - 760, 30);
}

// Draw bricks on canvas
function drawBricks() {
    bricks.forEach(column => {
        column.forEach(brick => {
            ctx.beginPath();
            ctx.rect(brick.x, brick.y, brick.w, brick.h);
            // ctx.strokeRect(brick.x,brick.y,brick.w,brick.h);
      ctx.closePath();

      // ctx.fillStyle = brick.crashed == 1 ? '#000' : 'transparent';
      // ctx.fillStyle = brick.visible ? '#0095dd' : 'transparent';



      if(brick.crashed == 1){
        ctx.beginPath();

                ctx.moveTo(brick.x, brick.y);
                ctx.lineTo(brick.x + 10, brick.y + 20);
                ctx.lineTo(brick.x + 20, brick.y + 0);

                ctx.lineTo(brick.x + 20, brick.y + 0);
                ctx.lineTo(brick.x + 30, brick.y + 20);

                ctx.lineTo(brick.x + 30, brick.y + 0);
                ctx.lineTo(brick.x + 50, brick.y + 0);

                ctx.lineTo(brick.x + 50, brick.y + 0);
                ctx.lineTo(brick.x + 60, brick.y + 20);

        ctx.fillStyle = "#F8CC41";
        // ctx.strokeStyle= "transparent";
        ctx.lineWidth = 2;
        ctx.stroke();
      }else if (brick.visible == false ){
        ctx.fillStyle = "transparent";
        // ctx.strokeStyle = "transparent";
      }else{
        ctx.fillStyle = "#F8CC41";
        // ctx.strokeStyle = "#BF9B2A";
      }
      ctx.fill();
      ctx.closePath();
    });
  });
}

// Move paddle on canvas
function movePaddle() {
    paddle.x += paddle.dx;

    // Wall detection
    if (paddle.x + paddle.w > canvas.width) {
        paddle.x = canvas.width - paddle.w;
    }
    if (paddle.x < 0) {
        paddle.x = 0;
    }
}

// Move Paddle with mouse
function animtionBoard(e) {
    var x = e.clientX;
    var y = e.clientY;
    paddle.x = x - paddle.y + paddle.w;
    canvas.style.cursor = "none";
};

// Move ball on canvas
function moveBall() {

  ball.x += ball.dx;
  ball.y += ball.dy;
  bgSnd.play()

    // Wall collision (right/left)
    if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
        ball.dx *= -1; // ball.dx = ball.dx * -1
    }

    // Wall collision (top/bottom)
    if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
        ball.dy *= -1;
    }

    // console.log(ball.x, ball.y);

    // Paddle collision


    if (
        ball.x + ball.size > paddle.x &&
        ball.x < paddle.x + paddle.w / 3 &&
        ball.y + ball.size > paddle.y
    ) {
        ball.dy = -ball.speed;
        ball.dx = -ball.speed;
    }else if(
        ball.x + ball.size > paddle.x + paddle.w / 1.5  &&
         ball.x < paddle.x + paddle.w &&
        ball.y + ball.size > paddle.y
    ) {
        ball.dy = -ball.speed;
        ball.dx = +ball.speed;
    }else if(
        ball.x + ball.size > paddle.x &&
        ball.x < paddle.x + paddle.w &&
        ball.y + ball.size > paddle.y
    ) {
        ball.dy = -ball.speed;
    }




    // Brick collision
    bricks.forEach(column => {

        column.forEach(brick => {

      if (brick.visible) {
        if (
          ball.x + ball.size > brick.x && // left brick side check
          ball.x < brick.x + brick.w && // rig  ht brick side check
          ball.y + ball.size > brick.y && // top brick side check
          ball.y < brick.y + brick.h &&  // bottom brick side check
            ball.y < brick.y + brick.w && // top of ball and right of brick
            ball.y + ball.size  < brick.y + brick.w && // bottom of ball and right of brick
            ball.y > brick.y && // top of ball and left of brick
            ball.y + ball.size  > brick.y  // bottom of ball and left of brick

        ) {
            console.log(ball.x);
            console.log(ball.y);
            // console.log(ball.size);
            console.log(brick.x);
            console.log(brick.y);
            console.log("========");
          hitSnd.play()
          hitSnd.play()
          ball.dy *= -1;
          brick.crashed--;

          if(brick.crashed < 1 ){

            increaseScore();
             brick.visible = false;
          }
          
        }
      }
    });
  });

    // Hit bottom wall - Lose
    if (ball.y + ball.size > canvas.height) {
        //showAllBricks();
        //score = 0;
        playerLife--;
        if (playerLife == 0) {
            hitSnd.pause();
            bgSnd.pause();
            lost = 1;
            gameOver();
        }
        localStorage.clear();
    }
}

// GAME OVER
function gameOver() {
    finalScore.innerText = `Your Score: ${score}`
    popup.classList.add("open-popup");
    ball.dx = 0;
    ball.dy = 0;
    document.removeEventListener('keydown');
    document.removeEventListener('keyup');
}
function repeatGame(){
    document.location.reload();
    popup.classList.remove("open-popup");
}

// Increase score
function increaseScore() {
    score++;
    saveToLocalStorage(score)
    if (score % (brickRowCount * brickRowCount) === 0) {
        showAllBricks();
    }
}

// Make all bricks appear
function showAllBricks() {
    bricks.forEach(column => {
        column.forEach(brick => (brick.visible = true));
    });
}

function Drawbg(){


  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }


  for(i=0;i<50;i++){
// arc
    let x = Math.random() * window.innerWidth;
    let y = Math.random() * window.innerHeight;
    let size = getRandomInt(4);
    ctx.beginPath();
    ctx.arc(x, y, size,0,Math.PI * 2, false);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.shadowColor = "white";
    ctx.shadowBlur = 15;
    ctx.stroke();

  }
  // function animateBg() {
  //   console.log('Hello world');
  // }
  //
  // setInterval(animateBg, 1000);
}

// Keydown event
function keyDown(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        paddle.dx = paddle.speed;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        paddle.dx = -paddle.speed;
    }
}

// Keyup event
function keyUp(e) {
    if (
        e.key === 'Right' ||
        e.key === 'ArrowRight' ||
        e.key === 'Left' ||
        e.key === 'ArrowLeft'
    ) {
        paddle.dx = 0;
    }
}

// Draw everything
function draw() {
    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    Drawbg();
    drawBall();
    drawPaddle();
    drawScore();
    drawBricks();

}


// Update canvas drawing and animation
start.onclick = function update(){

    hello.style.display="block";
  canvas.style.display="block";
  formCont.style.zIndex = -55555;

    movePaddle();
    moveBall();

    // Draw everything
    draw();

    hello.innerText = 'Hi, '+document.getElementById("name").value;

    requestAnimationFrame(update);
}

update();
