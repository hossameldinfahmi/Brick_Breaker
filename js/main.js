const paddleBoard = document.querySelector(".paddleBoard");
const body = document.querySelector("body");
const ball = document.querySelector(".ball");




body.addEventListener('mousemove', animtionBoard);
function animtionBoard(e){
    var x =e.clientX;
    var y =e.clientY;
    // paddleBoard.style.right= x + "px";

    var boardPosstion = paddleBoard.style.left;
    var screenWidth = screen.width;
    console.log(`left ${boardPosstion}`);

    if(boardPosstion + 300 >= screenWidth){
        body.removeEventListener();
    }else{
        paddleBoard.postion = x;
        console.log(paddleBoard.postion);
        paddleBoard.style.left= paddleBoard.postion + "px";
    } 
};


var speedX = 20;
var speedY = 20;
const ballD = 30;
var width = window.innerWidth;
var height = window.innerHeight;
let postionY = height / 2;
let postionX = width / 2;
ball.style.left = `${postionX}px`;
ball.style.top = `${postionY}px`;



let ballMoving = setInterval(function(){
    postionX += speedX;
    postionY += speedY;
    ball.style.left = `${postionX}px`;
    ball.style.top = `${postionY}px`;

    if(postionY + ballD >= height || postionY <= 0){
        speedY *= -1;
    }

    if(postionX + ballD >= width || postionX <= 0 ){
        speedX *= -1;
    }


}, 100); 
