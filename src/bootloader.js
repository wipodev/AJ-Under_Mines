export default class Bootloader extends Phaser.Scene {
  constructor() {
    super("Bootloader");
  }

  preload() {
    this.load.setPath("./assets/");

    this.load.on("complete", () => {
      this.scene.start("gameMaster");
    });

    this.load.image("Sky", "img/sky.png");
    this.load.atlas("atlas", "atlas/maps.png", "atlas/maps.json");
    this.load.spritesheet("miner", "img/sprites.png", {
      frameWidth: 200,
      frameHeight: 200,
    });
  }
}
