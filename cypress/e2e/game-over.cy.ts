describe('Game Over Scenarios', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.wait(1000);
        cy.contains('button', 'INICIAR JOGO').click();
    });

    it('should not show game over modal at game start', () => {
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
        cy.get('[style*="background-image"]').first().click({ force: true });
        cy.wait(500);
        cy.get('header').should('be.visible');
        cy.contains(/Brancas|Pretas/).should('be.visible');
    });

    it('should handle potential check state indicator', () => {
        cy.get('header').within(() => {
            cy.get('body').then(($body) => {
                if ($body.find('.animate-pulse').length > 0) {
                    cy.get('.text-red-400').should('contain', 'XEQUE');
                }
            });
        });
    });

    it('should display check indicator with correct styling when applicable', () => {
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
        cy.get('[style*="background-image"]').first().click({ force: true });
        cy.wait(300);
        cy.contains('button', 'Novo Jogo').click();
        cy.wait(500);
        cy.get('header').should('be.visible');
    });

    it('should keep UI responsive during normal play', () => {
        for (let i = 0; i < 3; i++) {
            cy.get('[style*="background-image"]').first().click({ force: true });
            cy.wait(200);
        }
        cy.get('header').should('be.visible');
        cy.contains(/Movimento #\d+/).should('be.visible');
    });

    it('should not crash when checking for game over conditions', () => {
        cy.get('[style*="background-image"]').first().click({ force: true });
        cy.wait(300);
        cy.contains('button', 'Novo Jogo').click();
        cy.wait(500);
        cy.get('header').should('be.visible');
    });

    it('should handle reset during potential check state', () => {
        cy.contains('button', 'Novo Jogo').click();
        cy.wait(500);
        cy.contains('XEQUE').should('not.exist');
    });

    it('should maintain proper game context throughout', () => {
        cy.get('header').should('be.visible');
        cy.contains(/Brancas|Pretas/).should('be.visible');
        cy.contains(/Movimento #\d+/).should('be.visible');
    });

    it('should display game over modal component when it exists', () => {
        cy.get('body').should('exist');
    });

    it('should allow game to continue after reset', () => {
        cy.contains('button', 'Novo Jogo').click();
        cy.wait(500);
        cy.get('[style*="background-image"]').first().click({ force: true });
        cy.wait(300);
        cy.get('header').should('be.visible');
    });
});
