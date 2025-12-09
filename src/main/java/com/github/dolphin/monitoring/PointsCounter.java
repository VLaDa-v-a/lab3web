package com.github.dolphin.monitoring;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Named;
import javax.management.Notification;
import javax.management.NotificationBroadcasterSupport;
import java.io.Serializable;

@Named("pointsCounter")
@ApplicationScoped
public class PointsCounter implements PointsCounterMBean, Serializable {
    private int totalPoints;
    private int hitPoints;

    private transient final NotificationBroadcasterSupport broadcaster = new NotificationBroadcasterSupport() {
        @Override
        public void sendNotification(Notification notification) {
            super.sendNotification(notification);
        }
    };

    @Override
    public int getTotalPoints() {
        return totalPoints;
    }

    @Override
    public int getHitPoints() {
        return hitPoints;
    }

    @Override
    public void notifyOutOfBounds() {
        Notification notification = new Notification(
                "point.outOfBounds",
                "com.github.dolphin:type=PointsCounter", // Используем ObjectName как источник
                System.currentTimeMillis(),
                "Вы установили точку вне области!"
        );
        broadcaster.sendNotification(notification);
    }

    @Override
    public void addPoint(boolean isHit) {
        totalPoints++;
        if (isHit) hitPoints++;
    }

    // Реализация методов NotificationBroadcaster
    @Override
    public void addNotificationListener(javax.management.NotificationListener listener,
                                        javax.management.NotificationFilter filter,
                                        Object handback) {
        broadcaster.addNotificationListener(listener, filter, handback);
    }

    @Override
    public void removeNotificationListener(javax.management.NotificationListener listener)
            throws javax.management.ListenerNotFoundException {
        broadcaster.removeNotificationListener(listener);
    }

    @Override
    public javax.management.MBeanNotificationInfo[] getNotificationInfo() {
        return new javax.management.MBeanNotificationInfo[] {
                new javax.management.MBeanNotificationInfo(
                        new String[] { "point.outOfBounds" },
                        Notification.class.getName(),
                        "Уведомление о точке вне области"
                )
        };
    }
}