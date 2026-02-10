import { gameStorage } from './gameStorage';

const mockState = {
    turn: 'white' as const,
    moveHistory: [],
    isInCheck: false,
    gameOver: {
        looser: { color: null, details: '' },
        winner: { color: null, details: '' },
        over: false,
    },
    playerFaction: 'human' as const,
    piecesInfo: [],
    enPassantTarget: null,
};

describe('gameStorage', () => {
    beforeEach(() => {
        sessionStorage.clear();
    });

    describe('save e load', () => {
        it('salva e carrega o estado corretamente', () => {
            gameStorage.save(mockState);
            const loaded = gameStorage.load();
            expect(loaded).toEqual(mockState);
        });

        it('retorna null quando não há estado salvo', () => {
            const loaded = gameStorage.load();
            expect(loaded).toBeNull();
        });
    });

    describe('clear', () => {
        it('remove o estado salvo', () => {
            gameStorage.save(mockState);
            gameStorage.clear();
            const loaded = gameStorage.load();
            expect(loaded).toBeNull();
        });
    });

    describe('exists', () => {
        it('retorna true quando há estado salvo', () => {
            gameStorage.save(mockState);
            expect(gameStorage.exists()).toBe(true);
        });

        it('retorna false quando não há estado salvo', () => {
            expect(gameStorage.exists()).toBe(false);
        });

        it('retorna false após clear', () => {
            gameStorage.save(mockState);
            gameStorage.clear();
            expect(gameStorage.exists()).toBe(false);
        });
    });

    describe('persistência de dados complexos', () => {
        it('preserva moveHistory com itens', () => {
            const stateWithMoves = {
                ...mockState,
                moveHistory: [
                    { from: 'E2', to: 'E4', piece: 'pawn', color: 'white' as const },
                ],
            };
            gameStorage.save(stateWithMoves);
            const loaded = gameStorage.load();
            expect(loaded?.moveHistory).toHaveLength(1);
            expect(loaded?.moveHistory[0].from).toBe('E2');
        });

        it('preserva facção orc', () => {
            const orcState = { ...mockState, playerFaction: 'orc' as const };
            gameStorage.save(orcState);
            const loaded = gameStorage.load();
            expect(loaded?.playerFaction).toBe('orc');
        });
    });
});
