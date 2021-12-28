export default class Maps {
  constructor(width, height, skyline, size, perc = 100, angle = 1) {
    this.width = width;
    this.height = height;
    this.skyline = skyline;
    this.size = size;
    this.figures = [
      [
        { x: 0, y: 0 },
        { x: 45, y: 0 },
        { x: 90, y: 0 },
        { x: 45, y: 45 },
      ],
      [
        { x: 0, y: 0 },
        { x: 45, y: 0 },
        { x: 90, y: 0 },
        { x: 135, y: 0 },
        { x: 180, y: 0 },
        { x: 225, y: 0 },
        { x: 45, y: 45 },
        { x: 90, y: 45 },
        { x: 135, y: 45 },
        { x: 180, y: 45 },
        { x: 45, y: 90 },
        { x: 90, y: 90 },
      ],
      [
        { x: 0, y: 0 },
        { x: 45, y: 0 },
        { x: 90, y: 0 },
        { x: 135, y: 0 },
        { x: 180, y: 0 },
        { x: 225, y: 0 },
        { x: 45, y: 45 },
        { x: 90, y: 45 },
        { x: 135, y: 45 },
        { x: 180, y: 45 },
        { x: 135, y: 90 },
        { x: 180, y: 90 },
      ],
      [
        { x: 0, y: 0 },
        { x: 45, y: 0 },
        { x: 90, y: 0 },
        { x: 135, y: 0 },
        { x: 180, y: 0 },
        { x: 225, y: 0 },
        { x: 270, y: 0 },
        { x: 315, y: 0 },
        { x: 45, y: 45 },
        { x: 90, y: 45 },
        { x: 135, y: 45 },
        { x: 180, y: 45 },
        { x: 225, y: 45 },
        { x: 270, y: 45 },
        { x: 90, y: 90 },
        { x: 135, y: 90 },
        { x: 180, y: 90 },
        { x: 225, y: 90 },
      ],
      [
        { x: 0, y: 0 },
        { x: 45, y: 0 },
        { x: 90, y: 0 },
        { x: 135, y: 0 },
        { x: 0, y: 45 },
        { x: 45, y: 45 },
        { x: 90, y: 45 },
        { x: 0, y: 90 },
        { x: 45, y: 90 },
        { x: 90, y: 90 },
        { x: 0, y: 135 },
        { x: 45, y: 135 },
        { x: 0, y: 180 },
      ],
      [
        { x: 0, y: 0 },
        { x: 45, y: 0 },
        { x: 90, y: 0 },
        { x: 135, y: 0 },
        { x: 45, y: 45 },
        { x: 90, y: 45 },
        { x: 135, y: 45 },
        { x: 45, y: 90 },
        { x: 90, y: 90 },
        { x: 135, y: 90 },
        { x: 90, y: 135 },
        { x: 135, y: 135 },
        { x: 135, y: 180 },
      ],
    ];
    this.percBlock = [
      { perc: 98, block: "Tierra" },
      { perc: 99, block: "Piedra" },
      { perc: 100, block: "Agua" },
    ];
    this.percTerra = [
      { perc: 96, block: "0" },
      { perc: 97, block: "1" },
      { perc: 98, block: "2" },
      { perc: 99, block: "3" },
      { perc: 100, block: "4" },
    ];
    this.perc = perc;
    this.angle = angle;

    this.checkNumber(width, "width");
    this.checkNumber(height, "height");
    this.checkNumber(size, "size");
    this.checkNumber(perc, "perc");
    this.checkNumber(angle, "angle");

    this.map = [];
    this.create();
  }

  checkNumber(data, index) {
    if (!data) {
      return console.warn(`${index} ${data} esta vacio`);
    }
    if (typeof data !== "number") {
      return console.error(`el ${index} no es tipo Numero`);
    }
    return true;
  }

  getRandom(factor, angle = 1) {
    return Math.round(Math.random() * factor) * angle;
  }

  randomBlock(num, percs, block = "") {
    let random = this.getRandom(num);
    for (let e of percs) {
      if (random <= (num * e.perc) / 100) {
        return block.substring(0, 1) + e.block;
      }
    }
  }

  blockExtist(x, y) {
    if (this.map.length !== 0) {
      return this.map.some((e) => {
        if (e.x === x && e.y === y) {
          return true;
        } else {
          return false;
        }
      });
    } else {
      return false;
    }
  }

  create() {
    for (let y = this.skyline; y < this.height; y++) {
      this.updatePercTerra(y);
      for (let x = 0; x < this.width; x++) {
        let c_X = x * this.size;
        let c_Y = y * this.size;
        if (this.blockExtist(c_X, c_Y)) continue;
        if (this.addSkyline(x, y)) continue;
        let block = this.randomBlock(this.perc, this.percBlock);
        let angle = this.getRandom(4, this.angle);
        if (block !== "Agua" && block !== "Piedra") {
          block = this.randomBlock(this.perc, this.percTerra, block);
          this.map.push({
            x: c_X,
            y: c_Y,
            block,
            angle,
          });
        } else {
          this.addFigure(c_X, c_Y, block, angle);
        }
      }
    }
  }

  updatePercTerra(y) {
    let high = this.height - this.skyline;
    let perc = Math.round(100 / high);
    let top = Math.round(high / 5) * perc;
    let factor = (y - this.skyline) * perc;
    if (factor === top) {
      this.percTerra[0].perc -= 20;
    }
    if (factor === top * 2) {
      this.percTerra[0].perc -= 20;
      this.percTerra[1].perc -= 20;
    }
    if (factor === top * 3) {
      this.percTerra[0].perc -= 20;
      this.percTerra[1].perc -= 20;
      this.percTerra[2].perc -= 20;
    }
    if (factor === top * 4) {
      this.percTerra[0].perc -= 20;
      this.percTerra[1].perc -= 20;
      this.percTerra[2].perc -= 20;
      this.percTerra[3].perc -= 20;
    }
    if (factor === top * 5) {
      this.percTerra[0].perc -= 20;
      this.percTerra[1].perc -= 20;
      this.percTerra[2].perc -= 20;
      this.percTerra[3].perc -= 20;
    }
  }

  addSkyline(x, y) {
    if (y === this.skyline) {
      this.map.push({
        x: x * this.size,
        y: y * this.size,
        block: "H0",
        angle: 0,
      });
      return true;
    } else {
      return false;
    }
  }

  addFigure(x, y, block, angle) {
    this.figures[this.getRandom(this.figures.length - 1)].forEach((e) => {
      if (!this.blockExtist(x + e.x, y + e.y)) {
        block = this.randomBlock(this.perc, this.percTerra, block);
        this.map.push({ x: x + e.x, y: y + e.y, block, angle });
      }
    });
  }

  get getMap() {
    return this.map;
  }
}
