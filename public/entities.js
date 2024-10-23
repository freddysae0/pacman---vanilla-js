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
  animation_right: "",
  animation_down: "",
  animation_up: "",
  animation_die: "",
  could_move: function (direction, map_design) {
    /* Portals */
    if (direction == Direction.LEFT && this.x == 2 && this.y == 15) {
      return true;
    }
    if (direction == Direction.RIGHT && this.x == 27 && this.y == 15) {
      return true;
    }
    /* Portals */
    if (Direction.LEFT == direction && map_design[this.y][this.x - 1] & 1) {
      return true;
    }
    if (Direction.RIGHT == direction && map_design[this.y][this.x + 1] & 1) {
      return true;
    }
    if (Direction.DOWN == direction && map_design[this.y + 1][this.x] & 1) {
      return true;
    }
    if (Direction.UP == direction && map_design[this.y - 1][this.x] & 1) {
      return true;
    }
    return false;
  },
  move_pacman: function (map_design) {
    /* PORTALS */
    if (this.moving_to == Direction.LEFT && this.x == 2 && this.y == 15) {
      this.x = 28;
    }
    if (this.moving_to == Direction.RIGHT && this.x == 27 && this.y == 15) {
      this.x = 1;
    }

    if (
      this.moving_to == Direction.LEFT &&
      map_design[this.y][this.x - 1] & 1
    ) {
      this.x -= this.speed;
    }
    if (
      this.moving_to == Direction.RIGHT &&
      map_design[this.y][this.x + 1] & 1
    ) {
      this.x += this.speed;
    }
    if (
      this.moving_to == Direction.DOWN &&
      map_design[this.y + 1][this.x] & 1
    ) {
      this.y += this.speed;
    }
    if (this.moving_to == Direction.UP && map_design[this.y - 1][this.x] & 1) {
      this.y -= this.speed;
    }
  },
};
