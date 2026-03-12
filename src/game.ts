export type Position = { x: number; y: number };

export type Cell = {
  color: string;
  name: string;
};

export type TetrominoDefinition = {
  name: string;
  color: string;
  rotations: Position[][];
};

const makeRotation = (...coords: Position[]): Position[] => coords;

const TETROMINO_DEFINITIONS: TetrominoDefinition[] = [
  {
    name: "I",
    color: "#00e0ff",
    rotations: [
      makeRotation({ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }),
      makeRotation({ x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 2, y: 3 }),
      makeRotation({ x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }),
      makeRotation({ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 1, y: 3 }),
    ],
  },
  {
    name: "J",
    color: "#0000f0",
    rotations: [
      makeRotation({ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }),
      makeRotation({ x: 1, y: 0 }, { x: 2, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }),
      makeRotation({ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 2, y: 2 }),
      makeRotation({ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 0, y: 2 }),
    ],
  },
  {
    name: "L",
    color: "#f0a000",
    rotations: [
      makeRotation({ x: 2, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }),
      makeRotation({ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 2 }),
      makeRotation({ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 0, y: 2 }),
      makeRotation({ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }),
    ],
  },
  {
    name: "O",
    color: "#f0f000",
    rotations: [
      makeRotation({ x: 1, y: 0 }, { x: 2, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }),
      makeRotation({ x: 1, y: 0 }, { x: 2, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }),
      makeRotation({ x: 1, y: 0 }, { x: 2, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }),
      makeRotation({ x: 1, y: 0 }, { x: 2, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }),
    ],
  },
  {
    name: "S",
    color: "#00f000",
    rotations: [
      makeRotation({ x: 1, y: 0 }, { x: 2, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }),
      makeRotation({ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 2, y: 2 }),
      makeRotation({ x: 1, y: 1 }, { x: 2, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 2 }),
      makeRotation({ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 2 }),
    ],
  },
  {
    name: "T",
    color: "#a000f0",
    rotations: [
      makeRotation({ x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }),
      makeRotation({ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 2 }),
      makeRotation({ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 2 }),
      makeRotation({ x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 2 }),
    ],
  },
  {
    name: "Z",
    color: "#f00000",
    rotations: [
      makeRotation({ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }),
      makeRotation({ x: 2, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 2 }),
      makeRotation({ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 2 }),
      makeRotation({ x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 0, y: 2 }),
    ],
  },
];

type CurrentPiece = {
  definition: TetrominoDefinition;
  rotationIndex: number;
  position: Position;
};

export type NextPiecePreview = {
  name: string;
  color: string;
  blocks: Position[];
};

export type GameState = {
  board: (Cell | null)[][];
  currentPiece: {
    name: string;
    color: string;
    rotationIndex: number;
    position: Position;
    blocks: Position[];
  } | null;
  nextPiece: NextPiecePreview | null;
  score: number;
  lines: number;
  level: number;
  gameOver: boolean;
};

export class TetrisCore {
  private board: (Cell | null)[][];
  private bag: TetrominoDefinition[] = [];
  private current: CurrentPiece | null = null;
  private _gameOver = false;
  public score = 0;
  public lines = 0;
  public level = 1;

  constructor(public readonly rows = 20, public readonly cols = 10) {
    this.board = this.createEmptyBoard();
    this.refillBag();
    this.spawnPiece();
  }

  public restart() {
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.lines = 0;
    this.level = 1;
    this._gameOver = false;
    this.current = null;
    this.bag = [];
    this.refillBag();
    this.spawnPiece();
  }

  private createEmptyBoard(): (Cell | null)[][] {
    return Array.from({ length: this.rows }, () => Array(this.cols).fill(null));
  }

