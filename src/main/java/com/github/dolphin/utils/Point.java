package com.github.dolphin.utils;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

public class Point implements Serializable {
    private Long id;
    private BigDecimal x;
    private BigDecimal y;
    private BigDecimal r;
    private boolean isHit;
    private Date createdAt;
    private long executionTime;

    public Point() {}

    public Point(BigDecimal x, BigDecimal y, BigDecimal r, boolean isHit, Date createdAt, long executionTime) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.isHit = isHit;
        this.createdAt = createdAt;
        this.executionTime = executionTime;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public BigDecimal getX() { return x; }
    public void setX(BigDecimal x) { this.x = x; }
    public BigDecimal getY() { return y; }
    public void setY(BigDecimal y) { this.y = y; }
    public BigDecimal getR() { return r; }
    public void setR(BigDecimal r) { this.r = r; }
    public boolean getIsHit() { return isHit; }
    public void setIsHit(boolean isHit) { this.isHit = isHit; }
    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
    public long getExecutionTime() { return executionTime; }
    public void setExecutionTime(long executionTime) { this.executionTime = executionTime; }
}
