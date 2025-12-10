package com.github.dolphin;

import com.github.dolphin.monitoring.PointsCounter;
import com.github.dolphin.monitoring.TimeInterval;
import com.github.dolphin.utils.DatabaseService;
import com.github.dolphin.utils.Point;
import javax.annotation.PostConstruct;

import javax.management.MBeanServer;
import javax.management.ObjectName;
import java.io.Serializable;
import java.lang.management.ManagementFactory;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Managed bean for storing results.
 * Configuration: faces-config.xml (application scope)
 */
public class ResultBean implements Serializable {

    private final List<Point> results = Collections.synchronizedList(new ArrayList<>());

    // Injected via <managed-property> in faces-config.xml
    private DatabaseService databaseService;
    private PointsCounter pointsCounter;
    private TimeInterval timeInterval;

    // Getters and Setters for managed-property injection
    public DatabaseService getDatabaseService() {
        return databaseService;
    }

    public void setDatabaseService(DatabaseService databaseService) {
        this.databaseService = databaseService;
    }

    public PointsCounter getPointsCounter() {
        return pointsCounter;
    }

    public void setPointsCounter(PointsCounter pointsCounter) {
        this.pointsCounter = pointsCounter;
    }

    public TimeInterval getTimeInterval() {
        return timeInterval;
    }

    public void setTimeInterval(TimeInterval timeInterval) {
        this.timeInterval = timeInterval;
    }

    @PostConstruct
    public void init() {
        // Load existing points from database
        reloadFromDatabase();

        // Register MBeans for monitoring
        registerMBeans();
    }

    private void registerMBeans() {
        try {
            MBeanServer mbs = ManagementFactory.getPlatformMBeanServer();

            ObjectName pointsCounterName = new ObjectName("com.github.dolphin:type=PointsCounter");
            if (!mbs.isRegistered(pointsCounterName)) {
                mbs.registerMBean(pointsCounter, pointsCounterName);
            }

            ObjectName timeIntervalName = new ObjectName("com.github.dolphin:type=TimeInterval");
            if (!mbs.isRegistered(timeIntervalName)) {
                mbs.registerMBean(timeInterval, timeIntervalName);
            }

            System.out.println("[MBean] PointsCounter and TimeInterval registered successfully");
        } catch (Exception e) {
            System.out.println("[MBean] Error registering MBeans: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public List<Point> getResults() {
        return results;
    }

    public void addResult(Point point) {
        results.add(point);
    }

    public void reloadFromDatabase() {
        results.clear();
        results.addAll(databaseService.getAllPoints());
    }

    public void clearPoints() {
        results.clear();
    }
}
