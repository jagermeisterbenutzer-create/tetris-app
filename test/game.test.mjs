import test from "node:test";
import assert from "node:assert/strict";

import { TetrisCore } from "../dist/game.js";

const createGame = (randomValue = 0) => {
  const originalRandom = Math.random;
  Math.random = () => randomValue;
  try {
    return new TetrisCore();
  } finally {
    Math.random = originalRandom;
  }
};

const withMockedRandom = (randomValue, action) => {
  const originalRandom = Math.random;
  Math.random = () => randomValue;
  try {
    return action();
  } finally {
    Math.random = originalRandom;
  }
};

const countFilledCells = (board) =>
  board.reduce(
    (total, row) => total + row.reduce((rowTotal, cell) => rowTotal + (cell ? 1 : 0), 0),
    0
  );

const fillRow = (game, y, emptyColumns = []) => {
  for (let x = 0; x < game.cols; x += 1) {
    game.board[y][x] = emptyColumns.includes(x)
      ? null
      : {
          color: "#999999",
          name: "locked",
        };
  }
};

const findDefinition = (game, name) => {
  const definition = [game.current?.definition, ...game.bag].find((piece) => piece?.name === name);
  assert.ok(definition, `Expected to find ${name} tetromino definition`);
  return definition;
};

test("initial state uses deterministic bag order and default stats", () => {
  const game = createGame();
  const state = game.getState();

  assert.equal(state.score, 0);
  assert.equal(state.lines, 0);
  assert.equal(state.level, 1);
  assert.equal(state.gameOver, false);
  assert.equal(state.currentPiece?.name, "J");
  assert.equal(state.nextPiece?.name, "L");
  assert.equal(state.currentPiece?.position.x, 3);
  assert.equal(state.currentPiece?.position.y, -2);
});

test("soft drop advances the active piece and adds one point", () => {
  const game = createGame();
  const startY = game.getState().currentPiece?.position.y;

  const moved = game.softDrop();
  const state = game.getState();

  assert.equal(moved, true);
  assert.equal(state.score, 1);
  assert.equal(state.currentPiece?.position.y, startY + 1);
});

test("hard drop locks the current piece, scores drop points, and spawns the next piece", () => {
  const game = createGame();

  game.hardDrop();
  const state = game.getState();

  assert.equal(state.currentPiece?.name, "L");
  assert.ok(state.score > 0);
  assert.equal(countFilledCells(state.board), 4);
});

test("clearing two lines awards the expected score and removes locked cells", () => {
  const game = createGame();
  const oDefinition = findDefinition(game, "O");

  fillRow(game, game.rows - 1, [4, 5]);
  fillRow(game, game.rows - 2, [4, 5]);
  game.current = {
    definition: oDefinition,
    rotationIndex: 0,
    position: { x: 3, y: game.rows - 2 },
  };

  const moved = game.move(0, 1);
  const state = game.getState();

  assert.equal(moved, false);
  assert.equal(state.lines, 2);
  assert.equal(state.level, 1);
  assert.equal(state.score, 300);
  assert.equal(countFilledCells(state.board), 0);
});

test("clearing the tenth line advances the level", () => {
  const game = createGame();
  const oDefinition = findDefinition(game, "O");

  fillRow(game, game.rows - 1, [4, 5]);
  fillRow(game, game.rows - 2, [0, 4, 5]);
  game.lines = 9;
  game.level = 1;
  game.current = {
    definition: oDefinition,
    rotationIndex: 0,
    position: { x: 3, y: game.rows - 2 },
  };

  game.move(0, 1);
  const state = game.getState();

  assert.equal(state.lines, 10);
  assert.equal(state.level, 2);
  assert.equal(state.score, 100);
});

test("getState returns defensive copies of board and piece data", () => {
  const game = createGame();
  const snapshot = game.getState();

  snapshot.board[0][0] = { color: "#ffffff", name: "mutated" };
  assert.ok(snapshot.currentPiece);
  assert.ok(snapshot.nextPiece);
  snapshot.currentPiece.position.x = 99;
  snapshot.currentPiece.blocks[0].x = 99;
  snapshot.nextPiece.blocks[0].x = 99;

  const nextSnapshot = game.getState();

  assert.equal(nextSnapshot.board[0][0], null);
  assert.equal(nextSnapshot.currentPiece?.position.x, 3);
  assert.notEqual(nextSnapshot.currentPiece?.blocks[0].x, 99);
  assert.notEqual(nextSnapshot.nextPiece?.blocks[0].x, 99);
});

test("restart clears progress and removes locked cells", () => {
  const game = createGame();

  game.hardDrop();
  assert.ok(countFilledCells(game.getState().board) > 0);

  withMockedRandom(0, () => game.restart());
  const state = game.getState();

  assert.equal(state.score, 0);
  assert.equal(state.lines, 0);
  assert.equal(state.level, 1);
  assert.equal(state.gameOver, false);
  assert.equal(state.currentPiece?.name, "J");
  assert.equal(countFilledCells(state.board), 0);
});
