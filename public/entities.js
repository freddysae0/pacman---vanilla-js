export const Direction = {
  LEFT: 1,
  RIGHT: 2,
  UP: 3,
  DOWN: 4,
  NO_MOVE: 0,
  DIE: 5
};
const enemy_route = Array.from({ length: 31 }, () => new Array(31).fill(0));
enemy_route[2][2] = Direction.RIGHT;
enemy_route[2][7] = Direction.DOWN;
enemy_route[6][7] = Direction.LEFT;
enemy_route[6][2] = Direction.UP;


enemy_route[2][22] = Direction.RIGHT;
enemy_route[2][27] = Direction.DOWN;
enemy_route[6][27] = Direction.LEFT;
enemy_route[6][22] = Direction.UP;

enemy_route[27][7] = Direction.UP;
enemy_route[24][7] = Direction.RIGHT;
enemy_route[24][10] = Direction.DOWN;
enemy_route[27][10] = Direction.RIGHT;
enemy_route[27][13] = Direction.DOWN;
enemy_route[30][13] = Direction.LEFT;
enemy_route[30][2] = Direction.UP;
enemy_route[27][2] = Direction.RIGHT;


enemy_route[27][19] = Direction.UP;
enemy_route[24][19] = Direction.RIGHT;
enemy_route[24][22] = Direction.DOWN;
enemy_route[27][22] = Direction.RIGHT;
enemy_route[27][27] = Direction.DOWN;
enemy_route[30][27] = Direction.LEFT;
enemy_route[30][16] = Direction.UP;
enemy_route[27][16] = Direction.RIGHT;
const $lifes = document.querySelector(".lifes-container");

/**
 * Representa el personaje de Pacman en el juego.
 * @type {Object}
 * @property {string} name - El nombre del personaje.
 * @property {string} img - La ruta de la imagen de Pacman.
 * @property {number} x - La posición X actual en el mapa.
 * @property {number} y - La posición Y actual en el mapa.
 * @property {number} previousX - La posición X previa de Pacman.
 * @property {number} previousY - La posición Y previa de Pacman.
 * @property {number} speed - La velocidad de movimiento de Pacman.
 * @property {number} size - El tamaño de Pacman.
 * @property {Direction} _moving_to - Dirección de movimiento actual de Pacman.
 * @property {string} currentAnimation - Ruta de la animación actual.
 * @property {number} currentFrame - Fotograma actual de la animación.
 * @property {string} animation_right - Ruta de la animación hacia la derecha.
 * @property {string} animation_down - Ruta de la animación hacia abajo.
 * @property {string} animation_up - Ruta de la animación hacia arriba.
 * @property {string} animation_left - Ruta de la animación hacia la izquierda.
 * @property {number} coins - Cantidad de monedas recogidas por Pacman.
 * @property {number} bfs - Estado del algoritmo BFS en el juego.
 * @property {number} lifes - Número de vidas restantes de Pacman.
 * @property {Array} enemies - Lista de enemigos presentes en el juego.
 * @property {number} ghostTime - Tiempo en que los fantasmas se mantienen en modo vulnerable.
 * @property {boolean} hasWon - Estado de victoria del juego.
 * 
 * @property {Function} resetEnemies - Función para reiniciar los enemigos.
 * @property {Object|null} original_map_design - Diseño original del mapa.
 * @property {Object|null} animations - Colección de animaciones.
 * 
 * @property {Function} get moving_to - Retorna la dirección a la que se está moviendo Pacman.
 * @property {Function} set moving_to - Establece la dirección de movimiento de Pacman y actualiza la animación.
 * @property {Function} nextFrame - Avanza al siguiente fotograma de la animación actual.
 * @property {Function} setAnimation - Establece la animación actual de acuerdo a la dirección dada.
 * @property {Function} drawLifes - Actualiza el número de vidas mostrado en pantalla.
 * @property {Function} drawCoinNumber - Actualiza el número de monedas mostrado en pantalla.
 * @property {Function} activateGhostMode - Activa el modo de fantasma para todos los enemigos.
 * @property {Function} desactivateGhostMode - Desactiva el modo de fantasma y restaura el estado normal de los enemigos.
 * @property {Function} gameWined - Gestiona la lógica cuando Pacman gana el juego.
 * @property {Function} eat_food - Gestiona la comida recolectada por Pacman y activa el modo fantasma si es necesario.
 * @property {Function} could_move - Determina si Pacman puede moverse en la dirección indicada.
 * @property {Function} die - Gestiona la lógica cuando Pacman pierde una vida.
 * @property {Function} move_pacman - Mueve a Pacman en la dirección actual, calcula y devuelve la ruta más corta hacia los fantasmas.
 */
