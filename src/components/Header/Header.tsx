"use client";
import { useContext } from "react";
import { GameContext } from "@/context/GameContext/context";

export const Header = () => {
  const { turn, moveHistory, isInCheck, resetGame } = useContext(GameContext);

  const moveCount = Math.floor(moveHistory.length / 2) + 1;

  return (
    <header className="w-full bg-stone-950/80 backdrop-blur-md border-b border-amber-500/20 sticky top-0 z-50 shadow-2xl">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <div className="flex items-center">
            <img 
              src="/animated-chess.png" 
              alt="Animated Chess Logo" 
              className="h-20 w-auto object-contain drop-shadow-[0_0_12px_rgba(217,119,6,0.4)] transition-transform duration-500 hover:scale-105"
            />
          </div>

          <div className="h-10 w-[1px] bg-stone-800" />

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full transition-all duration-500 ${
                  turn === "white"
                    ? "bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)] scale-110"
                    : "bg-stone-700 scale-90"
                }`}
              />
              <span className={`text-[10px] uppercase tracking-tighter font-bold transition-opacity duration-300 ${turn === "white" ? "text-white opacity-100" : "text-stone-500 opacity-50"}`}>
                Brancas
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full transition-all duration-500 ${
                  turn === "black"
                    ? "bg-amber-600 shadow-[0_0_12px_rgba(217,119,6,0.8)] scale-110"
                    : "bg-stone-700 scale-90"
                }`}
              />
              <span className={`text-[10px] uppercase tracking-tighter font-bold transition-opacity duration-300 ${turn === "black" ? "text-amber-500 opacity-100" : "text-stone-500 opacity-50"}`}>
                Pretas
              </span>
            </div>

            {isInCheck && (
              <div className="px-2 py-0.5 rounded bg-red-950/50 border border-red-500/50">
                <span className="text-[10px] text-red-500 font-black animate-pulse tracking-widest">
                  XEQUE
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase font-bold text-stone-500 tracking-widest">
              Partida em curso
            </span>
            <span className="text-xs text-amber-500 font-mono">
              MOVIMENTO #{moveCount.toString().padStart(2, "0")}
            </span>
          </div>
          
          <button
            onClick={resetGame}
            className="group relative px-6 py-2 overflow-hidden bg-transparent border border-amber-500/30 rounded-sm transition-all duration-300 hover:border-amber-500"
          >
            <div className="absolute inset-0 w-0 bg-amber-500/10 transition-all duration-300 group-hover:w-full" />
            <span className="relative text-xs font-black tracking-widest text-amber-500 font-cinzel">
              NOVO JOGO
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
