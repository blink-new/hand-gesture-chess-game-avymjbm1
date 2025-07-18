import React from 'react';
import { ChessSquare, PIECE_SYMBOLS } from '../types/chess';

interface ChessBoardProps {
  board: ChessSquare[][];
  onSquareClick: (square: string) => void;
  gestureSquare?: string | null;
}

export const ChessBoard: React.FC<ChessBoardProps> = ({ 
  board, 
  onSquareClick, 
  gestureSquare 
}) => {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  return (
    <div className="relative">
      {/* Board container */}
      <div className="grid grid-cols-8 gap-0 border-4 border-amber-600 rounded-lg overflow-hidden shadow-2xl">
        {board.map((row, rankIndex) =>
          row.map((square, fileIndex) => {
            const isLight = (rankIndex + fileIndex) % 2 === 0;
            const isGestureTarget = gestureSquare === square.square;
            
            return (
              <div
                key={square.square}
                className={`
                  chess-square w-16 h-16 cursor-pointer transition-all duration-200
                  ${isLight ? 'light' : 'dark'}
                  ${square.isSelected ? 'selected' : ''}
                  ${square.isValidMove && !square.piece ? 'valid-move' : ''}
                  ${square.isValidCapture ? 'valid-capture' : ''}
                  ${isGestureTarget ? 'ring-4 ring-green-400 ring-opacity-80' : ''}
                  hover:brightness-110
                `}
                onClick={() => onSquareClick(square.square)}
              >
                {square.piece && (
                  <span 
                    className={`
                      chess-piece
                      ${square.piece.color === 'w' ? 'text-white' : 'text-gray-900'}
                      ${isGestureTarget ? 'scale-125' : ''}
                    `}
                  >
                    {PIECE_SYMBOLS[`${square.piece.color}${square.piece.type}` as keyof typeof PIECE_SYMBOLS]}
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
      
      {/* File labels (a-h) */}
      <div className="flex justify-center mt-2">
        {files.map((file) => (
          <div key={file} className="w-16 text-center text-amber-300 font-medium">
            {file}
          </div>
        ))}
      </div>
      
      {/* Rank labels (1-8) */}
      <div className="absolute left-0 top-0 h-full flex flex-col justify-center -ml-8">
        {ranks.map((rank) => (
          <div key={rank} className="h-16 flex items-center text-amber-300 font-medium">
            {rank}
          </div>
        ))}
      </div>
    </div>
  );
};