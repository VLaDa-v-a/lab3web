package com.github.dolphin.monitoring;

public interface TimeIntervalMBean {
    void calculateTime();
    double getIntervalInSeconds();
}
