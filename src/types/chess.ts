export type PieceType = 'p' | 'r' | 'n' | 'b' | 'q' | 'k';
export type PieceColor = 'w' | 'b';

export interface ChessPiece {
  type: PieceType;
  color: PieceColor;
}

export interface ChessSquare {
  piece: ChessPiece | null;
  square: string;
  isSelected: boolean;
  isValidMove: boolean;
  isValidCapture: boolean;
}

export interface GameState {
  board: ChessSquare[][];
  currentPlayer: PieceColor;
  selectedSquare: string | null;
  validMoves: string[];
  gameStatus: 'playing' | 'check' | 'checkmate' | 'stalemate' | 'draw';
  moveHistory: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface GestureState {
  isPinching: boolean;
  confidence: number;
  handDetected: boolean;
}

export const PIECE_SYMBOLS = {
  'wp': '♙', 'wr': '♖', 'wn': '♘', 'wb': '♗', 'wq': '♕', 'wk': '♔',
  'bp': '♟', 'br': '♜', 'bn': '♞', 'bb': '♝', 'bq': '♛', 'bk': '♚'
} as const;