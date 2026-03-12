import { GameState, LINES_PER_LEVEL, NextPiecePreview, TetrisCore } from "./game";

type ActionKey =
  | "move-left"
  | "move-right"
  | "soft-drop"
  | "hard-drop"
  | "rotate-left"
  | "rotate-right"
  | "restart";

const ensureElement = <T extends Element>(selector: string, label: string): T => {
  const el = document.querySelector<T>(selector);
  if (!el) {
    throw new Error(`Missing element: ${label}`);
  }
  return el;
};

const app = ensureElement<HTMLElement>('#app', 'app root');

app.innerHTML = `
<main class="game-shell">
  <section class="stage">
    <article class="board-panel">
      <div class="title-line">
        <div>
          <h1>Prism Tetris</h1>
          <div class="chips">
            <span class="chip">Responsive</span>
            <span class="chip">Realtime</span>
          </div>
        </div>
        <button type="button" class="subtle-btn restart-btn" data-action="restart">Restart</button>
      </div>
      <p class="status-line" data-status>Initializing session…</p>
      <div class="board-wrapper">
        <div class="board-grid" data-board aria-label="Tetris board"></div>
        <div class="status-overlay" data-game-over aria-live="assertive">
          <div>
            <p class="status-overlay__label">Session</p>
            <h2 data-overlay-title>Game Over</h2>
            <p data-overlay-subtext>Press restart or tap R to refresh the stack.</p>
          </div>
        </div>
      </div>
      <div class="hint-line">
        <p>Arrow keys, space, and Z/X keep the shapes flowing. Tap the buttons for direct control.</p>
        <span class="signal">Fluid layout</span>
      </div>
    </article>
    <aside class="side-panel">
      <div class="stats-grid">
        <div class="stat">
          <strong>Score</strong>
          <span data-score>0</span>
        </div>
        <div class="stat">
          <strong>Lines</strong>
          <span data-lines>0</span>
        </div>
        <div class="stat">
          <strong>Level</strong>
          <span data-level>1</span>
        </div>
      </div>
      <div class="next-preview">
        <div class="preview-title-line">
          <p class="preview-title">Next piece</p>
          <span class="preview-tag" data-next-name>—</span>
        </div>
        <div class="preview-grid" data-preview role="presentation"></div>
      </div>
      <div class="controls">
        <button type="button" class="control-btn" data-action="hard-drop">Hard drop</button>
        <button type="button" class="control-btn" data-action="soft-drop">Soft push</button>
        <button type="button" class="subtle-btn" data-action="rotate-left">Rotate Z</button>
        <button type="button" class="subtle-btn" data-action="rotate-right">Rotate X</button>
        <div class="key-map">
          <span><strong>← →</strong> move</span>
          <span><strong>↓</strong> soft drop</span>
          <span><strong>Space</strong> hard drop</span>
          <span><strong>Z / X</strong> rotate</span>
        </div>
      </div>
      <p class="note">Crafted with layered gradients, purposeful typography, and grid-driven layouts so the UI flexes from phones to wide displays.</p>
    </aside>
  </section>
</main>
`;

const boardGrid = ensureElement<HTMLDivElement>('[data-board]', 'board grid');
const previewGrid = ensureElement<HTMLDivElement>('[data-preview]', 'preview grid');
const statusLine = ensureElement<HTMLElement>('[data-status]', 'status line');
const scoreEl = ensureElement<HTMLElement>('[data-score]', 'score value');
const linesEl = ensureElement<HTMLElement>('[data-lines]', 'lines value');
const levelEl = ensureElement<HTMLElement>('[data-level]', 'level value');
const overlay = ensureElement<HTMLElement>('[data-game-over]', 'game over overlay');
const overlayTitle = ensureElement<HTMLElement>('[data-overlay-title]', 'overlay title');
const overlaySubtext = ensureElement<HTMLElement>('[data-overlay-subtext]', 'overlay subtext');
const nextName = ensureElement<HTMLElement>('[data-next-name]', 'next piece label');

const tetris = new TetrisCore();
const cols = tetris.cols;
const rows = tetris.rows;
const totalCells = cols * rows;

const createGridCells = (container: HTMLElement, count: number, className: string) => {
  const cells: HTMLElement[] = [];
  for (let i = 0; i < count; i += 1) {
    const cell = document.createElement("div");
    cell.className = className;
    container.appendChild(cell);
    cells.push(cell);
  }
  return cells;
};