export const pacman = {
  name: "Pacman",
  img: "./assets/entities/pacman.png",
  x: 14,
  y: 18,
  previousX: 14,
  previousY: 18,
  speed: 1,
  size: 30,
  _moving_to: Direction.NO_MOVE,
  currentAnimation: "./assets/pacman/moving-up",
  currentFrame: 0,
  animation_right: "./assets/pacman/moving-right",
  animation_down: "./assets/pacman/moving-down",
  animation_up: "./assets/pacman/moving-up",
  animation_left: "./assets/pacman/moving-left",
  coins: 0,
  bfs: null,
  lifes: 3,
  enemies: [],
  ghostTime: 7000,
  resetEnemies: null,
  original_map_design: null,
  ghostMode: null,
  nextLevel: null,
  hasWon: false,
  animations: null,

  /**
   * Returns the direction to which the player is currently moving.
   * @returns {number} The direction to which the player is moving.
   *   It is one of the predefined directions in the Direction object
   *   (e.g., Direction.LEFT, Direction.RIGHT, Direction.UP, Direction.DOWN, Direction.NO_MOVE).
   */
  get moving_to() {
    return this._moving_to;
  },
  /**
   * Sets the direction to which the player is moving.
   * This property is used to update the animation of the player.
   * @param {number} value - The direction to which the player is moving.
   *   It should be one of the predefined directions in the Direction object
   *   (e.g., Direction.LEFT, Direction.RIGHT, Direction.UP, Direction.DOWN, Direction.NO_MOVE).
   */
  set moving_to(value) {
    if (value == this._moving_to) {
      return;
    }
    this._moving_to = value
    this.setAnimation(value)

  },

  /**
   * Goes to the next frame of the current animation.
   * If the end of the animation is reached, resets to the first frame.
   */
  nextFrame() {
    if (this.currentFrame == this.animations[this.currentAnimation].length - 1) {
      this.currentFrame = 0;
    }
    else {
      this.currentFrame++;
    }
  },

  /**
   * Sets the current animation based on the specified direction.
   * 
   * @param {number} direction - The direction for which to set the animation.
   *   This should be one of the predefined Direction constants:
   *   - Direction.LEFT: Sets the animation to moving left.
   *   - Direction.RIGHT: Sets the animation to moving right.
   *   - Direction.UP: Sets the animation to moving up.
   *   - Direction.DOWN: Sets the animation to moving down.
   *   - Direction.DIE: Sets the animation to dying.
   */
  setAnimation: function (direction) {
    if (direction == Direction.LEFT) {
      this.currentAnimation = this.animation_left;
    }
    if (direction == Direction.RIGHT) {
      this.currentAnimation = this.animation_right;
    }
    if (direction == Direction.UP) {
      this.currentAnimation = this.animation_up;
    }
    if (direction == Direction.DOWN) {
      this.currentAnimation = this.animation_down;

    }
    if (direction == Direction.DIE) {
      this.currentAnimation = this.animation_die;

    }
  },

  /**
   * Updates the number of lifes displayed on the top-right corner of the screen.
   * If `val` is not provided, it defaults to the current value of `this.lifes`.
   * @param {number} [val=this.lifes] - The number of lifes to be displayed.
   */
  drawLifes: function (val = this.lifes) {
    drawLifes(val)
  },
  /**
   * Updates the number of coins displayed on the top-right corner of the screen.
   * If `val` is not provided, it defaults to the current value of `this.coins`.
   * @param {number} [val=this.coins] - The number of coins to be displayed.
   */
  drawCoinNumber: function (val = this.coins) {
    document.getElementById("coin-ammount").innerHTML = val;
  },

  /**
   * Activates the Ghost Mode, converting all enemies to Ghosts.
   * It changes their behavior and appearance.
   * This method is used when the player eats a Power Pellet.
   */
  activateGhostMode() {
    console.log("ghost mode started");

    this.enemies.map((enemy) => {
      enemy.convertToGhost();
    })
  },
  /**
   * Deactivates the Ghost Mode, reverting all enemies to their normal state.
   */
  desactivateGhostMode() {
    console.log("ghost mode ended ");
    this.enemies.map((enemy) => {
      enemy.revertFromGhost();
    })
  },

  /**
   * Revisa si el Pacman ha comido un Power Up o una Coin.
   * Si ha comido una Power Up, activa el modo de fantasma y
   * reinicia el temporizador.
   * Si ha comido una Coin, suma 100 coins y vuelve a dibujar la cantidad de coins.
   * Si ha alcanzado 26000 coins, gana el juego.
   * @param {Array<Array<number>>} map_design - El dise o del mapa
   */
  gameWined() {
    console.log("game wined");
    this.hasWon = true;
    this.nextLevel();

    /*************  ✨ Codeium Command ⭐  *************/
    /**
     * Revisa si el Pacman ha comido un Power Up o una Coin.
     * Si ha comido una Power Up, activa el modo de fantasma y
     * reinicia el temporizador.
     * Si ha comido una Coin, suma 100 coins y vuelve a dibujar la cantidad de coins.
     * Si ha alcanzado 26000 coins, gana el juego.
     * @param {Array<Array<number>>} map_design - El dise o del mapa
     */
    /******  a1d6984e-1811-4581-b204-f15ab32f719a  *******/
  },

  eat_food: function (map_design) {
    if (map_design[this.y][this.x] & 4) {
      this.coins += 500;

      map_design[this.y][this.x] = 1;
      this.drawCoinNumber();
      this.activateGhostMode();
      clearTimeout(this.ghostMode);
      this.ghostMode = setTimeout(() => {
        this.desactivateGhostMode();
      }, this.ghostTime)

    }
    if (map_design[this.y][this.x] & 2) {
      this.coins += 100;
      map_design[this.y][this.x] = 1;
      this.drawCoinNumber();
      this.hasWon = false
    }



    if (this.coins % 26000 == 0 && !this.hasWon) {
      this.gameWined()
    }
  },
  /**
   * Determines if pacman can move in the given direction
   * @param {number} direction - The direction pacman wants to move
   * @param {Array<Array<number>>} map_design - The current map design
   * @returns {boolean} true if pacman can move, false otherwise
   */
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

  /**
   * Called when pacman dies
   * Decrements lifes and resets pacman position to the starting one
   * Also resets the enemies position
   * If lifes are 0, shows the game over screen
   */
  die() {
    //What happens wen pacman dies
    this.lifes--;
    this.x = 14;
    this.y = 18;
    this.resetEnemies()
    drawLifes(this.lifes)


    if (this.lifes == 0) {
      showGameOver()
    }
  },
  /**
   * Mueve a pacman en la dirección especificada por this.moving_to
   * Si pacman no puede moverse en esa dirección, no hace nada
   * Si pacman puede moverse, actualiza su posición y come la comida
   * que esté en esa posición
   * Luego, calcula la ruta más corta a los fantasmas y la devuelve
   * @param {Array<Array<number>>} map_design - El diseño del mapa
   * @param {Array<Enemy>} enemies - Los fantasmas
   * @returns {Array<Array<number>>} La ruta más corta a los fantasmas
   */
  move_pacman: function (map_design, enemies) {
    let itCouldMove = false;

    /* PORTALS */
    if (this.moving_to == Direction.LEFT && this.x == 2 && this.y == 15) {
      itCouldMove = true
      this.previousX = this.x;
      this.x = 28;
    }
    if (this.moving_to == Direction.RIGHT && this.x == 27 && this.y == 15) {
      itCouldMove = true
      this.previousX = this.x;
      this.x = 1;
    }
    /* PORTALS */

    if (
      this.moving_to == Direction.LEFT &&
      map_design[this.y][this.x - 1] & 1
    ) {
      itCouldMove = true
      this.previousX = this.x;
      this.x -= this.speed;
    }
    if (
      this.moving_to == Direction.RIGHT &&
      map_design[this.y][this.x + 1] & 1
    ) {
      itCouldMove = true
      this.previousX = this.x;
      this.x += this.speed;
    }
    if (
      this.moving_to == Direction.DOWN &&
      map_design[this.y + 1][this.x] & 1
    ) {
      itCouldMove = true
      this.previousY = this.y;
      this.y += this.speed;
    }
    if (this.moving_to == Direction.UP && map_design[this.y - 1][this.x] & 1) {
      itCouldMove = true
      this.previousY = this.y;
      this.y -= this.speed;
    }


    if (!itCouldMove) {
      this.previousX = this.x;
      this.previousY = this.y;
    }
    this.eat_food(map_design);

    this.bfs = BFS(map_design, [this.y, this.x], enemies);

    return this.bfs;
  },
};

