// server.js
const express = require("express");
const path = require("path");
const livereload = require("livereload");
const connectLivereload = require("connect-livereload");

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
