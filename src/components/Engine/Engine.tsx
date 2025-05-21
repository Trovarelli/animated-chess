"use client";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BasicCoords, ChessboardContext } from "@/context";
import clsx from "clsx";
import { ChessPiece, defaultPiecesInfo } from "../ChessPiece";
import { EngineProps } from "./types";
import { GameContext } from "@/context/GameContext";
import { GetNegativeColor } from "@/utils/GetNegativeColor";
import { Board } from "./components/Board/Board";

export const Engine = ({ height, width }: EngineProps) => {
  const {
    path,
    setSelectedPieceCoords,
    setPiecesInfo,
    piecesInfo,
    setPath,
    selectedPieceCoords,
  } = useContext(ChessboardContext);

  const { setTurn, turn, setGameOver } = useContext(GameContext);

  const BOARD_SIZE = 8;
  const cellSize = Math.min(width, height) / BOARD_SIZE;
  const offsetX = (width - BOARD_SIZE * cellSize) / 2;
  const offsetY = (height - BOARD_SIZE * cellSize) / 2;
  const previousPositions = useRef<Map<string, BasicCoords>>(new Map());

  useEffect(() => {
    const newPositions = new Map<string, BasicCoords>();
    piecesInfo.forEach((piece) => {
      newPositions.set(piece.id, { ...piece.coords });
    });
    previousPositions.current = newPositions;
  }, [piecesInfo]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) =>
      e.key === "Escape" && setPath([]);
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setPath]);

  const handleSquareClick = useCallback(
    (targetCoords: BasicCoords) => {
      if (!selectedPieceCoords) return;

      setPiecesInfo((prev) => {
        const capturedPiece = prev.find(
          (p) =>
            p.coords.x === targetCoords.x &&
            p.coords.y === targetCoords.y &&
            p.color !== selectedPieceCoords.color
        );

        if (capturedPiece?.type === "king") {
          setGameOver({
            over: true,
            winner: {
              color: GetNegativeColor(capturedPiece.color),
              details: "O jogador ganhou",
            },
            looser: {
              color: capturedPiece.color,
              details: "O jogador perdeu",
            },
          });

          return defaultPiecesInfo;
        }

        return prev.map((piece) => {
          if (capturedPiece?.id === piece.id) {
            return { ...piece, alive: false, coords: { x: null, y: null } };
          }
          if (piece.id === selectedPieceCoords.id) {
            setTurn(GetNegativeColor(piece.color));
            return {
              ...piece,
              coords: targetCoords,
              ...(piece.type === "pawn" && { firstMove: false }),
            };
          }
          return piece;
        });
      });

      setSelectedPieceCoords(null);
      setPath([]);
    },
    [
      selectedPieceCoords,
      setPiecesInfo,
      setSelectedPieceCoords,
      setPath,
      setGameOver,
      setTurn,
    ]
  );

  const renderPieces = useMemo(() => {
    return (
      <AnimatePresence>
        {piecesInfo
          .filter((p) => p.alive)
          .map((piece) => {
            const prevPos = previousPositions.current.get(piece.id);
            const targetX = offsetX + piece.coords.x! * cellSize;
            const targetY = offsetY + piece.coords.y! * cellSize;
            const initialX = prevPos
              ? offsetX + prevPos.x! * cellSize
              : targetX;
            const initialY = prevPos
              ? offsetY + prevPos.y! * cellSize
              : targetY;
            const isSelectable = !path.some(
              (p) => p.x === piece.coords.x && p.y === piece.coords.y
            );
            const isYourTurn = piece.color === turn;
            // const isSelected = selectedPieceCoords?.id === piece.id;
            const isAttacking = path.some(
              (p) =>
                p.x === piece.coords.x &&
                p.y === piece.coords.y &&
                piecesInfo.some(
                  (target) =>
                    target.coords.x === p.x &&
                    target.coords.y === p.y &&
                    target.color !== piece.color
                )
            );

            const handlePieceClick = () => {
              if (!isSelectable || !isYourTurn) return;
              setSelectedPieceCoords(piece);
            };

            return (
              <motion.div
                key={piece.id}
                initial={{ x: initialX, y: initialY }}
                animate={{ x: targetX, y: targetY }}
                transition={{ type: "tween", duration: 0.3 }}
                className="absolute overflow-hidden"
                style={{ width: cellSize, height: cellSize }}
                onClick={handlePieceClick}
              >
                <ChessPiece
                  width={cellSize}
                  height={cellSize}
                  type={piece.type}
                  color={piece.color}
                  className={clsx("", {
                    "cursor-pointer": isYourTurn,
                  })}
                  isAttacking={isAttacking && piece.alive}
                  isMoving={false}
                  isHit={false}
                  isDead={!piece.alive}
                />
              </motion.div>
            );
          })}
      </AnimatePresence>
    );
  }, [
    piecesInfo,
    offsetX,
    cellSize,
    offsetY,
    path,
    turn,
    setSelectedPieceCoords,
  ]);

  const renderCoordinates = useMemo(() => {
    return (
      <>
        {Array.from({ length: BOARD_SIZE }).map((_, i) => (
          <React.Fragment key={i}>
            <div
              className="absolute text-sm text-white font-bold"
              style={{
                left: offsetX + i * cellSize + cellSize / 2,
                top: offsetY + BOARD_SIZE * cellSize + 10,
                transform: "translateX(-50%)",
              }}
            >
              {String.fromCharCode(65 + i)}
            </div>
            <div
              className="absolute text-white font-bold"
              style={{
                top: offsetY + i * cellSize + cellSize / 2,
                left: offsetX - 20,
                transform: "translateY(-50%)",
              }}
            >
              {8 - i}
            </div>
          </React.Fragment>
        ))}
      </>
    );
  }, [cellSize, offsetX, offsetY]);

  return (
    <div className="relative" style={{ width, height }}>
      <Board
        path={path}
        piecesInfo={piecesInfo}
        cellSize={cellSize}
        offsetX={offsetX}
        offsetY={offsetY}
        color={selectedPieceCoords?.color}
        handleSquareClick={handleSquareClick}
        BOARD_SIZE={BOARD_SIZE}
      />
      {renderPieces}
      {renderCoordinates}
    </div>
  );
};
