/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
    namespace Cypress {
        interface Chainable {
            /**
             * Custom command to select a square on the chessboard
             * @param row - Row index (0-7)
             * @param col - Column index (0-7)
             * @example cy.getSquare(0, 0)
             */
            getSquare(row: number, col: number): Chainable<JQuery<HTMLElement>>;

            /**
             * Custom command to click the reset game button
             * @example cy.resetGame()
             */
            resetGame(): Chainable<void>;

            /**
             * Custom command to wait for animations to complete
             * @param duration - Optional duration in ms (default 1000)
             * @example cy.waitForAnimation()
             */
            waitForAnimation(duration?: number): Chainable<void>;
        }
    }
}

// Get a specific square on the chessboard
Cypress.Commands.add('getSquare', (row: number, col: number) => {
    // Using data attributes would be more reliable, but we'll use index-based selection
    return cy.get(`[data-row="${row}"][data-col="${col}"]`);
});

// Click the reset button
Cypress.Commands.add('resetGame', () => {
    cy.contains('button', 'Novo Jogo').click();
    cy.wait(500); // Wait for reset animation
});

// Wait for animations to complete
Cypress.Commands.add('waitForAnimation', (duration: number = 1000) => {
    cy.wait(duration);
});

export { };
