import Bootloader from "./Bootloader.js";
import Level_1 from "./scenes/level_1.js";

const config = {
  title: "UnderMines",
  version: "0.0.1",
  type: Phaser.AUTO,
  scale: {
    parent: "aj-game",
    width: 1200,
    height: 600,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  backgroundColor: "#c7ecee",
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        y: 300,
      },
      debug: false,
    },
  },
  scene: [Bootloader, Level_1],
};

new Phaser.Game(config);
