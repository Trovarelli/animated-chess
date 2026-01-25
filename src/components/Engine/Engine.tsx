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
import { BasicCoords, ChessboardContext, MappedCoords } from "@/context";
import { ChessPiece, defaultPiecesInfo } from "../ChessPiece";
import { EngineProps } from "./types";
import { GameContext } from "@/context/GameContext";
import { GetNegativeColor } from "@/utils/GetNegativeColor";
import { Board } from "./components/Board/Board";
import { useAnimationSequence } from "@/hooks";

export const Engine = ({ height, width }: EngineProps) => {
  const {
    path,
    setSelectedPieceCoords,
    setPiecesInfo,
    piecesInfo,
    setPath,
    selectedPieceCoords,
    enPassantTarget,
    setEnPassantTarget,
    isSquareUnderAttack,
    calculateRawPaths,
  } = useContext(ChessboardContext);

  const { setTurn, turn, setGameOver, addMove, setIsInCheck } = useContext(GameContext);

  const [attackingPieceId, setAttackingPieceId] = useState<string | null>(null);
  const [dyingPieceId, setDyingPieceId] = useState<string | null>(null);
  const [dyingPiecePosition, setDyingPiecePosition] = useState<BasicCoords | null>(null);
  const { isAnimating, runSequence } = useAnimationSequence();
  const [movingPieceId, setMovingPieceId] = useState<string | null>(null);
  const [pieceOffsets, setPieceOffsets] = useState<Record<string, { x: number, y: number }>>({});
  const [pieceFlipped, setPieceFlipped] = useState<Record<string, boolean>>({});

  const addMoveRef = useRef(addMove);

  useEffect(() => {
    addMoveRef.current = addMove;
  }, [addMove]);

  const BOARD_SIZE = 8;
  const cellSize = Math.min(width, height) / BOARD_SIZE;
  const offsetX = (width - BOARD_SIZE * cellSize) / 2;
  const offsetY = (height - BOARD_SIZE * cellSize) / 2;
  const previousPositions = useRef<Map<string, BasicCoords>>(new Map());

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
      setPieceOffsets({});
      setPieceFlipped({});
    };
    window.addEventListener('resetGame', handleResetGame);
    return () => window.removeEventListener('resetGame', handleResetGame);
  }, [setPiecesInfo, setSelectedPieceCoords, setPath]);

  const handleSquareClick = useCallback(
    async (targetCoords: BasicCoords) => {
      if (!selectedPieceCoords || isAnimating.current) return;

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

      if (capturedPiece) {
        const attackerColor = selectedPieceCoords.color;
        const attackerId = selectedPieceCoords.id;
        const targetId = capturedPiece.id;

        await runSequence([
          {
            // Step 1: Attacker moves to target square but slightly LEFT
            action: () => {
              setSelectedPieceCoords(null);
              setPath([]);
              setMovingPieceId(attackerId);
              previousPositions.current.set(attackerId, { ...selectedPieceCoords.coords });
              setPieceOffsets(prev => ({ ...prev, [attackerId]: { x: -25, y: 0 } }));
              // Ensure attacker looks RIGHT (not flipped)
              setPieceFlipped(prev => ({ ...prev, [attackerId]: false }));
              setPiecesInfo((prev) =>
                prev.map((p) =>
                  p.id === attackerId
                    ? { ...p, coords: targetCoords, firstMove: false }
                    : p
                )
              );
            },
            duration: 600,
          },
          {
            // Step 2: Target piece moves slightly RIGHT to give space
            action: () => {
              setMovingPieceId(null);
              setPieceOffsets(prev => ({ ...prev, [targetId]: { x: 25, y: 0 } }));
              // Target looks LEFT (flipped) to face attacker
              setPieceFlipped(prev => ({ ...prev, [targetId]: true }));
            },
            duration: 400,
          },
          {
            // Step 3: Attacker performs action of attack and moves to center
            action: () => {
              setAttackingPieceId(attackerId);
              setPieceOffsets(prev => ({ ...prev, [attackerId]: { x: 0, y: 0 } }));
            },
            duration: 600,
          },
          {
            // Step 4: Target plays HIT and then DEATH
            action: () => {
              setAttackingPieceId(null);
              setDyingPieceId(targetId);
              setDyingPiecePosition({ x: targetCoords.x, y: targetCoords.y });
            },
            duration: 1200,
          },
          {
            // Final cleanup
            action: () => {
              setDyingPieceId(null);
              setDyingPiecePosition(null);
              setPieceOffsets({});
              setPieceFlipped(prev => {
                const next = { ...prev };
                delete next[targetId]; // Clean up target flip
                return next;
              });
              setPiecesInfo((prev) =>
                prev.map((p) =>
                  p.id === targetId
                    ? { ...p, alive: false, coords: { x: null, y: null } }
                    : p
                )
              );
            },
            duration: 0,
          }
        ]);

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
          return;
        }

        setTurn(GetNegativeColor(attackerColor));
      } else {

        const attackerColor = selectedPieceCoords.color;
        const nextTurn = GetNegativeColor(attackerColor);

        // Handle normal Pawn promotion logic (simplification for now)
        const isPromotion = selectedPieceCoords.type === 'pawn' && (targetCoords.y === 0 || targetCoords.y === 7);
        // TODO: Show promotion dialog. For now, just keep it as a pawn.

        // Calculate new pieces state for checkmate detection
        let nextPiecesInfo = piecesInfo.map((p) => {
          if (p.id === selectedPieceCoords.id) {
            return {
              ...p,
              coords: targetCoords,
              firstMove: false,
              ...(isPromotion && { type: 'queen' as const })
            };
          }
          return p;
        });

        // Apply Castling to nextPiecesInfo
        if (selectedPieceCoords.type === "king" && Math.abs(targetCoords.x! - (selectedPieceCoords.coords.x ?? 0)) === 2) {
          const isKingside = targetCoords.x === 6;
          const rookX = isKingside ? 7 : 0;
          const rookTargetX = isKingside ? 5 : 3;
          nextPiecesInfo = nextPiecesInfo.map(p =>
            p.type === 'rook' && p.color === selectedPieceCoords.color && p.coords.x === rookX && p.coords.y === targetCoords.y
              ? { ...p, coords: { x: rookTargetX as MappedCoords, y: targetCoords.y }, firstMove: false }
              : p
          );
        }

        // Apply En Passant to nextPiecesInfo
        if (selectedPieceCoords.type === "pawn" && enPassantTarget && targetCoords.x === enPassantTarget.x && targetCoords.y === enPassantTarget.y) {
          const capturedPawnY = selectedPieceCoords.coords.y;
          nextPiecesInfo = nextPiecesInfo.map(p =>
            p.type === 'pawn' && p.color !== selectedPieceCoords.color && p.coords.x === targetCoords.x && p.coords.y === capturedPawnY
              ? { ...p, alive: false, coords: { x: null, y: null } }
              : p
          );
        }

        const nextEnPassantTarget = (selectedPieceCoords.type === 'pawn' && Math.abs(targetCoords.y! - (selectedPieceCoords.coords.y ?? 0)) === 2)
          ? { x: targetCoords.x, y: ((targetCoords.y! + (selectedPieceCoords.coords.y ?? 0)) / 2) as MappedCoords }
          : null;

        await runSequence([
          {
            action: () => {
              setMovingPieceId(selectedPieceCoords.id);
              previousPositions.current.set(selectedPieceCoords.id, { ...selectedPieceCoords.coords });
              
              // Flip piece if moving left
              if (targetCoords.x! < selectedPieceCoords.coords.x!) {
                setPieceFlipped(prev => ({ ...prev, [selectedPieceCoords.id]: true }));
              } else if (targetCoords.x! > selectedPieceCoords.coords.x!) {
                setPieceFlipped(prev => ({ ...prev, [selectedPieceCoords.id]: false }));
              }

              setPiecesInfo(nextPiecesInfo);
              setEnPassantTarget(nextEnPassantTarget);
            },
            duration: 500,
          },
          {
            action: () => setMovingPieceId(null),
            duration: 0,
          },
        ]);

        // Check for Game Over (Checkmate / Stalemate) for nextTurn
        const nextPlayerPieces = nextPiecesInfo.filter(p => p.alive && p.color === nextTurn);
        const hasLegalMoves = nextPlayerPieces.some(p => {
          const raw = calculateRawPaths(p, nextPiecesInfo, nextEnPassantTarget);
          // We need a version of calculateSafeMoves that accepts custom pieces
          // For now let's hope it uses the right state (it uses piecesInfo which is NOT updated yet)
          // Actually let's just inline the logic or use updated state
          return raw.some(target => {
            const tempPieces = nextPiecesInfo.map(tp => {
              if (tp.id === p.id) return { ...tp, coords: target };
              if (tp.coords.x === target.x && tp.coords.y === target.y && tp.color !== p.color) return { ...tp, alive: false, coords: { x: null, y: null } };
              return tp;
            });
            const king = tempPieces.find(tp => tp.type === 'king' && tp.color === nextTurn && tp.alive);
            if (!king) return false;
            return !isSquareUnderAttack(king.coords, attackerColor, tempPieces);
          });
        });

        const nextPlayerKing = nextPiecesInfo.find(p => p.alive && p.type === 'king' && p.color === nextTurn);
        const isInCheck = nextPlayerKing ? isSquareUnderAttack(nextPlayerKing.coords, attackerColor, nextPiecesInfo) : false;

        setIsInCheck(isInCheck);

        if (!hasLegalMoves) {
          setGameOver({
            over: true,
            winner: {
              color: isInCheck ? attackerColor : null,
              details: isInCheck ? "Checkmate" : "Stalemate",
            },
            looser: {
              color: isInCheck ? nextTurn : null,
              details: isInCheck ? "Checkmate" : "Stalemate",
            },
          });
        }

        const moveData = {
          from: { row: selectedPieceCoords.coords.y!, col: selectedPieceCoords.coords.x! },
          to: { row: targetCoords.y!, col: targetCoords.x! },
          piece: selectedPieceCoords.type,
          notation: isPromotion ? notation + "=Q" : notation,
          timestamp: Date.now(),
        };
        addMoveRef.current(moveData);

        setSelectedPieceCoords(null);
        setPath([]);

        setTurn(nextTurn);
      }
    },
    [
      selectedPieceCoords,
      isAnimating,
      setPiecesInfo,
      setSelectedPieceCoords,
      setPath,
      setGameOver,
      setTurn,
      piecesInfo,
      runSequence,
      enPassantTarget,
      setEnPassantTarget,
      isSquareUnderAttack,
      calculateRawPaths,
      setIsInCheck,
    ]
  );

  const renderPieces = useMemo(() => {
    return (
      <AnimatePresence>
        {piecesInfo
          .filter((p) => p.alive && p.id !== dyingPieceId)
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
            const isMoving = movingPieceId === piece.id;

            const offset = pieceOffsets[piece.id] || { x: 0, y: 0 };

            const handlePieceClick = () => {
              if (!isSelectable || !isYourTurn || isAnimating.current) return;
              setSelectedPieceCoords(piece);
            };

            return (
              <motion.div
                key={piece.id}
                initial={{ x: initialX, y: initialY }}
                animate={{ 
                  x: targetX + offset.x,
                  y: targetY + offset.y
                }}
                transition={{ type: "tween", duration: 0.5, ease: "linear" }}
                className="absolute select-none outline-none no-select"
                data-row={piece.coords.y}
                data-col={piece.coords.x}
                data-piece-type={piece.type}
                data-piece-color={piece.color}
                data-piece-id={piece.id}
                data-selected={selectedPieceCoords?.id === piece.id}
                data-testid="piece"
                style={{ 
                  width: cellSize, 
                  height: cellSize,
                  zIndex: isMoving || isAttacking ? 10 : 1,
                }}
                onClick={handlePieceClick}
              >
                <ChessPiece
                  width={cellSize}
                  height={cellSize}
                  type={piece.type}
                  color={piece.color}
                  isYourTurn={isYourTurn}
                  isAttacking={isAttacking}
                  isMoving={isMoving}
                  isHit={false}
                  isDead={!piece.alive}
                  isSelected={selectedPieceCoords?.id === piece.id}
                  isFlipped={pieceFlipped[piece.id]}
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
    movingPieceId,
    pieceOffsets,
    pieceFlipped,
    isAnimating,
  ]);

  const renderDyingPiece = useMemo(() => {
    if (!dyingPieceId || !dyingPiecePosition) return null;

    const dyingPiece = piecesInfo.find((p) => p.id === dyingPieceId);
    if (!dyingPiece) return null;

    const x = offsetX + dyingPiecePosition.x! * cellSize;
    const y = offsetY + dyingPiecePosition.y! * cellSize;
    const offset = pieceOffsets[dyingPieceId] || { x: 0, y: 0 };

    return (
      <motion.div
        key={`dying-${dyingPieceId}`}
        initial={{ x: x + offset.x, y: y + offset.y }}
        animate={{ x: x + offset.x, y: y + offset.y }}
        style={{
          position: "absolute",
          width: cellSize,
          height: cellSize,
          zIndex: 5,
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
          isFlipped={pieceFlipped[dyingPieceId]}
        />
      </motion.div>
    );
  }, [dyingPieceId, dyingPiecePosition, piecesInfo, cellSize, offsetX, offsetY, pieceOffsets, pieceFlipped]);


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
    </div>
  );
};
