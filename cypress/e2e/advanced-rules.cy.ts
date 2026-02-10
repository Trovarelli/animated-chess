describe('Advanced Chess Rules', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.wait(3000);
        cy.startGame('human');
        cy.wait(2000);
    });

    it('should implement Castling correctly (Kingside)', () => {
        cy.clickPiece(6, 4);
        cy.clickSquare(4, 4);
        cy.waitForAnimation(1500);

        cy.clickPiece(1, 4);
        cy.clickSquare(3, 4);
        cy.waitForAnimation(1500);

        cy.clickPiece(7, 6);
        cy.clickSquare(5, 5);
        cy.waitForAnimation(1500);

        cy.clickPiece(0, 1);
        cy.clickSquare(2, 2);
        cy.waitForAnimation(1500);

        cy.clickPiece(7, 5);
        cy.clickSquare(3, 1);
        cy.waitForAnimation(1500);

        cy.clickPiece(1, 0);
        cy.clickSquare(2, 0);
        cy.waitForAnimation(1500);

        cy.clickPiece(7, 4);
        cy.clickSquare(7, 6);
        cy.waitForAnimation(2000);

        cy.get('[data-testid="piece"][data-row="7"][data-col="6"][data-piece-type="king"][data-piece-color="white"]').should('exist');
        cy.get('[data-testid="piece"][data-row="7"][data-col="5"][data-piece-type="rook"][data-piece-color="white"]').should('exist');
    });

    it('should implement En Passant correctly', () => {
        cy.clickPiece(6, 3);
        cy.clickSquare(4, 3);
        cy.waitForAnimation();

        cy.clickPiece(1, 7);
        cy.clickSquare(2, 7);
        cy.waitForAnimation();

        cy.clickPiece(4, 3);
        cy.clickSquare(3, 3);
        cy.waitForAnimation();

        cy.clickPiece(1, 4);
        cy.clickSquare(3, 4);
        cy.waitForAnimation();

        cy.clickPiece(3, 3);
        cy.clickSquare(2, 4);
        cy.waitForCaptureAnimation();

        cy.get('[data-testid="piece"][data-row="3"][data-col="4"]').should('not.exist');
        cy.get('[data-testid="piece"][data-row="2"][data-col="4"][data-piece-type="pawn"][data-piece-color="white"]').should('exist');
    });

    it('should promote pawn to Queen automatically', () => {
        const oldMoves = [
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

        const newMoves = oldMoves.map(([fr, fc, tr, tc]) => [7 - fr, fc, 7 - tr, tc]);

        newMoves.forEach(([fr, fc, tr, tc]) => {
            cy.clickPiece(fr, fc);
            cy.getSquare(tr, tc).then($sq => {
                const hasEnemy = $sq.attr('data-has-enemy') === 'true';
                cy.clickSquare(tr, tc);
                if (hasEnemy) {
                    cy.waitForCaptureAnimation();
                } else {
                    cy.waitForAnimation(700);
                }
            });
        });

        cy.get('[data-testid="piece"][data-row="0"][data-col="0"][data-piece-type="queen"][data-piece-color="white"]').should('exist');
    });

    it('should detect Checkmate', () => {
        cy.clickPiece(6, 5);
        cy.clickSquare(5, 5);
        cy.waitForAnimation();

        cy.clickPiece(1, 4);
        cy.clickSquare(3, 4);
        cy.waitForAnimation();

        cy.clickPiece(6, 6);
        cy.clickSquare(4, 6);
        cy.waitForAnimation();

        cy.clickPiece(0, 3);
        cy.clickSquare(4, 7);
        cy.waitForAnimation();

        cy.contains('Checkmate').should('be.visible');
    });
});
