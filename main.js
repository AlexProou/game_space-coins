import { InputHandler } from "./input.js";
import { Projectile } from "./projectile.js";
import { Coin } from "./money.js";

import { Background } from "./background.js";

import { AlienEnemy } from "./enemies.js";

import { UI } from "./UI.js";
import { CollisionAnimation } from './collisionAnimation.js';

window.addEventListener('load', function () {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 500;

    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.speed = 3;
            this.groundMargin = 80;
            this.background = new Background(this);
            this.input = new InputHandler(this);
            this.player = new Player(this);
            this.UI = new UI(this);
            this.collisions = [];
            this.enemies = [];
            this.enemyTimer = 0;
            this.enemyInterval = 1000;
            this.moneys = [];
            this.moneyTimer = 0;
            this.moneyInterval = 1000;
            this.keys = [];
            this.collisions = [];
            this.scoreCoin = 0;
            this.scoreEnemy = 0;
            this.winningScore = 50;
            this.time = 0;
            this.maxTime = 60000;
            this.gameOver = false;
            this.livesP = 5;

        }
        update(deltaTime) {
            this.time += deltaTime;
            this.background.update();
            if (this.time > this.maxTime) this.gameOver = true;
            this.player.update(deltaTime);

            if (this.moneyTimer > this.moneyInterval) {
                this.addCoin();
                this.moneyTimer = 0;
            } else {
                this.moneyTimer += deltaTime;
            }

            this.moneys.forEach(money => {
                money.update(deltaTime);
                if (this.checkCollision(this.player, money)) {
                    money.lives--;
                    money.markedForDeletion = true;
                    if (money.lives <= 0) {
                        money.markedForDeletion = true;
                        this.scoreCoin += money.score;
                        if (this.scoreCoin > this.winningScore) this.gameOver = true;

                    }
                }
                if (money.markedForDeletion) this.moneys.splice(this.moneys.indexOf(money), 1)
            });

            if (this.enemyTimer > this.enemyInterval) {
                this.addEnemy();
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltaTime;
            }
            this.enemies.forEach(enemy => {
                enemy.update(deltaTime);

                this.player.projectiles.forEach(projectile => {
                    if (this.checkCollision(projectile, enemy)) {
                        enemy.lives--;
                        projectile.markedForDeletion = true;
                        if (enemy.lives <= 0) {
                            enemy.markedForDeletion = true;

                            this.scoreEnemy += enemy.score;
                            this.collisions.push(new CollisionAnimation(this.player, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5))

                        }
                    }
                })
                if (this.checkCollision(this.player, enemy)) {
                    enemy.markedForDeletion = true;

                    this.livesP--;
                    this.player.frameY = 4;
                    if (this.livesP <= 0) this.gameOver = true;

                }

                if (enemy.markedForDeletion) this.enemies.splice(this.enemies.indexOf(enemy), 1)
            });
            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);

            this.collisions.forEach((collision, index) => {
                collision.update(deltaTime);
                if (collision.markedForDeletion) this.collisions.splice(index, 1)
            })

        }
        draw(context) {
            this.background.draw(context);
            this.player.draw(context);
            this.moneys.forEach(money => {
                money.draw(context);

            });
            this.enemies.forEach(enemy => {
                enemy.draw(context);
            });

            this.collisions.forEach(collision => {
                collision.draw(context);
            })

            this.UI.draw(context);

        }
        addCoin() {
            this.moneys.push(new Coin(this));
            console.log(this.moneys)
        }

        addEnemy() {
            this.enemies.push(new AlienEnemy(this));

            console.log(this.enemies)


        }
        checkCollision(rect1, rect2) {
            return (
                rect1.x < rect2.x + rect2.width &&
                rect1.x + rect1.width > rect2.x &&
                rect1.y < rect2.y + rect2.height &&
                rect1.height + rect1.y > rect2.y
            );


        }


    }


    class Player {
        constructor(game, x, y) {
            this.game = game;
            this.spriteWidth = 120;
            this.spriteHeight = 150;
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.x = 10;
            this.y = this.game.height - this.height - this.game.groundMargin;
            this.vy = 0;
            this.weight = 1;
            this.image = document.getElementById('player1');
            this.frameX = 0;
            this.frameY = 0;
            this.maxFrame = 3;
            this.speed = 5;
            this.speedX = 0;
            this.speedY = 0;
            this.maxSpeed = 10;
            this.fps = 20;
            this.frameInterval = 1000 / this.fps;
            this.frameTimer = 0;
            this.projectiles = [];

        }

        update(input, deltaTime) {
            this.x += this.speed;
            if (this.game.keys.includes('ArrowLeft'))
                (this.speed = -this.maxSpeed) && (this.frameX = 0)


            else if (this.game.keys.includes('ArrowRight'))
                (this.speed = this.maxSpeed) && (this.frameX = 1)
            else this.speed = 0;
            if (this.x < 0) this.x = 0;
            if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;

            if (this.game.keys.includes('ArrowUp') && (this.frameX = 3) && this.onGround()) this.vy -= 26;
            this.y += this.vy;
            if (!this.onGround()) this.vy += this.weight;
            else (this.vy = 0);

            if (this.frameTimer > this.frameInterval) {
                if (this.frameX < this.maxFrame) {
                    this.frameX++;
                } else {
                    this.frameX = 0;
                }
                this.frameTimer = 0;
            } else {
                this.frameTimer += deltaTime;
            }



            this.projectiles.forEach(projectile => {
                projectile.update();

            });
            this.projectiles = this.projectiles.filter(projectile => !projectile.markedForDeletion);


        }
        draw(context) {//

            context.drawImage(this.image, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height)

            this.projectiles.forEach(projectile => {
                projectile.draw(context);
            });

        }


        onGround() {
            return this.y >= this.game.height - this.height - this.game.groundMargin;
        }
        shootTop() {
            this.projectiles.push(new Projectile(this.game, this.x, this.y))
            console.log(this.projectiles)
        }

    }




    const game = new Game(canvas.width, canvas.height);
    console.log(game);



    let lastTime = 0;
    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
        if (!game.gameOver) requestAnimationFrame(animate);
    }

    animate(0);

});