import { fillTheLevel } from "./fillTheLevel.js";

const canvas = document.getElementById("screen");
/** @type {CanvasRenderingContext2D} */
var ctx = canvas.getContext("2d");
let screenBox = new Array(1000);

const x = 25;
const widthBlocks = 29;
const heightBlocks = 32;

const width = widthBlocks * x;
const height = heightBlocks * x;
canvas.setAttribute("width", `${width}`);
canvas.setAttribute("height", `${height}`);

for (let i = 1; i <= heightBlocks; i++) {
  screenBox[i] = new Array(widthBlocks + 1);
  for (let j = 1; j <= widthBlocks; j++) {
    screenBox[i][j] = false;
  }
}
fillTheLevel(screenBox);

for (let i = 1; i <= heightBlocks; i++) {
  for (let j = 1; j <= widthBlocks; j++) {
    if (screenBox[i][j] == false) {
      ctx.fillStyle = "black";
      ctx.fillRect(j * x, i * x, x, x);
    } else {
      ctx.fillStyle = "white";
      ctx.fillRect(j * x, i * x, x, x);
    }
  }
}
