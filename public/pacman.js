import { Direction, pacman, Enemy, BFS, drawLifes } from "./entities.js";
import { fillTheLevel } from "./fillTheLevel.js";

const canvas = document.getElementById("screen");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");

const States = {
  chase: 1,
  scatter: 2,
  frightened: 3
}

const x = 25;
const keys = {};
const animations = {};
const animationsImgs = {};
const changeStateInterval = 10;
const widthBlocks = 29;
const heightBlocks = 32;
const renderInterval = 0.2;
const width = widthBlocks * x;
const height = heightBlocks * x;
const imgMap = new Image(); // Create a new image object
imgMap.src = "./assets/map.webp";

let state = States.chase;
let map_design = new Array(heightBlocks);
let pacmanRenderTime = 0
let enemyRenderTime = 0
let renderCount = 0;
let enemies = [];
let violetRouteBFS = null
let redRouteBFS = null
let orangeRouteBFS = null
let yellowRouteBFS = null
let frame = 0;
let accumulatedTime = 0;
let accumulatedTime10 = 0;
let lastTime = 0;
let deltaTime = 0;
let isLoading = true;
// Variables para detectar el inicio y final del toque
let startX, startY;

/**
 * Advances the game to the next level.
 * 
 * This function resets the game state, preparing it for the next level.
 * It may involve resetting positions, scores, or other game elements.
 */



function fillMapDesignWithZero() {
  for (let i = 1; i <= heightBlocks; i++) {
    map_design[i] = new Array(widthBlocks + 1);
    for (let j = 1; j <= widthBlocks; j++) {
      map_design[i][j] = 0;
    }
  }
}

function gameLoop(currentTime) {

  frame++;
  deltaTime = (currentTime - lastTime) / 1000;
  lastTime = currentTime;
  accumulatedTime += deltaTime;
  accumulatedTime10 += deltaTime;
  // Check if 0.3 seconds have passed

  if (accumulatedTime >= renderInterval) {
    const pacmanBFS = pacman.move_pacman(map_design, enemies);
    render(pacmanBFS);
    accumulatedTime = 0; // Reset the accumulated time
  }
  renderPacman();
  renderEnemies();
  if (accumulatedTime10 >= changeStateInterval) {
    console.log("change status");

    if (state == States.chase) {
      state = States.scatter
      enemies[0].hasReached = false
      enemies[1].hasReached = false
      enemies[2].hasReached = false
      enemies[3].hasReached = false
    } else if (state == States.scatter) {
      state = States.chase
    }
    accumulatedTime10 = 0;
  }

  update();

  requestAnimationFrame(gameLoop);
  // Llama a gameLoop en el siguiente fotograma
}

/**
 * Actualiza el estado del juego cada frame
 * 
 * Verifica las teclas pulsadas por el usuario y actualiza la dirección del jugador
 * en consecuencia. Si el jugador puede moverse en esa dirección, se actualiza su
 * propiedad moving_to
 */