export class Enemy {
  /**
   * Crea un nuevo fantasma
   * @param {string} [color=""] - El color del fantasma
   * @param {number} [y=24] - La posición y del fantasma
   * @param {number} [x=14] - La posición x del fantasma
   * @param {Array<Array<number>>} [map_design=[]] - El diseño del mapa
   * @param {{y: number, x: number}} [enemy_route_main_point={y: 6, x: 7}] - La posición principal de la ruta del fantasma
   * @param {{y: number, x: number}} [start={y: 2, x: 2}] - La posición de inicio del fantasma
   * @param {number} [delay=0.2] - El retraso antes de que el fantasma aparezca
   * @param {Object} [animations=null] - Las animaciones del fantasma
   */
  constructor(
    color = "",
    y = 24,
    x = 14,
    map_design = [],
    enemy_route_main_point = { y: 6, x: 7 },
    start = { y: 2, x: 2 },
    delay = 0.2,
    animations = null,


  ) {
    this.currentFrame = 0,
      this.animations = animations;
    this.currentAnimation = `./assets/${color}-enemy/moving-right`,
      this.animation_right = `./assets/${color}-enemy/moving-right`,
      this.animation_down = `./assets/${color}-enemy/moving-down`,
      this.animation_up = `./assets/${color}-enemy/moving-up`,
      this.animation_left = `./assets/${color}-enemy/moving-left`,
      this.isInPrison = true;
    this.isAGhost = false;
    this.hasReached = false;
    this.color = color;
    this.x = x;
    this.y = y;
    this.start = start;
    this.previousX = x;
    this.previousY = y;
    this.speed = 1;
    this._moving_to = Direction.RIGHT;
    this.size = 30;
    this.map_design = map_design;
    this.delay = delay;

    clearTimeout(this.appearTimeout);
    this.appearTimeout = setTimeout(() => {
      this.x = 15
      this.y = 12
    }, delay * 1000);
  }

