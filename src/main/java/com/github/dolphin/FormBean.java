package com.github.dolphin;

import com.github.dolphin.monitoring.TimeInterval;
import com.github.dolphin.monitoring.PointsCounter;
import com.github.dolphin.utils.*;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.inject.Named;

import java.util.Date;

@Named("formBean")
@ApplicationScoped
public class FormBean {
    private int miss = 0;

    @Inject
    private ResultBean resultBean;
    
    @Inject
    private PointsCounter pointsCounter;

    @Inject
    private TimeInterval timeInterval;

    public void processForm(Point point) {
        timeInterval.calculateTime();

        long startTime = System.nanoTime();
        boolean isHit = Checker.isHit(point.getX(), point.getY(), point.getR());

        if (point.getX() > point.getR() * 1.3 || point.getY() > point.getR() * 1.3) {
            pointsCounter.notifyOutOfBounds();
        }

        point.setIsHit(isHit);
        point.setCreatedAt(new Date());
        pointsCounter.addPoint(isHit);
        long endTime = System.nanoTime();
        point.setExecutionTime(endTime - startTime);
        if (shouldUpdateAllPoints(point.getR())) {
            // databaseService.updateAllPoints(point.getR());
            resultBean.updatePoints(point.getR());
        }
        // databaseService.addPoint(point);
        resultBean.addResult(point);
    }

    private boolean shouldUpdateAllPoints(float radius) {
        return !resultBean.getResults().isEmpty() && resultBean.getResults().get(0).getR() != radius;
    }    
    public void processClean() {
        // databaseService.removeAllPoints();
        resultBean.clearPoints();
    }
}