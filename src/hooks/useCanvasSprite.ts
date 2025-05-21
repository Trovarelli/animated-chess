import { useEffect, useRef, useState } from 'react';

type UseCanvasSpriteProps = {
  sprite: string;
  frames: number;
  fps: number;
  width: number;
  height: number;
  row?: number;
  loop?: boolean;
};

export const useCanvasSprite = ({
  sprite,
  frames,
  fps,
  width,
  height,
  row = 0,
  loop = true,
}: UseCanvasSpriteProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const frameWidth = width;
  const frameHeight = height;
  const lastFrameTime = useRef(0);
  const currentFrame = useRef(frames ?? 0);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const animationFrameId = useRef<number>(0);
  const isAnimating = useRef(false);

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
    if (frames === 1 && isLoaded && canvasRef.current && imageRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      canvas.width = frameWidth;
      canvas.height = frameHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(
        imageRef.current,
        currentFrame.current * frameWidth,
        row * frameHeight,
        frameWidth,
        frameHeight,
        0,
        0,
        canvas.width,
        canvas.height
      );
    }
  }, [isLoaded, frameWidth, frameHeight, row, frames]);

  useEffect(() => {
    if (
      frames === 1 ||
      !isLoaded ||
      !canvasRef.current ||
      !imageRef.current
    ) {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = 0;
      }
      isAnimating.current = false;
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = frameWidth;
    canvas.height = frameHeight;

    const animate = (timestamp: number) => {
      if (!lastFrameTime.current) lastFrameTime.current = timestamp;
      const elapsed = timestamp - lastFrameTime.current;

      if (elapsed >= 1000 / fps) {
        lastFrameTime.current = timestamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(
          imageRef.current!,
          currentFrame.current * frameWidth,
          row * frameHeight,
          frameWidth,
          frameHeight,
          0,
          0,
          canvas.width,
          canvas.height
        );

        if (currentFrame.current >= frames - 1) {
          if (!loop) {
            currentFrame.current = frames - 1;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(
              imageRef.current!,
              currentFrame.current * frameWidth,
              row * frameHeight,
              frameWidth,
              frameHeight,
              0,
              0,
              canvas.width,
              canvas.height
            );
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
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = 0;
      }
      isAnimating.current = false;
    };
  }, [frames, fps, frameWidth, frameHeight, isLoaded, loop, row]);

  return { canvasRef, width: frameWidth, height: frameHeight, isAnimating: isAnimating.current };
}; 