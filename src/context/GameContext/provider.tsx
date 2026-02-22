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
  const [aiDifficulty, setAiDifficulty] = useState<number>(
    savedState.current?.aiDifficulty ?? 10
  );
  const [uciMoveHistory, setUciMoveHistory] = useState<string[]>(
    savedState.current?.uciMoveHistory ?? []
  );

  const addMove = useCallback((move: Move) => {
    setMoveHistory(prev => [...prev, move]);
  }, []);

  const addUciMove = useCallback((uciMove: string) => {
    setUciMoveHistory(prev => [...prev, uciMove]);
  }, []);

  const resetGame = useCallback(() => {
    setTurn("white");
    setGameOver(defaultGameOver);
    setMoveHistory([]);
    setUciMoveHistory([]);
    setIsInCheck(false);
    setPlayerFaction(null);
    setAiDifficulty(10);
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
      aiDifficulty,
      uciMoveHistory,
      piecesInfo: currentPersisted?.piecesInfo ?? [],
      enPassantTarget: currentPersisted?.enPassantTarget ?? null,
    });
  }, [turn, moveHistory, isInCheck, gameOver, playerFaction, aiDifficulty, uciMoveHistory]);

  return (
    <GameContext.Provider
      value={{
        turn,
        setTurn,
        gameOver,
        setGameOver,
        moveHistory,
        addMove,
        uciMoveHistory,
        addUciMove,
        isInCheck,
        setIsInCheck,
        playerFaction,
        setPlayerFaction,
        aiDifficulty,
        setAiDifficulty,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
