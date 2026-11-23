import assert from "node:assert/strict";
import test from "node:test";
import { LEVELS, begin, shift, advance } from "./routes.mjs";

function solve(start) {
  const pending = [start];
  const known = new Set();
  for (const state of pending) {
    const key = JSON.stringify([state.grid, state.row, state.lane, state.moves]);
    if (known.has(key)) continue;
    known.add(key);
    if (state.row === state.grid.length) return state;
    const neighbors = [shift(state, -1), shift(state, 1), advance(state)];
    pending.push(...neighbors.filter((neighbor) => neighbor !== state));
  }
  return null;
}

test("walls block progress and shifts only change the active belt", () => {
  const start = begin(LEVELS[0]);
  assert.equal(advance(start), start);
  const shifted = shift(start, -1);
  assert.equal(start.grid[0], "###.##");
  assert.equal(shifted.grid[0], "##.###");
  assert.equal(shifted.grid[1], start.grid[1]);
  assert.equal(advance(shifted).row, 1);
  assert.equal(shift({ ...start, moves: 0 }, 1).moves, 0);
});

test("diverters steer the cart and wrap at the edge", () => {
  const start = begin({ ...LEVELS[0], rows: ["l....."], start: 0 });
  const finished = advance(start);
  assert.equal(finished.row, 1);
  assert.equal(finished.lane, 5);
  assert.equal(advance(finished), finished);
});

for (const level of LEVELS) {
  test(level.name + " requires a shift and can be completed inside the limit", () => {
    assert.equal(solve(begin({ ...level, moves: 0 })), null);
    assert.ok(solve(begin(level)));
  });
}
