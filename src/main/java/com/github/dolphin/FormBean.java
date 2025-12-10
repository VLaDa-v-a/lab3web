package com.github.dolphin;

import com.github.dolphin.monitoring.TimeInterval;
import com.github.dolphin.monitoring.PointsCounter;
import com.github.dolphin.utils.*;

import java.io.Serializable;
import java.util.Date;

/**
 * Managed bean for form processing.
 * Configuration: faces-config.xml (application scope)
 */
public class FormBean implements Serializable {

    // Injected via <managed-property> in faces-config.xml
    private ResultBean resultBean;
    private PointsCounter pointsCounter;
    private TimeInterval timeInterval;
    private DatabaseService databaseService;

    // Getters and Setters for managed-property injection
    public ResultBean getResultBean() {
        return resultBean;
    }

    public void setResultBean(ResultBean resultBean) {
        this.resultBean = resultBean;
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

    public DatabaseService getDatabaseService() {
        return databaseService;
    }

    public void setDatabaseService(DatabaseService databaseService) {
        this.databaseService = databaseService;
    }

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
            databaseService.updateAllPoints(point.getR());
            resultBean.reloadFromDatabase();
        }
        
        databaseService.addPoint(point);
        resultBean.addResult(point);
    }

    private boolean shouldUpdateAllPoints(float radius) {
        return !resultBean.getResults().isEmpty() && resultBean.getResults().get(0).getR() != radius;
    }
    
    public void processClean() {
        databaseService.removeAllPoints();
        resultBean.clearPoints();
    }
}
