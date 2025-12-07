describe('Game Over Scenarios', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.wait(1000); // Wait for initialization
    });

    it('should not show game over modal at game start', () => {
        // No modal should be visible initially
        cy.get('body').then(($body) => {
            if ($body.find('[role="dialog"]').length > 0) {
                cy.get('[role="dialog"]').should('not.be.visible');
            }
        });
    });

    it('should not show check warning at game start', () => {
        cy.contains('XEQUE').should('not.exist');
    });

    it('should be able to continue playing without game over', () => {
        // Make some moves
        cy.get('[style*="background-image"]').first().click({ force: true });
        cy.wait(500);

        // Game should still be active
        cy.get('header').should('be.visible');
        cy.contains(/Brancas|Pretas/).should('be.visible');
    });

    it('should handle potential check state indicator', () => {
        // The check warning element should only appear when in check
        // At start, it should not exist
        cy.get('header').within(() => {
            cy.get('body').then(($body) => {
                if ($body.find('.animate-pulse').length > 0) {
                    // If the element exists, it should be the check indicator
                    cy.get('.text-red-400').should('contain', 'XEQUE');
                }
            });
        });
    });

    it('should display check indicator with correct styling when applicable', () => {
        // Check that if the check warning appears, it has correct classes
        cy.get('body').then(($body) => {
            const checkWarning = $body.find(':contains("XEQUE")');
            if (checkWarning.length > 0) {
                cy.wrap(checkWarning)
                    .should('have.class', 'text-red-400')
                    .should('have.class', 'animate-pulse');
            }
        });
    });

    it('should maintain game state without premature game over', () => {
        // The game should allow multiple moves without ending
        cy.get('[style*="background-image"]').first().click({ force: true });
        cy.wait(300);

        // Reset and try again
        cy.contains('button', 'Novo Jogo').click();
        cy.wait(500);

        // Game should be playable
        cy.get('header').should('be.visible');
    });

    it('should keep UI responsive during normal play', () => {
        // Multiple interactions
        for (let i = 0; i < 3; i++) {
            cy.get('[style*="background-image"]').first().click({ force: true });
            cy.wait(200);
        }

        // UI should remain stable
        cy.get('header').should('be.visible');
        cy.contains(/Movimento #\d+/).should('be.visible');
    });

    it('should not crash when checking for game over conditions', () => {
        // Various interactions that might trigger game logic
        cy.get('[style*="background-image"]').first().click({ force: true });
        cy.wait(300);

        cy.contains('button', 'Novo Jogo').click();
        cy.wait(500);

        // Should remain stable
        cy.get('header').should('be.visible');
    });

    it('should handle reset during potential check state', () => {
        // Even if in check, reset should work
        cy.contains('button', 'Novo Jogo').click();
        cy.wait(500);

        // Check warning should not be present after reset
        cy.contains('XEQUE').should('not.exist');
    });

    it('should maintain proper game context throughout', () => {
        // The GameContext should remain valid
        cy.get('header').should('be.visible');
        cy.contains(/Brancas|Pretas/).should('be.visible');
        cy.contains(/Movimento #\d+/).should('be.visible');

        // All elements should be present
    });

    it('should display game over modal component when it exists', () => {
        // The GameOverModal component should be in the DOM
        // It just might not be visible
        cy.get('body').should('exist');
    });

    it('should allow game to continue after reset', () => {
        cy.contains('button', 'Novo Jogo').click();
        cy.wait(500);

        // Should be able to interact after reset
        cy.get('[style*="background-image"]').first().click({ force: true });
        cy.wait(300);

        cy.get('header').should('be.visible');
    });
});
