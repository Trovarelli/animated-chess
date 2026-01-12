"use client";
import { useState, useCallback } from "react";
import { GameContext } from "./context";
import { GameContextProviderProps, GameOverType, Move } from "./types";

export const GameContextProvider = ({ children }: GameContextProviderProps) => {
  const [turn, setTurn] = useState<"white" | "black" | null>("white");
  const [gameOver, setGameOver] = useState<GameOverType>({
    looser: {
      color: null,
      details: "",
    },
    winner: {
      color: null,
      details: "",
    },
    over: false,
  });
  const [moveHistory, setMoveHistory] = useState<Move[]>([]);
  const [isInCheck, setIsInCheck] = useState(false);

  const addMove = useCallback((move: Move) => {
    setMoveHistory(prev => [...prev, move]);
  }, []);

  const resetGame = useCallback(() => {
    setTurn("white");
    setGameOver({
      looser: { color: null, details: "" },
      winner: { color: null, details: "" },
      over: false,
    });
    setMoveHistory([]);
    setIsInCheck(false);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('resetGame'));
    }
  }, []);

  return (
    <GameContext.Provider
      value={{
        turn,
        setTurn,
        gameOver,
        setGameOver,
        moveHistory,
        addMove,
        isInCheck,
        setIsInCheck,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
