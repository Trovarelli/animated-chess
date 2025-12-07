"use client";
import { useContext } from "react";
import { GameContext } from "@/context";

export const Header = () => {
  const { turn, moveHistory, isInCheck, resetGame } = useContext(GameContext);

  const moveCount = Math.floor(moveHistory.length / 2) + 1;

  return (
    <header className="w-full bg-gradient-to-r from-amber-950/90 via-stone-900/90 to-amber-950/90 backdrop-blur-sm border-b-2 border-amber-700/40">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-5 h-5 rounded-full border-2 ${
              turn === "white"
                ? "bg-white border-amber-500 shadow-lg shadow-amber-500/50"
                : "bg-gray-400 border-stone-600"
            }`}
          />
          <span className="text-sm font-bold text-amber-200">
            {turn === "white" ? "Brancas" : "Pretas"}
          </span>
          <div
            className={`w-5 h-5 rounded-full border-2 ${
              turn === "black"
                ? "bg-gray-900 border-amber-500 shadow-lg shadow-amber-500/50"
                : "bg-gray-700 border-stone-600"
            }`}
          />
          {isInCheck && (
            <span className="text-xs text-red-400 font-semibold animate-pulse">
              XEQUE
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-amber-400/90">
            Movimento #{moveCount}
          </span>
          <button
            onClick={resetGame}
            className="px-3 py-1 bg-amber-900/70 hover:bg-amber-800/90 text-amber-100 text-sm font-semibold rounded border-2 border-amber-700/60 transition-all duration-200 active:scale-95 shadow-md hover:shadow-lg"
            title="Novo Jogo"
          >
            Novo Jogo
          </button>
        </div>
      </div>
    </header>
  );
};
