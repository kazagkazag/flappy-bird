export default class {
    constructor(game, newTreePositionX) {
        this.newTreePositionX = newTreePositionX;
        this.game = game;

        return this.create();
    }

    create() {
        return this.game.add.sprite(this.newTreePositionX, 230, "bgTrees");
    }
}
