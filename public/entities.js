
const scale = 25;
let renderCounter = 0;
export const Direction = {
  LEFT: 1,
  RIGHT: 2,
  UP: 3,
  DOWN: 4,
  NO_MOVE: 0,
};
export const enemy_route = Array.from({ length: 31 }, () => new Array(31).fill(0));
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
const $lifes  = document.querySelector(".lifes-container");
 
export const drawLifes = (lifes) =>  {
    let innerContent = "";
    for (let i = 0; i < lifes; i++) {
        innerContent += `<img class="heart" src="./assets/heart.png" alt="Lifes">`
    }
    $lifes.innerHTML = innerContent    
}
export const pacman = {
  name: "Pacman",
  img: "./assets/entities/pacman.png",
  x: 14,
  y: 18,
  previousX: 14,
  previousY: 18,
  speed: 1,
  size: 25,
  moving_to: Direction.NO_MOVE,
  animation_right: "",
  animation_down: "",
  animation_up: "",
  animation_die: "",
  coins: 0,
  bfs: null,
  lifes: 3,
  enemies: [],
  ghostTime: 7000,
  resetEnemies: null,
  original_map_design : null,
  ghostMode: null,
  nextLevel: null,
  hasWon: false,

  drawLifes: function (val = this.lifes) {
    drawLifes(val)
  },
  drawCoinNumber: function (val = this.coins) {
    document.getElementById("coin-ammount").innerHTML = val;
  },
  activateGhostMode() {
    console.log("ghost mode started");
    
    this.enemies.map((enemy) => {
      enemy.convertToGhost();
    })
  },
  desactivateGhostMode() {
    console.log("ghost mode ended ");
    this.enemies.map((enemy) => {
      enemy.revertFromGhost();
    })
  },
  gameWined() {
    console.log("game wined");
    this.hasWon = true;
    this.nextLevel();

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
      } , this.ghostTime)

    }
    if (map_design[this.y][this.x] & 2) {
      this.coins+=100;
      map_design[this.y][this.x] = 1;
      this.drawCoinNumber();
      this.hasWon = false
    }


    console.log( this.coins % 26000 == 0 );
    
    if (this.coins % 26000 == 0 && !this.hasWon) {
      this.gameWined()
    }
  },
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
  
  die(){
    //What happens wen pacman dies
    this.lifes--;
    this.x = 14;
    this.y = 18;
    this.resetEnemies()
    drawLifes(this.lifes)
    
    
    if (this.lifes == 0) {
      console.log(this.lifes);
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

export const minimumPaths = new Array();

export class Enemy {
  constructor(
    color = "",
    y = 24,
    x = 14,
    map_design = [],
    enemy_route_main_point = {y: 6 , x: 7},
    start = {y: 2 , x: 2},
    delay = 0.2,
    img = "",
    speed = 1,
    size = 25,
    moving_to = Direction.RIGHT,
    animation_right = "",
    animation_down = "",
    animation_up = "",
    animation_die = "",
    coins = 0
  ) {
    this.isInPrison = true;
    this.isAGhost = false;
    this.hasReached = false;
    this.color = color;
    this.img = img;
    this.x = x;
    this.y = y;
    this.start = start;
    this.previousX = x;
    this.previousY = y;
    this.speed = speed;
    this.size = size;
    this.map_design = map_design;
    this.delay = delay;
    this.moving_to = moving_to;
    this.animation_right = animation_right;
    (this.animation_down = animation_down), (this.animation_up = animation_up);
    this.animation_die = animation_die;
    this.coins = coins;
    clearTimeout(this.appearTimeout);
    this.appearTimeout =  setTimeout(() => {
      this.x = 15
      this.y = 12
    }, delay * 1000);
  }

  reset(){
    this.isInPrison = true;
    this.isAGhost = false;
    this.hasReached = false;
    this.x = this.start.x;
    this.y = this.start.y;
    this.previousX = this.start.x;
    this.previousY = this.start.y;
    console.log("reseet");
    
    clearTimeout(this.appearTimeout);
    this.appearTimeou= setTimeout(() => {
      this.x = 15
      this.y = 12
     } , this.delay * 1000)
  }
  convertToGhost(){
    this.isAGhost = true; 
  }
  revertFromGhost(){
    this.isAGhost = false; 
  }
  freeFromPrision(){
    this.isInPrison = false;
    this.x= 14
    this.y= 12 
  }
  sendToPrison(){
    this.isInPrison = true;
    this.x= this.start.x
    this.y= this.start.y
    this.previousX= this.start.x
    this.previousY= this.start.y
    this.freeFromPrision()
  }
  hasTouchedPacman(){
    let res = false;
   
    if((this.x == pacman.x && this.y== pacman.y) || (this.previousX == pacman.x && this.previousY == pacman.y && pacman.previousX   )){
      res = true;
      console.log("isAGhost" , this.isAGhost);
      
    }
    else res = false
    
    if(this.isAGhost && ((this.x == pacman.x && this.y== pacman.y) || (this.previousX == pacman.x && this.previousY == pacman.y ))){
      this.sendToPrison()
    }
    if(!this.isAGhost && ((this.x == pacman.x && this.y== pacman.y) || (this.previousX == pacman.x && this.previousY == pacman.y ))){
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
  moveByBFS(bfsArray , moveHandler = true) {
    if (!moveHandler){
    this.hasTouchedPacman();
  return;
    }
    const directions = [
      { dx: 0, dy: -1 }, // Arriba
      { dx: 0, dy: 1 }, // Abajo
      { dx: -1, dy: 0 }, // Izquierda
      { dx: 1, dy: 0 }, // Derecha
    ];

    let minSteps = Infinity;
    let candidates = [];
    let available_directions = [];

    // Revisar las cuatro direcciones posibles
    for (let dir of directions) {
      let newX = this.x + dir.dx;
      let newY = this.y + dir.dy;
      if(newX == this.previousX && newY == this.previousY) continue;

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
          }
    // Elegir un candidato al azar si hay múltiples

    if (candidates.length > 0) {
      const chosen = candidates[Math.floor(Math.random() * candidates.length)];
      this.previousX = this.x;
      this.previousY = this.y;
      this.x = chosen.x;
      this.y = chosen.y;
    }
    this.hasTouchedPacman()

  }

  moveEnemy( map_design, bfsArray , moveHandler) {

  

    if (!this.hasReached) {
      this.hasReached = this.moveByBFS(bfsArray , moveHandler);
    }else  {

      if (!moveHandler){
        this.hasTouchedPacman();
      return;
        }
      this.moveInRoute(map_design)
    }
  }


  moveInRoute( ) {
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
    if (this.moving_to == Direction.UP ) {
      this.previousX = this.y;
      this.y -= this.speed;
    }



  }
  moveToOpositeDirection() {
    this.previousX  = this.x
    this.previousY  = this.y
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
  moveAsGhost(bfsArray , moveHandler = true) {
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

const showGameOver = () =>{
  console.log("game over");
  
    const $gameOver = document.querySelector('.game-over');
    $gameOver.style.opacity = 1;
}