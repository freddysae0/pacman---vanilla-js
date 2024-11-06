import { Direction, pacman, Enemy, minimumPaths, BFS , enemy_route , drawLifes } from "./entities.js";

import { fillTheLevel } from "./fillTheLevel.js";

const canvas = document.getElementById("screen");
/** @type {CanvasRenderingContext2D} */
var ctx = canvas.getContext("2d");

export const x = 25;
const widthBlocks = 29;
const heightBlocks = 32;
let map_design = new Array(heightBlocks);
drawLifes(3)


const width = widthBlocks * x;
const height = heightBlocks * x;
canvas.setAttribute("width", `${width}`);
canvas.setAttribute("height", `${height}`);

const States = {
  chase: 1,
  scatter: 2,
  frightened: 3
}

let state = States.chase;



for (let i = 1; i <= heightBlocks; i++) {
  map_design[i] = new Array(widthBlocks + 1);
  for (let j = 1; j <= widthBlocks; j++) {
    map_design[i][j] = 0;
  }
}
// Declara el objeto 'keys' para almacenar el estado de las teclas
const keys = {};
const original_map_design = map_design;
// Eventos para detectar cuando una tecla se presiona
window.addEventListener("keydown", (e) => {
  keys[e.key] = true; // Marca la tecla como presionada
});

// Evento para detectar cuando una tecla se libera
window.addEventListener("keyup", (e) => {
  keys[e.key] = false; // Marca la tecla como liberada
});


// Variables para detectar el inicio y final del toque
let startX, startY;

// Evento para detectar cuando el usuario toca la pantalla
window.addEventListener("touchstart", (e) => {
  const touch = e.touches[0];
  startX = touch.clientX;
  startY = touch.clientY;
});

// Evento para detectar cuando el usuario mueve el dedo
window.addEventListener("touchmove", (e) => {
  e.preventDefault(); // Evitar el comportamiento predeterminado de desplazamiento
});

// Evento para detectar cuando el usuario levanta el dedo (fin del swipe)
window.addEventListener("touchend", (e) => {
  const touch = e.changedTouches[0];
  const endX = touch.clientX;
  const endY = touch.clientY;

  const diffX = endX - startX;
  const diffY = endY - startY;

  // Determinar la dirección del deslizamiento
  if (Math.abs(diffX) > Math.abs(diffY)) {
    // Deslizamiento horizontal
    if (diffX > 0) {
      keys["ArrowRight"] = true; // Marca la flecha derecha como presionada
      setTimeout(() => (keys["ArrowRight"] = false), 100); // Libera la tecla después de un momento
    } else {
      keys["ArrowLeft"] = true; // Marca la flecha izquierda como presionada
      setTimeout(() => (keys["ArrowLeft"] = false), 100);
    }
  } else {
    // Deslizamiento vertical
    if (diffY > 0) {
      keys["ArrowDown"] = true; // Marca la flecha abajo como presionada
      setTimeout(() => (keys["ArrowDown"] = false), 100);
    } else {
      keys["ArrowUp"] = true; // Marca la flecha arriba como presionada
      setTimeout(() => (keys["ArrowUp"] = false), 100);
    }
  }
});

fillTheLevel(map_design);

const violetRouteBFS = BFS(map_design,[6,7])
const redRouteBFS = BFS(map_design,[6,22])
const orangeRouteBFS = BFS(map_design,[24,10])
const yellowRouteBFS = BFS(map_design,[24,22])
export let enemies = [
  new Enemy("red", 14, 16, map_design, {y:6 , x:22}  , {y:14 , x:16}  ,  1),
  new Enemy("violet", 14, 13, map_design, {y:6 , x:7}, {y:14 , x:13}  ,6),
  new Enemy("orange", 16, 13, map_design,{y:24 , x:10} ,{y:16 , x:13} , 11),
  new Enemy("green", 16, 16, map_design, {y:24 , x:22},{y:16 , x:16}  ,21),
];

