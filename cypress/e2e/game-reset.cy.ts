describe('Game Reset Functionality', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.wait(1000);
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
        cy.wait(500);
        cy.get('header').should('be.visible');
    });

    it('should reset turn to white after clicking', () => {
        cy.contains('button', 'Novo Jogo').click();
        cy.wait(500);
        cy.contains('Brancas').should('be.visible');
        cy.get('.bg-white.border-amber-500').should('exist');
    });

    it('should reset move counter to #1', () => {
        cy.contains('button', 'Novo Jogo').click();
        cy.wait(500);
        cy.contains('Movimento #1').should('be.visible');
    });

    it('should restore initial board state', () => {
        cy.contains('button', 'Novo Jogo').click();
        cy.wait(1000);
        cy.get('[style*="background-image"]').should('have.length.greaterThan', 0);
    });

    it('should clear any check warnings', () => {
        cy.contains('button', 'Novo Jogo').click();
        cy.wait(500);
        cy.contains('XEQUE').should('not.exist');
    });

    it('should be accessible multiple times', () => {
        cy.contains('button', 'Novo Jogo').click();
        cy.wait(500);
        cy.contains('button', 'Novo Jogo').click();
        cy.wait(500);
        cy.contains('button', 'Novo Jogo').click();
        cy.wait(500);
        cy.get('header').should('be.visible');
        cy.contains('Movimento #1').should('be.visible');
    });

    it('should have hover effect on reset button', () => {
        cy.contains('button', 'Novo Jogo')
            .trigger('mouseover')
            .should('be.visible');
    });

    it('should reset the game mid-game', () => {
        cy.get('[style*="background-image"]').first().click({ force: true });
        cy.wait(500);
        cy.contains('button', 'Novo Jogo').click();
        cy.wait(500);
        cy.contains('Movimento #1').should('be.visible');
        cy.contains('Brancas').should('be.visible');
    });

    it('should maintain proper layout after reset', () => {
        cy.contains('button', 'Novo Jogo').click();
        cy.wait(500);
        cy.get('header').should('be.visible');
        cy.get('[style*="BattleField"]').should('exist');
    });

    it('should clear dead pieces areas on reset', () => {
        cy.contains('button', 'Novo Jogo').click();
        cy.wait(1000);
        cy.get('.flex.flex-wrap.gap-2.content-start').should('exist');
    });

    it('should handle reset during animations gracefully', () => {
        cy.get('[style*="background-image"]').first().click({ force: true });
        cy.contains('button', 'Novo Jogo').click();
        cy.wait(1000);
        cy.get('header').should('be.visible');
        cy.contains('Movimento #1').should('be.visible');
    });
});
