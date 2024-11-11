# Pacman.js

![Pacman game](https://github.com/user-attachments/assets/8f4a1205-3303-412f-8805-8f56077f80bd)

This project is a recreation of Pac-Man developed with JavaScript and Express.js, designed to run on a local server. It uses livereload to facilitate real-time development.

## Project Structure

- **main.js**: Main server file that sets up and runs an Express.js instance to serve the game content. Includes:
  - Configuration of `connect-livereload` middleware for automatic reloading.
  - Routes to serve HTML files and other game resources from the `public` directory.

- **public/entities.js**: File that defines game logic related to enemy movements and route structure.
  - **Direction**: An object defining constants for character movement directions.

- **public/pacman.js**: Main game file containing the gameLoop and other key functions.

## Technologies Used

- **JavaScript**: For game logic.
- **Node.js and Express**: To set up the local server.
- **livereload and connect-livereload**: For automatic page reloading during development.

## Installation and Execution

1. Clone this repository.
2. Install the necessary dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   node main.js
   ```
4. Open your browser at `http://localhost:3000` to view the game.

## Contribution

This is a project in development, so any contribution is welcome. If you find bugs or have improvement ideas, please open an issue or submit a pull request.

## License

This project is distributed under the MIT license.