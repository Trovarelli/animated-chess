describe('Turn Management', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.wait(1000);
        cy.startGame('human');
    });

    it('should start with white\'s turn', () => {
        cy.contains('Brancas').should('be.visible');
        cy.get('.bg-white.border-amber-500').should('exist');
    });

    it('should display correct turn indicator styling for white', () => {
        cy.get('header').within(() => {
            cy.get('.bg-white.border-amber-500').should('exist');
            cy.get('.shadow-amber-500\\/50').should('exist');
        });
    });

    it('should display move counter starting at #1', () => {
        cy.contains('Movimento #1').should('be.visible');
    });

    it('should show inactive styling for black at start', () => {
        cy.get('header').within(() => {
            cy.get('.bg-gray-900.border-stone-600, .bg-gray-700.border-stone-600').should('exist');
        });
    });

    it('should display both turn indicators simultaneously', () => {
        cy.get('header').within(() => {
            cy.get('.w-5.h-5.rounded-full').should('have.length', 2);
        });
    });

    it('should show "Brancas" text for white turn', () => {
        cy.contains('.text-amber-200', 'Brancas').should('be.visible');
    });

    it('should maintain turn display during rapid clicks', () => {
        cy.get('[style*="background-image"]').first().click({ force: true });
        cy.get('[style*="background-image"]').first().click({ force: true });
        cy.wait(300);
        cy.get('header').within(() => {
            cy.contains(/Brancas|Pretas/).should('be.visible');
        });
    });

    it('should keep move counter visible at all times', () => {
        cy.get('header').within(() => {
            cy.contains(/Movimento #\d+/).should('be.visible');
        });
    });

    it('should not show check warning when not in check', () => {
        cy.contains('XEQUE').should('not.exist');
    });

    it('should display turn indicators with proper spacing', () => {
        cy.get('header').within(() => {
            cy.get('.flex.items-center.gap-3').should('exist');
        });
    });

    it('should show correct text color for turn display', () => {
        cy.get('header').within(() => {
            cy.get('.text-amber-200').should('exist');
        });
    });

    it('should maintain header visibility throughout interactions', () => {
        cy.get('[style*="background-image"]').first().click({ force: true });
        cy.wait(500);
        cy.get('header').should('be.visible');
        cy.contains(/Brancas|Pretas/).should('be.visible');
    });
});
