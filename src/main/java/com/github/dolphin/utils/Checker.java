package com.github.dolphin.utils;

import java.math.BigDecimal;
import java.math.MathContext;

public class Checker {

    private static final MathContext MC = new MathContext(400);
    private static final BigDecimal ZERO = BigDecimal.ZERO;
    private static final BigDecimal TWO = BigDecimal.valueOf(2);

    public static boolean isHit(BigDecimal x, BigDecimal y, BigDecimal r) {
        return inSquare(x, y, r) || inTriangle(x, y, r) || inCircle(x, y, r);
    }

    public static boolean inSquare(BigDecimal x, BigDecimal y, BigDecimal r) {
        // x <= 0, y >= 0, x >= -r, y <= r/2
        return x.compareTo(ZERO) <= 0
                && y.compareTo(ZERO) >= 0
                && x.compareTo(r.negate()) >= 0
                && y.compareTo(r.divide(TWO, MC)) <= 0;
    }

    public static boolean inTriangle(BigDecimal x, BigDecimal y, BigDecimal r) {
        // x >= 0, y <= 0, x <= r, y >= -r/2, y >= (x/2 - r/2)
        BigDecimal rHalf = r.divide(TWO, MC);
        return x.compareTo(ZERO) >= 0
                && y.compareTo(ZERO) <= 0
                && x.compareTo(r) <= 0
                && y.compareTo(rHalf.negate()) >= 0
                && y.compareTo(x.divide(TWO, MC).subtract(rHalf)) >= 0;
    }

    public static boolean inCircle(BigDecimal x, BigDecimal y, BigDecimal r) {
        // x >= 0, y >= 0, x <= r, y <= r, x^2 + y^2 <= r^2
        if (x.compareTo(ZERO) < 0 || y.compareTo(ZERO) < 0) return false;
        if (x.compareTo(r) > 0 || y.compareTo(r) > 0) return false;
        BigDecimal sum = x.pow(2, MC).add(y.pow(2, MC), MC);
        BigDecimal radiusSquared = r.pow(2, MC);
        return sum.compareTo(radiusSquared) <= 0;
    }
}