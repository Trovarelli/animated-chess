describe('Move History', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.wait(1000); // Wait for initialization
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
        // Make some clicks
        cy.get('[style*="background-image"]').first().click({ force: true });
        cy.wait(500);

        // Counter should still be visible
        cy.contains(/Movimento #\d+/).should('be.visible');
    });

    it('should reset move counter when game is reset', () => {
        // Reset the game
        cy.contains('button', 'Novo Jogo').click();
        cy.wait(500);

        // Counter should be back to #1
        cy.contains('Movimento #1').should('be.visible');
    });

    it('should keep move counter in sync with game state', () => {
        // Initially #1
        cy.contains('Movimento #1').should('be.visible');

        // After interactions, number might change (depends on valid moves)
        cy.get('[style*="background-image"]').first().click({ force: true });
        cy.wait(500);

        // Counter should still be present
        cy.contains(/Movimento #\d+/).should('be.visible');
    });

    it('should display move counter with proper spacing', () => {
        cy.get('header').within(() => {
            cy.get('.flex.items-center.gap-3').should('exist');
        });
    });

    it('should maintain counter visibility after multiple resets', () => {
        // Reset multiple times
        cy.contains('button', 'Novo Jogo').click();
        cy.wait(300);
        cy.contains('button', 'Novo Jogo').click();
        cy.wait(300);

        // Counter should still be visible and at #1
        cy.contains('Movimento #1').should('be.visible');
    });

    it('should show counter next to reset button', () => {
        cy.get('header').within(() => {
            // Both counter and reset button should be in same container
            cy.contains(/Movimento #\d+/).should('be.visible');
            cy.contains('button', 'Novo Jogo').should('be.visible');
        });
    });

    it('should format move counter correctly', () => {
        // Should show format "Movimento #<number>"
        cy.contains(/Movimento #\d+/).should('match', /Movimento #\d+/);
    });

    it('should persist move counter throughout interactions', () => {
        // Multiple clicks
        cy.get('[style*="background-image"]').first().click({ force: true });
        cy.wait(200);
        cy.get('[style*="background-image"]').eq(1).click({ force: true });
        cy.wait(200);

        // Counter should still be there
        cy.contains(/Movimento #\d+/).should('be.visible');
    });
});
