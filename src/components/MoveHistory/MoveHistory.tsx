"use client";
import { useContext, useRef, useEffect, useMemo } from "react";
import { GameContext } from "@/context/GameContext/context";
import { ChessPiece } from "@/components/ChessPiece/ChessPiece";

export const MoveHistory = () => {
  const { moveHistory } = useContext(GameContext);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [moveHistory]);

  const movePairs = useMemo(() => {
    const pairs = [];
    for (let i = 0; i < moveHistory.length; i += 2) {
      pairs.push({
        moveNumber: Math.floor(i / 2) + 1,
        white: moveHistory[i],
        black: moveHistory[i + 1],
      });
    }
    return pairs;
  }, [moveHistory]);

  return (
    <div className="w-full h-full flex flex-col bg-[#0c0a09]/80 backdrop-blur-xl border-l border-amber-900/20 shadow-2xl overflow-hidden">
      <div className="px-6 py-6 border-b border-amber-900/30">
        <h2 className="text-sm font-black text-amber-500 uppercase tracking-[0.2em] font-cinzel flex items-center gap-2">
          <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
          Log de Combate
        </h2>
        <div className="flex justify-between items-center mt-2">
          <p className="text-[10px] text-stone-500 font-bold uppercase tracking-widest">
            Protocolo tático v1.0
          </p>
          <span className="text-[10px] text-amber-500/80 font-mono">
            {moveHistory.length.toString().padStart(3, "0")} REGS
          </span>
        </div>
      </div>
      
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-2 scrollbar-hide"
        style={{ scrollBehavior: "smooth" }}
      >
        {movePairs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-20 py-12">
            <div className="text-4xl mb-4 grayscale">⚔️</div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500">Aguardando Início</p>
          </div>
        ) : (
          <div className="space-y-4">
            {movePairs.map((pair) => {
              return (
                <div
                  key={pair.moveNumber}
                  className="group relative"
                >
                  <div className="absolute -left-2 top-0 bottom-0 w-[1px] bg-amber-500/20 group-hover:bg-amber-500/50 transition-colors" />
                  
                  <div className="flex flex-col gap-2 bg-stone-900/20 p-3 rounded-sm border border-stone-800/30 group-hover:border-amber-900/40 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-stone-600 group-hover:text-amber-700 transition-colors">
                        SÊQUENCIA #{pair.moveNumber.toString().padStart(2, "0")}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3 flex-1 bg-stone-950/40 p-2 rounded-sm border border-stone-800/20">
                        <div className="w-8 h-8 flex items-center justify-center bg-stone-900 rounded-full border border-stone-800">
                          {pair.white && (
                            <ChessPiece
                              width={24}
                              height={24}
                              type={pair.white.piece}
                              color="white"
                              isDead={false}
                            />
                          )}
                        </div>
                        <span className={`text-xs font-mono font-bold tracking-tighter ${pair.white?.notation.includes("x") ? "text-red-500" : "text-white"}`}>
                          {pair.white ? (pair.white.notation.includes("x") ? "MASSACRE" : pair.white.notation.substring(1)) : "---"}
                        </span>
                         {pair.white?.notation.includes("#") && <span className="text-[8px] bg-red-600 text-white px-1 rounded animate-pulse">FATALITY</span>}
                      </div>
                      
                      <div className={`flex items-center gap-3 flex-1 p-2 rounded-sm border ${pair.black ? 'bg-amber-500/5 border-amber-900/20' : 'bg-transparent border-dashed border-stone-800/40'}`}>
                        {pair.black ? (
                          <>
                            <div className="w-8 h-8 flex items-center justify-center bg-stone-900 rounded-full border border-amber-900/40">
                              <ChessPiece
                                width={24}
                                height={24}
                                type={pair.black.piece}
                                color="black"
                                isDead={false}
                              />
                            </div>
                            <span className={`text-xs font-mono font-bold tracking-tighter ${pair.black.notation.includes("x") ? "text-amber-600" : "text-amber-500"}`}>
                              {pair.black.notation.includes("x") ? "SLAUGHTER" : pair.black.notation.substring(1)}
                            </span>
                             {pair.black.notation.includes("#") && <span className="text-[8px] bg-red-600 text-white px-1 rounded animate-pulse">FATALITY</span>}
                          </>
                        ) : (
                          <div className="w-full flex justify-center py-1">
                             <span className="text-[8px] text-stone-700 font-black tracking-widest text-center">PENDENTE</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