  // Getter y Setter para moving_to
  get moving_to() {
    return this._moving_to;
  }

  /**
   * Set the direction to which the enemy is moving.
   * This property is used to update the animation of the enemy.
   * @param {number} value - The direction to which the enemy is moving.
   *   It should be one of the predefined directions in the Direction object
   *   (e.g., Direction.LEFT, Direction.RIGHT, Direction.UP, Direction.DOWN, Direction.DIE).
   */
  set moving_to(value) {
    if (value === this._moving_to) {
      return;
    }

    this._moving_to = value;
    this.setAnimation(value);  // Se necesita una implementación de setAnimation
  }


  /**
   * Advances the current animation frame to the next frame.
   * If the current frame is the last frame in the animation sequence,
   * it resets to the first frame.
   */
  nextFrame() {
    if (this.currentFrame == this.animations[this.currentAnimation].length - 1) {
      this.currentFrame = 0;
    }
    else {
      this.currentFrame++;
    }
  }
  /**
   * Updates the current animation based on the given direction.
   * 
   * @param {number} direction - The direction for which to set the animation.
   *   It should be one of the predefined directions in the Direction object
   *   (e.g., Direction.LEFT, Direction.RIGHT, Direction.UP, Direction.DOWN, Direction.DIE).
   */
  setAnimation(direction) {
    if (direction == Direction.LEFT) {
      this.currentAnimation = this.animation_left;
    }
    if (direction == Direction.RIGHT) {
      this.currentAnimation = this.animation_right;
    }
    if (direction == Direction.UP) {
      this.currentAnimation = this.animation_up;
    }
    if (direction == Direction.DOWN) {
      this.currentAnimation = this.animation_down;

    }
    if (direction == Direction.DIE) {
      this.currentAnimation = this.animation_die;

    }
  }
  /**
   * Resets the enemy to its starting position and state
   * @return {undefined}
   */
  reset() {
    this.isInPrison = true;
    this.isAGhost = false;
    this.hasReached = false;
    this.x = this.start.x;
    this.y = this.start.y;
    this.previousX = this.start.x;
    this.previousY = this.start.y;

    clearTimeout(this.appearTimeout);
    this.appearTimeou = setTimeout(() => {
      this.x = 15
      this.y = 12
    }, this.delay * 1000)
  }

