package com.coinflip.service;

import com.coinflip.model.Flip;
import com.coinflip.model.FlipResult;
import com.coinflip.model.User;
import com.coinflip.repository.FlipRepository;
import com.coinflip.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.Optional;
import java.util.UUID;

/**
 * Service for coin flip operations.
 * 
 * Features:
 * - Random coin flip generation (50/50 probability)
 * - Flip persistence for both users and guests
 * - Guest session management
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class FlipService {

    private final FlipRepository flipRepository;
    private final UserRepository userRepository;
    private final SecureRandom secureRandom = new SecureRandom();

    /**
     * Perform a coin flip for a registered user.
     * 
     * @param userId User ID
     * @return Saved flip with result
     */
    @Transactional
    public Flip performFlipForUser(UUID userId) {
        log.debug("Performing flip for user: {}", userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        
        FlipResult result = generateRandomResult();
        
        Flip flip = Flip.builder()
                .user(user)
                .result(result)
                .build();
        
        Flip savedFlip = flipRepository.save(flip);
        log.info("Flip completed for user {}: {}", userId, result);
        
        return savedFlip;
    }

    /**
     * Perform a coin flip for a guest user.
     * 
     * @param sessionId Guest session ID
     * @return Saved flip with result
     */
    @Transactional
    public Flip performFlipForGuest(String sessionId) {
        log.debug("Performing flip for guest session: {}", sessionId);
        
        if (sessionId == null || sessionId.isBlank()) {
            throw new IllegalArgumentException("Session ID is required for guest flips");
        }
        
        FlipResult result = generateRandomResult();
        
        Flip flip = Flip.builder()
                .sessionId(sessionId)
                .result(result)
                .build();
        
        Flip savedFlip = flipRepository.save(flip);
        log.info("Flip completed for guest session {}: {}", sessionId, result);
        
        return savedFlip;
    }

    /**
     * Generate a random coin flip result with 50/50 probability.
     * Uses SecureRandom for cryptographically strong randomness.
     * 
     * @return FlipResult (HEADS or TAILS)
     */
    private FlipResult generateRandomResult() {
        boolean isHeads = secureRandom.nextBoolean();
        return isHeads ? FlipResult.HEADS : FlipResult.TAILS;
    }

    /**
     * Generate a unique session ID for guest users.
     * 
     * @return UUID-based session ID
     */
    public String generateSessionId() {
        return UUID.randomUUID().toString();
    }

}
