package com.coinflip.controller;

import com.coinflip.dto.AuthDto;
import com.coinflip.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for authentication endpoints.
 * 
 * Endpoints:
 * - POST /api/auth/register - User registration
 * - POST /api/auth/login - User login with JWT
 * - POST /api/auth/logout - User logout
 * - GET /api/auth/validate - Token validation
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AuthController {

    private final AuthService authService;

    /**
     * Register a new user.
     * 
     * @param request Registration details (username, email, password)
     * @return AuthResponse with JWT token and user details
     */
    @PostMapping("/register")
    public ResponseEntity<AuthDto.AuthResponse> register(@Valid @RequestBody AuthDto.RegisterRequest request) {
        AuthDto.AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Login user and generate JWT token.
     * 
     * @param request Login credentials (username/email and password)
     * @return AuthResponse with JWT token and user details
     */
    @PostMapping("/login")
    public ResponseEntity<AuthDto.AuthResponse> login(@Valid @RequestBody AuthDto.LoginRequest request) {
        AuthDto.AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Logout user (client-side token removal).
     * 
     * @return Success message
     */
    @PostMapping("/logout")
    public ResponseEntity<AuthDto.MessageResponse> logout() {
        // With JWT, logout is primarily client-side (remove token)
        // Server-side blacklisting can be added in future with Redis
        return ResponseEntity.ok(new AuthDto.MessageResponse("Logout successful"));
    }

    /**
     * Validate JWT token and return user information.
     * 
     * @param token JWT token from Authorization header
     * @return User information if token is valid
     */
    @GetMapping("/validate")
    public ResponseEntity<AuthDto.UserResponse> validateToken(@RequestHeader("Authorization") String token) {
        // Remove "Bearer " prefix
        String jwtToken = token.replace("Bearer ", "");
        AuthDto.UserResponse response = authService.validateToken(jwtToken);
        return ResponseEntity.ok(response);
    }
}
