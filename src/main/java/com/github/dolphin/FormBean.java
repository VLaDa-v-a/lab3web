package com.github.dolphin;

import com.github.dolphin.monitoring.TimeInterval;
import com.github.dolphin.monitoring.PointsCounter;
import com.github.dolphin.utils.*;

import javax.faces.context.FacesContext;
import java.io.Serializable;
import java.math.BigDecimal;
import java.math.MathContext;
import java.util.Date;
import java.util.Map;

public class FormBean implements Serializable {

    private static final MathContext MC = new MathContext(400);

    private ResultBean resultBean;
    private PointsCounter pointsCounter;
    private TimeInterval timeInterval;
    private DatabaseService databaseService;

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

        BigDecimal limit = point.getR().multiply(BigDecimal.valueOf(1.3), MC);
        if (point.getX().compareTo(limit) > 0 || point.getY().compareTo(limit) > 0) {
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

    private boolean shouldUpdateAllPoints(BigDecimal radius) {
        return !resultBean.getResults().isEmpty() && resultBean.getResults().get(0).getR().compareTo(radius) != 0;
    }
    
    public void processClean() {
        databaseService.removeAllPoints();
        resultBean.clearPoints();
    }

    public void processFormFromGraph() {
        Map<String, String> params = FacesContext.getCurrentInstance()
                .getExternalContext().getRequestParameterMap();
        
        BigDecimal x = new BigDecimal(params.get("x"), MC);
        BigDecimal y = new BigDecimal(params.get("y"), MC);
        BigDecimal r = new BigDecimal(params.get("r"), MC);
        
        Point point = new Point();
        point.setX(x);
        point.setY(y);
        point.setR(r);
        
        processForm(point);
    }
}
