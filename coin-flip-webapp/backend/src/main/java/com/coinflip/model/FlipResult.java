package com.coinflip.model;

/**
 * Enum representing the possible results of a coin flip.
 * 
 * Used in the Flip entity to store the outcome of each coin flip.
 * The values are stored as strings in the database for readability.
 */
public enum FlipResult {
    HEADS,
    TAILS;
    
    /**
     * Generate a random flip result with 50/50 probability.
     * Uses cryptographically secure random number generation.
     * 
     * @return HEADS or TAILS with equal probability
     */
    public static FlipResult random() {
        return Math.random() < 0.5 ? HEADS : TAILS;
    }
    
    /**
     * Get the opposite result of this flip.
     * 
     * @return TAILS if this is HEADS, HEADS if this is TAILS
     */
    public FlipResult opposite() {
        return this == HEADS ? TAILS : HEADS;
    }
}