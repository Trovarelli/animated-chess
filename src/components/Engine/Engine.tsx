"use client";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BasicCoords, ChessboardContext } from "@/context";
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

  const { setTurn, turn, setGameOver, addMove } = useContext(GameContext);

  const [attackingPieceId, setAttackingPieceId] = useState<string | null>(null);
  const [dyingPieceId, setDyingPieceId] = useState<string | null>(null);
  const [dyingPiecePosition, setDyingPiecePosition] = useState<BasicCoords | null>(null);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

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

  useEffect(() => {
    const handleResetGame = () => {
      setPiecesInfo(defaultPiecesInfo);
      setSelectedPieceCoords(null);
      setPath([]);
      setAttackingPieceId(null);
      setDyingPieceId(null);
      setDyingPiecePosition(null);
      setIsAnimating(false);
    };
    window.addEventListener('resetGame', handleResetGame);
    return () => window.removeEventListener('resetGame', handleResetGame);
  }, [setPiecesInfo, setSelectedPieceCoords, setPath]);

  const handleSquareClick = useCallback(
    async (targetCoords: BasicCoords) => {
      if (!selectedPieceCoords || isAnimating) return;

      // Create notation for the move
      const fromCol = String.fromCharCode(97 + selectedPieceCoords.coords.x!);
      const fromRow = 8 - selectedPieceCoords.coords.y!;
      const toCol = String.fromCharCode(97 + targetCoords.x!);
      const toRow = 8 - targetCoords.y!;
      
      
      const capturedPiece = piecesInfo.find(
        (p) =>
          p.coords.x === targetCoords.x &&
          p.coords.y === targetCoords.y &&
          p.color !== selectedPieceCoords.color
      );

      // Standard chess notation symbols
      const pieceSymbols: Record<string, string> = {
        king: "K",
        queen: "Q",
        rook: "R",
        bishop: "B",
        knight: "N",
        pawn: "",
      };
      const pieceSymbol = pieceSymbols[selectedPieceCoords.type] || "";
      const captureSymbol = capturedPiece ? "x" : "";
      const notation = `${pieceSymbol}${fromCol}${fromRow}${captureSymbol}${toCol}${toRow}`;

      addMove({
        from: { row: selectedPieceCoords.coords.y!, col: selectedPieceCoords.coords.x! },
        to: { row: targetCoords.y!, col: targetCoords.x! },
        piece: selectedPieceCoords.type,
        captured: capturedPiece?.type,
        notation,
        timestamp: Date.now(),
      });

      if (capturedPiece) {
        setIsAnimating(true);
        setDyingPiecePosition({ x: targetCoords.x, y: targetCoords.y });

        setPiecesInfo((prev) =>
          prev.map((piece) =>
            piece.id === selectedPieceCoords.id
              ? {
                  ...piece,
                  coords: targetCoords,
                  ...(piece.type === "pawn" && { firstMove: false }),
                }
              : piece
          )
        );

        setSelectedPieceCoords(null);
        setPath([]);

        await new Promise(resolve => setTimeout(resolve, 300));

        setAttackingPieceId(selectedPieceCoords.id);
        await new Promise(resolve => setTimeout(resolve, 750));

        setDyingPieceId(capturedPiece.id);
        setAttackingPieceId(null);
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (capturedPiece.type === "king") {
          setGameOver({
            over: true,
            winner: {
              color: GetNegativeColor(capturedPiece.color),
              details: "Xeque-mate!",
            },
            looser: {
              color: capturedPiece.color,
              details: "Rei capturado",
            },
          });

          setPiecesInfo(defaultPiecesInfo);
          setDyingPieceId(null);
          setDyingPiecePosition(null);
          return;
        }

        setPiecesInfo((prev) =>
          prev.map((piece) =>
            piece.id === capturedPiece.id
              ? { ...piece, alive: false, coords: { x: null, y: null } }
              : piece
          )
        );

        setDyingPieceId(null);
        setDyingPiecePosition(null);

        setTurn(GetNegativeColor(selectedPieceCoords.color));
        setIsAnimating(false);
      } else {
        setPiecesInfo((prev) =>
          prev.map((piece) => {
            if (piece.id === selectedPieceCoords.id) {
              setTurn(GetNegativeColor(piece.color));
              return {
                ...piece,
                coords: targetCoords,
                ...(piece.type === "pawn" && { firstMove: false }),
              };
            }
            return piece;
          })
        );

        setSelectedPieceCoords(null);
        setPath([]);
      }
    },
    [
      selectedPieceCoords,
      setPiecesInfo,
      setSelectedPieceCoords,
      setPath,
      setGameOver,
      setTurn,
      addMove,
      piecesInfo,
    ]
  );

  const renderPieces = useMemo(() => {
    return (
      <AnimatePresence>
        {piecesInfo
          .filter((p) => p.alive && p.id !== dyingPieceId) // Filter out dying piece
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
            const isAttacking = attackingPieceId === piece.id;

            const handlePieceClick = () => {
              if (!isSelectable || !isYourTurn || isAnimating) return;
              setSelectedPieceCoords(piece);
            };

            return (
              <motion.div
                key={piece.id}
                initial={{ x: initialX, y: initialY }}
                animate={{ x: targetX, y: targetY }}
                transition={{ type: "tween", duration: 0.3 }}
                className="absolute"
                style={{ width: cellSize, height: cellSize }}
                onClick={handlePieceClick}
              >
                <ChessPiece
                  width={cellSize}
                  height={cellSize}
                  type={piece.type}
                  color={piece.color}
                  isYourTurn={isYourTurn}
                  isAttacking={isAttacking}
                  isMoving={false}
                  isHit={false}
                  isDead={!piece.alive}
                  isSelected={selectedPieceCoords?.id === piece.id}
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
    selectedPieceCoords?.id,
    setSelectedPieceCoords,
    attackingPieceId,
    dyingPieceId,
  ]);

  const renderDyingPiece = useMemo(() => {
    if (!dyingPieceId || !dyingPiecePosition) return null;

    const dyingPiece = piecesInfo.find((p) => p.id === dyingPieceId);
    if (!dyingPiece) return null;

    const x = offsetX + dyingPiecePosition.x! * cellSize;
    const y = offsetY + dyingPiecePosition.y! * cellSize;

    return (
      <motion.div
        key={`dying-${dyingPieceId}`}
        initial={{ x, y }}
        style={{
          position: "absolute",
          width: cellSize,
          height: cellSize,
        }}
      >
        <ChessPiece
          width={cellSize}
          height={cellSize}
          type={dyingPiece.type}
          color={dyingPiece.color}
          isYourTurn={false}
          isAttacking={false}
          isMoving={false}
          isHit={true}
          isDead={true}
          isSelected={false}
        />
      </motion.div>
    );
  }, [dyingPieceId, dyingPiecePosition, piecesInfo, cellSize, offsetX, offsetY]);

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
      {renderDyingPiece}
      {renderCoordinates}
    </div>
  );
};