pacman.nextLevel = ()=>{
  reset(true)
}

pacman.enemies= enemies;
pacman.resetEnemies= resetEnemies;
const img = new Image(); // Create a new image object
img.src = "./assets/map.webp";
img.onload = () => {
  ctx.drawImage(img, x, x, width - 20, height - 25);
  for (let i = 1; i <= heightBlocks; i++) {
    for (let j = 1; j <= widthBlocks; j++) {
      if (map_design[i][j] == true) {
        ctx.fillStyle = "white";
        ctx.fillRect(j * x, i * x, x, x);
      }
    }
  }
};
const renderInterval = 0.2;
const changeStateInterval = 10;
let frame = 0;
let accumulatedTime = 0;
let accumulatedTime10 = 0;
let lastTime = 0;
function gameLoop(currentTime) {
  frame++;
  let deltaTime = (currentTime - lastTime) / 1000;
  lastTime = currentTime;
  accumulatedTime += deltaTime;
  accumulatedTime10 +=deltaTime;
  // Check if 0.3 seconds have passed
  if (accumulatedTime >= renderInterval) {
    render();
    accumulatedTime = 0; // Reset the accumulated time
  }
  if (accumulatedTime10 >= changeStateInterval) {
    console.log("change status");
    
    if (state == States.chase) {
      state = States.scatter
      enemies[0].hasReached = false
      enemies[1].hasReached = false
      enemies[2].hasReached = false
      enemies[3].hasReached = false
    }else if (state == States.scatter) {
      state = States.chase
    }
    accumulatedTime10 = 0;
  }

  update();

  requestAnimationFrame(gameLoop);
  // Llama a gameLoop en el siguiente fotograma
}

// Actualiza la lógica del juego
function update() {
  // Aquí puedes añadir la lógica de actualización, como el movimiento del jugador

  if (keys["ArrowUp"] && pacman.could_move(Direction.UP, map_design)) {
    pacman.moving_to = Direction.UP;
  }
  if (keys["ArrowDown"] && pacman.could_move(Direction.DOWN, map_design)) {
    pacman.moving_to = Direction.DOWN;
  }
  if (keys["ArrowLeft"] && pacman.could_move(Direction.LEFT, map_design)) {
    pacman.moving_to = Direction.LEFT;
  }
  if (keys["ArrowRight"] && pacman.could_move(Direction.RIGHT, map_design)) {
    pacman.moving_to = Direction.RIGHT;
  }
}


function drawCircle(canvasContext, x, y, shapeHeight) {
  const halfShapeHeight = shapeHeight / 2;
  canvasContext.beginPath();
  canvasContext.arc(x, y, halfShapeHeight, 0, 2 * Math.PI);
  canvasContext.stroke();
}

let renderCount = 0;
function render() {
  renderCount++;
  let moveHandler = true;
  const pacmanBFS = pacman.move_pacman(map_design, enemies);
  const routeBFSArrays = [redRouteBFS, violetRouteBFS, orangeRouteBFS, yellowRouteBFS]
  enemies.map((enemy , i) => {
    moveHandler =renderCount%2 ==0

    switch (state) {
      case States.scatter:
        if (enemy.isAGhost) {

          enemy.moveToOpositeDirection()
          enemy.moveAsGhost( pacmanBFS,  moveHandler)
        }
        else
        enemy.moveEnemy( map_design, routeBFSArrays[i])
      break;
      case States.chase:
        if (enemy.isAGhost) {
          enemy.moveToOpositeDirection()
          enemy.moveAsGhost( pacmanBFS,  moveHandler)
        }
          else  
        enemy.moveByBFS(pacmanBFS ) ;
        break;
      
    } 
  })
  
  
/*   enemies[1].moveToPacman(pacmanBFS);
  enemies[2].moveToPacman(pacmanBFS);
  enemies[3].moveToPacman(pacmanBFS); */
  // Limpia el canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(img, x, x, width - 20, height - 25);
  for (let i = 1; i <= heightBlocks; i++) {
    for (let j = 1; j <= widthBlocks; j++) {
      if (map_design[i][j] & 2) {
        ctx.fillStyle = "yellow";
        drawCircle(ctx, j * x + 10, i * x + 10, 5);
        ctx.fill();
      }
    }
  }
  
  for (let i = 1; i <= heightBlocks; i++) {
    for (let j = 1; j <= widthBlocks; j++) {
      if (map_design[i][j] & 4) {
        drawCircle(ctx, j * x + 10,i * x + 10, 18);
        ctx.fill()
        
      }
    }
  }

  // ctx.drawImage(img, x, x, width - 20, height - 25);
  // Painting Pacman
  ctx.fillStyle = "yellow";
  ctx.fillRect(pacman.x * x, pacman.y * x, pacman.size, pacman.size);

  // Painting Enemies

  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];

    ctx.fillStyle = enemy.color;
    ctx.fillRect(enemy.x * x, enemy.y * x, enemy.size, enemy.size);
  }
