describe('Move History', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.wait(1000);
        cy.startGame('human');
    });

    it('should display initial move counter', () => {
        cy.contains('Movimento #1').should('be.visible');
    });

    it('should show move counter in header', () => {
        cy.get('header').within(() => {
            cy.contains(/Movimento #\d+/).should('be.visible');
        });
    });

    it('should display counter with correct styling', () => {
        cy.get('.text-amber-400\\/90').contains(/Movimento #\d+/).should('be.visible');
    });

    it('should maintain move counter visibility during game', () => {
        cy.get('[style*="background-image"]').first().click({ force: true });
        cy.wait(500);
        cy.contains(/Movimento #\d+/).should('be.visible');
    });

    it('should reset move counter when game is reset', () => {
        cy.resetGame('human');
        cy.contains('Movimento #1').should('be.visible');
    });

    it('should keep move counter in sync with game state', () => {
        cy.contains('Movimento #1').should('be.visible');
        cy.get('[style*="background-image"]').first().click({ force: true });
        cy.wait(500);
        cy.contains(/Movimento #\d+/).should('be.visible');
    });

    it('should display move counter with proper spacing', () => {
        cy.get('header').within(() => {
            cy.get('.flex.items-center.gap-3').should('exist');
        });
    });

    it('should maintain counter visibility after multiple resets', () => {
        cy.resetGame('human');
        cy.resetGame('human');
        cy.contains('Movimento #1').should('be.visible');
    });

    it('should show counter next to reset button', () => {
        cy.get('header').within(() => {
            cy.contains(/Movimento #\d+/).should('be.visible');
            cy.contains('button', 'Novo Jogo').should('be.visible');
        });
    });

    it('should format move counter correctly', () => {
        cy.contains(/Movimento #\d+/).should('match', /Movimento #\d+/);
    });

    it('should persist move counter throughout interactions', () => {
        cy.get('[style*="background-image"]').first().click({ force: true });
        cy.wait(200);
        cy.get('[style*="background-image"]').eq(1).click({ force: true });
        cy.wait(200);
        cy.contains(/Movimento #\d+/).should('be.visible');
    });
});
