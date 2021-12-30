import Maps from "../components/maps.js";

export default class gameMaster extends Phaser.Scene {
  constructor() {
    super("gameMaster");
    this.skyline = 10;
  }

  create() {
    this.maps = new Maps(44, 14, this.skyline, 45, 100, 90);

    //--------  fondo del juego  ----------------------------
    this.add.image(400, 300, "Sky");
    this.add.image(1200, 300, "Sky");
    this.add.image(1600, 300, "Sky");
    for (let y = this.skyline; y < 26; y++) {
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

    //------------------------------------------------------------

    //----------  mapa del juego ----------------------------------
    this.pf = this.physics.add.staticGroup();
    this.maps.getMap.forEach((e) => {
      this.pf.create(e.x, e.y, "atlas", e.block).setAngle(e.angle);
    });

    //------------------------------------------------------------

    //---------------  jugador ---------------------------------------
    this.player = this.physics.add.sprite(945, 405, "miner").setScale(0.225);
    this.player.setCollideWorldBounds(true);

    //ajusta los limites de un objeto o personaje
    this.player.setSize(180, 200, true);

    // animacion de jugador
    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("miner", {
        start: 1,
        end: 4,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "jump",
      frames: this.anims.generateFrameNumbers("miner", {
        start: 1,
        end: 1,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: "miner", frame: 0 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "mining",
      frames: this.anims.generateFrameNumbers("miner", {
        start: 5,
        end: 11,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "miningDown",
      frames: this.anims.generateFrameNumbers("miner", {
        start: 12,
        end: 16,
      }),
      frameRate: 10,
      repeat: -1,
    });
    //---------------------------------------------------------------

    //------------ fisicas  -----------------------------------
    this.physics.world.setBounds(0, 0, 1950, 1150);

    // coliciones
    this.physics.add.collider(this.player, this.pf, this.pepe, null, this);

    // evento de teclas
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update(time, delta) {
    if (this.cursors.left.isDown) {
      this.walking(-100, true);
    } else if (this.cursors.right.isDown) {
      this.walking(100, false);
    } else if (this.cursors.down.isDown) {
      this.mining("down");
    } else {
      this.player.body.setVelocityX(0);
      this.player.anims.play("turn");
    }
  }

  walking(velocity, flip) {
    this.player.body.setVelocityX(velocity);
    this.player.flipX = flip;
    this.player.anims.play("walk", true);
  }

  pepe(player, pf) {
    if (pf.x != this.x || pf.y != this.y) {
      console.log(pf.x, pf.y);
      this.x = pf.x;
      this.y = pf.y;
    }
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
}