  /**
   * Sets the enemy as a ghost by setting the isAGhost flag to true.
   * This method is used to mark the enemy as a ghost in the game logic.
   */
  convertToGhost() {
    this.isAGhost = true;
  }
  /**
   * Reverts the enemy from ghost state to normal state.
   * Sets the isAGhost flag to false.
   */
  revertFromGhost() {
    this.isAGhost = false;
  }
  /**
   * Free the enemy from prison by setting its position to the coordinates
   * right outside the prison and marking it as not being in prison.
   */
  freeFromPrision() {
    this.isInPrison = false;
    this.x = 14
    this.y = 12
  }

  /**
   * Sends the enemy to prison by setting its position to the starting coordinates.
   * Also marks the enemy as being in prison. Invokes the freeFromPrision method
   * to handle additional logic for freeing from prison state.
   */
  sendToPrison() {
    this.isInPrison = true;
    this.x = this.start.x
    this.y = this.start.y
    this.previousX = this.start.x
    this.previousY = this.start.y
    this.freeFromPrision()
  }
  /**
   * Checks if the enemy has touched pacman.
   * If the enemy is a ghost, it will be sent to prison.
   * If the enemy is not a ghost, pacman will die.
   * @returns {boolean} True if the enemy has touched pacman, false otherwise.
   */
  hasTouchedPacman() {
    let res = false;

    if ((this.x == pacman.x && this.y == pacman.y) || (this.previousX == pacman.x && this.previousY == pacman.y && pacman.previousX)) {
      res = true;

    }
    else res = false

    if (this.isAGhost && ((this.x == pacman.x && this.y == pacman.y) || (this.previousX == pacman.x && this.previousY == pacman.y))) {
      this.sendToPrison()
    }
    if (!this.isAGhost && ((this.x == pacman.x && this.y == pacman.y) || (this.previousX == pacman.x && this.previousY == pacman.y))) {
      pacman.die()

    }
    return res;

  }


  couldMove(direction, map_design) {
    /* Portals */
    if (direction == Direction.LEFT && this.x == 2 && this.y == 15) {
      return true;
    }
    if (direction == Direction.RIGHT && this.x == 27 && this.y == 15) {
      return true;
    }
    /* Portals */
    if (direction == Direction.LEFT && map_design[this.y][this.x - 1] & 1) {
      return true;
    }
    if (direction == Direction.RIGHT && map_design[this.y][this.x + 1] & 1) {
      return true;
    }
    if (direction == Direction.DOWN && map_design[this.y + 1][this.x] & 1) {
      return true;
    }
    if (direction == Direction.UP && map_design[this.y - 1][this.x] & 1) {
      return true;
    }
    return false;
  }
  changeDirection(map_design) {
    const available_directions = [];

    if (this.couldMove(Direction.LEFT, map_design)) {
      available_directions.push(Direction.LEFT);
    }
    if (this.couldMove(Direction.RIGHT, map_design)) {
      available_directions.push(Direction.RIGHT);
    }
    if (this.couldMove(Direction.DOWN, map_design)) {
      available_directions.push(Direction.DOWN);
    }
    if (this.couldMove(Direction.UP, map_design)) {
      available_directions.push(Direction.UP);
    }

    this.moving_to =
      available_directions[
      Math.floor(Math.random() * available_directions.length)
      ];
  }

