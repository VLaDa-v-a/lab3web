package com.github.dolphin;

import com.github.dolphin.utils.Checker;
import com.github.dolphin.utils.Point;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Named;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

;

@Named("resultBean")
@ApplicationScoped
public class ResultBean {

    private final List<Point> results = Collections.synchronizedList(new ArrayList<>());

    public List<Point> getResults() {
        return results;
    }

    public void addResult(Point point) {
        results.add(point);

    }

    public void updatePoints(float radius) {
        for (Point point : results) {
            point.setR(radius);
            point.setIsHit(Checker.isHit(point.getX(), point.getY(), radius));
        }
    }
    public void clearPoints() {
        results.clear();
    }
}