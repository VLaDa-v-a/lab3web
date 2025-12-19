package com.github.dolphin.monitoring;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

public class TimeInterval implements TimeIntervalMBean, Serializable {
    private long intervalInSeconds;
    private final LocalDateTime startTime;

    public TimeInterval() {
        this.startTime = LocalDateTime.now();
    }

    public double getIntervalInSeconds() {
        return intervalInSeconds;
    }

    @Override
    public void calculateTime() {
        intervalInSeconds = ChronoUnit.SECONDS.between(startTime, LocalDateTime.now());
    }
}
