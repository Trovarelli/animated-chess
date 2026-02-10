import { useContext } from "react";
import { GameContext } from "@/context/GameContext/context";

export const Header = () => {
  const { isInCheck, resetGame } = useContext(GameContext);

  return (
    <header className="w-full bg-transparent border-b border-transparent px-6 py-4 flex items-center justify-between z-40">
      <div className="flex items-center gap-3 opacity-100 transition-opacity">
        <h1 className="text-xs font-cinzel font-bold text-amber-500 tracking-[0.3em] drop-shadow-sm">
          ANIMATED CHESS
        </h1>
      </div>

      <div className="flex items-center gap-4">
          {isInCheck && (
            <div className="px-4 py-2 bg-red-900/20 border border-red-500/50 rounded flex items-center gap-2 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-[10px] font-bold text-red-500 tracking-wider">
                XEQUE
              </span>
            </div>
          )}
          <button
            onClick={resetGame}
            className="px-4 py-2 bg-stone-900/50 border border-stone-800 hover:bg-stone-800 hover:border-amber-900/50 rounded transition-all group flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-amber-500/20 group-hover:bg-amber-500 transition-colors" />
            <span className="text-[10px] font-bold text-stone-500 group-hover:text-amber-500 tracking-wider">
              REINICIAR PARTIDA
            </span>
          </button>
      </div>
    </header>
  );
};
