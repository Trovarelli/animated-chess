import { BasicCoords } from "@/context";
import { TrimValue } from "@/hooks/useCanvasSprite";
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
  style?: CSSProperties | undefined
  cellWidth: number;
  cellHeight: number;
  trimLeft?: TrimValue
  trimRight?: TrimValue
  trimTop?: TrimValue
  trimBottom?: TrimValue
  displayWidth?: number;
  displayHeight?: number;
};