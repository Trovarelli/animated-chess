import clsx from "clsx";
import { BoardProps } from "./types";
import { BasicCoords } from "@/context";
import { AnimatedCell } from "@/components/AnimatedCell/AnimatedCell";

export const Board = ({
  cellSize,
  BOARD_SIZE,
  color,
  handleSquareClick,
  offsetX,
  offsetY,
  path,
  piecesInfo,
}: BoardProps) => {
  return Array(BOARD_SIZE * BOARD_SIZE)
    .fill(null)
    .map((_, index) => {
      const x = index % BOARD_SIZE;
      const y = Math.floor(index / BOARD_SIZE);
      const isPath = path.some((p) => p.x === x && p.y === y);
      const isLight = (x + y) % 2 === 0;
      const hasEnemy = piecesInfo.some(
        (p) => p.coords.x === x && p.coords.y === y && p.color !== color
      );

      const baseClasses = clsx("absolute select-none outline-none no-select", {
        "bg-white/10": isLight,
        "bg-black/10": !isLight,
        "cursor-pointer": isPath,
        "!bg-[url('/mark/base-mark.png')] bg-no-repeat bg-center cursor-pointer bg-contain animate-pulse duration-700 z-10":
          isPath && hasEnemy,
      });

      return (
        <div
          key={`${x}-${y}`}
          onClick={() => isPath && handleSquareClick({ x, y } as BasicCoords)}
          className={baseClasses}
          data-row={y}
          data-col={x}
          data-testid="square"
          data-is-path={isPath}
          data-has-enemy={hasEnemy}
          style={{
            width: cellSize,
            height: cellSize,
            left: offsetX + x * cellSize,
            top: offsetY + y * cellSize,
          }}
        >
          {isPath && !hasEnemy && (
            <AnimatedCell
              sprite={"/flags/FlagRed.png"}
              x={x as BasicCoords["x"]}
              y={y as BasicCoords["y"]}
              onClick={handleSquareClick}
              frames={7}
              fps={10}
              displayWidth={cellSize}
              displayHeight={cellSize}
              row={0}
              loop
              cellWidth={64}
              cellHeight={64}
              style={{
                scale: 0.5,
                transform: "translate(25%)",
              }}
            />
          )}
        </div>
      );
    });
};
