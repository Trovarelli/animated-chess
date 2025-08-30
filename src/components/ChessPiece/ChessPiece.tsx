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
        scale: 1.1,
      }}
      row={row}
      loop={
        currentAnimation === "idle" ||
        currentAnimation === "walk" ||
        currentAnimation === "selected"
      }
      cellWidth={FRAME_WIDTH}
      cellHeight={FRAME_HEIGHT}
      trimLeft={20}
      trimRight={20}
      trimTop={18}
      trimBottom={26}
    />
  );
};
