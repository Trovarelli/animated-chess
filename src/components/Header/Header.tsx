"use client";
import { useContext } from "react";
import { GameContext } from "@/context";

export const Header = () => {
  const { turn, moveHistory, isInCheck, resetGame } = useContext(GameContext);

  const moveCount = Math.floor(moveHistory.length / 2) + 1;

  return (
    <header className="w-full bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 shadow-lg border-b-4 border-amber-600">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Title */}
          <div className="flex items-center gap-3">
            <div className="text-4xl">♔</div>
            <div>
              <h1 className="text-2xl font-bold text-amber-100">
                Animated Chess
              </h1>
              <p className="text-xs text-amber-200">
                Movimento #{moveCount}
              </p>
            </div>
          </div>

          {/* Turn Indicator */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center px-6 py-2 bg-amber-950/50 rounded-lg border-2 border-amber-600">
              <span className="text-xs text-amber-300 mb-1">Turno</span>
              <div className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full border-2 ${
                    turn === "white"
                      ? "bg-white border-yellow-400 shadow-lg shadow-yellow-400/50"
                      : "bg-gray-300 border-gray-400"
                  }`}
                />
                <span className="text-lg font-bold text-amber-100">
                  {turn === "white" ? "Brancas" : "Pretas"}
                </span>
                <div
                  className={`w-6 h-6 rounded-full border-2 ${
                    turn === "black"
                      ? "bg-gray-900 border-yellow-400 shadow-lg shadow-yellow-400/50"
                      : "bg-gray-700 border-gray-600"
                  }`}
                />
              </div>
              {isInCheck && (
                <span className="text-xs text-red-400 mt-1 font-semibold animate-pulse">
                  ⚠️ XEQUE!
                </span>
              )}
            </div>

            {/* Reset Button */}
            <button
              onClick={resetGame}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
              title="Novo Jogo"
            >
              🔄 Novo Jogo
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
