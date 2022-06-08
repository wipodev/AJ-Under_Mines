/**
 * @author       Wladimir Perez <ajwipo@gmail.com>
 * @copyright    2021 AJWipo.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Creates the random map matrix according to provided parameters
 *
 * @param {num} width width of the map to create.
 * @param {num} height height of the map to create.
 * @param {num} skyline map horizon height.
 * @param {num} size map tiles size.
 * @param {num} angle rotation angle of map tiles.
 * @param {num} weightTiles Random percentage of map tiles.
 * @param {num} weightGroup Random percentage of map groups.
 * @param {array} percTiles percentage of appearance of each tile on the map.
 * @param {array} percGroup percentage of appearance of each group of tiles on the map.
 * @param {array} figures preset shape coordinates for certain types of tiles.
 * @returns {array}
 * @public
 */
export default class Maps {
  constructor({
    width,
    height,
    skyline,
    size,
    angle,
    weightTiles = 1000,
    weightGroup = 1000,
    percTiles,
    percGroup,
    figures,
  }) {
    this.width = width;
    this.height = height;
    this.skyline = skyline;
    this.size = size;
    this.weightTiles = weightTiles;
    this.weightGroup = weightGroup;
    this.angle = angle;
    this.percTiles = percTiles;
    this.percGroup = percGroup;
    this.figures = figures;
    this.gradient = 0;

    this.checkNumber(width, "width");
    this.checkNumber(height, "height");
    this.checkNumber(skyline, "skyLine");
    this.checkNumber(size, "size");
    this.checkNumber(weightTiles, "weightTiles");
    this.checkNumber(weightGroup, "weightGroup");
    this.checkNumber(angle, "angle");

    this.map = [];
    this.background = [];
    this.create();
    this.createBackground();
  }

  // verified that the entered values are of type numeric
  checkNumber(data, index) {
    if (!data) {
      return console.warn(`${index} ${data} esta vacio`);
    }
    if (typeof data !== "number") {
      return console.error(`el ${index} no es tipo Numero`);
    }
    return true;
  }

  // I get a random number according to the needs of the library
  getRandom(factor, angle = 1) {
    return Math.round(Math.random() * factor) * angle;
  }

  // I generate a random value to define the appropriate tile for its assignment to the map
  randomTile(num, percs, item, group = "") {
    let random = this.getRandom(num);
    for (let e of percs) {
      if (random <= e.perc) {
        return group.substring(0, 1) + e[item];
      }
    }
  }

  gradientSky(y) {
    let top = Math.round(this.skyline * 0.2);
    if (y > top * this.gradient && this.gradient < 5) {
      this.gradient++;
      return "S" + this.gradient;
    } else {
      return "S" + this.gradient;
    }
  }

