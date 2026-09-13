package com.coinflip.controller;

import com.coinflip.dto.FlipDto;
import com.coinflip.model.Flip;
import com.coinflip.model.User;
import com.coinflip.repository.FlipRepository;
import com.coinflip.repository.UserRepository;
import com.coinflip.security.JwtUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * REST controller for flip history operations.
 * 
 * Endpoints:
 * - GET /api/history - Get paginated flip history
 * - DELETE /api/history - Clear user's flip history
 */
@RestController
@RequestMapping("/api/history")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class HistoryController {

    private final FlipRepository flipRepository;
    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;

    /**
     * Get paginated flip history for user or guest.
     * 
     * @param page Page number (0-indexed)
     * @param size Page size (default 10, max 25)
     * @param sort Sort direction (default: createdAt,desc)
     * @param sessionId Optional session ID for guest history
     * @param authHeader Optional Authorization header for user history
     * @return Paginated list of flips
     */
    @GetMapping
    public ResponseEntity<FlipDto.HistoryResponse> getHistory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort,
            @RequestParam(required = false) String sessionId,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        
        // Validate and cap page size
        if (size > 25) {
            size = 25;
        }
        if (size < 1) {
            size = 10;
        }
        
        // Parse sort parameter
        String[] sortParams = sort.split(",");
        String sortBy = sortParams[0];
        Sort.Direction direction = sortParams.length > 1 && sortParams[1].equalsIgnoreCase("asc") 
                ? Sort.Direction.ASC 
                : Sort.Direction.DESC;
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<Flip> flipsPage;
        
        // Determine if user or guest request
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                String username = jwtUtils.extractUsername(token);
                log.debug("Fetching history for user: {}", username);
                User user = userRepository.findByUsernameIgnoreCase(username)
                        .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));
                flipsPage = flipRepository.findByUserOrderByCreatedAtDesc(user, pageable);
            } catch (Exception e) {
                log.warn("Token validation failed: {}", e.getMessage());
                flipsPage = Page.empty(pageable);
            }
        } else if (sessionId != null && !sessionId.isBlank()) {
            log.debug("Fetching history for guest session: {}", sessionId);
            flipsPage = flipRepository.findBySessionIdOrderByCreatedAtDesc(sessionId, pageable);
        } else {
            log.warn("No authentication or session ID provided");
            flipsPage = Page.empty(pageable);
        }
        
        // Convert to DTOs
        List<FlipDto.HistoryEntry> entries = flipsPage.getContent().stream()
                .map(flip -> FlipDto.HistoryEntry.builder()
                        .flipId(flip.getFlipId())
                        .result(flip.getResult())
                        .createdAt(flip.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
        
        FlipDto.HistoryResponse response = FlipDto.HistoryResponse.builder()
                .content(entries)
                .totalElements(flipsPage.getTotalElements())
                .totalPages(flipsPage.getTotalPages())
                .currentPage(flipsPage.getNumber())
                .pageSize(flipsPage.getSize())
                .first(flipsPage.isFirst())
                .last(flipsPage.isLast())
                .build();
        
        return ResponseEntity.ok(response);
    }

    /**
     * Clear all flip history for the authenticated user or guest session.
     * 
     * @param sessionId Optional session ID for guest history
     * @param authHeader Optional Authorization header for user history
     * @return Success message with count of deleted flips
     */
    @DeleteMapping
    @Transactional
    public ResponseEntity<FlipDto.DeleteResponse> clearHistory(
            @RequestParam(required = false) String sessionId,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        
        int deletedCount = 0;
        
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                String username = jwtUtils.extractUsername(token);
                log.info("Clearing history for user: {}", username);
                User user = userRepository.findByUsernameIgnoreCase(username)
                        .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));
                deletedCount = flipRepository.deleteByUser(user);
            } catch (Exception e) {
                log.error("Failed to clear user history: {}", e.getMessage());
                throw new IllegalArgumentException("Invalid authentication token");
            }
        } else if (sessionId != null && !sessionId.isBlank()) {
            log.info("Clearing history for guest session: {}", sessionId);
            deletedCount = flipRepository.deleteBySessionId(sessionId);
        } else {
            throw new IllegalArgumentException("Either authentication token or session ID is required");
        }
        
        FlipDto.DeleteResponse response = FlipDto.DeleteResponse.builder()
                .message("History cleared successfully")
                .deletedCount(deletedCount)
                .build();
        
        return ResponseEntity.ok(response);
    }
}
