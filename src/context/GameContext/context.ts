import { createContext } from "react";
import { GameContextProps } from "./types";

export const GameContext = createContext<GameContextProps>({
  turn: null,
  setTurn: () => { },
  gameOver: {
    over: false,
    looser: {
      color: null,
      details: ''
    },
    winner: {
      color: null,
      details: ''
    }
  },
  setGameOver: () => { },
  moveHistory: [],
  addMove: () => { },
  uciMoveHistory: [],
  addUciMove: () => { },
  isInCheck: false,
  setIsInCheck: () => { },
  playerFaction: null,
  setPlayerFaction: () => { },
  aiDifficulty: 10,
  setAiDifficulty: () => { },
  resetGame: () => { },
});