const boardCells = createGridCells(boardGrid, totalCells, "cell");
const previewCells = createGridCells(previewGrid, 16, "preview-cell");

const actionMap: Record<ActionKey, () => void> = {
  "move-left": () => tetris.move(-1, 0),
  "move-right": () => tetris.move(1, 0),
  "soft-drop": () => tetris.softDrop(),
  "hard-drop": () => tetris.hardDrop(),
  "rotate-left": () => tetris.rotate(false),
  "rotate-right": () => tetris.rotate(true),
  restart: () => {
    tetris.restart();
    lastDrop = 0;
  },
};

const performAction = (action: ActionKey) => {
  actionMap[action]?.();
  renderState(tetris.getState());
};

const controlButtons = document.querySelectorAll<HTMLButtonElement>("[data-action]");
controlButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.action as ActionKey | undefined;
    if (!action) {
      return;
    }
    performAction(action);
  });
});

const keyBindings: Record<string, ActionKey> = {
  ArrowLeft: "move-left",
  ArrowRight: "move-right",
  ArrowDown: "soft-drop",
  Space: "hard-drop",
  KeyZ: "rotate-left",
  KeyX: "rotate-right",
  KeyR: "restart",
};

const handleKey = (event: KeyboardEvent) => {
  const action = keyBindings[event.code];
  if (!action) {
    return;
  }
  event.preventDefault();
  performAction(action);
};

window.addEventListener("keydown", handleKey);

const computeDropInterval = (level: number) => Math.max(120, 900 - level * 45);

const getLinesToNextLevel = (lines: number) => LINES_PER_LEVEL - (lines % LINES_PER_LEVEL || 0);

let lastDrop = 0;

const renderPreview = (preview: NextPiecePreview | null) => {
  previewCells.forEach((cell) => {
    cell.classList.remove("filled");
    cell.style.background = "transparent";
  });
  if (!preview) {
    nextName.textContent = "—";
    return;
  }
  nextName.textContent = preview.name;
  preview.blocks.forEach((block) => {
    const index = block.y * 4 + block.x;
    const target = previewCells[index];
    if (target) {
      target.style.background = preview.color;
      target.classList.add("filled");
    }
  });
};

const renderState = (state: GameState) => {
  const activePositions = new Map<string, string>();
  if (state.currentPiece) {
    state.currentPiece.blocks.forEach((block) => {
      activePositions.set(`${block.x},${block.y}`, state.currentPiece!.color);
    });
  }

  boardCells.forEach((cell, index) => {
    const x = index % cols;
    const y = Math.floor(index / cols);
    const key = `${x},${y}`;
    const color = activePositions.get(key) ?? state.board[y][x]?.color;
    if (color) {
      cell.classList.add("filled");
      cell.style.background = color;
      cell.style.boxShadow = `inset 0 0 6px ${color}, inset 0 0 0 1px rgba(255, 255, 255, 0.2)`;
    } else {
      cell.classList.remove("filled");
      cell.style.background = "transparent";
      cell.style.boxShadow = "none";
    }
  });

  scoreEl.textContent = state.score.toLocaleString("en-US");
  linesEl.textContent = state.lines.toString();
  levelEl.textContent = state.level.toString();
  const linesToNextLevel = getLinesToNextLevel(state.lines);

  const statusText = state.gameOver
    ? "Game over · tap restart or press R"
    : `Level ${state.level} · ${state.lines} lines cleared · ${linesToNextLevel} to next speed`;
  statusLine.textContent = statusText;

  overlay.classList.toggle("active", state.gameOver);
  overlayTitle.textContent = state.gameOver ? "Game Over" : "Flowing";
  overlaySubtext.textContent = state.gameOver
    ? "Hit restart or R to rebuild the stack."
    : "Pieces keep shifting as long as you stay tuned.";

  renderPreview(state.nextPiece);
};

const loop = (time: number) => {
  const state = tetris.getState();
  const interval = computeDropInterval(state.level);
  if (time - lastDrop >= interval) {
    tetris.tick();
    lastDrop = time;
  }
  renderState(tetris.getState());
  requestAnimationFrame(loop);
};

renderState(tetris.getState());
requestAnimationFrame(loop);
