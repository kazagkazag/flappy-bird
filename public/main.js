const game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
    preload,
    create,
    update
});

function preload() {
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('pillar', 'assets/platform2.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
}

let player;
let pillars;
let cursors;

let score = 0;
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

    // Here we create the ground.
    const ground = pillars.create(0, game.world.height - 64, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(2, 2);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;


    createPillar();

    // The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'dude');

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 500;
    player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    //  The score
    scoreText = game.add.text(16, 16, 'score: 0', {fontSize: '32px', fill: '#000'});

    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();

}

function createPillar() {
    const isBottomPillar = Math.random() < 0.5;
    const pillarPosition = isBottomPillar
        ? Math.floor(Math.random() * 300) + 50
        : -1 * (Math.floor(Math.random() * 350) + 100);

    const pillar = pillars.create(800, pillarPosition, 'pillar');
    pillar.body.immovable = true;
}

function removeUnusedPillars() {
    pillars.forEach(removePillarIfUnused, this, true);
}

function removePillarIfUnused(pillar) {
    if(pillar.body.x < 0) {
        pillar.kill();
    }
}

function movePillars() {
    pillars.forEach(movePillar, this, true);
}

function movePillar(pillar) {
    pillar.body.velocity.x =- 150;
}

function addNewPillars(){
    const lastPillar = pillars.getAt(pillars.length - 1);
    if(pillars.countLiving() < 3 && lastPillar.body.x < 300) {
        createPillar();
    }
}

function update() {

    movePillars();
    removeUnusedPillars();
    addNewPillars();

    score += 0.1;
    scoreText.text = 'Score: ' + score;



    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;

    if (cursors.up.isDown) {
        //  Move to the left
        player.body.velocity.y = -200;
    }
    else {
        //  Stand still
        player.animations.stop();

        player.frame = 4;
    }

    //  Collide the player with the pillars
    game.physics.arcade.overlap(player, pillars, endGame, null, this);
    killIfOutsideBounds()

}


function killIfOutsideBounds() {
    if(player.body.y > 550 || player.body.y <= 0) {
        endGame();
    }
}

function endGame() {
    scoreText.text = 'Result: ' + score;
    game.destroy();
}
