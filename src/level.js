import Player from "./player";
import LoopedTrees from "./loopedTrees";
import Pillars from "./pillars";
import Score from "./score";

export default class {
    constructor() {
        this.player = new Player(this.game);
        this.pillars = new Pillars(this.game);
        this.music = null;
        this.loopedTrees = new LoopedTrees(this.game);
        this.scoreText = new Score(this.game);
    }

    preload() {
        this.game.load.image('bgClouds', 'assets/layer-1.png');
        this.game.load.audio('bgMusic', ['assets/bg.mp3']);
        this.player.preload();
        this.pillars.preload();
        this.loopedTrees.preload();
    }

    create() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.add.sprite(0, 0, "bgClouds");
        this.music = this.game.add.audio('bgMusic');
        this.music.play();
        this.scoreText.create();
        this.loopedTrees.create();
        this.loopedTrees.add();
        this.pillars.create();
        this.pillars.add();
        this.player.create();
    }

    update() {
        this.pillars.update();
        this.loopedTrees.update();
        this.scoreText.update(this.pillars.countDead());
        this.player.update();
        this.game.physics.arcade.overlap(
            this.player.getSprite(),
            this.pillars.getSprite(),
            this.endGame,
            null,
            this
        );

        if (this.player.isOutsideViewPort()) {
            this.endGame();
        }
    }

    endGame() {
        this.player.kill();
        this.scoreText.presentResult(this.pillars.countDead());
    }
}
