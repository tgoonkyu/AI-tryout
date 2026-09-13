package com.coinflip.repository;

import com.coinflip.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface for User entity operations.
 * 
 * Provides CRUD operations and custom queries for user management,
 * including authentication and user lookup functionality.
 */
@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    /**
     * Find user by username (case-insensitive).
     * 
     * @param username The username to search for
     * @return Optional containing the user if found
     */
    @Query("SELECT u FROM User u WHERE LOWER(u.username) = LOWER(:username)")
    Optional<User> findByUsernameIgnoreCase(@Param("username") String username);

    /**
     * Find user by email (case-insensitive).
     * 
     * @param email The email to search for
     * @return Optional containing the user if found
     */
    @Query("SELECT u FROM User u WHERE LOWER(u.email) = LOWER(:email)")
    Optional<User> findByEmailIgnoreCase(@Param("email") String email);

    /**
     * Find user by username or email (case-insensitive).
     * Used for login where user can provide either username or email.
     * 
     * @param usernameOrEmail The username or email to search for
     * @return Optional containing the user if found
     */
    @Query("SELECT u FROM User u WHERE LOWER(u.username) = LOWER(:usernameOrEmail) OR LOWER(u.email) = LOWER(:usernameOrEmail)")
    Optional<User> findByUsernameOrEmailIgnoreCase(@Param("usernameOrEmail") String usernameOrEmail);

    /**
     * Check if username exists (case-insensitive).
     * 
     * @param username The username to check
     * @return true if username exists, false otherwise
     */
    @Query("SELECT COUNT(u) > 0 FROM User u WHERE LOWER(u.username) = LOWER(:username)")
    boolean existsByUsernameIgnoreCase(@Param("username") String username);

    /**
     * Check if email exists (case-insensitive).
     * 
     * @param email The email to check
     * @return true if email exists, false otherwise
     */
    @Query("SELECT COUNT(u) > 0 FROM User u WHERE LOWER(u.email) = LOWER(:email)")
    boolean existsByEmailIgnoreCase(@Param("email") String email);

    /**
     * Count total number of registered users.
     * 
     * @return Total user count
     */
    @Query("SELECT COUNT(u) FROM User u")
    Long countTotalUsers();

    /**
     * Count number of admin users.
     * 
     * @return Admin user count
     */
    @Query("SELECT COUNT(u) FROM User u WHERE u.isAdmin = true")
    Long countAdminUsers();
}