import { useCallback, useEffect, useState } from "react";
import { ChessPieceProps } from "../types";

export const useChessPieceState = ({
  isAttacking,
  isMoving,
  moveKey,
  isHit,
  isDead,
  isSelected,
}: Pick<
  ChessPieceProps,
  "isAttacking" | "isMoving" | "moveKey" | "isHit" | "isDead" | "isSelected"
>) => {
  const [currentAnimation, setCurrentAnimation] = useState<
    "idle" | "walk" | "attack" | "hit" | "death" | "selected"
  >(isDead ? "death" : "idle");

  const timeoutToIdle = useCallback((duration = 100) => {
    setTimeout(() => {
      setCurrentAnimation("idle");
    }, duration);
  }, []);

  useEffect(() => {
    if (isDead) setCurrentAnimation("death");
    else if (isAttacking) setCurrentAnimation("attack");
    else if (isMoving) {
      setCurrentAnimation("walk");
      timeoutToIdle(300);
    } else if (isHit) setCurrentAnimation("hit");
    else if (isSelected) {
      setCurrentAnimation("selected");
      timeoutToIdle();
    } else setCurrentAnimation("idle");
  }, [
    isAttacking,
    isMoving,
    moveKey,
    isHit,
    isDead,
    isSelected,
    timeoutToIdle,
  ]);

  return currentAnimation;
};
