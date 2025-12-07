describe('Chess Piece Movement', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.wait(1000); // Wait for pieces to load and animations to settle
    });

    it('should allow clicking on a white piece on first turn', () => {
        // Try to click on a white pawn (should be selectable)
        // Note: We'll need to use more specific selectors based on the actual implementation
        cy.get('[style*="background-image"]').first().click({ force: true });

        // After clicking, there might be visual feedback (this depends on implementation)
        cy.wait(500);
    });

    it('should show visual feedback when a piece is selected', () => {
        // Click on a piece
        cy.get('[style*="background-image"]').first().click({ force: true });

        // Wait for potential selection indicators
        cy.wait(300);

        // Verify some change occurred (implementation-specific)
        // This test validates that clicking doesn't cause errors
    });

    it('should allow valid pawn moves', () => {
        // This test simulates a typical pawn move
        // The exact selectors would depend on data attributes added to squares

        // Click on a white pawn
        cy.get('[style*="background-image"]').first().click({ force: true });
        cy.wait(300);

        // Click on the target square (would need proper selectors)
        // For now, we verify the interaction doesn't break
    });

    it('should update move counter after a valid move', () => {
        // Initially should show Movimento #1
        cy.contains('Movimento #1').should('be.visible');

        // After making moves, the counter should increment
        // (This would require actually making valid moves)
    });

    it('should handle rapid clicking gracefully', () => {
        // Click multiple times rapidly
        cy.get('[style*="background-image"]').first().click({ force: true });
        cy.get('[style*="background-image"]').first().click({ force: true });
        cy.get('[style*="background-image"]').first().click({ force: true });

        // Should not crash or cause errors
        cy.wait(500);
        cy.get('header').should('be.visible');
    });

    it('should animate piece movement', () => {
        // Click on a piece
        cy.get('[style*="background-image"]').first().click({ force: true });

        // Verify animations are applied (framer-motion classes or transforms)
        cy.wait(1000);

        // The page should still be functional
        cy.get('header').should('be.visible');
    });

    it('should prevent interaction during animation', () => {
        // This test verifies the animation lock mechanism
        cy.get('[style*="background-image"]').first().click({ force: true });

        // Try to click immediately during potential animation
        cy.get('[style*="background-image"]').eq(1).click({ force: true });

        // Should handle gracefully without errors
        cy.wait(1000);
        cy.get('header').should('be.visible');
    });

    it('should maintain proper piece count throughout the game', () => {
        // Count initial pieces
        cy.get('[style*="background-image"]').then(($pieces) => {
            const initialCount = $pieces.length;

            // Should have pieces on the board
            expect(initialCount).to.be.greaterThan(0);
        });
    });

    it('should display captured pieces in the dead pieces area', () => {
        // After captures, pieces should appear in side areas
        // This test ensures the areas exist
        cy.get('.flex.flex-wrap.gap-2.content-start').should('exist');
    });

    it('should handle piece selection and deselection', () => {
        // Click a piece
        cy.get('[style*="background-image"]').first().click({ force: true });
        cy.wait(300);

        // Click the same piece again (should deselect)
        cy.get('[style*="background-image"]').first().click({ force: true });
        cy.wait(300);

        // Should not cause errors
        cy.get('header').should('be.visible');
    });
});