  // check if the new tile already exists in the main array
  tileExtist(x, y) {
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

  // update the percentage values in which the tiles will come out to prioritize some tiles from others as you move down the map
  updatePercTile(y) {
    let high = this.height - this.skyline;
    let top = Math.round(high * 0.2);
    let factor = y - this.skyline;
    let reduce = this.weightTiles / 5;
    if (factor === top) {
      this.percTiles[0].perc -= reduce;
    }
    if (factor === top * 2) {
      this.percTiles[0].perc -= reduce;
      this.percTiles[1].perc -= reduce;
    }
    if (factor === top * 3) {
      this.percTiles[0].perc -= reduce;
      this.percTiles[1].perc -= reduce;
      this.percTiles[2].perc -= reduce;
    }
    if (factor === top * 4) {
      this.percTiles[0].perc -= reduce;
      this.percTiles[1].perc -= reduce;
      this.percTiles[2].perc -= reduce;
      this.percTiles[3].perc -= reduce;
    }
  }

  resetPercTile() {
    let reduce = this.weightTiles / 5;
    this.percTiles[0].perc += reduce * 4;
    this.percTiles[1].perc += reduce * 3;
    this.percTiles[2].perc += reduce * 2;
    this.percTiles[3].perc += reduce;
  }

  // main function that generates the main array that then generates the map
  create() {
    for (let y = this.skyline; y < this.height; y++) {
      this.updatePercTile(y);
      for (let x = 0; x < this.width; x++) {
        let c_X = x * this.size;
        let c_Y = y * this.size;
        if (this.tileExtist(c_X, c_Y)) continue;
        if (this.addSkyline(x, y)) continue;
        let group = this.randomTile(this.weightGroup, this.percGroup, "group");
        if (group !== "Water" && group !== "Rock") {
          this.addTile(c_X, c_Y, group);
        } else {
          this.addFigure(c_X, c_Y, group);
        }
      }
    }
  }

  createBackground() {
    let group = "SkyLine";
    this.resetPercTile();
    for (let y = 0; y < this.height; y++) {
      this.updatePercTile(y);
      if (y === this.skyline) {
        group = "Base";
        this.resetPercTile();
      }
      for (let x = 0; x < this.width; x++) {
        let c_X = x * this.size;
        let c_Y = y * this.size;
        let angle = 0;
        let tile = "";
        if (group === "SkyLine") {
          angle = 0;
          tile = this.gradientSky(y);
        } else {
          angle = this.getRandom(4, this.angle);
          tile = this.randomTile(
            this.weightTiles,
            this.percTiles,
            "tile",
            group
          );
        }
        this.background.push({
          x: c_X,
          y: c_Y,
          tile,
          angle,
        });
      }
    }
  }

  // insert the new tiles into the main die
  addTile(x, y, group = "Horizon", tile, angle) {
    if (tile === undefined) {
      tile = this.randomTile(this.weightTiles, this.percTiles, "tile", group);
    }
    if (angle === undefined) {
      angle = this.getRandom(4, this.angle);
    }
    let state = group === "Water" ? 1 : -1;
    if (group === "Horizon") {
      group = "Earth";
    }
    this.map.push({
      x,
      y,
      tile,
      angle,
      group,
      state,
      size: this.size,
    });
  }

  updateTile(x, y, group = "Horizon", tile, angle) {
    if (tile === undefined) {
      tile = this.randomTile(this.weightTiles, this.percTiles, "tile", group);
    }
    if (angle === undefined) {
      angle = this.getRandom(4, this.angle);
    }
    let state = group === "Water" ? 1 : -1;
    if (group === "Horizon") {
      group = "Earth";
    }
    this.map.some((e) => {
      if (e.x === x && e.y === y) {
        e.x = x;
        e.y = y;
        e.tile = tile;
        e.angle = angle;
        e.group = group;
        e.state = state;
      }
    });
  }

  // set the horizon line on the map
  addSkyline(x, y) {
    if (y === this.skyline) {
      this.addTile(x * this.size, y * this.size, "Horizon", "H0", 0);
      return true;
    } else {
      return false;
    }
  }

  // add preset shapes to the map according to the random group that appears in the creation of the map
  addFigure(x, y, group) {
    this.figures[group][this.getRandom(this.figures[group].length - 1)].forEach(
      (e) => {
        for (let h = 0; h < e.h / this.size; h++) {
          for (let w = 0; w < e.w / this.size; w++) {
            let x_T = x + e.x + w * this.size;
            let y_T = y + e.y + h * this.size;
            if (x_T >= this.width * this.size) {
              x_T = x_T - this.width * this.size;
              if (!this.tileExtist(x_T, y_T)) {
                this.addTile(x_T, y_T, group, e.t, e.a);
              } else {
                this.updatePercTile(x_T, y_T, group, e.t, e.a);
              }
            } else if (!this.tileExtist(x_T, y_T)) {
              this.addTile(x_T, y_T, group, e.t, e.a);
            }
          }
        }
      }
    );
  }

  // returns the main array for phaser to render on screen
  get getMap() {
    return this.map;
  }

  get getBackground() {
    return this.background;
  }
}
