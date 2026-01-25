import { PiecesInfo } from "@/components/ChessPiece/types";
import { Dispatch, JSX, SetStateAction } from "react";

export type MappedCoords = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | null

export type BasicCoords = {
  x: MappedCoords
  y: MappedCoords
};

export type ChessboardContextProps = {
  selectedPieceCoords: PiecesInfo | null
  setSelectedPieceCoords: Dispatch<SetStateAction<PiecesInfo | null>>;
  convertToChessCoords: (coords: BasicCoords) => string;
  convertFromChessCoords: (coords: string) => BasicCoords
  piecesInfo: PiecesInfo[]
  setPiecesInfo: Dispatch<SetStateAction<PiecesInfo[]>>
  path: BasicCoords[]
  setPath: Dispatch<SetStateAction<BasicCoords[]>>
  enPassantTarget: BasicCoords | null
  setEnPassantTarget: Dispatch<SetStateAction<BasicCoords | null>>
  isSquareUnderAttack: (coords: BasicCoords, attackerColor: "black" | "white", customPiecesInfo?: PiecesInfo[]) => boolean
  calculateSafeMoves: (piece: PiecesInfo, rawPaths: BasicCoords[]) => BasicCoords[]
  calculateRawPaths: (piece: PiecesInfo, currentPieces: PiecesInfo[], customEnPassantTarget?: BasicCoords | null) => BasicCoords[]
};

export type ChessboardContextProviderProps = {
  children: JSX.Element;
};
