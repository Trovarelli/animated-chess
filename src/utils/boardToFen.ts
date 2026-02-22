import { PiecesInfo } from '@/components/ChessPiece/types';
import { BasicCoords } from '@/context/ChessboardContext/types';

const PIECE_TO_FEN: Record<string, Record<string, string>> = {
    white: {
        king: 'K',
        queen: 'Q',
        rook: 'R',
        bishop: 'B',
        knight: 'N',
        pawn: 'P',
    },
    black: {
        king: 'k',
        queen: 'q',
        rook: 'r',
        bishop: 'b',
        knight: 'n',
        pawn: 'p',
    },
};

export function boardToFen(
    pieces: PiecesInfo[],
    turn: 'white' | 'black',
    enPassantTarget: BasicCoords | null,
    moveCount: number
): string {
    const board: (string | null)[][] = Array.from({ length: 8 }, () =>
        Array(8).fill(null)
    );

    for (const piece of pieces) {
        if (!piece.alive || piece.coords.x === null || piece.coords.y === null) continue;
        board[piece.coords.y][piece.coords.x] = PIECE_TO_FEN[piece.color][piece.type];
    }

    const ranks: string[] = [];
    for (let y = 0; y < 8; y++) {
        let rank = '';
        let emptyCount = 0;
        for (let x = 0; x < 8; x++) {
            const cell = board[y][x];
            if (cell) {
                if (emptyCount > 0) {
                    rank += emptyCount;
                    emptyCount = 0;
                }
                rank += cell;
            } else {
                emptyCount++;
            }
        }
        if (emptyCount > 0) rank += emptyCount;
        ranks.push(rank);
    }
    const piecePlacement = ranks.join('/');

    const activeColor = turn === 'white' ? 'w' : 'b';

    let castling = '';
    const whiteKing = pieces.find(p => p.alive && p.type === 'king' && p.color === 'white');
    const blackKing = pieces.find(p => p.alive && p.type === 'king' && p.color === 'black');

    if (whiteKing?.firstMove) {
        const whiteRookKingside = pieces.find(
            p => p.alive && p.type === 'rook' && p.color === 'white' && p.coords.x === 7 && p.coords.y === 7 && p.firstMove
        );
        const whiteRookQueenside = pieces.find(
            p => p.alive && p.type === 'rook' && p.color === 'white' && p.coords.x === 0 && p.coords.y === 7 && p.firstMove
        );
        if (whiteRookKingside) castling += 'K';
        if (whiteRookQueenside) castling += 'Q';
    }

    if (blackKing?.firstMove) {
        const blackRookKingside = pieces.find(
            p => p.alive && p.type === 'rook' && p.color === 'black' && p.coords.x === 7 && p.coords.y === 0 && p.firstMove
        );
        const blackRookQueenside = pieces.find(
            p => p.alive && p.type === 'rook' && p.color === 'black' && p.coords.x === 0 && p.coords.y === 0 && p.firstMove
        );
        if (blackRookKingside) castling += 'k';
        if (blackRookQueenside) castling += 'q';
    }

    if (!castling) castling = '-';

    let enPassant = '-';
    if (enPassantTarget && enPassantTarget.x !== null && enPassantTarget.y !== null) {
        const file = String.fromCharCode(97 + enPassantTarget.x);
        const rank = 8 - enPassantTarget.y;
        enPassant = `${file}${rank}`;
    }

    const halfmoveClock = 0;
    const fullmoveNumber = Math.floor(moveCount / 2) + 1;

    return `${piecePlacement} ${activeColor} ${castling} ${enPassant} ${halfmoveClock} ${fullmoveNumber}`;
}
