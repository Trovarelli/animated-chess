"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChessboardContext } from "./context";
import { BasicCoords, ChessboardContextProviderProps, MappedCoords } from "./types";
import { PiecesInfo } from "@/components/ChessPiece/types";
import { defaultPiecesInfo } from "@/components/ChessPiece/defaultPositions";
import { gameStorage } from "@/utils/gameStorage";

export const ChessboardContextProvider = ({
  children,
}: ChessboardContextProviderProps) => {
  const savedState = useRef(gameStorage.load());

  const [selectedPieceCoords, setSelectedPieceCoords] =
    useState<PiecesInfo | null>(null);
  const [piecesInfo, setPiecesInfo] = useState<PiecesInfo[]>(
    savedState.current?.piecesInfo?.length ? savedState.current.piecesInfo : defaultPiecesInfo
  );
  const [path, setPath] = useState<BasicCoords[]>([]);
  const [enPassantTarget, setEnPassantTarget] = useState<BasicCoords | null>(
    savedState.current?.enPassantTarget ?? null
  );

  const convertToChessCoords = ({ x, y }: BasicCoords) => {
    if (x === null || y === null) return "";
    const alfabeticCoords = ["A", "B", "C", "D", "E", "F", "G", "H"];
    if (x < 0 || x >= alfabeticCoords.length) return "";
    const coord = alfabeticCoords[x];
    if (!coord) return "";
    const numberCoords = 8 - y;
    return `${coord}${numberCoords}`;
  };

  const convertFromChessCoords = (coords: string) => {
    if (!coords || coords.length < 2) return { x: 0, y: 0 } as BasicCoords;
    const alfabeticCoords = ["A", "B", "C", "D", "E", "F", "G", "H"];

    const x = alfabeticCoords.indexOf(coords[0].toUpperCase());
    const y = 8 - Number(coords[1]);

    return { x: x as MappedCoords, y: y as MappedCoords } as BasicCoords;
  };



  const isSquareUnderAttack = useCallback(
    (coords: BasicCoords, attackerColor: "black" | "white", customPiecesInfo?: PiecesInfo[]) => {
      if (coords.x === null || coords.y === null) return false;
      const pieces = customPiecesInfo || piecesInfo;

      return pieces
        .filter((p) => p.alive && p.color === attackerColor)
        .some((piece) => {
          if (piece.coords.x === null || piece.coords.y === null) return false;
          const { x, y } = piece.coords;

          switch (piece.type) {
            case "pawn": {
              const direction = piece.color === "white" ? -1 : 1;
              return (
                coords.y === y + direction &&
                (coords.x === x - 1 || coords.x === x + 1)
              );
            }
            case "knight": {
              const moves = [
                { x: x + 1, y: y + 2 }, { x: x - 1, y: y + 2 },
                { x: x + 1, y: y - 2 }, { x: x - 1, y: y - 2 },
                { x: x + 2, y: y + 1 }, { x: x - 2, y: y + 1 },
                { x: x + 2, y: y - 1 }, { x: x - 2, y: y - 1 },
              ];
              return moves.some((m) => m.x === coords.x && m.y === coords.y);
            }
            case "king": {
              const moves = [
                { x: x + 1, y: y + 1 }, { x: x - 1, y: y + 1 },
                { x: x + 1, y: y - 1 }, { x: x - 1, y: y - 1 },
                { x: x + 1, y: y + 0 }, { x: x - 1, y: y + 0 },
                { x: x + 0, y: y + 1 }, { x: x + 0, y: y - 1 },
              ];
              return moves.some((m) => m.x === coords.x && m.y === coords.y);
            }
            case "bishop":
            case "rook":
            case "queen": {
              const directions: { x: number; y: number }[] = [];
              if (piece.type === "bishop" || piece.type === "queen") {
                directions.push({ x: 1, y: 1 }, { x: -1, y: 1 }, { x: 1, y: -1 }, { x: -1, y: -1 });
              }
              if (piece.type === "rook" || piece.type === "queen") {
                directions.push({ x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 });
              }

              return directions.some((dir) => {
                let step = 1;
                while (true) {
                  const checkPos = { x: x + dir.x * step, y: y + dir.y * step };
                  if (checkPos.x < 0 || checkPos.x > 7 || checkPos.y < 0 || checkPos.y > 7) break;
                  if (checkPos.x === coords.x && checkPos.y === coords.y) return true;
                  
                  if (pieces.some(p => p.alive && p.coords.x === checkPos.x && p.coords.y === checkPos.y)) break;
                  step++;
                }
                return false;
              });
            }
            default:
              return false;
          }
        });
    },
    [piecesInfo]
  );
  const calculateSafeMoves = useCallback(
    (piece: PiecesInfo, rawPaths: BasicCoords[]) => {
      return rawPaths.filter((target) => {
        const newPiecesInfo = piecesInfo.map((p) => {
          if (p.id === piece.id) return { ...p, coords: { x: target.x, y: target.y } };
          if (p.coords.x === target.x && p.coords.y === target.y && p.color !== piece.color) {
            return { ...p, alive: false, coords: { x: null, y: null } };
          }
          if (piece.type === 'pawn' && target.x !== piece.coords.x && !piecesInfo.some(ap => ap.alive && ap.coords.x === target.x && ap.coords.y === target.y)) {
             if (p.coords.x === target.x && p.coords.y === piece.coords.y && p.type === 'pawn' && p.color !== piece.color) {
               return { ...p, alive: false, coords: { x: null, y: null } };
             }
          }
          return p;
        });
        const king = newPiecesInfo.find((p) => p.type === "king" && p.color === piece.color && p.alive);
        if (!king) return false;
        const opponentColor = piece.color === "white" ? "black" : "white";
        return !isSquareUnderAttack(king.coords, opponentColor, newPiecesInfo);
      });
    },
    [piecesInfo, isSquareUnderAttack]
  );

  const calculateRawPaths = useCallback(
    (piece: PiecesInfo, currentPieces: PiecesInfo[], customEnPassantTarget?: BasicCoords | null) => {
      if (piece.coords.x === null || piece.coords.y === null) return [];
      const { x, y } = piece.coords;
      const calculatedPaths: BasicCoords[] = [];
      const epTarget = customEnPassantTarget !== undefined ? customEnPassantTarget : enPassantTarget;

      const isValidCoord = (coord: BasicCoords) => {
        if (coord.x === null || coord.y === null) return false;
        return coord.x >= 0 && coord.x < 8 && coord.y >= 0 && coord.y < 8;
      };

      const isEmptyCellLocal = (coords: BasicCoords, condition: "enemyOnly" | "any" = "any") => {
        const pieceAtCoord = currentPieces.find(
          (el) => el.alive && el.coords.x === coords.x && el.coords.y === coords.y
        );
        if (condition === "enemyOnly") {
          return pieceAtCoord ? pieceAtCoord.color !== piece.color : false;
        }
        return !pieceAtCoord;
      };

      const isOwnPieceLocal = (coords: BasicCoords) => {
        return currentPieces.some(
          (el) => el.alive && el.coords.x === coords.x && el.coords.y === coords.y && el.color === piece.color
        );
      };

      switch (piece.type) {
        case "pawn": {
          const direction = piece.color === "white" ? -1 : 1;
          const forwardOne = { x, y: (y + direction) as MappedCoords };
          if (isValidCoord(forwardOne) && isEmptyCellLocal(forwardOne)) {
            calculatedPaths.push(forwardOne);
            if (piece.firstMove) {
              const forwardTwo = { x, y: (y + direction * 2) as MappedCoords };
              if (isValidCoord(forwardTwo) && isEmptyCellLocal(forwardTwo)) {
                calculatedPaths.push(forwardTwo);
              }
            }
          }

          const captures = [
            { x: (x - 1) as MappedCoords, y: (y + direction) as MappedCoords },
            { x: (x + 1) as MappedCoords, y: (y + direction) as MappedCoords },
          ];
          captures.forEach((cap) => {
            if (isValidCoord(cap) && !isEmptyCellLocal(cap) && !isOwnPieceLocal(cap)) {
              calculatedPaths.push(cap);
            }
          });

          if (epTarget && epTarget.x !== null && epTarget.y !== null) {
            const targetRow = y + direction;
            if (targetRow === epTarget.y && Math.abs(x - epTarget.x) === 1) {
              calculatedPaths.push(epTarget);
            }
          }
          break;
        }
        case "knight": {
          const knightMoves = [
            { x: x + 1, y: y + 2 }, { x: x - 1, y: y + 2 },
            { x: x + 1, y: y - 2 }, { x: x - 1, y: y - 2 },
            { x: x + 2, y: y + 1 }, { x: x - 2, y: y + 1 },
            { x: x + 2, y: y - 1 }, { x: x - 2, y: y - 1 },
          ];
          knightMoves.forEach((move) => {
            if (isValidCoord(move as BasicCoords) && !isOwnPieceLocal(move as BasicCoords)) {
              calculatedPaths.push(move as BasicCoords);
            }
          });
          break;
        }
        case "bishop":
        case "rook":
        case "queen": {
          const directions: { x: number; y: number }[] = [];
          if (piece.type === "bishop" || piece.type === "queen") directions.push({ x: 1, y: 1 }, { x: -1, y: 1 }, { x: 1, y: -1 }, { x: -1, y: -1 });
          if (piece.type === "rook" || piece.type === "queen") directions.push({ x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 });
          directions.forEach((dir) => {
            let step = 1;
            while (true) {
              const target = { x: x + dir.x * step, y: y + dir.y * step } as BasicCoords;
              if (!isValidCoord(target)) break;
              if (isEmptyCellLocal(target)) {
                calculatedPaths.push(target);
              } else {
                if (!isOwnPieceLocal(target)) {
                  calculatedPaths.push(target);
                }
                break;
              }
              step++;
            }
          });
          break;
        }
        case "king": {
          const moves = [
            { x: x + 1, y: y + 1 }, { x: x - 1, y: y + 1 },
            { x: x + 1, y: y - 1 }, { x: x - 1, y: y - 1 },
            { x: x, y: y + 1 }, { x: x, y: y - 1 },
            { x: x + 1, y: y }, { x: x - 1, y: y },
          ];
          moves.forEach((move) => {
            if (isValidCoord(move as BasicCoords) && !isOwnPieceLocal(move as BasicCoords)) {
              calculatedPaths.push(move as BasicCoords);
            }
          });

          if (piece.firstMove) {
            const opponentColor = piece.color === "white" ? "black" : "white";
            const piecesForAttackCheck = currentPieces;
            
            const rookShort = piecesForAttackCheck.find(p => p.alive && p.type === "rook" && p.color === piece.color && p.firstMove && p.coords.x === 7 && p.coords.y === y);
            if (rookShort && isEmptyCellLocal({ x: 5, y } as BasicCoords) && isEmptyCellLocal({ x: 6, y } as BasicCoords) && !isSquareUnderAttack({ x: 4, y } as BasicCoords, opponentColor, piecesForAttackCheck) && !isSquareUnderAttack({ x: 5, y } as BasicCoords, opponentColor, piecesForAttackCheck) && !isSquareUnderAttack({ x: 6, y } as BasicCoords, opponentColor, piecesForAttackCheck)) {
              calculatedPaths.push({ x: 6, y } as BasicCoords);
            }

            const rookLong = piecesForAttackCheck.find(p => p.alive && p.type === "rook" && p.color === piece.color && p.firstMove && p.coords.x === 0 && p.coords.y === y);
            if (rookLong && isEmptyCellLocal({ x: 3, y } as BasicCoords) && isEmptyCellLocal({ x: 2, y } as BasicCoords) && isEmptyCellLocal({ x: 1, y } as BasicCoords) && !isSquareUnderAttack({ x: 4, y } as BasicCoords, opponentColor, piecesForAttackCheck) && !isSquareUnderAttack({ x: 3, y } as BasicCoords, opponentColor, piecesForAttackCheck) && !isSquareUnderAttack({ x: 2, y } as BasicCoords, opponentColor, piecesForAttackCheck)) {
              calculatedPaths.push({ x: 2, y } as BasicCoords);
            }
          }
          break;
        }
      }
      return calculatedPaths;
    },
    [enPassantTarget, isSquareUnderAttack]
  );


  const handleSetPathForPiece = useCallback(
    (piece: PiecesInfo) => {
      const rawPaths = calculateRawPaths(piece, piecesInfo);
      const safePaths = calculateSafeMoves(piece, rawPaths);
      setPath(safePaths);
    },
    [piecesInfo, calculateRawPaths, calculateSafeMoves]
  );



  useEffect(() => {
    if (
      selectedPieceCoords?.coords.x === null ||
      selectedPieceCoords?.coords.y === null ||
      !selectedPieceCoords
    )
      setPath([]);
    else handleSetPathForPiece(selectedPieceCoords);
  }, [handleSetPathForPiece, selectedPieceCoords]);

  useEffect(() => {
    const currentPersisted = gameStorage.load();
    if (!currentPersisted?.playerFaction) return;

    gameStorage.save({
      ...currentPersisted,
      piecesInfo,
      enPassantTarget,
    });
  }, [piecesInfo, enPassantTarget]);

  return (
    <ChessboardContext.Provider
      value={{
        selectedPieceCoords,
        path,
        setPath,
        setSelectedPieceCoords,
        convertToChessCoords,
        convertFromChessCoords,
        piecesInfo,
        setPiecesInfo,
        enPassantTarget,
        setEnPassantTarget,
        isSquareUnderAttack,
        calculateSafeMoves,
        calculateRawPaths,
      }}
    >
      {children}
    </ChessboardContext.Provider>
  );
};
