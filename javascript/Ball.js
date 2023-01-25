class Ball {
    constructor({ x, y, size, speed, dx, dy }) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = speed;
        // right:1, left:-1, stop:0
        this.dx = dx;
        this.dy = dy;
    }

    // Draw ball on canvas
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        var grd2 = ctx.createLinearGradient(0, 0, 50, 0);
        grd2.addColorStop(0, "#1279C6");
        grd2.addColorStop(1, "#179CFF");

        ctx.fillStyle = grd2;
        ctx.fill();
        ctx.closePath();
    }

    // Move ball on canvas
    move() {
        this.x += (this.speed * this.dx);
        this.y += (this.speed * this.dy);
    }
}