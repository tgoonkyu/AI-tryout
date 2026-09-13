package com.coinflip.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Data Transfer Objects for Statistics-related API operations.
 */
public class StatsDto {

    /**
     * Response DTO for user statistics summary.
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SummaryResponse {
        private Long totalFlips;
        private Long headsCount;
        private Long tailsCount;
        private BigDecimal headsRatio; // Percentage (0-100)
        private BigDecimal tailsRatio; // Percentage (0-100)
        private PeriodStats today;
        private PeriodStats thisWeek;
        private PeriodStats thisMonth;
    }

    /**
     * Alias for SummaryResponse for controller compatibility.
     */
    public static class StatsResponse extends SummaryResponse {
        @Builder(builderMethodName = "statsResponseBuilder")
        public StatsResponse(Long totalFlips, Long headsCount, Long tailsCount,
                           BigDecimal headsRatio, BigDecimal tailsRatio,
                           PeriodStats today, PeriodStats thisWeek, PeriodStats thisMonth) {
            super(totalFlips, headsCount, tailsCount, headsRatio, tailsRatio, today, thisWeek, thisMonth);
        }
    }

    /**
     * DTO for statistics within a specific time period.
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PeriodStats {
        private Long totalFlips;
        private Long headsCount;
        private Long tailsCount;
        private BigDecimal headsRatio;
        private LocalDate startDate;
        private LocalDate endDate;
    }

    /**
     * Response DTO for timeline statistics (future feature).
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TimelineResponse {
        private String period; // "day", "week", "month"
        private java.util.List<TimelineEntry> entries;
    }

    /**
     * DTO for individual timeline entry.
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TimelineEntry {
        private LocalDate date;
        private Long totalFlips;
        private Long headsCount;
        private Long tailsCount;
    }
}