package com.github.dolphin;

import com.github.dolphin.utils.DatabaseService;
import com.github.dolphin.utils.Point;
import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.inject.Named;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Named("resultBean")
@ApplicationScoped
public class ResultBean {

    private final List<Point> results = Collections.synchronizedList(new ArrayList<>());

    @Inject
    private DatabaseService databaseService;

    @PostConstruct
    public void init() {
        // Загружаем существующие точки из БД при старте
        reloadFromDatabase();
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
