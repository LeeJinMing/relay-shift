# Relay Shift

A browser puzzle made for GitHub Game Off 2026 and its SHIFT theme. You dispatch a cart down a set of conveyor belts. Rotate the active belt to put an opening under the cart, then dispatch. Arrow tiles steer the cart one lane sideways for the next belt. Lanes wrap at the edges.

## Play

- Select one of the three routes. The first route teaches the controls.
- Use **Shift left** and **Shift right**, or the arrow keys, to move the active belt. Each shift costs one move.
- Use **Dispatch** to cross an open tile and advance to the next belt.
- Use **Restart route** to try another sequence. Completing every belt clears the route.

No account, downloads, or network services are required once the webpage has loaded. To play from a local copy, run `python -m http.server 8000` from this directory and open `http://localhost:8000/`. For itch.io, put `index.html`, `style.css`, `game.mjs` and `routes.mjs` at the ZIP root.

Run the rules and level-solvability checks with `node --test routes.test.mjs`.

## AI disclosure

OpenAI Codex assisted with the concept, implementation, level design, and verification. The page uses text and CSS for its visuals and includes no third-party art or audio. There is no AI service at runtime.
