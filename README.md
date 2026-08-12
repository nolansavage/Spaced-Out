# SPACED OUT

A browser-based pixel-art sci-fi survival RPG about restoring a damaged generation ship.

## Version 0.8: Humanity's Last Hope

Open `index.html` through a static web server. Create a survivor, choose a profession, and explore with WASD. Press `E` near Aria, Milo, or Nova to talk and build friendship. Press `E` at the Navigation Console to choose a planet and launch an expedition. On a planet, interact with resource nodes, discoveries, and the blue return beacon using `E`. Press `Tab` for inventory and `Escape` to pause.

The project uses native HTML, CSS, and JavaScript modules with no build step. The Canvas always renders at `320x180`; JavaScript applies an integer `1x`, `2x`, or `3x` display scale for crisp pixels.

## Structure

- `js/game.js`: small coordinator for screen state, update, and render flow.
- `js/world.js`: rooms, collision objects, placeholder entities, and interaction metadata.
- `js/time.js`, `js/stats.js`, `js/items.js`, `js/inventory.js`, and `js/farming.js`: first-day time, survival stats, item, inventory, and Glowberry farming systems.
- `js/ship.js`, `js/ai.js`, and `js/logs.js`: data-driven ship restoration, AI memory, and non-spoiling crew log foundations.
- `js/npcs.js`, `js/dialogue.js`, `js/relationships.js`, `js/events.js`, and `js/quests.js`: initial crew, conversations, friendship, personal events, and character quest foundations.
- `js/save.js`: validated, versioned save envelope for player and Version 0.2 session state.
- `js/display.js`: integer Canvas scaling.
- `js/player.js`, `js/camera.js`, and `js/ui.js`: player behavior, camera behavior, and DOM interface.

## Render Deployment

Deploy this repository as a Render Static Site. Set the publish directory to `.` and leave the build command empty. Render will serve `index.html` and the relative ES-module paths directly.
