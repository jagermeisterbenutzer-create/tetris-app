# Tetris-app

Minimal scaffolding for the Tetris game repository.

## Overview
An interactive Tetris experience implemented with modern web technologies. This repo houses the core game logic, assets, and deployment workflow for the project.

## Getting Started
1. Clone the repository and install dependencies via `npm install`.
2. Run `npm run build` to compile the TypeScript entrypoint into `dist/index.js` and open `public/index.html` in a browser (serve with any static file server).
3. Use `npm start` to run the source via `ts-node` when iterating locally; the UI will automatically render into `public/index.html` once you refresh.

## Initial Structure
- `src/`: game entrypoint, logic, and components.
- `public/`: (future) static assets such as fonts, sprites, and manifest files.
- `docs/`: (future) design notes, gameplay rules, and user stories.
- `.gitignore`: keeps build artifacts and local files out of source control.

## Contributing
1. Open an issue to describe your change or bug fix.
2. Create a feature branch off of `main` and target it with a pull request.
3. Keep the game loop, state management, and rendering decoupled for easier testing.

## Next Steps
- Review UI responsiveness across screens and adjust variables if needed.
- Connect input handling to touch or gamepad layers if additional control surfaces are required.
