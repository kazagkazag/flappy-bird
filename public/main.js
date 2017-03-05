/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

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
    game.load.audio('bgMusic', ['assets/bg.mp3']);
    game.load.audio('upSound', ['assets/up.mp3']);
}

let player;
let pillars;
let cursors;
let music;
let upSound;

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
    player.anchor.x = 0.5;
    player.anchor.y = 0.5;

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

    music = game.add.audio('bgMusic');
    music.play();

    upSound = game.add.audio('upSound');
}

function getRandom(minimum, maximum) {
    return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
}

function createPillar() {
    const isTopPillar = pillars.length % 2 === 0;
    const pillar = game.add.sprite(800, 0, isTopPillar ? "pillar2" : "pillar");
    pillar.scale.setTo(0.5, 0.5);

    if (isTopPillar) {
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
    const moveBy = pillars.length * 12 + 200;
    pillar.body.velocity.x = -moveBy;
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

    updatePlayerPosition();

    //  Collide the player with the pillars
    game.physics.arcade.overlap(player, pillars, endGame, null, this);
    killIfOutsideBounds();
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
    if (targetAngle < 0) {
        targetAngle++;
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
    if (targetAngle < -60) return;
    targetAngle -= 5;
}

function adjustPlayerAngle() {
    if (player.angle === targetAngle) return;

    const angleStep = (targetAngle - player.angle) / 5;
    player.angle += angleStep;
}

function playJumpSound() {
    if (!upSound.isPlaying) {
        upSound.play();
    }
}

function killIfOutsideBounds() {
    if (player.body.y > 550 || player.body.y <= 0) {
        console.log("OUT!");
        endGame();
    }
}

function endGame() {
    console.log("Collision!");
    player.kill();
    game.add.tween(scoreText).to({
        y: 245,
        x: 300
    }, 240, Phaser.Easing.Bounce.Out, true);

    scoreText.text = 'Result: ' + score;
}

/***/ })
/******/ ]);