  /**
   * 
   * @param {<Array>Array} bfsArray the result of call BFS function
   * @returns A boolean, true for indicate the enemy has reached the target, false for the oposite
   */
  moveByBFS(bfsArray, moveHandler = true) {
    if (!moveHandler) {
      this.hasTouchedPacman();
      return;
    }
    const directions = [
      { dx: -1, dy: 0 }, // Izquierda
      { dx: 1, dy: 0 }, // Derecha
      { dx: 0, dy: -1 }, // Arriba
      { dx: 0, dy: 1 }, // Abajo
    ];

    let minSteps = Infinity;
    let candidates = [];
    let available_directions = [];

    // Revisar las cuatro direcciones posibles

    directions.forEach((dir, i) => {


      let newX = this.x + dir.dx;
      let newY = this.y + dir.dy;
      if (newX == this.previousX && newY == this.previousY) return;

      // Asegúrate de que la nueva posición esté dentro de los límites del arreglo
      if (newX == 1 && newY == 15) {
        newX = 27;
        newY = 15;
      }
      if (newX == 28 && newY == 15) {
        newX = 2;
        newY = 15;
      }

      if (bfsArray[newY][newX]) {
        const steps = bfsArray[newY][newX];

        // Si encontramos un nuevo mínimo, reiniciamos los candidatos
        if (steps < minSteps) {
          minSteps = steps;
          candidates = [{ x: newX, y: newY }];
        } else if (steps === minSteps) {
          // Si es igual al mínimo, lo añadimos a los candidatos
          candidates.push({ x: newX, y: newY });
        }
      }
      if (this.map_design[newY][newX] & 1) {
        available_directions.push(dir);
      }
    })
    // Elegir un candidato al azar si hay múltiples

    if (candidates.length > 0) {
      const chosen = candidates[Math.floor(Math.random() * candidates.length)];
      this.previousX = this.x;
      this.previousY = this.y;
      this.x = chosen.x;
      this.y = chosen.y;
      this.moving_to = this.getMovementDirection(this.x, this.y, this.previousX, this.previousY)


    }
    this.hasTouchedPacman()

  }

  /**
   * Devuelve la dirección que se movió el fantasma, comparando las
   * posiciones actuales y previas.
   * @param {number} x Posición actual en el eje x
   * @param {number} y Posición actual en el eje y
   * @param {number} previousX Posición previa en el eje x
   * @param {number} previousY Posición previa en el eje y
   * @returns {number} La dirección en que se movió el fantasma (constante de Direction)
   */
  getMovementDirection(x, y, previousX, previousY) {
    if (x > previousX) {
      return Direction.RIGHT; // Se movió hacia la derecha
    } else if (x < previousX) {
      return Direction.LEFT; // Se movió hacia la izquierda
    } else if (y > previousY) {
      return Direction.DOWN; // Se movió hacia abajo
    } else if (y < previousY) {
      return Direction.UP; // Se movió hacia arriba
    } else {
      return Direction.NO_MOVE; // No hubo movimiento
    }
  }

  /**
   * Moves the enemy according to its internal state
   * @param {Array<Array<number>>} map_design - The map design
   * @param {Array<Array<number>>} bfsArray - The BFS array
   * @param {Boolean} moveHandler - If false, the hasTouchedPacman method will be called
   */
  moveEnemy(map_design, bfsArray, moveHandler) {



    if (!this.hasReached) {
      this.hasReached = this.moveByBFS(bfsArray, moveHandler);
    } else {

      if (!moveHandler) {
        this.hasTouchedPacman();
        return;
      }
      this.moveInRoute(map_design)
    }
  }


