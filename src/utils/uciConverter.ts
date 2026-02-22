import { MappedCoords } from '@/context/ChessboardContext/types';
import { PiecesTypes } from '@/components/ChessPiece/types';

export type UciMove = {
    from: { x: MappedCoords; y: MappedCoords };
    to: { x: MappedCoords; y: MappedCoords };
    promotion?: PiecesTypes;
};

export function parseUciMove(uci: string): UciMove {
    const fromFile = uci.charCodeAt(0) - 97;
    const fromRank = 8 - parseInt(uci[1]);
    const toFile = uci.charCodeAt(2) - 97;
    const toRank = 8 - parseInt(uci[3]);

    const promotionMap: Record<string, PiecesTypes> = {
        q: 'queen',
        r: 'rook',
        b: 'bishop',
        n: 'knight',
    };

    const promotion = uci.length === 5 ? promotionMap[uci[4]] : undefined;

    return {
        from: { x: fromFile as MappedCoords, y: fromRank as MappedCoords },
        to: { x: toFile as MappedCoords, y: toRank as MappedCoords },
        promotion,
    };
}

export function coordsToUci(
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    promotion?: string
): string {
    const fromFile = String.fromCharCode(97 + fromX);
    const fromRank = 8 - fromY;
    const toFile = String.fromCharCode(97 + toX);
    const toRank = 8 - toY;

    let uci = `${fromFile}${fromRank}${toFile}${toRank}`;
    if (promotion) uci += promotion[0].toLowerCase();
    return uci;
}
