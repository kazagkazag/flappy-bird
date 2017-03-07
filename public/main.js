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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__trees__ = __webpack_require__(4);


/* harmony default export */ __webpack_exports__["a"] = class {
    constructor(game) {
        this.game = game;
        this.loopedTrees = null;
    }

    create() {
        this.loopedTrees = this.game.add.group();
    }

    preload() {
        this.game.load.image('bgTrees', 'assets/layer-2.png');
    }

    update() {
        this.addNewIfNeeded();
        this.move();
        this.killUnused();
    }

    addNewIfNeeded() {
        const lastTreePosition = this.loopedTrees.getAt(this.loopedTrees.length - 1).x;
        if (lastTreePosition < 0) {
            this.add();
        }
    }

    add() {
        const newTreePositionX = this.loopedTrees.length ? 800 : 0;
        let tree = new __WEBPACK_IMPORTED_MODULE_0__trees__["a" /* default */](this.game, newTreePositionX);
        this.loopedTrees.add(tree);
    }

    move() {
        this.loopedTrees.forEach(tree => {
            tree.x -= 1;
        });
    }

    killUnused() {
        this.loopedTrees.forEachAlive(tree => {
            if (tree.x < -800) {
                tree.kill();
            }
        });
    }
};

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = class {
    constructor(game) {
        this.game = game;
        this.pillars = null;
    }

    getSprite() {
        return this.pillars;
    }

    preload() {
        this.game.load.image('pillar', 'assets/pipe.png');
        this.game.load.image('pillar2', 'assets/pipe2.png');
    }

    create() {
        this.pillars = this.game.add.group();
        this.enableBody();
    }

    enableBody() {
        this.pillars.enableBody = true;
    }

    add() {
        const isTopPillar = this.pillars.length % 2 === 0;
        const pillar = this.game.add.sprite(800, 0, isTopPillar ? "pillar2" : "pillar");
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

        this.pillars.add(pillar);
    }

    update() {
        this.move();
        this.killUnused();
        this.addNew();
    }

    move() {
        this.pillars.forEach(pillar => {
            const moveBy = this.pillars.length * 12 + 200;
            pillar.body.velocity.x = -moveBy;
        });
    }

    killUnused() {
        this.pillars.forEach(pillar => {
            if (pillar.body.x < 0) {
                pillar.kill();
            }
        });
    }

    addNew() {
        const lastPillar = this.pillars.getAt(this.pillars.length - 1);

        if (this.pillars.countLiving() < 3 && lastPillar.body.x < 300) {
            this.add();
        }
    }

    countDead() {
        return this.pillars.countDead();
    }
};

function getRandom(minimum, maximum) {
    return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
}

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = class {
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
        if (this.targetAngle < 0) {
            this.targetAngle++;
        }
    }

    increaseTargetAngle() {
        if (this.targetAngle < -60) return;
        this.targetAngle -= 5;
    }

    adjustPlayerAngle() {
        if (this.player.angle === this.targetAngle) return;
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
        if (!this.upSound.isPlaying) {
            this.upSound.play();
        }
    }

    isOutsideViewPort() {
        return this.player.body.y > 550 || this.player.body.y <= 0;
    }

    kill() {
        this.player.kill();
    }
};

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = class {
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
        this.game.add.tween(this.score).to({
            y: 245,
            x: 300
        }, 240, Phaser.Easing.Bounce.Out, true);
    }
};

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = class {
    constructor(game, newTreePositionX) {
        this.newTreePositionX = newTreePositionX;
        this.game = game;

        return this.create();
    }

    create() {
        return this.game.add.sprite(this.newTreePositionX, 230, "bgTrees");
    }
};

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__game__ = __webpack_require__(7);


WebFont.load({
    google: {
        families: ['Chewy']
    },
    active: function () {
        console.log("Fonts loaded.");
        new __WEBPACK_IMPORTED_MODULE_0__game__["a" /* default */]();
    }
});

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__player__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__loopedTrees__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__pillars__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__score__ = __webpack_require__(3);





/* harmony default export */ __webpack_exports__["a"] = class {
    constructor() {
        this.player = new __WEBPACK_IMPORTED_MODULE_0__player__["a" /* default */](this.game);
        this.pillars = new __WEBPACK_IMPORTED_MODULE_2__pillars__["a" /* default */](this.game);
        this.music = null;
        this.loopedTrees = new __WEBPACK_IMPORTED_MODULE_1__loopedTrees__["a" /* default */](this.game);
        this.scoreText = new __WEBPACK_IMPORTED_MODULE_3__score__["a" /* default */](this.game);
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
        this.game.physics.arcade.overlap(this.player.getSprite(), this.pillars.getSprite(), this.endGame, null, this);

        if (this.player.isOutsideViewPort()) {
            this.endGame();
        }
    }

    endGame() {
        this.player.kill();
        this.scoreText.presentResult(this.pillars.countDead());
    }
};

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__menu__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__level__ = __webpack_require__(6);



/* harmony default export */ __webpack_exports__["a"] = class {
    constructor() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
            preload: this.preload.bind(this),
            create: this.create.bind(this),
            update: this.update.bind(this)
        });
    }

    preload() {
        console.log("Game preloading");
    }

    create() {
        console.log("Game creating");
        this.game.state.add("menu", __WEBPACK_IMPORTED_MODULE_0__menu__["a" /* default */]);
        this.game.state.add("level", __WEBPACK_IMPORTED_MODULE_1__level__["a" /* default */]);
        this.game.state.start("menu");
    }

    update() {
        console.log("Game updating");
    }
};

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = class {

    preload() {
        console.log("Menu preloading");
    }

    create() {
        console.log("Menu creating");
    }

    update() {
        console.log("Menu updating");
    }
};

/***/ })
/******/ ]);