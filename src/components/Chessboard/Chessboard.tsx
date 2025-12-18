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
      className="w-full h-full flex justify-center items-center p-8 gap-8 bg-[url('/sprites/Board/BattleField-01.png')] bg-cover bg-center bg-no-repeat"
    >
      <div className="w-48 h-full flex flex-col justify-center items-end py-4">
        <div className="flex flex-wrap-reverse gap-2 justify-end content-center opacity-80 hover:opacity-100 transition-opacity">
          {deadWhite.map((el, index) => (
            <motion.div
              key={el.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <ChessPiece
                width={cellSize * 0.7}
                height={cellSize * 0.7}
                type={el.type}
                color={el.color}
                isDead
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Chess board */}
      <div className="relative shadow-[0_0_60px_rgba(0,0,0,0.5)] bg-black/20 rounded-lg p-6 backdrop-blur-[2px]" style={{ overflow: "visible" }}>
        <div
          className="relative"
          style={{
            width: boardSize,
            height: boardSize,
            overflow: "visible",
          }}
        >
          <Engine width={boardSize} height={boardSize} />
        </div>
      </div>

      {/* Right Graveyard - Black pieces that died (playing for white) */}
      <div className="w-48 h-full flex flex-col justify-center items-start py-4">
        <div className="flex flex-wrap gap-2 justify-start content-center opacity-80 hover:opacity-100 transition-opacity">
          {deadBlack.map((el, index) => (
            <motion.div
              key={el.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <ChessPiece
                width={cellSize * 0.7}
                height={cellSize * 0.7}
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
