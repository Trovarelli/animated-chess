describe('Faction Selection', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.wait(1000);
    });

    it('should display the splash screen with faction buttons', () => {
        cy.contains('button', 'HUMANOS').should('be.visible');
        cy.contains('button', 'ORCS').should('be.visible');
    });

    it('should display "Escolha sua facção" label', () => {
        cy.contains('Escolha sua facção').should('be.visible');
    });

    it('should start game when HUMANOS is selected', () => {
        cy.contains('button', 'HUMANOS').click();
        cy.wait(500);
        cy.get('header').should('be.visible');
        cy.contains('Movimento #1').should('be.visible');
    });

    it('should start game when ORCS is selected', () => {
        cy.contains('button', 'ORCS').click();
        cy.wait(500);
        cy.get('header').should('be.visible');
        cy.contains('Movimento #1').should('be.visible');
    });

    it('should display correct panel labels for HUMANOS faction', () => {
        cy.contains('button', 'HUMANOS').click();
        cy.wait(500);
        cy.contains('HUMANOS').should('be.visible');
        cy.contains('ORCS').should('be.visible');
    });

    it('should hide splash screen after faction selection', () => {
        cy.contains('button', 'HUMANOS').click();
        cy.wait(1000);
        cy.contains('Escolha sua facção').should('not.exist');
    });

    it('should show splash screen again after reset', () => {
        cy.contains('button', 'HUMANOS').click();
        cy.wait(500);
        cy.contains('button', 'Novo Jogo').click();
        cy.wait(500);
        cy.contains('button', 'HUMANOS').should('be.visible');
        cy.contains('button', 'ORCS').should('be.visible');
    });

    it('should persist game state on page reload', () => {
        cy.contains('button', 'HUMANOS').click();
        cy.wait(500);
        cy.get('header').should('be.visible');
        cy.reload();
        cy.wait(1000);
        cy.get('header').should('be.visible');
        cy.contains('Escolha sua facção').should('not.exist');
    });

    it('should clear persisted state after reset', () => {
        cy.contains('button', 'HUMANOS').click();
        cy.wait(500);
        cy.contains('button', 'Novo Jogo').click();
        cy.wait(500);
        cy.contains('Escolha sua facção').should('be.visible');
    });
});
