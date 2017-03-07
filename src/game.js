import Menu from "./menu";
import Level from "./level";

export default class {
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
        this.game.state.add("menu", Menu);
        this.game.state.add("level", Level);
        this.game.state.start("menu");
    }

    update() {
        console.log("Game updating");
    }
}