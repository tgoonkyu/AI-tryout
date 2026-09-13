package com.coinflip.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Data Transfer Objects for Authentication-related API operations.
 */
public class AuthDto {

    /**
     * Request DTO for user registration.
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RegisterRequest {
        
        @NotBlank(message = "Username is required")
        @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
        private String username;
        
        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        @Size(max = 100, message = "Email must not exceed 100 characters")
        private String email;
        
        @NotBlank(message = "Password is required")
        @Size(min = 8, message = "Password must be at least 8 characters long")
        private String password;
    }

    /**
     * Request DTO for user login.
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LoginRequest {
        
        @NotBlank(message = "Username or email is required")
        private String usernameOrEmail;
        
        @NotBlank(message = "Password is required")
        private String password;
    }

    /**
     * Response DTO for successful authentication.
     * Flattened structure for easier frontend integration.
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AuthResponse {
        private String token;
        private String tokenType;
        private Long expiresIn; // seconds
        // Flattened user fields for frontend compatibility
        private UUID userId;
        private String username;
        private String email;
        private Boolean isAdmin;
    }

    /**
     * DTO for user information in auth responses.
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UserInfo {
        private UUID userId;
        private String username;
        private String email;
        private Boolean isAdmin;
        private LocalDateTime createdAt;
    }

    /**
     * Response DTO for token validation.
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TokenValidationResponse {
        private Boolean valid;
        private UserInfo user;
        private Long expiresIn; // seconds until expiration
    }

    /**
     * Response DTO for simple message responses (e.g., logout, success messages).
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MessageResponse {
        private String message;
    }

    /**
     * Response DTO for user profile and validation endpoints.
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UserResponse {
        private UUID userId;
        private String username;
        private String email;
        private Boolean isAdmin;
        private LocalDateTime createdAt;
    }
}