package com.github.dolphin.utils;

import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Named;
import jakarta.persistence.*;

import java.io.Serializable;
import java.util.Date;

@Named("pointBean")
@RequestScoped
@Entity
@Table(name = "point") 
public class Point implements Serializable {
    @Id 
    @GeneratedValue 
    private Long id; 

    @Column(name = "x", nullable = false) 
    private float x;

    @Column(name = "y", nullable = false)
    private float y;

    @Column(name = "r", nullable = false) 
    private float r;

    @Column(name = "isHit", nullable = false) 
    private boolean isHit;

    @Column(name = "createdAt", nullable = false) 
    private Date createdAt;

    @Column(name = "executionTime", nullable = false) 
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

    public long getId() { return id; }
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
