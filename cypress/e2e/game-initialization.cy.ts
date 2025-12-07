describe('Game Initialization', () => {
    beforeEach(() => {
        // Visit the home page before each test
        cy.visit('/');
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
        // The white turn indicator should have the active styling
        cy.get('header').within(() => {
            cy.contains('Brancas').should('be.visible');

            // Check for the white indicator with active styling
            cy.get('.bg-white.border-amber-500').should('exist');
        });
    });

    it('should display the chessboard', () => {
        // Check if the chessboard container is visible
        cy.get('.relative').should('exist');
    });

    it('should render chess pieces on the board', () => {
        // Give time for pieces to load
        cy.wait(1000);

        // Check for piece images (pawns, rooks, etc.)
        // The pieces use background images with sprites
        cy.get('[style*="background-image"]').should('have.length.greaterThan', 0);
    });

    it('should not display a game over modal initially', () => {
        // Check that there's no visible modal overlay
        cy.get('body').then(($body) => {
            if ($body.find('[role="dialog"]').length > 0) {
                cy.get('[role="dialog"]').should('not.be.visible');
            }
        });
    });

    it('should not show check warning initially', () => {
        // The check warning should not be present at game start
        cy.contains('XEQUE').should('not.exist');
    });

    it('should display the battlefield background', () => {
        // Check for the battlefield background image
        cy.get('[style*="BattleField"]').should('exist');
    });

    it('should have proper viewport dimensions', () => {
        cy.viewport(1280, 720);
        cy.get('header').should('be.visible');
    });

    it('should display turn indicators for both white and black', () => {
        cy.get('header').within(() => {
            // White indicator (active)
            cy.get('.bg-white.border-amber-500').should('exist');

            // Black indicator (inactive)
            cy.get('.bg-gray-900.border-stone-600, .bg-gray-700.border-stone-600').should('exist');
        });
    });
});
