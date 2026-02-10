"use client";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Engine } from "../Engine/Engine";
import { ChessboardContext } from "@/context/ChessboardContext/context";

export const Chessboard = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [boardSize, setBoardSize] = useState(0);
  const lastSizeRef = useRef(0);
  const { piecesInfo } = useContext(ChessboardContext);

  useEffect(() => {
    let rafId: number | null = null;
    
    const updateSize = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      
      rafId = requestAnimationFrame(() => {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        const availableWidth = viewportWidth - 800;
        const availableHeight = viewportHeight - 120;
        
        const idealSize = Math.min(availableWidth, availableHeight);
        const MAX_BOARD_SIZE = 800;
        const newSize = Math.max(300, Math.min(idealSize, MAX_BOARD_SIZE));
        
        if (Math.abs(newSize - lastSizeRef.current) > 2) {
          lastSizeRef.current = newSize;
          setBoardSize(newSize);
        }
      });
    };

    window.addEventListener('resize', updateSize);
    updateSize();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  const { deadWhite, deadBlack } = useMemo(() => {
    const deadBlack = piecesInfo.filter(
      (el) => !el.alive && el.color === "black"
    );
    const deadWhite = piecesInfo.filter(
      (el) => !el.alive && el.color === "white"
    );
    return { deadBlack, deadWhite };
  }, [piecesInfo]);



  return (
    <div
      ref={containerRef}
      className="w-full h-full flex justify-center items-center bg-[#0c0a09] relative overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-orange-900/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
      
      <div className={`relative z-20 group shrink-0 p-5 bg-[#0f0a05] ring-1 ring-orange-900/20 shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-lg max-w-full max-h-full ${deadWhite.length > deadBlack.length ? "" : ""}`}> 
        <div className="absolute inset-0 bg-[url('/textures/wood-pattern.png')] opacity-10 pointer-events-none rounded-lg mix-blend-overlay" />
        <div className="absolute inset-0 border-4 border-[#1c1208] pointer-events-none rounded-lg shadow-[inset_0_0_30px_rgba(0,0,0,0.9)]" />
        <div className="absolute inset-1 border border-[#3f2e18] pointer-events-none rounded-[6px] opacity-30" />

        <div className="absolute top-1 left-5 right-5 flex justify-between px-2 text-[10px] font-bold text-[#8a6a4b] font-cinzel tracking-[0.2em] select-none pointer-events-none shadow-black drop-shadow-md">
           <span>A</span><span>B</span><span>C</span><span>D</span><span>E</span><span>F</span><span>G</span><span>H</span>
        </div>
        <div className="absolute bottom-1 left-5 right-5 flex justify-between px-2 text-[10px] font-bold text-[#8a6a4b] font-cinzel tracking-[0.2em] select-none pointer-events-none shadow-black drop-shadow-md">
           <span>A</span><span>B</span><span>C</span><span>D</span><span>E</span><span>F</span><span>G</span><span>H</span>
        </div>
        <div className="absolute left-1 top-5 bottom-5 flex flex-col justify-between py-2 text-[10px] font-bold text-[#8a6a4b] font-cinzel tracking-[0.2em] select-none pointer-events-none shadow-black drop-shadow-md">
           <span>8</span><span>7</span><span>6</span><span>5</span><span>4</span><span>3</span><span>2</span><span>1</span>
        </div>
        <div className="absolute right-1 top-5 bottom-5 flex flex-col justify-between py-2 text-[10px] font-bold text-[#8a6a4b] font-cinzel tracking-[0.2em] select-none pointer-events-none shadow-black drop-shadow-md">
           <span>8</span><span>7</span><span>6</span><span>5</span><span>4</span><span>3</span><span>2</span><span>1</span>
        </div>

        <div className="absolute -inset-4 bg-orange-600/5 rounded-xl blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none mix-blend-color-dodge" />
        
        <div className="relative bg-[#0a0500] rounded-sm pointer-events-auto border border-orange-950/30 shadow-[0_0_25px_rgba(0,0,0,1)]" style={{ overflow: "hidden" }}>
          <div
            className="relative bg-[url('/sprites/Board/BattleField-01.png')] bg-cover bg-center rounded-sm"
            style={{
              width: boardSize,
              height: boardSize,
              overflow: "hidden",
              boxShadow: "inset 0 0 60px rgba(0,0,0,0.9)"
            }}
          >
            <Engine width={boardSize} height={boardSize} />
          </div>
        </div>
      </div>
    </div>
  );
};
