describe('Game Initialization', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.wait(1000);
        cy.contains('button', 'INICIAR JOGO').click();
    });

    it('should load the page successfully', () => {
        cy.url().should('eq', 'http://localhost:3000/');
    });

    it('should display the header with game information', () => {
        cy.get('header').should('be.visible');
        cy.contains('Brancas').should('be.visible');
        cy.contains('Movimento #1').should('be.visible');
    });

    it('should display the reset button', () => {
        cy.contains('button', 'Novo Jogo').should('be.visible');
    });

    it('should display white as the starting turn', () => {
        cy.get('header').within(() => {
            cy.contains('Brancas').should('be.visible');
            cy.get('.bg-white.border-amber-500').should('exist');
        });
    });

    it('should display the chessboard', () => {
        cy.get('.relative').should('exist');
    });

    it('should render chess pieces on the board', () => {
        cy.wait(1000);
        cy.get('[style*="background-image"]').should('have.length.greaterThan', 0);
    });

    it('should not display a game over modal initially', () => {
        cy.get('body').then(($body) => {
            if ($body.find('[role="dialog"]').length > 0) {
                cy.get('[role="dialog"]').should('not.be.visible');
            }
        });
    });

    it('should not show check warning initially', () => {
        cy.contains('XEQUE').should('not.exist');
    });

    it('should display the battlefield background', () => {
        cy.get('[style*="BattleField"]').should('exist');
    });

    it('should have proper viewport dimensions', () => {
        cy.viewport(1280, 720);
        cy.get('header').should('be.visible');
    });

    it('should display turn indicators for both white and black', () => {
        cy.get('header').within(() => {
            cy.get('.bg-white.border-amber-500').should('exist');
            cy.get('.bg-gray-900.border-stone-600, .bg-gray-700.border-stone-600').should('exist');
        });
    });
});
