package com.github.dolphin.utils;

public class Checker {

    public static boolean isHit(float x, float y, float r) {
        return inSquare(x, y, r) || inTriangle(x, y, r) || inCircle(x, y, r);
    }

    public static boolean inSquare(float x, float y, float r) {
        return x >= 0 && y <= 0 && x <= r && -y <= r;
    }
    public static boolean inTriangle(float x, float y, float r) {
        return x <= 0 && y >= 0 && -x <= r && y <= r && y <= r - x;
    }
    public static boolean inCircle(float x, float y, float r) {
        return x <= 0 && y <= 0 && -x <= r && -y <= r && (Math.pow(x, 2) + Math.pow(y, 2)) <= Math.pow(r, 2);
    }
}
