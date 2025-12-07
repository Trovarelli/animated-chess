"use client";
import { useContext, useRef, useEffect } from "react";
import { GameContext } from "@/context";

export const MoveHistory = () => {
  const { moveHistory } = useContext(GameContext);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [moveHistory]);

  // Group moves by pairs (white and black)
  const movePairs = [];
  for (let i = 0; i < moveHistory.length; i += 2) {
    movePairs.push({
      moveNumber: Math.floor(i / 2) + 1,
      white: moveHistory[i],
      black: moveHistory[i + 1],
    });
  }

  return (
    <div className="w-64 bg-amber-900/30 backdrop-blur-sm border-2 border-amber-700 rounded-lg shadow-xl overflow-hidden">
      <div className="bg-amber-800 px-4 py-3 border-b-2 border-amber-700">
        <h2 className="text-lg font-bold text-amber-100 flex items-center gap-2">
          📜 Histórico
        </h2>
        <p className="text-xs text-amber-200">
          {moveHistory.length} movimento{moveHistory.length !== 1 ? "s" : ""}
        </p>
      </div>
      
      <div
        ref={scrollRef}
        className="overflow-y-auto max-h-96 p-2"
        style={{ scrollBehavior: "smooth" }}
      >
        {movePairs.length === 0 ? (
          <div className="text-center py-8 text-amber-300/50">
            <div className="text-4xl mb-2">♟️</div>
            <p className="text-sm">Nenhum movimento ainda</p>
          </div>
        ) : (
          <div className="space-y-1">
            {movePairs.map((pair) => (
              <div
                key={pair.moveNumber}
                className="grid grid-cols-[auto_1fr_1fr] gap-2 items-center bg-amber-950/40 rounded px-2 py-1.5 hover:bg-amber-950/60 transition-colors"
              >
                <span className="text-amber-400 font-bold text-sm w-8">
                  {pair.moveNumber}.
                </span>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-white rounded-full border border-amber-600" />
                  <span className="text-amber-100 text-sm font-mono">
                    {pair.white?.notation || ""}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {pair.black && (
                    <>
                      <div className="w-3 h-3 bg-gray-900 rounded-full border border-amber-600" />
                      <span className="text-amber-100 text-sm font-mono">
                        {pair.black.notation}
                      </span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
