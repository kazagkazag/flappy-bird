export default class {
    constructor(game) {
        this.game = game;
        this.player = null;
        this.cursors = null;
        this.upSound = null;
        this.targetAngle = 0;
    }

    preload() {
        this.game.load.spritesheet('bird', 'assets/bird.png', 48, 49);
        this.game.load.audio('upSound', ['assets/up.mp3']);
    }

    getSprite() {
        return this.player;
    }

    create() {
        const player = this.game.add.sprite(32, this.game.world.height - 150, "bird");
        //  We need to enable physics on the player
        this.game.physics.arcade.enable(player);

        player.body.bounce.y = 0.2;
        player.body.gravity.y = 500;
        player.body.collideWorldBounds = true;
        player.anchor.x = 0.5;
        player.anchor.y = 0.5;

        //  Our two animations, walking left and right.
        player.animations.add('flying', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
        player.animations.play("flying", 10, true);

        this.player = player;
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.upSound = this.game.add.audio('upSound');
    }

    update() {
        if (this.cursors.up.isDown) {
            this.jump();
        }

        this.reduceTargetAngle();
        this.adjustPlayerAngle();
    }

    reduceTargetAngle() {
        if(this.targetAngle < 0) {
            this.targetAngle ++;
        }
    }

    increaseTargetAngle() {
        if(this.targetAngle < -60) return;
        this.targetAngle -= 5;
    }

    adjustPlayerAngle() {
        if(this.player.angle === this.targetAngle) return;
        this.player.angle += (this.targetAngle - this.player.angle) / 5;
    }

    jump() {
        this.moveUp();
        this.increaseTargetAngle();
        this.playJumpSound();
    }

    moveUp() {
        this.player.body.velocity.y = -200;
    }

    playJumpSound() {
        if(!this.upSound.isPlaying) {
            this.upSound.play();
        }
    }

    isOutsideViewPort() {
        return this.player.body.y > 550 || this.player.body.y <= 0
    }

    kill() {
        this.player.kill();
    }
}