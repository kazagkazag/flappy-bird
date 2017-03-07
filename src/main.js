import Game from "./game";

WebFont.load({
    google: {
        families: ['Chewy']
    },
    active: function () {
        console.log("Fonts loaded.");
        new Game();
    }
});