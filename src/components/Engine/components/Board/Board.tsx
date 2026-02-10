import clsx from "clsx";
import Image from "next/image";
import { BoardProps } from "./types";
import { BasicCoords } from "@/context";

export const Board = ({
  cellSize,
  BOARD_SIZE,
  color,
  handleSquareClick,
  offsetX,
  offsetY,
  path,
  piecesInfo,
  turn,
  isInCheck,
}: BoardProps) => {
  return (
    <div 
        className="relative" 
        data-turn={turn} 
        data-is-check={isInCheck} 
        data-testid="board-container"
    >
      {Array(BOARD_SIZE * BOARD_SIZE)
        .fill(null)
        .map((_, index) => {
      const x = index % BOARD_SIZE;
      const y = Math.floor(index / BOARD_SIZE);
      const isPath = path.some((p) => p.x === x && p.y === y);
      const isLight = (x + y) % 2 === 0;
      const hasEnemy = piecesInfo.some(
        (p) => p.coords.x === x && p.coords.y === y && p.color !== color
      );

      const baseClasses = clsx("absolute select-none outline-none no-select transition-colors duration-300", {
        "bg-amber-900/10": isLight,
        "bg-black/60": !isLight,
        "cursor-pointer": isPath,
      });

      const highlightClass = "";

      return (
        <div
          key={`${x}-${y}`}
          onClick={() => isPath && handleSquareClick({ x, y } as BasicCoords)}
          className={`${baseClasses} ${highlightClass}`}
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
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Image 
                    src="/assets/mk/creepy_brackets_generated.png" 
                    alt="trail" 
                    fill
                    className="object-contain opacity-90 animate-pulse-aggressive"
                    style={{ imageRendering: "pixelated" }}
                />
             </div>
          )}

          {isPath && hasEnemy && (
             <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                 <div className="absolute inset-0 animate-reticle-pulse z-20">
                    <Image 
                        src="/assets/mk/aggressive_reticle_generated.png" 
                        alt="reticle" 
                        fill
                        className="object-fill drop-shadow-[0_0_8px_rgba(255,0,0,0.8)]"
                        style={{ imageRendering: "pixelated" }}
                    />
                 </div>
             </div>
          )}
        </div>
        );
      })}
    </div>
  );
};
