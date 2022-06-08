import figuresMap from "./components/config.js";
import Maps from "./components/maps.js";

const configMap = {
  width: 27,
  height: 14,
  skyline: 5,
  size: 45,
  angle: 90,
  percTiles: figuresMap.percTiles,
  percGroup: figuresMap.percGroup,
  figures: figuresMap.figures,
};
console.log(Phaser);
export default class Bootloader extends Phaser.Scene {
  constructor() {
    super("Bootloader");
  }

  preload() {
    this.load.setPath("./assets/");
    this.maps = new Maps(configMap);

    this.load.on("complete", () => {
      this.scene.start("gameMaster", { maps: this.maps });
    });

    this.load.atlas("atlas", "atlas/maps.png", "atlas/maps.json");
    this.load.spritesheet("miner", "img/sprites.png", {
      frameWidth: 200,
      frameHeight: 200,
    });
  }
}
