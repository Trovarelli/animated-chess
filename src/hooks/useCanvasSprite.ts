import { useEffect, useRef, useState } from 'react';

export type TrimValue = number | string;

type UseCanvasSpriteProps = {
  sprite: string;
  frames: number;
  fps: number;
  frameWidth: number;
  frameHeight: number;
  row?: number;
  loop?: boolean;
  displayWidth?: number;
  displayHeight?: number;
  trimLeft?: TrimValue;
  trimRight?: TrimValue;
  trimTop?: TrimValue;
  trimBottom?: TrimValue;
};

const toPx = (val: TrimValue | undefined, total: number): number => {
  if (typeof val === 'string' && val.endsWith('%')) {
    const pct = parseFloat(val) / 100;
    return Math.round(total * pct);
  }
  return typeof val === 'number' ? val : 0;
};

export const useCanvasSprite = ({
  sprite,
  frames,
  fps,
  frameWidth,
  frameHeight,
  row = 0,
  loop = true,
  displayWidth,
  displayHeight,
  trimLeft = 0,
  trimRight = 0,
  trimTop = 0,
  trimBottom = 0,
}: UseCanvasSpriteProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const lastFrameTime = useRef(0);
  const currentFrame = useRef(0);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const animationFrameId = useRef<number>(0);
  const isAnimating = useRef(false);

  const tLeft = toPx(trimLeft, frameWidth);
  const tRight = toPx(trimRight, frameWidth);
  const tTop = toPx(trimTop, frameHeight);
  const tBottom = toPx(trimBottom, frameHeight);
  const croppedWidth = frameWidth - tLeft - tRight;
  const croppedHeight = frameHeight - tTop - tBottom;
  const dispW = displayWidth ?? croppedWidth;
  const dispH = displayHeight ?? croppedHeight;

  useEffect(() => {
    const img = new Image();
    img.src = sprite;
    img.onload = () => {
      imageRef.current = img;
      setIsLoaded(true);
    };
    img.onerror = () => console.error('Falha ao carregar sprite:', sprite);
  }, [sprite]);

  useEffect(() => {
    if (isLoaded && frames === 1 && canvasRef.current && imageRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      canvas.width = croppedWidth;
      canvas.height = croppedHeight;
      ctx.clearRect(0, 0, croppedWidth, croppedHeight);
      ctx.drawImage(
        imageRef.current,
        currentFrame.current * frameWidth + tLeft,
        row * frameHeight + tTop,
        croppedWidth,
        croppedHeight,
        0,
        0,
        croppedWidth,
        croppedHeight
      );
    }
  }, [isLoaded, frames, frameWidth, frameHeight, row, tLeft, tTop, croppedWidth, croppedHeight]);

  useEffect(() => {
    if (frames <= 1 || !isLoaded || !canvasRef.current || !imageRef.current) {
      cancelAnimationFrame(animationFrameId.current);
      isAnimating.current = false;
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = croppedWidth;
    canvas.height = croppedHeight;

    const animate = (timestamp: number) => {
      if (!lastFrameTime.current) lastFrameTime.current = timestamp;
      const elapsed = timestamp - lastFrameTime.current;
      if (elapsed >= 1000 / fps) {
        lastFrameTime.current = timestamp;
        ctx.clearRect(0, 0, croppedWidth, croppedHeight);
        ctx.drawImage(
          imageRef.current!,
          currentFrame.current * frameWidth + tLeft,
          row * frameHeight + tTop,
          croppedWidth,
          croppedHeight,
          0,
          0,
          croppedWidth,
          croppedHeight
        );
        if (currentFrame.current >= frames - 1) {
          if (!loop) {
            isAnimating.current = false;
            return;
          }
          currentFrame.current = 0;
        } else {
          currentFrame.current++;
        }
      }
      if (isAnimating.current) {
        animationFrameId.current = requestAnimationFrame(animate);
      }
    };

    isAnimating.current = true;
    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId.current);
      isAnimating.current = false;
    };
  }, [frames, fps, frameWidth, frameHeight, row, loop, isLoaded, tLeft, tTop, croppedWidth, croppedHeight]);

  return {
    canvasRef,
    internalWidth: croppedWidth,
    internalHeight: croppedHeight,
    displayWidth: dispW,
    displayHeight: dispH,
    isAnimating: isAnimating.current,
  };
};
