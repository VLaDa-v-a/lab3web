package com.github.dolphin.utils;

import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Named;

import java.io.Serializable;
import java.util.Date;

@Named("pointBean")
@RequestScoped
public class Point implements Serializable {
    private Long id;
    private float x;
    private float y;
    private float r;
    private boolean isHit;
    private Date createdAt;
    private long executionTime;

    public Point() {}

    public Point(float x, float y, float r, boolean isHit, Date createdAt, long executionTime) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.isHit = isHit;
        this.createdAt = createdAt;
        this.executionTime = executionTime;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public float getX() { return x; }
    public void setX(float x) { this.x = x; }
    public float getY() { return y; }
    public void setY(float y) { this.y = y; }
    public float getR() { return r; }
    public void setR(float r) { this.r = r; }
    public boolean getIsHit() { return isHit; }
    public void setIsHit(boolean isHit) { this.isHit = isHit; }
    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
    public long getExecutionTime() { return executionTime; }
    public void setExecutionTime(long executionTime) { this.executionTime = executionTime; }
}
