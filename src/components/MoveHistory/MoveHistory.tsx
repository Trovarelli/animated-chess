"use client";
import { useContext, useRef, useEffect, useMemo } from "react";
import { GameContext, Move } from "@/context";
import { ChessPiece } from "@/components/ChessPiece";

type MovePair = {
  moveNumber: number;
  white?: Move;
  black?: Move;
};

export const MoveHistory = () => {
  const { moveHistory } = useContext(GameContext);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [moveHistory]);

  // Group moves by pairs (white and black)
  const movePairs = useMemo<MovePair[]>(() => {
    const pairs: MovePair[] = [];

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
    <div className="absolute top-4 right-4 w-72 bg-gradient-to-b from-amber-950/80 via-stone-900/80 to-amber-950/80 backdrop-blur-md border-2 border-amber-700/60 rounded-lg shadow-2xl overflow-hidden z-10">
      <div className="bg-amber-900/60 px-3 py-2 border-b-2 border-amber-700/50">
        <h2 className="text-sm font-bold text-amber-100 flex items-center gap-2">
          Histórico
        </h2>
        <p className="text-xs text-amber-300/80">
          {moveHistory.length} movimento{moveHistory.length !== 1 ? "s" : ""}
        </p>
      </div>
      
      <div
        ref={scrollRef}
        className="overflow-y-auto max-h-96 p-2"
        style={{ scrollBehavior: "smooth" }}
      >
        {movePairs.length === 0 ? (
          <div className="text-center py-6 text-amber-400/50">
            <div className="text-3xl mb-1">♟️</div>
            <p className="text-xs">Nenhum movimento</p>
          </div>
        ) : (
          <div className="space-y-2">
            {movePairs.map((pair) => {
              return (
                <div
                  key={pair.moveNumber}
                  className="bg-black/40 rounded px-3 py-2 hover:bg-black/60 transition-colors border border-amber-800/40"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-amber-400 font-bold min-w-[24px] text-sm">
                      {pair.moveNumber}.
                    </span>
                    
                    {/* White move */}
                    <div className="flex items-center gap-2 flex-1">
                      <div className="w-12 h-12 flex items-center justify-center">
                        {pair.white && (
                          <ChessPiece
                            width={48}
                            height={48}
                            type={pair.white.piece}
                            color="white"
                            isYourTurn={false}
                            isAttacking={false}
                            isMoving={false}
                            isHit={false}
                            isDead={false}
                            isSelected={false}
                          />
                        )}
                      </div>
                      <span className="text-amber-100 font-mono text-sm">
                        {pair.white?.notation.substring(1) || ""}
                      </span>
                    </div>
                    
                    {/* Black move */}
                    {pair.black && (
                      <div className="flex items-center gap-2 flex-1">
                        <div className="w-12 h-12 flex items-center justify-center">
                          <ChessPiece
                            width={48}
                            height={48}
                            type={pair.black.piece}
                            color="black"
                            isYourTurn={false}
                            isAttacking={false}
                            isMoving={false}
                            isHit={false}
                            isDead={false}
                            isSelected={false}
                          />
                        </div>
                        <span className="text-amber-100 font-mono text-sm">
                          {pair.black.notation.substring(1)}
                        </span>
                      </div>
                    )}
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
