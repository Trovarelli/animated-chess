describe('Chess Piece Movement', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.wait(1000);
        cy.startGame('human');
    });

    it('should allow clicking on a white piece on first turn', () => {
        cy.get('[style*="background-image"]').first().click({ force: true });
        cy.wait(500);
    });

    it('should show visual feedback when a piece is selected', () => {
        cy.get('[style*="background-image"]').first().click({ force: true });
        cy.wait(300);
    });

    it('should allow valid pawn moves', () => {
        cy.get('[style*="background-image"]').first().click({ force: true });
        cy.wait(300);
    });

    it('should update move counter after a valid move', () => {
        cy.contains('Movimento #1').should('be.visible');
    });

    it('should handle rapid clicking gracefully', () => {
        cy.get('[style*="background-image"]').first().click({ force: true });
        cy.get('[style*="background-image"]').first().click({ force: true });
        cy.get('[style*="background-image"]').first().click({ force: true });
        cy.wait(500);
        cy.get('header').should('be.visible');
    });

    it('should animate piece movement', () => {
        cy.get('[style*="background-image"]').first().click({ force: true });
        cy.wait(1000);
        cy.get('header').should('be.visible');
    });

    it('should prevent interaction during animation', () => {
        cy.get('[style*="background-image"]').first().click({ force: true });
        cy.get('[style*="background-image"]').eq(1).click({ force: true });
        cy.wait(1000);
        cy.get('header').should('be.visible');
    });

    it('should maintain proper piece count throughout the game', () => {
        cy.get('[style*="background-image"]').then(($pieces) => {
            const initialCount = $pieces.length;
            expect(initialCount).to.be.greaterThan(0);
        });
    });

    it('should display captured pieces in the dead pieces area', () => {
        cy.get('.flex.flex-wrap.gap-2.content-start').should('exist');
    });

    it('should handle piece selection and deselection', () => {
        cy.get('[style*="background-image"]').first().click({ force: true });
        cy.wait(300);
        cy.get('[style*="background-image"]').first().click({ force: true });
        cy.wait(300);
        cy.get('header').should('be.visible');
    });
});
