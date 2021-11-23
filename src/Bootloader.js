class Bootloader extends Phaser.Scene {
    constructor() {
        super("Bootloader");
    }

    preload() {
        this.load.setPath("./assets/");

        this.load.on("complete", () => {
            this.scene.start("level_1");
        });

        this.load.image("background", "img/background.png");
        this.load.image("left_wall", "img/left_wall.png");
        this.load.image("right_wall", "img/right_wall.png");
        this.load.image("platform", "img/platform.png");
        this.load.image("mineral", "img/mineral.png");
        this.load.spritesheet("dude", "img/dude.png", {
            frameWidth: 200,
            frameHeight: 200,
        });
        /*this.load.spritesheet("beak", "img/beak.png", {
            frameWidth: 40,
            frameHeight: 20,
        });*/
        this.load.image("beak", "img/beak.png");
    }
}
export default Bootloader;
