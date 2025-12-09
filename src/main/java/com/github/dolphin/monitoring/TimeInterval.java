package com.github.dolphin.monitoring;


import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Named;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Named("timeInterval")
@ApplicationScoped
public class TimeInterval implements TimeIntervalMBean {
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