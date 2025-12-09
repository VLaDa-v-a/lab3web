package com.github.dolphin.utils;

public class Validator {
    public static boolean validateX(float x) {
        return x >= -5.0f && x <= 5.0f;
    }
    public static boolean validateY(float y) {
        return y >= -5.0f && y <= 5.0f;
    }
    public static boolean validateR(float r) {
        return r >= 1 && r <= 3 && (r * 2) % 10 == 0;
    }
}
