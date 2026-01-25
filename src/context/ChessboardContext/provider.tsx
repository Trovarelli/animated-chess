"use client";
import { useCallback, useEffect, useState } from "react";
import { ChessboardContext } from "./context";
import { BasicCoords, ChessboardContextProviderProps } from "./types";
import { PiecesInfo } from "@/components/ChessPiece/types";
import { defaultPiecesInfo } from "@/components/ChessPiece/defaultPositions";

export const ChessboardContextProvider = ({
  children,
}: ChessboardContextProviderProps) => {
  const [selectedPieceCoords, setSelectedPieceCoords] =
    useState<PiecesInfo | null>(null);
  const [piecesInfo, setPiecesInfo] = useState<PiecesInfo[]>(defaultPiecesInfo);
  const [path, setPath] = useState<BasicCoords[]>([]);
  const [enPassantTarget, setEnPassantTarget] = useState<BasicCoords | null>(null);

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

    const x = alfabeticCoords.indexOf(coords[0]);
    const y = Number(coords[1]) - 1;

    return { x, y } as BasicCoords;
  };



  const isSquareUnderAttack = useCallback(
    (coords: BasicCoords, attackerColor: "black" | "white", customPiecesInfo?: PiecesInfo[]) => {
      if (coords.x === null || coords.y === null) return false;
      const pieces = customPiecesInfo || piecesInfo;

      // Check all pieces of the attacker color to see if they can move to this square
      return pieces
        .filter((p) => p.alive && p.color === attackerColor)
        .some((piece) => {
          if (piece.coords.x === null || piece.coords.y === null) return false;
          const { x, y } = piece.coords;

          switch (piece.type) {
            case "pawn": {
              const direction = piece.color === "white" ? 1 : -1;
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
                  
                  // Blocks if there's a piece (UNLESS it's the target square we are checking)
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
             if (p.coords.x === target.x && p.coords.y === piece.coords.y) {
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

      const isEmptyCell = (coords: BasicCoords, condition: "enemyOnly" | "any" = "any") => {
        const pieceAtCoord = currentPieces.find(
          (el) => el.alive && el.coords.x === coords.x && el.coords.y === coords.y
        );
        if (condition === "enemyOnly") {
          return pieceAtCoord ? pieceAtCoord.color !== piece.color : false;
        }
        return !pieceAtCoord;
      };

      switch (piece.type) {
        case "pawn": {
          const direction = piece.color === "white" ? 1 : -1;
          const forwardOne = { x, y: (y + direction) as BasicCoords["y"] };
          if (isValidCoord(forwardOne) && isEmptyCell(forwardOne)) {
            calculatedPaths.push(forwardOne);
            if (piece.firstMove) {
              const forwardTwo = { x, y: (y + direction * 2) as BasicCoords["y"] };
              if (isValidCoord(forwardTwo) && isEmptyCell(forwardTwo)) {
                calculatedPaths.push(forwardTwo);
              }
            }
          }
          const diagonalLeft = { x: x - 1, y: y + direction } as BasicCoords;
          if (isValidCoord(diagonalLeft) && isEmptyCell(diagonalLeft, "enemyOnly")) {
            calculatedPaths.push(diagonalLeft);
          }
          const diagonalRight = { x: x + 1, y: y + direction } as BasicCoords;
          if (isValidCoord(diagonalRight) && isEmptyCell(diagonalRight, "enemyOnly")) {
            calculatedPaths.push(diagonalRight);
          }
          if (epTarget && epTarget.x !== null && epTarget.y !== null) {
            if ((x - 1 === epTarget.x && y + direction === epTarget.y) || (x + 1 === epTarget.x && y + direction === epTarget.y)) {
              calculatedPaths.push(epTarget);
            }
          }
          break;
        }
        case "knight": {
          const knightMoves = [{ x: x + 1, y: y + 2 }, { x: x - 1, y: y + 2 }, { x: x + 1, y: y - 2 }, { x: x - 1, y: y - 2 }, { x: x + 2, y: y + 1 }, { x: x - 2, y: y + 1 }, { x: x + 2, y: y - 1 }, { x: x - 2, y: y - 1 }];
          knightMoves.forEach((move) => {
            if (isValidCoord(move as BasicCoords) && (isEmptyCell(move as BasicCoords) || isEmptyCell(move as BasicCoords, "enemyOnly"))) {
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
              const newPos = { x: x + dir.x * step, y: y + dir.y * step } as BasicCoords;
              if (!isValidCoord(newPos)) break;
              if (isEmptyCell(newPos)) {
                calculatedPaths.push(newPos);
              } else {
                if (isEmptyCell(newPos, "enemyOnly")) calculatedPaths.push(newPos);
                break;
              }
              step++;
            }
          });
          break;
        }
        case "king": {
          const kingDirections = [{ x: 1, y: 1 }, { x: -1, y: 1 }, { x: 1, y: -1 }, { x: -1, y: -1 }, { x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }];
          kingDirections.forEach((dir) => {
            const newPos = { x: x + dir.x, y: y + dir.y } as BasicCoords;
            if (isValidCoord(newPos) && (isEmptyCell(newPos) || isEmptyCell(newPos, "enemyOnly"))) {
              calculatedPaths.push(newPos);
            }
          });
          if (piece.firstMove) {
            const opponentColor = piece.color === "white" ? "black" : "white";
            const piecesForAttackCheck = currentPieces;
            
            // Short Castling
            const rookShort = piecesForAttackCheck.find(p => p.alive && p.type === "rook" && p.color === piece.color && p.firstMove && p.coords.x === 7 && p.coords.y === y);
            if (rookShort && isEmptyCell({ x: 5, y } as BasicCoords) && isEmptyCell({ x: 6, y } as BasicCoords) && !isSquareUnderAttack({ x: 4, y } as BasicCoords, opponentColor, piecesForAttackCheck) && !isSquareUnderAttack({ x: 5, y } as BasicCoords, opponentColor, piecesForAttackCheck) && !isSquareUnderAttack({ x: 6, y } as BasicCoords, opponentColor, piecesForAttackCheck)) {
              calculatedPaths.push({ x: 6, y } as BasicCoords);
            }
            // Long Castling
            const rookLong = piecesForAttackCheck.find(p => p.alive && p.type === "rook" && p.color === piece.color && p.firstMove && p.coords.x === 0 && p.coords.y === y);
            if (rookLong && isEmptyCell({ x: 1, y } as BasicCoords) && isEmptyCell({ x: 2, y } as BasicCoords) && isEmptyCell({ x: 3, y } as BasicCoords) && !isSquareUnderAttack({ x: 4, y } as BasicCoords, opponentColor, piecesForAttackCheck) && !isSquareUnderAttack({ x: 3, y } as BasicCoords, opponentColor, piecesForAttackCheck) && !isSquareUnderAttack({ x: 2, y } as BasicCoords, opponentColor, piecesForAttackCheck)) {
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
