export class UI {
    constructor(game) {
        this.game = game;
        this.fontSize = 30;
        this.fontFamily = 'Helvetica_bold'
        this.livesImage = document.getElementById('lives');
    }
    draw(context) {
        context.save();
        context.font = "30px Impact";
        context.textAlign = 'left';
        context.fillStyle = this.game.fontColor;
        // scoreCoin
        context.fillText('COIN: ' + this.game.scoreCoin, 20, 50);
        // scoreEnemy
        context.fillText('ENEMY: ' + this.game.scoreEnemy, 20, 90);
        // timer
        context.font = this.fontSize * 0.8 + 'px' + this.fontFamily;
        context.fillText('TIME: ' + (this.game.time * 0.001).toFixed(1), 650, 50);

        // lives
        for (let i = 0; i < this.game.livesP; i++) {

            context.drawImage(this.livesImage, 25 * i + 20, 95, 25, 25)
        }


        // game over message
        if (this.game.gameOver) {

            context.textAlign = "center";
            context.font = this.fontSize * 2 + 'px' + this.fontFamily;
            if (this.scoreCoin = 10) {
                context.font = "30px Impact";
                context.fillStyle = 'red';
                context.fillText('YOU WINNER!!!', this.game.width * 0.5, this.game.height * 0.5 - 20);
                context.font = this.fontSize * 0.7 + 'px' + this.fontFamily;
                context.fillText('What are creatures of the night afraid of? YOU!!!', this.game.width * 0.5, this.game.height * 0.5 + 20);



            } else {
                context.font = '40px SoulMission';
                context.fillStyle = this.game.writeColor;
                context.fillText('Oops, YOU LOST!!', this.game.width * 0.5, this.game.height * 0.5 - 20);

                context.fillText('AND THE ALIENS CONQUERED THE EARTHE!!!', this.game.width * 0.5, this.game.height * 0.5 + 150);

            }


        }
        context.restore();

    }
}