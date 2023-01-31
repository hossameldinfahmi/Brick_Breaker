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
    
    ctx.drawImage(heartImg, this.x - this.size, this.y - this.size, this.size * 2, this.size * 2);
   
  
    if(bonusCoin.visible == false){
        this.size = 0;
    }

  }

  // Move BounceLife on canvas
  move() {
    this.y += (this.speed * this.dy);
    

  }
}
