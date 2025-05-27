import { useCallback, useEffect, useState } from "react";
import { ChessPieceProps } from "../types";

export const useChessPieceState = ({
  isAttacking,
  isMoving,
  isHit,
  isDead,
  isSelected,
}: Pick<
  ChessPieceProps,
  "isAttacking" | "isMoving" | "isHit" | "isDead" | "isSelected"
>) => {
  const [currentAnimation, setCurrentAnimation] = useState<
    "idle" | "walk" | "attack" | "hit" | "death" | "selected"
  >(isDead ? "death" : "idle");

  const timeoutToIdle = useCallback(() => {
    setTimeout(() => {
      setCurrentAnimation("idle");
    }, 100);
  }, []);

  useEffect(() => {
    if (isDead) setCurrentAnimation("death");
    else if (isAttacking) setCurrentAnimation("attack");
    else if (isMoving) setCurrentAnimation("walk");
    else if (isHit) setCurrentAnimation("hit");
    else if (isSelected) {
      setCurrentAnimation("selected");
      timeoutToIdle();
    } else setCurrentAnimation("idle");
  }, [isAttacking, isMoving, isHit, isDead, isSelected, timeoutToIdle]);

  return currentAnimation;
};