  /**
   * Moves the enemy along a predefined route based on the current position.
   * Updates the enemy's direction and position according to the route map.
   * Adjusts `moving_to`, `x`, and `y` properties depending on the direction.
   * Utilizes the `enemy_route` matrix to determine the next direction of movement.
   */
  moveInRoute() {
    if (enemy_route[this.y][this.x]) {
      this.moving_to = enemy_route[this.y][this.x]
    }

    if (
      this.moving_to == Direction.LEFT
    ) {
      this.previousX = this.x;
      this.x -= this.speed;
    }
    if (
      this.moving_to == Direction.RIGHT
    ) {
      this.previousX = this.x;
      this.x += this.speed;
    }
    if (
      this.moving_to == Direction.DOWN
    ) {
      this.previousX = this.y;
      this.y += this.speed;
    }
    if (this.moving_to == Direction.UP) {
      this.previousX = this.y;
      this.y -= this.speed;
    }



  }
  moveToOpositeDirection() {
    this.previousX = this.x
    this.previousY = this.y
    if (this.moving_to == Direction.LEFT) {
      this.moving_to = Direction.RIGHT;
    }
    if (this.moving_to == Direction.RIGHT) {
      this.moving_to = Direction.LEFT;
    }
    if (this.moving_to == Direction.DOWN) {
      this.moving_to = Direction.UP;
    }
    if (this.moving_to == Direction.UP) {
      this.moving_to = Direction.DOWN;
    }

  }
  /**
  * Moves the ghost to the position that is farthest from Pacman based on the
  * given BFS array.
  * @param {Number[][]} bfsArray - A 2D array representing the steps needed to reach Pacman.
  * @param {Boolean} moveHandler - If false, the ghost will not move and instead
  *                                will trigger the hasTouchedPacman method.
  */
  moveAsGhost(bfsArray, moveHandler = true) {
    if (!moveHandler) {
      this.hasTouchedPacman();
      return;
    }
    const directions = [
      { dx: 0, dy: -1 }, // Arriba
      { dx: 0, dy: 1 },  // Abajo
      { dx: -1, dy: 0 }, // Izquierda
      { dx: 1, dy: 0 },  // Derecha
    ];

    let maxSteps = -Infinity;
    let candidates = [];
    let available_directions = [];

    // Revisar las cuatro direcciones posibles
    for (let dir of directions) {
      let newX = this.x + dir.dx;
      let newY = this.y + dir.dy;
      if (newX === this.previousX && newY === this.previousY) continue;

      // Verificar los límites de las posiciones
      if (newX === 1 && newY === 15) {
        newX = 27;
        newY = 15;
      }
      if (newX === 28 && newY === 15) {
        newX = 2;
        newY = 15;
      }

      // Revisar si la nueva posición está en el array y tiene un valor
      if (bfsArray[newY][newX]) {
        const steps = bfsArray[newY][newX];

        // Si encontramos un nuevo máximo, reiniciamos los candidatos
        if (steps > maxSteps) {
          maxSteps = steps;
          candidates = [{ x: newX, y: newY }];
        } else if (steps === maxSteps) {
          // Si es igual al máximo, lo añadimos a los candidatos
          candidates.push({ x: newX, y: newY });
        }
      }
      if (this.map_design[newY][newX] & 1) {
        available_directions.push(dir);
      }
    }

    // Elegir un candidato al azar si hay múltiples
    if (candidates.length > 0) {
      const chosen = candidates[Math.floor(Math.random() * candidates.length)];
      this.previousX = this.x;
      this.previousY = this.y;
      this.x = chosen.x;
      this.y = chosen.y;
      this.moving_to = this.getMovementDirection(this.x, this.y, this.previousX, this.previousY)

    }
    this.hasTouchedPacman();
  }

}



/**
 * 
 * @param {<Array>Array} matrix The map design 
 * @param {Array} start The y and x in [y,x] format
 * @returns A matrix with the cost of access to every point from the y,x coordinates. 
 */

export function BFS(matrix, start) {
  let bfsArray = Array.from({ length: matrix.length }, () =>
    new Array(matrix[1].length).fill(null)
  );

  let visited = new Set([start.toString()]);
  let directions = [
    [0, 1], // right
    [1, 0], // down
    [0, -1], // left
    [-1, 0], // up
  ];

  let [currentY, currentX] = start;
  let queue = [[currentY, currentX, 1]]; // Each entry: [y, x, level]

  while (queue.length > 0) {
    let [currentY, currentX, level] = queue.shift();

    bfsArray[currentY][currentX] = level;

    for (let [dy, dx] of directions) {
      let newY = currentY + dy;
      let newX = currentX + dx;
      let newLevel = level + 1;

      // Boundary and obstacle check
      if (
        newY >= 1 &&
        newY < matrix.length &&
        newX >= 1 &&
        newX < matrix[1].length &&
        matrix[newY][newX] & 1 && // Adjust for obstacles (if any)
        !visited.has([newY, newX].toString())
      ) {
        visited.add([newY, newX].toString());
        queue.push([newY, newX, newLevel]);
      }

      /* PORTALS */
      if (newY == 15 && newX == 28 && !visited.has([15, 2].toString())) {
        queue.push([15, 2, newLevel]);
        visited.add([15, 2].toString());
      }
      if (newY == 15 && newX == 1 && !visited.has([15, 27].toString())) {
        queue.push([15, 27, newLevel]);
        visited.add([15, 27].toString());
      }
      /* PORTALS */
    }
  }

  return bfsArray;
}

export const showGameOver = () => {
  console.log("game over");

  const $gameOver = document.querySelector('.game-over');
  $gameOver.style.opacity = 1;
}


export function drawLifes(lifes) {
  let innerContent = "";
  for (let i = 0; i < lifes; i++) {
    innerContent += `<img class="heart" src="./assets/heart.png" alt="Lifes">`
  }
  $lifes.innerHTML = innerContent
}