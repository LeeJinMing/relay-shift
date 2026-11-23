export const LEVELS = [
  { name: "First delivery", start: 2, moves: 4, rows: ["###.##", "####.#", "###.##"] },
  { name: "Reroute", start: 2, moves: 4, rows: ["###r##", "#.####", "####l#", "##.###"] },
  { name: "Night grid", start: 2, moves: 6, rows: ["#r####", "###.#l", "####r#", "l.####", "####.#"] },
];

const wrap = (value, width) => (value + width) % width;

export function begin(level) {
  return { level, grid: [...level.rows], row: 0, lane: level.start, moves: level.moves };
}

export function shift(state, direction) {
  if (state.row === state.grid.length || state.moves === 0) return state;
  if (direction !== -1 && direction !== 1) return state;

  const belt = state.grid[state.row];
  const rotated = Array.from(belt, (_, index) => belt[wrap(index - direction, belt.length)]).join("");
  const grid = [...state.grid];
  grid[state.row] = rotated;
  return { ...state, grid, moves: state.moves - 1 };
}

export function advance(state) {
  const belt = state.grid[state.row];
  if (belt === undefined) return state;
  const cell = belt[state.lane];
  if (cell === "#") return state;
  const direction = cell === "l" ? -1 : cell === "r" ? 1 : 0;
  return { ...state, row: state.row + 1, lane: wrap(state.lane + direction, belt.length) };
}
