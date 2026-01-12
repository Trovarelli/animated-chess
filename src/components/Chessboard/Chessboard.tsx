"use client";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Engine } from "../Engine/Engine";
import { ChessboardContext } from "@/context/ChessboardContext/context";
import { ChessPiece } from "../ChessPiece/ChessPiece";

export const Chessboard = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [boardSize, setBoardSize] = useState(0);
  const { piecesInfo } = useContext(ChessboardContext);

  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      const newSize = Math.min(containerWidth, containerHeight) * 0.9;
      setBoardSize(newSize);
    };

    const observer = new ResizeObserver(updateSize);
    if (containerRef.current) {
      observer.observe(containerRef.current);
      updateSize();
    }

    return () => observer.disconnect();
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

  const cellSize = Math.min(boardSize, boardSize) / 8;

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex justify-center items-center p-8 gap-12 bg-[#0c0a09] relative overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="w-56 h-[600px] flex flex-col justify-start items-end py-8 z-10">
        <div className="mb-4 pr-2">
          <span className="text-[10px] font-black text-stone-500 uppercase tracking-[0.2em] font-cinzel">Baixas Brancas</span>
        </div>
        <div className="flex flex-wrap-reverse gap-1 justify-end content-start opacity-60 hover:opacity-100 transition-all duration-500 bg-stone-900/20 backdrop-blur-sm p-4 border-r border-stone-800/50 rounded-l-xl">
          {deadWhite.map((el, index) => (
            <motion.div
              key={el.id}
              initial={{ opacity: 0, scale: 0.5, y: 10 }}
              animate={{ opacity: 1, scale: 0.9, y: 0 }}
              transition={{ delay: index * 0.05, type: "spring", stiffness: 200 }}
              className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
            >
              <ChessPiece
                width={cellSize * 0.8}
                height={cellSize * 0.8}
                type={el.type}
                color={el.color}
                isDead
              />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="relative z-20 group">
        <div className="absolute -inset-4 bg-amber-500/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <div className="relative shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9),0_0_20px_rgba(217,119,6,0.1)] bg-stone-900/40 rounded-sm p-1 backdrop-blur-[1px] border border-amber-900/20" style={{ overflow: "visible" }}>
          <div
            className="relative bg-[url('/sprites/Board/BattleField-01.png')] bg-cover bg-center rounded-sm"
            style={{
              width: boardSize,
              height: boardSize,
              overflow: "visible",
              boxShadow: "inset 0 0 100px rgba(0,0,0,0.4)"
            }}
          >
            <Engine width={boardSize} height={boardSize} />
          </div>
        </div>
        
      </div>

      <div className="w-56 h-[600px] flex flex-col justify-start items-start py-8 z-10">
        <div className="mb-4 pl-2">
          <span className="text-[10px] font-black text-stone-500 uppercase tracking-[0.2em] font-cinzel">Baixas Pretas</span>
        </div>
        <div className="flex flex-wrap gap-1 justify-start content-start opacity-60 hover:opacity-100 transition-all duration-500 bg-stone-900/20 backdrop-blur-sm p-4 border-l border-stone-800/50 rounded-r-xl">
          {deadBlack.map((el, index) => (
            <motion.div
              key={el.id}
              initial={{ opacity: 0, scale: 0.5, y: -10 }}
              animate={{ opacity: 1, scale: 0.9, y: 0 }}
              transition={{ delay: index * 0.05, type: "spring", stiffness: 200 }}
              className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
            >
              <ChessPiece
                width={cellSize * 0.8}
                height={cellSize * 0.8}
                type={el.type}
                color={el.color}
                isDead
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
