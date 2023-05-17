export class Projectile {
  constructor(game, x, y) {
    this.game = game;
    this.x = x + 100;
    this.y = y + 50;
    this.width = 50;
    this.height = 30;
    this.speed = 15;
    this.lives = 1;
    this.score = this.lives;


    this.markedForDeletion = false;
    this.image = document.getElementById('bullet');
  }
  update() {
    this.x += this.speed;


    if (this.x > this.game.width * 1) this.markedForDeletion = true;
  }
  draw(context) {
    context.drawImage(this.image, this.x, this.y, this.width, this.height)

  }

}