package com.coinflip.dto;

import com.coinflip.model.FlipResult;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Data Transfer Objects for Flip-related API operations.
 */
public class FlipDto {

    /**
     * Request DTO for creating a new flip.
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateRequest {
        private UUID userId;
        private String sessionId;
    }

    /**
     * Request DTO alias for controller compatibility.
     */
    public static class FlipRequest extends CreateRequest {
        public FlipRequest() {
            super();
        }
        
        public FlipRequest(UUID userId, String sessionId) {
            super(userId, sessionId);
        }
    }

    /**
     * Response DTO for flip results.
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private UUID flipId;
        private FlipResult result;
        private LocalDateTime timestamp;
        private String ownerType; // "user" or "guest"
    }

    /**
     * Response DTO alias for controller compatibility.
     */
    @Data
    @EqualsAndHashCode(callSuper=false)
    public static class FlipResponse extends Response {
        @Builder(builderMethodName = "flipResponseBuilder")
        public FlipResponse(UUID flipId, FlipResult result, LocalDateTime timestamp, String ownerType) {
            super(flipId, result, timestamp, ownerType);
        }
    }

    /**
     * Response DTO for paginated history results.
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class HistoryResponse {
        private java.util.List<HistoryEntry> content;
        private long totalElements;
        private int totalPages;
        private int currentPage;
        private int pageSize;
        private boolean first;
        private boolean last;
    }

    /**
     * Response DTO for delete operations.
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DeleteResponse {
        private String message;
        private int deletedCount;
    }

    /**
     * DTO for flip history entries.
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class HistoryEntry {
        private UUID flipId;
        private FlipResult result;
        private LocalDateTime createdAt;
        private Long serialNumber; // For display purposes in UI
    }
}