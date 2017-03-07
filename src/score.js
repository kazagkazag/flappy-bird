export default class {
    constructor(game) {
        this.game = game;
        this.score = null;
    }

    create() {
        this.score = this.game.add.text(this.game.world.width - 80, 16, 'score: 0', {
            font: "400 48px Chewy",
            fill: "#e5d3bd",
            stroke: "#171717",
            strokeThickness: 5,
            shadowColor: "#171717",
            shadowOffsetX: 2,
            shadowOffsetY: 2
        });
    }

    update(newValue) {
        this.score.text = newValue;
    }

    presentResult(result) {
        this.score.text = 'Result: ' + result;
        this.game.add.tween(this.score).to( {
            y: 245,
            x: 300
        }, 240, Phaser.Easing.Bounce.Out, true);
    }
}