# Tetris-app

Minimal scaffolding for the Tetris game repository.

## Overview
An interactive tetris experience implemented with modern web technologies. This repo will house the core game logic, assets, and deployment workflow for the project.

## Getting Started
1. Clone the repository and install any dependencies (e.g., `npm install`).
2. Implement the rendering layer, game loop, and input handling inside `src/`.
3. Run the development server or bundler you choose to verify the game in the browser.

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
- Flesh out the `src/` directory with the renderer, input manager, and tetrimino definitions.
- Wire up a build tool (Vite, webpack, etc.) once the core logic is stable.
