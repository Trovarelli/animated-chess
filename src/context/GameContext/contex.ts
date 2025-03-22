import { createContext } from "react";
import { GameContextProps } from "./types";

export const GameContext = createContext<GameContextProps>({
  turn: null,
  setTurn: () => {},
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
  setGameOver: () => {},
});
