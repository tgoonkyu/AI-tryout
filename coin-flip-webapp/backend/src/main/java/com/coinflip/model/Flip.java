package com.coinflip.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Flip entity representing individual coin flip results.
 * 
 * Features:
 * - Supports both registered users (via userId) and guests (via sessionId)
 * - UUID-based primary key for uniqueness across all flips
 * - Indexed for efficient querying by user/session and timestamp
 * - Audit trail with creation timestamp
 */
@Entity
@Table(name = "flips", indexes = {
    @Index(name = "idx_flips_user_created", columnList = "user_id, created_at DESC"),
    @Index(name = "idx_flips_session_created", columnList = "session_id, created_at DESC"),
    @Index(name = "idx_flips_created_at", columnList = "created_at DESC")
})
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Flip {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "flip_id")
    @EqualsAndHashCode.Include
    private UUID flipId;

    /**
     * Foreign key to User entity for registered users.
     * Null for guest users.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    private User user;

    /**
     * Session identifier for guest users.
     * Null for registered users.
     */
    @Column(name = "session_id", length = 100)
    private String sessionId;

    /**
     * The result of the coin flip.
     * Enum values: HEADS, TAILS
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "result", nullable = false, length = 10)
    private FlipResult result;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * Helper method to determine if flip belongs to a registered user
     */
    public boolean isUserFlip() {
        return user != null;
    }

    /**
     * Helper method to determine if flip belongs to a guest session
     */
    public boolean isGuestFlip() {
        return sessionId != null && user == null;
    }

    /**
     * Get the identifier for this flip (either userId or sessionId)
     */
    public String getOwnerIdentifier() {
        return isUserFlip() ? user.getUserId().toString() : sessionId;
    }
}