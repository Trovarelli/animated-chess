import { useEffect, useRef, useState } from 'react';

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
}: UseCanvasSpriteProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const lastFrameTime = useRef(0);
  const currentFrame = useRef(0);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const animationFrameId = useRef<number>(0);
  const isAnimating = useRef(false);

  const dispW = displayWidth ?? frameWidth;
  const dispH = displayHeight ?? frameHeight;

  useEffect(() => {
    const img = new Image();
    img.src = sprite;
    img.onload = () => {
      imageRef.current = img;
      setIsLoaded(true);
      currentFrame.current = 0;
      lastFrameTime.current = 0;
    };
    img.onerror = () => console.error('Falha ao carregar sprite:', sprite);

  }, [sprite]);

  useEffect(() => {
    currentFrame.current = 0;
    lastFrameTime.current = 0;
  }, [row]);

  useEffect(() => {
    if (!isLoaded || !canvasRef.current || !imageRef.current) {
      if (!isLoaded) {
        cancelAnimationFrame(animationFrameId.current);
        isAnimating.current = false;
      }
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (canvas.width !== frameWidth) canvas.width = frameWidth;
    if (canvas.height !== frameHeight) canvas.height = frameHeight;
    ctx.imageSmoothingEnabled = false;

    const backBuffer = document.createElement('canvas');
    backBuffer.width = frameWidth;
    backBuffer.height = frameHeight;
    const backCtx = backBuffer.getContext('2d');
    if (backCtx) backCtx.imageSmoothingEnabled = false;

    const drawFrame = () => {
      if (!imageRef.current || !ctx || !backCtx) return;

      backCtx.clearRect(0, 0, frameWidth, frameHeight);
      backCtx.drawImage(
        imageRef.current,
        currentFrame.current * frameWidth,
        row * frameHeight,
        frameWidth,
        frameHeight,
        0,
        0,
        frameWidth,
        frameHeight
      );

      ctx.clearRect(0, 0, frameWidth, frameHeight);
      ctx.drawImage(backBuffer, 0, 0);
    };

    // Draw first frame immediately
    drawFrame();

    const animate = (timestamp: number) => {
      if (!lastFrameTime.current) lastFrameTime.current = timestamp;
      const elapsed = timestamp - lastFrameTime.current;

      if (elapsed >= 1000 / fps) {
        lastFrameTime.current = timestamp;

        if (currentFrame.current >= frames - 1) {
          if (!loop) {
            isAnimating.current = false;
            return;
          }
          currentFrame.current = 0;
        } else {
          currentFrame.current++;
        }
        drawFrame();
      }

      if (isAnimating.current) {
        animationFrameId.current = requestAnimationFrame(animate);
      }
    };

    if (frames > 1) {
      isAnimating.current = true;
      animationFrameId.current = requestAnimationFrame(animate);
    } else {
      isAnimating.current = false;
    }

    return () => {
      cancelAnimationFrame(animationFrameId.current);
      isAnimating.current = false;
    };
  }, [frames, fps, frameWidth, frameHeight, row, loop, isLoaded]);

  return {
    canvasRef,
    internalWidth: frameWidth,
    internalHeight: frameHeight,
    displayWidth: dispW,
    displayHeight: dispH,
    isAnimating: isAnimating.current,
  };
};
