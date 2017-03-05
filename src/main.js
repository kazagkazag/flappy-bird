WebFont.load({
    google: {
        families: ['Chewy']
    },
    active: function() {
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
    game.load.image('bgClouds', 'assets/layer-1.png');
    game.load.image('bgTrees', 'assets/layer-2.png');
    game.load.image('bgGround', 'assets/layer-3.png');
    game.load.spritesheet('bird', 'assets/bird.png', 48, 49);
    game.load.audio('bgMusic', ['assets/bg.mp3']);
    game.load.audio('upSound', ['assets/up.mp3']);
}

let player;
let pillars;
let cursors;
let music;
let upSound;
let trees;

let score = 1;
let scoreText;

function create() {

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.add.sprite(0,0, "bgClouds");

    trees = game.add.group();

    createTree();

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
    player.anchor.x = 0.5;
    player.anchor.y = 0.5;

    //  Our two animations, walking left and right.
    player.animations.add('flying', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
    player.animations.play("flying", 10, true);

    //  The score
    scoreText = game.add.text(game.world.width - 180, 16, 'score: 0', {
        font: "400 48px Chewy",
        fill: "#e5d3bd",
        stroke: "#171717",
        strokeThickness: 5,
        shadowColor: "#171717",
        shadowOffsetX: 2,
        shadowOffsetY: 2
    });

    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();

    music = game.add.audio('bgMusic');
    music.play();

    upSound = game.add.audio('upSound');

}

function createTree() {
    const newTreePositionX = trees.length ? 800 : 0;
    let tree = game.add.sprite(newTreePositionX ,230, "bgTrees");
    trees.add(tree);
}

function getRandom(minimum, maximum) {
    return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum
}

function createPillar() {
    const isTopPillar = pillars.length % 2 === 0;
    const pillar = game.add.sprite(800, 0, isTopPillar ? "pillar2" : "pillar");
    pillar.scale.setTo(0.5, 0.5);

    if(isTopPillar) {
        const posY = getRandom(50, 300);
        console.log("Top on position", posY);
        pillar.y = -posY;
    } else {
        const posY = getRandom(200, 350);
        console.log("Bottom on position", posY);
        pillar.y = posY;
    }

    pillars.add(pillar);
}

function loopTrees() {
    addNewTree();
    moveAllTrees();
    killUnusedTrees();
}

function addNewTree() {
    const lastTreePosition = trees.getAt(trees.length - 1).x;
    if(lastTreePosition < 0) {
        createTree();
    }
}

function killUnusedTrees() {
    trees.forEachAlive(tree => {
        if(tree.x < -800) {
            tree.kill();
        }
    });
}

function moveAllTrees() {
    trees.forEach(tree => {
       tree.x -= 1;
    });
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
    const moveBy = pillars.length * 12 + 200;
    pillar.body.velocity.x =- moveBy;
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
    loopTrees(trees);

    scoreText.text = 'Score: ' + parseInt(pillars.countDead());

    updatePlayerPosition();

    //  Collide the player with the pillars
    game.physics.arcade.overlap(player, pillars, endGame, null, this);
    killIfOutsideBounds()

}

let targetAngle = 0;

function updatePlayerPosition() {
    if (cursors.up.isDown) {
        jump();
    }

    reduceTargetAngle();
    adjustPlayerAngle();
}

function reduceTargetAngle() {
    if(targetAngle < 0) {
        targetAngle ++;
    }
}

function jump() {
    moveUp();
    increaseTargetAngle();
    playJumpSound();
}

function moveUp() {
    player.body.velocity.y = -200;
}

function increaseTargetAngle() {
    if(targetAngle < -60) return;
    targetAngle -= 5;
}

function adjustPlayerAngle() {
    if(player.angle === targetAngle) return;
    player.angle += (targetAngle - player.angle) / 5
}

function playJumpSound() {
    if(!upSound.isPlaying) {
        upSound.play();
    }
}

function killIfOutsideBounds() {
    if(player.body.y > 550 || player.body.y <= 0) {
        endGame();
    }
}

function endGame() {
    player.kill();
    scoreText.text = 'Result: ' + score;
    game.add.tween(scoreText).to( {
        y: 245,
        x: 300
    }, 240, Phaser.Easing.Bounce.Out, true);
}
