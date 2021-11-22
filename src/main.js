const config = {
  width: 1200,
  height: 600,
  parent: "aj-game",
  type: Phaser.AUTO,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

var game = new Phaser.Game(config);

function preload() {
  this.load.image("background", "./assets/img/background.png");
  this.load.image("left_wall", "./assets/img/left_wall.png");
  this.load.image("right_wall", "./assets/img/right_wall.png");
  this.load.image("platform", "./assets/img/platform.png");
  this.load.image("mineral", "./assets/img/mineral.png");
  this.load.spritesheet("dude", "./assets/img/dude.png", {
    frameWidth: 32,
    frameHeight: 41,
  });
  this.load.spritesheet("beak", "./assets/img/beak.png", {
    frameWidth: 40,
    frameHeight: 20,
  });
}

function create() {
  //  Fondo del juego
  this.add.image(600, 300, "background");

  // Plataformas
  platforms = this.physics.add.staticGroup();
  platforms.create(600, 600, "platform").setScale(2.01).refreshBody();
  platforms.create(498, 500, "platform");
  platforms.create(760, 500, "platform");
  platforms.create(498, 400, "platform");
  platforms.create(650, 400, "platform");
  platforms.create(702, 300, "platform");
  platforms.create(550, 300, "platform");
  platforms.create(550, 200, "platform");
  platforms.create(650, 200, "platform");
  platforms.create(400, 130, "platform");
  platforms.create(760, 130, "platform");
  platforms.create(600, 60, "platform");

  // laterales osea paredes
  walls = this.physics.add.staticGroup();
  walls.create(200, 300, "left_wall");
  walls.create(1000, 300, "right_wall");

  // minerales
  minerals = this.physics.add.staticGroup();
  minerals.create(820, 560, "mineral");
  minerals.create(380, 560, "mineral").flipX = true;
  minerals.create(820, 470, "mineral");
  minerals.create(380, 470, "mineral").flipX = true;
  minerals.create(380, 370, "mineral").flipX = true;
  minerals.create(820, 270, "mineral");
  minerals.create(820, 100, "mineral");
  minerals.create(380, 100, "mineral").flipX = true;

  // jugador
  player = this.physics.add.sprite(600, 25, "dude");
  player.setCollideWorldBounds(true);

  // pico
  //beaks = this.add.sprite(-20, -20, "beak");
  //beaks.visible = false;
  beaks = this.physics.add.staticGroup();
  console.log(beaks);

  // animacion de jugador
  this.anims.create({
    key: "walk",
    frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1,
  });

  this.anims.create({
    key: "turn",
    frames: [{ key: "dude", frame: 4 }],
    frameRate: 20,
  });

  // animacion pico
  this.anims.create({
    key: "mining",
    frames: this.anims.generateFrameNumbers("beak", { start: 1, end: 0 }),
    frameRate: 20,
  });

  // evento de teclas
  cursors = this.input.keyboard.createCursorKeys();

  //coliciones
  this.physics.add.collider(player, walls, collectWall, null, this);
  this.physics.add.collider(player, platforms);
  this.physics.add.overlap(beaks, minerals, collectMineral, null, this);
  //this.physics.add.collider(beaks, platforms);
}

function update(time, delta) {
  if (cursors.left.isDown) {
    walking(-100, false);
  } else if (cursors.right.isDown) {
    walking(100, true);
  } else if (cursors.down.isDown) {
    mining();
  } else {
    player.setVelocityX(0);
    player.anims.play("turn");
  }

  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-250);
  }
}

const walking = (velocity, flip) => {
  player.setVelocityX(velocity);
  player.flipX = flip;
  player.anims.play("walk", true);
};

const mining = async () => {
  beaks.setOrigin(0, 1);
  for (let i = 0; i < 50; i++) {
    beaks.anims.play("mining", true);
    await delay(0.5);
  }
};

function collectWall(player) {
  beaks.create(player.x, player.y, "beak");
  /*beaks.x = player.x;
  beaks.y = player.y;
  beaks.visible = true;*/
}

function collectMineral(minerals) {
  console.log("minando");
  minerals.disableBody(true, true);
}

function delay(n) {
  return new Promise(function (resolve) {
    setTimeout(resolve, n * 1000);
  });
}
