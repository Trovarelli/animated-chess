import { useContext, useEffect, useRef, useState, useCallback } from 'react';
import { GameContext } from '@/context/GameContext/context';
import { ChessboardContext } from '@/context/ChessboardContext/context';
import { boardToFen } from '@/utils/boardToFen';
import { parseUciMove, UciMove } from '@/utils/uciConverter';

export function useStockfish() {
    const {
        turn,
        playerFaction,
        gameOver,
        aiDifficulty,
        uciMoveHistory,
        moveHistory
    } = useContext(GameContext);

    const { piecesInfo, enPassantTarget } = useContext(ChessboardContext);

    const [isThinking, setIsThinking] = useState(false);
    const [aiMove, setAiMove] = useState<UciMove | null>(null);
    const workerRef = useRef<Worker | null>(null);
    const safetyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const aiColor = playerFaction === 'orc' ? 'white' : 'black';
    const isAiTurn = turn === aiColor && !gameOver.over && !!playerFaction;

    useEffect(() => {
        const worker = new Worker('/stockfish/stockfish.js');
        workerRef.current = worker;

        worker.postMessage('uci');

        return () => {
            if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
            worker.terminate();
        };
    }, []);

    const requestAiMove = useCallback(async () => {
        if (!isAiTurn || isThinking || !workerRef.current) return;

        setIsThinking(true);
        setAiMove(null);

        const startTime = Date.now();

        const worker = workerRef.current;

        let positionCmd: string;
        if (uciMoveHistory.length > 0) {
            positionCmd = `position startpos moves ${uciMoveHistory.join(' ')}`;
        } else if (moveHistory.length === 0) {
            positionCmd = 'position startpos';
        } else {
            const fen = boardToFen(piecesInfo, turn!, enPassantTarget, moveHistory.length);
            positionCmd = `position fen ${fen}`;
        }


        const handleMessage = (e: MessageEvent) => {
            const msg = e.data;
            if (typeof msg === 'string' && msg.startsWith('bestmove')) {
                const bestMoveUci = msg.split(' ')[1];
                const parsed = parseUciMove(bestMoveUci);

                const elapsed = Date.now() - startTime;
                const remaining = Math.max(0, 600 - elapsed);

                setTimeout(() => {
                    setAiMove(parsed);
                    setIsThinking(false);
                }, remaining);

                worker.removeEventListener('message', handleMessage);

                if (safetyTimeoutRef.current) {
                    clearTimeout(safetyTimeoutRef.current);
                }
            }
        };

        worker.addEventListener('message', handleMessage);

        worker.postMessage(positionCmd);
        worker.postMessage(`go depth ${aiDifficulty}`);

        safetyTimeoutRef.current = setTimeout(() => {
            setIsThinking(false);
            worker.removeEventListener('message', handleMessage);
        }, 10000);

    }, [isAiTurn, isThinking, uciMoveHistory, moveHistory.length, piecesInfo, turn, enPassantTarget, aiDifficulty]);

    useEffect(() => {
        if (isAiTurn && !isThinking && !aiMove) {
            const timer = setTimeout(() => {
                requestAiMove();
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isAiTurn, isThinking, aiMove, requestAiMove]);

    useEffect(() => {
        if (!isAiTurn) {
            setAiMove(null);
        }
    }, [isAiTurn]);

    const consumeAiMove = useCallback(() => {
        const move = aiMove;
        setAiMove(null);
        return move;
    }, [aiMove]);

    return {
        isThinking,
        aiMove,
        consumeAiMove,
        isAiTurn,
        aiColor,
    };
}
