package com.github.dolphin.monitoring;

import javax.management.NotificationBroadcaster;

public interface PointsCounterMBean extends NotificationBroadcaster {
    int getTotalPoints(); 
    int getHitPoints();
    void notifyOutOfBounds();
    void addPoint(boolean isHit);
}
