import Maps from "../components/maps.js";

export default class gameMaster extends Phaser.Scene {
  constructor() {
    super("gameMaster");
    this.skyline = 3;
  }

  create() {
    this.maps = new Maps(44, 14, this.skyline, 45, 100, 90);

    //--------  fondo del juego  ----------------------------
    this.add.image(400, 300, "Sky");
    this.add.image(1200, 300, "Sky");
    this.add.image(1600, 300, "Sky");
    for (let y = 3; y < 26; y++) {
      for (let x = 0; x < 44; x++) {
        let tile = Math.round(Math.random() * 3);
        let angle = Math.round(Math.random() * 3);
        if (y === this.skyline) {
          tile = "H1";
          angle = 0;
        } else {
          if (tile === 0) tile = "B1";
          if (tile === 1) tile = "B2";
          if (tile === 2) tile = "B3";
          if (tile === 3) tile = "B4";
          if (angle === 0) angle = 0;
          if (angle === 1) angle = 90;
          if (angle === 2) angle = 180;
          if (angle === 3) angle = 270;
        }
        this.add.image(x * 45, y * 45, "atlas", tile).setAngle(angle);
      }
    }

    //----------  mapa del juego ----------------------------------
    this.pf = this.physics.add.staticGroup();
    this.maps.getMap.forEach((e) => {
      this.pf.create(e.x, e.y, "atlas", e.block).setAngle(e.angle);
    });
  }

  update(time, delta) {}

  walking(velocity, flip) {
    this.beak.clear(true, true);
    this.player.body.setVelocityX(velocity);
    this.player.flipX = flip;
    this.player.anims.play("walk", true);
  }

  async mining() {
    if (this.player.x == 416 || this.player.x == 784) {
      this.beak.clear(true, true);
      this.beak.create(this.player.x + 2, this.player.y + 2, "beak");
      this.beak.setOrigin(1, 1);
      //this.beak.children.
      //this.beak.setRotation(60);
      //this.beak.angle(0);
      //await this.delay(0.5);
      //this.beak.angle(10);
      /*for (let i = 0; i < 50; i++) {
                //this.beak.angle(-10);
                this.beak.setRotation(60);
                await this.delay(0.5);
                //this.beak.angle(10);
                this.beak.setRotation(0);
            }*/
    }
  }

  delay(n) {
    return new Promise(function (resolve) {
      setTimeout(resolve, n * 1000);
    });
  }
}
