package com.coinflip.controller;

import com.coinflip.dto.AuthDto;
import com.coinflip.model.User;
import com.coinflip.repository.UserRepository;
import com.coinflip.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * REST controller for user profile operations.
 * 
 * Endpoints:
 * - GET /api/user/profile - Get user profile details
 * - PUT /api/user/profile - Update user profile (future)
 */
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class UserController {

    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;

    /**
     * Get authenticated user's profile.
     * 
     * @param authHeader Authorization header with JWT token
     * @return UserResponse with profile details
     */
    @GetMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AuthDto.UserResponse> getProfile(
            @RequestHeader("Authorization") String authHeader) {
        
        String token = authHeader.replace("Bearer ", "");
        String username = jwtUtils.extractUsername(token);
        
        log.debug("Fetching profile for user: {}", username);
        
        User user = userRepository.findByUsernameIgnoreCase(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));
        
        AuthDto.UserResponse response = AuthDto.UserResponse.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .email(user.getEmail())
                .isAdmin(user.hasAdminRole())
                .createdAt(user.getCreatedAt())
                .build();
        
        return ResponseEntity.ok(response);
    }

    /**
     * Get user profile by ID (admin only).
     * 
     * @param userId User ID
     * @return UserResponse with profile details
     */
    @GetMapping("/profile/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AuthDto.UserResponse> getUserById(@PathVariable UUID userId) {
        log.debug("Admin fetching profile for user ID: {}", userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        
        AuthDto.UserResponse response = AuthDto.UserResponse.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .email(user.getEmail())
                .isAdmin(user.hasAdminRole())
                .createdAt(user.getCreatedAt())
                .build();
        
        return ResponseEntity.ok(response);
    }
}
