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
import { ChessPiece, defaultPiecesInfo, PiecesInfo } from "../ChessPiece";
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

  const { setTurn, turn, setGameOver, addMove, setIsInCheck, isInCheck, moveHistory } = useContext(GameContext);

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

      let capturedPiece = piecesInfo.find(
        (p) =>
          p.coords.x === targetCoords.x &&
          p.coords.y === targetCoords.y &&
          p.color !== selectedPieceCoords.color
      );

      if (selectedPieceCoords.type === 'pawn' && enPassantTarget && targetCoords.x === enPassantTarget.x && targetCoords.y === enPassantTarget.y) {
          const direction = selectedPieceCoords.color === 'white' ? -1 : 1;
          capturedPiece = piecesInfo.find(p => p.coords.x === targetCoords.x && p.coords.y === targetCoords.y! - direction && p.color !== selectedPieceCoords.color);
      }

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

      const completeMove = async (
        piece: PiecesInfo,
        nextPiecesInfo: PiecesInfo[],
        nextEP: BasicCoords | null,
        isPromotion: boolean,
        target: BasicCoords
      ) => {
        const attackerColor = piece.color;
        const nextTurn = GetNegativeColor(attackerColor);

        setPiecesInfo(nextPiecesInfo);
        setEnPassantTarget(nextEP);

        const nextPlayerPieces = nextPiecesInfo.filter(p => p.alive && p.color === nextTurn);
        const hasLegalMoves = nextPlayerPieces.some(p => {
          const raw = calculateRawPaths(p, nextPiecesInfo, nextEP);
          return raw.some(targetPos => {
            const tempPieces = nextPiecesInfo.map(tp => {
              if (tp.id === p.id) return { ...tp, coords: targetPos };
              if (tp.coords.x === targetPos.x && tp.coords.y === targetPos.y && tp.color !== p.color) 
                  return { ...tp, alive: false, coords: { x: null, y: null } };
              
              if (p.type === 'pawn' && targetPos.x !== p.coords.x && !nextPiecesInfo.some(ap => ap.alive && ap.coords.x === targetPos.x && ap.coords.y === targetPos.y)) {
                if (tp.coords.x === targetPos.x && tp.coords.y === p.coords.y && tp.type === 'pawn' && tp.color !== p.color) {
                    return { ...tp, alive: false, coords: { x: null, y: null } };
                }
              }
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
          from: { row: piece.coords.y!, col: piece.coords.x! },
          to: { row: target.y!, col: target.x! },
          piece: piece.type,
          notation: isPromotion ? notation + "=Q" : notation,
          timestamp: Date.now(),
        };
        addMoveRef.current(moveData);

        setSelectedPieceCoords(null);
        setPath([]);
        setTurn(nextTurn);
      };

      if (capturedPiece) {
        const attackerId = selectedPieceCoords.id;
        const attackerPiece = { ...selectedPieceCoords };
        const targetId = capturedPiece.id;
        const isPromotion = selectedPieceCoords.type === 'pawn' && (targetCoords.y === 0 || targetCoords.y === 7);

        const nextPiecesInfoAfterCapture = piecesInfo.map((p) => {
          if (p.id === attackerId) {
            return { 
                ...p, 
                coords: targetCoords, 
                firstMove: false,
                ...(isPromotion && { type: 'queen' as const })
              };
          }
          if (p.id === targetId) {
            return { ...p, alive: false, coords: { x: null, y: null } };
          }
          return p;
        });

        await runSequence([
          {
            action: () => {
              setSelectedPieceCoords(null);
              setPath([]);
              setMovingPieceId(attackerId);
              previousPositions.current.set(attackerId, { ...attackerPiece.coords });
              setPieceOffsets(prev => ({ ...prev, [attackerId]: { x: -25, y: 0 } }));
              setPieceFlipped(prev => ({ ...prev, [attackerId]: false }));
              setPiecesInfo(prev => prev.map(p => p.id === attackerId ? { ...p, coords: targetCoords, firstMove: false } : p));
            },
            duration: 600,
          },
          {
            action: () => {
              setMovingPieceId(null);
              setPieceOffsets(prev => ({ ...prev, [targetId]: { x: 25, y: 0 } }));
              setPieceFlipped(prev => ({ ...prev, [targetId]: true }));
            },
            duration: 400,
          },
          {
            action: () => {
              setAttackingPieceId(attackerId);
              setPieceOffsets(prev => ({ ...prev, [attackerId]: { x: 0, y: 0 } }));
            },
            duration: 600,
          },
          {
            action: () => {
              setAttackingPieceId(null);
              setDyingPieceId(targetId);
              setDyingPiecePosition({ x: targetCoords.x, y: targetCoords.y });
            },
            duration: 1200,
          },
          {
            action: () => {
              setDyingPieceId(null);
              setDyingPiecePosition(null);
              setPieceOffsets({});
              setPieceFlipped(prev => {
                const next = { ...prev };
                delete next[targetId];
                return next;
              });
              completeMove(attackerPiece, nextPiecesInfoAfterCapture, null, isPromotion, targetCoords);
            },
            duration: 0,
          }
        ]);
      } else {
        const attackerId = selectedPieceCoords.id;
        const attackerPiece = { ...selectedPieceCoords };
        const isPromotion = selectedPieceCoords.type === 'pawn' && (targetCoords.y === 0 || targetCoords.y === 7);

        let nextPiecesInfo = piecesInfo.map((p) => {
          if (p.id === attackerId) {
            return {
              ...p,
              coords: targetCoords,
              firstMove: false,
              ...(isPromotion && { type: 'queen' as const })
            };
          }
          return p;
        });

        let castlingRookId: string | null = null;
        if (attackerPiece.type === "king" && Math.abs(targetCoords.x! - (attackerPiece.coords.x ?? 0)) === 2) {
          const isKingside = targetCoords.x === 6;
          const rookX = isKingside ? 7 : 0;
          const rookTargetX = isKingside ? 5 : 3;
          
          nextPiecesInfo = nextPiecesInfo.map(p => {
            if (p.type === 'rook' && p.color === attackerPiece.color && p.coords.x === rookX && p.coords.y === targetCoords.y) {
               castlingRookId = p.id;
               return { ...p, coords: { x: rookTargetX as MappedCoords, y: targetCoords.y }, firstMove: false };
            }
            return p;
          });
        }
        
        const nextEnPassantTarget = (attackerPiece.type === 'pawn' && Math.abs(targetCoords.y! - (attackerPiece.coords.y ?? 0)) === 2)
          ? { x: targetCoords.x, y: ((targetCoords.y! + (attackerPiece.coords.y ?? 0)) / 2) as MappedCoords }
          : null;

        await runSequence([
          {
            action: () => {
              setSelectedPieceCoords(null);
              setPath([]);
              setMovingPieceId(attackerId);
              previousPositions.current.set(attackerId, { ...attackerPiece.coords });
              
              if (castlingRookId) {
                   const rookPiece = piecesInfo.find(p => p.id === castlingRookId);
                   if (rookPiece) previousPositions.current.set(castlingRookId, { ...rookPiece.coords });
              }

              if (targetCoords.x! < attackerPiece.coords.x!) {
                setPieceFlipped(prev => ({ ...prev, [attackerId]: true }));
              } else if (targetCoords.x! > attackerPiece.coords.x!) {
                setPieceFlipped(prev => ({ ...prev, [attackerId]: false }));
              }
              setPiecesInfo(nextPiecesInfo);
              setEnPassantTarget(nextEnPassantTarget);
            },
            duration: 500,
          },
          {
            action: () => {
              setMovingPieceId(null);
              completeMove(attackerPiece, nextPiecesInfo, nextEnPassantTarget, isPromotion, targetCoords);
            },
            duration: 0,
          },
        ]);
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

            const handlePieceClick = (e: React.MouseEvent) => {
              e.stopPropagation();
              if (isAnimating.current) return;
              if (!isSelectable) {
                handleSquareClick(piece.coords);
                return;
              }
              if (isYourTurn) {
                setSelectedPieceCoords(piece);
              }
            };

            const isKingInCheck = isInCheck && piece.type === 'king' && piece.color === turn;

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
                  cursor: isYourTurn ? "pointer" : "default",
                }}
                onClick={(e) => handlePieceClick(e)}
              >
                {isKingInCheck && (
                  <>
                    <div className="absolute inset-0 z-[-1] rounded-full animate-ping bg-red-600/50 pointer-events-none mix-blend-screen" />
                    <div className="absolute inset-0 z-[-1] rounded-full shadow-[0_0_30px_10px_rgba(220,38,38,0.6)] bg-red-500/20 pointer-events-none mix-blend-screen" />
                  </>
                )}

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
    handleSquareClick,
    isInCheck,
  ]);

  const [shake, setShake] = useState(false);
  const [bloodParticles, setBloodParticles] = useState<{id: number, x: number, y: number}[]>([]);
  
  const triggerCaptureFX = useCallback((coords: BasicCoords) => {
      setShake(true);
      setTimeout(() => setShake(false), 300);

      const newParticles = Array.from({ length: 12 }).map((_, i) => ({
          id: Date.now() + i,
          x: coords.x!,
          y: coords.y!
      }));
      setBloodParticles(prev => [...prev, ...newParticles]);
      
      setTimeout(() => {
          setBloodParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
      }, 1000);
  }, []);

  const prevHistoryLen = useRef(moveHistory.length);
  useEffect(() => {
      if (moveHistory.length > prevHistoryLen.current) {
          const lastMove = moveHistory[moveHistory.length - 1];
          if (lastMove.captured) { 
              triggerCaptureFX({ 
                x: lastMove.to.col as MappedCoords, 
                y: lastMove.to.row as MappedCoords 
              });
          }
          prevHistoryLen.current = moveHistory.length;
      }
  }, [moveHistory, triggerCaptureFX]);

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
    <div 
      className={`relative select-none overflow-hidden ${shake ? "animate-shake" : ""}`} 
      style={{ width, height, contain: 'layout paint' }}
    >
      <AnimatePresence>
        {bloodParticles.map((p) => (
             <motion.div
                key={p.id}
                initial={{ x: offsetX + p.x * cellSize + cellSize/2, y: offsetY + p.y * cellSize + cellSize/2, scale: 0, opacity: 1 }}
                animate={{ 
                    x: offsetX + p.x * cellSize + cellSize/2 + (Math.random() - 0.5) * 150, 
                    y: offsetY + p.y * cellSize + cellSize/2 + (Math.random() - 0.5) * 150, 
                    scale: [1, 2, 0], 
                    opacity: 0 
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute w-2 h-2 bg-red-600 rounded-full z-50 pointer-events-none"
             />
        ))}
      </AnimatePresence>
      <Board
          BOARD_SIZE={BOARD_SIZE}
          cellSize={cellSize}
          handleSquareClick={handleSquareClick}
          offsetX={offsetX}
          offsetY={offsetY}
          path={path}
          piecesInfo={piecesInfo}
          turn={turn}
          isInCheck={isInCheck}
          lastMove={moveHistory[moveHistory.length - 1]}
          selectedPieceCoords={selectedPieceCoords}
        />
      {renderPieces}
      {renderDyingPiece}
    </div>
  );
};
