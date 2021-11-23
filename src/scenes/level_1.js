import Player from "../gameObjects/player.js";

export default class level_1 extends Phaser.Scene {
    constructor() {
        super("level_1");
    }
    create() {
        //  Fondo del juego
        this.add.image(600, 300, "background");

        // Plataformas
        let platforms = this.physics.add.staticGroup();
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

        // Paredes
        let walls = this.physics.add.staticGroup();
        walls.create(200, 300, "left_wall");
        walls.create(1000, 300, "right_wall");

        // minerales
        let minerals = this.physics.add.staticGroup();
        minerals.create(820, 560, "mineral");
        minerals.create(380, 560, "mineral").flipX = true;
        minerals.create(820, 470, "mineral");
        minerals.create(380, 470, "mineral").flipX = true;
        minerals.create(380, 370, "mineral").flipX = true;
        minerals.create(820, 270, "mineral");
        minerals.create(820, 100, "mineral");
        minerals.create(380, 100, "mineral").flipX = true;

        // jugador
        /*let player = this.physics.add.sprite(600, 25, "dude");
        player.setCollideWorldBounds(true);*/
        this.player = new Player(this, 600, 25, "dude").setScale(0.2);

        // pico
        this.beak = this.physics.add.staticGroup();
        console.log(this.player);
        //this.beak.rotation(60);

        // animacion de jugador
        this.anims.create({
            key: "walk",
            frames: this.anims.generateFrameNumbers("dude", {
                start: 1,
                end: 4,
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: "turn",
            frames: [{ key: "dude", frame: 0 }],
            frameRate: 20,
        });

        // coliciones
        this.physics.add.collider(this.player, platforms);
        this.physics.add.collider(this.player, walls);

        // evento de teclas
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update(time, delta) {
        if (this.cursors.left.isDown) {
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
        }
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
}
