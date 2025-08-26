import { BasicCoords } from "@/context";

export type PiecesTypes =
  | "pawn"
  | "knight"
  | "king"
  | "bishop"
  | "queen"
  | "rook";

export interface ChessPieceProps {
  color: "white" | "black";
  type: PiecesTypes;
  width: number;
  height: number;
  className?: string;
  isAttacking?: boolean;
  isMoving?: boolean;
  moveKey?: string;
  isHit?: boolean;
  isDead?: boolean;
  isSelected?: boolean;
  isYourTurn?: boolean;
}

export type PiecesInfo = {
  id: string;
  coords: BasicCoords;
  alive: boolean;
  color: "black" | "white";
  type: PiecesTypes;
  firstMove?: boolean;
}
