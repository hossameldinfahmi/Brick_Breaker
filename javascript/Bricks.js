class Bricks {
    constructor(rowCount, colCount, brickInfo) {
        this.rowCount = rowCount;
        this.colCount = colCount;
        this.brickInfo = brickInfo;
        this.bricks = [];
        for (let i = 0; i < rowCount; i++) {
            this.bricks[i] = [];
            for (let j = 0; j < colCount; j++) {
                const x = i * (this.brickInfo.w + this.brickInfo.padding) + this.brickInfo.offsetX;
                const y = j * (this.brickInfo.h + this.brickInfo.padding) + this.brickInfo.offsetY;
                this.bricks[i][j] = { x, y, ...this.brickInfo };
            }
        }
    }
    
    // Draw bricks on canvas
    draw() {
        this.bricks.forEach(column => {
            column.forEach(brick => {
                ctx.beginPath();
                ctx.rect(brick.x, brick.y, brick.w, brick.h);
                ctx.closePath();

                if (brick.crashed == 1) {
                    ctx.beginPath();

                    // Chrash Shape Draw
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
                } else if (brick.visible == false) {
                    ctx.fillStyle = "transparent";
                    if(brick.hasBonus == true){                        
                        bonusCoin.draw();
                        bonusCoin.move();
                    }

                } else {
                    ctx.fillStyle = "#F8CC41";
                }
                ctx.fill();
                ctx.closePath();
            });
        });
    }

    // Make all bricks appear
    showAll() {
        this.bricks.forEach(column => {
            column.forEach(brick => (brick.visible = true));
        });
    }
}