class Bootloader extends Phaser.Scene {
  constructor() {
    super("Bootloader");
  }

  preload() {
    this.load.setPath("./assets/");

    this.load.on("complete", () => {
      this.scene.start("gameMaster");
    });

    this.load.atlas("atlas", "atlas/maps.png", "atlas/maps.json");
  }
}
export default Bootloader;