function update() {
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


/**
 * Draws a circle on the canvas
 * @param {CanvasRenderingContext2D} canvasContext - The context of the canvas element
 * @param {number} x - The x position of the center of the circle
 * @param {number} y - The y position of the center of the circle
 * @param {number} shapeHeight - The height of the shape
 */
function drawCircle(canvasContext, x, y, shapeHeight) {
  const halfShapeHeight = shapeHeight / 2;
  canvasContext.beginPath();
  canvasContext.arc(x, y, halfShapeHeight, 0, 2 * Math.PI);
  canvasContext.stroke();
}
/**
 * Actualiza y dibuja el estado actual del juego en el canvas
 * 
 * Primero llama a move_pacman para que el jugador se mueva según su estado actual
 * Luego itera sobre los enemigos y los hace mover según su estado actual
 * Finalmente dibuja el mapa, las monedas y el jugador en el canvas
 * 
 * @param {number} renderCount - Un contador que se incrementa en cada llamada a render
 */
function render(pacmanBFS) {
  renderCount++;
  let moveHandler = true;
  const routeBFSArrays = [redRouteBFS, violetRouteBFS, orangeRouteBFS, yellowRouteBFS]
  enemies.map((enemy, i) => {
    moveHandler = renderCount % 2 == 0

    switch (state) {
      case States.scatter:
        if (enemy.isAGhost) {

          enemy.moveToOpositeDirection()
          enemy.moveAsGhost(pacmanBFS, moveHandler)
        }
        else
          enemy.moveEnemy(map_design, routeBFSArrays[i])
        break;
      case States.chase:
        if (enemy.isAGhost) {
          enemy.moveToOpositeDirection()
          enemy.moveAsGhost(pacmanBFS, moveHandler)
        }
        else
          enemy.moveByBFS(pacmanBFS);
        break;

    }
  })


  // Clean canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw map
  ctx.drawImage(imgMap, x, x, width - 20, height - 25);

  // Draw coins
  for (let i = 1; i <= heightBlocks; i++) {
    for (let j = 1; j <= widthBlocks; j++) {
      if (map_design[i][j] & 2) {
        ctx.fillStyle = "yellow";
        drawCircle(ctx, j * x + 10, i * x + 10, 5);
        ctx.fill();
      }
    }
  }
  // Draw special coin
  for (let i = 1; i <= heightBlocks; i++) {
    for (let j = 1; j <= widthBlocks; j++) {
      if (map_design[i][j] & 4) {
        drawCircle(ctx, j * x + 10, i * x + 10, 18);
        ctx.fill()

      }
    }
  }

}
/**
 * Paints Pacman on the canvas. The image is drawn at Pacman's x and y
 * coordinates, with a size of pacman.size.
 * The drawing occurs at specific time intervals determined by
 * pacmanRenderTime. For each render cycle, the current animation frame
 * is drawn, and the frame is advanced for the next render cycle.
 * @param {number} deltaTime - The time passed since the last frame was
 *   rendered, in milliseconds.
 */
function renderPacman() {
  pacmanRenderTime += deltaTime;

  if (pacmanRenderTime >= 0.2) {
    ctx.drawImage(animationsImgs[pacman.currentAnimation + '/' + animations[pacman.currentAnimation][pacman.currentFrame]], pacman.x * x - 5, pacman.y * x - 3, pacman.size, pacman.size);
    pacmanRenderTime = 0;
    pacman.nextFrame();
  }
  // Painting Pacman


}
/**
 * Renders all enemy characters on the canvas.
 * Ensures that animations are loaded before rendering.
 * If animations are not yet loaded, assigns them to each enemy and skips rendering.
 * Updates the enemyRenderTime and, if the elapsed time since the last render
 * exceeds the defined interval, iterates over each enemy to draw them on the canvas.
 * Advances the animation frame for each enemy after drawing.
 */
function renderEnemies() {

  if (!enemies[0].animations == null) {
    enemies[0].animations = animations
    enemies[1].animations = animations
    enemies[2].animations = animations
    enemies[3].animations = animations
    return; // Skip rendering if animations are not loaded yet
  }
  enemyRenderTime += deltaTime;

  if (enemyRenderTime >= 0.2) {

    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];


      ctx.drawImage(animationsImgs[enemy.currentAnimation + '/' + animations[enemy.currentAnimation][enemy.currentFrame]], enemy.x * x - 5, enemy.y * x - 3, enemy.size, enemy.size);
      enemyRenderTime = 0;
      enemy.nextFrame();

    }
  }


}

/**
 * Resets Pacman and the enemies to their initial state
 * @return {undefined}
 */
function reset(nextLevel = false) {
  pacman.x = 14;
  pacman.y = 18;
  pacman.previousX = 14;
  pacman.previousY = 18;
  pacman.speed = 1;
  pacman.size = 30;
  pacman.moving_to = Direction.NO_MOVE;
  if (!nextLevel) {
    pacman.lifes = 3;
    pacman.coins = 0;

  }
  pacman.drawCoinNumber(pacman.coins);
  pacman.drawLifes()
  clearTimeout(pacman.ghostMode);

  enemies = [new Enemy("red", 14, 16, map_design, { y: 6, x: 22 }, { y: 14, x: 16 }, 1, animations),
  new Enemy("blue", 14, 13, map_design, { y: 6, x: 7 }, { y: 14, x: 13 }, 6, animations),
  new Enemy("orange", 16, 13, map_design, { y: 24, x: 10 }, { y: 16, x: 13 }, 11, animations),
  new Enemy("pink", 16, 16, map_design, { y: 24, x: 22 }, { y: 16, x: 16 }, 21, animations),
  ]
  fillTheLevel(map_design);
  pacman.enemies = enemies;

};

/**
 * Resets the enemies to their initial positions and states.
 * Clears any active ghost mode timeout for Pacman.
 * Initializes a new set of Enemy instances with predefined attributes
 * and assigns them to the pacman.enemies array.
 */
function resetEnemies() {
  clearTimeout(pacman.ghostMode);
  enemies = [new Enemy("red", 14, 16, map_design, { y: 6, x: 22 }, { y: 14, x: 16 }, 1, animations),
  new Enemy("blue", 14, 13, map_design, { y: 6, x: 7 }, { y: 14, x: 13 }, 6, animations),
  new Enemy("orange", 16, 13, map_design, { y: 24, x: 10 }, { y: 16, x: 13 }, 11, animations),
  new Enemy("pink", 16, 16, map_design, { y: 24, x: 22 }, { y: 16, x: 16 }, 21, animations),
  ]
  pacman.enemies = enemies;
};

