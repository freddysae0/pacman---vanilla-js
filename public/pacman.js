import { Direction, pacman } from "./entities.js";
import { fillTheLevel } from "./fillTheLevel.js";

console.log("pacman:", pacman);
const canvas = document.getElementById("screen");
/** @type {CanvasRenderingContext2D} */
var ctx = canvas.getContext("2d");
let map_design = new Array(1000);

export const x = 25;
const widthBlocks = 29;
const heightBlocks = 32;

const width = widthBlocks * x;
const height = heightBlocks * x;
canvas.setAttribute("width", `${width}`);
canvas.setAttribute("height", `${height}`);

for (let i = 1; i <= heightBlocks; i++) {
  map_design[i] = new Array(widthBlocks + 1);
  for (let j = 1; j <= widthBlocks; j++) {
    map_design[i][j] = false;
  }
}
// Declara el objeto 'keys' para almacenar el estado de las teclas
const keys = {};

// Eventos para detectar cuando una tecla se presiona
window.addEventListener("keydown", (e) => {
  keys[e.key] = true; // Marca la tecla como presionada
});

// Evento para detectar cuando una tecla se libera
window.addEventListener("keyup", (e) => {
  keys[e.key] = false; // Marca la tecla como liberada
});

fillTheLevel(map_design);

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

let frame = 0;
// Bucle principal del juego
function gameLoop() {
  frame++;
  // Actualiza la lógica del juego

  update();
  // Dibuja el estado del juego
  if (frame % 30 == 0) {
    render();
  }

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

// Dibuja el estado del juego en el canvas
function render() {
  pacman.move_pacman(map_design);
  // Limpia el canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(img, x, x, width - 20, height - 25);
  for (let i = 1; i <= heightBlocks; i++) {
    for (let j = 1; j <= widthBlocks; j++) {
      if (map_design[i][j] & 1) {
        ctx.fillStyle = "white";
        ctx.fillRect(j * x, i * x, x, x);
      }
    }
  }
  // ctx.drawImage(img, x, x, width - 20, height - 25);
  console.log("x , y", pacman.x, pacman.y);

  // Dibuja al jugador
  ctx.fillStyle = "blue";
  ctx.fillRect(pacman.x * x, pacman.y * x, pacman.size, pacman.size);
}

gameLoop();
