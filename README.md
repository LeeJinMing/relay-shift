# Relay Shift

Rotate a conveyor until a gate lines up under your parcel cart. Dispatch through three freight routes from the morning depot to the night terminal. Every shift spends one move. Dispatching is free. Side gates steer the cart one lane on the next belt, and lanes wrap around the edges.

## Play

Use the shift buttons or the left and right arrow keys. Press Enter on the desk to dispatch. On a touch screen, swipe across the active belt to rotate it, or tap the tile under the cart to dispatch. Restart the current route with R. Route tabs keep each run in memory until you restart it or reload the page. The Sound button toggles mechanical cues. Visual indicators and text communicate every game state, including a blocked gate and an exhausted budget.

## Run locally

Serve this directory with `python -m http.server 8000 --bind 127.0.0.1` and open `http://127.0.0.1:8000/`. The game uses native JavaScript modules. All resources ship locally. Run `node --test routes.test.mjs` for the rules and solvability checks.

For HTML5 hosting, package `index.html` at the ZIP root alongside `style.css`, `game.mjs`, `routes.mjs`, `sound.mjs`, `assets/`, `licenses/` and `CREDITS.md`. Serve JavaScript modules with a JavaScript MIME type. The game accepts keyboard, pointer and touch input inside an iframe.

## Art, audio and AI disclosure

OpenAI Codex assisted with the concept, puzzle design, implementation, in-game and page text, procedural sound design and testing. OpenAI ImageGen generated the industrial route artwork and the parcel-cart sprite. The three route illustrations were cropped from one image generated for this project; the second generation used that sheet as its visual reference. The sound effects are synthesized in the browser from AI-assisted oscillator and envelope code. There is no prerecorded or model-generated audio track, music, voice, or runtime AI service.

[Asset credits and license sources](CREDITS.md) · [Generation prompts](art-source/generation.json) · [Image dimensions, crops and checksums](art-source/image-manifest.json)