  private refillBag() {
    if (this.bag.length === 0) {
      this.bag = [...TETROMINO_DEFINITIONS];
      for (let i = this.bag.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.bag[i], this.bag[j]] = [this.bag[j], this.bag[i]];
      }
    }
  }

  private spawnPiece() {
    if (this._gameOver) {
      return;
    }
    this.refillBag();
    const definition = this.bag.shift();
    if (!definition) {
      throw new Error("Failed to spawn tetromino");
    }
    const position = { x: Math.floor(this.cols / 2) - 2, y: -2 };
    this.current = {
      definition,
      rotationIndex: 0,
      position,
    };
    if (this.isColliding(this.getBlockPositions())) {
      this._gameOver = true;
      this.current = null;
    }
  }

  private getBlockPositions(
    piece: CurrentPiece = this.current!,
    rotationIndex = piece.rotationIndex,
    position = piece.position
  ): Position[] {
    const rotation = piece.definition.rotations[rotationIndex];
    return rotation.map((block) => ({ x: block.x + position.x, y: block.y + position.y }));
  }

  private peekNextDefinition(): TetrominoDefinition | null {
    if (this.bag.length === 0) {
      this.refillBag();
    }
    return this.bag[0] ?? null;
  }

  private isColliding(blocks: Position[]): boolean {
    return blocks.some((block) => {
      if (block.x < 0 || block.x >= this.cols) {
        return true;
      }
      if (block.y >= this.rows) {
        return true;
      }
      if (block.y < 0) {
        return false;
      }
      return this.board[block.y][block.x] !== null;
    });
  }

  private placeCurrentPiece() {
    if (!this.current) {
      return;
    }
    const positions = this.getBlockPositions();
    positions.forEach((block) => {
      if (block.y < 0) {
        return;
      }
      this.board[block.y][block.x] = {
        color: this.current!.definition.color,
        name: this.current!.definition.name,
      };
    });
    this.clearLines();
    this.spawnPiece();
  }

  private clearLines() {
    const intactRows: (Cell | null)[][] = [];
    let cleared = 0;
    for (let y = 0; y < this.rows; y += 1) {
      const row = this.board[y];
      if (row.every((cell) => cell !== null)) {
        cleared += 1;
      } else {
        intactRows.push(row);
      }
    }
    if (cleared === 0) {
      return;
    }
    const newRows = Array.from({ length: cleared }, () => Array(this.cols).fill(null));
    this.board = [...newRows, ...intactRows];
    this.lines += cleared;
    this.score += cleared * cleared * 100;
    this.level = Math.floor(this.lines / 10) + 1;
  }

  public move(deltaX: number, deltaY: number) {
    if (!this.current || this._gameOver) {
      return false;
    }
    const testPosition = { x: this.current.position.x + deltaX, y: this.current.position.y + deltaY };
    const positions = this.getBlockPositions(this.current, this.current.rotationIndex, testPosition);
    if (this.isColliding(positions)) {
      if (deltaY > 0) {
        this.placeCurrentPiece();
      }
      return false;
    }
    this.current.position = testPosition;
    return true;
  }

  public softDrop() {
    return this.move(0, 1);
  }

  public hardDrop() {
    if (!this.current) {
      return;
    }
    while (this.move(0, 1)) {
      /* empty */
    }
  }

  public rotate(clockwise = true) {
    if (!this.current || this._gameOver) {
      return false;
    }
    const rotations = this.current.definition.rotations.length;
    const nextIndex = (this.current.rotationIndex + (clockwise ? 1 : -1) + rotations) % rotations;
    const wallKickOffsets = [0, -1, 1, -2, 2];
    for (const offset of wallKickOffsets) {
      const testPosition = { x: this.current.position.x + offset, y: this.current.position.y };
      const testBlocks = this.getBlockPositions(this.current, nextIndex, testPosition);
      if (!this.isColliding(testBlocks)) {
        this.current.rotationIndex = nextIndex;
        this.current.position = testPosition;
        return true;
      }
    }
    return false;
  }

  public tick() {
    if (this._gameOver) {
      return;
    }
    if (!this.softDrop()) {
      return;
    }
  }

  public getState(): GameState {
    const boardCopy = this.board.map((row) => row.map((cell) => (cell ? { ...cell } : null)));
    const currentPiece = this.current
      ? {
          name: this.current.definition.name,
          color: this.current.definition.color,
          rotationIndex: this.current.rotationIndex,
          position: { ...this.current.position },
          blocks: this.getBlockPositions().map((block) => ({ ...block })),
        }
      : null;
    const nextDefinition = this.peekNextDefinition();
    const nextPiece = nextDefinition
      ? {
          name: nextDefinition.name,
          color: nextDefinition.color,
          blocks: nextDefinition.rotations[0].map((block) => ({ ...block })),
        }
      : null;
    return {
      board: boardCopy,
      currentPiece,
      nextPiece,
      score: this.score,
      lines: this.lines,
      level: this.level,
      gameOver: this._gameOver,
    };
  }
}
