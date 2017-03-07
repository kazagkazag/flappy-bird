import Trees from "./trees";

export default class {
    constructor(game) {
        this.game = game;
        this.loopedTrees = null
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
        if(lastTreePosition < 0) {
            this.add();
        }
    }

    add() {
        const newTreePositionX = this.loopedTrees.length ? 800 : 0;
        let tree = new Trees(this.game, newTreePositionX);
        this.loopedTrees.add(tree);
    }

    move() {
        this.loopedTrees.forEach(tree => {
            tree.x -= 1;
        });
    }

    killUnused() {
        this.loopedTrees.forEachAlive(tree => {
            if(tree.x < -800) {
                tree.kill();
            }
        });
    }
}
