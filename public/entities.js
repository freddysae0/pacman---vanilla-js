const scale = 25;
export const Direction = {
  LEFT: 1,
  RIGHT: 2,
  UP: 3,
  DOWN: 4,
  NO_MOVE: 0,
};
export const pacman = {
  name: "Pacman",
  img: "./assets/entities/pacman.png",
  x: 2,
  y: 2,
  speed: 1,
  size: 30,
  moving_to: Direction.NO_MOVE,
  move_pacman: function (map_design) {
    if (this.moving_to == Direction.LEFT && map_design[this.y][this.x - 1]) {
      this.x -= this.speed;
    }
    if (this.moving_to == Direction.RIGHT && map_design[this.y][this.x + 1]) {
      this.x += this.speed;
    }
    if (this.moving_to == Direction.DOWN && map_design[this.y + 1][this.x]) {
      this.y += this.speed;
    }
    if (this.moving_to == Direction.UP && map_design[this.y - 1][this.x]) {
      this.y -= this.speed;
    }
  },
};
