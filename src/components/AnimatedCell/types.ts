import { BasicCoords } from "@/context";
import { CSSProperties } from "react";

export type AnimatedCellProps = {
  x?: BasicCoords["x"];
  y?: BasicCoords["y"];
  onClick?: (coords: BasicCoords) => void;
  sprite: string;
  frames: number;
  fps: number;
  row: number;
  loop: boolean;
  style?: CSSProperties | undefined;
  cellWidth: number;
  cellHeight: number;
  displayWidth?: number;
  displayHeight?: number;
  isFlipped?: boolean;
};