import { PiecesInfo } from "@/components/ChessPiece/types";
import { BasicCoords } from "@/context/ChessboardContext/types";
import { GameOverType, Move, Faction } from "@/context/GameContext/types";

const STORAGE_KEY = "animated-chess-state";

export interface PersistedGameState {
    turn: "white" | "black" | null;
    moveHistory: Move[];
    isInCheck: boolean;
    gameOver: GameOverType;
    playerFaction: Faction;
    aiDifficulty: number;
    piecesInfo: PiecesInfo[];
    enPassantTarget: BasicCoords | null;
    uciMoveHistory?: string[];
}

export const gameStorage = {
    save(state: PersistedGameState): void {
        try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch { console.error('Erro ao salvar estado do jogo') }
    },

    load(): PersistedGameState | null {
        try {
            const raw = sessionStorage.getItem(STORAGE_KEY);
            return raw ? (JSON.parse(raw) as PersistedGameState) : null;
        } catch {
            return null;
        }
    },

    clear(): void {
        try {
            sessionStorage.removeItem(STORAGE_KEY);
        } catch { console.error('Erro ao limpar estado do jogo') }
    },

    exists(): boolean {
        try {
            return sessionStorage.getItem(STORAGE_KEY) !== null;
        } catch {
            return false;
        }
    },
};
