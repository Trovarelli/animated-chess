"use client";
import { useCallback, useEffect, useState } from "react";
import { ChessboardContext } from "./contex";
import { BasicCoords, ChessboardContextProviderProps } from "./types";
import { defaultPiecesInfo, PiecesInfo } from "@/components";

export const ChessboardContextProvider = ({
  children,
}: ChessboardContextProviderProps) => {
  const [selectedPieceCoords, setSelectedPieceCoords] =
    useState<PiecesInfo | null>(null);
  const [piecesInfo, setPiecesInfo] = useState<PiecesInfo[]>(defaultPiecesInfo);
  const [path, setPath] = useState<BasicCoords[]>([]);

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

  const handleVerifyIsEmptyCell = useCallback(
    (
      { coords, color }: Pick<PiecesInfo, "coords" | "color">,
      condition: "enemyOnly" | "any" = "any"
    ) => {
      if (coords.x === null || coords.y === null) return false;
      if (coords.x < 0 || coords.x > 7 || coords.y < 0 || coords.y > 7)
        return false;

      const pieceAtCoord = piecesInfo.find(
        (el) => el.coords.x === coords.x && el.coords.y === coords.y
      );

      if (condition === "enemyOnly") {
        return pieceAtCoord ? pieceAtCoord.color !== color : false;
      }
      return !pieceAtCoord;
    },
    [piecesInfo]
  );

  const handleSetPathForPiece = useCallback(
    (piece: PiecesInfo) => {
      if (piece.coords.x === null || piece.coords.y === null) return;
      const { x, y } = piece.coords;
      const calculatedPaths: BasicCoords[] = [];

      const isValidCoord = (coord: BasicCoords) => {
        if (coord.x === null || coord.y === null) return false;
        return coord.x >= 0 && coord.x < 8 && coord.y >= 0 && coord.y < 8;
      };

      switch (piece.type) {
        case "pawn": {
          const direction = piece.color === "white" ? 1 : -1;

          const forwardOne = { x, y: (y + direction) as BasicCoords["y"] };
          if (
            isValidCoord(forwardOne) &&
            handleVerifyIsEmptyCell({ color: piece.color, coords: forwardOne })
          ) {
            calculatedPaths.push(forwardOne);

            if (piece.firstMove) {
              const forwardTwo = {
                x,
                y: (y + direction * 2) as BasicCoords["y"],
              };
              if (
                isValidCoord(forwardTwo) &&
                handleVerifyIsEmptyCell({
                  color: piece.color,
                  coords: forwardTwo,
                })
              ) {
                calculatedPaths.push(forwardTwo);
              }
            }
          }

          const diagonalLeft = {
            x: x - 1,
            y: y + direction,
          } as BasicCoords;
          if (
            isValidCoord(diagonalLeft) &&
            handleVerifyIsEmptyCell(
              { color: piece.color, coords: diagonalLeft },
              "enemyOnly"
            )
          ) {
            calculatedPaths.push(diagonalLeft);
          }
          const diagonalRight = {
            x: x + 1,
            y: y + direction,
          } as BasicCoords;
          if (
            isValidCoord(diagonalRight) &&
            handleVerifyIsEmptyCell(
              { color: piece.color, coords: diagonalRight },
              "enemyOnly"
            )
          ) {
            calculatedPaths.push(diagonalRight);
          }
          break;
        }
        case "knight": {
          const knightMoves = [
            { x: x + 1, y: y + 2 },
            { x: x - 1, y: y + 2 },
            { x: x + 1, y: y - 2 },
            { x: x - 1, y: y - 2 },
            { x: x + 2, y: y + 1 },
            { x: x - 2, y: y + 1 },
            { x: x + 2, y: y - 1 },
            { x: x - 2, y: y - 1 },
          ] as BasicCoords[];

          knightMoves.forEach((move) => {
            if (isValidCoord(move)) {
              if (
                handleVerifyIsEmptyCell({ color: piece.color, coords: move }) ||
                handleVerifyIsEmptyCell(
                  { color: piece.color, coords: move },
                  "enemyOnly"
                )
              ) {
                calculatedPaths.push(move);
              }
            }
          });
          break;
        }
        case "bishop": {
          const directions = [
            { x: 1, y: 1 },
            { x: -1, y: 1 },
            { x: 1, y: -1 },
            { x: -1, y: -1 },
          ];

          directions.forEach((dir) => {
            let step = 1;
            while (true) {
              const newPos = {
                x: x + dir.x * step,
                y: y + dir.y * step,
              } as BasicCoords;
              if (!isValidCoord(newPos)) break;
              if (
                handleVerifyIsEmptyCell({ color: piece.color, coords: newPos })
              ) {
                calculatedPaths.push(newPos);
              } else {
                if (
                  handleVerifyIsEmptyCell(
                    { color: piece.color, coords: newPos },
                    "enemyOnly"
                  )
                ) {
                  calculatedPaths.push(newPos);
                }
                break;
              }
              step++;
            }
          });
          break;
        }
        case "rook": {
          const directions = [
            { x: 1, y: 0 },
            { x: -1, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: -1 },
          ];

          directions.forEach((dir) => {
            let step = 1;
            while (true) {
              const newPos = {
                x: x + dir.x * step,
                y: y + dir.y * step,
              } as BasicCoords;
              if (!isValidCoord(newPos)) break;
              if (
                handleVerifyIsEmptyCell({ color: piece.color, coords: newPos })
              ) {
                calculatedPaths.push(newPos);
              } else {
                if (
                  handleVerifyIsEmptyCell(
                    { color: piece.color, coords: newPos },
                    "enemyOnly"
                  )
                ) {
                  calculatedPaths.push(newPos);
                }
                break;
              }
              step++;
            }
          });
          break;
        }
        case "queen": {
          const directions = [
            { x: 1, y: 1 },
            { x: -1, y: 1 },
            { x: 1, y: -1 },
            { x: -1, y: -1 },
            { x: 1, y: 0 },
            { x: -1, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: -1 },
          ];

          directions.forEach((dir) => {
            let step = 1;
            while (true) {
              const newPos = {
                x: x + dir.x * step,
                y: y + dir.y * step,
              } as BasicCoords;
              if (!isValidCoord(newPos)) break;
              if (
                handleVerifyIsEmptyCell({ color: piece.color, coords: newPos })
              ) {
                calculatedPaths.push(newPos);
              } else {
                if (
                  handleVerifyIsEmptyCell(
                    { color: piece.color, coords: newPos },
                    "enemyOnly"
                  )
                ) {
                  calculatedPaths.push(newPos);
                }
                break;
              }
              step++;
            }
          });
          break;
        }
        case "king": {
          const directions = [
            { x: 1, y: 1 },
            { x: -1, y: 1 },
            { x: 1, y: -1 },
            { x: -1, y: -1 },
            { x: 1, y: 0 },
            { x: -1, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: -1 },
          ];

          directions.forEach((dir) => {
            const newPos = {
              x: x + dir.x,
              y: y + dir.y,
            } as BasicCoords;
            if (isValidCoord(newPos)) {
              if (
                handleVerifyIsEmptyCell({
                  color: piece.color,
                  coords: newPos,
                }) ||
                handleVerifyIsEmptyCell(
                  { color: piece.color, coords: newPos },
                  "enemyOnly"
                )
              ) {
                calculatedPaths.push(newPos);
              }
            }
          });
          break;
        }
        default:
          break;
      }
      setPath(calculatedPaths);
    },
    [handleVerifyIsEmptyCell]
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
      }}
    >
      {children}
    </ChessboardContext.Provider>
  );
};
