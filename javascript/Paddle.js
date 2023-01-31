class Paddle {
    constructor({ x, y, w, h, dx, speed }) {
        this.x = x || canvas.width / 2 - 40;
        this.y = y || canvas.height - 20;
        this.w = w || 120;
        this.h = h || 10;
        // right:1, left:-1, stop:0
        this.dx = dx || 0;
        this.speed = speed || 4;
    }

    // Draw paddle on canvas
    draw() {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.w, this.h);
        // Create gradient
        var grd = ctx.createLinearGradient(0, 0, 500, 0);
        grd.addColorStop(0, "#8E68E6");
        grd.addColorStop(1, "#690F8A");
        ctx.fillStyle = grd;
        ctx.fill();
        ctx.closePath();
    }

    // Move paddle on canvas
    move() {
        this.x += (this.speed * this.dx);

        // Wall detection
        if (this.x + this.w > canvas.width) {
            this.x = canvas.width - this.w;
        }
        if (this.x < 0) {
            this.x = 0;
        }
    }

    // Move Paddle with mouse
    moveMouse(e, stage) {
        var x = e.clientX;
        if (stage == 'gameRunning') {
            this.x = x - this.y + this.w;

            if (this.x <= 0) {
                this.x = 0;
            }
            else if (this.x >= canvas.width - this.w) {
                this.x = canvas.width - this.w;
            }
        }
        canvas.style.cursor = "none";
    };
}