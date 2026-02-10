import { PiecesInfo } from "@/components/ChessPiece";
import { BasicCoords } from "@/context";

export type BoardProps = {
    path: BasicCoords[];
    piecesInfo: PiecesInfo[];
    cellSize: number;
    offsetX: number;
    offsetY: number;
    color?: PiecesInfo['color'];
    handleSquareClick: (targetCoords: BasicCoords) => void;
    BOARD_SIZE: number;
    turn: "white" | "black" | null;
    isInCheck: boolean;
    lastMove?: { from: { col: number; row: number }; to: { col: number; row: number } };
    selectedPieceCoords?: PiecesInfo | null;
};