package com.coinflip.service;

import com.coinflip.dto.AuthDto;
import com.coinflip.model.User;
import com.coinflip.repository.UserRepository;
import com.coinflip.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Service class for authentication operations.
 * 
 * Features:
 * - User registration with validation
 * - User login with JWT token generation
 * - Token validation and refresh
 * - Password encoding and verification
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    /**
     * Register a new user.
     * 
     * @param request Registration request with user details
     * @return Authentication response with token and user info
     * @throws RuntimeException if username or email already exists
     */
    @Transactional
    public AuthDto.AuthResponse register(AuthDto.RegisterRequest request) {
        log.info("Attempting to register user: {}", request.getUsername());

        // Check if username already exists
        if (userRepository.existsByUsernameIgnoreCase(request.getUsername())) {
            throw new RuntimeException("Username already exists: " + request.getUsername());
        }

        // Check if email already exists
        if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new RuntimeException("Email already exists: " + request.getEmail());
        }

        // Create new user
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .isAdmin(false)
                .build();

        user = userRepository.save(user);
        log.info("User registered successfully: {}", user.getUsername());

        // Generate JWT token
        String token = jwtUtils.generateTokenForUser(user.getUsername());

        return AuthDto.AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .expiresIn(24 * 60 * 60L) // 24 hours in seconds
                .userId(user.getUserId())
                .username(user.getUsername())
                .email(user.getEmail())
                .isAdmin(user.getIsAdmin())
                .build();
    }

    /**
     * Authenticate user and generate JWT token.
     * 
     * @param request Login request with credentials
     * @return Authentication response with token and user info
     * @throws RuntimeException if authentication fails
     */
    public AuthDto.AuthResponse login(AuthDto.LoginRequest request) {
        log.info("Attempting to authenticate user: {}", request.getUsernameOrEmail());

        try {
            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.getUsernameOrEmail(),
                    request.getPassword()
                )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Find user by username or email
            User user = userRepository.findByUsernameOrEmailIgnoreCase(request.getUsernameOrEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Generate JWT token
            String token = jwtUtils.generateToken(authentication);

            log.info("User authenticated successfully: {}", user.getUsername());

            return AuthDto.AuthResponse.builder()
                    .token(token)
                    .tokenType("Bearer")
                    .expiresIn(24 * 60 * 60L) // 24 hours in seconds
                    .userId(user.getUserId())
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .isAdmin(user.getIsAdmin())
                    .build();

        } catch (Exception e) {
            log.error("Authentication failed for user: {}", request.getUsernameOrEmail(), e);
            throw new RuntimeException("Invalid credentials");
        }
    }

    /**
     * Validate JWT token and return user information.
     * 
     * @param token JWT token to validate
     * @return User response with user details
     */
    public AuthDto.UserResponse validateToken(String token) {
        if (jwtUtils.validateToken(token)) {
            String username = jwtUtils.extractUsername(token);
            Optional<User> userOpt = userRepository.findByUsernameIgnoreCase(username);

            if (userOpt.isPresent()) {
                User user = userOpt.get();
                return AuthDto.UserResponse.builder()
                        .userId(user.getUserId())
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .isAdmin(user.getIsAdmin())
                        .createdAt(user.getCreatedAt())
                        .build();
            }
        }
        
        throw new RuntimeException("Invalid or expired token");
    }

    /**
     * Get user by username or email.
     * 
     * @param usernameOrEmail Username or email to search for
     * @return User if found
     */
    public Optional<User> getUserByUsernameOrEmail(String usernameOrEmail) {
        return userRepository.findByUsernameOrEmailIgnoreCase(usernameOrEmail);
    }

    /**
     * Map User entity to UserInfo DTO.
     * 
     * @param user User entity
     * @return UserInfo DTO
     */
    private AuthDto.UserInfo mapToUserInfo(User user) {
        return AuthDto.UserInfo.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .email(user.getEmail())
                .isAdmin(user.getIsAdmin())
                .createdAt(user.getCreatedAt())
                .build();
    }
}