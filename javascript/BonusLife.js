class BonuseLife {
  constructor({ x, y, size, speed, dx, dy }) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
    this.dx = dx;
    this.dy = dy;
  }

  // Draw BounceLife on canvas
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText("+", this.x - this.size / 3, this.y + this.size / 3);

    ctx.fillStyle = "white";
    ctx.closePath();
   
    // if(bonusCoin.visible == true){

      

    //     // Create gradient
    //     // // Fill with gradient
    //     // ctx.fillStyle = "blue";
    //     // ctx.font = "14px Arial";
    //     // ctx.fillText("+", this.x - this.size / 3, this.y + this.size / 3);
    //     // ctx.closePath();
    // }else{
    //     ctx.fillStyle = "transparent";
    // }
    if(bonusCoin.visible == false){
        ctx.fillStyle = "transparent"
    }

  }

  // Move BounceLife on canvas
  move() {
    this.y += (this.speed * this.dy);

  }
}
