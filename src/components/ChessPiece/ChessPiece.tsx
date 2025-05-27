"use client";

import { ChessPieceProps } from "./types";
import { useChessPieceAnimation, useChessPieceState } from "./hooks";
import { AnimatedCell } from "../AnimatedCell/AnimatedCell";

const FRAME_WIDTH = 100;
const FRAME_HEIGHT = 100;

export const ChessPiece = ({
  type,
  isAttacking,
  isMoving,
  isHit,
  isDead,
  color,
  isSelected,
  height,
  isYourTurn,
  width,
}: ChessPieceProps) => {
  const currentAnimation = useChessPieceState({
    isAttacking,
    isMoving,
    isHit,
    isDead,
    isSelected,
  });

  const { fps, row, frames, sprite } = useChessPieceAnimation({
    color,
    type,
    currentAnimation,
  });

  return (
    <AnimatedCell
      sprite={sprite}
      frames={frames}
      fps={fps}
      displayWidth={width}
      displayHeight={height}
      style={{
        cursor: isYourTurn ? "pointer" : "default",
      }}
      row={row}
      loop={currentAnimation === "idle" || currentAnimation === "walk"}
      cellWidth={FRAME_WIDTH}
      cellHeight={FRAME_HEIGHT}
      trimLeft={25}
      trimRight={25}
      trimTop={19}
      trimBottom={35}
    />
  );
};
