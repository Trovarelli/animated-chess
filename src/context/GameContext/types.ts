import { Dispatch, JSX, SetStateAction } from "react";
import { PiecesTypes } from "@/components/ChessPiece";

export type Move = {
  from: { row: number; col: number };
  to: { row: number; col: number };
  piece: PiecesTypes;
  captured?: PiecesTypes;
  notation: string;
  timestamp: number;
};

export type GameOverType = {
  over: boolean;
  winner: {
    color: 'black' | 'white' | null,
    details: string;
  }
  looser: {
    color: 'black' | 'white' | null,
    details: string;
  }
}

export type GameContextProps = {
  turn: 'black' | 'white' | null
  setTurn: Dispatch<SetStateAction<'black' | 'white' | null>>;
  gameOver: GameOverType
  setGameOver: Dispatch<SetStateAction<GameOverType>>;
  moveHistory: Move[];
  addMove: (move: Move) => void;
  isInCheck: boolean;
  setIsInCheck: Dispatch<SetStateAction<boolean>>;
  resetGame: () => void;
};

export type GameContextProviderProps = {
  children: JSX.Element;
};
