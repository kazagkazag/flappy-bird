export default class {
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

        if(isTopPillar) {
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
            pillar.body.velocity.x =- moveBy;
        });
    }

    killUnused() {
        this.pillars.forEach(pillar => {
            if(pillar.body.x < 0) {
                pillar.kill();
            }
        });
    }

    addNew() {
        const lastPillar = this.pillars.getAt(this.pillars.length - 1);

        if(this.pillars.countLiving() < 3 && lastPillar.body.x < 300) {
            this.add();
        }
    }

    countDead() {
        return this.pillars.countDead();
    }
}

function getRandom(minimum, maximum) {
    return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum
}