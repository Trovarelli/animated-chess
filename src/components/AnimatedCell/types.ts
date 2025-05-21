import { BasicCoords } from "@/context";

export type AnimatedCellProps = {
  cellSize: number;
  offsetX: number;
  offsetY: number;
  x: BasicCoords["x"];
  y: BasicCoords["y"];
  onClick: (coords: BasicCoords) => void;
  sprite: string;
};