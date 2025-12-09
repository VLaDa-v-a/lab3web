package com.github.dolphin.monitoring;

import jakarta.annotation.PostConstruct;
import jakarta.ejb.Singleton;
import jakarta.ejb.Startup;
import jakarta.enterprise.inject.spi.CDI;

import javax.management.MBeanServer;
import javax.management.ObjectName;
import java.lang.management.ManagementFactory;

@Startup
@Singleton
public class MBeanInitializer {
    @PostConstruct
    public void init() {
        try {
            MBeanServer mbs = ManagementFactory.getPlatformMBeanServer();

            ObjectName pointsName = new ObjectName("com.github.dolphin:type=PointsCounter");
            PointsCounter pointsCounter = CDI.current().select(PointsCounter.class).get();
            mbs.registerMBean(pointsCounter, pointsName);

            ObjectName areaName = new ObjectName("com.github.dolphin:type=TimeInterval");
            TimeInterval areaCalculator = CDI.current().select(TimeInterval.class).get();
            mbs.registerMBean(areaCalculator, areaName);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}