/* 
  for (let i = 1; i <= heightBlocks; i++) {
    for (let j = 1; j <= widthBlocks; j++) {
      if (map_design[i][j] & 1) {
        ctx.fillStyle = "red";
        ctx.fillText(enemy_route[i][j], j * x + 8, i * x + 8);
      }
    }
  } */
  /* for (let i = 1; i <= heightBlocks; i++) {
    for (let j = 1; j <= widthBlocks; j++) {
      if (map_design[i][j] & 1) {
        ctx.fillStyle = "red";
        ctx.fillText(pacman.bfs[i][j], j * x + 8, i * x + 8);
      }
    }
  } */
}

/**
 * Resets Pacman and the enemies to their initial state
 * @return {undefined}
 */
const reset = (nextLevel= false) => {
  pacman.x = 14;
  pacman.y = 18;
  pacman.previousX = 14;
  pacman.previousY = 18;
  pacman.speed = 1;
  pacman.size = 25;
  pacman.moving_to = Direction.NO_MOVE;
  if (!nextLevel) {
    pacman.lifes = 3;
    pacman.coins = 0;
    
  }
  pacman.drawCoinNumber(pacman.coins);
  pacman.drawLifes()
  clearTimeout(pacman.ghostMode);

  enemies =  [ new Enemy("red", 14, 16, map_design, {y:6 , x:22}  , {y:14 , x:16}  ,  1),
  new Enemy("violet", 14, 13, map_design, {y:6 , x:7}, {y:14 , x:13}  ,6),
  new Enemy("orange", 16, 13, map_design,{y:24 , x:10} ,{y:16 , x:13} , 11),
  new Enemy("green", 16, 16, map_design, {y:24 , x:22},{y:16 , x:16}  ,21),
]
fillTheLevel(map_design);
pacman.enemies = enemies;
   
};

function resetEnemies(){
   clearTimeout(pacman.ghostMode);
  enemies =  [ new Enemy("red", 14, 16, map_design, {y:6 , x:22}  , {y:14 , x:16}  ,  1),
    new Enemy("violet", 14, 13, map_design, {y:6 , x:7}, {y:14 , x:13}  ,6),
    new Enemy("orange", 16, 13, map_design,{y:24 , x:10} ,{y:16 , x:13} , 11),
    new Enemy("green", 16, 16, map_design, {y:24 , x:22},{y:16 , x:16}  ,21),
  ] 
  pacman.enemies = enemies;
};


document.addEventListener("keydown", (event) => {  
  if (event.key === " " && pacman.lifes <= 0) {
    const $gameOver = document.querySelector(".game-over");
    $gameOver.style.opacity = "0";
    reset();
  }
});

document.addEventListener("touchend", (event) => {  
  if ( pacman.lifes <= 0) {
    const $gameOver = document.querySelector(".game-over");
    $gameOver.style.opacity = "0";
    reset();
  }
});
gameLoop(0);


