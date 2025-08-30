import { PiecesTypes } from "../types";

const WHITE_SPRITESHEET = "/sprites/Pieces/White";
const BLACK_SPRITESHEET = "/sprites/Pieces/Black";

type AnimationType = "idle" | "walk" | "attack" | "hit" | "death" | 'selected';

interface AnimationFrameConfig {
  row: number;
  frames: number;
  fps: number;
}

interface PIECE_CONFIG {
  sprite: string;
  animations: Record<AnimationType, AnimationFrameConfig>;
}

interface AnimationConfig extends AnimationFrameConfig {
  sprite: string;
}

interface UseChessPieceAnimationProps {
  color: "white" | "black";
  type: PiecesTypes;
  currentAnimation: AnimationType;
}

const ANIMATION_CONFIGS: Record<"black" | "white", Record<PiecesTypes, PIECE_CONFIG>> = {
  black: {
    pawn: {
      sprite: `${BLACK_SPRITESHEET}/Pawn.png`,
      animations: {
        idle: { row: 0, frames: 6, fps: 8 },
        walk: { row: 1, frames: 6, fps: 8 },
        attack: { row: 2, frames: 6, fps: 8 },
        death: { row: 5, frames: 4, fps: 8 },
        hit: { row: 4, frames: 6, fps: 8 },
        selected: {row: 2, frames: 6, fps: 8}

      },
    },
    knight: {
      sprite: `${BLACK_SPRITESHEET}/Knight.png`,
      animations: {
        idle: { row: 0, frames: 6, fps: 8 },
        walk: { row: 1, frames: 6, fps: 8 },
        attack: { row: 2, frames: 6, fps: 8 },
        death: { row: 7, frames: 4, fps: 8 },
        hit: { row: 4, frames: 6, fps: 8 },
        selected: {row: 2, frames: 8, fps: 8}
      },
    },
    king: {
      sprite: `${BLACK_SPRITESHEET}/King.png`,
      animations: {
        idle: { row: 0, frames: 6, fps: 8 },
        walk: { row: 1, frames: 6, fps: 8 },
        attack: { row: 2, frames: 6, fps: 8 },
        death: { row: 5, frames: 4, fps: 8 },
        hit: { row: 4, frames: 6, fps: 8 },
        selected: {row: 2, frames: 6, fps: 8}
      },
    },
    bishop: {
      sprite: `${BLACK_SPRITESHEET}/Bishop.png`,
      animations: {
        idle: { row: 0, frames: 6, fps: 8 },
        walk: { row: 1, frames: 8, fps: 8 },
        attack: { row: 2, frames: 9, fps: 12 },
        death: { row: 6, frames: 4, fps: 8 },
        hit: { row: 5, frames: 4, fps: 8 },
        selected: {row: 2, frames: 6, fps: 8}
      },
    },
    queen: {  
      sprite: `${BLACK_SPRITESHEET}/Queen.png`,
      animations: {
        idle: { row: 0, frames: 6, fps: 8 },
        walk: { row: 1, frames: 6, fps: 8 },
        attack: { row: 2, frames: 6, fps: 8 },
        death: { row: 5, frames: 4, fps: 8 },
        hit: { row: 4, frames: 6, fps: 8 },
        selected: {row: 2, frames: 6, fps: 8}
      },
    },
    rook: {
      sprite: `${BLACK_SPRITESHEET}/Rook.png`,
      animations: {
        idle: { row: 0, frames: 6, fps: 8 },
        walk: { row: 1, frames: 6, fps: 8 },
        attack: { row: 2, frames: 6, fps: 8 },
        death: { row: 5, frames: 4, fps: 8 },
        hit: { row: 4, frames: 6, fps: 8 },
        selected: {row: 2, frames: 6, fps: 8}
      },
    },
  },
  white: {
    pawn: {
      sprite: `${WHITE_SPRITESHEET}/Pawn.png`,
      animations: {
        idle: { row: 0, frames: 6, fps: 8 },
        walk: { row: 1, frames: 6, fps: 8 },
        attack: { row: 2, frames: 6, fps: 8 },
        death: { row: 6, frames: 4, fps: 8 },
        hit: { row: 4, frames: 6, fps: 8 },
        selected: {row: 2, frames: 6, fps: 8}
      },
    },
    knight: {
      sprite: `${WHITE_SPRITESHEET}/Knight.png`,
      animations: {
        idle: { row: 0, frames: 6, fps: 8 },
        walk: { row: 1, frames: 6, fps: 8 },
        attack: { row: 2, frames: 6, fps: 8 },
        death: { row: 7, frames: 4, fps: 8 },
        hit: { row: 4, frames: 6, fps: 8 },
        selected: {row: 2, frames: 6, fps: 8}
      },
    },
    king: {
      sprite: `${WHITE_SPRITESHEET}/King.png`,
      animations: {
        idle: { row: 0, frames: 6, fps: 8 },
        walk: { row: 1, frames: 6, fps: 8 },
        attack: { row: 2, frames: 6, fps: 8 },
        death: { row: 6, frames: 4, fps: 8 },
        hit: { row: 4, frames: 6, fps: 8 },
        selected: {row: 2, frames: 6, fps: 8}
      },
    },
    bishop: {
      sprite: `${WHITE_SPRITESHEET}/Bishop.png`,
      animations: {
        idle: { row: 0, frames: 6, fps: 8 },
        walk: { row: 1, frames: 6, fps: 8 },
        attack: { row: 2, frames: 6, fps: 8 },
        death: { row: 6, frames: 4, fps: 8 },
        hit: { row: 4, frames: 6, fps: 8 },
        selected: {row: 2, frames: 6, fps: 8}
      },
    },
    queen: {
      sprite: `${WHITE_SPRITESHEET}/Queen.png`,
      animations: {
        idle: { row: 0, frames: 6, fps: 8 },
        walk: { row: 1, frames: 6, fps: 8 },
        attack: { row: 2, frames: 6, fps: 8 },
        death: { row: 6, frames: 4, fps: 8 },
        hit: { row: 4, frames: 6, fps: 8 },
        selected: {row: 2, frames: 6, fps: 8}
      },
    },
    rook: {
      sprite: `${WHITE_SPRITESHEET}/Rook.png`,
      animations: {
        idle: { row: 0, frames: 6, fps: 8 },
        walk: { row: 1, frames: 6, fps: 8 },
        attack: { row: 2, frames: 6, fps: 8 },
        death: { row: 6, frames: 4, fps: 8 },
        hit: { row: 4, frames: 6, fps: 8 },
        selected: {row: 2, frames: 6, fps: 8}
      },
    },
  },
};

export const useChessPieceAnimation = ({
  color,
  type,
  currentAnimation,
}: UseChessPieceAnimationProps): AnimationConfig => {
  const pieceConfig = ANIMATION_CONFIGS[color][type];
  const animationConfig = pieceConfig.animations[currentAnimation];

  return {
    ...animationConfig,
    sprite: pieceConfig.sprite,
  };
};
