describe('Advanced Chess Rules', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.wait(1000);
        cy.contains('button', 'INICIAR JOGO').click();
        cy.wait(1000);
    });

    it('should implement Castling correctly (Kingside)', () => {
        cy.clickPiece(1, 4);
        cy.clickSquare(3, 4);
        cy.waitForAnimation();

        cy.clickPiece(6, 4);
        cy.waitForAnimation();

        cy.clickPiece(0, 6);
        cy.clickSquare(2, 5);
        cy.waitForAnimation();
        cy.clickPiece(7, 6);
        cy.clickSquare(5, 5);
        cy.waitForAnimation();

        cy.clickPiece(0, 5);
        cy.clickSquare(3, 2);
        cy.waitForAnimation();
        cy.clickPiece(7, 5);
        cy.clickSquare(4, 2);
        cy.waitForAnimation();

        cy.clickPiece(0, 4);
        cy.clickSquare(0, 6);
        cy.waitForAnimation();
        cy.get('[data-testid="piece"][data-piece-type="king"][data-piece-color="white"]')
            .should('have.attr', 'data-row', '0')
            .should('have.attr', 'data-col', '6');

        cy.get('[data-testid="piece"][data-piece-type="rook"][data-piece-color="white"][data-row="0"][data-col="5"]')
            .should('exist');
    });

    it('should implement En Passant correctly', () => {
        cy.clickPiece(1, 3);
        cy.clickSquare(3, 3);
        cy.waitForAnimation();
        cy.clickPiece(6, 4);
        cy.clickSquare(5, 4);
        cy.waitForAnimation();
        cy.clickPiece(3, 3);
        cy.clickSquare(4, 3);
        cy.waitForAnimation();
        cy.clickPiece(6, 2);
        cy.clickSquare(4, 2);
        cy.waitForAnimation();
        cy.clickPiece(4, 3);
        cy.clickSquare(5, 2);
        cy.waitForAnimation();
        cy.get('[data-testid="piece"][data-row="4"][data-col="2"]').should('not.exist');
        cy.get('[data-testid="piece"][data-piece-type="pawn"][data-piece-color="white"]')
            .should('have.attr', 'data-row', '5')
            .should('have.attr', 'data-col', '2');
    });

    it('should promote pawn to Queen automatically', () => {
        const moves = [
            [1, 0, 3, 0], [6, 1, 4, 1],
            [3, 0, 4, 0], [4, 1, 3, 1],
            [4, 0, 5, 0], [3, 1, 2, 1],
            [5, 0, 6, 1], [7, 2, 6, 1],
            [1, 1, 3, 1], [7, 1, 5, 0],
            [3, 1, 4, 1], [5, 0, 4, 1],
            [1, 2, 2, 2], [4, 1, 3, 1],
            [2, 2, 3, 2], [3, 1, 2, 1],
            [3, 2, 4, 2], [2, 1, 1, 1],
            [4, 2, 5, 2], [1, 1, 0, 0]
        ];

        moves.forEach(([fr, fc, tr, tc]) => {
            cy.clickPiece(fr, fc);
            cy.clickSquare(tr, tc);
            cy.waitForAnimation(600);
        });

        cy.get('[data-testid="piece"][data-piece-type="queen"][data-piece-color="black"]')
            .should('have.attr', 'data-row', '0')
            .should('have.attr', 'data-col', '0');
    });

    it('should detect Checkmate', () => {
        cy.clickPiece(1, 5);
        cy.clickSquare(2, 5);
        cy.waitForAnimation();

        cy.clickPiece(6, 4);
        cy.clickSquare(4, 4);
        cy.waitForAnimation();

        cy.clickPiece(1, 6);
        cy.clickSquare(3, 6);
        cy.waitForAnimation();

        cy.clickPiece(7, 3);
        cy.clickSquare(3, 7);
        cy.waitForAnimation();

        // Check for Game Over modal
        cy.contains('Vencedor: Pretas').should('be.visible');
        cy.contains('Checkmate').should('be.visible');
    });
});
