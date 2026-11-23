import { LEVELS, begin, shift, advance } from "./routes.mjs";

const byId = (id) => document.getElementById(id);
const routeMenu = byId("routes");
const board = byId("board");
const laneHeaders = byId("lanes");
const status = byId("status");
const left = byId("left");
const right = byId("right");
const dispatch = byId("advance");
const next = byId("next");
const routeName = byId("route-name");
const moves = byId("moves");
const symbols = { "#": "×", ".": "·", l: "←", r: "→" };
const descriptions = { "#": "wall", ".": "open lane", l: "left diverter", r: "right diverter" };

let index = 0;
let state = begin(LEVELS[index]);
const routeButtons = LEVELS.map((level, levelIndex) => {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = String(levelIndex + 1);
  button.setAttribute("aria-label", level.name);
  button.addEventListener("click", () => startRoute(levelIndex));
  routeMenu.append(button);
  return button;
});

function element(text, className) {
  const node = document.createElement("span");
  node.className = className;
  node.textContent = text;
  return node;
}

function render(message) {
  const finished = state.row === state.grid.length;
  routeName.textContent = state.level.name;
  moves.textContent = String(state.moves);
  routeButtons.forEach((button, levelIndex) => {
    button.setAttribute("aria-pressed", String(levelIndex === index));
  });

  laneHeaders.replaceChildren(...Array.from(state.grid[0], (_, lane) =>
    element(String(lane + 1), lane === state.lane ? "current-lane" : "")));

  board.replaceChildren(...state.grid.map((belt, row) => {
    const active = row === state.row;
    const line = document.createElement("div");
    line.className = "belt" + (active ? " active" : row < state.row ? " used" : "");
    line.setAttribute("role", "group");
    line.setAttribute("aria-label", "Belt " + (row + 1) + (active ? ", active" : ""));
    for (let lane = 0; lane < belt.length; lane += 1) {
      const tile = belt[lane];
      const focused = active && lane === state.lane;
      const cell = element(symbols[tile], "cell" + (tile === "#" ? " wall" : "") + (focused ? " focus" : ""));
      cell.setAttribute("role", "img");
      cell.setAttribute("aria-label", "Lane " + (lane + 1) + ": " + descriptions[tile] + (focused ? ", cart" : ""));
      line.append(cell);
    }
    return line;
  }));

  left.disabled = right.disabled = finished || state.moves === 0;
  dispatch.hidden = finished && index < LEVELS.length - 1;
  dispatch.disabled = finished;
  next.hidden = !dispatch.hidden;
  status.textContent = message ?? ("Cart in lane " + (state.lane + 1) + " · Belt " + (state.row + 1));
}

function startRoute(levelIndex) {
  index = levelIndex;
  state = begin(LEVELS[index]);
  render();
}
function rotate(direction) {
  const changed = shift(state, direction);
  if (changed === state) return;
  state = changed;
  render();
}
function deliver() {
  const changed = advance(state);
  if (changed === state) {
    if (state.row === state.grid.length) return;
    render(state.moves ? "Lane blocked. Shift this belt to clear a path." : "Lane blocked and no shifts left. Restart the route.");
    return;
  }
  state = changed;
  if (state.row === state.grid.length) {
    render("Delivery complete. " + state.moves + (state.moves === 1 ? " shift left." : " shifts left."));
    return;
  }
  render();
}

left.addEventListener("click", () => rotate(-1));
right.addEventListener("click", () => rotate(1));
dispatch.addEventListener("click", deliver);
next.addEventListener("click", () => startRoute(index + 1));
byId("restart").addEventListener("click", () => startRoute(index));
window.addEventListener("keydown", (event) => {
  if (event.ctrlKey || event.altKey || event.metaKey || event.repeat) return;
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    event.preventDefault();
    rotate(event.key === "ArrowLeft" ? -1 : 1);
  } else if (event.key === "Enter" && event.target === document.body && !dispatch.disabled) {
    event.preventDefault();
    deliver();
  }
});
render();
