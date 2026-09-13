package com.coinflip.controller;

import com.coinflip.dto.FlipDto;
import com.coinflip.model.Flip;
import com.coinflip.model.User;
import com.coinflip.repository.UserRepository;
import com.coinflip.security.JwtUtils;
import com.coinflip.service.FlipService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * REST controller for coin flip operations.
 * 
 * Endpoints:
 * - POST /api/flip - Perform a coin flip (public, supports both users and guests)
 */
@RestController
@RequestMapping("/api/flip")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class FlipController {

    private final FlipService flipService;
    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;

    /**
     * Perform a coin flip.
     * Supports both authenticated users and guest sessions.
     * 
     * @param request Flip request with optional userId or sessionId
     * @param authHeader Optional Authorization header with JWT token
     * @return FlipResponse with result, timestamp, and flip ID
     */
    @PostMapping
    public ResponseEntity<FlipDto.FlipResponse> performFlip(
            @Valid @RequestBody FlipDto.FlipRequest request,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        
        Flip flip;
        
        // If Authorization header is present, extract user ID from token
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                String username = jwtUtils.extractUsername(token);
                log.debug("Performing flip for authenticated user: {}", username);
                
                // Look up user by username
                User user = userRepository.findByUsernameIgnoreCase(username)
                        .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));
                
                flip = flipService.performFlipForUser(user.getUserId());
            } catch (Exception e) {
                log.warn("Token validation failed, treating as guest: {}", e.getMessage());
                // Fall back to guest flip
                String sessionId = request.getSessionId() != null 
                        ? request.getSessionId() 
                        : flipService.generateSessionId();
                flip = flipService.performFlipForGuest(sessionId);
            }
        } else {
            // Guest flip
            log.debug("Performing flip for guest session: {}", request.getSessionId());
            String sessionId = request.getSessionId() != null 
                    ? request.getSessionId() 
                    : flipService.generateSessionId();
            flip = flipService.performFlipForGuest(sessionId);
        }
        
        FlipDto.FlipResponse response = FlipDto.FlipResponse.flipResponseBuilder()
                .flipId(flip.getFlipId())
                .result(flip.getResult())
                .timestamp(flip.getCreatedAt())
                .ownerType(flip.isUserFlip() ? "user" : "guest")
                .build();
        
        return ResponseEntity.ok(response);
    }
}
