// server.js
const express = require("express");
const path = require("path");
const livereload = require("livereload");
const connectLivereload = require("connect-livereload");
/* 
const { fillTheLevel } = require("./public/fillTheLevel.js"); // Añadir
const { BFS } = require("./public/entities.js"); // Añadir */
const app = express();
const port = 3000;

// 1. Configurar livereload
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, "public"));

// 2. Usar connect-livereload middleware para inyectar el script de livereload
app.use(connectLivereload());

// Sirve archivos estáticos desde 'public'
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});
/* 
app.get("/test", (req, res) => {
  const x = 25;
  const widthBlocks = 29;
  const heightBlocks = 32;
  let map_design = new Array(heightBlocks);

  for (let i = 1; i <= heightBlocks; i++) {
    map_design[i] = new Array(widthBlocks + 1);
    for (let j = 1; j <= widthBlocks; j++) {
      map_design[i][j] = 0;
    }
  }

  const level = fillTheLevel(map_design);
  const bfsArray = BFS(level, [2, 2]);

  res.send(bfsArray);
});
 */
// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server running en http://localhost:${port}`);
});

// 3. Notificar livereload cuando haya cambios en los archivos
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 500);
});
