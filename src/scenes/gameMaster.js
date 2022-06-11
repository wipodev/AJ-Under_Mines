export default class GameMaster extends Phaser.Scene {
  constructor() {
    super("gameMaster");
    this.x = 0;
    this.y = 0;
    this.sizeBlock = 45;
    this.sizeX = 180;
    this.sizeY = 200;
    this.scaleSprite = 0.225;
    this.roominess = (this.sizeBlock - this.sizeX * this.scaleSprite) / 2;
  }

  init(data) {
    this.maps = data.maps;
  }

  create() {
    //--------  fondo del juego  ----------------------------
    this.maps.getBackground.forEach((e) => {
      if (e.tile.substring(0, 1) !== "S") {
        this.add
          .image(e.x, e.y, "atlas", e.tile)
          .setAngle(e.angle)
          .setPipeline("Light2D");
      } else {
        this.add.image(e.x, e.y, "atlas", e.tile).setAngle(e.angle);
      }
    });
    //-------------------------------------------------------

    //----------  mapa del juego ----------------------------------
    this.pf = this.physics.add.staticGroup();
    this.maps.getMap.forEach((e) => {
      this.pf
        .create(e.x, e.y, "atlas", e.tile)
        .setAngle(e.angle)
        .setPipeline("Light2D");
    });
    //------------------------------------------------------------

    //---------------- prueba de particulas ------------------------
    this.a = this.physics.add.group();
    for (let y = 0; y < 45; y++) {
      for (let x = 158; x < 203; x++) {
        this.a.create(x, y, "agua");
      }
    }

    // fisicas
    //this.physics.add.collider(this.a, this.pf);
    this.physics.add.collider(this.a, this.pf, this.pepe, null, this);
    console.log(this.a.children.entries);

    //---------------------------------------------------------------

    //---------------  jugador ---------------------------------------
    this.player = this.physics.add.sprite(600, 180, "miner");
    this.player.setScale(this.scaleSprite);
    this.player.setCollideWorldBounds(true);

    //ajusta los limites de un objeto o personaje
    this.player.setSize(this.sizeX, this.sizeY, true);

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

    //------------ camara y fisicas  -----------------------------------
    this.cameras.main.setBounds(0, 0, 1200, 1000);
    this.physics.world.setBounds(0, 0, 1200, 600);
    this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
    this.cameras.main.setViewport(0, 0, 1200, 600);
    this.cameras.main.setRoundPixels(true);

    // coliciones
    this.physics.add.collider(
      this.player,
      this.pf,
      this.colliderPF,
      null,
      this
    );

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
      if (this.player.y === this.y && this.player.x > this.x) {
        this.mining(
          this.sizeBlock - this.roominess,
          this.sizeBlock + this.roominess,
          this.player.y,
          "mining",
          0,
          true
        );
      } else {
        this.walking(-100, true);
      }
    } else if (this.cursors.right.isDown) {
      if (this.player.y === this.y && this.player.x < this.x) {
        this.mining(
          this.sizeBlock - this.roominess,
          this.sizeBlock + this.roominess,
          this.player.y,
          "mining",
          this.sizeBlock * 2
        );
      } else {
        this.walking(100, false);
      }
    } else if (this.cursors.down.isDown) {
      this.mining(
        this.sizeBlock - this.roominess,
        this.sizeBlock + this.roominess,
        this.player.y + this.sizeBlock,
        "miningDown",
        this.sizeBlock
      );
    } else {
      this.player.body.setVelocityX(0);
      this.player.anims.play("turn");
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.body.setVelocityY(-170);
      this.player.anims.play("jump", true);
    }

    if (this.keyW.isDown) {
      this.mining(
        this.sizeBlock - this.roominess,
        this.sizeBlock + this.roominess,
        this.player.y - this.sizeBlock,
        "mining",
        this.sizeBlock
      );
    }
    //------------ prueba particulas -------------
    this.a.children.iterate((e) => {
      if (e.collided === false) {
        let newPos = this.moveTo(e);
        e.x = newPos[0];
        e.y = newPos[1];
      }
    });
    //--------------------------------------------
  }

  walking(velocity, flip) {
    this.player.body.setVelocityX(velocity);
    this.player.flipX = flip;
    this.player.anims.play("walk", true);
  }

  colliderPF(player, pf) {
    if (pf.x != this.x || pf.y != this.y) {
      this.x = pf.x;
      this.y = pf.y;
      //console.log(this.x, this.y);
    }
  }

  mining(min, max, y, animation, posi = 0, flip = false) {
    this.player.anims.play(animation, true);
    this.player.flipX = flip;
    this.pf.children.iterate((e) => {
      let playerPosi = this.player.x - e.x + posi;
      if (
        playerPosi.toFixed(2) >= min &&
        playerPosi.toFixed(2) <= max &&
        e.y === y
      ) {
        e.disableBody(true, true);
      }
    });
  }

  //---------------- prueba particula ----------------------
  pepe(a) {
    a.collided = true;
  }

  moveTo(e) {
    //const grid = this.children.list;
    const grid = this.a.children.entries;
    let c = Math.random() > 0.5;
    const pos = {
      here: [e.x, e.y],
      up: [e.x, e.y - 1],
      down: [e.x, e.y + 1],
      left: [e.x - 1, e.y],
      right: [e.x + 1, e.y],
      upL: [e.x - 1, e.y - 1],
      upR: [e.x + 1, e.y - 1],
      downL: [e.x - 1, e.y + 1],
      downR: [e.x + 1, e.y + 1],
    };

    let Down = grid.find((g) =>
      g.x == pos.down[0] && g.y == pos.down[1] ? true : false
    );
    let DownL = grid.find((g) =>
      g.x == pos.downL[0] && g.y == pos.downL[1] ? true : false
    );
    let DownR = grid.find((g) =>
      g.x == pos.downR[0] && g.y == pos.downR[1] ? true : false
    );
    let Left = grid.find((g) =>
      g.x == pos.left[0] && g.y == pos.left[1] ? true : false
    );
    let Right = grid.find((g) =>
      g.x == pos.right[0] && g.y == pos.right[1] ? true : false
    );

    if (Down === undefined) {
      return pos.down;
    }
    if ((c ? DownL : DownR) === undefined) {
      return c ? pos.downL : pos.downR;
    }
    if ((c ? Left : Right) === undefined) {
      return c ? pos.left : pos.right;
    }
    return pos.here;
  }
}
