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
  displayWidth,
  displayHeight,
  style,
  isFlipped,
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
    displayWidth,
    displayHeight,
  });

  return (
    <div
      onClick={() => onClick && x != null && y != null && onClick({ x, y })}
      style={{
        ...style,
        transform: isFlipped ? `${style?.transform || ""} scaleX(-1)` : style?.transform,
      }}
      data-testid="move-indicator"
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
