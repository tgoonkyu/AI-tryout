package com.coinflip.controller;

import com.coinflip.dto.StatsDto;
import com.coinflip.model.User;
import com.coinflip.repository.UserRepository;
import com.coinflip.security.JwtUtils;
import com.coinflip.service.StatsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * REST controller for statistics operations.
 * 
 * Endpoints:
 * - GET /api/stats/summary - Get comprehensive statistics
 */
@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class StatsController {

    private final StatsService statsService;
    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;

    /**
     * Get comprehensive flip statistics.
     * Supports both authenticated users and guest sessions.
     * 
     * @param sessionId Optional session ID (required for guest stats)
     * @param authHeader Optional Authorization header
     * @return StatsResponse with all statistics
     */
    @GetMapping("/summary")
    public ResponseEntity<StatsDto.StatsResponse> getStatistics(
            @RequestParam(required = false) String sessionId,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        
        StatsDto.StatsResponse stats;
        
        // Authenticated user request
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                String username = jwtUtils.extractUsername(token);
                log.debug("Fetching statistics for user: {}", username);
                
                User user = userRepository.findByUsernameIgnoreCase(username)
                        .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));
                
                stats = statsService.getUserStatistics(user.getUserId());
            } catch (Exception e) {
                log.error("Failed to get user statistics: {}", e.getMessage());
                throw new IllegalArgumentException("Invalid authentication token");
            }
        } 
        // Guest request
        else if (sessionId != null && !sessionId.isBlank()) {
            log.debug("Fetching statistics for guest session: {}", sessionId);
            stats = statsService.getGuestStatistics(sessionId);
        } 
        // No authentication or session
        else {
            throw new IllegalArgumentException("Either authentication token or session ID is required");
        }
        
        return ResponseEntity.ok(stats);
    }
}
