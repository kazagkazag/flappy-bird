WebFont.load({
    google: {
        families: ['Chewy']
    },
    active: function () {
        console.log("We have it!");
        startGame();
    }
});

let game;

function startGame() {
    game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
        preload,
        create,
        update
    });
}

function preload() {
    game.load.image('sky', 'assets/sky.png');
    game.load.image('pillar', 'assets/pipe.png');
    game.load.image('pillar2', 'assets/pipe2.png');
    game.load.spritesheet('bird', 'assets/bird.png', 48, 49);
}

let player;
let pillars;
let cursors;

let score = 1;
let scoreText;

function create() {

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    game.add.sprite(0, 0, 'sky');

    //  The pillars group contains the ground and the 2 ledges we can jump on
    pillars = game.add.group();

    //  We will enable physics for any object that is created in this group
    pillars.enableBody = true;

    createPillar();

    // The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'bird');

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 500;
    player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    player.animations.add('flying', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
    player.animations.play("flying", 10, true);

    //  The score
    scoreText = game.add.text(16, 16, 'score: 0', {
        font: "400 48px Chewy",
        fill: "#ffffff",
        stroke: "#000000",
        strokeThickness: 5
    });

    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();
}

function getRandom(minimum, maximum) {
    return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
}

function createPillar() {
    const isBottomPillar = pillars.length % 2 === 0;
    const pillar = game.add.sprite(800, 0, isBottomPillar ? "pillar2" : "pillar");
    pillar.scale.setTo(0.5, 0.5);

    if (isBottomPillar) {
        const posY = getRandom(50, 300);
        console.log("Bottom on position", posY);
        pillar.y = -posY;
    } else {
        const posY = getRandom(100, 350);
        console.log("Top on position", posY);
        pillar.y = posY;
    }

    pillars.add(pillar);
}

function removeUnusedPillars() {
    pillars.forEach(removePillarIfUnused, this, true);
}

function removePillarIfUnused(pillar) {
    if (pillar.body.x < 0) {
        pillar.kill();
    }
}

function movePillars() {
    pillars.forEach(movePillar, this, true);
}

function movePillar(pillar) {
    pillar.body.velocity.x = -150;
}

function addNewPillars() {
    const lastPillar = pillars.getAt(pillars.length - 1);
    if (pillars.countLiving() < 3 && lastPillar.body.x < 300) {
        createPillar();
    }
}

function update() {

    movePillars();
    removeUnusedPillars();
    addNewPillars();

    scoreText.text = 'Score: ' + parseInt(pillars.countDead());

    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;

    if (cursors.up.isDown) {
        //  Move to the left
        player.body.velocity.y = -200;
    }

    //  Collide the player with the pillars
    game.physics.arcade.overlap(player, pillars, endGame, null, this);
    killIfOutsideBounds();
}

function killIfOutsideBounds() {
    if (player.body.y > 550 || player.body.y <= 0) {
        console.log("OUT!");
        endGame();
    }
}

function endGame() {
    console.log("Collision!");
    scoreText.text = 'Result: ' + score;
    game.destroy();
}
