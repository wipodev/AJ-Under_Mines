import Player from "../gameObjects/player.js";

export default class gameMaster extends Phaser.Scene {
  constructor() {
    super("gameMaster");
    this.map = [];
    this.skyline = 10;
    this.size = 45;
    this.height = 44;
    this.width = 28;
  }
  create() {
    this.generate();
    console.log(this.map);
    //--------  fondo del juego  ----------------------------
    this.add.image(400, 300, "Sky");
    this.add.image(1200, 300, "Sky");
    this.add.image(1600, 300, "Sky");
    for (let y = 10; y < 26; y++) {
      for (let x = 0; x < 44; x++) {
        let tile = Math.round(Math.random() * 3);
        let angle = Math.round(Math.random() * 3);
        if (y === 10) {
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
    this.map.forEach((e) => {
      this.pf.create(e.x, e.y, "atlas", e.block).setAngle(e.angle);
    });
  }

  update(time, delta) {
    /*if (this.cursors.left.isDown) {
      this.walking(-100, true);
    } else if (this.cursors.right.isDown) {
      this.walking(100, false);
    } else if (this.cursors.down.isDown) {
      this.mining();
    } else {
      this.player.body.setVelocityX(0);
      this.player.anims.play("turn");
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.body.setVelocityY(-250);
    }*/
  }

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

  //------------------------------ create maps ramdon---------------
  generate() {
    for (let y = this.skyline; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        let c_x = x * this.size;
        let c_y = y * this.size;
        if (y === this.skyline) {
          this.map.push({
            x: c_x,
            y: c_y,
            block: "H0",
            angle: 0,
          });
          continue;
        }
        let block = this.randomBlock(Math.round(Math.random() * 3));
        let angle = this.randomAngle(Math.round(Math.random() * 3));
        this.map.push({
          x: c_x,
          y: c_y,
          block,
          angle,
        });
      }
    }
  }

  randomBlock(n) {
    if (n === 0) return "T1";
    if (n === 1) return "T2";
    if (n === 2) return "T3";
    if (n === 3) return "T4";
  }

  randomAngle(n) {
    if (n === 0) return 0;
    if (n === 1) return 90;
    if (n === 2) return 180;
    if (n === 3) return 270;
  }
}
