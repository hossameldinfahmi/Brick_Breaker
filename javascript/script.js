const rulesBtn = document.getElementById('rules-btn');
const closeBtn = document.getElementById('close-btn');
const rules = document.getElementById('rules');
const canvas = document.getElementById('canvas');
const easyBtn = document.querySelector('.easy-btn');
const medBtn = document.querySelector('.med-btn');
const hardBtn = document.querySelector('.hard-btn');
const htmlBody = document.querySelector("body");
const ctx = canvas.getContext('2d');
let score = 0;
let playerLife = 3;
let lost = 0;
const brickRowCount = 9;
const brickColumnCount = 5;

// Create ball props
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 10,
  speed: 4,
  dx: 4,
  dy: -4
};
//levels
easyBtn.addEventListener('click',function(){
  ball.dx = 4;
});
medBtn.addEventListener('click',function(){
  ball.dx = 12;
});
hardBtn.addEventListener('click',function(){
  ball.dx = 20;
})
//localStorage
function saveToLocalStorage(data){
  let arr;
  if(localStorage.getItem('MyScore') === null ){
    arr = 0;
  }else{
    arr = JSON.parse(localStorage.getItem('MyScore'))
  }
  arr++;
  localStorage.setItem('MyScore',JSON.stringify(arr));
}
// Create paddle props
const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  w: 80,
  h: 10,
  speed: 8,
  dx: 0
};

// Create brick props
const brickInfo = {
  w: 70,
  h: 20,
  padding: 5,
  offsetX: 45,
  offsetY: 60,
  crashed:2,
  visible: true
};

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
  ctx.fillStyle = '#0095dd';
  ctx.fill();
  ctx.closePath();
}

// Draw paddle on canvas
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = '#0095dd';
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
      // ctx.fillStyle = brick.crashed == 1 ? '#000' : 'transparent';
      // ctx.fillStyle = brick.visible ? '#0095dd' : 'transparent';

      if(brick.crashed == 1){
        ctx.fillStyle = "rgba(199, 0, 57, 0.5)";
      }else if (brick.visible == false ){
        ctx.fillStyle = "transparent";
      }else{
        ctx.fillStyle = "rgba(199, 0, 57, 1)";
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
htmlBody.addEventListener('mousemove', animtionBoard);
function animtionBoard(e){
  var x =e.clientX;
  var y =e.clientY;

  paddle.x = x - 400;
  canvas.style.cursor="none";

};

// Move ball on canvas
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

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
    ball.x - ball.size > paddle.x &&
    ball.x + ball.size < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y
  ) {
    ball.dy = -ball.speed;
  }

  // Brick collision
  bricks.forEach(column => {
    column.forEach(brick => {
      if (brick.visible) {
        if (
          ball.x - ball.size > brick.x && // left brick side check
          ball.x + ball.size < brick.x + brick.w && // right brick side check
          ball.y + ball.size > brick.y && // top brick side check
          ball.y - ball.size < brick.y + brick.h // bottom brick side check
        ) {
          ball.dy *= -1;
          brick.crashed--;
          console.log(brick.crashed);

         

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
    playerLife --;
    if(playerLife == 0){
      lost = 1;
      ball.dx = 0;
      ball.dy = 0;
      document.removeEventListener('keydown');
      document.removeEventListener('keyup');
    }
    localStorage.clear();
  }
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

// Draw everything
function draw() {
  // clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBall();
  drawPaddle();
  drawScore();
  drawBricks();
}

// Update canvas drawing and animation
function update() {
  movePaddle();
  moveBall();

  // Draw everything
  draw();

  requestAnimationFrame(update);
}

update();

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

// Keyboard event handlers
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

// Rules and close event handlers
rulesBtn.addEventListener('click', () => rules.classList.add('show'));
closeBtn.addEventListener('click', () => rules.classList.remove('show'));
