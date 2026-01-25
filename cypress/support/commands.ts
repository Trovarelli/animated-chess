/// <reference types="cypress" />

declare global {
    namespace Cypress {
        interface Chainable {
            getSquare(row: number, col: number): Chainable<JQuery<HTMLElement>>;
            clickSquare(row: number, col: number): Chainable<void>;
            clickPiece(row: number, col: number): Chainable<void>;
            resetGame(): Chainable<void>;
            waitForAnimation(duration?: number): Chainable<void>;
        }
    }
}

Cypress.Commands.add('getSquare', (row: number, col: number) => {
    return cy.get(`[data-row="${row}"][data-col="${col}"]`);
});

Cypress.Commands.add('clickSquare', (row: number, col: number) => {
    // Wait for either the indicator div OR the capture indicator on the square
    cy.get(`[data-testid="square"][data-row="${row}"][data-col="${col}"]`, { timeout: 10000 })
        .should('satisfy', ($el) => {
            return $el.find('[data-testid="move-indicator"]').length > 0 || $el.attr('data-has-enemy') === 'true';
        });
    cy.get(`[data-testid="square"][data-row="${row}"][data-col="${col}"]`).click({ force: true });
});

Cypress.Commands.add('clickPiece', (row: number, col: number) => {
    cy.get(`[data-testid="piece"][data-row="${row}"][data-col="${col}"]`, { timeout: 10000 })
        .click({ force: true })
        .should('have.attr', 'data-selected', 'true');
});

Cypress.Commands.add('resetGame', () => {
    cy.contains('button', 'Novo Jogo').click();
    cy.wait(500);
});

Cypress.Commands.add('waitForAnimation', (duration: number = 1000) => {
    cy.wait(duration);
});

export { };
