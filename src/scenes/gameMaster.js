import Maps from "../components/maps.js";

export default class gameMaster extends Phaser.Scene {
  constructor() {
    super("gameMaster");
    this.skyline = 10;
  }

  create() {
    this.maps = new Maps(44, 26, this.skyline, 45, 100, 90);

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
      this.pf
        .create(e.x, e.y, "atlas", e.block)
        .setAngle(e.angle)
        .setPipeline("Light2D");
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

    //-------------  Linterna  ------------------------------------------
    this.lights.enable().setAmbientColor(0x999999);
    this.lantern = this.lights.addLight(
      this.player.x,
      this.player.y,
      150,
      0xffffff,
      6
    );
    //----------------------------------------------------------------

    //------------ fisicas y fisicas  -----------------------------------
    this.cameras.main.setBounds(0, 0, 1950, 1150);
    this.physics.world.setBounds(0, 0, 1950, 1150);
    this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
    this.cameras.main.setViewport(0, 0, 1200, 600);
    this.cameras.main.setRoundPixels(true);

    // coliciones
    this.physics.add.collider(this.player, this.pf, this.pepe, null, this);

    // evento de teclas
    this.cursors = this.input.keyboard.createCursorKeys();

    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
  }

  update(time, delta) {
    this.lantern.x = this.player.x;
    this.lantern.y = this.player.y;

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

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.body.setVelocityY(-170);
      this.player.anims.play("jump", true);
    }

    if (this.keyA.isDown) {
      this.mining("left");
    }
    if (this.keyD.isDown) {
      this.mining("right");
    }
    if (this.keyS.isDown) {
      this.mining("down");
    }
    if (this.keyW.isDown) {
      this.mining("up");
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

  mining(orientation) {
    this.player.body.setVelocity(0);

    if (orientation === "left") {
      this.player.anims.play("mining", true);
      this.player.flipX = true;
      this.pf.children.iterate((e) => {
        if (
          this.player.x - e.x <= 48.4 &&
          this.player.x - e.x >= 41.6 &&
          e.y === this.player.y
        ) {
          e.disableBody(true, true);
        }
      });
    }

    if (orientation === "right") {
      this.player.anims.play("mining", true);
      this.player.flipX = false;
      this.pf.children.iterate((e) => {
        if (
          e.x - this.player.x <= 48.4 &&
          e.x - this.player.x >= 41.6 &&
          e.y === this.player.y
        ) {
          e.disableBody(true, true);
        }
      });
    }

    if (orientation === "down") {
      this.player.anims.play("miningDown", true);
      this.pf.children.iterate((e) => {
        /*if (
          this.player.x - e.x + 45 <= 48.4 &&
          this.player.x - e.x + 45 >= 41.6 &&
          e.y === this.player.y + 45
        ) {
          e.disableBody(true, true);
          console.log(e.y, this.y);
        }*/
        if (e.y === this.player.y + 45 && e.x === this.x) {
          e.disableBody(true, true);
        }
      });
    }

    if (orientation === "up") {
      this.player.anims.play("miningDown", true);
      this.pf.children.iterate((e) => {
        if (
          this.player.x - e.x + 45 <= 48.4 &&
          this.player.x - e.x + 45 >= 41.6 &&
          e.y === this.player.y - 45
        ) {
          e.disableBody(true, true);
        }
      });
    }
  }
}
