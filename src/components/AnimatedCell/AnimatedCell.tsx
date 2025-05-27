import { useCanvasSprite } from "@/hooks/useCanvasSprite";
import { AnimatedCellProps } from "./types";

export const AnimatedCell = ({
  x,
  y,
  onClick,
  sprite,
  fps,
  frames,
  cellWidth,
  cellHeight,
  row,
  loop,
  trimLeft,
  trimRight,
  trimTop,
  trimBottom,
  displayWidth,
  displayHeight,
  style,
}: AnimatedCellProps) => {
  const {
    canvasRef,
    internalWidth,
    internalHeight,
    displayWidth: dispW,
    displayHeight: dispH,
  } = useCanvasSprite({
    sprite,
    frames,
    fps,
    frameWidth: cellWidth,
    frameHeight: cellHeight,
    row,
    loop,
    trimLeft,
    trimRight,
    trimTop,
    trimBottom,
    displayWidth,
    displayHeight,
  });

  return (
    <div
      onClick={() => onClick && x != null && y != null && onClick({ x, y })}
      style={style}
    >
      <canvas
        ref={canvasRef}
        width={internalWidth}
        height={internalHeight}
        style={{
          imageRendering: "pixelated",
          width: `${dispW}px`,
          height: `${dispH}px`,
        }}
      />
    </div>
  );
};
