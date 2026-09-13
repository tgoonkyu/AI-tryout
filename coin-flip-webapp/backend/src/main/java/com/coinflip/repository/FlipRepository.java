package com.coinflip.repository;

import com.coinflip.model.Flip;
import com.coinflip.model.FlipResult;
import com.coinflip.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Repository interface for Flip entity operations.
 * 
 * Provides CRUD operations and custom queries for flip management,
 * including history retrieval, statistics calculation, and cleanup operations.
 */
@Repository
public interface FlipRepository extends JpaRepository<Flip, UUID> {

    // ========== User-based queries ==========

    /**
     * Find flips by user with pagination, ordered by creation time (newest first).
     * 
     * @param user The user whose flips to retrieve
     * @param pageable Pagination information
     * @return Page of flips for the user
     */
    Page<Flip> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);

    /**
     * Count total flips for a user.
     * 
     * @param userId The user ID
     * @return Total flip count
     */
    Long countByUser_UserId(UUID userId);

    /**
     * Count flips by result for a user.
     * 
     * @param userId The user ID
     * @param result The flip result (HEADS or TAILS)
     * @return Count of flips with the specified result
     */
    Long countByUser_UserIdAndResult(UUID userId, FlipResult result);

    /**
     * Count total flips for a user (legacy method using User entity).
     * 
     * @param user The user
     * @return Total flip count
     */
    Long countByUser(User user);

    /**
     * Count flips by result for a user.
     * 
     * @param user The user
     * @param result The flip result (HEADS or TAILS)
     * @return Count of flips with the specified result
     */
    Long countByUserAndResult(User user, FlipResult result);

    /**
     * Delete all flips for a user (for reset history functionality).
     * 
     * @param user The user whose flips to delete
     * @return Number of deleted records
     */
    @Modifying
    @Query("DELETE FROM Flip f WHERE f.user = :user")
    int deleteByUser(@Param("user") User user);

    // ========== Session-based queries (for guests) ==========

    /**
     * Find flips by session ID with pagination.
     * 
     * @param sessionId The session ID
     * @param pageable Pagination information
     * @return Page of flips for the session
     */
    Page<Flip> findBySessionId(String sessionId, Pageable pageable);

    /**
     * Find flips by session ID with pagination, ordered by creation time (newest first).
     * 
     * @param sessionId The session ID
     * @param pageable Pagination information
     * @return Page of flips for the session
     */
    Page<Flip> findBySessionIdOrderByCreatedAtDesc(String sessionId, Pageable pageable);

    /**
     * Count total flips for a session.
     * 
     * @param sessionId The session ID
     * @return Total flip count
     */
    Long countBySessionId(String sessionId);

    /**
     * Count flips by result for a session.
     * 
     * @param sessionId The session ID
     * @param result The flip result (HEADS or TAILS)
     * @return Count of flips with the specified result
     */
    Long countBySessionIdAndResult(String sessionId, FlipResult result);

    /**
     * Delete all flips for a session (for reset history functionality).
     * 
     * @param sessionId The session ID whose flips to delete
     * @return Number of deleted records
     */
    @Modifying
    @Query("DELETE FROM Flip f WHERE f.sessionId = :sessionId")
    int deleteBySessionId(@Param("sessionId") String sessionId);

    // ========== Time-based queries ==========

    /**
     * Count user flips after a specific date.
     * 
     * @param userId The user ID
     * @param startDate Start date (inclusive)
     * @return Count of flips after the date
     */
    Long countByUser_UserIdAndCreatedAtAfter(UUID userId, LocalDateTime startDate);

    /**
     * Count user flips by result after a specific date.
     * 
     * @param userId The user ID
     * @param result The flip result
     * @param startDate Start date (inclusive)
     * @return Count of flips with the specified result after the date
     */
    Long countByUser_UserIdAndResultAndCreatedAtAfter(UUID userId, FlipResult result, LocalDateTime startDate);

    /**
     * Count session flips after a specific date.
     * 
     * @param sessionId The session ID
     * @param startDate Start date (inclusive)
     * @return Count of flips after the date
     */
    Long countBySessionIdAndCreatedAtAfter(String sessionId, LocalDateTime startDate);

    /**
     * Count session flips by result after a specific date.
     * 
     * @param sessionId The session ID
     * @param result The flip result
     * @param startDate Start date (inclusive)
     * @return Count of flips with the specified result after the date
     */
    Long countBySessionIdAndResultAndCreatedAtAfter(String sessionId, FlipResult result, LocalDateTime startDate);

    // ========== Time-based queries (existing) ==========

    /**
     * Count user flips within a date range.
     * 
     * @param user The user
     * @param startDate Start of the date range (inclusive)
     * @param endDate End of the date range (exclusive)
     * @return Count of flips in the date range
     */
    @Query("SELECT COUNT(f) FROM Flip f WHERE f.user = :user AND f.createdAt >= :startDate AND f.createdAt < :endDate")
    Long countByUserAndCreatedAtBetween(@Param("user") User user, 
                                       @Param("startDate") LocalDateTime startDate, 
                                       @Param("endDate") LocalDateTime endDate);

    /**
     * Count user flips by result within a date range.
     * 
     * @param user The user
     * @param result The flip result
     * @param startDate Start of the date range (inclusive)
     * @param endDate End of the date range (exclusive)
     * @return Count of flips with the specified result in the date range
     */
    @Query("SELECT COUNT(f) FROM Flip f WHERE f.user = :user AND f.result = :result AND f.createdAt >= :startDate AND f.createdAt < :endDate")
    Long countByUserAndResultAndCreatedAtBetween(@Param("user") User user, 
                                               @Param("result") FlipResult result,
                                               @Param("startDate") LocalDateTime startDate, 
                                               @Param("endDate") LocalDateTime endDate);

    /**
     * Count session flips within a date range.
     * 
     * @param sessionId The session ID
     * @param startDate Start of the date range (inclusive)
     * @param endDate End of the date range (exclusive)
     * @return Count of flips in the date range
     */
    @Query("SELECT COUNT(f) FROM Flip f WHERE f.sessionId = :sessionId AND f.createdAt >= :startDate AND f.createdAt < :endDate")
    Long countBySessionIdAndCreatedAtBetween(@Param("sessionId") String sessionId, 
                                           @Param("startDate") LocalDateTime startDate, 
                                           @Param("endDate") LocalDateTime endDate);

    /**
     * Count session flips by result within a date range.
     * 
     * @param sessionId The session ID
     * @param result The flip result
     * @param startDate Start of the date range (inclusive)
     * @param endDate End of the date range (exclusive)
     * @return Count of flips with the specified result in the date range
     */
    @Query("SELECT COUNT(f) FROM Flip f WHERE f.sessionId = :sessionId AND f.result = :result AND f.createdAt >= :startDate AND f.createdAt < :endDate")
    Long countBySessionIdAndResultAndCreatedAtBetween(@Param("sessionId") String sessionId, 
                                                    @Param("result") FlipResult result,
                                                    @Param("startDate") LocalDateTime startDate, 
                                                    @Param("endDate") LocalDateTime endDate);

    // ========== System-wide statistics (for admin) ==========

    /**
     * Count total flips in the system.
     * 
     * @return Total flip count across all users and sessions
     */
    @Query("SELECT COUNT(f) FROM Flip f")
    Long countTotalFlips();

    /**
     * Count total flips by result in the system.
     * 
     * @param result The flip result
     * @return Total count of flips with the specified result
     */
    @Query("SELECT COUNT(f) FROM Flip f WHERE f.result = :result")
    Long countTotalFlipsByResult(@Param("result") FlipResult result);

    // ========== Cleanup operations ==========

    /**
     * Delete old guest session flips (cleanup job for old sessions).
     * 
     * @param daysToKeep Number of days to keep guest flips
     * @return Number of deleted records
     */

    /**
     * Delete old guest session flips by cutoff date.
     * 
     * @param cutoffDate Flips created before this date will be deleted
     * @return Number of deleted records
     */
    @Modifying
    @Query("DELETE FROM Flip f WHERE f.sessionId IS NOT NULL AND f.createdAt < :cutoffDate")
    int deleteOldGuestFlipsByDate(@Param("cutoffDate") LocalDateTime cutoffDate);
}