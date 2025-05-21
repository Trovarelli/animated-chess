import { useCanvasSprite } from "@/hooks";
import { AnimatedCellProps } from "./types";

export const AnimatedCell = ({
  cellSize,
  offsetX,
  offsetY,
  x,
  y,
  onClick,
  sprite,
}: AnimatedCellProps) => {
  const {
    canvasRef,
    width: frameWidth,
    height: frameHeight,
  } = useCanvasSprite({
    sprite,
    frames: 7,
    fps: 10,
    width: 64,
    height: 64,
    row: 0,
    loop: true,
  });

  return (
    <div
      onClick={() => onClick({ x, y })}
      className="cursor-pointer"
      style={{
        width: cellSize,
        height: cellSize,
        left: offsetX + (x || 0) * cellSize,
        top: offsetY + (y || 0) * cellSize,
      }}
    >
      <canvas
        ref={canvasRef}
        width={frameWidth}
        height={frameHeight}
        style={{
          imageRendering: "pixelated",
          width: `${frameWidth}px`,
          height: `${frameHeight}px`,
        }}
      />
    </div>
  );
};
