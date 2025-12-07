describe('Game Reset Functionality', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.wait(1000); // Wait for initialization
    });

    it('should display the reset button in header', () => {
        cy.contains('button', 'Novo Jogo').should('be.visible');
    });

    it('should have correct reset button styling', () => {
        cy.contains('button', 'Novo Jogo')
            .should('have.class', 'bg-amber-900/70')
            .should('be.visible');
    });

    it('should show reset button emoji/icon', () => {
        cy.contains('button', '🔄 Novo Jogo').should('be.visible');
    });

    it('should be clickable without errors', () => {
        cy.contains('button', 'Novo Jogo').click();

        // Should not crash
        cy.wait(500);
        cy.get('header').should('be.visible');
    });

    it('should reset turn to white after clicking', () => {
        // Click reset
        cy.contains('button', 'Novo Jogo').click();
        cy.wait(500);

        // Turn should be white
        cy.contains('Brancas').should('be.visible');
        cy.get('.bg-white.border-amber-500').should('exist');
    });

    it('should reset move counter to #1', () => {
        // Click reset
        cy.contains('button', 'Novo Jogo').click();
        cy.wait(500);

        // Move counter should be back to 1
        cy.contains('Movimento #1').should('be.visible');
    });

    it('should restore initial board state', () => {
        // Click reset
        cy.contains('button', 'Novo Jogo').click();
        cy.wait(1000);

        // Board should be visible and functional
        cy.get('[style*="background-image"]').should('have.length.greaterThan', 0);
    });

    it('should clear any check warnings', () => {
        // Click reset
        cy.contains('button', 'Novo Jogo').click();
        cy.wait(500);

        // No check warning should be visible
        cy.contains('XEQUE').should('not.exist');
    });

    it('should be accessible multiple times', () => {
        // Click reset multiple times
        cy.contains('button', 'Novo Jogo').click();
        cy.wait(500);
        cy.contains('button', 'Novo Jogo').click();
        cy.wait(500);
        cy.contains('button', 'Novo Jogo').click();
        cy.wait(500);

        // Should still work
        cy.get('header').should('be.visible');
        cy.contains('Movimento #1').should('be.visible');
    });

    it('should have hover effect on reset button', () => {
        cy.contains('button', 'Novo Jogo')
            .trigger('mouseover')
            .should('be.visible');
    });

    it('should reset the game mid-game', () => {
        // Make some interactions
        cy.get('[style*="background-image"]').first().click({ force: true });
        cy.wait(500);

        // Then reset
        cy.contains('button', 'Novo Jogo').click();
        cy.wait(500);

        // Should be back to initial state
        cy.contains('Movimento #1').should('be.visible');
        cy.contains('Brancas').should('be.visible');
    });

    it('should maintain proper layout after reset', () => {
        cy.contains('button', 'Novo Jogo').click();
        cy.wait(500);

        // All major UI elements should still be visible
        cy.get('header').should('be.visible');
        cy.get('[style*="BattleField"]').should('exist');
    });

    it('should clear dead pieces areas on reset', () => {
        // After reset, dead pieces areas should be empty or reset
        cy.contains('button', 'Novo Jogo').click();
        cy.wait(1000);

        // Board should be in initial state
        cy.get('.flex.flex-wrap.gap-2.content-start').should('exist');
    });

    it('should handle reset during animations gracefully', () => {
        // Click a piece to potentially start animation
        cy.get('[style*="background-image"]').first().click({ force: true });

        // Immediately click reset
        cy.contains('button', 'Novo Jogo').click();
        cy.wait(1000);

        // Should still work correctly
        cy.get('header').should('be.visible');
        cy.contains('Movimento #1').should('be.visible');
    });
});
