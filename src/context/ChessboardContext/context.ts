import { createContext } from "react";
import { ChessboardContextProps } from "./types";
import { defaultPiecesInfo } from "@/components";

export const ChessboardContext = createContext<ChessboardContextProps>({
  selectedPieceCoords: { alive: true, color: 'white', coords: { x: null, y: null }, id: '', type: "pawn", firstMove: true },
  setSelectedPieceCoords: () => { },
  convertToChessCoords: () => "",
  convertFromChessCoords: () => ({ x: 0, y: 0 }),
  piecesInfo: defaultPiecesInfo,
  setPiecesInfo: () => "",
  path: [],
  setPath: () => ""
});
