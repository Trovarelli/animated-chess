"use client";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Engine } from "../Engine/Engine";
import { ChessboardContext } from "@/context";
import { ChessPiece } from "../ChessPiece";

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

  console.log(deadWhite);
  console.log(deadBlack);

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex justify-between items-center p-3 gap-3 bg-[url('/sprites/Board/BattleField-01.png')] bg-cover bg-center bg-no-repeat"
    >
      <div className="w-full h-full p-2 relative">
        {deadWhite.map((el) => (
          <ChessPiece
            key={el.id}
            width={cellSize}
            height={cellSize}
            type={el.type}
            color={el.color}
            isDead
          />
        ))}
      </div>
      <div className="relative p-4" style={{ overflow: "visible" }}>
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
      <div className="w-full h-full p-2 relative">
        {deadBlack.map((el) => (
          <ChessPiece
            key={el.id}
            width={cellSize}
            height={cellSize}
            type={el.type}
            color={el.color}
            isDead
          />
        ))}
      </div>
    </div>
  );
};
