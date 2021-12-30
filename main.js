import Bootloader from "./src/bootloader.js";
import GameMaster from "./src/scenes/gameMaster.js";

const config = {
  title: "UnderMines",
  version: "0.1.1",
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
  scene: [Bootloader, GameMaster],
};

new Phaser.Game(config);