/**
 * Loads all the animations for the game entities (Pac-Man and the ghosts).
 * It uses the loadAnimation function to load the animations and stores them
 * in the animations object.
 * When all the animations have been loaded, it assigns the animations object
 * to the pacman.animations and enemies[i].animations properties and sets isLoading to false.
 * @async
 */
async function loadAnimations() {
  const entities = ["pacman", "red-enemy", "blue-enemy", "orange-enemy", "pink-enemy"]

  for await (const entity of entities) {
    await loadAnimation(`./assets/${entity}/moving-up`)
    await loadAnimation(`./assets/${entity}/moving-down`)
    await loadAnimation(`./assets/${entity}/moving-left`)
    await loadAnimation(`./assets/${entity}/moving-right`)
  }

  pacman.animations = animations
  enemies[0].animations = animations
  enemies[1].animations = animations
  enemies[2].animations = animations
  enemies[3].animations = animations

  isLoading = false
}
/**
 * Loads an animation from a given URL and stores it in the
 * animations object with the animation frames.
 *
 * @param {string} url - The URL of the animation to load, without the
 *   '/animation.json' suffix.
 *
 * @return {Promise<void>} A promise that resolves when all the images for
 *   the animation have been loaded.
 */
async function loadAnimation(url) {
  try {
    const response = await fetch(url + '/animation.json');

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    animations[url] = data.frames;

    // Crear promesas para cargar todas las imágenes
    const imagePromises = data.frames.map((frame) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url + '/' + frame;

        img.onload = () => {
          animationsImgs[url + '/' + frame] = img;
          resolve();  // Resolvemos la promesa cuando la imagen se carga
        };

        img.onerror = reject;  // En caso de error en la carga de la imagen
      });
    });

    // Esperar que todas las imágenes se hayan cargado
    await Promise.all(imagePromises);

  } catch (error) {
    console.error('Hubo un problema con la solicitud Fetch:', error);
  }
}

/**
 * Initializes the game by setting up a periodic check to ensure all animations are loaded
 * before starting the game loop. The function repeatedly checks the `isLoading` flag and the
 * `animations` object to confirm that all necessary assets have been loaded. Once confirmed,
 * it starts the game loop and clears the interval to stop further checks.
 */
function initGame() {


  console.log("Pacman Vanilla JS DEMO, developed by github.com/freddysae0. freddyjs.es");
  canvasConfig()
  fillMapDesignWithZero()
  loadAnimations();
  fillTheLevel(map_design);
  drawLifes(3)

  violetRouteBFS = BFS(map_design, [6, 7])
  redRouteBFS = BFS(map_design, [6, 22])
  orangeRouteBFS = BFS(map_design, [24, 10])
  yellowRouteBFS = BFS(map_design, [24, 22])

  enemies = [new Enemy("red", 14, 16, map_design, { y: 6, x: 22 }, { y: 14, x: 16 }, 1, animations),
  new Enemy("violet", 14, 13, map_design, { y: 6, x: 7 }, { y: 14, x: 13 }, 6, animations),
  new Enemy("orange", 16, 13, map_design, { y: 24, x: 10 }, { y: 16, x: 13 }, 11, animations),
  new Enemy("green", 16, 16, map_design, { y: 24, x: 22 }, { y: 16, x: 16 }, 21, animations),
  ]

  pacman.nextLevel = () => {
    reset(true)
  }
  pacman.enemies = enemies;
  pacman.resetEnemies = resetEnemies;

  const awaitLoadingInterval = setInterval(() => {
    if (!isLoading) {
      // Ensure `animations` is fully loaded before starting the game loop

      if (animations && Object.keys(animations).length > 0) {
        gameLoop(0);
        clearInterval(awaitLoadingInterval);
      }

    }

  }, 200);

}

function canvasConfig() {
  canvas.setAttribute("width", `${width}`);
  canvas.setAttribute("height", `${height}`);
}


// Eventos inicio -------------------------------------------------------------------------------



document.addEventListener("keydown", (event) => {
  if (event.key === " " && pacman.lifes <= 0) {
    const $gameOver = document.querySelector(".game-over");
    $gameOver.style.opacity = "0";
    reset();
  }
});

document.addEventListener("touchend", (event) => {
  if (pacman.lifes <= 0) {
    const $gameOver = document.querySelector(".game-over");
    $gameOver.style.opacity = "0";
    reset();
  }
});

// Eventos para detectar cuando una tecla se presiona
window.addEventListener("keydown", (e) => {
  keys[e.key] = true; // Marca la tecla como presionada
});

// Evento para detectar cuando una tecla se libera
window.addEventListener("keyup", (e) => {
  keys[e.key] = false; // Marca la tecla como liberada
});


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

// Eventos final -------------------------------------------------------------------------------

initGame()