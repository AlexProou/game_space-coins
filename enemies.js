class Enemy {
    constructor() {
        this.frameX = 0;
        this.frameY = 0;
        this.fps = 20;
        this.frameInterval = 1000 / this.fps;
        this.frameTimer = 0;
        this.markedForDeletion = false;
        this.lives = 1;
        this.score = this.lives;

    }
    update(deltaTime) {
        this.x -= this.speedX;
        this.y += this.speedY;
        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0;
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0;
        } else {
            this.frameTimer += deltaTime;
        }

        if (this.x + this.width < 0) this.markedForDeletion = true;

    }
    draw(context) {

        context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height)

       
    }
}


export class AlienEnemy extends Enemy {
    constructor(game) {
        super();
        this.game = game;
        this.width = 175;
        this.height = 170;
        this.x = this.game.width + Math.random() * this.game.width * 0.5;
        this.y = Math.random() * this.game.height - 200;
        this.speedX = Math.random() + 1;
        this.speedY = 0;
        this.maxFrame = 3;
        this.image = document.getElementById('alien_enemy');

    }
    update(deltaTime) {
        super.update(deltaTime);


    }

}

