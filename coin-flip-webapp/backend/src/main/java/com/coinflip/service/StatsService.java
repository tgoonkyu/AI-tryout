package com.coinflip.service;

import com.coinflip.dto.StatsDto;
import com.coinflip.model.FlipResult;
import com.coinflip.repository.FlipRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

/**
 * Service for calculating flip statistics.
 * 
 * Features:
 * - Total flip counts
 * - Heads/Tails ratio calculations
 * - Time-based statistics (today, this week, this month)
 * - Guest and user statistics
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class StatsService {

    private final FlipRepository flipRepository;

    /**
     * Get comprehensive statistics for a user.
     * 
     * @param userId User ID
     * @return StatsResponse with all statistics
     */
    public StatsDto.StatsResponse getUserStatistics(UUID userId) {
        log.debug("Calculating statistics for user: {}", userId);
        
        // Total statistics
        long totalFlips = flipRepository.countByUser_UserId(userId);
        long headsCount = flipRepository.countByUser_UserIdAndResult(userId, FlipResult.HEADS);
        long tailsCount = flipRepository.countByUser_UserIdAndResult(userId, FlipResult.TAILS);
        
        // Time-based statistics
        LocalDateTime now = LocalDateTime.now();
        
        // Today (start of day to now)
        LocalDateTime startOfDay = now.truncatedTo(ChronoUnit.DAYS);
        long todayCount = flipRepository.countByUser_UserIdAndCreatedAtAfter(userId, startOfDay);
        long todayHeads = flipRepository.countByUser_UserIdAndResultAndCreatedAtAfter(userId, FlipResult.HEADS, startOfDay);
        long todayTails = flipRepository.countByUser_UserIdAndResultAndCreatedAtAfter(userId, FlipResult.TAILS, startOfDay);
        
        // This week (last 7 days)
        LocalDateTime startOfWeek = now.minusDays(7);
        long weekCount = flipRepository.countByUser_UserIdAndCreatedAtAfter(userId, startOfWeek);
        long weekHeads = flipRepository.countByUser_UserIdAndResultAndCreatedAtAfter(userId, FlipResult.HEADS, startOfWeek);
        long weekTails = flipRepository.countByUser_UserIdAndResultAndCreatedAtAfter(userId, FlipResult.TAILS, startOfWeek);
        
        // This month (last 30 days)
        LocalDateTime startOfMonth = now.minusDays(30);
        long monthCount = flipRepository.countByUser_UserIdAndCreatedAtAfter(userId, startOfMonth);
        long monthHeads = flipRepository.countByUser_UserIdAndResultAndCreatedAtAfter(userId, FlipResult.HEADS, startOfMonth);
        long monthTails = flipRepository.countByUser_UserIdAndResultAndCreatedAtAfter(userId, FlipResult.TAILS, startOfMonth);
        
        return buildStatsResponse(totalFlips, headsCount, tailsCount,
                todayCount, todayHeads, todayTails,
                weekCount, weekHeads, weekTails,
                monthCount, monthHeads, monthTails);
    }

    /**
     * Get comprehensive statistics for a guest session.
     * 
     * @param sessionId Guest session ID
     * @return StatsResponse with all statistics
     */
    public StatsDto.StatsResponse getGuestStatistics(String sessionId) {
        log.debug("Calculating statistics for guest session: {}", sessionId);
        
        // Total statistics
        long totalFlips = flipRepository.countBySessionId(sessionId);
        long headsCount = flipRepository.countBySessionIdAndResult(sessionId, FlipResult.HEADS);
        long tailsCount = flipRepository.countBySessionIdAndResult(sessionId, FlipResult.TAILS);
        
        // Time-based statistics
        LocalDateTime now = LocalDateTime.now();
        
        // Today
        LocalDateTime startOfDay = now.truncatedTo(ChronoUnit.DAYS);
        long todayCount = flipRepository.countBySessionIdAndCreatedAtAfter(sessionId, startOfDay);
        long todayHeads = flipRepository.countBySessionIdAndResultAndCreatedAtAfter(sessionId, FlipResult.HEADS, startOfDay);
        long todayTails = flipRepository.countBySessionIdAndResultAndCreatedAtAfter(sessionId, FlipResult.TAILS, startOfDay);
        
        // This week
        LocalDateTime startOfWeek = now.minusDays(7);
        long weekCount = flipRepository.countBySessionIdAndCreatedAtAfter(sessionId, startOfWeek);
        long weekHeads = flipRepository.countBySessionIdAndResultAndCreatedAtAfter(sessionId, FlipResult.HEADS, startOfWeek);
        long weekTails = flipRepository.countBySessionIdAndResultAndCreatedAtAfter(sessionId, FlipResult.TAILS, startOfWeek);
        
        // This month
        LocalDateTime startOfMonth = now.minusDays(30);
        long monthCount = flipRepository.countBySessionIdAndCreatedAtAfter(sessionId, startOfMonth);
        long monthHeads = flipRepository.countBySessionIdAndResultAndCreatedAtAfter(sessionId, FlipResult.HEADS, startOfMonth);
        long monthTails = flipRepository.countBySessionIdAndResultAndCreatedAtAfter(sessionId, FlipResult.TAILS, startOfMonth);
        
        return buildStatsResponse(totalFlips, headsCount, tailsCount,
                todayCount, todayHeads, todayTails,
                weekCount, weekHeads, weekTails,
                monthCount, monthHeads, monthTails);
    }

    /**
     * Build statistics response DTO with ratio calculations.
     */
    private StatsDto.StatsResponse buildStatsResponse(
            long totalFlips, long headsCount, long tailsCount,
            long todayCount, long todayHeads, long todayTails,
            long weekCount, long weekHeads, long weekTails,
            long monthCount, long monthHeads, long monthTails) {
        
        // Calculate ratios (avoid division by zero)
        BigDecimal headsRatio = totalFlips > 0 ? BigDecimal.valueOf((double) headsCount / totalFlips) : BigDecimal.ZERO;
        BigDecimal tailsRatio = totalFlips > 0 ? BigDecimal.valueOf((double) tailsCount / totalFlips) : BigDecimal.ZERO;
        
        // Build period stats
        StatsDto.PeriodStats today = StatsDto.PeriodStats.builder()
                .totalFlips(todayCount)
                .headsCount(todayHeads)
                .tailsCount(todayTails)
                .headsRatio(todayCount > 0 ? BigDecimal.valueOf((double) todayHeads / todayCount) : BigDecimal.ZERO)
                .build();
        
        StatsDto.PeriodStats thisWeek = StatsDto.PeriodStats.builder()
                .totalFlips(weekCount)
                .headsCount(weekHeads)
                .tailsCount(weekTails)
                .headsRatio(weekCount > 0 ? BigDecimal.valueOf((double) weekHeads / weekCount) : BigDecimal.ZERO)
                .build();
        
        StatsDto.PeriodStats thisMonth = StatsDto.PeriodStats.builder()
                .totalFlips(monthCount)
                .headsCount(monthHeads)
                .tailsCount(monthTails)
                .headsRatio(monthCount > 0 ? BigDecimal.valueOf((double) monthHeads / monthCount) : BigDecimal.ZERO)
                .build();
        
        return StatsDto.StatsResponse.statsResponseBuilder()
                .totalFlips(totalFlips)
                .headsCount(headsCount)
                .tailsCount(tailsCount)
                .headsRatio(headsRatio)
                .tailsRatio(tailsRatio)
                .today(today)
                .thisWeek(thisWeek)
                .thisMonth(thisMonth)
                .build();
    }
}
