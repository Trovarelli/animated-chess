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
}