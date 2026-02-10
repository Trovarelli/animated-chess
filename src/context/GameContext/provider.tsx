"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { GameContext } from "./context";
import { Faction, GameContextProviderProps, GameOverType, Move } from "./types";
import { gameStorage } from "@/utils/gameStorage";

const defaultGameOver: GameOverType = {
  looser: { color: null, details: "" },
  winner: { color: null, details: "" },
  over: false,
};

export const GameContextProvider = ({ children }: GameContextProviderProps) => {
  const savedState = useRef(gameStorage.load());

  const [turn, setTurn] = useState<"white" | "black" | null>(
    savedState.current?.turn ?? "white"
  );
  const [gameOver, setGameOver] = useState<GameOverType>(
    savedState.current?.gameOver ?? defaultGameOver
  );
  const [moveHistory, setMoveHistory] = useState<Move[]>(
    savedState.current?.moveHistory ?? []
  );
  const [isInCheck, setIsInCheck] = useState(
    savedState.current?.isInCheck ?? false
  );
  const [playerFaction, setPlayerFaction] = useState<Faction | null>(
    savedState.current?.playerFaction ?? null
  );

  const addMove = useCallback((move: Move) => {
    setMoveHistory(prev => [...prev, move]);
  }, []);

  const resetGame = useCallback(() => {
    setTurn("white");
    setGameOver(defaultGameOver);
    setMoveHistory([]);
    setIsInCheck(false);
    setPlayerFaction(null);
    gameStorage.clear();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('resetGame'));
    }
  }, []);

  useEffect(() => {
    if (!playerFaction) return;

    const currentPersisted = gameStorage.load();
    gameStorage.save({
      turn,
      moveHistory,
      isInCheck,
      gameOver,
      playerFaction,
      piecesInfo: currentPersisted?.piecesInfo ?? [],
      enPassantTarget: currentPersisted?.enPassantTarget ?? null,
    });
  }, [turn, moveHistory, isInCheck, gameOver, playerFaction]);

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
        playerFaction,
        setPlayerFaction,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
