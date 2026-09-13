package com.coinflip;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Main application class for the Coin Flip Application.
 * 
 * This Spring Boot application provides a RESTful API for:
 * - Coin flipping with random results
 * - User authentication and management
 * - Flip history tracking and statistics
 * - Guest and registered user support
 */
@SpringBootApplication
@EnableJpaAuditing
public class CoinFlipApplication {

    public static void main(String[] args) {
        SpringApplication.run(CoinFlipApplication.class, args);
    }
}