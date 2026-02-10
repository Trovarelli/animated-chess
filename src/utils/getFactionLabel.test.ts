import { getFactionLabel } from './getFactionLabel';

describe('getFactionLabel', () => {
    describe('quando playerFaction é "human"', () => {
        it('retorna HUMANOS/IMPÉRIO para brancas', () => {
            const result = getFactionLabel('white', 'human');
            expect(result.name).toBe('HUMANOS');
            expect(result.title).toBe('IMPÉRIO');
        });

        it('retorna ORCS/CLÃ para pretas', () => {
            const result = getFactionLabel('black', 'human');
            expect(result.name).toBe('ORCS');
            expect(result.title).toBe('CLÃ');
        });
    });

    describe('quando playerFaction é "orc"', () => {
        it('retorna ORCS/CLÃ para brancas (invertido)', () => {
            const result = getFactionLabel('white', 'orc');
            expect(result.name).toBe('ORCS');
            expect(result.title).toBe('CLÃ');
        });

        it('retorna HUMANOS/IMPÉRIO para pretas (invertido)', () => {
            const result = getFactionLabel('black', 'orc');
            expect(result.name).toBe('HUMANOS');
            expect(result.title).toBe('IMPÉRIO');
        });
    });

    describe('quando playerFaction é null', () => {
        it('retorna HUMANOS/IMPÉRIO para brancas (padrão)', () => {
            const result = getFactionLabel('white', null);
            expect(result.name).toBe('HUMANOS');
            expect(result.title).toBe('IMPÉRIO');
        });

        it('retorna ORCS/CLÃ para pretas (padrão)', () => {
            const result = getFactionLabel('black', null);
            expect(result.name).toBe('ORCS');
            expect(result.title).toBe('CLÃ');
        });
    });
});
