/// <reference types="cypress" />

declare global {
    namespace Cypress {
        interface Chainable {
            getSquare(row: number, col: number): Chainable<JQuery<HTMLElement>>;
            resetGame(): Chainable<void>;
            waitForAnimation(duration?: number): Chainable<void>;
        }
    }
}

Cypress.Commands.add('getSquare', (row: number, col: number) => {
    return cy.get(`[data-row="${row}"][data-col="${col}"]`);
});

Cypress.Commands.add('resetGame', () => {
    cy.contains('button', 'Novo Jogo').click();
    cy.wait(500);
});

Cypress.Commands.add('waitForAnimation', (duration: number = 1000) => {
    cy.wait(duration);
});

export { };
