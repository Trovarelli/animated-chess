import { useCallback, useRef } from 'react';

export type AnimationStep = {
    action?: () => void;
    duration: number;
};

export const useAnimationSequence = () => {
    const isAnimatingRef = useRef(false);

    const runSequence = useCallback(async (steps: AnimationStep[]) => {
        isAnimatingRef.current = true;
        try {
            for (const step of steps) {
                if (step.action) {
                    step.action();
                }
                if (step.duration > 0) {
                    await new Promise((resolve) => setTimeout(resolve, step.duration));
                }
            }
        } finally {
            isAnimatingRef.current = false;
        }
    }, []);

    return {
        isAnimating: isAnimatingRef,
        runSequence,
    };
};
