
# Pacman.js

![Pacman game](https://github.com/user-attachments/assets/8f4a1205-3303-412f-8805-8f56077f80bd)
Este proyecto es una recreacion de Pac-Man desarrollada con JavaScript y Express.js, diseñado para ejecutarse en un servidor local. Utiliza livereload para facilitar el desarrollo en tiempo real.

## Estructura del Proyecto

- **main.js**: Archivo principal del servidor que configura y ejecuta una instancia de Express.js para servir el contenido del juego. Incluye:
  - Configuración del middleware `connect-livereload` para recargar automáticamente.
  - Rutas para servir archivos HTML y otros recursos del juego desde el directorio `public`.

- **public/entities.js**: Archivo donde se define la lógica del juego relacionada con los movimientos de los enemigos y la estructura de las rutas.
  - **Direction**: Un objeto que define constantes para las direcciones de movimiento de los personajes.

- **public/pacman.js**: Archivo principal del juego donde se encuentra el gameLoop y otras funciones importantes.


## Tecnologías Utilizadas

- **JavaScript**: Para la lógica del juego.
- **Node.js y Express**: Para configurar el servidor local.
- **livereload y connect-livereload**: Para recargar automáticamente la página durante el desarrollo.

## Instalación y Ejecución

1. Clona este repositorio.
2. Instala las dependencias necesarias:
   ```bash
   npm install
   ```
3. Inicia el servidor:
   ```bash
   node main.js
   ```
4. Abre el navegador en `http://localhost:3000` para ver el juego.

## Contribución

Este es un proyecto en desarrollo, por lo que cualquier contribución es bienvenida. Si encuentras errores o tienes ideas de mejora, abre un issue o envía un pull request.

## Licencia

Este proyecto se distribuye bajo la licencia MIT.
